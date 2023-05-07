function fetchListings(params) {
  let url = 'https://api.noroff.dev/api/v1/auction/listings?';
  Object.keys(params).forEach((key) => {
    url += `${key}=${params[key]}&`;
  });
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(listings => {
      renderListings(listings);
    })
    .catch(error => {
      console.error('Error:', error);
      const listingsContainer = document.getElementById('listings');
      listingsContainer.innerHTML = 'Sorry, something went wrong. Please try again later.';
      listingsContainer.classList.add('error-message');
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function renderListings(listings) {
  const listingsContainer = document.getElementById('listings');
  listingsContainer.innerHTML = ''; 
  
listings.forEach(listing => {
  const formattedEndsAt = formatDate(listing.endsAt);
  const listingElement = document.createElement('div');
  listingElement.classList.add('col-md-4', 'mb-3');
  listingElement.innerHTML = `
                              <div class="card h-100">
                                  <img src="${listing.media[0]}" class="card-img-top" alt="${listing.title}">
                                  <div class="card-body">
                                      <h5 class="card-title">${listing.title}</h5>
                                      <p class="card-text"><strong>Current bid:</strong> ${listing._count.bids}</p>
                                      <p class="card-text"><strong>Created at:</strong> ${new Date(listing.created).toLocaleString()}</p>
                                      <p class="endsAt">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z"/>
                                      </svg>
                                      <span>${formattedEndsAt}</span>
                                      </p>
                                      <a href="detailListing.html?id=${listing.id}" class="btn btn-primary" id="listing-${listing.id}-link">See listing</a>
                                  </div>
                              </div>`;
  listingsContainer.appendChild(listingElement);
});
}

const params = {
  _tag: 'fashion',
  _active: true,
  sort: 'created',
  sortOrder: 'desc',
  limit: 100
};

fetchListings(params);
const sortDropdown = document.querySelector('#sort-dropdown');
const newestOption = document.querySelector('#newest-option');
const endingSoonOption = document.querySelector('#ending-soon-option');
newestOption.addEventListener('click', () => {
  params.sort = 'created';
  params.sortOrder = 'desc';
  fetchListings(params);
});

endingSoonOption.addEventListener('click', () => {
  params.sort = 'endsAt';
  params.sortOrder = 'asc';
  fetchListings(params);
});

function refreshListings() {
  setInterval(() => {
    fetchListings(params);
  }, 30000); 
}

refreshListings();
