class ChatMessage {
    constructor(sender, message, dateTime) {
        this.sender = sender;
        this.message = message;
        this.time = dateTime;
    }
    
    createMessageElement() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'list-group-item';
        const messageHeader = document.createElement('div');
        messageHeader.className = 'd-flex w-100 justify-content-between';
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = this.sender;
        const dateSpan = document.createElement('span');
        dateSpan.className = 'message-date';
        dateSpan.textContent = this.time;
        messageHeader.appendChild(senderSpan);
        messageHeader.appendChild(dateSpan);
        const messageBody = document.createElement('div');
        messageBody.className = 'message-body';
        messageBody.textContent = this.message;
        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(messageBody);
        return messageDiv;
    }
}
// Exporting the ChatMessage class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatMessage;
}

