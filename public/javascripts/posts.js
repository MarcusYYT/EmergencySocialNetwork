import socketio from './socket.io.js';

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
            msgData.user_id,
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


let postButton = document.getElementById("id", "post-btn")
let textArea = document.getElementById("id", "message")

function postChatMessage(user_id, content){
    
}
