import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ token, uris }) {
    if (!token || !uris) return null;

    return (
        <SpotifyPlayer
            token={token}
            showSaveIcon
            autoPlay
            uris={uris ? [uris] : []}
        />
    )
}
