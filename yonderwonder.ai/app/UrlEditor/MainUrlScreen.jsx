import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ImageProcessor from '../../components/ImageProcessor';

const MainUrlScreen = () => {
  const [url, setUrl] = useState('');
  const [previewType, setPreviewType] = useState(null);
  const router = useRouter();

  function handleUrlChange(text) {
    setUrl(text);
    router.push(`/Editor/ImageEditor?imageUri=${encodeURIComponent(text)}`);
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      setPreviewType('youtube');
    } else if (text.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp)$/) || text.includes('encrypted-tbn0.gstatic.com')) {
      setPreviewType('image');
    } else {
      setPreviewType(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Paste an Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter an image URL"
        value={url}
        onChangeText={handleUrlChange}
      />

      {previewType === 'image' && <ImageProcessor url={url} />}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainUrlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
