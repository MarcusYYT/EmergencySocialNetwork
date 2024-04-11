
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if(lat1 == lat2 || lon1 == lon2) return -1;
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return (distance / 1.609344).toFixed(1); // Distance in miles
}

function toRad(Value) {
  return Value * Math.PI / 180;
}


function createShowMore(slicedArray, isPrivate){
  let messageBoard = document.getElementById("message-board")
  let showMore = document.createElement("div");
  showMore.setAttribute("id", "show-more")
  showMore.setAttribute("class", "list-group-item")
  let showMoreText = document.createTextNode("Show More...")  
  showMore.addEventListener("click", () => {renderSlicedArray(slicedArray, isPrivate)})
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