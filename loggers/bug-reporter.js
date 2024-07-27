// bug-reporter.js

import { captureScreenshot, captureScreenshotUsingMediaShare } from './screenshot';

let sendReportAPIEndpoint = '/api/report-bug';

let buggyConfig = {
    screenshotMode: 'mediaShare'
}
/**
 * Set the bug report server URL.
 * @param {string} url - The URL to send bug reports to.
 */
function bugReporterConfig(config) {
    sendReportAPIEndpoint = config.sendReportAPIEndpoint;
    buggyConfig = {...buggyConfig, ...config }
}

/**
 * Send a bug report.
 */
const sendBugReport = async function (context) {

  console.log('sendReportAPIEndpoint', sendReportAPIEndpoint)

  let screenShot = null

  console.log('buggyConfig', buggyConfig)

  if (buggyConfig.screenshotMode === 'canvas') {
    screenShot = await captureScreenshot();
  } else if (buggyConfig.screenshotMode === 'mediaShare') {
    console.log('mediaShare')
    screenShot = await captureScreenshotUsingMediaShare();
  }
  const consoleLogs = window.consoleLogs;

  

  const formData = new FormData();
  formData.append('screenshot', screenShot);
  formData.append('consoleLogs', JSON.stringify(consoleLogs));
  formData.append('requestLogs', JSON.stringify(window.requestLogs));

    // if context then append context
    if (context) {
        formData.append('context', context)
    }

    // send system meta data
    const systemMetaData = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        colorDepth: window.screen.colorDepth,
        devicePixelRatio: window.devicePixelRatio,
        location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
    };

    console.log(window.requestLogs);

    formData.append('systemMetaData', JSON.stringify(systemMetaData));


  fetch(sendReportAPIEndpoint, {
    method: 'POST',
    body: formData,
  });
}

export { sendBugReport, bugReporterConfig };
