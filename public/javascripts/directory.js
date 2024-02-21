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

window.addEventListener("load", async () => {
    await fetch('/users')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let online = []
            let offline = []

            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].online_status === "online") {
                    online.push(data.data[i])
                }
                else {
                    offline.push(data.data[i])
                }
            }

            online.sort(function (a, b) {
                return a.username.localeCompare(b.username)
            })

            offline.sort(function (a, b) {
                return a.username.localeCompare(b.username)
            })

            renderESNList(online)
            renderESNList(offline)

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
} , false)