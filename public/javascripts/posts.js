/**
 * Contructs an Announcement using the message data
 * @param {*} msgData The message data 
 * @returns a public chat dom element
 */
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

/**
 * Renders all the chats on the page
 * @param {*} chatlist the list of chats
 * @param {*} isPrivate whther or not the message is private or public
 */
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

/**
 * Slices a given array into an array of a given size
 * @param {*} array The array to slice
 * @param {*} size The size of the array
 * @returns the sliced array
 */
function slice(array, size){   
  let slicedArray = [];
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
      slicedArray.push(array.slice(i * size, i * size + size));
  }
  return slicedArray 
}

let counter = 0;

/**
 * Renders the sliced array on the page
 * @param {*} slicedArray the sliced array
 * @param {*} isPrivate whether the array is for private chat or not
 * @param {*} isStatus whether the array is for statsues or not
 */
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

/**
 * Renders the show more button on the bottom
 * @param {*} slicedArray the sliced array
 * @param {*} isPrivate whether the array is for private chat or not
 * @param {*} isStatus whether the array is for statsues or not
 */
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

/**
 * Renders the searched post on the page
 * @param {*} chatlist the list of messages to render
 * @param {*} isPrivate whther the list of chats is private or not
 * @param {*} isStatus whetehr the list is of status or not
 */
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

/**
 * Renders the message for when there are no results
 */
function renderEmptyMessage(){
  let messageBoard = document.getElementById("message-board")
  removePostElements(messageBoard)
  let emptyMessage = document.createElement("h1")
  let emptyMessageText = document.createTextNode("No results found")
  emptyMessage.className = 'empty-message'
  emptyMessage.appendChild(emptyMessageText)
  messageBoard.appendChild(emptyMessage);
}

/**
 * Creates a message object
 * @param {*} msgData the message data content
 * @param {*} username the username of the sender
 * @param {*} isStatus Whether the message is for status history or not
 * @returns the message object
 */
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

/**
 * Removes the message board element off of the page
 * @param {*} messageBoard the message board element
 */
function removePostElements(messageBoard) {
  while (messageBoard.firstChild) {
    messageBoard.removeChild(messageBoard.lastChild);
  }
}

