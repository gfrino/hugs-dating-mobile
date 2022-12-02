import { Platform } from 'react-native'
import * as _ from 'lodash'
import * as FileSystem from 'expo-file-system'
// FFMPEG_FLAG_ENABLED_BEGIN
import { createThumbnail } from 'react-native-create-thumbnail'
import { RNFFmpeg } from 'react-native-ffmpeg'
// FFMPEG_FLAG_ENABLED_END
import ImageResizer from 'react-native-image-resizer'
import uuidv4 from 'uuidv4'

const BASE_DIR = `${FileSystem.cacheDirectory}expo-cache/`

// Checks if given directory exists. If not, creates it
async function ensureDirExists(givenDir) {
  const dirInfo = await FileSystem.getInfoAsync(givenDir)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(givenDir, { intermediates: true })
  }
}

export const downloadFile = async (file, fileName) => {
  try {
    await ensureDirExists(BASE_DIR)
    const fileUri = `${BASE_DIR}${fileName}`
    const info = await FileSystem.getInfoAsync(fileUri)
    const { exists, uri } = info

    if (exists) {
      return { uri }
    }

    const downloadResumable = FileSystem.createDownloadResumable(file, fileUri)

    return downloadResumable.downloadAsync()
  } catch (error) {
    return { uri: null }
  }
}

// FFMPEG_FLAG_ENABLED_BEGIN
const compressVideo = async sourceUri => {
  FileSystem.getInfoAsync(sourceUri).then(fileInfo => {
    console.log(
      'compressing video of initial size ' +
        fileInfo.size / (1024 * 1024) +
        'M',
    )
    console.log(sourceUri)
  })

  await ensureDirExists(BASE_DIR)

  // On iOS, videos are already compressed, so we just return the original
  if (Platform.OS === 'ios') {
    return new Promise(resolve => {
      console.log("no compression needed, as it's iOS")
      resolve(sourceUri)
    })
  }

  const processedUri = `${BASE_DIR}${uuidv4()}.mp4`
  return new Promise(resolve => {
    RNFFmpeg.execute(`-i ${sourceUri} -c:v mpeg4 ${processedUri}`).then(
      result => {
        FileSystem.getInfoAsync(processedUri).then(fileInfo => {
          console.log(
            'compressed video to size ' + fileInfo.size / (1024 * 1024) + 'M',
          )
          console.log(processedUri)
        })

        resolve(processedUri)
      },
    )
  })
}

const createThumbnailFromVideo = videoUri => {
  let processedUri = videoUri
  if (Platform.OS === 'android' && !processedUri.includes('file:///')) {
    processedUri = `file://${processedUri}`
  }
  console.log('createThumbnailFromVideo processedUri ' + processedUri)
  return new Promise(resolve => {
    createThumbnail({ url: processedUri })
      .then(newThumbnailSource => {
        resolve(newThumbnailSource.path)
      })
      .catch(error => {
        console.log(error)
        resolve(null)
      })
  })
}

// FFMPEG_FLAG_ENABLED_END

const resizeImage = async (
  {
    image,
    newWidth = 1100,
    newHeight = 1100,
    compressFormat = 'JPEG',
    quality = 100,
  },
  callback,
) => {
  const imagePath = image?.path || image?.uri

  if (image?.height < newHeight) {
    callback(imagePath)
    return
  }

  ImageResizer.createResizedImage(
    imagePath,
    newWidth,
    newHeight,
    compressFormat,
    quality,
  )
    .then(newSource => {
      if (newSource) {
        callback(newSource.uri)
      }
    })
    .catch(err => {
      callback(imagePath)
    })
}

/**
 * This function takes a media file object as the first argument and callback function as the second argument.
 * The media file object can either be a photo object or a video object.
 * If the media file is a photo object, this function resizes the photo and calls the callback function with an object of a processed uri.
 * If the media file is a video object, this function compresses the video file and creates a thumbnail from the compressed file. Then
 * calls the callback function with an object of a processed uri and thumbnail uri.
 * @param {object} file
 * @param {function} callback
 */
export const processMediaFile = (file, callback) => {
  const { mime, type, uri, path } = file
  const fileSource = uri || path

  // FFMPEG_FLAG_ENABLED_BEGIN
  const includesVideo = mime?.includes('video') || type?.includes('video')
  if (includesVideo) {
    compressVideo(fileSource).then(processedUri => {
      createThumbnailFromVideo(processedUri).then(thumbnail => {
        callback({ thumbnail, processedUri })
      })
    })
    return
  }
  // FFMPEG_FLAG_ENABLED_END

  const includesImage = mime?.includes('image') || type?.includes('image')
  if (includesImage) {
    resizeImage({ image: file }, processedUri => {
      callback({ processedUri })
    })
    return
  }
  callback({ processedUri: fileSource })
}

// FFMPEG_FLAG_ENABLED_BEGIN
export const blendVideoWithAudio = async (
  { videoStream, audioStream, videoRate },
  callback,
) => {
  await ensureDirExists(BASE_DIR)
  const processedUri = `${BASE_DIR}${uuidv4()}.mp4`
  let command = `-i ${videoStream} -i ${audioStream} -shortest ${processedUri}`

  if (videoRate) {
    command = `-i ${videoStream} -i ${audioStream} -filter:v "setpts=PTS/${videoRate}" -shortest ${processedUri}`
  }

  RNFFmpeg.execute(command).then(result => {
    callback(processedUri)
  })
}
// FFMPEG_FLAG_ENABLED_END
