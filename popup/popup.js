//BELOW ARE THE INITIAL SETUPS REQUIRED

if(window.localStorage.jobRoles==undefined){
    var jobroles = ["Software Engineer","Artificial Intelligence","Marketing","International Sales","Developer"];
    window.localStorage.setItem("jobRoles",JSON.stringify(jobroles));
}

if(JSON.parse(window.localStorage.jobRoles).length>0){
    jobRoleList();
    if(window.localStorage.oldUserData!=undefined){
        updateCandidateList();    
    }
}

if(window.localStorage.oldUserData==undefined)
{
    window.localStorage.setItem("oldUserData",JSON.stringify([]));
}
else if(JSON.parse(window.localStorage.oldUserData).length>0){
    updateCandidateList();
}

document.getElementById("jobProfiles").getElementsByTagName("select")[0].addEventListener("change", function() {optionChanged(this.value)});

function optionChanged(selectedJob){
    window.localStorage.activeJobRole=selectedJob;
    updateCandidateList();
    jobRoleList()
}

function jobRoleList(){
    document.getElementById("jobProfiles").getElementsByTagName("select")[0].innerHTML="";
    var jobs = JSON.parse(window.localStorage.getItem("jobRoles"));
    for(let i=0;i<jobs.length;i++){
        appendJobRoles(jobs[i]);
    }
}

function updateCandidateList(){
    document.getElementById("usersList").innerHTML='';
    var jsonData = JSON.parse(window.localStorage.getItem("oldUserData"))
    var candidateCount = 0;
    for(let i=0;i<jsonData.length;i++){
        if(jsonData[i].jobrole==window.localStorage.activeJobRole){
            appendUser(jsonData[i]);
            candidateCount++;
        }
    }
    document.getElementById("candidatesCount").innerText=candidateCount;
    document.getElementById("jobProfileName").innerText=window.localStorage.activeJobRole;
}

document.getElementById("submitAll").onclick = function(){
    console.log("clicked submitAll");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length == 0){ 
            console.log("could not send mesage to current tab");
        }else{
            chrome.tabs.sendMessage(tabs[0].id, {type: "submitData",data:getActiveRoleStudent()}, function(response) {
                console.log("received message from content script: "+response);
            });
        }
    });
}

function getActiveRoleStudent(){
    var data = [];
    var jsonData = JSON.parse(window.localStorage.getItem("oldUserData"))
    var candidateCount = 0;
    for(let i=0;i<jsonData.length;i++){
        if(jsonData[i].jobrole==window.localStorage.activeJobRole){
            data.push(jsonData[i]);
        }
    }
    console.log(data);
    return data;
}

// document.getElementById("saveData").onclick = function(){
//     //move newUserData to oldUserData and removeitem newUserData
//     let oldData = JSON.parse(window.localStorage.getItem("oldUserData"));
//     oldData.push(JSON.parse(window.localStorage.getItem("newUserData")));
//     window.localStorage.setItem("oldUserData",JSON.stringify(oldData));
//     window.localStorage.removeItem("newUserData");
//     console.log("clicked saveData ",window.localStorage.getItem("newUserData"));
// }

document.getElementById("fetchData").onclick = function(){
    console.log("clicked fetchData");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length == 0){ 
            console.log("could not send mesage to current tab");
        }else{
            chrome.tabs.sendMessage(tabs[0].id, {type: "fetchData"}, function(response) {
                console.log("received message from content script: "+response);
            });
        }
    });
}


$(".removeCandidate").click(function(){
    var removeId = $(this).parent().attr('id');
    console.log(removeId);
    removeCandidate(removeId);
});
// $("#jobProfiles").click(function(event) {
//     window.localStorage.activeJobRole = event.target.innerText.trim();
//     document.getElementById("candidatesJobRole").innerText=window.localStorage.activeJobRole;
// });

// var jobButton = $('#jobProfiles button').click(function(event){
//     jobButton.removeClass('activeJobRole');
//     console.log(event.target);
//     window.localStorage.activeJobRole = event.target.innerText.trim();
//     $(this).addClass('activeJobRole');
//     document.getElementById("usersList").innerHTML='';
//     var jsonData = JSON.parse(window.localStorage.getItem("oldUserData"))
//     for(let i=0;i<jsonData.length;i++){
//         if(jsonData[i].jobrole==window.localStorage.activeJobRole){
//             appendUser(jsonData[i]);
//         }
//     }

// });


chrome.runtime.onMessage.addListener(function (msg, sender, response)
    {
        console.log(msg);
        window.localStorage.removeItem("newUserData");
        msg.userData.jobrole = window.localStorage.activeJobRole;
        window.localStorage.setItem("newUserData",JSON.stringify(msg.userData));
        if(parseInt(checkCandidateExist(msg.userData))){
            let oldData = JSON.parse(window.localStorage.getItem("oldUserData"));
            oldData.push(JSON.parse(window.localStorage.getItem("newUserData")));
            window.localStorage.setItem("oldUserData",JSON.stringify(oldData));
            updateCandidateList();
        }else{
            alert("candidate already existed");
        }
    }
);

// //set values in fields

// function setValues(userData){
//     document.getElementById("name").value=userData["name"];
//     document.getElementById("email").value=userData["email"] || '';
//     document.getElementById("address").value=userData["address"] || '';
//     document.getElementById("linkedin").value=userData["vanity"] || '';
//     document.getElementById("ims").value=userData["ims"] || '';
//     document.getElementById("phone").value=userData["phone"] || '';
//     document.getElementById("birthday").value=userData["birthday"] || '';
// }

function removeCandidate(user){
    var jsonData = JSON.parse(window.localStorage.getItem("oldUserData"))
    for(let i=0;i<jsonData.length;i++){
        if(jsonData[i].uniqueId==user){
            if (i > -1) {
                jsonData.splice(i, 1);
                window.localStorage.setItem("oldUserData",JSON.stringify(jsonData));
            }
            updateCandidateList();
        }
    }
}

function checkCandidateExist(user,callback){
    var jsonData = JSON.parse(window.localStorage.getItem("oldUserData"))
    for(let i=0;i<jsonData.length;i++){
        if(jsonData[i].vanity==user.vanity && user.jobrole==jsonData[i].jobrole){
            return 0;
        }
    }
    return 1;
}

function appendUser(user){
    var e = document.createElement("div");
    e.className = "button user_card";
    e.id = user.uniqueId;
    e.innerHTML = '<img src="'+user.image+'"> <p>'+user.name+'</p> <img class="submitCandidate" src="../icons/submit.png" /> <img class="removeCandidate" src="../icons/remove.png"/>';
    var p = document.getElementById("usersList");
    p.appendChild(e);

}

function updateCount(job){
    var count =0;
    var data = JSON.parse(window.localStorage.oldUserData);
    for(let i=0;i<data.length;i++){
        if(job==data[i].jobrole){
            count++;
        }
    }
    return count;
}


function appendJobRoles(job){
    var e = document.createElement("option");
    if(window.localStorage.activeJobRole==job){
        e.selected = "selected";
    }
    e.value = job;
    e.innerText = job;
    console.log(job);
    var p = document.getElementById("jobProfiles").getElementsByTagName("select")[0];
    p.appendChild(e);

}
