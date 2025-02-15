import { useState } from 'react';
import { CameraView } from 'expo-camera';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CameraUI = ({ 
  cameraRef, 
  facing, 
  toggleCameraFacing, 
  takePhoto, 
  recordVideo, 
  stopRecording, 
  isRecording,
}) => {
  const router = useRouter();
  const [cameraMode, setCameraMode] = useState('picture');

  return (
    <CameraView 
      mode={cameraMode}
      style={styles.camera} 
      facing={facing} 
      ref={cameraRef}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={cameraMode === 'picture' ? takePhoto : (isRecording ? stopRecording : recordVideo)}
        >
          <Ionicons 
            name={cameraMode === 'video' && isRecording ? 'stop' : 'radio-button-on'} 
            size={40} 
            color={cameraMode === 'video' ? 'red' : 'white'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.modeContainer}>
        <TouchableOpacity onPress={() => setCameraMode('picture')}>
          <Text style={[styles.modeText, cameraMode === 'picture' && styles.activeMode]}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCameraMode('video')}>
          <Text style={[styles.modeText, cameraMode === 'video' && styles.activeMode]}>Video</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  controlsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 50,
  },
  captureButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 50,
  },
  modeContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    width: '100%',
    justifyContent: 'center',
    gap: 40,
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 5,
  },
  activeMode: {
    borderBottomWidth: 3,
    borderBottomColor: 'green',
  },
});

export default CameraUI;