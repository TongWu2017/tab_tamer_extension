document.addEventListener('DOMContentLoaded', function() {
    showPage(1);
  });
  
  function showPage(pageNumber) {
    var contentDiv = document.getElementById('content');
    var pageUrl = chrome.extension.getURL('page' + pageNumber + '.html');
  
    fetch(pageUrl)
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
        addPageScript(pageNumber);
      });
  }
  
  function addPageScript(pageNumber) {
    var script = document.createElement('script');
    script.src = 'page' + pageNumber + '.js';
    document.head.appendChild(script);
  }