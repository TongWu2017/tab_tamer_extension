document.getElementById("chooseButton").addEventListener("click", gotoMainFromChoose);

async function gotoMainFromChoose() {
  console.log("triggered")
  const petUnlockObj = {
    cat:false,
    dog:false,
    rabbit:false
  }
  petUnlockObj[petType] = true;
  await chrome.storage.local.set({started: true});
  await chrome.storage.local.set({productive:[]});
  await chrome.storage.local.set({unproductive:[]});
  await chrome.storage.local.set({petUnlocked:petUnlockObj});
  await chrome.storage.local.set({currentPet:petType});
  await chrome.storage.local.set({petData:{}});
  

  var contentDiv = document.getElementById('content');
  var pageUrl = chrome.runtime.getURL('main/main.html');

  fetch(pageUrl)
    .then(response => response.text())
    .then(html => {
      contentDiv.innerHTML = html;
      addPageScript("main/main.js");
    });

}