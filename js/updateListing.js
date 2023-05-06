const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const apiUrl = searchParams.get('apiUrl');

console.log('id:', id);

function createHtml(details) {
    const updateListing = document.querySelector(".update-listing");
  
    const image = details.media && details.media.length > 0 ? `<div class="details-image"><img src="${details.media[0]}"></div>` : '';
  
    const bidCount = details.bids && details.bids.length > 0 ? details.bids.length : 0;
  
    updateListing.innerHTML = `
                                <div class="details-container">
                                    ${image}
                                    <div class="details-text">
                                    <h1 class="details-title">Title: ${details.title}</h1>
                                    <p class="details-description">Description: ${details.description}</p>
                                    <p class="details-endsat">Listing ends: ${details.endsAt}</p>
                                    <p class="details-bids" id="current-bid">Current highest bid: ${bidCount}</p>
                                    </div>
                                </div>`;
  }
  
  function fetchListing(id, apiUrl) {
    const url = apiUrl + id;
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    fetch(url, {
      headers
    })
    .then(response => response.json())
    .then(listing => {
      createHtml(listing);
    })
    .catch(error => console.error('Error fetching listing:', error));
  }
  
  fetchListing(id, apiUrl);


  function createHtml(details) {
    const updateListing = document.querySelector(".update-listing");
  
    const image = details.media && details.media.length > 0 ? `<div class="details-image"><img src="${details.media[0]}"></div>` : '';
  
    const bidCount = details.bids && details.bids.length > 0 ? details.bids.length : 0;
  
    updateListing.innerHTML = `
                                <div class="details-container">
                                    ${image}
                                    <div class="details-text">
                                    <h1 class="details-title">Title: ${details.title}</h1>
                                    <p class="details-description">Description: ${details.description}</p>
                                    <p class="details-endsat">Listing ends: ${details.endsAt}</p>
                                    <p class="details-bids" id="current-bid">Current highest bid: ${bidCount}</p>
                                    <div>
                                        <button id="edit-listing" class="btn btn-primary">Update Listing</button>
                                        <button id="delete-listing" class="btn btn-danger">Delete Listing</button>
                                    </div>
                                    </div>
                                </div>`;
  
    const editButton = updateListing.querySelector('#edit-listing');
    editButton.addEventListener('click', () => {
      window.location.href = `edit.html?id=${details.id}&apiUrl=${apiUrl}`;
    });
  
    const deleteButton = updateListing.querySelector('#delete-listing');
    deleteButton.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to delete this listing?');
      if (confirmation) {
        deleteListing(details.id);
      }
    });
  }
  
  function deleteListing(id) {
    const url = `${apiUrl}${id}`;
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    fetch(url, {
        method: 'DELETE',
        headers
      })
      .then(() => {
        window.location.href = 'edit.html';
      })
      .catch(error => console.error('Error deleting listing:', error));
  }