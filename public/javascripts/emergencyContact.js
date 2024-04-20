function createInfoElement(id, content){
    let element = document.createElement("p");
    element.setAttribute("id", id);
    let elementText = document.createTextNode(content);
    element.appendChild(elementText);
    return element
}

function removeChildIfItExists(parentId, childId){
    let parentElement = document.getElementById(parentId);
    if (document.getElementById(childId) != undefined) {
        parentElement.removeChild(document.getElementById(childId))
    }
    return parentElement
}

function renderEmergencyContact(primary, alternative, message) {
    let primayContactForm = removeChildIfItExists("primary-contact-form", "primary-contact")
    let primaryInfo = createInfoElement("primary-contact", primary)

    let alternativeContactForm = removeChildIfItExists("alternative-contact-form", "alternative-contact")
    let alternativeInfo = createInfoElement("alternative-contact", alternative)

    let emergencyMessageForm = removeChildIfItExists("emergency-message-form", "user-message")
    let emergencyMessage = createInfoElement("user-message", message)    

    let primayContactInput = document.getElementById("primary-input");
    primayContactForm.insertBefore(primaryInfo, primayContactInput);
    let alternativeContactInput = document.getElementById("alternative-input");
    alternativeContactForm.insertBefore(alternativeInfo, alternativeContactInput);
    let emergencyMessageInput = document.getElementById("emergency-message");
    emergencyMessageForm.insertBefore(emergencyMessage, emergencyMessageInput);
   
}

let watchId; // Define watchId variable globally
let latitude = '';
let longitude = '';
let googleMapLink = '';

function getLocation() {
    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            googleMapLink = 'https://maps.google.com/?q=' + latitude + "," + longitude;
            
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            //console.log(googleMapLink);
        }, function(error) {
            // Handle errors, if any
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for geolocation.");
                    break;
            }
        });
    } else {
        console.error("Geolocation is not available in this browser.");
    }
}

function disableLocationSharing() {
    if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
            if (permissionStatus.state !== 'denied') {
                navigator.geolocation.clearWatch(watchId); // Use the stored watchId to clear the watch
                permissionStatus.onchange = function () {
                    console.log('Location sharing disabled.');
                }
                permissionStatus.state = 'denied';
            } else {
                console.log('Location sharing is already disabled.');
            }
        });
    } else {
        console.log('Geolocation API is not supported in this browser.');
    }
}