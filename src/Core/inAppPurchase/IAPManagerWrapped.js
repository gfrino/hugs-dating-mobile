import React, { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
  validateReceiptIos,
  getAvailablePurchases,
} from 'react-native-iap'
import { updateUserSubscription, getUserSubscription } from './firebase'
import { updateUser } from '../users'
import IMSubscriptionScreen from './IMSubscriptionScreen/IMSubscriptionScreen'
import { setIsPlanActive } from './redux'
import { IAPContext } from './context'
import { useIAPConfig } from './hooks/useIAPConfig'
import { useCurrentUser } from '../onboarding'

const receiptValidationStatus = {
  SUCCESS: 0,
  COULT_NOT_AUTHENTICATE: 21003,
  EXPIRED_SUBSCRIPTION: 21006,
  COULD_NOT_AUTHORIZE: 21010,
}

const day = 60 * 60 * 24 * 1000
const week = day * 7
const month = week * 4
const year = month * 12

const IOS_PERIODS_IN_SEC = {
  day,
  week,
  month,
  year,
}

const ANDROID_PERIODS_IN_SEC = {
  d: day,
  w: week,
  m: month,
  y: year,
}

const IAPManagerWrapped = props => {
  const currentUser = useCurrentUser()
  const planId = useSelector(state => state.inAppPurchase.planId)
  const isPlanActive = useSelector(state => state.inAppPurchase.isPlanActive)
  const dispatch = useDispatch()

  const { config } = useIAPConfig()

  const [processing, setProcessing] = useState(false)
  const [subscriptionVisible, setSubscriptionVisible] = useState(false)
  const [subscription, setSubscription] = useState(null)

  const user = useRef(null)
  const planPeriod = useRef('')
  const lastValidatedEmail = useRef('')
  const lastValidatedPhone = useRef('')

  let purchaseUpdateSubscription = null
  let purchaseErrorSubscription = null

  useEffect(() => {
    console.log("subscription........" , subscription);
    if (subscription) {
      handleUserSubscription(subscription)
      setPlanFromDevice()
    }
  }, [subscription])

  useEffect(() => {
    const hasNotValidatedUser =
      lastValidatedEmail.current !== currentUser.email ||
      lastValidatedPhone.current !== currentUser.phone
    const isUserNotEmpty = Object.keys(currentUser).length !== 0

    if (hasNotValidatedUser && isUserNotEmpty) {
      lastValidatedEmail.current = currentUser.email
      lastValidatedPhone.current = currentUser.phone
      user.current = currentUser
      loadSubscription()
    }
  }, [currentUser?.id])

  const loadSubscription = async () => {
    const userID = currentUser.id || currentUser.userID

    const { subscription } = await getUserSubscription(userID)

    setSubscription(subscription)
  }

  const getSubscriptionPeriodDifference = transactionDate => {
    let now = +new Date()

    return now - transactionDate
  }

  const getAndroidComparePeriod = subscriptionPeriod => {
    const keySubscriptionPeriods = subscriptionPeriod.split('')
    const times = keySubscriptionPeriods[1]
    const period = keySubscriptionPeriods[2]

    if (times && period) {
      return ANDROID_PERIODS_IN_SEC[period] * times
    }
  }

  const handleUserSubscription = subscription => {
    const { transactionDate, subscriptionPeriod, receipt } = subscription
    let periodToCompare

    if (subscriptionPeriod && subscriptionPeriod.startsWith('p')) {
      periodToCompare = getAndroidComparePeriod(subscriptionPeriod)
    }

    if (Platform.OS === 'ios') {
      validateIOSPlan(receipt)

      return
    }

    if (periodToCompare) {
      const periodDifference = getSubscriptionPeriodDifference(transactionDate)
      const hasNotExpired = periodDifference < periodToCompare

      if (hasNotExpired && transactionDate) {
        dispatch(setIsPlanActive(true))
      }
    }
  }

  useEffect(() => {
    setPlanFromDevice()
  }, [])

  const setPlanFromDevice = () => {
    if (Platform.OS !== 'ios') {
      setAndroidPlanFromDevice()
    }
  }

  const setAndroidPlanFromDevice = async () => {
    const userID = user.current?.id || user.current?.userID
    const isPlanValid = await getDeviceAndroidPlans()

    if (userID) {
      updateUser(userID, { isVIP: isPlanValid })
      updateUserSubscription(userID, { active: isPlanValid })
    }
  }

  const validateIOSPlan = async transactionReceipt => {
    const userID = user.current?.id || user.current?.userID

    if (!userID) {
      return
    }
    const { status, latest_receipt, pending_renewal_info } =
      await validateIOSReceipt(transactionReceipt)
    const updatedReceipt = { receipt: latest_receipt, active: true }

    const validationSuccess = status === receiptValidationStatus.SUCCESS
    const isPendingRenewal =
      pending_renewal_info?.length > 0 &&
      pending_renewal_info[0].expiration_intent

    // if (!validationSuccess || isPendingRenewal) {
    if (!validationSuccess && isPendingRenewal) {

      updateUser(userID, { isVIP: false })
      updateUserSubscription(userID, { active: false })

      dispatch(setIsPlanActive(false))
      return
    }

    dispatch(setIsPlanActive(true))
    updateUserSubscription(userID, updatedReceipt)
    updateUser(userID, { isVIP: true })
  }

  const getDeviceAndroidPlans = async () => {
    const availablePurchases = await getAvailablePurchases()

    for (let i = 0; i < availablePurchases.length; i++) {
      if (config.IAP_SKUS.includes(availablePurchases[i].productId)) {
        return true
      }
    }

    return false
  }

  const validateIOSReceipt = async receipt => {
    const isTestEnvironment = __DEV__

    const receiptBody = {
      'receipt-data': receipt,
      password: config.IAP_SHARED_SECRET,
    }

    try {
      const validatedReceipt = await validateReceiptIos(
        receiptBody,
        isTestEnvironment,
      )

      return validatedReceipt
    } catch (error) {
      console.log('ERROR [validateIOSReceipt]', error)

      return {}
    }
  }

  const updateSubscriptionDetail = async purchase => {
    const {
      productId,
      transactionReceipt: receipt,
      purchaseToken,
      transactionDate,
      originalTransactionIdentifierIOS,
    } = purchase

    const userID = user.current?.id || user.current?.userID
    const subscriptionPlan = {
      receipt,
      productId,
      purchaseToken: purchaseToken || '',
      subscriptionPeriod: planPeriod.current,
      transactionDate,
      originalTransactionIdentifierIOS: originalTransactionIdentifierIOS || '',
      userID,
    }

    if (userID) {
      setSubscription(subscriptionPlan)
      await updateUserSubscription(userID, subscriptionPlan)
    }
  }

  const processNewPurchase = async purchase => {
    const { transactionReceipt } = purchase

    if (transactionReceipt !== undefined) {
      await updateSubscriptionDetail(purchase)
      onSubscriptionClose()
      setProcessing(false)
    }
  }

  useEffect(() => {
    purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
      const receipt = purchase.transactionReceipt

      if (receipt) {
        try {
          await finishTransaction(purchase)
          await processNewPurchase(purchase)
        } catch (error) {
          console.log('ERROR [useEffect IAPManagerWrapped]', error)
        }
      }
    })
    purchaseErrorSubscription = purchaseErrorListener(error => {
      alert(error.message)
    })

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove()
        purchaseUpdateSubscription = null
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove()
        purchaseErrorSubscription = null
      }
    }
  }, [])

  const onSetSubscriptionPeriod = period => {
    planPeriod.current = period
  }

  const onSubscriptionClose = () => {
    setSubscriptionVisible(false)
  }

  return (
    <IAPContext.Provider
      value={{
        processing: processing,
        setProcessing: setProcessing,
        subscriptionVisible: subscriptionVisible,
        setSubscriptionVisible: setSubscriptionVisible,
        activePlan: planId,
      }}>
      {props.children}
      <IMSubscriptionScreen
        processing={processing}
        setProcessing={setProcessing}
        onClose={onSubscriptionClose}
        visible={subscriptionVisible}
        onSetSubscriptionPeriod={onSetSubscriptionPeriod}
      />
    </IAPContext.Provider>
  )
}

export default IAPManagerWrapped
