loadDivs("productive");
loadDivs("unproductive");
trashButtonListener("productive");
trashButtonListener("unproductive");

document.getElementById("addGoodSiteBtn").addEventListener("click", addGoodSite);

async function addGoodSite() {
    var domain = null;
    const inputURL = document.getElementById("siteToAddGood").value;
    buttonLoading("addGoodSiteBtn", "Adding...");
    chrome.runtime.sendMessage({ from: "resolveURL", url: inputURL }, response => {
        if (!response) {
            buttonLoaded("addGoodSiteBtn", "Invalid URL");
            return;
        }
        console.log("response recieved");
        console.log(response);
        domain = (new URL(response)).hostname;
        chrome.storage.local.get("productive").then(obj => {
            var productiveArray = obj.productive
            if (!productiveArray.includes(domain))
                productiveArray.push(domain);
            chrome.storage.local.set({ productive: productiveArray });
            loadDivs("productive");
            buttonLoaded("addGoodSiteBtn", "Add");
    
        })
    })

}

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
document.getElementById("addBadSiteBtn").addEventListener("click", addBadSite);

function addBadSite() {
    var domain = null;
    try {
        domain = (new URL(document.getElementById("siteToAddBad").value)).hostname;
    } catch {
        alert(document.getElementById("siteToAddGood").value + " is not a valid url")
        return;
    }

    chrome.storage.local.get("unproductive").then(obj => {
        var unproductiveArray = obj.unproductive
        if (!unproductiveArray.includes(domain))
            unproductiveArray.push(domain);
        chrome.storage.local.set({ unproductive: unproductiveArray });
        loadDivs("unproductive");

    })

}
document.getElementById("settingsBack").addEventListener("click", gotoMain);

function gotoMain() {
    console.log("gotomain called")

    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('main/main.html');

    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            addPageScript("./main/main.js");
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