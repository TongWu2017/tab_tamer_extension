document.getElementById("chooseButton").addEventListener("click", gotoMainFromChoose);

async function gotoMainFromChoose() {
  console.log("triggered")
  await chrome.storage.local.set({started: true});
  await chrome.storage.local.set({productive:[]});
  await chrome.storage.local.set({unproductive:[]});

  var contentDiv = document.getElementById('content');
  var pageUrl = chrome.runtime.getURL('main/main.html');

  fetch(pageUrl)
    .then(response => response.text())
    .then(html => {
      contentDiv.innerHTML = html;
      addPageScript("main/main.js");
    });

}