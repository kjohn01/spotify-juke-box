require('dotenv').config();
const CLIENT_ID = 'f7f01afe31be46a78188df89b35d0912';
const REDIRECT_URI = 'http://localhost:3000';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
module.exports = { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET };
