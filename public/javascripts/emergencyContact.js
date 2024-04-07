function renderEmergencyContact(primary, alternative, message) {
    let primayContactForm = document.getElementById("primary-contact-form");
    if (document.getElementById("primary-contact") != undefined) {
        primayContactForm.removeChild(document.getElementById("primary-contact"))
    }
    let primaryInfo = document.createElement("p");
    primaryInfo.setAttribute("id", "primary-contact");
    let primaryInfoText = document.createTextNode(primary);
    primaryInfo.appendChild(primaryInfoText);

    let alternativeContactForm = document.getElementById("alternative-contact-form");
    if (document.getElementById("alternative-contact") != undefined) {
        alternativeContactForm.removeChild(document.getElementById("alternative-contact"))
    }
    let alternativeInfo = document.createElement("p");
    alternativeInfo.setAttribute("id", "alternative-contact");
    let alternativeInfoText = document.createTextNode(alternative);
    alternativeInfo.appendChild(alternativeInfoText);

    let emergencyMessageForm = document.getElementById("emergency-message-form");
    if (document.getElementById("user-message") != undefined) {
        emergencyMessageForm.removeChild(document.getElementById("user-message"))
    }
    let emergencyMessage = document.createElement("p");
    emergencyMessage.setAttribute("id", "user-message");
    let emergencyMessageText = document.createTextNode(message);
    emergencyMessage.appendChild(emergencyMessageText);
    
    let primayContactInput = document.getElementById("primary-input");
    primayContactForm.insertBefore(primaryInfo, primayContactInput);
    let alternativeContactInput = document.getElementById("alternative-input");
    alternativeContactForm.insertBefore(alternativeInfo, alternativeContactInput);
    let emergencyMessageInput = document.getElementById("emergency-message");
    emergencyMessageForm.insertBefore(emergencyMessage, emergencyMessageInput);
    
}