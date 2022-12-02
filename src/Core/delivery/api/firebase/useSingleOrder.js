import { useState, useEffect } from 'react'
import { subscribeSingleOrder as subscribeSingleOrderAPI } from './IMSingleOrderClient'

const useSingleOrder = oldOrder => {
  const [order, setOrder] = useState(oldOrder)

  useEffect(() => {
    const unsubscribeCategories = subscribeSingleOrderAPI(
      oldOrder.id,
      onOrderUpdate,
    )
    return unsubscribeCategories
  }, [])

  const onOrderUpdate = newOrder => {
    setOrder(newOrder)
  }

  return { order }
}

export default useSingleOrder
