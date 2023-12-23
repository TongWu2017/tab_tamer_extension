// chrome.runtime.connect();
// console.log("content script loaded");

// const domain = location.hostname;

// chrome.storage.local.get().then(obj => {
//     if(!obj.started) return
//     if (obj.productive.includes(domain)) {
//         chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:1});
//     } else if (obj.unproductive.includes(domain)) {
//         chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:-1});
//     } else {
//         chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:0});
//     }
// })

// chrome.runtime.onMessage.addListener(message => {
//     if (message.from == "tabtamerBgTabChange") {
//         alert(location.hostname)
//     }
// })