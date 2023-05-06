async function login(username, email, password) {
    const response = await fetch("https://api.noroff.dev/api/v1/auction/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        email,
        password,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message);
    }
  
    localStorage.clear();
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("credit_score", data.creditScore || 1000);
  
    return data;
  }
  
  
  const loginForm = document.getElementById("loginForm");
  
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const data = await login(username, email, password);
      window.location.href = "/profile.html";
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  });