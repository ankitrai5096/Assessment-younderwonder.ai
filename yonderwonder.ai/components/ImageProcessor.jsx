import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const ImageProcessor = ({ url }) => {
  
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
              background: black;
              overflow: hidden;
              touch-action: none;
            }
            .container {
              position: relative;
              width: 100vw;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              user-select: none;
            }
            .bw, .original {
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .bw {
              filter: grayscale(100%);
              clip-path: inset(0 calc(100% - var(--clip)) 0 0);
            }
            .original {
              clip-path: inset(0 0 0 var(--clip));
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
  
            separator.addEventListener('mousedown', (e) => {
              isDragging = true;
            });
  
            document.addEventListener('mousemove', (e) => {
              if (isDragging) {
                updateClip(e.clientX);
              }
            });
  
            document.addEventListener('mouseup', () => {
              isDragging = false;
            });
  
            separator.addEventListener('touchstart', (e) => {
              isDragging = true;
            });
  
            document.addEventListener('touchmove', (e) => {
              if (isDragging) {
                updateClip(e.touches[0].clientX);
              }
            });
  
            document.addEventListener('touchend', () => {
              isDragging = false;
            });
  
            updateClip(window.innerWidth / 2);
          </script>
        </body>
      </html>
    `;
  }

  return <WebView originWhitelist={['*']} source={{ html: getImageEmbedHTML(url) }} style={styles.imagePreview} />;
};

export default ImageProcessor;

const styles = StyleSheet.create({
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
});
