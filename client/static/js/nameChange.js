isDockerActive = true;

const API_URL = isDockerActive
  ? "http://54.90.66.20"
  : "http://localhost";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.change_username');

  function showPopup(message, isError = false) {
    const el = document.getElementById('popup');
    if (!el) { alert(message); return; } // fallback if popup not on page
    el.textContent = message;
    el.className = 'popup ' + (isError ? 'error' : 'success') + ' show';
    setTimeout(() => { el.className = 'popup'; }, 2000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldUsername = e.target.oldUsername.value.trim();
    const newUsername = e.target.newUsername.value.trim();
    const userid = localStorage.getItem('userid');
    const token  = localStorage.getItem('token');

    if (!userid || !token) {
      showPopup('Please log in again.', true);
      return window.location.assign('../login.html');
    }
    if (!oldUsername || !newUsername) {
      showPopup('Please fill both fields.', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}:3000/user/${userid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ username: newUsername })
      });

      console.log('PATCH Status:', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('PATCH payload:', data);

      if (res.ok) {
        // keep UI in sync
        const updated = data.username || newUsername
        localStorage.setItem('username', newUsername);
        showPopup('Username updated');
        setTimeout(() => window.location.assign('../changeInfo.html'), 800);
      } else {
        showPopup(data.error || 'Update failed', true);
      }
    } catch (err) {
      showPopup('Network error', true);
    }
  });
});
