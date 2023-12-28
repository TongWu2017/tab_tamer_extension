loadSettings();

async function loadDivs(siteType) {
    var divList = (await chrome.storage.local.get(siteType));
    const ul = document.getElementById(siteType);
    ul.innerHTML = "";
    divList[siteType].forEach(element => {
        var div = document.createElement("div");
        div.id = element;
        div.textContent = element;
        var bu = document.createElement("button");
        bu.id = element;
        bu.textContent = "trash";
        div.appendChild(bu);
        ul.appendChild(div);
    });

}

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
            requestData();
            document.getElementById("startsession").addEventListener("click", StartStudying);
            document.getElementById("settings").addEventListener("click", gotoSettings);
            document.getElementById("inventory").addEventListener("click", gotoinventory);
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
            chrome.storage.local.get(siteType).then(async obj => {

                var productiveArray = obj[siteType];
                if (productiveArray.includes(domain)) {
                    productiveArray = productiveArray.filter(item => item != domain);

                }
                if (siteType == "productive") {
                    await chrome.storage.local.set({ productive: productiveArray });

                } else {
                    await chrome.storage.local.set({ unproductive: productiveArray });

                }
                loadDivs(siteType);
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
        chrome.storage.local.get(message.siteType).then(obj => {
            var productiveArray = obj[message.siteType]
            if (!productiveArray.includes(domain))
                productiveArray.push(domain);
            if (message.siteType == "productive") {
                chrome.storage.local.set({ productive: productiveArray });
            } else {
                chrome.storage.local.set({ unproductive: productiveArray });
            }
            loadDivs(message.siteType);
            buttonLoaded(buttonId, "Add");
        })
    }
})