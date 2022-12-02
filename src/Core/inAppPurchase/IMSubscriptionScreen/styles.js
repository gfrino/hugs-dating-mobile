import { StyleSheet, Dimensions } from 'react-native'

const height = Dimensions.get('window').height
const tickContainerSize = 24
const containerPaddingHorizontal = 20

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.secondaryForegroundColor,
    },
    carouselContainer: {
      flex: 4,
      paddingHorizontal: containerPaddingHorizontal,
    },
    carouselImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carouselImage: {
      height: '70%',
      width: '70%',
    },
    inactiveDot: {
      backgroundColor: 'rgba(0,0,0,.3)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: colorSet.primaryForeground,
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    subscriptionsContainer: {
      flex: 2.5,
      alignItems: 'center',
    },
    headerTitle: {
      color: colorSet.primaryText,
      textAlign: 'center',
      fontSize: 26,
      paddingBottom: 3,
      paddingHorizontal: containerPaddingHorizontal,
    },
    titleDescription: {
      color: colorSet.secondaryText,
      textAlign: 'center',
      fontSize: 13,
      lineHeight: 18,
      paddingHorizontal: containerPaddingHorizontal - 5,
    },
    subscriptionPlansContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: containerPaddingHorizontal - 7,
    },
    subscriptionContainer: {
      flexDirection: 'row',
      flex: 0.3,
      height: 1,
      backgroundColor: "white",//colorSet.primaryBackground,
      borderRadius: Math.floor(height * 0.02),
      paddingVertical: 8,
      paddingHorizontal: 6,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    selectContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
    },
    tickIconContainer: {
      width: tickContainerSize,
      height: tickContainerSize,
      borderRadius: Math.floor(tickContainerSize / 2),
      backgroundColor: '#f4f6fa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSubscription: {
      backgroundColor: colorSet.primaryForeground,
    },
    tick: {
      width: tickContainerSize - 10,
      height: tickContainerSize - 10,
      tintColor: '#fff',
    },
    rateContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    rateText: {
      fontSize: 16,
      color: colorSet.primaryText,
    },
    monthText: {
      fontSize: 12,
      color: colorSet.primaryText,
    },
    trialOptionContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    trialContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Math.floor(height * 0.92),
      marginHorizontal: 15,
      height: '65%',
      backgroundColor: colorSet.primaryForeground,
    },
    trialText: {
      fontSize: 16,
      color: '#fff',
    },
    bottomContainer: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomHeaderTitle: {
      color: colorSet.primaryText,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
    bottomButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorSet.primaryForeground,
      width: '80%',
      height: '24%',
      borderRadius: Math.floor(height * 0.92),
      marginTop: 20,
    },
    buttonTitle: {
      fontSize: 16,
      color: '#fff',
    },
    cancelTitle: {
      fontSize: 16,
      color: colorSet.primaryForeground,
      padding: 15,
      marginBottom: 7,
    },
  })
}

export default dynamicStyles
