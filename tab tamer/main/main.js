coins = parseInt(localStorage.getItem('coins')) || 0;
periods = 0;
productiveHours = 0;
productiveMinutes = 0;
restHours = 0;
restMinutes = 0;

happiness = 0;
xp = 0;
level = 1;

chrome.runtime.sendMessage({ from: "tabtamerRequestPetStatus" })

chrome.runtime.onMessage.addListener(message => {
    if (message.from == "tabtamerBackground") {
        console.log(message);
        document.getElementById("happybar").value = message.petStatus.happiness;
    }
})



document.addEventListener('DOMContentLoaded', function () {

})
document.getElementById("startsession").addEventListener("click", StartStudying);
document.getElementById("settings").addEventListener("click", gotoSettings);
document.getElementById("inventory").addEventListener("click", gotoinventory);

document.addEventListener("DOMContentLoaded", function () {
    var periodInput = document.getElementById("period");
    coins = parseInt(localStorage.getItem('coins')) || 0;
    var coinElement = document.getElementById("coinamount");
    if (coinElement) {
        coinElement.innerHTML = coins;
    }
    if (periodInput) {
        periodInput.addEventListener("input", function () {
            PeriodInput(this, 2);
        });
    }
    var productiveHoursInput = document.getElementById("productivehours");
    if (productiveHoursInput) {
        productiveHoursInput.addEventListener("input", function () {
            ProductiveHoursInput(this, 2);
        });
    }
    var productiveMinutesInput = document.getElementById("productiveminutes");
    if (productiveMinutesInput) {
        productiveMinutesInput.addEventListener("input", function () {
            ProductiveMinutesInput(this, 2);
        });
    }
    var restHoursInput = document.getElementById("resthours");
    if (restHoursInput) {
        restHoursInput.addEventListener("input", function () {
            RestHoursInput(this, 2);
        });
    }
    var restMinutesInput = document.getElementById("restminutes");
    if (restMinutesInput) {
        restMinutesInput.addEventListener("input", function () {
            RestMinutesInput(this, 2);
        });
    }
});

function PeriodInput(element, maxDigits) {
    periods = element.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (periods.length > maxDigits) {
        element.value = periods.slice(0, maxDigits); // Truncate to the first maxDigits characters
    }
}

function ProductiveHoursInput(element, maxDigits) {
    productiveHours = element.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (productiveHours.length > maxDigits) {
        element.value = productiveHours.slice(0, maxDigits); // Truncate to the first maxDigits characters
    }
}

function ProductiveMinutesInput(element, maxDigits) {
    productiveMinutes = element.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (productiveMinutes.length > maxDigits) {
        element.value = productiveMinutes.slice(0, maxDigits); // Truncate to the first maxDigits characters
    }
}

function RestHoursInput(element, maxDigits) {
    restHours = element.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (restHours.length > maxDigits) {
        element.value = restHours.slice(0, maxDigits); // Truncate to the first maxDigits characters
    }
}

function RestMinutesInput(element, maxDigits) {
    restMinutes = element.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (restMinutes.length > maxDigits) {
        element.value = restMinutes.slice(0, maxDigits); // Truncate to the first maxDigits characters
    }
}

function StartStudying() {
    chrome.browserAction.setBadgeText ( { text: "test" } );
    chrome.runtime.sendMessage({ from: "tabtamerStart", tracking: true });

    coin_element = document.getElementById("coinamount");
    coins += 1;
    localStorage.setItem('coins', coins); // Update and store the 'coins' value
    coin_element.innerHTML = coins;
    alert("You have started studying!");
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
            loadDivs("productive");
            loadDivs("unproductive");
        });

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