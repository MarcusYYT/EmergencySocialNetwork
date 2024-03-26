function constructAnnouncement(sender, message, dateTime) {

    const messageDiv = document.createElement('div');
    messageDiv.className = 'card';
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

    messageUsernameHeader.appendChild(senderSpan);
    messageHeader.appendChild(dateSpan);

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    messageBody.textContent = message;

    let cardBody = document.createElement("div");
    cardBody.className = 'card-body';
    cardBody.appendChild(messageUsernameHeader);
    cardBody.appendChild(messageHeader);
    cardBody.appendChild(messageBody);

    messageDiv.appendChild(cardBody)


    return messageDiv;

}

async function renderAnnouncements(chatlist) {

    let announcementBoard = document.getElementById("announcement-board")

    while(announcementBoard.firstChild){
        announcementBoard.removeChild(announcementBoard.lastChild);
    }

    for (const msgData of chatlist) {

        let username = msgData.user.username;

        let messageElement = constructAnnouncement(
            username,
            msgData.content,
            msgData.createdAt
        );

        announcementBoard.appendChild(messageElement);
        announcementBoard.scrollTop = announcementBoard.scrollHeight;
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

function renderSlicedArray(slicedArray){
    console.log(counter)
    let announcementBoard = document.getElementById("announcement-board")

    let showMore = document.getElementById("show-more");
    if(showMore){
        showMore.remove();
    }

    for (let i = 0; i < slicedArray[counter].length; i++) {

        let msgData = slicedArray[counter][i];

        let username = msgData.user.username;

        let messageElement = constructAnnouncement(
            username,
            msgData.content,
            msgData.createdAt
        );

        announcementBoard.appendChild(messageElement);
        
    }

    if(counter + 1 < slicedArray.length){
        createShowMore(slicedArray)
        counter++;
        
    }

}

function createShowMore(slicedArray){
    let announcementBoard = document.getElementById("announcement-board")
    let showMore = document.createElement("div");
    showMore.setAttribute("id", "show-more")
    showMore.setAttribute("class", "list-group-item")
    let showMoreText = document.createTextNode("Show More...")

    
    showMore.addEventListener("click", () => {renderSlicedArray(slicedArray)})
    showMore.appendChild(showMoreText)
    announcementBoard.appendChild(showMore)
}

async function renderSearchedAnnouncements(chatlist) {

    counter = 0;

    let announcementBoard = document.getElementById("announcement-board")

    while(announcementBoard.firstChild){
        announcementBoard.removeChild(announcementBoard.lastChild);
    }

    if(chatlist.length == 0){
        renderEmptyAnnouncement();
    }

    else{
        const sliceSize = 10; 
        let slicedArray = slice(chatlist, sliceSize)
        console.log(slicedArray)
        renderSlicedArray(slicedArray);  
    }
}

function renderEmptyAnnouncement(){
    console.log("RENDER EMPTY ANNOUNCEMENT")
    let announcementBoard = document.getElementById("announcement-board")
    while(announcementBoard.firstChild){
        announcementBoard.removeChild(announcementBoard.lastChild);
    }

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

