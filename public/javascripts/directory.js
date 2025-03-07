/**
 * Toggles the hamburger menu apperance on the page
 */
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
      overlay.addEventListener("click", () => {hideNavOverlay()})
      body.insertBefore(overlay, statusWrapper)
    }
  }

/**
 * Hides the nav overlay when the overlay is clicked
 */
function hideNavOverlay(){
  if (hamburgerMenu.style.display === "flex") {
    hamburgerMenu.style.display = "none";
    document.getElementById("overlay").remove()
  } 
}

/**
 * Renders the current user's status on the page
 * @param {*} username The current user
 * @param {*} status The user's current status
 */
function renderMyStatus(username, status) {
    let profile = document.getElementById("status-wrapper");
    
    // Clear existing content if it exists
    while (profile.firstChild && profile.firstChild.id !== "status-list" && profile.firstChild.className !== "dropdown mt-3 w-100") {
        profile.removeChild(profile.firstChild);
    }
    
    // Create username element
    let userElement = document.createElement("h3");
    userElement.setAttribute("id", "status-header");
    userElement.className = "fw-bold mb-2";
    userElement.textContent = username;
    
    // Create status badge
    let statusBadge = document.createElement("div");
    statusBadge.setAttribute("id", "user-info");
    statusBadge.className = "mb-3";
    
    let badgeClass = "";
    let iconClass = "";
    
    if (status === "OK") {
        badgeClass = "badge bg-success";
        iconClass = "fas fa-check-circle";
    } else if (status === "help") {
        badgeClass = "badge bg-warning text-dark";
        iconClass = "fas fa-exclamation-circle";
    } else if (status === "emergency") {
        badgeClass = "badge bg-danger";
        iconClass = "fas fa-exclamation-triangle";
    }
    
    statusBadge.innerHTML = `<span class="${badgeClass} px-3 py-2"><i class="${iconClass} me-1"></i> Current Status: ${status}</span>`;
    
    // Insert elements at the beginning of the status wrapper
    profile.insertBefore(statusBadge, profile.firstChild);
    profile.insertBefore(userElement, profile.firstChild);
    profile.insertBefore(avatar, profile.firstChild);
}

/**
 * Routes the user to the private chat
 * @param {*} sender The sender's ID
 * @param {*} receiver The receiver's ID
 */
function routeToPrivateChat(sender, receiver){
  window.location.href = `/privatePostsWall/${sender}/${receiver}`;
}
