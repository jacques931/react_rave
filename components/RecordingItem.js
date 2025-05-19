import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import useAudioControl from '../hooks/useAudioControl';

export default function RecordingItem({ recording, onDelete, selectable = false, isSelected = false, onSelect = null }) {
  const { playAudio, pauseAudio } = useAudioControl();
  const { isPlaying, currentlyPlayingUri } = useSelector(state => state.audio);

  // Déterminer si ce lecteur est en cours de lecture
  const playing = isPlaying && currentlyPlayingUri === recording.uri;
  
  // Fonction pour gérer la lecture/pause
  const handlePlayPause = () => {
    if (playing) {
      pauseAudio();
    } else {
      playAudio(recording.uri);
    }
  };
  
  // Gestion du clic sur l'élément entier (pour la sélection)
  const handleItemPress = () => {
    if (selectable && onSelect) {
      onSelect(recording.id);
    }
  };

  return (
    <Pressable 
      style={[
        styles.recordingItem, 
        selectable && isSelected && styles.selectedItem
      ]}
      onPress={handleItemPress}
    >
      <View style={styles.recordingInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.recordingName}>{recording.name}</Text>
          <Text style={styles.recordingDate}>{recording.date}</Text>
        </View>
      </View>
      
      <View style={styles.controlsContainer}>
        {/* Indicateur de sélection (affiché uniquement si selectable=true) */}
        {selectable && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.selectionText}>{isSelected ? '✓' : '○'}</Text>
          </View>
        )}
        
        {/* Boutons de contrôle (affichés uniquement si selectable=false) */}
        {!selectable && (
          <View style={styles.recordingControls}>
            <Pressable 
              style={[styles.controlButton, playing && styles.playingButton]}
              onPress={handlePlayPause}
            >
              <Ionicons 
                name={playing ? "pause" : "play"}
                size={20} 
                color={playing ? '#ffffff' : '#4444ff'}
              />
            </Pressable>
            
            {onDelete && (
              <Pressable 
                style={[styles.controlButton, styles.deleteButton]}
                onPress={() => onDelete(recording.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff6666" />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recordingItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#e6f0ff',
    borderColor: '#4444ff',
    borderWidth: 1,
  },
  recordingInfo: {
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  recordingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#eee',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#ffeeee',
  },
  playingButton: {
    backgroundColor: '#4444ff',
  },
  selectionIndicator: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectionText: {
    fontSize: 16,
    color: '#4444ff',
  },
});
