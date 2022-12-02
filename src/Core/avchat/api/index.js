// Uncomment these if you want to remove firebase and add your own custom backend:
// import AVAPIManager from './local/avAPIManager';
// import AVTracker from './local/avTracker';
// export { AVAPIManager, AVTracker };

// Uncomment these if you want to remove firebase and add our own node js backend:
// import AVAPIManager from './backend/avAPIManager';
// import AVTracker from './backend/avTracker';
// export { AVAPIManager, AVTracker };

// Remove these lines if you want to remove firebase and use a different backend:
import AVAPIManager from './firebase/avAPIManager'
import AVTracker from './firebase/avTracker'
export { AVAPIManager, AVTracker }
