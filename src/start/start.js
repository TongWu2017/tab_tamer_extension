document.getElementById("gotoChoose").addEventListener("click", gotoChoose);

function gotoChoose()  {
    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.runtime.getURL('choose/choose.html');
  
    fetch(pageUrl)
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
        addPageScript("choose/choose.js");
      });
  
}

