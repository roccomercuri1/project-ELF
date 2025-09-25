isDockerActive = true;

const API_URL = isDockerActive
  ? "http://54.90.66.20"
  : "http://localhost";

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.querySelector('.change_password');

  function showPopup(message, isError = false) {
    const el = document.getElementById('popup');
    if (!el) { alert(message); return; }
    el.textContent = message;
    el.className = 'popup ' + (isError ? 'error' : 'success') + ' show';
    setTimeout(() => { el.className = 'popup'; }, 2000);
  }

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const oldPassword = e.target.oldPassword.value.trim();
//     const newPassword = e.target.newPassword.value.trim();
//     const userid = localStorage.getItem('userid');
//     const token  = localStorage.getItem('token');

//     if (!userid || !token) {
//       showPopup('Please log in again.', true);
//       return window.location.assign('../login.html');
//     }
//     if (!oldPassword || !newPassword) {
//       showPopup('Please fill both fields.', true);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}:3000/user/${userid}`, {
//         method: 'PATCH',
//         headers: {
//           'Acccept': 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: localStorage.getItem("token")
//         },
//         body: JSON.stringify({ userpassword: newPassword }) // 👈 backend expects `userpassword`
//       });

//       // console.log('PATCH Status:', res.status);
//       // const data = await res.json().catch(() => ({}));
//       // console.log('PATCH payload:', data);

//       if (res.ok) {
//         showPopup('Password updated');
//         setTimeout(() => window.location.assign('../changeInfo.html'), 800);
//       } else {
//         showPopup(data.error || 'Update failed', true);
//       }
//     } catch (err) {
//       showPopup('Network error', true);
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', () => {

  const passwordForm = document.querySelector('#changePass')
  console.log(passwordForm);
  passwordForm.addEventListener("submit", changePassword)

  function changePassword(e) {
      e.preventDefault()

      const currentPassword = e.target[0].value
      const newPassword = e.target[1].value

      changePasswordInDB(currentPassword, newPassword)

      //reassign empty values for the form
      e.target[0].value = ""
      e.target[1].value = ""
  }

  async function changePasswordInDB(currentPassword, newPassword) {
      const userid = localStorage.getItem('userid')
      
      try {
        // console.log()
          //  const options = {
          //     method: "GET",
          //     headers: {
          //         "Accept": "application/json",
          //         "Content-Type": "application/json",
          //         Authorization: localStorage.getItem("token"),
          //     }
          //     }

          // //get request to find the current password
          // response = await fetch(`http://localhost:3000/user/${userid}`,options)
          // data2 = await response.json()
          
          // const match = await bcrypt.compare(currentPassword, data2.password);
          // console.log(match);

          // const checkOptions = {
          //     method: "GET",
          //     headers: {
          //         "Accept": "application/json",
          //         "Content-Type": "application/json",
          //         Authorization: localStorage.getItem("token"),
          //     },
          //     body: JSON.stringify({
          //         userpassword: currentPassword
          //     })
          //     }
          // const match = await fetch(`${API_URL}:3000/user/checkPassword`, checkOptions)
          // console.log(match);

          const match = true

          if (match) {
              const options = {
              method: "PATCH",
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
              },
              body: JSON.stringify({
                  userpassword: newPassword
              })
              }

              updatedPassword = await fetch(`${API_URL}:3000/user/${userid}`, options)

              //take you back to accounts page
              showPopup('Successfully changed password!');
              setTimeout(() =>window.location.assign("../changeInfo.html"), 800);

          } else {
              showPopup(data.error || 'The password could not be changed.')
          }

      } catch (err) {
          showPopup('The password could not be changed.');
          throw new Error('The password could not be changed.')
      }
  }
});