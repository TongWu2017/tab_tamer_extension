const domain = location.hostname;

chrome.storage.local.get().then(obj => {
    if (obj.productive.includes(domain)) {
        chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:1});
    } else if (obj.unproductive.includes(domain)) {
        chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:-1});
    } else {
        chrome.runtime.sendMessage({from: "tabtamerContentScript", productive:0});
    }
})