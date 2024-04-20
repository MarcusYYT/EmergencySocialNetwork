function createUrgencyImage(urgency){
  let urgencyFieldImage = document.createElement("i");
  if (urgency === "Low Priority") {
    urgencyFieldImage.setAttribute("class", "lowPriority col-1 bi bi-record-fill");
  } else if (urgency === "High Priority") {
    urgencyFieldImage.setAttribute("class", "highPriority col-1 bi bi-record-fill");
  } else if (urgency === "Normal Priority") {
    urgencyFieldImage.setAttribute("class", "normPriority col-1 bi bi-record-fill");
  }
  return urgencyFieldImage;
}
function constructThread(msgData, user_id) {
    const threadDiv = document.createElement('div');
    threadDiv.className = 'thread row g-0 justify-content-between'; 
    const threadHeader = document.createElement('div');
    threadHeader.className = 'thread-name';
    const urgencyFieldImage = createUrgencyImage(msgData.urgency)
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
    }
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
    let tagWrapper = createTagWrapper(msgData.tags);
    let buttonWrapper = createEditButttonWrapper(msgData.thread_id, msgData.thread_name);
    editModal.appendChild(cancelButton)
    editModal.appendChild(editHeader)
    editModal.appendChild(threadNameWrapper)
    editModal.appendChild(urgencyWrapper)
    editModal.appendChild(tagWrapper)
    editModal.appendChild(buttonWrapper)
    body.insertBefore(editOverlay, postWrapper)
    body.insertBefore(editModal, postWrapper)
  }
  
  async function renderThreads(threadlist, user_id, isEdited) {
    renderEditedThreads(threadlist, user_id, isEdited);
  }

  async function renderEditedThreads(threadlist, user_id, isEdited) {
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    for (const msgData of threadlist) {
      let creator = msgData.Creator.username;     
      let messageDetails = createThreadObject(msgData, creator);
      let messageElement = constructThread(messageDetails, user_id);   
      threadWrapper.appendChild(messageElement);
      if (!isEdited) {
        threadWrapper.scrollTop = threadWrapper.scrollHeight;
      }
    }
  }

  function createButtonLabel(text){
    let label = document.createElement("label")
    label.setAttribute("class", "tag btn btn-outline-primary")
    label = addTextToElement(label, text)
    return label
  }

  function createTag(id, value, selected){
    let input = document.createElement("input")
    input.setAttribute("class", "tag btn-check")
    input.setAttribute("type", "checkbox")
    input.setAttribute("id", id)
    input.setAttribute("value", value)
    if(selected.includes(value)){
      input.setAttribute("checked", true)
    }
    return input
  }

  function createTagWrapper(selected){
    let tagWrapper = document.createElement("div")
    tagWrapper.setAttribute("id", "tagWrapper")

    if(selected == undefined){
      selected = []
    }

    let disasterTag = createTag("disaster", "Incident Report", selected)
    let disasterLabel = createButtonLabel("Incident Report")
    disasterLabel.setAttribute("for", "disaster")
    let statusReportTag =  createTag("status-report", "Status Report", selected)
    let statusReportLabel = createButtonLabel("Status Report")
    statusReportLabel.setAttribute("for", "status-report")
    let infoTag =  createTag("info", "Info", selected)
    let infoLabel = createButtonLabel("Info")
    infoLabel.setAttribute("for", "info")
    let volunteerTag =  createTag("volunteer", "Volunteering", selected)
    let volunteerLabel = createButtonLabel("Volunteering")
    volunteerLabel.setAttribute("for", "volunteer")
    let textWrapper = document.createElement("label")
    textWrapper = addTextToElement(textWrapper, "Choose a tag: ")
    tagWrapper.appendChild(textWrapper)

    tagWrapper.appendChild(disasterTag)
    tagWrapper.appendChild(disasterLabel)
    tagWrapper.appendChild(statusReportTag)
    tagWrapper.appendChild(statusReportLabel)
    tagWrapper.appendChild(infoTag)
    tagWrapper.appendChild(infoLabel)
    tagWrapper.appendChild(volunteerTag)
    tagWrapper.appendChild(volunteerLabel)
    return tagWrapper
  }
  
  function renderSlicedArray(slicedArray){
    let threadWrapper = document.getElementById("threadWrapper")
    let showMore = document.getElementById("show-more");
    if (showMore) {
        showMore.remove();
    }
    for (let i = 0; i < slicedArray[counter].length; i++) {
      let msgData = slicedArray[counter][i];

      let username = msgData.Creator.username;
    
      let messageDetails = createThreadObject(msgData, username)
      let messageElement = constructThread(messageDetails);
      threadWrapper.appendChild(messageElement);
    }
    if (counter + 1 < slicedArray.length) {
        createShowMore(slicedArray)
        counter++;  
    }
  }
  
  function createShowMore(slicedArray){
    let threadWrapper = document.getElementById("threadWrapper")
    let showMore = document.createElement("div");
    showMore.setAttribute("id", "show-more")
    showMore.setAttribute("class", "list-group-item")
    let showMoreText = document.createTextNode("Show More...")  
    showMore.addEventListener("click", () => {renderSlicedArray(slicedArray)})
    showMore.appendChild(showMoreText)
    threadWrapper.appendChild(showMore)
  }
  
  async function renderSearchedThreads(chatlist) {
    counter = 0;
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper);
    if(chatlist.length == 0){
      renderEmptyMessage()
    } else {
      const sliceSize = 10;
      let slicedArray = slice(chatlist, sliceSize)
      renderSlicedArray(slicedArray);    
    }  
  }
  
  function renderEmptyMessage(){
    let threadWrapper = document.getElementById("threadWrapper")
    removeChildElements(threadWrapper)
    let emptyMessage = document.createElement("h1")
    emptyMessage = addTextToElement(emptyMessage, "No results found")
    emptyMessage.className = 'empty-message'
    threadWrapper.appendChild(emptyMessage);
  }
  
  function createThreadObject(msgData, username) {
    let messageDetails = {
      creator: username,
      creator_id: msgData.creator_id,
      thread_name: msgData.thread_name,
      thread_id: msgData.thread_id,
      tags: msgData.tags,
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
    threadNameLabel = addTextToElement(threadNameLabel, "Thread Topic:")
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

  function createUrgencyOption(priority, selected){
    let option = document.createElement("option")
    option.setAttribute("value", priority)
    option = addTextToElement(option, priority)

    if(selected == priority){
      option.setAttribute("selected", true)
    }

    return option
  }

  function createUrgencyWrapper(selected){
    let urgencyWrapper = document.createElement("div")
    urgencyWrapper.setAttribute("id", "urgencyWrapper")
    let urgencySelect = document.createElement("select")
    urgencySelect.setAttribute("class", "form-select-sm")
    urgencySelect.setAttribute("id", "urgencySelect")
    let urgencyLabel = document.createElement("label")
    urgencyLabel.setAttribute("id", "urgencyLabel")
    urgencyLabel = addTextToElement(urgencyLabel, "Urgency Level:")
    urgencyWrapper.appendChild(urgencyLabel)
    let urgencyHigh = createUrgencyOption("High Priority", selected)
    let urgencyNormal = createUrgencyOption("Normal Priority", selected)
    let urgencyLow = createUrgencyOption("Low Priority", selected)
    urgencySelect.appendChild(urgencyHigh)
    urgencySelect.appendChild(urgencyNormal)
    urgencySelect.appendChild(urgencyLow)
    urgencyWrapper.appendChild(urgencySelect)
    return urgencyWrapper
  }

  function addTextToElement(element, text){
    let textNode = document.createTextNode(text)
    element.appendChild(textNode)
    return element
  }

  function createButttonWrapper(){
    let buttonWrapper = document.createElement("div")
    buttonWrapper.setAttribute("id", "buttonWrapper")
    let createThreadButton = document.createElement("button")
    createThreadButton.className = "btn btn-primary"
    createThreadButton = addTextToElement(createThreadButton, "Create Thread")
    createThreadButton.addEventListener("click", () => {createThread()})
    let cancelButton = document.createElement("button")
    cancelButton.className = "cancel btn btn-danger"
    cancelButton = addTextToElement(cancelButton, "Cancel")
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
    createThreadButton = addTextToElement(createThreadButton, "Save Changes")
    createThreadButton.addEventListener("click", () => {editThread(thread_id, prev_thred_name)})
    let deleteButton = document.createElement("button")
    deleteButton.className = "delete btn btn-danger"
    deleteButton = addTextToElement(deleteButton, "Delete Thread")
    deleteButton.addEventListener("click", () => {deleteThread(thread_id)})
    buttonWrapper.appendChild(deleteButton)
    buttonWrapper.appendChild(createThreadButton)
    return buttonWrapper
  }

  function removeEditOverlay(){
    document.getElementById("overlay").remove();
    document.getElementById("editModal").remove();
  }