import { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ token, uris }) {
    const [play, setPlay] = useState(false);

    useEffect(() => {
        setPlay(true);
        return () => {}
    }, [uris]);

    if (!token) return null;
    return (
        <SpotifyPlayer
            token={token}
            showSaveIcon
            play={play}
            uris={uris ? [uris] : []}
            callback={state => {
                if (!state.isPlaying) setPlay(false);
            }}
        />
    )
}
