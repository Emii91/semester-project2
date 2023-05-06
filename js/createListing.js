const form = document.getElementById('createListingForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); 
  const formData = new FormData(event.target); 
  const body = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'tags' || key === 'media') {
      body[key] = [value];
    } else {
      body[key] = value;
    }
  }
  body.endsAt = new Date(body.endsAt).toISOString(); 
  console.log(body);

  const accessToken = localStorage.getItem('access_token');
  const response = await fetch('https://api.noroff.dev/api/v1/auction/listings', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    console.log(errorMessage);
  } else {
    successMessage.classList.add('success');
    successMessage.innerText = 'Listing created successfully!';
    form.reset();
  }
});