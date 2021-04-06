// import React from 'react';

export default function Track({ track, playTrack }) {
    const imgSize = 64
    const handleClick = () => {
        playTrack(track);
    };
    console.log('track');
    return (
        <div className="d-flex align-items-center my-2" style={{ cursor: "pointer" }} onClick={handleClick}>
            <img src={track.albumImgUrl} style={{ height: `${imgSize}px`, width: `${imgSize}px` }} alt="album cover" />
            <div className="ml-3 pt-2">
                <h5>{track.title}</h5>
                <p className="text-muted">{track.artist}</p>
            </div>
        </div>
    );
}
