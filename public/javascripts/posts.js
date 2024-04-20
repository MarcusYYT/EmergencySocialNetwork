function constructChatMessage(msgData) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'list-group-item';
  const messageHeader = document.createElement('div');
  messageHeader.className = 'd-flex w-100 justify-content-between';
  const messageUsernameHeader = document.createElement('div');
  messageUsernameHeader.className = 'd-flex w-100 justify-content-between';
  const senderSpan = document.createElement('span');
  senderSpan.className = 'message-sender';
  senderSpan.textContent = msgData.sender;
  const dateSpan = document.createElement('span');
  dateSpan.className = 'message-date';
  dateSpan.textContent = new Date(msgData.dateTime).toLocaleString();
  const statusFieldImage = document.createElement("i");
  if (msgData.status == "OK") {
    statusFieldImage.setAttribute("class", "bi bi-check-circle-fill");
  } else if (msgData.status == "emergency") {
    statusFieldImage.setAttribute("class", "bi bi-bandaid-fill");
  } else if (msgData.status == "help") {
    statusFieldImage.setAttribute("class", "bi bi-exclamation-circle-fill");
  }
  messageUsernameHeader.appendChild(senderSpan);
  messageHeader.appendChild(dateSpan);
  messageUsernameHeader.appendChild(statusFieldImage);
  messageDiv.appendChild(messageUsernameHeader);
  messageDiv.appendChild(messageHeader);
  if (!msgData.isStatus){
    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = msgData.message;
    messageDiv.appendChild(messageBody);  
  }
  return messageDiv;
}

async function renderChats(chatlist, isPrivate) {
  let messageBoard = document.getElementById("message-board")
  let isStatus = false;
  removePostElements(messageBoard)
  for (const msgData of chatlist) {
    let username = ""
    if (isPrivate) {
      username = msgData.Sender.username;
    } else {
      username = msgData.user.username;
    }
    let messageDetails = createMsgObject(msgData, username, isStatus);
    let messageElement = constructChatMessage(messageDetails);
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
  let messageBoard = document.getElementById("message-board")
  let showMore = document.getElementById("show-more");
  if (showMore) {
      showMore.remove();
  }
  for (let i = 0; i < slicedArray[counter].length; i++) {
    let msgData = slicedArray[counter][i];

    let username = "";
    if (isPrivate && !isStatus) {
      username = msgData.Sender.username;
    } else {
      username = msgData.user.username;
    }
    let messageDetails = createMsgObject(msgData, username, isStatus)
    let messageElement = constructChatMessage(messageDetails);
    messageBoard.appendChild(messageElement);
  }
  if (counter + 1 < slicedArray.length && !isStatus) {
      createShowMore(slicedArray, isPrivate, isStatus)
      counter++;  
  }
}

function createShowMore(slicedArray, isPrivate, isStatus){
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
  removePostElements(messageBoard);
  if(chatlist.length == 0){
    renderEmptyMessage()
  } else {
    const sliceSize = 10;
    let slicedArray = slice(chatlist, sliceSize)
    renderSlicedArray(slicedArray, isPrivate, isStatus);    
  }  
}

function renderEmptyMessage(){
  let messageBoard = document.getElementById("message-board")
  removePostElements(messageBoard)
  let emptyMessage = document.createElement("h1")
  let emptyMessageText = document.createTextNode("No results found")
  emptyMessage.className = 'empty-message'
  emptyMessage.appendChild(emptyMessageText)
  messageBoard.appendChild(emptyMessage);
}

function createMsgObject(msgData, username, isStatus) {
  let messageDetails = {
    sender: username,
    message: msgData.content,
    status: msgData.status,
    dateTime: msgData.createdAt,
    isStatus: isStatus
  }
  return messageDetails;
}

function removePostElements(messageBoard) {
  while (messageBoard.firstChild) {
    messageBoard.removeChild(messageBoard.lastChild);
  }
}

