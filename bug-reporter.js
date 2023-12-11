// bug-reporter.js

import { captureScreenshot, captureScreenshotUsingMediaShare, captureScreenshotUsingCanvas } from './screenshot';

let sendReportAPIEndpoint = '/api/report-bug';

/**
 * Set the bug report server URL.
 * @param {string} url - The URL to send bug reports to.
 */
function bugReporterConfig(config) {
    sendReportAPIEndpoint = config.sendReportAPIEndpoint;
}

/**
 * Send a bug report.
 */
const sendBugReport = async function (context) {

  console.log('sendReportAPIEndpoint', sendReportAPIEndpoint)

  const screenshot = await captureScreenshotUsingCanvas();
  const consoleLogs = window.consoleLogs;

  console.log('screenshot', screenshot);

  const formData = new FormData();
  // formData.append('screenshot', screenshot);
  formData.append('consoleLogs', JSON.stringify(consoleLogs));

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
