function renderESNList(list) {
    for (let i = 0; i < list.length; i++) {
        let directory = document.getElementById("directory");
        let userdiv = document.createElement("div");
        userdiv.setAttribute("class", "directory-user");

        let usernameField = document.createElement("p");
        usernameField.setAttribute("class", "usernameField");
        let usernameFieldText = document.createTextNode(list[i].username);
        usernameField.appendChild(usernameFieldText);

        let statusField = document.createElement("p");
        statusField.setAttribute("class", "statusField");
        let statusFieldText = document.createTextNode(list[i].online_status);
        statusField.appendChild(statusFieldText);

        if (list[i].online_status === "online") {
            statusField.classList.add("online");
        }
        else {
            statusField.classList.add("offline");
        }

        userdiv.appendChild(usernameField);
        userdiv.appendChild(statusField);
        directory.appendChild(userdiv);
    }
}