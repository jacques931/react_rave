import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';

export default function SaveRecordingModal({ visible, recordingName, onChangeRecordingName, onSave, onCancel }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Sauvegarder l'enregistrement</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom de l'enregistrement"
                        value={recordingName}
                        onChangeText={onChangeRecordingName}
                    />
                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.modalButtonText}>Annuler</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={onSave}
                        >
                            <Text style={styles.modalButtonText}>Sauvegarder</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#dddddd',
    },
    confirmButton: {
        backgroundColor: '#44aa44',
    },
    modalButtonText: {
        fontWeight: 'bold',
        color: '#fff',
    }
});
