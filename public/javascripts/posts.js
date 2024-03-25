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

  const statusFieldImage = document.createElement("i");
  if (status == "OK") {
    statusFieldImage.setAttribute("class", "bi bi-check-circle-fill");
  }
  else if (status == "emergency") {
    statusFieldImage.setAttribute("class", "bi bi-bandaid-fill");

  }
  else if (status == "help") {
    statusFieldImage.setAttribute("class", "bi bi-exclamation-circle-fill");
  }

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

  while(messageBoard.firstChild){
    messageBoard.removeChild(messageBoard.lastChild);
  }

  for (const msgData of chatlist) {

    let username = ""

    if (isPrivate) {
      username = msgData.Sender.username;
    }
    else {
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

function slice(array, size){   

  let slicedArray = [];

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
      slicedArray.push(array.slice(i * size, i * size + size));
  }
  return slicedArray 
}

let counter = 0;

function renderSlicedArray(slicedArray, isPrivate, isStatus){
  console.log(counter)
  let messageBoard = document.getElementById("message-board")

  let showMore = document.getElementById("show-more");
  if(showMore){
      showMore.remove();
  }

  for (let i = 0; i < slicedArray[counter].length; i++) {
      let msgData = slicedArray[counter][i];

      let username = "";
      if (isPrivate) {
        username = msgData.Sender.username;
      }
      else {
        username = msgData.user.username;
      }

      if (isStatus) {
        let messageElement = constructStatusMessage(
          username,
          msgData.status,
          msgData.createdAt
        );
        messageBoard.appendChild(messageElement);
      } 
      else {
        let messageElement = constructChatMessage(
          username,
          msgData.content,
          msgData.status,
          msgData.createdAt
        );
        messageBoard.appendChild(messageElement);
      }
  }

  if(counter + 1 < slicedArray.length){
      createShowMore(slicedArray, isPrivate)
      counter++;  
  }
}

function createShowMore(slicedArray, isPrivate){
  let messageBoard = document.getElementById("message-board")
  let showMore = document.createElement("div");
  showMore.setAttribute("id", "show-more")
  showMore.setAttribute("class", "list-group-item")
  let showMoreText = document.createTextNode("Show More...")

  
  showMore.addEventListener("click", () => {renderSlicedArray(slicedArray, isPrivate, isStatus)})
  showMore.appendChild(showMoreText)
  messageBoard.appendChild(showMore)
}

async function renderSearchedPosts(chatlist, isPrivate, isStatus) {

  counter = 0;

  let messageBoard = document.getElementById("message-board")

  while(messageBoard.firstChild){
      messageBoard.removeChild(messageBoard.lastChild);
  }

  const sliceSize = 10;
  
  let slicedArray = slice(chatlist, sliceSize)

  console.log(slicedArray)
  
  renderSlicedArray(slicedArray, isPrivate, isStatus);    
}

function constructStatusMessage(sender, status, dateTime) {
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

  const statusFieldImage = document.createElement("i");
  if (status == "OK") {
    statusFieldImage.setAttribute("class", "bi bi-check-circle-fill");
  }
  else if (status == "emergency") {
    statusFieldImage.setAttribute("class", "bi bi-bandaid-fill");

  }
  else if (status == "help") {
    statusFieldImage.setAttribute("class", "bi bi-exclamation-circle-fill");
  }

  messageUsernameHeader.appendChild(senderSpan);
  messageHeader.appendChild(dateSpan);
  messageUsernameHeader.appendChild(statusFieldImage);

  messageDiv.appendChild(messageUsernameHeader);
  messageDiv.appendChild(messageHeader);
  return messageDiv;
}