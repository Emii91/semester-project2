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
        document.getElementById('listings').innerHTML = 'Sorry, something went wrong. Please try again later.';
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