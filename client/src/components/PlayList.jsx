import { useMemo } from 'react';
import { Carousel } from 'react-bootstrap';

export default function Playlist({ setShowLyrics, playingState, dispatch }) {
    const { playlist, playingIndex, playingTrack } = playingState;

    const tracks = useMemo(() => playlist.map(track => <Carousel.Item key={track.trackId}>
        <img
            className="d-block w-100"
            src={track.coverUrl} 
            alt="album cover"
            onClick={() => setShowLyrics(true)}
        />
        <Carousel.Caption>
            <h3 className="legend">{track.title}</h3>
            <p>{track.artist}</p>
        </Carousel.Caption>
    </Carousel.Item>), [playlist, setShowLyrics]);

    return (
        <Carousel 
            activeIndex={playingIndex} 
            onSelect={(index) => dispatch({ type: 'PLAY', index })}
            interval={playingTrack.trackLength}
        >
            {tracks}
        </Carousel>
    );
}
