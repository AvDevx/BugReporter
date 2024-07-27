// index.js

import { bugReporterConfig, sendBugReport } from "./loggers/bug-reporter";

(function () {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;
  

  window.consoleLogs = []; // window variable to store all console logs


  // over loading console.log and console.error
  console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    window.consoleLogs.push(args);
  };

  console.error = function (...args) {
    originalConsoleError.apply(console, args);
    window.consoleLogs.push(args);
  };

  // listen all xhr calls that the app is making and save all the requests in window variable
  window.requestLogs = [];

  const originalOpen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function (...args) {
    originalOpen.apply(this, args);

    
    window.requestLogs.push(args);

    console.log('request', args);
  };


})();

export { bugReporterConfig, sendBugReport };
