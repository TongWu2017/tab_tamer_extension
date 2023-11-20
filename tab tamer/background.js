console.log('background running');
var happiness = false;
var xp = false;
var statusLoaded = false;

var productive = 0;
var tracking = false;

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.from == "tabtamerContentScript") {
        productive = message.productive;
    }
    if (message.from == "tabtamerStart") {
        tracking = message.tracking;
        if (tracking) {
            loop();
        }
    }
    if (message.from == "tabtamerRequestPetStatus") {
        if (!statusLoaded) {
            await loadPetStatus();
        }
        chrome.runtime.sendMessage({
            from: "tabtamerBackground",
            petName: message.petName,
            petStatus: {happiness: happiness, xp: xp}
        })
    }
  });

  const loop = async () => {
    while(tracking) {
        updatePetStatus();
        await sleep(1000);
    }
  }

  async function updatePetStatus () {
    if (!statusLoaded) {
        await loadPetStatus();
    }
    happiness += productive;
    if (productive > 0) xp += productive;
  };

  async function loadPetStatus() {
    const petName = (await (chrome.storage.local.get("petName"))).petName;
    const petObj = (await (chrome.storage.local.get(petName)))[petName];
    happiness = petObj.happiness;
    xp = petObj.xp;
    statusLoaded = true;
    return;
  }

  sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// function newTab() {
    
// }
// chrome.tabs.onActivated.addListener(async function(tabId) {
//     //window.alert('tes');
//     //const site = changeInfo.url;
//     const tab = await chrome.tabs.getCurrent();
//     console.log(tab);
// });
/*
function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log(`Updated tab: ${tabId}`);
    console.log("Changed attributes: ", changeInfo);
    console.log("New tab Info: ", tabInfo);
    chrome.tabs.get(tabId, function(tab) {
        console.log('Tab changed. URL:', tab.url);
        // Do something with the URL (e.g., send it to your popup or perform other actions)
      });
  }
  
  chrome.tabs.onActivated.addListener(handleUpdated);*/