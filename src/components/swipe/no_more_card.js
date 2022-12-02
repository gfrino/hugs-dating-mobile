import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { useTranslations } from 'dopenative'
import FastImage from 'react-native-fast-image'
import { size } from '../../helpers/devices'
import { profilePictureBorder  } from '../../helpers/statics'

const NoMoreCard = ({ user, isFromRooms = false }) => {
  const { localized } = useTranslations()
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
      {user.profilePictureURL ? (
        <FastImage
          source={{ uri: user.profilePictureURL }}
          style={[styles.user_pic_style, profilePictureBorder[user?.settings?.gender || "default"]]}
        />
      ) : null}

      {canComputeRecommendations ? (
        <Text style={styles.empty_state_text_style}>
          {localized("There's no one new around you.")}
        </Text>
      ) : (
        <View style={{ width: '75%', alignItems: 'center' }}>
          <Text style={[styles.empty_state_text_style]}>
            {localized(
              isFromRooms ? 'There is no one near you with the same interests, try another one!' : 'Please complete your dating profile to view recommendations.',
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
