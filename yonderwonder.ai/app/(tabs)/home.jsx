import { useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import CameraUI from '../../components/CameraUI';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter()
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      setVideo(null);

      router.push(`/Editor/ImageEditor?imageUri=${encodeURIComponent(photoData.uri)}`);
    }
  }


  async function recordVideo() {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const videoData = await cameraRef.current.recordAsync();
        setVideo(videoData.uri);
        setPhoto(null);
      } catch (error) {
        console.error('Recording failed:', error);
      } finally {
        setIsRecording(false);
      }
    }
  }
  
  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        console.error('Stop recording failed:', error);
      }
    }
  }

  function handleBack() {
   router.replace("/")
  }

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <View style={{alignItems:'center'}}>
        <TouchableOpacity style={styles.captureButton} onPress={() => setShowCamera(true)}>
          <Ionicons name="camera" size={30} color="white" />
          <Text style={styles.captureText}>Capture</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.captureButton} onPress={() => router.push('/UrlEditor/MainUrlScreen')}>
         <Ionicons name="link" size={30} color="white" />
         <Text style={styles.captureText}>Paste a link </Text>
       </TouchableOpacity>
       </View>
      ) : photo || video ? (
        <View style={styles.previewContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.preview} />
          ) : (
            <Video
            source={{ uri: video }}
            style={styles.preview}
            useNativeControls
            resizeMode="cover"
            shouldPlay
            isLooping
          />
          )}
        </View>
      ) : (
        <CameraUI
          cameraRef={cameraRef}
          facing={facing}
          toggleCameraFacing={toggleCameraFacing}
          takePhoto={takePhoto}
          recordVideo={recordVideo}
          stopRecording={stopRecording}
          isRecording={isRecording}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical:5,
    width: "100%",
    marginBottom: 20,
    gap: 5,
  },
  captureText: {
    fontSize: 18,
    color: 'white',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  preview: {
    width: '80%',
    height: '70%',
    borderRadius:20
  },
});
