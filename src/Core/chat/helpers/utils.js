const formatMessage = (message, localized) => {
  const mime = message?.url?.mime || message?.mime
  if (mime) {
    if (mime.startsWith('video')) {
      return localized('Someone sent a video.')
    } else if (mime.startsWith('audio')) {
      return localized('Someone sent an audio.')
    } else if (mime.startsWith('image')) {
      return localized('Someone sent a photo.')
    } else if (mime.startsWith('file')) {
      return localized('Someone sent a file.')
    }
  }
  if (message?.content && message.content.length > 0) {
    return message?.content
  } else if (message && message.length > 0) {
    return message
  } else if (message) {
    return JSON.stringify(message)
  }
  return ''
}

export { formatMessage }
