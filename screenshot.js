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


export { captureScreenshot };
