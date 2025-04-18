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

// Listen for messages from popup
chrome.runtime.onMessage.addListener((
  request: { type: string; productId: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: { success: boolean; data?: any; error?: string }) => void
) => {
  if (request.type === 'GET_PRODUCT_INFO') {
    fetchProductInfo(request.productId)
      .then(data => {
        sendResponse({ success: true, data });
      })
      .catch(error => {
        sendResponse({ success: false, error: (error as Error).message });
      });
    
    // Return true to indicate that the response is asynchronous
    return true;
  }
  return false;
});

async function fetchProductInfo(productId: string): Promise<any> {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`https://your-company-api-domain.com/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
} 