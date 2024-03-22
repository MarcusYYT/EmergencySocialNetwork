function constructAnnouncement(sender, message, dateTime) {

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

    messageUsernameHeader.appendChild(senderSpan);
    messageHeader.appendChild(dateSpan);

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = message;
    messageDiv.appendChild(messageUsernameHeader);
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageBody);
    return messageDiv;

}

async function renderAnnouncements(chatlist, isPrivate) {

    let messageBoard = document.getElementById("message-board")

    for (const msgData of chatlist) {

        let username = ""

        if (isPrivate) {
            username = msgData.Sender.username;
        }
        else {
            username = msgData.user.username;
        }

        let messageElement = constructAnnouncement(
            username,
            msgData.content,
            msgData.createdAt
        );

        messageBoard.appendChild(messageElement);
        messageBoard.scrollTop = messageBoard.scrollHeight;
    }
}
