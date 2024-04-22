const socket = io();
socket.on('connect', async function() {
    console.log('Connected to server');
    console.log('Socket ID:', socket.id);
    const userId = window.userId;
    await fetch(`/sockets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id: userId, socket_id: socket.id, operation:'register'})})
            .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error register socket:', error);
        });
});

async function loadSubscribers() {
    const userId = window.userId
    await fetch(`/subscribers/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(objectData => {
        const data = objectData.data;
        console.log(data)
        const subscriberList = document.getElementById('subscriber-list');
        subscriberList.innerHTML = ''; 
        data.forEach(subscriber => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subscriber.User.username}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeSubscriber('${subscriber.master_id}', '${userId}')">Remove</button>
                </td>
            `;
            subscriberList.appendChild(row);  
         })
    });
}

async function addSubscriber(){
    const userId = window.userId
    const subscriberUsername = document.getElementById('subscriber-username').value;
    if (!subscriberUsername) {
        alert('Please enter a username to subscribe to');
        return;
    }

    await fetch('/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subscriber_id: userId,
            username: subscriberUsername
        }),
    }).then(response => response.json()).then(data =>{
        if (data.success === true){
            alert('Subscriber added successfully');
            loadSubscribers();
        } else {
            alert(data.message);
        }
    });

}

function routeToSetting(){
    window.location.href=`/setting/${window.userId}`
}

async function removeSubscriber(subscriberId, userId) {
    const response = await fetch(`/subscribers/${userId}/${subscriberId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('Subscription removed successfully');
        loadSubscribers(); 
    } else {
        const error = await response.json();
        alert(`Failed to remove subscription: ${error.message}`);
    }
}

window.onload = loadSubscribers;
