export const addPost = async (postData, author) => {}

export const deletePost = async (postID, authorID) => {}

export const addStory = async (storyData, author) => {}

export const subscribeToHomeFeedPosts = (userID, callback) => {}

export const listHomeFeedPosts = async (userID, page = 0, size = 1000) => {}

export const subscribeToStories = (userID, callback) => {}

export const listStories = async (userID, page = 0, size = 1000) => {}

export const addReaction = async (postID, authorID, reaction) => {}

export const addComment = async (commentText, postID, authorID) => {}

export const subscribeToComments = (postID, callback) => {}

export const listComments = async (postID, page = 0, size = 1000) => {}

export const subscribeToSinglePost = (postID, callback) => {}

export const listDiscoverFeedPosts = async (userID, page = 0, size = 1000) => {}

export const subscribeToHashtagFeedPosts = (hashtag, callback) => {}

export const listHashtagFeedPosts = async (hashtag, page = 0, size = 1000) => {}

export const subscribeToProfileFeedPosts = (userID, callback) => {}

export const listProfileFeed = async (userID, page = 0, size = 1000) => {}

export const fetchProfile = async (profileID, viewerID) => {}

export const getPost = async postId => {}
