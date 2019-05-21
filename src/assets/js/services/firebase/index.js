import firebaseApp from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';

if (Object.entries(firebaseConfig).length === 0 && firebaseConfig.constructor === Object) {
  throw new Error('There is no Firebase configuration object. Please enter your Firebase access into firebase ./config.js');
}

firebaseApp.initializeApp(firebaseConfig);

export const firebase = firebaseApp;
