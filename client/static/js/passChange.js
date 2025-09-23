    function showPopup(message, isError=false){
      const p = document.getElementById('popup');
      p.textContent = message;
      p.className = 'popup ' + (isError ? 'error' : 'success') + ' show';
      setTimeout(()=> p.className='popup', 2500);
    }

    document.getElementById('forgotForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = new FormData(e.target).get('email');

      try {
        await fetch('http://localhost:3000/user/forgot-password', {
          method: 'POST',
          headers: {'Content-Type':'application/json','Accept':'application/json'},
          body: JSON.stringify({ email })
        });
      } catch (_) {
        // ignore network errors to avoid leaking anything
      }

      // Always the same UX, whether the email exists or not
      showPopup('If that email exists, instructions have been sent.');
      e.target.reset();
      setTimeout(()=> location.href = './login.html', 1500);
    });