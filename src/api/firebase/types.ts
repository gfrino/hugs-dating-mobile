export enum SwipeType {
  like = 'like',
  dislike = 'dislike',
}

export interface ISwipeCountDoc {
  authorID: string
  count: number
  createdAt: number
}

export interface IUserSwipe {
  authorID: string
  swipedProfileID: string
  type: SwipeType
}
