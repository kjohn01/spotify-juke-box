require('dotenv').config();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'https://main.d2oea1w38l32n1.amplifyapp.com/';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
module.exports = { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET };
