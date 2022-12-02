// Uncomment these if you want to remove firebase and add your own custom backend:
// import PaymentAPIManager from './local/paymentMethods';
// export { PaymentAPIManager };

// Uncomment these if you want to remove firebase and add your own custom backend:
// import PaymentAPIManager from './backend/paymentMethods';
// export { PaymentAPIManager };

// Remove these lines if you want to remove firebase and add your own custom backend:
import PaymentAPIManager from './firebase/paymentMethods'
export { PaymentAPIManager }
