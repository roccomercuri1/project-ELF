document
  .querySelector(".signup_form")
  .addEventListener("submit", register_event);

function showPopup(message, isError = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;

  popup.className = "popup " + (isError ? "error" : "success") + " show";

  setTimeout(() => {
    popup.className = "popup";
  }, 3000);
}

async function register_event(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isadmin: form.get("isadmin") === "true",
      firstname: form.get("firstname"),
      email: form.get("email"),
      username: form.get("username"),
      userpassword: form.get("userpassword"),
    }),
  };
  const response = await fetch("http://98.81.184.105:3000/user/register", options)

  const data = await response.json();

  if (response.ok) {
    showPopup("Successfully Registered");
    e.target.reset();
    setTimeout(() => window.location.assign("./login.html"), 800);
  } else {
    if (data.error && data.error.toLowerCase().includes("already exists")) {
      showPopup("User already exists!", true);
    } else {
      showPopup(data.error || "Registration failed", true);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const redirectLogin = document.getElementById("redirectLogin");

  if (redirectLogin) {
    redirectLogin.addEventListener("click", () => {
      window.location.assign("login.html");
    });
  }
});
