import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default function DefaultSoundsSource({ onSelectSound, selectedRecording }) {
  const [selectedSoundId, setSelectedSoundId] = useState(null);
  
  const defaultSounds = [
    { id: 'default1', name: 'Bell', assetModule: require('../../assets/audio/bell.wav') },
    { id: 'default2', name: 'Clap', assetModule: require('../../assets/audio/clap.wav') },
    { id: 'default3', name: 'Crash', assetModule: require('../../assets/audio/crash.wav') },
    { id: 'default4', name: 'Hihat', assetModule: require('../../assets/audio/hihat.wav') },
    { id: 'default5', name: 'Kick', assetModule: require('../../assets/audio/kick.wav') },
    { id: 'default6', name: 'Openhat', assetModule: require('../../assets/audio/openhat.wav') },
    { id: 'default7', name: 'Ride', assetModule: require('../../assets/audio/ride.wav') },
    { id: 'default8', name: 'Rim', assetModule: require('../../assets/audio/rim.wav') },
    { id: 'default9', name: 'Snare', assetModule: require('../../assets/audio/snare.wav') },
  ];

  // Mettre à jour selectedSoundId lorsque selectedRecording change
  useEffect(() => {
    if (selectedRecording && selectedRecording.id.startsWith('default-')) {
      const soundName = selectedRecording.id.split('default-')[1];
      const matchingSound = defaultSounds.find(sound => 
        sound.name.toLowerCase() === soundName
      );
      if (matchingSound) {
        setSelectedSoundId(matchingSound.id);
      }
    } else {
      setSelectedSoundId(null);
    }
  }, [selectedRecording]);

  // Fonction pour sélectionner un son en le mettant dans le cache
  const copyAssetToFileSystem = async (assetModule, name, id) => {
    try {
      // Mettre à jour l'état de sélection immédiatement pour un retour visuel
      setSelectedSoundId(id);
      
      // Préparer le chemin du fichier dans le répertoire des documents
      const soundUri = `${FileSystem.cacheDirectory}sounds/${name.toLowerCase()}.wav`;
      
      // Vérifier si le répertoire existe
      const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}sounds`);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}sounds`, { intermediates: true });
      }
      
      // Vérifier si le fichier existe déjà
      const fileInfo = await FileSystem.getInfoAsync(soundUri);
      if (!fileInfo.exists) {
        // Charger l'asset
        const asset = await Asset.loadAsync(assetModule);
        const assetUri = asset[0].localUri;
        
        // Copier le fichier
        await FileSystem.copyAsync({
          from: assetUri,
          to: soundUri
        });
      }

      // Créer un objet compatible avec le format attendu par UploadButton
      let finalUri = soundUri;
      if (finalUri.startsWith('file://')) {
        finalUri = finalUri.substring(7); // Enlever le préfixe 'file://'
      }
      
      const soundObj = {
        id: `default-${name.toLowerCase()}`,
        name: name,
        uri: finalUri
      };

      onSelectSound(soundObj);
    } catch (error) {
      console.error(`Erreur lors de la préparation du son ${name}:`, error);
      Alert.alert('Erreur', `Impossible de préparer le son ${name}`);
    }
  };

  // Vérifier si un son est sélectionné
  const isSelected = (id) => {
    return id === selectedSoundId;
  };

  // Rendu d'un élément individuel pour la FlatList
  const renderSoundItem = ({ item }) => {
    const selected = isSelected(item.id);
    
    return (
      <View style={styles.soundItemContainer}>
        <TouchableOpacity
          style={[styles.soundItem, selected && styles.selectedSoundItem]}
          onPress={() => copyAssetToFileSystem(item.assetModule, item.name, item.id)}
        >
          <Text style={[styles.soundName, selected && styles.selectedSoundText]}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sons par défaut</Text>
      <View style={styles.soundItemsContainer}>
        <FlatList
          data={defaultSounds}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  soundItemsContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  soundItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  soundItem: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
  },
  selectedSoundItem: {
    backgroundColor: '#e6f0ff',
    borderColor: '#3498db',
    borderWidth: 1,
  },
  soundName: {
    fontSize: 16,
  },
  selectedSoundText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  playingButton: {
    backgroundColor: '#3498db',
  },
  playButtonText: {
    fontSize: 18,
  },
});
