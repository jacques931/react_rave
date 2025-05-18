import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function DeviceFilesSource({ onSelectSound }) {
  const pickDocument = async () => {
    try {
      // Sélectionner un fichier audio
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      
      // Vérifier si l'utilisateur a annulé la sélection
      if (result.canceled === false) {
        const file = result.assets[0];
        
        // Préparer le chemin du fichier dans le cache temporaire
        const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const deviceSoundUri = `${FileSystem.cacheDirectory}device_sounds/${fileName}`;
        
        // Vérifier si le répertoire existe
        const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}device_sounds`);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(`${FileSystem.cacheDirectory}device_sounds`, { intermediates: true });
        }
        
        // Copier le fichier dans le répertoire des documents
        await FileSystem.copyAsync({
          from: file.uri,
          to: deviceSoundUri
        });
        
        // Créer un URI sans le préfixe file://
        let finalUri = deviceSoundUri;
        if (finalUri.startsWith('file://')) {
          finalUri = finalUri.substring(7);
        }
        
        // Créer un objet compatible avec le format attendu par UploadButton
        onSelectSound({
          id: 'device-' + Date.now(),
          name: file.name,
          uri: finalUri
        });
      }
    } catch (err) {
      console.error('Erreur lors de la sélection du fichier:', err);
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier audio');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fichiers de l'appareil</Text>
      <TouchableOpacity style={styles.pickButton} onPress={pickDocument}>
        <Text style={styles.pickButtonText}>Sélectionner un fichier audio</Text>
      </TouchableOpacity>
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
  pickButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedFileContainer: {
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileInfoContainer: {
    flex: 1,
  },
  selectedFileName: {
    fontSize: 16,
  },
  playButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginLeft: 10,
  },
  playingButton: {
    backgroundColor: '#3498db',
  },
  playButtonText: {
    fontSize: 18,
  },
});
