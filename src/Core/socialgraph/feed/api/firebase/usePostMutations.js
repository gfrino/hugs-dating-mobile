import {
  addPost as addPostAPI,
  deletePost as deletePostAPI,
} from './firebaseFeedClient'
import { storageAPI } from '../../../../media'

export const usePostMutations = () => {
  const addPost = async (postData, localMediaFiles, author) => {
    if (postData && localMediaFiles?.length === 0) {
      // If we have a post with no media, add it directly into the database
      return await addPostAPI(postData, author)
    }

    // If we have a post with media, we first upload all the media to the storage server and then add the post into the database
    const postMedia = await remoteMediaAfterUploadingAllFiles(localMediaFiles)
    return await addPostAPI({ ...postData, postMedia }, author)
  }

  const deletePost = async (postID, authorID) => {
    return await deletePostAPI(postID, authorID)
  }

  const remoteMediaAfterUploadingAllFiles = async localMediaFiles => {
    const promises = localMediaFiles?.map(async media => {
      const { mime } = media
      try {
        const response = await storageAPI.processAndUploadMediaFile(media)
        return {
          url: response.downloadURL,
          thumbnailURL: response.thumbnailURL ?? response.downloadURL,
          mime,
        }
      } catch (error) {
        console.log('error uploading media', error)
        return null
      }
    })

    return await Promise.all(promises)
  }

  return {
    addPost,
    deletePost,
  }
}
