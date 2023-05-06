const defaultAvatar = "images/defaultavatar.png"; 

const creditScore = localStorage.getItem("credit_score");
const email = localStorage.getItem("email");
const username = localStorage.getItem("name");
const avatar = localStorage.getItem("avatar");

const creditScoreSpan = document.getElementById("creditScore");
creditScoreSpan.textContent = creditScore;

const emailSpan = document.getElementById("email");
emailSpan.textContent = email;

const usernameSpan = document.getElementById("username");
usernameSpan.textContent = username;

const avatarInput = document.getElementById("avatarInput");
const avatarImg = document.getElementById("avatar");

if (avatar) {
  avatarImg.src = `data:image/png;base64,${avatar}`;
} else {
  avatarImg.src = defaultAvatar;
}

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64Image = reader.result.split(",")[1];
    localStorage.setItem("avatar", base64Image);
    avatarImg.src = `data:image/png;base64,${base64Image}`;
  };
});



const bidsContainer = document.getElementById('profile-bids');
const token = localStorage.getItem('access_token');
let data;
const listingsPerLoad = 3;
let currentIndex = 0;

if (!username) {
  console.error('Username is missing from local storage');
}

const loadMoreButton = document.createElement('button');
loadMoreButton.classList.add('btn', 'btn-primary', 'mt-4');
loadMoreButton.textContent = 'Load More';
loadMoreButton.setAttribute('id', 'load-more');
loadMoreButton.addEventListener('click', () => {
  currentIndex += listingsPerLoad;
  if (currentIndex >= data.length) {
    currentIndex = 0;
    loadMoreButton.textContent = 'Show More';
  }
  displayListings();
});

function displayListings() {
  bidsContainer.innerHTML = '';
  const listings = data.slice(currentIndex, currentIndex + listingsPerLoad).map(listing => {
    const item = document.createElement('div');
    item.classList.add('col', 'mb-4');
    item.innerHTML = ` 
                    <div class="card h-100">
                        <div class="card-body">
                        <p class="card-text">${listing.bidderName}</p>
                        <p class="card-text">Last bid placed: ${listing.created}</p>
                        </div>
                    </div>`;  
    return item;
  });
  listings.forEach(listing => {
    bidsContainer.appendChild(listing);
  });
  bidsContainer.appendChild(loadMoreButton);
}

fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}/bids?_listing=true`, {
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(json => {
  data = json;
  if (data.errors) {
    console.error(data[0]);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'There was an error fetching the bids.';
    listingsContainer.appendChild(errorMessage);
  } else {
    displayListings();
  }
})
.catch(error => {
  console.error(error);
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'There was an error fetching the listings.';
  bidsContainer.appendChild(errorMessage);
});