document.addEventListener("DOMContentLoaded", () => {
  // User cannot access homepage if not logged in
  if (!localStorage.getItem("token")) {
    window.location.replace("./login.html");
    return;
  }

  // Hide Leave Recognition option from employee
  const isManager = localStorage.getItem("isadmin") === "true";
  if (!isManager) {
    document
      .querySelectorAll('[user-role="manager-only"]')
      .forEach((el) => el.remove());
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();

      if (typeof window.showPopup === "function") {
        showPopup("Logged out");
        setTimeout(() => window.location.assign("./login.html"), 800);
      } else {
        window.location.assign("./login.html");
      }
    });
  }
});
