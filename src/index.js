document.addEventListener('DOMContentLoaded', async function () {
  const started = await chrome.storage.local.get("started");
  const start = (started.started == undefined) ? "start" : "main";
  var contentDiv = document.getElementById('content');
  fetch(chrome.runtime.getURL(`${start}/${start}.html`))
    .then(response => response.text()).catch(console.error)
    .then(html => {
      contentDiv.innerHTML = html;
      addPageScript(`./${start}/${start}.js`);
    });
});

// function addPageScript(scriptName) {
//   var script = document.createElement(`script`);
//   script.src = scriptName;
//   document.head.appendChild(script);
// }

function addPageScript(scriptName) {
  if (document.getElementById("loaded-script-" + scriptName)) {
    return;
  }
  var script = document.createElement(`script`);
  script.src = scriptName;
  script.id = "loaded-script-" + scriptName;
  document.head.appendChild(script);
}
