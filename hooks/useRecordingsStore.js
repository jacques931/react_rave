import { useDispatch, useSelector } from 'react-redux';
import { addRecording, deleteRecording, loadRecordings } from '../slice/RecordingsSlice';
import { useEffect } from 'react';

// Hook personnalisé pour gérer les enregistrements dans le store Redux
export default function useRecordingsStore() {
    const dispatch = useDispatch();
    const { items: recordings, loading, error } = useSelector(state => state.recordings);
    
    // Charger les enregistrements au démarrage
    useEffect(() => {
        dispatch(loadRecordings());
    }, [dispatch]);
    
    // Fonction pour ajouter un enregistrement
    const saveRecording = (uri, name, date = new Date().toLocaleString()) => {
        if (!uri) return;
        
        const newRecording = {
            id: Date.now().toString(),
            name: name || `Enregistrement ${recordings.length + 1}`,
            uri: uri,
            date: date
        };
        
        dispatch(addRecording(newRecording));
        return newRecording;
    };
    
    // Fonction pour supprimer un enregistrement
    const removeRecording = (id) => {
        dispatch(deleteRecording(id));
    };
    
    return {
        recordings,
        loading,
        error,
        saveRecording,
        removeRecording
    };
}
