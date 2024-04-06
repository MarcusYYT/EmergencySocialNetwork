function constructThread(msgData) {
    const threadDiv = document.createElement('div');
    threadDiv.className = 'thread row gx-1 justify-content-between';
    const threadHeader = document.createElement('div');
    threadHeader.className = 'thread-name';
    threadHeader.appendChild(document.createTextNode(msgData.thread_name))
    const threadCreatorHeader = document.createElement('div');
    threadCreatorHeader.className = 'creator col-11';
    const creatorSpan = document.createElement('span');
    creatorSpan.className = 'thread-creator';
    creatorSpan.appendChild(document.createTextNode("By: " + msgData.creator));
    const urgencyFieldImage = document.createElement("i");
    if (msgData.urgency === "Low Priority") {
      urgencyFieldImage.setAttribute("class", "col-1 bi bi-check-circle-fill");
    } else if (msgData.urgency === "High Priority") {
      urgencyFieldImage.setAttribute("class", "col-1 bi bi-bandaid-fill");
    } else if (msgData.urgency === "Normal Priority") {
      urgencyFieldImage.setAttribute("class", "col-1 bi bi-exclamation-circle-fill");
    }

    threadCreatorHeader.appendChild(threadHeader);
    threadCreatorHeader.appendChild(creatorSpan);
    threadDiv.appendChild(threadCreatorHeader);
    threadDiv.appendChild(urgencyFieldImage);
    return threadDiv;
  }
  
  async function renderThreads(threadlist) {
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    for (const msgData of threadlist) {
      let username = ""
     
      username = msgData.Creator.username;
      
      let messageDetails = createThreadObject(msgData, username);
      let messageElement = constructThread(messageDetails);
      threadWrapper.appendChild(messageElement);
      threadWrapper.scrollTop = threadWrapper.scrollHeight;
    }
  }
  
//   function slice(array, size){   
//     let slicedArray = [];
//     for (let i = 0; i < Math.ceil(array.length / size); i++) {
//         slicedArray.push(array.slice(i * size, i * size + size));
//     }
//     return slicedArray 
//   }
  
  let counter = 0;
  
//   function renderSlicedArray(slicedArray){
//     let messageBoard = document.getElementById("message-board")
//     let showMore = document.getElementById("show-more");
//     if (showMore) {
//         showMore.remove();
//     }
//     for (let i = 0; i < slicedArray[counter].length; i++) {
//       let msgData = slicedArray[counter][i];
  
//       let username = "";

//       username = msgData.creator.username;
    
//       let messageDetails = createMsgObject(msgData, username, isStatus)
//       let messageElement = constructChatMessage(messageDetails);
//       messageBoard.appendChild(messageElement);
//     }
//     if (counter + 1 < slicedArray.length && !isStatus) {
//         createShowMore(slicedArray, isPrivate)
//         counter++;  
//     }
//   }
  
//   function createShowMore(slicedArray, isPrivate){
//     let messageBoard = document.getElementById("message-board")
//     let showMore = document.createElement("div");
//     showMore.setAttribute("id", "show-more")
//     showMore.setAttribute("class", "list-group-item")
//     let showMoreText = document.createTextNode("Show More...")  
//     showMore.addEventListener("click", () => {renderSlicedArray(slicedArray, isPrivate)})
//     showMore.appendChild(showMoreText)
//     messageBoard.appendChild(showMore)
//   }
  
//   async function renderSearchedPosts(chatlist, isPrivate, isStatus) {
//     counter = 0;
//     let messageBoard = document.getElementById("message-board")
//     removeChildElements(messageBoard);
//     if(chatlist.length == 0){
//       renderEmptyMessage()
//     } else {
//       const sliceSize = 10;
//       let slicedArray = slice(chatlist, sliceSize)
//       renderSlicedArray(slicedArray, isPrivate, isStatus);    
//     }  
//   }
  
  function renderEmptyMessage(){
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    let emptyMessage = document.createElement("h1")
    let emptyMessageText = document.createTextNode("No results found")
    emptyMessage.className = 'empty-message'
    emptyMessage.appendChild(emptyMessageText)
    threadWrapper.appendChild(emptyMessage);
  }
  
  function createThreadObject(msgData, username) {
    let messageDetails = {
      creator: username,
      thread_name: msgData.thread_name,
      urgency: msgData.urgency,
    }
    return messageDetails;
  }
  
  function removeChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
  }