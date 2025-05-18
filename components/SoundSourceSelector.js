import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import DefaultSoundsSource from './sources/DefaultSoundsSource';
import RecordingsSource from './sources/RecordingsSource';
import DeviceFilesSource from './sources/DeviceFilesSource';

export default function SoundSourceSelector({ recordings, selectedRecording, onSelectSound }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'default', title: 'Sons par défaut' },
    { key: 'recordings', title: 'Enregistrements' },
    { key: 'device', title: 'Appareil' },
  ]);

  // Fonction pour afficher le bon composant en fonction de la route
  const renderScene = SceneMap({
    default: () => <DefaultSoundsSource onSelectSound={onSelectSound} selectedRecording={selectedRecording} />,
    recordings: () => <RecordingsSource 
                        recordings={recordings} 
                        selectedId={selectedRecording ? selectedRecording.id : null}
                        onSelectRecording={(id) => {
                          const recording = recordings.find(rec => rec.id === id);
                          onSelectSound(recording);
                        }}
                      />,
    device: () => <DeviceFilesSource onSelectSound={onSelectSound} />,
  });

  // Fonction pour afficher la barre de tabulation
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#3498db"
      inactiveColor="#95a5a6"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  indicator: {
    backgroundColor: '#3498db',
    height: 3,
  },
  tabLabel: {
    fontWeight: '500',
    textTransform: 'none',
  }
});
