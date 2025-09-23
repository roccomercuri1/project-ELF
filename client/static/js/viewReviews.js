document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const nameSpan = document.getElementById("dropdownUsername");
  if (nameSpan && username) nameSpan.textContent = username;

  const isManager = localStorage.getItem("isadmin") === "true";
  if (!isManager) {
    document
      .querySelectorAll('[user-role="manager-only"]')
      .forEach((el) => el.remove());
  }
});

async function getReviews() {
  try {
    const response = await fetch(`http://98.81.184.105:3000/reviews`, {
      headers: {
        // optional if your endpoint checks tokens
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const reviews = await response.json();

    // reading the  localStorage items
    const isAdmin = localStorage.getItem("isadmin") === "true";
    const currentUserId = parseInt(localStorage.getItem("userid"), 10);

    // filter to check if the user is an admin or not
    const reviewsToShow = isAdmin
      ? reviews
      : reviews.filter((r) => r.userid === currentUserId);

    const container = document.getElementById("reviewscontainer");
    container.innerHTML = `Loading reviews.. `;
    container.innerHTML = ``;

    reviewsToShow.forEach((review) => {
      const reviewbox = document.createElement("div");
      reviewbox.className = "reviewbox";

      let skillsHTML = "";
      for (const [skillsName, score] of Object.entries(review.skills)) {
        skillsHTML += `
                <div class= 'skill'>
                    <p class="skillName">${skillsName}:</p>
                    <p class="score">${score} ⭐️</p>
                </div>`;
      }

      const frontCard = document.createElement("div");
      frontCard.className = "card-face card-front";
      frontCard.innerHTML = `<div class="review-tops"> <h3> ${review.reviewtitle}</h3>
            <div class="topper">
            <p><strong>For:</strong> ${review.username}</p>
            <p><strong>Type:</strong> ${review.reviewtype}</p>
            </div>
            </div>
            <div class="front-info">
            <h5>Click to see more information↧</h5>
            <p class="review-date">${new Date(
              review.reviewdate
            ).toLocaleDateString()}</p>
            </div>
            `;

      const backCard = document.createElement("div");
      backCard.className = "card-face card-back";
      backCard.innerHTML = `<div class="review-tops"> <h3> ${review.reviewtitle}</h3>
            <div class="topper">
            <p><strong>For:</strong> ${review.username}</p>
            <p><strong>Type:</strong> ${review.reviewtype}</p>
            </div>
            </div>
            <p class="review-contents">${review.reviewcontents}</p>
            <div class="back-info">
            <div class="skills-area">${skillsHTML}</div>
            <p class="review-date">${new Date(
              review.reviewdate
            ).toLocaleDateString()}</p>
            </div>`;

      //fetch reviewtitle and contents+date
      // reviewbox.innerHTML = `<h3>${review.reviewtitle}</h3>
      // <p>${review.reviewcontents} ${new Date(review.reviewdate).toLocaleDateString()}</p>`;
      // console.log(review.skills)

      // const skillsBlock = document.createElement('div');
      // skillsBlock.className = 'skills-area';
      // skillsBlock.innerHTML = skillsHTML;

      reviewbox.appendChild(frontCard);
      reviewbox.appendChild(backCard);

      reviewbox.addEventListener("click", () => {
        reviewbox.classList.toggle("flipped");
      });

      container.appendChild(reviewbox);
    });
  } catch (err) {
    document.getElementById("reviewscontainer").textContent =
      "Failed to get reviews";
    console.log("Error loading reviews");
  }
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

getReviews();
