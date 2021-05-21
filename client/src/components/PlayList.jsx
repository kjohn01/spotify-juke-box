import { useMemo, useState, useEffect } from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function PlayList({ playingTrack, playList, playTrack, setShowLyrics }) {
    const [startIndex, setStartIndex] = useState(-1)
    useEffect(() => {
        const curPlayingTrack = playList.findIndex((song) => song.trackId === playingTrack.trackId);
        setStartIndex(curPlayingTrack);
    }, [playList, playingTrack.trackId])

    const tracks = useMemo(() => playList.map(track => <div key={track.trackId}>
        <img src={track.coverUrl} alt="album cover" className="img-fluid" />
        <h3 className="legend">{track.title}</h3>
        <p>{track.artist}</p>
    </div>), [playList]);

    const onChange = (index, track) => {
        const playingTrack = playList.find((song) => `.$${song.trackId}` === track.key);
        playTrack(playingTrack);
    }

    const onClickItem = () => {
        setShowLyrics(true);
    }

    const onClickThumb = (data) => {
        // console.log(data);
    }

    return (
        startIndex >= 0 && <Carousel 
            showArrows={true}  
            emulateTouch={true}
            infiniteLoop={true} 
            onChange={onChange} 
            onClickItem={onClickItem} 
            onClickThumb={onClickThumb}
            selectedItem={startIndex}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
        >
            {tracks}
        </Carousel>
    );
}
