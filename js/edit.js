const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
const apiUrl = searchParams.get('apiUrl');

const updateListingForm = document.querySelector('#update-listing-form');
const titleInput = updateListingForm.querySelector('#title-input');
const descriptionInput = updateListingForm.querySelector('#description-input');
const tagInput = updateListingForm.querySelector('#tag-input');
const imageInput = updateListingForm.querySelector('#image-input');

fetch(`${apiUrl}${id}`)
  .then(response => response.json())
  .then(listing => {
    titleInput.value = listing.title;
    descriptionInput.value = listing.description;
    tagInput.value = listing.tags.join(', ');
    imageInput.value = listing.media.join(', ');
  })
  .catch(error => console.error('Error fetching listing:', error));

updateListingForm.addEventListener('submit', event => {
  event.preventDefault();

  const updatedData = {
    title: titleInput.value,
    description: descriptionInput.value,
    tags: tagInput.value.split(',').map(tag => tag.trim()),
    media: imageInput.value.split(',').map(image => image.trim())
  };

  const token = localStorage.getItem('access_token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  fetch(`${apiUrl}${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedData)
  })
  .then(() => {
    window.location.href = `updateListing.html?id=${id}&apiUrl=${apiUrl}`;
  })
  .catch(error => console.error('Error updating listing:', error));
});