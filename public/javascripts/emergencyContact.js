function renderEmergencyContact(primary, alternative, message) {
    let profile = document.getElementById("emergency-wrapper");

    if (document.getElementById("primary-contact") != undefined) {
        profile.removeChild(document.getElementById("primary-contact"))
    }
    let primaryInfo = document.createElement("p");
    primaryInfo.setAttribute("id", "primary-contact");
    let primaryInfoText = document.createTextNode("My Primary Contact is: " + primary);
    primaryInfo.appendChild(primaryInfoText);

    if (document.getElementById("alternative-contact") != undefined) {
        profile.removeChild(document.getElementById("alternative-contact"))
    }
    let alternativeInfo = document.createElement("p");
    alternativeInfo.setAttribute("id", "alternative-contact");
    let alternativeInfoText = document.createTextNode("My Alternative Contact is: " + alternative);
    alternativeInfo.appendChild(alternativeInfoText);

    if (document.getElementById("user-message") != undefined) {
        profile.removeChild(document.getElementById("user-message"))
    }
    let emergencyMessage = document.createElement("p");
    emergencyMessage.setAttribute("id", "user-message");
    let emergencyMessageText = document.createTextNode("My Emergency Message is: " + message);
    emergencyMessage.appendChild(emergencyMessageText);
    
    let primayContactForm = document.getElementById("primary-contact-form");
    profile.insertBefore(primaryInfo, primayContactForm);
    let alternativeContactForm = document.getElementById("alternative-contact-form");
    profile.insertBefore(alternativeInfo, alternativeContactForm);
    let emergencyMessageForm = document.getElementById("emergency-message-form");
    profile.insertBefore(emergencyMessage, emergencyMessageForm);
    
}