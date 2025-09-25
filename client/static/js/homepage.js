document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.replace("./login.html");
    return;
  }

  const username = localStorage.getItem("username");
  const firstname = localStorage.getItem("firstname");
  const welcomeUser = document.getElementById("welcomeUser");
  if (username && welcomeUser) {
    welcomeUser.textContent = `Welcome ${firstname}`;
  }

  
  const nameSpan = document.getElementById("dropdownUsername");
  if (nameSpan && username) nameSpan.textContent = username;

  const isManager = localStorage.getItem("isadmin") === "true";
  if (!isManager) {
    document
      .querySelectorAll('[user-role="manager-only"]')
      .forEach((el) => el.remove());
  }

  const dataPageLink = document.getElementById("dataPageLink");
  if (dataPageLink) {
    dataPageLink.addEventListener("click", (e) => {
      e.preventDefault();
      const userid = localStorage.getItem("userid");
      if (!userid) {
        alert("Please log in");
        window.location.href = "./login.html";
        return;
      }
      window.location.href = `http://127.0.0.1:3001/datapage?userid=${userid}`;
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href("./login.html");
    });
  }
});

const modal = document.getElementById("supportModal");
const btn = document.getElementById("requestSupportBtn");
const close = document.querySelector(".close");
const form = document.getElementById("supportForm");

btn.addEventListener("click", () => {
  modal.style.display = "flex";
});

close.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  console.log("Form submitted:", data);
  alert("Your request has been sent!");
  modal.style.display = "none";
  form.reset();
});
