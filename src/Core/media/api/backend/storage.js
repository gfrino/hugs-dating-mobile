import { Platform } from 'react-native'
import { ErrorCode } from '../../../onboarding/api/ErrorCode'
import { processMediaFile } from '../../mediaProcessor'

// const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
const baseAPIURL = 'http://localhost:3000/api/'

const processAndUploadMediaFileWithProgressTracking = async (
  file,
  callbackProgress,
  callbackSuccess,
  callbackError,
) => {
  processMediaFile(file, async ({ processedUri, thumbnail }) => {
    const filename = processedUri.substring(processedUri.lastIndexOf('/') + 1)

    var fd = new FormData()
    fd.append('photos', {
      name: filename,
      type: file.type,
      uri:
        Platform.OS === 'android'
          ? processedUri
          : processedUri.replace('file://', ''),
    })

    fetch(baseAPIURL + 'upload', {
      method: 'POST',
      body: fd,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(response => {
        const downloadURL =
          response.data && response.data[0] && response.data[0].url
        console.log('File available at ', downloadURL)
        callbackSuccess(downloadURL)
      })
      .catch(error => {
        console.error(error)
        callbackError(error)
      })
  })
}

const processAndUploadMediaFile = file => {
  return new Promise((resolve, _reject) => {
    processMediaFile(file, async ({ processedUri, thumbnail }) => {
      console.log('processedUri ==', processedUri)

      const filename = processedUri.substring(processedUri.lastIndexOf('/') + 1)
      var fd = new FormData()
      fd.append('photos', {
        name: filename,
        type: file.type,
        uri:
          Platform.OS === 'android'
            ? processedUri
            : processedUri.replace('file://', ''),
      })

      fetch(baseAPIURL + 'upload', {
        method: 'POST',
        body: fd,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(response => {
          const downloadURL =
            response.data && response.data[0] && response.data[0].url
          console.log('File available at ', downloadURL)
          resolve({ downloadURL: downloadURL })
        })
        .catch(error => {
          resolve({ error: ErrorCode.photoUploadFailed })
          console.error(error)
        })
    })
  })
}

const storageAPI = {
  processAndUploadMediaFile,
  processAndUploadMediaFileWithProgressTracking,
}

export default storageAPI
