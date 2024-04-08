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
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.error("An unknown error occurred.");
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