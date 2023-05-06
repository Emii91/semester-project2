function checkLoginStatus() {
    const isLoggedIn = !!localStorage.getItem("access_token");
    const logoutButton = document.getElementById("logoutButton");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const profileButton = document.getElementById("profileButton");
  
    if (isLoggedIn) {
      logoutButton.style.display = "inline-block";
      loginButton.style.display = "none";
      registerButton.style.display = "none";
      if (logoutButton.style.display === "inline-block") {
        profileButton.style.display = "inline-block";
      } else {
        profileButton.style.display = "none";
      }
    } else {
      logoutButton.style.display = "none";
      loginButton.style.display = "inline-block";
      registerButton.style.display = "inline-block";
      profileButton.style.display = "none";
    }
  }
  
  window.addEventListener("load", () => {
    checkLoginStatus();
  });
  
  const logoutButton = document.getElementById("logoutButton");
  
  logoutButton.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/index.html";
  });