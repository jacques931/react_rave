import { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying } from '../slice/AudioSlice';

// Hook personnalisé pour gérer la lecture audio avec Redux
export default function useAudioControl() {
    const audioPlayer = useAudioPlayer();
    const status = useAudioPlayerStatus(audioPlayer);
    const dispatch = useDispatch();
    const { isPlaying, currentlyPlayingUri } = useSelector(state => state.audio);
    
    // Détecter la fin de lecture audio avec le status
    useEffect(() => {
        if (status?.didJustFinish) {
            dispatch(setIsPlaying({ isPlaying: false, uri: null }));
        }
    }, [status?.didJustFinish, dispatch]);
    
    // Fonction pour jouer un enregistrement
    const playAudio = (uri) => {
        try {
            // Si on essaie de jouer le même URI qui est déjà en cours de lecture, on ne fait rien
            if (currentlyPlayingUri === uri && isPlaying) {
                return;
            }
            
            audioPlayer.replace(uri);
            audioPlayer.play();
            dispatch(setIsPlaying({ isPlaying: true, uri }));
        } catch (err) {
            console.log(err);
            Alert.alert('Erreur de lecture', 'Impossible de lire cet enregistrement');
        }
    };
    
    // Fonction pour mettre en pause
    const pauseAudio = () => {
        try {
            audioPlayer.pause();
            dispatch(setIsPlaying({ isPlaying: false, uri: null }));
        } catch (err) {
            console.log('Erreur lors de la mise en pause:', err);
        }
    };
    
    return {
        isPlaying,
        playAudio,
        pauseAudio
    };
}
