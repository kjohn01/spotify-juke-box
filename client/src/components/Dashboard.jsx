import { useState, useEffect, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import { CLIENT_ID } from '../constants';
import Track from './Track';
import Player from './Player';

const spotifyAPI = new SpotifyWebApi({ clientId: CLIENT_ID });

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  const playTrack = useCallback((track) => {
    setPlayingTrack(track);
    setSearch('');
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
        {tracks}
      </div>
      <div><Player token={accessToken} uris={playingTrack?.uri} /></div>
    </Container>
  );
}
