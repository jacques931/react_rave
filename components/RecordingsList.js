import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RecordingItem from './RecordingItem';

export default function RecordingsList({ recordings, onDeleteRecording = null, selectable = false, selectedId = null, onSelectRecording = null, title = null }) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      {recordings.length === 0 ? (
        <Text style={styles.emptyText}>Aucun enregistrement disponible</Text>
      ) : (
        <FlatList
          data={recordings}
          renderItem={({ item }) => (
            <RecordingItem
              recording={item}
              onDelete={selectable ? null : onDeleteRecording}
              selectable={selectable}
              isSelected={selectable ? selectedId === item.id : false}
              onSelect={selectable ? onSelectRecording : null}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#999',
    fontStyle: 'italic',
  },
});
