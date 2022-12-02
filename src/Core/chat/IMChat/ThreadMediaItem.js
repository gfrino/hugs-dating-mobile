import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Video } from 'expo-av'
import { createImageProgress } from 'react-native-image-progress'
import FastImage from 'react-native-fast-image'
import CircleSnail from 'react-native-progress/CircleSnail'
import { useTheme } from 'dopenative'
import AudioMediaThreadItem from './AudioMediaThreadItem'
import FileThreadItem from './FileThreadItem'

const Image = createImageProgress(FastImage)

const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 50 }

export default function ThreadMediaItem({
  dynamicStyles,
  videoRef,
  item,
  outBound,
  updateItemImagePath,
}) {
  const { theme } = useTheme()

  const isValidUrl = item.url.url && item.url.url.startsWith('http')
  const isValidLegacyUrl = !item.url.url && item.url.startsWith('http')
  const uri = isValidUrl || isValidLegacyUrl ? item.url.url || item.url : ''

  const [videoPaused, setVideoPaused] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const cachedImage = uri
  const cachedVideo = uri

  const isImage = item.url && item.url.mime && item.url.mime.startsWith('image')
  const isAudio = item.url && item.url.mime && item.url.mime.startsWith('audio')
  const isVideo = item.url && item.url.mime && item.url.mime.startsWith('video')
  const isFile = item.url && item.url.mime && item.url.mime.startsWith('file')
  const noTypeStated = item.url && !item.url.mime

  useEffect(() => {
    if (!videoLoading) {
      setVideoPaused(true)
    }
  }, [videoLoading])

  const onVideoLoadStart = () => {
    setVideoLoading(true)
  }

  const onVideoLoad = payload => {
    setVideoLoading(false)
  }

  if (isImage) {
    return (
      <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} />
    )
  }

  if (isAudio) {
    return <AudioMediaThreadItem outBound={outBound} item={item.url} />
  }

  if (isVideo) {
    return (
      <View>
        {videoLoading && (
          <View style={[dynamicStyles.mediaMessage, dynamicStyles.centerItem]}>
            <CircleSnail {...circleSnailProps} />
          </View>
        )}
        <Video
          ref={videoRef}
          source={{
            uri: cachedVideo,
          }}
          shouldPlay={false}
          onLoad={onVideoLoad}
          onLoadStart={onVideoLoadStart}
          resizeMode={'cover'}
          style={[
            dynamicStyles.mediaMessage,
            { display: videoLoading ? 'none' : 'flex' },
          ]}
        />
        {!videoLoading && (
          <Image
            source={theme.icons.playButton}
            style={dynamicStyles.playButton}
            resizeMode={'contain'}
          />
        )}
      </View>
    )
  }

  if (isFile) {
    return <FileThreadItem item={item.url} outBound={outBound} />
  }
  // To handle old format of an array of url stings. Before video feature
  return (
    <Image source={{ uri: cachedImage }} style={dynamicStyles.mediaMessage} />
  )
}
