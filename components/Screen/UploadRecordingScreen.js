import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadRecordings } from '../../slice/RecordingsSlice';
import AudioPlayer from '../AudioPlayer';
import ModelSelector from '../ModelSelector';
import UploadButton from '../UploadButton';
import SoundSourceSelector from '../SoundSourceSelector';
import useRecordingsStore from "../../hooks/useRecordingsStore";
import { setSelectedSound, setSelectedModel, setTransformedAudio, setIsPlaying } from '../../slice/AudioSlice';

export default function UploadRecordingScreen({ navigation }) {
    const dispatch = useDispatch();
    const { recordings } = useRecordingsStore();
    
    // Utiliser les états du store Redux
    const { selectedSound, selectedModel, transformedAudio, isPlaying, currentlyPlayingUri } = useSelector(state => state.audio);
    
    // Charger les enregistrements au démarrage
    useEffect(() => {
        dispatch(loadRecordings());
    }, [dispatch]);
    
    // Gérer la fin de l'upload
    const handleUploadComplete = (uri) => {
        dispatch(setTransformedAudio(uri));
    };
    
    // Gérer la sélection d'un son (enregistrement, son par défaut ou fichier de l'appareil)
    const handleSelectSound = (sound) => {
        dispatch(setSelectedSound(sound));
    };
    
    // Gérer la lecture d'un audio
    const handleAudioPlay = (uri) => {
        if (isPlaying && currentlyPlayingUri === uri) {
            dispatch(setIsPlaying({ isPlaying: false, uri: null }));
        } else {
            dispatch(setIsPlaying({ isPlaying: true, uri }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestion des Enregistrements</Text>
            
            <View style={styles.contentContainer}>
                <View style={styles.soundSelectorContainer}>
                    <SoundSourceSelector 
                        recordings={recordings}
                        selectedRecording={selectedSound}
                        onSelectSound={handleSelectSound}
                    />
                </View>
                
                <ScrollView style={styles.scrollableSection}>
                    <View style={styles.uploadSection}>
                        <Text style={styles.sectionTitle}>
                            {selectedSound 
                                ? `Son sélectionné: ${selectedSound.name}` 
                                : 'Aucun son sélectionné'}
                        </Text>
                        
                        <ModelSelector 
                            selectedModel={selectedModel}
                            setSelectedModel={(model) => dispatch(setSelectedModel(model))}
                        />
                        
                        <UploadButton 
                            selectedRecording={selectedSound}
                            selectedModel={selectedModel}
                            onUploadComplete={handleUploadComplete}
                        />
                        
                        {selectedSound && (
                            <AudioPlayer 
                                uri={selectedSound.uri}
                                title="Audio Original"
                                onPlay={() => handleAudioPlay(selectedSound.uri)}
                            />
                        )}
                        
                        {transformedAudio && (
                            <AudioPlayer 
                                uri={transformedAudio}
                                title="Audio Transformé"
                                onPlay={() => handleAudioPlay(transformedAudio)}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    soundSelectorContainer: {
        height: 350, // Hauteur réduite pour laisser plus d'espace à la partie scrollable
        marginBottom: 10,
    },
    scrollableSection: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
    uploadSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginTop: 5,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});