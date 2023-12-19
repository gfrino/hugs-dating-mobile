import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { useTranslations } from 'dopenative'
import FastImage from 'react-native-fast-image'
import { size } from '../../helpers/devices'
import { profilePictureBorder  } from '../../helpers/statics'
import dynamicStyles from '../../Core/chat/IMConversationView/IMConversationIconView/styles'
import { useTheme } from 'dopenative'

const NoMoreCard = ({ user, isFromRooms = false }) => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styleProfile = dynamicStyles(theme, appearance)
  const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/cactus-undefined.png?alt=media&token=2745ab3f-c9ef-40de-8f7b-f59154a234b5'

  const canComputeRecommendations = React.useMemo(() => {
    const { firstName, email, phone, profilePictureURL } = user
    return (
      firstName && firstName.length > 0 && (email || phone) && profilePictureURL
      // &&
      // profilePictureURL != defaultAvatar // Uncomment this line if you don't want users with no avatar show up in the recommendations
    )
  }, [user])

  return (
    <View style={styles.container}>
    
      {/* {user.profilePictureURL && ( */}
      <View style={styleProfile.swipeScreenMAin} >
        
        <FastImage
              // style={[styleProfile.swipeScreenItemIcon , { borderColor: user.userCategory === 'no_disabilities' ? 'skyblue' : 'yellow' }]}
              // onError={onImageError}
              style={[styleProfile.swipeScreenItemIcon, { borderColor: user.userCategory === 'no_disabilities' ? 'skyblue' : 'yellow' }]}
  
              source={user.profilePictureURL ? { uri: user.profilePictureURL } : { uri: defaultAvatar }}
            />
            {user.isOnline && <View style={styleProfile.SwipeScreenOnlineMark} />}
          </View>
      
      {/* )} */}

      {canComputeRecommendations ? (
        <Text style={styles.empty_state_text_style}>
          {localized("There's no one new around you.")}
        </Text>
      ) : (
        <View style={{ width: '75%', alignItems: 'center' }}>
          <Text style={[styles.empty_state_text_style , { marginTop: 10 }]}>
            {localized(
              isFromRooms ? 'There is no one near you with the same interests, try another one!' : 'Please complete your dating profile to view recommendations',
            )}
          </Text>
        </View>
      )}
    </View>
  )
}

NoMoreCard.propTypes = {
  isProfileComplete: PropTypes.bool,
  profilePictureURL: PropTypes.string,
  url: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_pic_style: {
    width: size(90),
    height: size(90),
    borderRadius: size(45),
    marginBottom: size(15),
  },
  empty_state_text_style: {
    fontSize: size(14),
    color: '#777777',
    textAlign: 'center',
  },
})

export default NoMoreCard
