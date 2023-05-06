async function fetchListings() {
    try {
      const token = localStorage.getItem('access_token');
      const name = localStorage.getItem('name');
      console.log(name);
      const url = 'https://api.noroff.dev/api/v1/auction/profiles/' + name + '/listings';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(response.statusText);
      }
  
      const listings = await response.json();
  
      return listings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      return null;
    }
  }
  
  fetchListings().then((listings) => {
    const container = document.querySelector('.userListings');
  
    const listingDivs = listings.map((listing) => {
      return `
                <div class="card" style="width: 18rem;">
                <img src="${listing.media[0]}" alt="${listing.title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">${listing.description}</p>
                    <p class="card-text">Tag: ${listing.tags}</p>
                    <p class="card-text endsat">Ends: ${new Date(listing.endsAt).toISOString().substr(0, 10)}</p>                    
                    <p class="card-text">Current highest bid: ${listing.bids && listing.bids.length > 0 ? listing.bids.reduce((acc, bid) => bid.amount > acc ? bid.amount : acc, 0) : 'None'}</p>
                    <button class="btn btn-primary edit-btn" onclick="window.location.href='updateListing.html?id=${listing.id}&apiUrl=https://api.noroff.dev/api/v1/auction/listings/'">Edit listing</button>
                </div>
                </div> `;
    });
  
    container.innerHTML = listingDivs.join('');
  });