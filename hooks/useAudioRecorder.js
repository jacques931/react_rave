import { useAudioRecorder as useExpoAudioRecorder, RecordingPresets, AudioModule } from 'expo-audio';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsRecording, setRecordingUri } from '../slice/AudioSlice';

// Hook personnalisé pour gérer l'enregistrement audio avec Redux
export default function useAudioRecorder() {
    const recorder = useExpoAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const dispatch = useDispatch();
    const { isRecording, recordingUri } = useSelector(state => state.audio);
    
    // Fonction pour demander les permissions
    const requestPermissions = async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
            Alert.alert('Permission refusée ! Impossible d\'utiliser le microphone');
            return false;
        }
        return true;
    };
    
    // Fonction pour démarrer l'enregistrement
    const startRecording = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;
        
        console.log('Début de l\'enregistrement');
        await recorder.prepareToRecordAsync();
        recorder.record();
        dispatch(setIsRecording(true));
    };
    
    // Fonction pour arrêter l'enregistrement
    const stopRecording = async () => {
        await recorder.stop();
        console.log('Fin de l\'enregistrement');
        const uri = recorder.uri;
        dispatch(setRecordingUri(uri));
        dispatch(setIsRecording(false));
        return uri;
    };
    
    return {
        isRecording,
        recordingUri,
        startRecording,
        stopRecording
    };
}
