console.log('background running');
// function newTab() {
    
// }
// chrome.tabs.onActivated.addListener(async function(tabId) {
//     //window.alert('tes');
//     //const site = changeInfo.url;
//     const tab = await chrome.tabs.getCurrent();
//     console.log(tab);
// });
function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log(`Updated tab: ${tabId}`);
    console.log("Changed attributes: ", changeInfo);
    console.log("New tab Info: ", tabInfo);
    chrome.tabs.get(tabId, function(tab) {
        console.log('Tab changed. URL:', tab.url);
        // Do something with the URL (e.g., send it to your popup or perform other actions)
      });
  }
  
  chrome.tabs.onActivated.addListener(handleUpdated);