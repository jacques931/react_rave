import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import useAudioControl from '../hooks/useAudioControl';

export default function AudioPlayer({ uri, title, onPlay }) {
    const { playAudio, pauseAudio } = useAudioControl();
    const { isPlaying, currentlyPlayingUri } = useSelector(state => state.audio);
    
    // Déterminer si ce lecteur est en cours de lecture
    const playing = isPlaying && currentlyPlayingUri === uri;

    const handlePlayPause = () => {
        if (playing) {
            pauseAudio();
        } else {
            playAudio(uri);
        }
        
        // Appeler le callback onPlay si fourni
        if (onPlay) {
            onPlay();
        }
    };
    

    return (
        <View style={styles.audioSection}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Pressable 
                    style={[styles.controlButton, playing && styles.playingButton]}
                    onPress={handlePlayPause}
                >
                    <Ionicons 
                        name={playing ? "pause" : "play"} 
                        size={24} 
                        color={playing ? "#ffffff" : "#4444ff"}
                    />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    audioSection: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4444ff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    controlButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    playingButton: {
        backgroundColor: '#4444ff',
    },
    button: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        backgroundColor: '#44aa44',
        marginTop: 8,
        flex: 1,
        marginRight: 8,
    },
    stopButton: {
        backgroundColor: '#ff4444',
        marginTop: 8,
        flex: 1,
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playbackInfo: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
});
