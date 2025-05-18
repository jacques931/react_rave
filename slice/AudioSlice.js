import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
    name: 'audio',
    initialState: {
        isRecording: false,
        recordingUri: null,
        selectedSound: null,
        selectedModel: '',
        transformedAudio: null,
        isPlaying: false,
        currentlyPlayingUri: null
    },
    reducers: {
        setIsRecording: (state, action) => {
            state.isRecording = action.payload;
        },
        setRecordingUri: (state, action) => {
            state.recordingUri = action.payload;
        },
        setSelectedSound: (state, action) => {
            state.selectedSound = action.payload;
        },
        setSelectedModel: (state, action) => {
            state.selectedModel = action.payload;
        },
        setTransformedAudio: (state, action) => {
            state.transformedAudio = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload.isPlaying;
            state.currentlyPlayingUri = action.payload.isPlaying ? action.payload.uri : null;
        }
    }
});

export const { setIsRecording, setRecordingUri, setSelectedSound, setSelectedModel, setTransformedAudio, setIsPlaying } = audioSlice.actions;
export const audioSelector = (state) => state.audio;
export default audioSlice.reducer;
