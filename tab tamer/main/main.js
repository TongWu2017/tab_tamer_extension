coins = parseInt(localStorage.getItem('coins')) || 0;
// periods = 0;
// productiveHours = 0;
// productiveMinutes = 0;
// restHours = 0;
// restMinutes = 0;

happiness = 0;
xp = 0;
level = 1;
currentState = "x";
currentRemainingMinutes = -1;

loadMain();

setInterval(requestData, 1000);

function loadMain() {
    document.getElementById("startsession").addEventListener("click", StartStudying);
    document.getElementById("settings").addEventListener("click", gotoSettings);
    document.getElementById("inventory").addEventListener("click", gotoinventory);
    requestData();
    chrome.runtime.sendMessage({ from: "tabtamerSiteType" });
}

function requestData() {
    // console.log("reqdata called")
    chrome.runtime.sendMessage({ from: "tabtamerRequestPetStatus" })
    chrome.runtime.sendMessage({ from: "tabtamerRequestState", currentState: currentState });
    chrome.runtime.sendMessage({ from: "tabtamerRequestTime", currentRemainingMinutes: currentRemainingMinutes });
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.from == "tabtamerBackground") {
        // console.log(message);
        updateHTMLAttribute("happybar", "value", message.petStatus.happiness);
    }
    if (message.from == "tabtamerBackgroundState") {
        if (message.state == "z") {
            const x1 = notSessionDisplay();
            if (!x1) return;
        } else {
            const x1 = updateHTMLAttribute("current-stage-text", "innerHTML", message.state ? "Productive" : "Rest");
            const x2 = sessionDisplay();
            if (!(x1 && x2)) return;
        }
        currentStatus = message.state;

    }

    if (message.from == "tabtamerBackgroundRemaining") {
        const x1 = updateHTMLAttribute("time-remaining-number", "innerHTML", message.remainingMinutes);
        if (!x1) return;
        currentRemainingMinutes = message.remainingMinutes;
    }

    if (message.from == "tabtamerBackgroundSiteType") {
        const domain = message.domain;
        if (!domain) return;
        console.log("domain: " + domain);
        const makeProductiveButton = document.createElement("a");
        makeProductiveButton.id = "make-productive-button";
        makeProductiveButton.text = "Mark Site Productive";
        document.getElementById("toprightpanel").appendChild(makeProductiveButton);

        const makeUnproductiveButton = document.createElement("a");
        makeUnproductiveButton.id = "make-unproductive-button";
        makeUnproductiveButton.text = "Make Site Unproductive";
        document.getElementById("toprightpanel").appendChild(makeUnproductiveButton);

        makeProductiveButton.addEventListener("click", async function () {
            alert(domain + " marked as productive");
            const productiveObj = (await chrome.storage.local.get("productive")).productive;
            productiveObj[domain] = true;
            await chrome.storage.local.set({ productive: productiveObj });
            chrome.runtime.sendMessage({ from: "tabtamerTabUpdate" });
        })
        makeUnproductiveButton.addEventListener("click", async function () {
            alert(domain + " marked as unproductive");
            const productiveObj = (await chrome.storage.local.get("productive")).productive;
            productiveObj[domain] = false;
            await chrome.storage.local.set({ productive: productiveObj });
            chrome.runtime.sendMessage({ from: "tabtamerTabUpdate" });
        })
    }
})






// document.addEventListener("DOMContentLoaded", function () {
//     var periodInput = document.getElementById("period");
//     coins = parseInt(localStorage.getItem('coins')) || 0;
//     var coinElement = document.getElementById("coinamount");
//     if (coinElement) {
//         coinElement.innerHTML = coins;
//     }
//     if (periodInput) {
//         console.log("this: " + this)
//         periodInput.addEventListener("input", function () {
//             PeriodInput(this, 2);
//         });
//     }
//     var productiveHoursInput = document.getElementById("productivehours");
//     if (productiveHoursInput) {
//         productiveHoursInput.addEventListener("input", function () {
//             ProductiveHoursInput(this, 2);
//         });
//     }
//     var productiveMinutesInput = document.getElementById("productiveminutes");
//     if (productiveMinutesInput) {
//         productiveMinutesInput.addEventListener("input", function () {
//             ProductiveMinutesInput(this, 2);
//         });
//     }
//     var restHoursInput = document.getElementById("resthours");
//     if (restHoursInput) {
//         restHoursInput.addEventListener("input", function () {
//             RestHoursInput(this, 2);
//         });
//     }
//     var restMinutesInput = document.getElementById("restminutes");
//     if (restMinutesInput) {
//         restMinutesInput.addEventListener("input", function () {
//             RestMinutesInput(this, 2);
//         });
//     }
// });

// function PeriodInput(element, maxDigits) {
//     periods = element.value.replace(/\D/g, ''); // Remove non-numeric characters
//     if (periods.length > maxDigits) {
//         element.value = periods.slice(0, maxDigits); // Truncate to the first maxDigits characters
//     }
// }

// function ProductiveHoursInput(element, maxDigits) {
//     productiveHours = element.value.replace(/\D/g, ''); // Remove non-numeric characters
//     if (productiveHours.length > maxDigits) {
//         element.value = productiveHours.slice(0, maxDigits); // Truncate to the first maxDigits characters
//     }
// }

