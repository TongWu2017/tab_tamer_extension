
//console.log('background running');
var bghappiness = false;
var bgxp = false;
var statusLoaded = false;

var productive = 0;
var tracking = false;

var petObj = {};

var remainingMinutes = -1;
var nextRemainingMinutes = -1;
var startTime = -1;

var productiveMinutes = -1;
var restMinutes = -1;
var periods = -1;
var state = 'z'; //1 for productive, 0 for rest, x for unknown, z for not started
var nextState = 'z';

//TODO: async loop that replaces the loop method
//the loop should update the pet status every second if tracking is true
//the loop should also keep track of the productive cycle time and update the badge text to display remaining time
setInterval(() => {
    if (tracking) {
        updateStateAndRemainingMinutes();
        if (nextRemainingMinutes != remainingMinutes) {
            chrome.action.setBadgeText({ text: nextRemainingMinutes.toString() });
            remainingMinutes = nextRemainingMinutes;
        }
        if (nextState != state) {
            if (nextState == 1) {
                chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
            } else if (nextState == 0) {
                chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
            } else {
                chrome.action.setBadgeBackgroundColor({ color: "#000000" });
            }
            state = nextState;
        }
        updatePetStatus();
    }
}, 1000);


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    // if (message.from == "tabtamerContentScript") {
    //     productive = message.productive;
    // }
    if (message.from == "tabtamerStart") {
        console.log("startmsg")
        productiveMinutes = message.productiveMinutes;
        restMinutes = message.restMinutes;
        periods = message.periods;
        tracking = message.tracking;

        startTime = Date.now();
        // if (tracking) {
        //     loop();
        // }
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
    if (message.from == "resolveURL") {
        const url = message.url.startsWith("http") ? message.url : "https://" + message.url;
        fetch(url, { method: 'HEAD', redirect: 'follow' }).then(res => {
            sendResponse(res.url);
        }).catch(err => {
            sendResponse(false);
        })
    }
});

// const loop = async () => {
//     while (tracking) {
//         updatePetStatus();
//         await sleep(1000);
//     }
// }

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

chrome.tabs.onActivated.addListener(tab => tabUpdate(tab.tabId));
chrome.tabs.onUpdated.addListener((tabId) => tabUpdate(tabId));

// chrome.tabs.onCreated.addListener(function (tab) {
//     console.log("tab created")
//     console.log(tab)


async function tabUpdate(tabId) {
    const t = await chrome.tabs.get(tabId);
    const domain = new URL(t.url).hostname;

    const obj = await chrome.storage.local.get();

    if (!obj.started) return
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
}// });

chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
    if (message.type === "image") {
        fetch('<https://api.tinify.com/shrink>', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa('api:xxxxxx')}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ source: { url: message.url } })
        }).then(res => {
            return res.json();
        }).then(res => {
            senderResponse(res);
        })
    }
    return true
});

const updateStateAndRemainingMinutes = () => {
    const periodMinutes = productiveMinutes + restMinutes;
    const timeSinceStart = (Date.now() - startTime);
    const timeSincePeriodStart = timeSinceStart % (periodMinutes * 60000);
    const periodsPassed = timeSinceStart / (periodMinutes * 60000);
    console.log("time since start: " + timeSinceStart);
    console.log("time since period start: " + timeSincePeriodStart);
    console.log("periods passed: " + periodsPassed);
    console.log("periods: " + periods);
    console.log("periodsPassed >= periods: " + (periodsPassed >= periods)   );
    if (periodsPassed >= periods) {
        nextState = 'z';
        console.log("nextState: " + nextState);
        return;
    }
    if (timeSincePeriodStart < productiveMinutes * 60000) {
        nextState = 1;
        nextRemainingMinutes = Math.floor((productiveMinutes * 60000 - timeSincePeriodStart) / 60000);
        console.log("nextState: " + nextState);
        return;
    }
    nextState = 0;
    nextRemainingMinutes = Math.floor((periodMinutes * 60000 - timeSincePeriodStart) / 60000);
    console.log("nextState: " + nextState);

}

// chrome.tabs.onUpdated.addListener(function (tab, tab2, tab3) {
//     console.log("tab updated")
//     console.log(tab)
//     console.log(tab2)
//     console.log(tab3)


// });

// function activate(tab) {

//     console.log("activate is called")
// console.log(tab.name)
//     chrome.runtime.sendMessage({ from: "tabtamerBgTabChange" }).catch(console.error);

// }
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