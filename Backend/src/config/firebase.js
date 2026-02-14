const admin = require('firebase-admin');
const path = require('path');

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf-8")
);
console.log(serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin initialized');

module.exports = admin;
