document.addEventListener('DOMContentLoaded', async function () {
  const started = await chrome.storage.local.get("started");
  console.log(started);
  const start = (started.started == undefined) ? "start" : "main";
  var contentDiv = document.getElementById('content');
  fetch(chrome.runtime.getURL(`${start}/${start}.html`))
    .then(response => response.text())
    .then(html => {
      contentDiv.innerHTML = html;
      addPageScript(`${start}/${start}.js`);
    });
});

function addPageScript(scriptName) {
  var script = document.createElement(`script`);
  script.src = scriptName;
  document.head.appendChild(script);
}

