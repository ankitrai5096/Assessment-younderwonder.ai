import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';

const ImageProcessor = () => {
  const { imageUri } = useLocalSearchParams();
  const [base64Image, setBase64Image] = useState(null);
  const webViewRef = useRef(null);

  // Sliders state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(1);

  useEffect(() => {
    console.log("Raw Image URI:", imageUri);

    if (imageUri && imageUri.startsWith("file://")) {
      RNFS.readFile(imageUri, "base64")
        .then(base64 => {
          setBase64Image(`data:image/jpeg;base64,${base64}`);
          console.log("Converted Image to Base64 Successfully");
        })
        .catch(error => console.error("Error converting image to base64:", error));
    } else {
      setBase64Image(imageUri);
    }
  }, [imageUri]);

  // Update image filters (only for .bw)
  const updateFilters = () => {
    const filterStyle = `grayscale(100%) brightness(${brightness}%) contrast(${contrast}%)`;
    webViewRef.current?.injectJavaScript(`
      document.querySelector('.bw').style.filter = "${filterStyle}";
    `);
  };

  useEffect(() => {
    if (webViewRef.current) {
      updateFilters();
    }
  }, [brightness, contrast, sharpness]);

  function getImageEmbedHTML(url) {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: black;
            }
            .container {
              position: relative;
              width: 80vw;
              height: 80vh;
              display: flex;
              justify-content: center;
              align-items: center;
              user-select: none;
            }
            .original {
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .bw {
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: grayscale(100%) brightness(100%) contrast(100%);
              clip-path: inset(0 calc(100% - var(--clip)) 0 0);
            }
            .separator {
              position: absolute;
              width: 6px;
              height: 100%;
              background: white;
              left: var(--clip);
              transform: translateX(-50%);
              cursor: ew-resize;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img class="original" src="${url}" />
            <img class="bw" src="${url}" />
            <div class="separator" id="separator"></div>
          </div>
          <script>
            const separator = document.getElementById('separator');
            let isDragging = false;
  
            function updateClip(positionX) {
              const percentage = Math.max(0, Math.min(100, (positionX / window.innerWidth) * 100));
              document.documentElement.style.setProperty('--clip', percentage + '%');
              separator.style.left = percentage + '%';
            }
  
            separator.addEventListener('mousedown', () => { isDragging = true; });
            document.addEventListener('mousemove', (e) => { if (isDragging) updateClip(e.clientX); });
            document.addEventListener('mouseup', () => { isDragging = false; });
            separator.addEventListener('touchstart', () => { isDragging = true; });
            document.addEventListener('touchmove', (e) => { if (isDragging) updateClip(e.touches[0].clientX); });
            document.addEventListener('touchend', () => { isDragging = false; });

            updateClip(window.innerWidth / 2);
          </script>
        </body>
      </html>
    `;
  }

  return (
    <View style={styles.container}>
      {base64Image ? (
        <>
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: getImageEmbedHTML(base64Image) }}
            style={styles.imagePreview}
            onLoadEnd={updateFilters}
          />
          <View style={styles.controls}>
            <Text style={styles.label}>Brightness: {brightness}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={brightness}
              onValueChange={setBrightness}
              onSlidingComplete={updateFilters}
            />

            <Text style={styles.label}>Contrast: {contrast}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={contrast}
              onValueChange={setContrast}
              onSlidingComplete={updateFilters}
            />

            <Text style={styles.label}>Sharpness: {sharpness}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={0.1}
              value={sharpness}
              onValueChange={setSharpness}
              onSlidingComplete={() => {
                setContrast(contrast + sharpness * 10);
                updateFilters();
              }}
            />
          </View>
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.label}>Loading Image...</Text>
        </View>
      )}
    </View>
  );
};

export default ImageProcessor;

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imagePreview: {
    flex: 0.7,
    width: '100%',
  },
  controls: {
    flex: 0.3,
    padding: 10,
    backgroundColor: "#111",
  },
  slider: {
    width: "90%",
    alignSelf: "center",
  },
  label: {
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
