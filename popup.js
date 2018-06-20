//accordion
var i;
var acc = document.getElementsByClassName("accordion");
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

//

if(window.localStorage.getItem("userData")){
    var jsonData = JSON.parse(window.localStorage.getItem("userData"))
    setValues(jsonData);
}
// alert(window.localStorage.getItem("userData"));
// function contentFetch() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {type:"fetchData"}, function(response){
//             alert("contentFetch");
//         });
//     }); 
// }
// document.getElementById('fetchData').addEventListener('click',contentFetch());


document.getElementById("submitData").onclick = function(){
    console.log("clicked submitData");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length == 0){ 
            console.log("could not send mesage to current tab");
        }else{
            chrome.tabs.sendMessage(tabs[0].id, {type: "submit",data:JSON.parse(window.localStorage.getItem("userData"))}, function(response) {
                console.log("received message from content script: "+response.farewell);
            });
        }
    });
}

document.getElementById("fetchData").onclick = function(){
    console.log("clicked fetchData");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length == 0){ 
            console.log("could not send mesage to current tab");
        }else{
            chrome.tabs.sendMessage(tabs[0].id, {type: "fetchData"}, function(response) {
                console.log("received message from content script: "+response.farewell);
            });
        }
    });
}



chrome.runtime.onMessage.addListener(function (msg, sender, response)
    {
        window.localStorage.removeItem("userData");
        console.log(window.localStorage)
        window.localStorage.setItem("userData",JSON.stringify(msg.userData));
        setValues(msg.userData);
        document.getElementById("submitData").style.display='block';
        document.getElementById("fetchData").style.display='none';
    }
);

//set values in fields

function setValues(userData){
    document.getElementById("name").value=userData["name"];
    document.getElementById("email").value=userData["email"] || '';
    document.getElementById("address").value=userData["address"] || '';
    document.getElementById("linkedin").value=userData["vanity"] || '';
    document.getElementById("ims").value=userData["ims"] || '';
    document.getElementById("phone").value=userData["phone"] || '';
    document.getElementById("birthday").value=userData["birthday"] || '';
}