/**
 * Contructs an Announcement using the message data
 * @param {*} msgData the message data
 * @returns an announcement dom element
 */
function constructAnnouncement(msgData) {
    const announcementDiv = document.createElement('div');
    announcementDiv.className = 'card';
    const announcementHeader = document.createElement('div');
    announcementHeader.className = 'd-flex w-100 justify-content-between';
    const announcementUsernameHeader = document.createElement('div');
    announcementUsernameHeader.className = 'd-flex w-100 justify-content-between';
    const authorSpan = document.createElement('span');
    authorSpan.className = 'message-sender';
    authorSpan.textContent = msgData.sender;
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-date';
    timeSpan.textContent = new Date(msgData.dateTime).toLocaleString();
    announcementUsernameHeader.appendChild(authorSpan);
    announcementHeader.appendChild(timeSpan);
    const announcementBody = document.createElement('div');
    announcementBody.className = 'message-body';
    announcementBody.textContent = msgData.message;
    let cardBody = document.createElement("div");
    cardBody.className = 'card-body';
    cardBody.appendChild(announcementUsernameHeader);
    cardBody.appendChild(announcementHeader);
    cardBody.appendChild(announcementBody);
    announcementDiv.appendChild(cardBody)
    return announcementDiv;
}

/**
 * Renders all the announcements on the dom
 * @param {*} chatlist The list of announcements
 */
async function renderAnnouncements(chatlist) {
    let announcementBoard = document.getElementById("announcement-board")
    removeAnnoucementElement(announcementBoard)
    for (const msgData of chatlist) {
        let announcementDetails = createDataObject(msgData)
        let announcementElement = constructAnnouncement(announcementDetails);
        announcementBoard.appendChild(announcementElement);
        announcementBoard.scrollTop = announcementBoard.scrollHeight;
    }
}

/**
 * renders the sliced array from the search
 * @param {*} slicedArray the array of sliced results
 */
function renderSlicedArray(slicedArray){
    let announcementBoard = document.getElementById("announcement-board")
    let showMore = document.getElementById("show-more");
    if (showMore) {
        showMore.remove();
    }
    for (let i = 0; i < slicedArray[counter].length; i++) {
        let msgData = slicedArray[counter][i];
        let announcementDetails = createDataObject(msgData)
        let announcementElement = constructAnnouncement(
            announcementDetails
        );
        announcementBoard.appendChild(announcementElement);
    }
    if (counter + 1 < slicedArray.length){
        createShowMoreButton(slicedArray, "announcement-board")
        counter++;   
    }
}

/**
 *  Renders the show more button on the bottom
 * @param {*} slicedArray the array of sliced results
 */
function createShowMoreButton(slicedArray, id){
    let element = document.getElementById(id)
    let showMore = document.createElement("div");
    showMore.setAttribute("id", "show-more")
    showMore.setAttribute("class", "list-group-item")
    let showMoreText = document.createTextNode("Show More...")
  
    showMore.addEventListener("click", () => {renderSlicedArray(slicedArray)})
    showMore.appendChild(showMoreText)
    element.appendChild(showMore)
}

// function createShowMore(slicedArray){
//     let announcementBoard = document.getElementById("announcement-board")
//     let showMore = document.createElement("div");
//     showMore.setAttribute("id", "show-more")
//     showMore.setAttribute("class", "list-group-item")
//     let showMoreText = document.createTextNode("Show More...")
  
//     showMore.addEventListener("click", () => {renderSlicedArray(slicedArray)})
//     showMore.appendChild(showMoreText)
//     announcementBoard.appendChild(showMore)
// }

/**
 * Renders the array of searched announcements
 * @param {*} chatlist The list of announcements to render
 */
async function renderSearchedAnnouncements(chatlist) {
    counter = 0;
    let announcementBoard = document.getElementById("announcement-board")
    removeAnnoucementElement(announcementBoard);
    if (chatlist.length == 0) {
        renderEmptyAnnouncement();
    } else {
        const sliceSize = 10; 
        let slicedArray = slice(chatlist, sliceSize)
        renderSlicedArray(slicedArray);  
    }
}

/**
 * Renders the empty announcement message
 */
function renderEmptyAnnouncement(){
    let announcementBoard = document.getElementById("announcement-board")
    removeAnnoucementElement(announcementBoard);
    let card = document.createElement("div")
    let cardBody = document.createElement("div")
    card.className = "card"
    cardBody.className = "card-body"
    let emptyAnnouncement = document.createElement("h1")
    let emptyAnnouncementText = document.createTextNode("No results found")
    emptyAnnouncement.className = 'empty-announcement'
    emptyAnnouncement.appendChild(emptyAnnouncementText)
    cardBody.appendChild(emptyAnnouncement)
    card.appendChild(cardBody)
    announcementBoard.appendChild(card);
}

/**
 * Creates a announcement json object
 * @param {*} data the data to insert in the announcement object
 * @returns the created data object
 */
function createDataObject(data) {
    let announcementDetails = {
        sender: data.user.username,
        message: data.content,
        dateTime: data.createdAt
    }
    return announcementDetails;
}

/**
 * Removes the announcement board from the screen
 * @param {*} announcementBoard The announcement board dom element 
 */
function removeAnnoucementElement(announcementBoard) {
    while (announcementBoard.firstChild) {
        announcementBoard.removeChild(announcementBoard.lastChild);
    }
}