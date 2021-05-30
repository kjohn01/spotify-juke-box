const initPlayingState = {
    playingIndex: 0,
    playlist: [],
    playingTrack: null
};

const playlistReducer = (state, action) => {
    let { playingIndex, playlist } = state;
    let i;
    switch (action.type) {
      case 'NEXT':
        i = playingIndex < playlist.length-1 ? playingIndex+1 : 0;
        return {
            playingIndex: i,
            playlist,
            playingTrack: playlist[i]
        };
      case 'PREVIOUS':
        i = playingIndex > 0 ? playingIndex-1 : playlist.length-1;
        return {
            playingIndex: i,
            playlist,
            playingTrack: playlist[i]
        };
    case 'PLAY':
        i = action.index;
        return {
            playingIndex: i,
            playlist,
            playingTrack: playlist[i]
        };
    case 'SET_AND_PLAY':
        i = action.index;
        playlist = action.playlist;
        return {
            playingIndex: i,
            playlist,
            playingTrack: playlist[i]
        };
      default:
        throw new Error();
    }
}

export { initPlayingState, playlistReducer };