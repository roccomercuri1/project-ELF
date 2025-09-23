document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.change_email');

  function showPopup(message, isError = false) {
    const el = document.getElementById('popup');
    if (!el) { alert(message); return; } // fallback if popup not on page
    el.textContent = message;
    el.className = 'popup ' + (isError ? 'error' : 'success') + ' show';
    setTimeout(() => { el.className = 'popup'; }, 2000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldEmail = e.target.oldEmail.value.trim();
    const newEmail = e.target.newEmail.value.trim();
    const userid = localStorage.getItem('userid');
    const token  = localStorage.getItem('token');

    if (!userid || !token) {
      showPopup('Please log in again.', true);
      return window.location.assign('../login.html');
    }
    if (!oldEmail || !newEmail) {
      showPopup('Please fill both fields.', true);
      return;
    }

    try {
      // Optional: verify oldEmail matches what backend has (soft check)
      let okToProceed = true;
      try {
        const me = await fetch(`http://98.81.184.105:3000/user/${userid}`, {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        if (me && me.email && me.email.trim().toLowerCase() !== oldEmail.toLowerCase()) {
          okToProceed = false;
        }
      } catch {}

      if (!okToProceed) {
        showPopup('Current email does not match.', true);
        return;
      }

      const res = await fetch(`http://98.81.184.105:3000/user/${userid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showPopup('Email updated');
        setTimeout(() => window.location.assign('../changeInfo.html'), 800);
      } else {
        showPopup(data.error || 'Update failed', true);
      }
    } catch (err) {
      showPopup('Network error', true);
    }
  });
});
