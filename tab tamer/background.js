//console.log('background running');
var bghappiness = false;
var bgxp = false;
var statusLoaded = false;

var productive = 0;
var tracking = false;

var petObj = {};

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    // if (message.from == "tabtamerContentScript") {
    //     productive = message.productive;
    // }
    if (message.from == "tabtamerStart") {
        console.log("startmsg")
        tracking = message.tracking;
        if (tracking) {
            loop();
        }
    }
    if (message.from == "tabtamerRequestPetStatus") {
        if (!statusLoaded) {
            await loadPetStatus();
        }
        console.log("req stat");
        chrome.runtime.sendMessage({
            from: "tabtamerBackground",
            petName: message.petName,
            petStatus: { happiness: bghappiness, xp: bgxp }
        })
    }
});

const loop = async () => {
    while (tracking) {
        updatePetStatus();
        await sleep(1000);
    }
}

async function updatePetStatus() {
    if (!statusLoaded) {
        await loadPetStatus();
    }

    bghappiness += productive * 60;
    if (productive > 0) bgxp += productive * 60;


};

async function loadPetStatus() {
    const petName = (await (chrome.storage.local.get("currentPet"))).currentPet;
    const petStatus = (await (chrome.storage.local.get("petData"))).petData;
    petObj = petStatus[petName];
    bghappiness = petObj.happiness;
    bgxp = petObj.xp;
    statusLoaded = true;
    return;
}

sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// function newTab() {

// }

chrome.tabs.onActivated.addListener(async function (tab) {
    console.log("tab activated")
    const t = await chrome.tabs.get(tab.tabId);
    const domain = new URL(t.url).hostname;

    const obj = await chrome.storage.local.get();

    if(!obj.started) return
    console.log(obj.productive[0])
    console.log(obj.unproductive[0])
    console.log(domain)
    if (obj.productive.includes(domain)) {
        console.log("you are on a productive site")
        productive = 1;
    } else if (obj.unproductive.includes(domain)) {
        console.log("you are on an unproductive site")
        productive = -1;
    } else {
        console.log("you are on a neutral site")
        productive = 0;
    }
});

// chrome.tabs.onCreated.addListener(function (tab) {
//     console.log("tab created")
//     console.log(tab)


// });

// chrome.tabs.onUpdated.addListener(function (tab, tab2, tab3) {
//     console.log("tab updated")
//     console.log(tab)
//     console.log(tab2)
//     console.log(tab3)


// });

function activate(tab) {

//     console.log("activate is called")
// console.log(tab.name)
//     chrome.runtime.sendMessage({ from: "tabtamerBgTabChange" }).catch(console.error);

}
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