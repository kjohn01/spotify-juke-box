import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import useAuth from '../hooks/useAuth';
import { Container, Form, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import SpotifyWebApi from 'spotify-web-api-node';
import { useSwipeable } from 'react-swipeable';
import { CLIENT_ID, SERVER_URL } from '../constants';
import { initPlayingState, playlistReducer } from '../reducers/playlistReducer';
import Track from './Track';
import Player from './Player';
import Lyrics from './Lyrics';
import Playlist from './Playlist';
import { ReactComponent as Logo } from '../logo.svg';

const spotifyAPI = new SpotifyWebApi({ clientId: CLIENT_ID });

const swipeConfig = {
  delta: 10,                            
  // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,  
  // call e.preventDefault *See Details*
  trackTouch: true,                     
  // track touch input
  trackMouse: false,                    
  // track mouse input
  rotationAngle: 0,                     
  // set a rotation angle
};

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lyrics, setLyrics] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);
  const [hideSearchResults, setHideSearchResults] = useState(true);
  const [playingState, dispatch] = useReducer(playlistReducer, initPlayingState);

  const handlers = useSwipeable({
    onSwipedRight: () => setShowLyrics(false),
    ...swipeConfig,
  });

  const { playlist, playingTrack, playingIndex } = playingState;

  // SET AND PLAY
  const playTrack = useCallback((index) => {
    if (!searchResults || index < 0 || index >= searchResults.length) return;
    dispatch({
      type: 'SET_AND_PLAY',
      index,
      playlist: searchResults
    });
    setSearch('');
    setLyrics("");
  }, [searchResults]); // Need CHeck!

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
          trackLength: track.duration_ms,
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

  // Fetch lyrics on change of playingTrack
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
  }, [accessToken, fetchLyrics, playingTrack]);

  const tracks = useMemo(() => searchResults.map((track, index) => <Track track={track} key={track.trackId} playTrack={playTrack} index={index} />), [searchResults, playTrack]);

  const uris = useMemo(() => playlist.map((track) => track.uri), [playlist]);

  return (
    <Container className="d-flex flex-column justify-content-between py-2" style={{ height: '100vh' }}>
      <Form.Control 
        type="search" 
        placeholder="Search Songs / Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />
      <div className="d-flex flex-column h-100 justify-content-center my-2 overflow-auto">
        { searchResults.length > 0 && !hideSearchResults 
          ? tracks 
          : playingState.playingTrack && showLyrics 
            ? <div {...handlers} className="h-100 d-flex flex-column justify-content-center">
                <Button 
                  className="p-0 border-0 text-black-50 text-center back" 
                  variant="link" 
                  onClick={() => setShowLyrics(false)}
                >
                  <ArrowLeft/> 
                  <p className="pl-2 d-none d-md-inline">back</p>
                </Button>
                <Lyrics lyrics={lyrics} />
            </div>
            : playingState.playingTrack && playingState.playlist.length > 0
              ? <Playlist 
                  setShowLyrics={setShowLyrics} 
                  playingState={playingState}
                  dispatch={dispatch}
                />
              : <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <Logo alt="logo" className="w-25 my-3 my-md-5" />
                <h1 className="text-center my-5">Go play something</h1>
              </div>
        }
      </div>
      <div>
        {
          playingState.playingTrack && <Player 
            token={accessToken} 
            uris={uris} 
            playingState={playingState}
            offset={playingIndex} 
            dispatch={dispatch}
          />
        }
      </div>
    </Container>
  );
}
