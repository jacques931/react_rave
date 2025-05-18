import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const recordingsSlice = createSlice({
    name: 'recordings',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        addRecording: (state, action) => {
            state.items.push(action.payload);
            // Sauvegarder dans le stockage local
            saveRecordingsToStorage(state.items);
        },
        deleteRecording: (state, action) => {
            state.items = state.items.filter(recording => recording.id !== action.payload);
            // Mettre à jour le stockage local
            saveRecordingsToStorage(state.items);
        },
        setRecordings: (state, action) => {
            state.items = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

// Fonction pour sauvegarder les enregistrements dans AsyncStorage
const saveRecordingsToStorage = async (recordings) => {
    try {
        await AsyncStorage.setItem('recordings', JSON.stringify(recordings));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des enregistrements:', error);
    }
};

// Action pour charger les enregistrements depuis AsyncStorage
export const loadRecordings = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const recordingsJson = await AsyncStorage.getItem('recordings');
        if (recordingsJson) {
            const recordings = JSON.parse(recordingsJson);
            dispatch(setRecordings(recordings));
        }
    } catch (error) {
        console.error('Erreur lors du chargement des enregistrements:', error);
        dispatch(setError('Impossible de charger les enregistrements'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const { addRecording, deleteRecording, setRecordings, setLoading, setError } = recordingsSlice.actions;
export const recordingsSelector = (state) => state.recordings;
export default recordingsSlice.reducer;
