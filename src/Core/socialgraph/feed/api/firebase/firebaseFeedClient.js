import { firebase } from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'

export const postsRef = firebase.firestore().collection('posts')

export const addPost = async (postData, author) => {
  const instance = functions().httpsCallable('addPost')
  try {
    const res = await instance({
      authorID: author?.id,
      postData: postData,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const deletePost = async (postID, authorID) => {
  const instance = functions().httpsCallable('deletePost')
  try {
    const res = await instance({
      authorID,
      postID,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const addStory = async (storyData, author) => {
  const instance = functions().httpsCallable('addStory')
  try {
    const res = await instance({
      authorID: author?.id,
      storyData: storyData,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToHomeFeedPosts = (userID, callback) => {
  return firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('home_feed_live')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      querySnapshot => {
        callback && callback(querySnapshot?.docs?.map(doc => doc.data()))
      },
      error => {
        console.log(error)
        callback([])
      },
    )
}

export const listHomeFeedPosts = async (userID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listHomeFeedPosts')
  try {
    const res = await instance({
      userID,
      page,
      size,
    })

    return res?.data?.posts
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToStories = (userID, callback) => {
  return firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('stories_feed_live')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      querySnapshot => {
        callback && callback(querySnapshot?.docs?.map(doc => doc.data()))
      },
      error => {
        console.log(error)
        callback([])
      },
    )
}

export const listStories = async (userID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listStories')
  try {
    const res = await instance({
      userID,
      page,
      size,
    })

    return res?.data?.stories
  } catch (error) {
    console.log(error)
    return null
  }
}

export const addReaction = async (postID, authorID, reaction) => {
  const instance = functions().httpsCallable('addReaction')
  try {
    const res = await instance({
      authorID,
      postID,
      reaction,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const addComment = async (commentText, postID, authorID) => {
  const instance = functions().httpsCallable('addComment')
  try {
    const res = await instance({
      authorID,
      commentText,
      postID,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToComments = (postID, callback) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(postID)
    .collection('comments_live')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      querySnapshot => {
        callback && callback(querySnapshot?.docs?.map(doc => doc.data()))
      },
      error => {
        console.log(error)
        callback([])
      },
    )
}

export const listComments = async (postID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listComments')
  try {
    const res = await instance({
      postID,
      page,
      size,
    })

    return res?.data?.comments
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToSinglePost = (postID, callback) => {
  return firebase
    .firestore()
    .collection('posts')
    .doc(postID)
    .onSnapshot(
      { includeMetadataChanges: true },
      doc => {
        if (doc?.exists) {
          callback && callback(doc.data())
        }
      },
      error => {
        console.log(error)
      },
    )
}

export const listDiscoverFeedPosts = async (userID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listDiscoverFeedPosts')
  try {
    const res = await instance({
      userID,
      page,
      size,
    })

    return res?.data?.posts
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToHashtagFeedPosts = (hashtag, callback) => {
  return firebase
    .firestore()
    .collection('hashtags')
    .doc(hashtag)
    .collection('feed_live')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      querySnapshot => {
        callback && callback(querySnapshot?.docs?.map(doc => doc.data()))
      },
      error => {
        console.log(error)
        callback([])
      },
    )
}

export const listHashtagFeedPosts = async (hashtag, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listHashtagFeedPosts')
  try {
    const res = await instance({
      hashtag,
      page,
      size,
    })

    return res?.data?.posts
  } catch (error) {
    console.log(error)
    return null
  }
}

export const subscribeToProfileFeedPosts = (userID, callback) => {
  return firebase
    .firestore()
    .collection('social_feeds')
    .doc(userID)
    .collection('profile_feed_live')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      { includeMetadataChanges: true },
      querySnapshot => {
        callback && callback(querySnapshot?.docs?.map(doc => doc.data()))
      },
      error => {
        console.log(error)
        callback([])
      },
    )
}

export const listProfileFeed = async (userID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('listProfileFeedPosts')
  try {
    const res = await instance({
      userID,
      page,
      size,
    })

    return res?.data?.posts
  } catch (error) {
    console.log(error)
    return null
  }
}

export const fetchProfile = async (profileID, viewerID) => {
  const instance = functions().httpsCallable('fetchProfile')
  try {
    const res = await instance({
      profileID,
      viewerID,
    })

    return res?.data?.profileData
  } catch (error) {
    console.log(error)
    return null
  }
}

export const hydrateFeedForNewFriendship = async (destUserID, sourceUserID) => {
  // we take all posts & stories from sourceUserID and populate the feed & stories of destUserID
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed')

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', sourceUserID)
    .onSnapshot(
      querySnapshot => {
        querySnapshot?.forEach(doc => {
          const post = doc.data()
          if (post.id) {
            mainFeedDestRef.doc(post.id).set(post)
          }
        })
        unsubscribeToSourcePosts()
      },
      error => {
        console.log(error)
      },
    )
}

export const removeFeedForOldFriendship = async (destUserID, oldFriendID) => {
  // We remove all posts authored by oldFriendID from destUserID's feed
  const mainFeedDestRef = firebase
    .firestore()
    .collection('social_feeds')
    .doc(destUserID)
    .collection('main_feed')

  const unsubscribeToSourcePosts = postsRef
    .where('authorID', '==', oldFriendID)
    .onSnapshot(
      querySnapshot => {
        querySnapshot?.forEach(doc => {
          const post = doc.data()
          if (post.id) {
            mainFeedDestRef.doc(post.id).delete()
          }
        })
        unsubscribeToSourcePosts()
      },
      error => {
        console.log(error)
      },
    )
}

export const getPost = async postId => {
  try {
    const post = await postsRef.doc(postId).get()
    return { data: { ...post.data(), id: post.id }, success: true }
  } catch (error) {
    console.log(error)
    return {
      error: 'Oops! an error occurred. Please try again',
      success: false,
    }
  }
}
