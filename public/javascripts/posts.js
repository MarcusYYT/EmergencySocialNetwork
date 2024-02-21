// import socketio from './socket.io.js'
// const {socketio} = require('./socket.io.js');
// import io from 'socket.io-client';


function constructChatMessage(sender, message, status, dateTime) {

    const messageDiv = document.createElement('div');
    messageDiv.className = 'list-group-item';
    const messageHeader = document.createElement('div');
    messageHeader.className = 'd-flex w-100 justify-content-between';
    const messageUsernameHeader = document.createElement('div');
    messageUsernameHeader.className = 'd-flex w-100 justify-content-between';
    const senderSpan = document.createElement('span');
    senderSpan.className = 'message-sender';
    senderSpan.textContent = sender;
    const dateSpan = document.createElement('span');
    dateSpan.className = 'message-date';
    // console.log("1111111111:" + dateTime)
    dateSpan.textContent = new Date(dateTime).toLocaleString();

    const statusSpan = document.createElement('span');
    statusSpan.className = 'message-status';
    statusSpan.textContent = status;

    messageUsernameHeader.appendChild(senderSpan);
    messageHeader.appendChild(dateSpan);
    messageUsernameHeader.appendChild(statusSpan);

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = message;
    messageDiv.appendChild(messageUsernameHeader);
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageBody);
    return messageDiv;

}

async function renderChats(chatlist) {

    let messageBoard = document.getElementById("message-board")

    for (const msgData of chatlist) {

        
        let messageElement = constructChatMessage(
            msgData.user.username,
            msgData.content,
            msgData.status,
            msgData.createdAt
        );

        messageBoard.appendChild(messageElement);
    }
}

window.addEventListener("load", async () => {
    await fetch('/posts')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            renderChats(data.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}, false)


let postButton = document.getElementById("post-btn")




// function postChatMessage(){
//     let textArea = document.getElementById("message")
//     let textContent = textArea.value

//     let path = window.location.pathname;

//     // Split the path by slashes
//     let pathParts = path.split('/');

//     // Get the user_id (assuming it's the last part of the URL)
//     let userId = pathParts[pathParts.length - 1];

//     console.log(userId); // Output: 1 (for the URL /users/1)
//     const postData = {
//         userId: userId,
//         status: "status",
//         dateTime: new Date().toLocaleString(),
//         message: textContent
//       };
//     socket.emit("post msg", postData);
//     console.log(postData)

// }