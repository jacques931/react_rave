import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

export default function ModelSelector({ selectedModel, setSelectedModel, onModelsLoaded }) {
    const [availableModels, setAvailableModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);
    const { connected, ipAddress, port } = useSelector(state => state.server);

    // Récupérer la liste des modèles disponibles depuis le serveur
    const fetchAvailableModels = async () => {
        setLoadingModels(true);
        try {
            const serverAddress = `http://${ipAddress}:${port}`;
            const response = await fetch(`${serverAddress}/getmodels`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Modèles disponibles:', data);
                
                if (data.models && Array.isArray(data.models)) {
                    // Formater les modèles pour l'affichage dans le Picker
                    const formattedModels = data.models.map(model => {
                        // Conserver le nom complet pour la valeur, mais afficher sans extension
                        const displayName = model.endsWith('.onnx') ? model.slice(0, -5) : model;
                        return { label: displayName, value: model };
                    });
                    
                    setAvailableModels(formattedModels);
                    
                    // Sélectionner le premier modèle par défaut s'il y en a un
                    if (formattedModels.length > 0 && !selectedModel) {
                        setSelectedModel(formattedModels[0].value);
                    }
                    
                    // Notifier le parent que les modèles sont chargés
                    if (onModelsLoaded) {
                        onModelsLoaded(formattedModels);
                    }
                }
            } else {
                console.error('Erreur lors de la récupération des modèles:', response.status);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des modèles:', error);
        } finally {
            setLoadingModels(false);
        }
    };
    
    // Fonction pour sélectionner un modèle sur le serveur
    const selectModelOnServer = async (modelName) => {
        if (!modelName) {
            return false;
        }
        
        try {
            const serverAddress = `http://${ipAddress}:${port}`;
            console.log('Tentative de sélection du modèle:', modelName);
            const response = await fetch(`${serverAddress}/selectModel/${modelName}`);
            
            if (response.ok) {
                const result = await response.text();
                console.log('Réponse de sélection du modèle:', result);
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
    
    // Charger les modèles au démarrage
    useEffect(() => {
        if (connected) {
            fetchAvailableModels();
        }
    }, [connected]);
    
    // Sélectionner le modèle sur le serveur lorsque la sélection change
    useEffect(() => {
        if (selectedModel) {
            selectModelOnServer(selectedModel);
        }
    }, [selectedModel]);
    
    return (
        <View style={styles.pickerContainer}>
            <Text style={styles.label}>Modèle de transformation:</Text>
            {loadingModels ? (
                <ActivityIndicator size="small" color="#0000ff" style={{marginVertical: 10}} />
            ) : (
                <Picker
                    selectedValue={selectedModel}
                    onValueChange={(value) => {
                        setSelectedModel(value);
                    }}
                    style={styles.picker}
                    enabled={availableModels.length > 0}
                >
                    {availableModels.length === 0 ? (
                        <Picker.Item 
                            label="Aucun modèle disponible" 
                            value="" 
                            enabled={false} 
                        />
                    ) : (
                        availableModels.map((model) => (
                            <Picker.Item 
                                key={model.value} 
                                label={model.label} 
                                value={model.value} 
                            />
                        ))
                    )}
                </Picker>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
});