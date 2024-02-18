// document.getElementById("chooseButton").addEventListener("click", gotoMainFromChoose);

var petType = "";
document.getElementById('cat').addEventListener('click', function () {
    petType = "cat";
});
document.getElementById('dog').addEventListener('click', function () {
    petType = "dog";
});
document.getElementById('rabbit').addEventListener('click', function () {
    petType = "rabbit";
});

document.getElementById('petbutton').addEventListener('click', choosePet);

// document.getElementById('backToStart').addEventListener('click', () => {
//   var contentDiv = document.getElementById('content');
//   fetch(chrome.runtime.getURL(`start/start.html`))
//     .then(response => response.text())
//     .then(html => {
//       contentDiv.innerHTML = html;
//       var script = document.createElement(`script`);
//       script.src = `./start/start.js`;

//     });


// });

const petstats = {
    "cat": {
        "happiness": 3600,
        "level": 0,
        "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/76301/01.png"
    },
    "dog": {
        "happiness": 3600,
        "level": 0,
        "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/76301/02.png"
    },
    "rabbit": {
        "happiness": 3600,
        "level": 0,
        "image": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/76301/02.png"
    }
}
var petName = "";
function choosePet() {
    if (petType == "") {
        alert("You did not select a pet.");
        return
    }
    // Retrieve the selected pet using the function from the external file
    petName = document.getElementById('petname').value;

    gotoMainFromChoose();
    // console.log(petIndex);
    // console.log(`Chose ${petType} named ${petName}`);

    // console.log(petstats);
    //chrome.storage.local.set({pet:})
}

async function gotoMainFromChoose() {
  const petUnlockObj = {
    cat:false,
    dog:false,
    rabbit:false
  }
  petUnlockObj[petType] = true;
  petstats[petType].name = petName;
  await chrome.storage.local.set({started: true});
  await chrome.storage.local.set({productive:[]});
  await chrome.storage.local.set({unproductive:[]});
  await chrome.storage.local.set({petUnlocked:petUnlockObj});
  await chrome.storage.local.set({currentPet:petType});
  await chrome.storage.local.set({petData:petstats});

  var contentDiv = document.getElementById('content');
  var pageUrl = chrome.runtime.getURL('main/main.html');

  fetch(pageUrl)
    .then(response => response.text())
    .then(html => {
      contentDiv.innerHTML = html;
      addPageScript("main/main.js");
    });

}