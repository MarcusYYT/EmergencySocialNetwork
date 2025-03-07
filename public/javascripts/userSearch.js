async function submitSearch() {
  event.preventDefault()
  let selectElement = document.getElementById('search-select');
  let selectedValue = selectElement.value;

  let searchInput = document.getElementById('directory-search-input');
  let searchValue = searchInput.value;

  const userId = document.getElementById('user-id').value;
  await fetch(`/search?q=${searchValue}&domain=${selectedValue}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => response.json()).then( async (data) => {
    await fetch(`/privatePosts/unread/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    }).then(response => response.json()).then((unRead) => {
      console.log('unread message status: ')
      console.log(unRead)
      // implement to display the notification
      renderESNList(sortUsers(data.data),unRead.data, role)
    })
  }).catch(error => {
    console.error(error);
  })
}

async function searchFinished(){
  let searchInput = document.getElementById('directory-search-input');
  let searchValue = searchInput.value;

  if (searchValue === ""){
    const userId = document.getElementById('user-id').value;
      await getUsers().then(async (data)=>{
        await fetch(`/privatePosts/unread/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        }).then(response => response.json()).then((unRead) => {
          console.log('unread message status: ')
          console.log(unRead)
          // implement to display the notification
          renderESNList(sortUsers(data.data),unRead.data, role)
        })
    });
  }
} 