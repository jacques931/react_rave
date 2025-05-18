import { configureStore } from '@reduxjs/toolkit';
import serverReducer from '../slice/ServerSlice';
import recordingsReducer from '../slice/RecordingsSlice';
import audioReducer from '../slice/AudioSlice';

export default configureStore({
  reducer: {
    server: serverReducer,
    recordings: recordingsReducer,
    audio: audioReducer
  },
});