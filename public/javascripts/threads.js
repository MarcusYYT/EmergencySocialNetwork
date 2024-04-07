function constructThread(msgData, user_id) {
    const threadDiv = document.createElement('div');
    threadDiv.className = 'thread row g-0 justify-content-between';
    
    const threadHeader = document.createElement('div');
    threadHeader.className = 'thread-name';

    const urgencyFieldImage = document.createElement("i");
    if (msgData.urgency === "Low Priority") {
      urgencyFieldImage.setAttribute("class", "lowPriority col-1 bi bi-record-fill");
    } else if (msgData.urgency === "High Priority") {
      urgencyFieldImage.setAttribute("class", "highPriority col-1 bi bi-record-fill");
    } else if (msgData.urgency === "Normal Priority") {
      urgencyFieldImage.setAttribute("class", "normPriority col-1 bi bi-record-fill");
    }

    threadHeader.appendChild(urgencyFieldImage);
    threadHeader.appendChild(document.createTextNode(msgData.thread_name))
    const threadCreatorHeader = document.createElement('div');
    threadCreatorHeader.className = 'creator col-12';
    const creatorSpan = document.createElement('span');
    creatorSpan.className = 'thread-creator';
    creatorSpan.appendChild(document.createTextNode("By: " + msgData.creator));
    
    threadCreatorHeader.appendChild(threadHeader);
    threadCreatorHeader.appendChild(creatorSpan);
    threadCreatorHeader.addEventListener("click", () => {routeToThreadChat(msgData.thread_id)})

    threadDiv.appendChild(threadCreatorHeader);

    if(msgData.creator_id === user_id){
      threadCreatorHeader.className = 'creator col-11';
      const editImage = document.createElement("i");
      editImage.setAttribute("class", "col-1 bi  bi-pencil-fill");
      editImage.addEventListener("click", () => {renderEditOverlay(msgData)});
      threadDiv.appendChild(editImage);
      console.log("crea")
    }
    //threadDiv.appendChild(urgencyFieldImage);
    return threadDiv;
  }

  function renderEditOverlay(msgData){
    let editOverlay = document.createElement("div")
    editOverlay.setAttribute("id", "overlay")
    let body = document.getElementsByTagName("body")[0]
    let postWrapper = document.getElementById("post-wrapper")
    let editModal = document.createElement("div")
    editModal.setAttribute("id", "editModal")

    let cancelButton = document.createElement("i")
    cancelButton.setAttribute("class", "bi bi-x")
    cancelButton.addEventListener("click", () => {removeEditOverlay()})

    let editHeader = document.createElement("h2")
    editHeader.setAttribute("id", "editHeader")
    editHeader.appendChild(document.createTextNode("Edit Thread"))

    let threadNameWrapper = createGroupNameWrapper(msgData.thread_name);
    let urgencyWrapper = createUrgencyWrapper(msgData.urgency);
    let buttonWrapper = createEditButttonWrapper(msgData.thread_id, msgData.thread_name);

    editModal.appendChild(cancelButton)
    editModal.appendChild(editHeader)
    editModal.appendChild(threadNameWrapper)
    editModal.appendChild(urgencyWrapper)
    editModal.appendChild(buttonWrapper)
    body.insertBefore(editOverlay, postWrapper)
    body.insertBefore(editModal, postWrapper)
  }
  
  async function renderThreads(threadlist, user_id) {
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    for (const msgData of threadlist) {

      let creator = msgData.Creator.username;
      
      let messageDetails = createThreadObject(msgData, creator);
      let messageElement = constructThread(messageDetails, user_id);
      
      threadWrapper.appendChild(messageElement);
      threadWrapper.scrollTop = threadWrapper.scrollHeight;
    }
  }

  async function renderEditedThreads(threadlist, user_id) {
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    for (const msgData of threadlist) {
      let creator = msgData.Creator.username;     
      let messageDetails = createThreadObject(msgData, creator);
      let messageElement = constructThread(messageDetails, user_id);
      
      threadWrapper.appendChild(messageElement);
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
      creator_id: msgData.creator_id,
      thread_name: msgData.thread_name,
      thread_id: msgData.thread_id,
      urgency: msgData.urgency
    }
    return messageDetails;
  }
  
  function removeChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
  }

  function createGroupNameWrapper(selectedName){
    let threadNameWrapper = document.createElement("div")
    threadNameWrapper.setAttribute("id", "threadNameWrapper")
    let threadNameLabel = document.createElement("label")
    threadNameLabel.setAttribute("id", "threadNameLabel")
    let threadNameLabelText = document.createTextNode("Thread Topic:")
    threadNameLabel.appendChild(threadNameLabelText)
    let threadNameInput = document.createElement("input")
    threadNameInput.setAttribute("class", "form-control")
    threadNameInput.setAttribute("id", "threadNameInput")
    threadNameInput.setAttribute("type", "text")
    if(selectedName != undefined){
      threadNameInput.value = selectedName
    }
    threadNameWrapper.appendChild(threadNameLabel)
    threadNameWrapper.appendChild(threadNameInput)
    return threadNameWrapper
  }

  function createUrgencyWrapper(selected){
    let urgencyWrapper = document.createElement("div")
    urgencyWrapper.setAttribute("id", "urgencyWrapper")
    let urgencySelect = document.createElement("select")
    urgencySelect.setAttribute("class", "form-select-sm")
    urgencySelect.setAttribute("id", "urgencySelect")
    let urgencyLabel = document.createElement("label")
    urgencyLabel.setAttribute("id", "urgencyLabel")
    let urgencyLabelText =  document.createTextNode("Urgency Level:")
    urgencyLabel.appendChild(urgencyLabelText)
    urgencyWrapper.appendChild(urgencyLabel)
    let urgencyHigh = document.createElement("option")
    urgencyHigh.setAttribute("value", "High Priority")
    let urgencyHighText = document.createTextNode("High Priority")
    urgencyHigh.appendChild(urgencyHighText)
    let urgencyNormal = document.createElement("option")
    urgencyNormal.setAttribute("value", "Normal Priority")
    let urgencyNormalText = document.createTextNode("Normal Priority")
    urgencyNormal.appendChild(urgencyNormalText)
    let urgencyLow = document.createElement("option")
    urgencyLow.setAttribute("value", "Low Priority")
    let urgencyLowText = document.createTextNode("Low Priority")


    //pre-selects the urgency level chosen
    if(selected == "High Priority"){
      urgencyHigh.setAttribute("selected", true)
    }

    else if(selected == "Normal Priority"){
      urgencyNormal.setAttribute("selected", true)
    }

    else if(selected == "Low Priority"){
      urgencyLow.setAttribute("selected", true)
    }

    urgencyLow.appendChild(urgencyLowText)
    urgencySelect.appendChild(urgencyHigh)
    urgencySelect.appendChild(urgencyNormal)
    urgencySelect.appendChild(urgencyLow)
    urgencyWrapper.appendChild(urgencySelect)
    return urgencyWrapper
  }

  function createButttonWrapper(){
    let buttonWrapper = document.createElement("div")
    buttonWrapper.setAttribute("id", "buttonWrapper")
    let createThreadButton = document.createElement("button")
    createThreadButton.className = "btn btn-primary"
    let createThreadButtonText = document.createTextNode("Create Thread")
    createThreadButton.appendChild(createThreadButtonText)
    createThreadButton.addEventListener("click", () => {createThread()})
    let cancelButton = document.createElement("button")
    cancelButton.className = "cancel btn btn-danger"
    let cancelButtonText = document.createTextNode("Cancel")
    cancelButton.appendChild(cancelButtonText)
    cancelButton.addEventListener("click", () => {removeCreateOverlay()})
    buttonWrapper.appendChild(cancelButton)
    buttonWrapper.appendChild(createThreadButton)
    return buttonWrapper
  }

  function removeCreateOverlay(){
    document.getElementById("overlay").remove();
    document.getElementById("createModal").remove();
  }

  function createEditButttonWrapper(thread_id, prev_thred_name){
    let buttonWrapper = document.createElement("div")
    buttonWrapper.setAttribute("id", "buttonWrapper")
    let createThreadButton = document.createElement("button")
    createThreadButton.className = "btn btn-primary"
    let createThreadButtonText = document.createTextNode("Save Changes")
    createThreadButton.appendChild(createThreadButtonText)
    createThreadButton.addEventListener("click", () => {editThread(thread_id, prev_thred_name)})
    let deleteButton = document.createElement("button")
    deleteButton.className = "delete btn btn-danger"
    let deleteButtonText = document.createTextNode("Delete Thread")
    deleteButton.appendChild(deleteButtonText)
    deleteButton.addEventListener("click", () => {deleteThread(thread_id)})
    buttonWrapper.appendChild(deleteButton)
    buttonWrapper.appendChild(createThreadButton)
    return buttonWrapper
  }

  function removeEditOverlay(){
    document.getElementById("overlay").remove();
    document.getElementById("editModal").remove();
  }