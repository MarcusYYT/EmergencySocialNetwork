function toggleHamburgerMenu() {
    let hamburgerMenu = document.getElementById("hamburgerMenu");
    let overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay")
    let body = document.getElementsByTagName("body")[0]
    let statusWrapper = document.getElementById("status-wrapper")
    
    if (hamburgerMenu.style.display === "flex") {
      hamburgerMenu.style.display = "none";
      document.getElementById("overlay").remove()
    } 
    
    else {
      hamburgerMenu.style.display = "flex";
      body.insertBefore(overlay, statusWrapper)
    }
  }

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
    
    let statusForm = document.getElementById("status-list");
    profile.insertBefore(user, statusForm);
    profile.insertBefore(userInfo, statusForm);
}

function routeToPrivateChat(sender, receiver){
    //await changeReadStatus(sender, receiver)
    window.location.href = `/privatePostsWall/${sender}/${receiver}`;
}
