document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('selfResetForm');

  function showPopup(message, isError=false){
    const p = document.getElementById('popup');
    p.textContent = message;
    p.className = 'popup ' + (isError ? 'error' : 'success') + ' show';
    setTimeout(()=> p.className='popup', 2500);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      username: fd.get('username'),
      email: fd.get('email'),
      newPassword: fd.get('newPassword')
    };

    if (!payload.username || !payload.email || !payload.newPassword) {
      showPopup('Please fill all fields (password min 6 chars).', true);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/user/forgot-password', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // always generic to avoid info leaks
      showPopup('If the details matched, your password was updated.');
      form.reset();
      // setTimeout(()=> location.href = './login.html', 1200);
    } catch {
      showPopup('If the details matched, your password was updated.');
    }
  });
});