// function ProductiveMinutesInput(element, maxDigits) {
//     productiveMinutes = element.value.replace(/\D/g, ''); // Remove non-numeric characters
//     console.log("productiveMinutes: " + productiveMinutes + " maxDigits: " + maxDigits + " productiveMinutes.length: " + productiveMinutes.length + " productiveMinutes.length > maxDigits: " + productiveMinutes.length > maxDigits + " productiveMinutes.slice(0, maxDigits): " + productiveMinutes.slice(0, maxDigits) + " productiveMinutes.slice(0, maxDigits).length: " + productiveMinutes.slice(0, maxDigits).length);
//     if (productiveMinutes.length > maxDigits) {
//         element.value = productiveMinutes.slice(0, maxDigits); // Truncate to the first maxDigits characters
//     }
// }

// function RestHoursInput(element, maxDigits) {
//     restHours = element.value.replace(/\D/g, ''); // Remove non-numeric characters
//     if (restHours.length > maxDigits) {
//         element.value = restHours.slice(0, maxDigits); // Truncate to the first maxDigits characters
//     }
// }

// function RestMinutesInput(element, maxDigits) {
//     restMinutes = element.value.replace(/\D/g, ''); // Remove non-numeric characters
//     if (restMinutes.length > maxDigits) {
//         element.value = restMinutes.slice(0, maxDigits); // Truncate to the first maxDigits characters
//     }
// }

function StartStudying() {
    coin_element = document.getElementById("coinamount");
    coins += 1;
    localStorage.setItem('coins', coins); // Update and store the 'coins' value
    coin_element.innerHTML = coins;

    var periods = parseInt(document.getElementById("period1").value.replace(/\D/g, ''));
    var productiveHours = parseInt(document.getElementById("productivityHours").value.replace(/\D/g, ''));
    var productiveMinutes = parseInt(document.getElementById("productivityMinutes").value.replace(/\D/g, ''));
    var restHours = parseInt(document.getElementById("restHours").value.replace(/\D/g, ''));
    var restMinutes = parseInt(document.getElementById("restMinutes").value.replace(/\D/g, ''));

    if (isNaN(periods)) {
        alert("Please enter a valid number of periods");
        return;
    }
    if (isNaN(productiveHours)) {
        productiveHours = 0;
    }
    if (isNaN(productiveMinutes)) {
        productiveMinutes = 0;
    }
    if (isNaN(restHours)) {
        restHours = 0;
    }
    if (isNaN(restMinutes)) {
        restMinutes = 0;
    }

    chrome.action.setBadgeText({ text: "test" });
    chrome.runtime.sendMessage({ from: "tabtamerStart", tracking: true, productiveMinutes: 60 * productiveHours + productiveMinutes, restMinutes: 60 * restHours + restMinutes, periods: periods });
    console.log("You have started studying!");

}

function sessionDisplay() {
    try {
        document.getElementById("stopsession").style.display = "";
        document.getElementById("periods-remaining").style.display = "";
        document.getElementById("current-stage").style.display = "";
        document.getElementById("time-remaining").style.display = "";

        document.getElementById("startsession").style.display = "none";
        document.getElementById("period-input-div").style.display = "none";
        document.getElementById("productivity-input-div").style.display = "none";
        document.getElementById("rest-input-div").style.display = "none";
        return true;
    } catch {
        return false;
    }
}

function notSessionDisplay() {
    try {
        document.getElementById("stopsession").style.display = "none";
        document.getElementById("periods-remaining").style.display = "none";
        document.getElementById("current-stage").style.display = "none";
        document.getElementById("time-remaining").style.display = "none";

        document.getElementById("startsession").style.display = "";
        document.getElementById("period-input-div").style.display = "";
        document.getElementById("productivity-input-div").style.display = "";
        document.getElementById("rest-input-div").style.display = "";
        return true;
    } catch {
        return false;
    }
}

function gotoSettings() {
    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('settings/settings.html');

    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            console.log("settings clicked");
            addPageScript("settings/settings.js");
            try {
                loadSettings();
            } catch {
            }
        });

}
function gotoinventory() {
    console.log("inv")

    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('inventory/inventory.html');

    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            addPageScript("inventory/inventory.js");
        });

}

async function loadDivs(siteType) {
    var productiveObj = (await chrome.storage.local.get("productive")).productive;
    const ul = document.getElementById(siteType);
    const targetBoolean = (siteType == "productive");
    ul.innerHTML = "";
    Object.keys(productiveObj).forEach(element => {
        if (productiveObj[element] == targetBoolean) {
            var div = document.createElement("div");
            div.id = element;
            div.textContent = element;
            var bu = document.createElement("button");
            bu.id = element;
            bu.textContent = "trash";
            div.appendChild(bu);
            ul.appendChild(div);
        }
    });
}

function updateHTMLAttribute(id, attribute, value) {
    if (document.getElementById(id) == null) {
        return false;
    }
    document.getElementById(id)[attribute] = value;
    return true;
}

function loadSettings() {

    loadDivs("productive");
    loadDivs("unproductive");
    trashButtonListener("productive");
    trashButtonListener("unproductive");

    document.getElementById("addGoodSiteBtn").addEventListener("click", addGoodSite);
    document.getElementById("addBadSiteBtn").addEventListener("click", addBadSite);

    document.getElementById("settingsBack").addEventListener("click", gotoMain);

}