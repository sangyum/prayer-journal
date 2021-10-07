import * as firebase from 'firebase-admin';
import * as functions from "firebase-functions";
import FirestoreDAL from './database/firestoreDAL';

const admin = firebase.initializeApp();
const db = admin.firestore();
const logger = functions.logger;

const dataAccessLayer = FirestoreDAL(db, logger);

