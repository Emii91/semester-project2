const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email.endsWith("@stud.noroff.no")) {
    alert("Email must be in the format: firstname.lastname@stud.noroff.no");
    return;
  }
  const response = await fetch("https://api.noroff.dev/api/v1/auction/auth/register", {
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
  console.log(response);
  if (!response.ok) {
    alert("Registration failed. Please try again later.");
    return;
  }
  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("username", data.username);
  localStorage.setItem("credit_score", 1000);
  window.location.href = "/login.html";
})

function checkLoginStatus() {
  const isLoggedIn = !!localStorage.getItem("access_token");
  if (isLoggedIn) {
    document.getElementById("logoutButton").style.display = "inline-block";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("registerButton").style.display = "none";
  } else {
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("loginButton").style.display = "inline-block";
    document.getElementById("registerButton").style.display = "inline-block";
  }
}
checkLoginStatus();
