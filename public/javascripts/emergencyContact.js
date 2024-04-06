function renderEmergencyContact(primary, alternative, message) {
    let profile = document.getElementById("emergency-wrapper");
    if (document.getElementById("user-info") != undefined) {
        profile.removeChild(document.getElementById("user-info"))
    }
    
    let primaryInfo = document.createElement("p");
    primaryInfo.setAttribute("id", "user-info");
    let primaryInfoText = document.createTextNode("My Primary Contact is: " + primary);
    primaryInfo.appendChild(primaryInfoText);

    let alternativeInfo = document.createElement("p");
    alternativeInfo.setAttribute("id", "user-info");
    let alternativeInfoText = document.createTextNode("My Alternative Contact is: " + alternative);
    alternativeInfo.appendChild(alternativeInfoText);

    let emergencyMessage = document.createElement("p");
    emergencyMessage.setAttribute("id", "user-info");
    let emergencyMessageText = document.createTextNode("My Emergency Message is: " + message);
    emergencyMessage.appendChild(emergencyMessageText);
    
    let primayContactForm = document.getElementById("primary-contact-form");
    profile.insertBefore(primaryInfo, primayContactForm);
    let alternativeContactForm = document.getElementById("alternative-contact-form");
    profile.insertBefore(alternativeInfo, alternativeContactForm);
    let emergencyMessageForm = document.getElementById("emergency-message-form");
    profile.insertBefore(emergencyMessage, emergencyMessageForm);
    
}