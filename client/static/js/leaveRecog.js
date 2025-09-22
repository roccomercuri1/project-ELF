const form = document.getElementById("review_form");
const skillSelect = document.getElementById("skillSelect");
const ratingContainer = document.getElementById("ratingContainer");
const skillRating = document.getElementById("skillRating");
const ratingValue = document.getElementById("ratingValue");
const addSkillBtn = document.getElementById("addSkillBtn");
const skillsList = document.getElementById("skillsList");

// Popup for when review was successfully submitted
function showPopup(message, isError = false) {
    const popup = document.getElementById("popup");
    popup.textContent = message;

    popup.className = "popup " + (isError ? "error" : "success") + " show";

    setTimeout(() => {
      popup.className = "popup";
    }, 3000);
  }

// keep array of original skill names
const allSkills = Array.from(skillSelect.options)
  .map((opt) => opt.value)
  .filter((v) => v !== "");

// show slider once a skill is selected
skillSelect.addEventListener("change", () => {
  if (skillSelect.value) {
    ratingContainer.style.display = "block";
    // make sure slider is enabled
    skillRating.disabled = false;
  }
});

// show slider value live
skillRating.addEventListener("input", () => {
  ratingValue.textContent = skillRating.value;
});

// adding skill to list + hidden input for FormData
addSkillBtn.addEventListener("click", () => {
  const skill = skillSelect.value;
  const rating = skillRating.value;
  if (!skill) return;

  // created list item for UI
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  li.textContent = `${skill} - Rating: ${rating}/5`;

  // create hidden input so FormData sees it on submit
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "skills[]"; // using array syntax to collect multiple skills
  hidden.value = JSON.stringify({ skill, rating }); // or `${skill}:${rating}`
  li.appendChild(hidden);

  // added the remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "btn btn-sm btn-danger ms-2";
  removeBtn.onclick = () => {
    // putting the option back in dropdown
    const opt = document.createElement("option");
    opt.value = skill;
    opt.textContent = skill;
    const insertIndex = allSkills.indexOf(skill);
    const currentOptions = Array.from(skillSelect.options);
    let inserted = false;
    // checking if the option is inside the dropdown bar, if not it puts the option back
    for (let i = 0; i < currentOptions.length; i++) {
      const idx = allSkills.indexOf(currentOptions[i].value);
      if (idx > insertIndex) {
        skillSelect.insertBefore(opt, currentOptions[i]);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      skillSelect.appendChild(opt);
    }

    li.remove();
  };
  li.appendChild(removeBtn);

  skillsList.appendChild(li);

  // removing selected skill from dropdown bar
  skillSelect.querySelector(`option[value="${CSS.escape(skill)}"]`)?.remove();

  // reset dropdown & slider to default at 3
  skillSelect.value = "";
  ratingContainer.style.display = "none";
  skillRating.value = 3;
  ratingValue.textContent = 3;
});

// handling the form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  delete data["skills[]"];
  // if using skills[], we can get them as an array using .map
  const skills = formData.getAll("skills[]").map((s) => JSON.parse(s));
  console.log(skills)
  console.log(data)
  const reviewData = {
    ...data,
    skills
  };

  console.log("Sending the entire reiew:", reviewData);

  try {
    // Connecting the the specific route
    const res = await fetch("http://localhost:3000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const json = await res.json();
    console.log("Server response:", json);
    if(res.ok){
    showPopup("Successfully Submitted Review!");
    setTimeout(() => window.location.assign("homepage.html"), 1500);
    }
    form.reset();
    skillsList.innerHTML = ""; // clear skills UI
  } catch (err) {
    console.error("Error submitting review:", err);
    showPopup(err.message || "Failed to submit", true);
  }
  
});

// Selecting users from User database and adding them as the only options to leave a review for

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  const nameSpan = document.getElementById("dropdownUsername");
  if (nameSpan && username) nameSpan.textContent = username;

  const selectEmp = document.querySelector('select[name="employee"]');

  // Clears any hardcoded options added except the placeholders
  selectEmp.innerHTML =
    '<option value="" selected disabled>Select employee</option>';

  try {
    // Fetch from our  local API, giving us the users array
    const res = await fetch("http://localhost:3000/user");
    const users = await res.json();

    // Loop over each user and create an new <option>
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.username; // value in form submission
      option.textContent = user.firstname; // what’s displayed
      selectEmp.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching users:", err);
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

  const token = localStorage.getItem("token")
  const isManager = localStorage.getItem("isadmin") === "true"

  if (!token) {
    window.location.replace("./login.html")
    return
  }
  if (!isManager) {
    window.location.replace("./homepage.html")
  }
});
