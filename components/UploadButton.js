import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useSelector } from 'react-redux';

export default function UploadButton({ selectedRecording, selectedModel, onUploadComplete }) {
    const [uploading, setUploading] = useState(false);
    const { ipAddress, port } = useSelector(state => state.server);
    
    // Sélectionner un modèle sur le serveur
    const selectModelOnServer = async (modelName) => {
        try {
            const serverAddress = `http://${ipAddress}:${port}`;
            console.log('Tentative de sélection du modèle:', modelName);
            const response = await fetch(`${serverAddress}/selectModel/${modelName}`);
            
            if (response.ok) {
                const result = await response.text();
                console.log('Sélection du modèle:', result);
                return true;
            } else {
                console.error('Erreur lors de la sélection du modèle:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du modèle:', error);
            return false;
        }
    };
    
    // Fonction pour télécharger le fichier audio transformé depuis le serveur
    const downloadTransformedAudio = async () => {
        try {
            // Utiliser le répertoire de cache audio comme pour les enregistrements originaux
            const directory = FileSystem.cacheDirectory + "Audio";
            try {
                const dirInfo = await FileSystem.getInfoAsync(directory);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(directory);
                }
            } catch (dirError) {
                console.log("Erreur lors de la vérification/création du répertoire:", dirError);
            }
            
            // Télécharger le fichier avec un nom similaire aux enregistrements originaux
            const serverAddress = `http://${ipAddress}:${port}`;
            const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const filename = `transformed-${uniqueId}.wav`;
            const filePath = directory + "/" + filename;
            
            const downloadResult = await FileSystem.downloadAsync(
                serverAddress + `/download`, 
                filePath
            );
            
            // Extraire l'URI sans le préfixe "file://"
            let uri = downloadResult.uri;
            if (uri.startsWith('file://')) {
                uri = uri.substring(7); // Enlever "file://"
            }
            
            console.log("Fichier téléchargé à:", uri);
            return uri;
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            Alert.alert('Erreur', 'Impossible de télécharger le fichier audio transformé');
            return null;
        }
    };
    
    // Fonction pour uploader l'enregistrement
    const uploadRecording = async () => {
        if (!selectedRecording) {
            Alert.alert('Erreur', 'Veuillez sélectionner un enregistrement');
            return;
        }
        
        setUploading(true);
        
        try {
            // Fonction d'envoi de fichier
            const sendFile = async () => {
                try {
                    // Utiliser l'URI local du fichier sélectionné
                    const fileUri = selectedRecording.uri;
                    console.log('Envoi du fichier:', fileUri);
                    
                    // Uploader le fichier au serveur
                    const serverAddress = `http://${ipAddress}:${port}`;
                    
                    // Créer les options d'upload
                    const resp = await FileSystem.uploadAsync(
                        serverAddress + '/upload', 
                        fileUri, 
                        {
                            fieldName: 'file',
                            httpMethod: 'POST',
                            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                            headers: { filename: fileUri }
                        }
                    );
                    
                    console.log(resp.body);
                    return resp;
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du fichier:', error);
                    throw error;
                }
            };
            
            // Exécuter l'upload
            const response = await sendFile();
            
            // Vérifier si la réponse contient le texte indiquant que le traitement est terminé
            if (response.status >= 200 && response.status < 300) {
                console.log('Traitement réussi, téléchargement de l\'audio transformé');
                // Télécharger l'audio transformé
                const transformedUri = await downloadTransformedAudio();
                if (transformedUri) {
                    console.log('Audio transformé téléchargé à:', transformedUri);
                    
                    Alert.alert('Succès', 'Audio transformé téléchargé avec succès');
                    if (onUploadComplete) onUploadComplete(transformedUri);
                }
            } else {
                Alert.alert('Erreur', 'Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('Erreur d\'upload:', error);
            Alert.alert('Erreur', 'Impossible de communiquer avec le serveur');
        } finally {
            setUploading(false);
        }
    };
    
    // Fonction pour modifier l'enregistrement sélectionné
    const handleModify = async () => {
        if (!selectedRecording) {
            Alert.alert('Erreur', 'Veuillez sélectionner un enregistrement');
            return;
        }
        
        if (!selectedModel) {
            Alert.alert('Erreur', 'Veuillez sélectionner un modèle');
            return;
        }
        
        // Sélectionner le modèle sur le serveur avant l'upload
        const modelSelected = await selectModelOnServer(selectedModel);
        if (!modelSelected) {
            Alert.alert('Erreur', 'Impossible de sélectionner le modèle sur le serveur');
            return;
        }
        
        uploadRecording();
    };
    
    const disabled = !selectedRecording || !selectedModel || uploading;
    return (
        <TouchableOpacity 
            style={[
                styles.button, 
                disabled && styles.disabledButton
            ]}
            onPress={handleModify}
            disabled={disabled}
        >
            {uploading ? (
                <ActivityIndicator size="small" color="#ffffff" />
            ) : (
                <Text style={styles.buttonText}>Modifier et Uploader</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4444ff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#aaaaff',
        opacity: 0.7,
    },
});
