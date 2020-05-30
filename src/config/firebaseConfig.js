import firebase from 'firebase';
// firebase
var superiorConfig = {
  apiKey: 'AIzaSyDalwvzU96EDOUC5eBC91rNEVw_BuooGsg',
  authDomain: 'superior-6be2f.firebaseapp.com',
  databaseURL: 'https://superior-6be2f.firebaseio.com',
  projectId: 'superior-6be2f',
  storageBucket: 'superior-6be2f.appspot.com',
  messagingSenderId: '271709208420',
  appId: '1:271709208420:web:dd51236022e7b83b360471',
  measurementId: 'G-HY6C29JEK6',
};
var app1 = firebase.initializeApp(superiorConfig);
// var app2 = firebase.initializeApp(configTvbox, 'app2');

var firebaseSuperior = firebase.database();
// Get a database instance for app2
// var firebaseTvbox = firebase.database(app2);

export {firebaseSuperior};
