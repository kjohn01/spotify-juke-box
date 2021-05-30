import { useMemo, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';

export default function Playlist({ setShowLyrics, playingState, dispatch }) {
    const { playlist, playingIndex, playingTrack } = playingState;

    const tracks = useMemo(() => playlist.map(track => <Carousel.Item key={track.trackId}>
        <img
            className="d-block mx-auto current"
            src={track.coverUrl} 
            alt="album cover"
            onClick={() => setShowLyrics(true)}
        />
        <Carousel.Caption>
            <h3 className="legend">{track.title}</h3>
            <p>{track.artist}</p>
        </Carousel.Caption>
    </Carousel.Item>), [playlist, setShowLyrics]);

    const prevIcon = useCallback(() => {
        const prevIndex = playingIndex > 0 ? playingIndex-1 : playlist.length-1;
        const prevTrack = playlist[prevIndex];
        return <img
            className="prev h-75 d-none d-md-block"
            src={prevTrack.coverUrl} 
            alt="next"
            // onClick={() => dispatch('NEXT')}
        />
    }, [playingIndex, playlist]);

    const nextIcon = useCallback(() => {
        const nextIndex = playingIndex < playlist.length-1 ? playingIndex+1 : 0;
        const nextTrack = playlist[nextIndex];
        return <img
            className="next h-75 d-none d-md-block"
            src={nextTrack.coverUrl} 
            alt="next"
            // onClick={() => dispatch('NEXT')}
        />
    }, [playingIndex, playlist]);

    return (
        <Carousel 
            className="w-100 overflow-hidden"
            activeIndex={playingIndex} 
            prevIcon={prevIcon()}
            nextIcon={nextIcon()}
            onSelect={(index) => dispatch({ type: 'PLAY', index })}
            interval={playingTrack.trackLength}
        >
            {tracks}
        </Carousel>
    );
}
