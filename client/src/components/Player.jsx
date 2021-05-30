import { useCallback } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ token, uris, offset, dispatch }) {
    const handleSync = useCallback((state) => {
        if (state.isActive && state.isPlaying && state.position === 0 &&state.track.uri !== uris[offset]) dispatch({ type: 'PLAY', index: uris.indexOf(state.track.uri) });
    }, [dispatch, offset, uris]);

    if (!token || !uris) return null;
    
    return (
        <SpotifyPlayer
            token={token}
            showSaveIcon={false}
            autoPlay
            syncExternalDevice
            magnifySliderOnHover
            uris={uris}
            offset={offset}
            callback={handleSync}
        />
    )
}
