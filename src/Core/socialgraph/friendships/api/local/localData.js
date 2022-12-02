export const mockFriend1 = {
  appIdentifier: 'rn-dating-android',
  badgeCount: 9,
  createdAt: 'February 28, 2020 at 11:00:02 PM UTC+1',
  created_at: 'February 28, 2020 at 11:00:02 PM UTC+1',
  email: 'janedoe@gmail.com',
  firstName: 'Ali',
  id: 'advvwdv2v2v22v1',
  inboundFriendsCount: 1,
  isOnline: true,
  lastName: 'Mo',
  lastOnlineTimestamp: 'February 28, 2020 at 11:00:02 PM UTC+1',
  location: {
    latitude: 37.421998333333335,
    longitude: -122.08400000000002,
  },
  outboundFriendsCount: 1,
  phone: '',
  position: {
    latitude: 6.5825046,
    longitude: 3.398943,
  },
  profilePictureURL:
    'https://media4.popsugar-assets.com/files/2015/03/18/748/n/1922398/960e8117_2015_0223_Popsugar_Fitness_0384.jpg_.xxxlarge_2x.jpg',
  pushKitToken: '',
  pushToken:
    'e9TCmaB9lSI:APA91bH3DONtE1-MBHThyhwV66FYbEoYe3OhuGCg-XFGTJ8y4LatWHXqv9rW2Qo4PIGGKPx3GBMSAHG2QphYlo82inhYmEZG9cxdNIArnHxtwNeJjrl-Ie9krpvhGy4zKl4yIds8pi-t',
  settings: {
    push_new_matches_enabled: false,
  },
  signUpLocation: {
    latitude: 6.5825046,
    longitude: 3.398943,
  },
  userID: 'advvwdv2v2v22v1',
}

const mockFriend2 = {
  ...mockFriend1,
  id: 'advvwdv2v2v22v1qaa',
  userID: 'advvwdv2v2v22v1qaa',
  email: 'deletom@gmail.com',
  firstName: 'Dele',
  profilePictureURL:
    'https://static2.thethingsimages.com/wordpress/wp-content/uploads/2020/05/15-Sickest-Concept-Cars-In-2020-1.jpg',
  isOnline: false,
}

const mockFriend3 = {
  ...mockFriend1,
  email: 'sadrex@gmail.com',
  firstName: 'Sad',
  id: 'advvwdv2v2v22v1qaa1',

  lastName: 'Rex',

  profilePictureURL:
    'http://2.bp.blogspot.com/-qRbQOVe3Y1o/UAWBHxJKSBI/AAAAAAAAKNY/fqFSYEtaTss/s1920/yellow-sports-car-wallpaper.jpg',
  isOnline: false,
  userID: 'advvwdv2v2v22v1qaa1',
}

const mockFriend4 = {
  ...mockFriend1,
  email: 'daniel@gmail.com',
  firstName: 'Daniel',
  id: 'advvwdv2v2v22v1qaa11',
  lastName: 'Rex',
  profilePictureURL:
    'https://101clipart.com/wp-content/uploads/08/Children%20Walking%20Clipart%2012.jpg',
  userID: 'advvwdv2v2v22v1qaa1',
}

const mockFriend5 = {
  ...mockFriend1,
  email: 'paul@gmail.com',
  firstName: 'Paul',
  id: 'advvwdv2v2v22v1qa3a11',
  lastName: 'Rex',
  profilePictureURL:
    'https://image.shutterstock.com/image-photo/image-450w-425716696.jpg',
  userID: 'advvwdv2v2v22v1qaa1',
}

export const mockFriends = [
  mockFriend1,
  mockFriend2,
  mockFriend3,
  mockFriend4,
  mockFriend5,
]

export const mockFriendships = [
  { type: 'reciprocal', user: mockFriend1 },
  { type: 'reciprocal', user: mockFriend2 },
  { type: 'reciprocal', user: mockFriend3 },
  { type: 'reciprocal', user: mockFriend4 },
  { type: 'reciprocal', user: mockFriend5 },
]
