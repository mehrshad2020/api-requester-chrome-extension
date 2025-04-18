// Background script for the Chrome extension
// This is a minimal service worker for the API Requester extension

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('API Requester extension installed');
  
  // Initialize storage for saving request history
  chrome.storage.local.get('requestHistory', (result) => {
    if (!result.requestHistory) {
      chrome.storage.local.set({ requestHistory: [] });
    }
  });
});



