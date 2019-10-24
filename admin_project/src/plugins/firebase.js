import Vue from 'vue'
import * as firebase from "firebase/app"
import firebaseConfig  from '../../firebaseConfig'
import router from '../router'

import "firebase/analytics"
import "firebase/firestore"
import "firebase/auth"


firebase.initializeApp(firebaseConfig)

Vue.prototype.$firebase = firebase
Vue.prototype.$isFirebaseAuth = false

firebase.auth().onAuthStateChanged(function(user) {
	Vue.prototype.$isFirebaseAuth = true
	
  if (user) {
		// 로그인 된 경우
		console.log('Firebase signed in')
		router.push('/data').catch(err => { err })

  } else {
		// 로그아웃 된 경우
    console.log('Firebase signed out')
		router.push('/').catch(err => { err })
  }
});