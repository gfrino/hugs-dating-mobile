import React, { useState } from 'react'
import { Modal, Image, Text, TouchableOpacity } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import { useTheme, useTranslations } from 'dopenative'
import { TNActivityIndicator } from '../../truly-native'
import { downloadFile } from '../../media/mediaProcessor'
import dynamicStyles from './styles'

const FileThreadItem = ({ item, outBound }) => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance, outBound)

  const [isLoading, setIsLoading] = useState(false)

  const onOpenFile = async () => {
    if (!item.url) {
      return
    }

    try {
      setIsLoading(true)
      const { uri } = await downloadFile(item.url, item.fileID)
      setIsLoading(false)
      if (uri) {
        FileViewer.open(uri)
      }
    } catch (e) {
      console.error(e)
      setIsLoading(false)
    }
  }

  return (
    <TouchableOpacity onPress={onOpenFile} style={styles.bodyContainer}>
      <Image
        style={styles.icon}
        source={require('../assets/new-document.png')}
      />

      <Text numberOfLines={1} style={styles.title}>
        {item.name ?? localized('File')}
      </Text>
      <Modal visible={isLoading} animationType={'fade'}>
        <TNActivityIndicator />
      </Modal>
    </TouchableOpacity>
  )
}

export default FileThreadItem
