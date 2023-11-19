document.addEventListener('DOMContentLoaded', function() {
    
})
document.getElementById("settings").addEventListener("click", gotoSettings);
document.getElementById("inventory").addEventListener("click", gotoinventory);

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