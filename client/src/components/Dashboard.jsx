import { useState, useEffect, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { Container, Form, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import SpotifyWebApi from 'spotify-web-api-node';
import { CLIENT_ID, SERVER_URL } from '../constants';
import Track from './Track';
import Player from './Player';
import Lyrics from './Lyrics';
import PlayList from './PlayList';

const spotifyAPI = new SpotifyWebApi({ clientId: CLIENT_ID });

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const [hideSearchResults, setHideSearchResults] = useState(true);

  const playTrack = useCallback((track) => {
    setPlayingTrack(track);
    if (playList.length === 0) setPlayList(searchResults);
    setSearch('');
    setLyrics("");
  }, [playList.length, searchResults]);

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

  // User login and gain spotify access
  useEffect(() => {
    if (!accessToken) return;
    spotifyAPI.setAccessToken(accessToken);
    return () => {};
  }, [accessToken]);

  // Handle search results
  useEffect(() => {
    if (search.length === 0) {
      setSearchResults([]);
      setHideSearchResults(true);
      return;
    }
    if (!accessToken) return;
    spotifyAPI.searchTracks(search)
    .then(res => {
      setSearchResults(res.body.tracks.items.map((track) => {
        const findSmallestImg = track.album.images.reduce((smallest, img) => {
          if (smallest.height > img.height) return img;
          return smallest;
        }, track.album.images[0]);

        const findBiggestImg = track.album.images.reduce((biggest, img) => {
          if (biggest.height < img.height) return img;
          return biggest;
        }, track.album.images[0]);

        return {
          trackId: track.id,
          title: track.name,
          artist: track.artists[0].name,
          uri: track.uri,
          albumImgUrl: findSmallestImg.url,
          coverUrl: findBiggestImg.url
        }
      }));
      setHideSearchResults(false);
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
    <Container className="d-flex flex-column justify-content-between py-2" style={{ height: '100vh' }}>
      <Form.Control 
        type="search" 
        placeholder="Search Songs / Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />
      <div className="my-2 overflow-auto position-relative">
        {searchResults.length > 0 && !hideSearchResults 
          ? tracks 
          : playingTrack && showLyrics 
            ? <div>
                <Button className="fixed-top ml-lg-5 ml-sm-4 mt-5 text-black-50 text-center" variant="link" onClick={() => setShowLyrics(false)}><ArrowLeft/> back</Button>
                <Lyrics lyrics={lyrics} setShowLyrics={setShowLyrics} />
            </div>
            : playingTrack && playList.length > 0
              ? <PlayList playList={playList} playingTrack={playingTrack} setShowLyrics={setShowLyrics} playTrack={playTrack} />
              : <h1>Go play something</h1>
        }
      </div>
      <div className="">
        <Player token={accessToken} uris={playingTrack?.uri} />
      </div>
    </Container>
  );
}
