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
      window.location.assign("./login.html");
    });
  }
});
