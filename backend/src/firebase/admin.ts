const admin = require('firebase-admin');
const config = require('../utils').config('security');

admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE.ADMIN_KEY)
});

export default admin;