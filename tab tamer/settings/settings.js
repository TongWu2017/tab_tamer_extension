loadDivs("productive");
loadDivs("unproductive");
trashButtonListener("productive");
trashButtonListener("unproductive");

document.getElementById("addGoodSiteBtn").addEventListener("click", addGoodSite);

function addGoodSite() {
    var domain = null;
    try {
        domain = (new URL(document.getElementById("siteToAddGood").value)).hostname;
    } catch {
        alert(document.getElementById("siteToAddGood").value + " is not a valid url")
        return;
    }


    chrome.storage.local.get("productive").then(obj => {

        var productiveArray = obj.productive
        if (!productiveArray.includes(domain))
            productiveArray.push(domain);
        chrome.storage.local.set({ productive: productiveArray });
        loadDivs("productive");

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

    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('main/main.html');

    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            addPageScript("main/main.js");
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

                var productiveArray = obj.productive
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