import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './components/Screen/HomeScreen';
import RecordingScreen from './components/Screen/RecordingScreen';
import UploadRecordingScreen from './components/Screen/UploadRecordingScreen';
import store from './store/store';

const Tab = createBottomTabNavigator();

// Composant principal qui affiche le contenu
function MainContent() {
  const { connected } = useSelector(state => state.server);
  
  if (!connected) {
    return (
      <View style={styles.container}>
        <HomeScreen />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Studio') {
              iconName = focused ? 'headset' : 'headset-outline';
            } else if (route.name === 'Convertisseur') {
              iconName = focused ? 'sync' : 'sync-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4444ff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name="Studio">
          {(props) => <RecordingScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Convertisseur">
          {(props) => <UploadRecordingScreen {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Composant principal qui fournit le Provider Redux
export default function App() {
  return (
    <Provider store={store}>
      <MainContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
