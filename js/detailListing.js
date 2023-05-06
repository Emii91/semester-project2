const detailListing = document.querySelector(".container");
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

const url = "https://api.noroff.dev/api/v1/auction/listings/" + id;

async function fetchListing() {
    try {
        const response = await fetch(url);
        const details = await response.json();

        console.log(details);

        createHtml(details);
        setupBidButton(details);
    }
    catch(error) {
        console.log(error);
    }
}

fetchListing();


function createHtml(details) {
  const endsAtDate = new Date(details.endsAt);
  const formattedEndsAtDate = endsAtDate.toLocaleDateString();

    detailListing.innerHTML = ` <div class="details-container">
                                <div class="details-image"><img src="${details.media[0]}"></div>
                                <div class="details-text">
                                <h1 class="details-title">${details.title}<h1>
                                <p class="details-description">${details.description}</p>
                                <p class="details-endsat">Listing ends: ${formattedEndsAtDate}</p>
                                <p class="details-bids" id="current-bid">Current highest bid: ${details._count.bids}</p>
                                    <input id="bid-amount" type="number" placeholder="Bid amount" />
                                    <button id="place-bid" class="btn btn-primary">Place bid</button>
                                </div>
                            </div>`;
}


function setupBidButton(details) {
    const bidButton = document.querySelector("#place-bid");
    const bidInput = document.querySelector("#bid-amount");
    const token = localStorage.getItem("access_token");
    const user = {
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email")
    };

    if (!token) {
        bidButton.disabled = true;
        bidButton.innerText = "Log in to place a bid";
        bidInput.disabled = true;
        return;
    }

    bidButton.disabled = false;
    bidButton.addEventListener("click", () => {
        const amount = bidInput.value;

        if (amount !== "") {
            createBid(amount, token, user);
        }
    });
}

async function createBid(amount, token, user) {
    try {
      if (isNaN(amount)) {
        console.error("Amount is not a number");
        return;
      }
  
      const bid = {
        amount: parseInt(amount)
      };
      console.log("Amount value:", amount);
  
      if (!token || !user) {
        console.error("User information not found in local storage");
        return;
      }
  
      const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${id}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Name": user.name,
          "X-User-Email": user.email
        },
        body: JSON.stringify(bid)
      });
      console.log("Token value:", token);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
  
      const data = await response.json();
      console.log("Response from API:", data);
  
      const bidSuccessMsg = document.createElement("p");
      bidSuccessMsg.textContent = "Bid placed successfully";
      bidSuccessMsg.classList.add("bid-success");
      document.querySelector(".details-text").appendChild(bidSuccessMsg);
      console.log("Bid placed successfully", data);
  
      const credits = localStorage.getItem("credit_score");
      if (!credits) {
        console.error("Credits not found in local storage");
        return;
      }
      const newCreditScore = parseInt(credits) - parseInt(amount);
      localStorage.setItem("credit_score", newCreditScore);
      console.log("Credits updated in local storage");
  
      setTimeout(() => {
        bidSuccessMsg.style.opacity = 0;
      }, 10000);
  
      setTimeout(() => {
        fetchListing();
      }, 1000);
  
      console.log("Page reloaded");
    } catch (error) {
      console.error("Failed to place bid:", error.message);
      if (error instanceof TypeError) {
        console.error("Response is not valid JSON:", error);
      }
    }
  }