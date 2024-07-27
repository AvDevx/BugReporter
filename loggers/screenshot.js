import html2canvas from 'html2canvas';

async function captureScreenshot() {
  try {
    console.log('Capturing screenshot using html2canvas...');

    const canvas = await html2canvas(document.body, {
      onclone: (document) => {
        const clonedCanvas = document.querySelector('canvas');

        // Apply the willReadFrequently attribute
        if (clonedCanvas) {
          clonedCanvas.getContext('2d').willReadFrequently = true;
        }
      },
    });

    const screenshotDataUrl = canvas.toDataURL('image/png');

    console.log('Screenshot captured successfully.');
    return screenshotDataUrl;
  } catch (e) {
    console.error('Error capturing screenshot:', e);
    throw e;
  }
}


const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 40px;

  color: white;
  font-size: 24px;
  z-index: 9999;
`;


// add image inside of the overlay div with working link

import image from '../assets/arrow-with-scribble.png';

overlay.innerHTML = `<img src="${image}" style="width: 100px; height: 100px; margin-right: 20px; filter: invert(1);
transform: scaleX(-1) rotate(257deg);" />`;

overlay.innerHTML += '<p style="color:white" class="bold">Please allow for the system to take a <br>screen shot, this data could be crucial to for debugging. <br>Thank you!</p>';


overlay.style.display = 'flex';


async function captureScreenshotUsingMediaShare() {
  try {

   

    // Append the overlay to the body
    document.body.appendChild(overlay);


    overlay.style.display = 'flex';
    // Get a stream of the screen

    let mediaStream = null

    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
        preferCurrentTab: true,
      });
    } catch (e) {
      console.log('error', e);
    } finally {
      overlay.style.display = 'none';
    }

    // add a delay of 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
    

    // Create a video element to display the screen capture
    const videoElement = document.createElement('video');
    videoElement.srcObject = mediaStream;

    // Create an offscreen canvas
    const offscreenCanvas = new OffscreenCanvas(window.innerWidth, window.innerHeight);
    const offscreenContext = offscreenCanvas.getContext('2d');

    // Wait for the video to be loaded and start playing
    return new Promise((resolve, reject) => {
      // Wait for the video to be loaded and start playing
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play().then(() => {
          // Draw the video onto the offscreen canvas
          offscreenContext.drawImage(videoElement, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

          // Stop screen sharing
          const tracks = mediaStream.getTracks();
          tracks.forEach(track => track.stop());

          // Save the canvas as a blob
          offscreenCanvas.convertToBlob({ type: 'image/png' }).then(blob => {
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              const base64data = reader.result;
              
              resolve(base64data); // Resolve the promise with base64 data
            };
          });
        });
      });

      // Append the video element to the body
      document.body.appendChild(videoElement);
    });
  } catch (e) {
    console.error('Error capturing screen:', e);
    
  }
}

export { captureScreenshot, captureScreenshotUsingMediaShare };
