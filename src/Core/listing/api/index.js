// Uncomment these if you want to remove firebase and add your own custom backend:
// import * as listingsAPI from './local/listing';
// import * as reviewAPI from './local/review';
// import * as filterAPI from './local/filter';
// export { listingsAPI, reviewAPI, filterAPI };

// Remove these lines if you want to remove firebase and add your own custom backend:

// import * as listingsAPI from './firebase/listing';
// import * as reviewAPI from './firebase/review';
// import * as filterAPI from './firebase/filter';
// export { listingsAPI, reviewAPI, filterAPI };

export { default as listingsAPI } from './firebase/listing';
export { default as reviewAPI } from './firebase/review';
export { default as filterAPI } from './firebase/filter';
