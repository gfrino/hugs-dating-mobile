import { addStory as addStoryAPI } from './firebaseFeedClient'
import { storageAPI } from '../../../../media'

export const useStoryMutations = () => {
  const addStory = async (file, author) => {
    if (file) {
      const { mime } = file

      const response = await storageAPI.processAndUploadMediaFile(file)
      console.log(response)
      if (response.downloadURL) {
        const story = {
          authorID: author.id,
          storyType: mime,
          storyMediaURL: response.downloadURL,
        }
        const res = await addStoryAPI(story, author)
        return res
      }

      return null
    }
  }

  return {
    addStory,
  }
}
