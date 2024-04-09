async function savePreferences() {
    const userId = window.userId
    const email = document.getElementById('email').value;
    const emailPreference = document.getElementById('email-preference').value;
    const announcementUpdates = document.getElementById('announcement-updates').checked;
    const privatePostUpdates = document.getElementById('private-post-updates').checked;
    const publicPostUpdates = document.getElementById('public-post-updates').checked;
    const statusChanges = document.getElementById('status-changes').checked;

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
        alert('Preferences saved successfully!');
      })
      .catch(error => {
        console.error('Error saving preferences:', error);
      });
  }