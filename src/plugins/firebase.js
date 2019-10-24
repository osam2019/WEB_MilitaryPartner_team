import Vue from 'vue'
import * as firebase from "firebase/app"
import firebaseConfig  from '../../firebaseConfig'

import "firebase/analytics"
import "firebase/firestore"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)


Vue.prototype.$firebase = firebase