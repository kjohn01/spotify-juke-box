import { useState, useEffect, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import { CLIENT_ID, SERVER_URL } from '../constants';
import Track from './Track';
import Player from './Player';
import Lyrics from './Lyrics';

const spotifyAPI = new SpotifyWebApi({ clientId: CLIENT_ID });

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  const playTrack = useCallback((track) => {
    setPlayingTrack(track);
    setSearch('');
    setLyrics("");
  }, []);

  const fetchLyrics = useCallback(async (playingTrack) =>{
    const params = {
      track: playingTrack.title,
      artist: playingTrack.artist
    };
    const url = new URL(`${SERVER_URL}/lyrics`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url); 
    return response.json();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
    return () => {};
  }, [accessToken]);

  useEffect(() => {
    if (search.length === 0) return setSearchResults([]);
    if (!accessToken) return;
    spotifyAPI.searchTracks(search)
    .then(res => {
      setSearchResults(res.body.tracks.items.map((track) => {
        const findSmallestImg = track.album.images.reduce((smallest, img) => {
          if (smallest.height > img.height) return img;
          return smallest;
        }, track.album.images[0]);

        return {
          trackId: track.id,
          title: track.name,
          artist: track.artists[0].name,
          uri: track.uri,
          albumImgUrl: findSmallestImg.url
        }
      }));
    })
    .catch((err) => {
      console.error(err);
    });
    return () => {};
  }, [search, accessToken]);

  useEffect(() => {
    if (!accessToken || !playingTrack) return;
    fetchLyrics(playingTrack)
    .then(res => {
      setLyrics(res.lyrics);
    })
    .catch((err) => {
      console.error(err);
    });
    return () => {};
  }, [playingTrack, accessToken, fetchLyrics])

  const tracks = useMemo(() => searchResults.map(track => <Track track={track} key={track.trackId} playTrack={playTrack} />), [searchResults, playTrack]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: '100vh' }}>
      <Form.Control 
        type="search" 
        placeholder="Search Songs / Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />
      <div className="flex-grow-1 my-2">
        {searchResults.length > 0 ? tracks : <Lyrics lyrics={lyrics} />}
      </div>
      <div className="fixed-bottom">
        <Player token={accessToken} uris={playingTrack?.uri} />
      </div>
    </Container>
  );
}
