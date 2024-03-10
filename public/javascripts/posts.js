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

    // const statusSpan = document.createElement('span');
    // statusSpan.className = 'message-status';


    const statusFieldImage = document.createElement("i");
    console.log(status)
    if(status == "OK"){
        statusFieldImage.setAttribute("class", "bi bi-check-circle-fill");
      }
      else if(status == "emergency"){
        statusFieldImage.setAttribute("class", "bi bi-bandaid-fill");
        
      }
      else if(status == "help"){
        statusFieldImage.setAttribute("class", "bi bi-exclamation-circle-fill");
      }
   // statusSpan.appendChild(statusFieldImage);

    messageUsernameHeader.appendChild(senderSpan);
    messageHeader.appendChild(dateSpan);
    messageUsernameHeader.appendChild(statusFieldImage);

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = message;
    messageDiv.appendChild(messageUsernameHeader);
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageBody);
    return messageDiv;

}

async function renderChats(chatlist, isPrivate) {

    let messageBoard = document.getElementById("message-board")

    for (const msgData of chatlist) {

        let username =  ""

        if (isPrivate){
          username = msgData.Sender.username;
        }
        else{
          username = msgData.user.username;
        }
        
        let messageElement = constructChatMessage(
            username,
            msgData.content,
            msgData.status,
            msgData.createdAt
        );

        messageBoard.appendChild(messageElement);
        messageBoard.scrollTop = messageBoard.scrollHeight;
    }
}

// window.addEventListener("load", async () => {

//     await fetch('/posts')
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             renderChats(data.data)
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// }, false)



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