export function constructChatMessage(sender, message, status, dateTime) {

        const messageDiv = document.createElement('div');
        messageDiv.className = 'list-group-item';
        const messageHeader = document.createElement('div');
        messageHeader.className = 'd-flex w-100 justify-content-between';
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = sender;
        const dateSpan = document.createElement('span');
        dateSpan.className = 'message-date';
        dateSpan.textContent = new Date(dateTime).toLocaleString;

        const statusSpan = document.createElement('span');
        statusSpan.className = 'message-status';
        statusSpan.textContent = status;

        messageHeader.appendChild(senderSpan);
        messageHeader.appendChild(dateSpan);
        messageHeader.appendChild(statusSpan);


        const messageBody = document.createElement('div');
        messageBody.className = 'message-body';
        messageBody.textContent = message;
        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(messageBody);
        return messageDiv;

}
// // Exporting the ChatMessage class
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = ChatMessage;
// }

const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  });
d

