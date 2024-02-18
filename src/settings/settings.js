loadSettings();



function addGoodSite() {
    const inputURL = document.getElementById("siteToAddGood").value;
    buttonLoading("addGoodSiteBtn", "Adding...");
    chrome.runtime.sendMessage({ from: "resolveURL", url: inputURL, siteType: "productive" })
}

function addBadSite() {
    const inputURL = document.getElementById("siteToAddBad").value;
    buttonLoading("addBadSiteBtn", "Adding...");
    chrome.runtime.sendMessage({ from: "resolveURL", url: inputURL, siteType: "unproductive" })

}

function gotoMain() {
    console.log("gotomain called")

    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('main/main.html');

    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            addPageScript("./main/main.js");
            loadMain();
        });

}

function urlToDomain(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
}

function trashButtonListener(siteType) {
    const siteListUl = document.getElementById(siteType);
    siteListUl.addEventListener("click", event => {

        if (event.target.nodeName == "BUTTON") {
            const domain = event.target.id;
            chrome.storage.local.get("productive").then(async obj => {

                // var productiveArray = obj[siteType];
                // if (productiveArray.includes(domain)) {
                //     productiveArray = productiveArray.filter(item => item != domain);

                // }
                const productiveObj = obj.productive;
                delete productiveObj[domain];
                await chrome.storage.local.set({ productive: productiveObj });
                loadDivs("productive");
                loadDivs("unproductive");
            })
        }
    })
}

function buttonLoading(buttonId, text) {
    document.getElementById(buttonId).disabled = true;
    document.getElementById(buttonId).textContent = text;
}

function buttonLoaded(buttonId, text) {
    document.getElementById(buttonId).disabled = false;
    document.getElementById(buttonId).textContent = text;
}

chrome.runtime.onMessage.addListener(message => {
    if (message.from == "tabtamerBackgroundURLresolved") {
        console.log("response recieved");
        console.log(message);
        const buttonId = message.siteType == "productive" ? "addGoodSiteBtn" : "addBadSiteBtn";
        if (!message.url) {
            buttonLoaded(buttonId, "Invalid URL");
            return;
        }
        // console.log("response recieved");
        // console.log(response);
        const domain = (new URL(message.url)).hostname;
        chrome.storage.local.get("productive").then(obj => {
            const productiveObj = obj.productive
            productiveObj[domain] = message.siteType == "productive" ? true : false;
            chrome.storage.local.set({ productive: productiveObj });
            loadDivs("productive");
            loadDivs("unproductive");
            buttonLoaded(buttonId, "Add");
        })
    }
})