import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setServerConfig, setConnected } from '../../slice/ServerSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { ipAddress, port } = useSelector(state => state.server);

  const handleConnect = async () => {
      // Vérification des champs
      if (!ipAddress) {
          Alert.alert('Veuillez entrer une adresse IP');
          return;
      }
      console.log(`Tentative de connexion à ${ipAddress}:${port}`);
      
      // Tentative de connexion au serveur
      try {
          const response = await fetch(`http://${ipAddress}:${port}/`);

          if (!response.ok) {
              throw new Error('Échec de la connexion au serveur');
          }
          
          const data = await response.text();
          console.log('Connexion réussie:', data);
          // Enregistre les informations sur server dans le store
          dispatch(setServerConfig({ ip: ipAddress, port: port }));
          dispatch(setConnected(true));
      } catch (error) {
          console.error('Erreur de connexion:', error);
          Alert.alert('Erreur de connexion', 'Impossible de se connecter au serveur. Vérifiez l\'adresse IP et le port.');
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RAVES</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Adresse IP</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={(text) => dispatch(setServerConfig({ ip: text, port }))}
          placeholder="192.168.1.1"
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Port</Text>
        <TextInput
          style={styles.input}
          value={port}
          onChangeText={(text) => dispatch(setServerConfig({ ip: ipAddress, port: text }))}
          placeholder="8000"
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={styles.connectButton} 
          onPress={handleConnect}
        >
          <Text style={styles.connectButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 3,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
  connectButton: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#2196F3',
    borderRadius: 3,
    padding: 12,
    width: '100%',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});