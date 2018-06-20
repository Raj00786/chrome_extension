chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "fetchData":
                fetchData();
                break;
            case "submit":
                console.log(message);
                submitData(message.data);
                break;
            default:
                alert("works only on profile page");
        }
    }
);

//check if page is profile page of linkedin
var url = window.location;
var urlPath = url.pathname.split("/");
var userData = new Object();

function submitData(data){
    $.post("http://www.localhost:3000/userData",
    data,
    function(data,status){
        if(status=="success"){
            alert("Your profile updated in our database....Thank you :)");            
        }else{
            alert("There is some issue in sending data to server");
        }
    });
}

//function to get data
function getData(){
    var model = document.getElementsByTagName("artdeco-modal-overlay");
    var header = model[0].getElementsByTagName("artdeco-modal-header");
    var content = model[0].getElementsByTagName("artdeco-modal-content");
    var userName = header[0].getElementsByTagName("h1")[0].innerText;

    userData["name"]=userName;

    var sections = content[0].getElementsByClassName("section-info");
    var loopc = sections[0].getElementsByTagName("section");

    for (let i=0;i<loopc.length;i++){
        var className = loopc[i].classList[1];
        if(className=="ci-phone" || className=="ci-ims"|| className=="ci-websites" || className=="ci-twitter"){
            let dataIndex = className.split("-")[1];
            let dataValue = loopc[i].getElementsByTagName('ul')[0].innerText;
            userData[dataIndex] = dataValue;
        }else{
            let dataIndex = className.split("-")[1];
            let dataValue = loopc[i].getElementsByTagName("div")[0].innerText;
            userData[dataIndex] = dataValue;
        }
    }
    chrome.runtime.sendMessage({userData: userData});
    $("button.artdeco-dismiss").click();
    // profile url = "vanity-url";
    // email = "ci-email"';
    // phone = "ci-phone";
    // instant messenger = "ci-ims";
    // birthday = "ci-birthday";
    //address = "ci-address"

}

function fetchData(){
    if(urlPath.length==4){
        if(urlPath[1]=='in'){
            var data = document.querySelector("[data-control-name='contact_see_more']");
            var infoId = data.id;
            document.getElementById(infoId).click();
            var loaderUrl = chrome.extension.getURL("rajloader.gif");
            var loader = '<div id="loading"><img id="loading-image" src="'+loaderUrl+'" alt="Loading..." /></div>';
    
            $('body').prepend(loader);
            
            setTimeout(function() {
                $('#loading').remove();
                getData();
            }, 1000);
        }
    }
}