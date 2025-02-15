import { View, Image } from 'react-native';
import { Video } from 'expo-av';

export default function Preview({ photo, video }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo ? (
        <Image source={{ uri: photo }} style={{ width: '80%', height: '60%' }} />
      ) : (
        <Video source={{ uri: video }} style={{ width: '80%', height: '60%' }} useNativeControls resizeMode="contain" />
      )}
    </View>
  );
}
