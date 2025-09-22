document.addEventListener("DOMContentLoaded", () => {
  // const backBtn = document.getElementById("backBtn");
  // if (backBtn) {
  //   backBtn.addEventListener("click", () => {
  //     window.location.href = "http://127.0.0.1:5500/project-ELF/client/pages/homepage.html";
  //   });
  // }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.assign("http://127.0.0.1:5500/project-ELF/client/pages/login.html");
    });
  }
});
