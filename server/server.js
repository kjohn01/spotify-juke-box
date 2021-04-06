const express = require('express');
const cors = require('cors');
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require('spotify-web-api-node');
const { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = require('./constants');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const port = 3001;

const credentials = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
};

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyAPI = new SpotifyWebApi(credentials);
    spotifyAPI.authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(400);
    });
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyAPI = new SpotifyWebApi({ ...credentials, refreshToken });
    spotifyAPI.refreshAccessToken()
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch((err) => {
        console.error(err);
        res.sendStatus(400);
    });
});

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found";
    res.json({ lyrics });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});