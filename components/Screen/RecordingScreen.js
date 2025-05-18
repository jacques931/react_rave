import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RecordingsListUnified from "../RecordingsList";
import SaveRecordingModal from "../SaveRecordingModal";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import useRecordingsStore from "../../hooks/useRecordingsStore";
import { setRecordingUri } from "../../slice/AudioSlice";

export default function RecordingScreen() {
    // Utilisation des hooks personnalisés
    const { isRecording, startRecording, stopRecording } = useAudioRecorder();
    const { recordings, saveRecording, removeRecording } = useRecordingsStore();
    const dispatch = useDispatch();
    const { recordingUri } = useSelector(state => state.audio);
    
    // États locaux pour la modal de sauvegarde
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [tempRecordingName, setTempRecordingName] = useState("");
    
    // Fonction pour gérer l'arrêt de l'enregistrement
    const handleStopRecording = async () => {
        const uri = await stopRecording();
        
        // Afficher directement la modal de sauvegarde
        setTempRecordingName(`Enregistrement ${recordings.length + 1}`);
        setShowSaveModal(true);
    };
    
    // Fonction pour sauvegarder l'enregistrement
    const handleSaveRecording = () => {
        if (!recordingUri) return;
        
        saveRecording(recordingUri, tempRecordingName);
        setShowSaveModal(false);
        
        // Réinitialiser les valeurs temporaires
        setTempRecordingName("");
        dispatch(setRecordingUri(null));
    };
    
    // Fonction pour annuler la sauvegarde
    const handleCancelSave = () => {
        setShowSaveModal(false);
        setTempRecordingName("");
        dispatch(setRecordingUri(null));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.recorderSection}>
                <Text style={styles.title}>Enregistreur Audio</Text>
                <View style={styles.recorderControls}>
                    <Pressable
                        style={[styles.recordButton, isRecording && styles.recordingActive]}
                        onPress={isRecording ? handleStopRecording : startRecording}
                    >
                        <Text style={styles.recordButtonText}>
                            {isRecording ? "STOP" : "REC"}
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.recordingName}>
                    {isRecording ? "Enregistrement en cours..." : 
                     recordingUri ? "Enregistrement prêt à être sauvegardé" : 
                     "Prêt à enregistrer"}
                </Text>
            </View>
            
            <RecordingsListUnified 
                recordings={recordings}
                onDeleteRecording={removeRecording}
                selectable={false}
                title="Mes Enregistrements"
            />
            
            <SaveRecordingModal
                visible={showSaveModal}
                recordingName={tempRecordingName}
                onChangeRecordingName={setTempRecordingName}
                onSave={handleSaveRecording}
                onCancel={handleCancelSave}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    recorderSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    recorderControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    recordButton: {
        backgroundColor: '#ff4444',
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    recordingActive: {
        backgroundColor: '#ff0000',
        borderWidth: 4,
        borderColor: '#cc0000',
    },
    recordButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    playButton: {
        backgroundColor: '#4444ff',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    playButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    saveButton: {
        backgroundColor: '#44aa44',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    recordingName: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 8,
    },

});
