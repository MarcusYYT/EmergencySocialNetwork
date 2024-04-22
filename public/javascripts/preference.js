const socket = io();
async function savePreferences() {
    const userId = window.userId
    const email = document.getElementById('email').value;
    const emailPreference = document.getElementById('email-preference').value;
    const announcementUpdates = document.getElementById('announcement-updates').checked;
    const privatePostUpdates = document.getElementById('private-post-updates').checked;
    const publicPostUpdates = document.getElementById('public-post-updates').checked;
    const statusChanges = document.getElementById('status-changes').checked;
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    const data = {
      user_id: userId,
      email: email,
      email_preference: emailPreference,
      announcement_updates: announcementUpdates,
      private_post_updates: privatePostUpdates,
      public_post_updates: publicPostUpdates,
      status_changes: statusChanges
    };

    await fetch('/preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then(result => {
        alert('Preferences saved successfully');
      })
      .catch(error => {
        console.error('Error saving preferences:', error);
      });
  }

async function loadPreferences() {
    const userId = window.userId
    await fetch(`/preference/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    .then(objectData => {
        const data = objectData.data;
        if(data != null){
            document.getElementById('email').value = data.email;
            document.getElementById('email-preference').value = data.email_notification_preference;
            document.getElementById('announcement-updates').checked = data.announcement_updates;
            document.getElementById('private-post-updates').checked = data.private_post_updates;
            document.getElementById('public-post-updates').checked = data.public_post_updates;
            document.getElementById('status-changes').checked = data.status_changes;
        } 
    })
}

function routeToDirectory(){
    window.location.href=`/directory/${window.userId}`
}

function routeToSubscriber(){
  window.location.href=`/subscriber/${window.userId}`
}

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

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function logout(){
    const userId = window.userId;
    const requestBody = {
      user_id: userId,
      updateAt: "online_status",
      updateValue: "offline",
    }
    await fetch(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Performance-Test': 'true'
      },
      body: JSON.stringify(requestBody),
    }).then(response=> response.json()).then((data)=>{
      console.log(data.message)
    })

    window.location.href = `/`
  }

  socket.on("inactive", () => {
    alert("your account is changed to Inactive by a Adminitrator. You will be logged out.");
    logout();
  })
window.onload = loadPreferences;