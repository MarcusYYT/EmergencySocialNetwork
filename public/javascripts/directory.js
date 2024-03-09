function renderMyStatus(username, status) {
    let profile = document.getElementById("status-wrapper");
    if (document.getElementById("status-header") != undefined) {
        profile.removeChild(document.getElementById("status-header"));
        profile.removeChild(document.getElementById("user-info"))
    }
    
    let user = document.createElement("h1");
    user.setAttribute("id", "status-header");
    let userText = document.createTextNode(username);
    user.appendChild(userText);
    
    let userInfo = document.createElement("p");
    userInfo.setAttribute("id", "user-info");
    let userInfoText = document.createTextNode("My current status is: " + status);
    userInfo.appendChild(userInfoText);
    
    let statusForm = document.getElementById("status-form");
    profile.insertBefore(user, statusForm);
    profile.insertBefore(userInfo, statusForm);
}

// function renderESNList(list) {
//     let directory = document.getElementById("directory");
//     while(directory.firstChild){
//       directory.removeChild(directory.lastChild);
//     }
    
//     for (let i = 0; i < list.length; i++) {
//         let directory = document.getElementById("directory");
//         let userdiv = document.createElement("div");
//         userdiv.setAttribute("class", "directory-user");
//         userdiv.addEventListener("click", routeToPrivateChat(list[i].username))

//         let usernameField = document.createElement("p");
//         usernameField.setAttribute("class", "usernameField");
//         let usernameFieldText = document.createTextNode(list[i].username);
//         usernameField.appendChild(usernameFieldText);

//         let onlineStatusField = document.createElement("p");
//         onlineStatusField.setAttribute("class", "onlineStatusField");
//         let onlineStatusFieldText = document.createTextNode(list[i].online_status);
//         onlineStatusField.appendChild(onlineStatusFieldText);

//         if (list[i].online_status === "online") {
//             onlineStatusField.classList.add("online");
//         }
//         else {
//             onlineStatusField.classList.add("offline");
//         }

//         let statusField = document.createElement("p");
//         statusField.setAttribute("class", "statusField");
//         let statusFieldText = document.createTextNode(list[i].status);
//         statusField.appendChild(statusFieldText);

//         userdiv.appendChild(usernameField);
//         userdiv.appendChild(onlineStatusField);
//         userdiv.appendChild(statusField);
//         directory.appendChild(userdiv);
//     }
// }

function routeToPrivateChat(receiver, sender){
    window.location.href = `/privatePostsWall/${sender}/${receiver}`;

}