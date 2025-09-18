document.addEventListener("DOMContentLoaded", () => {
    const link = document.getElementById("dataPageLink");
    if (!link) return; 

    link.addEventListener("click", function(e) {
        e.preventDefault(); 

        const username = localStorage.getItem("username");
        if (!username) {
            alert("Log in");
            window.location.href = "login.html"; 
            return;
        }
        window.location.href = `http://127.0.0.1:3001/datapage?username=${username}`;
    });
});
