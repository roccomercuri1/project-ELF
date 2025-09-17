const form = document.getElementById('review_form');
const skillSelect = document.getElementById('skillSelect');
const ratingContainer = document.getElementById('ratingContainer');
const skillRating = document.getElementById('skillRating');
const ratingValue = document.getElementById('ratingValue');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsList = document.getElementById('skillsList');

// keep array of original skill names
const allSkills = Array.from(skillSelect.options)
  .map(opt => opt.value)
  .filter(v => v !== '');

// show slider once a skill is selected
skillSelect.addEventListener('change', () => {
  if (skillSelect.value) {
    ratingContainer.style.display = 'block';
    // make sure slider is enabled
    skillRating.disabled = false;
  }
});

// show slider value live
skillRating.addEventListener('input', () => {
  ratingValue.textContent = skillRating.value;
});

// add skill to list + hidden input for FormData
addSkillBtn.addEventListener('click', () => {
  const skill = skillSelect.value;
  const rating = skillRating.value;
  if (!skill) return;

  // create list item for UI
  const li = document.createElement('li');
  li.className =
    'list-group-item d-flex justify-content-between align-items-center';
  li.textContent = `${skill} - Rating: ${rating}/5`;

  // create hidden input so FormData sees it on submit
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = 'skills[]'; // use array syntax to collect multiple skills
  hidden.value = JSON.stringify({ skill, rating }); // or `${skill}:${rating}`
  li.appendChild(hidden);

  // add remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'btn btn-sm btn-danger ms-2';
  removeBtn.onclick = () => {
    // put the option back in dropdown
    const opt = document.createElement('option');
    opt.value = skill;
    opt.textContent = skill;
    const insertIndex = allSkills.indexOf(skill);
    const currentOptions = Array.from(skillSelect.options);
    let inserted = false;
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

  // remove selected skill from dropdown
  skillSelect.querySelector(
    `option[value="${CSS.escape(skill)}"]`
  )?.remove();

  // reset dropdown & slider
  skillSelect.value = '';
  ratingContainer.style.display = 'none';
  skillRating.value = 0;
  ratingValue.textContent = 0;
});

// handle form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  delete data['skills[]'];
  // if you used skills[], you can get them as an array:
  const skills = formData.getAll('skills[]').map(s => JSON.parse(s));
  console.log({
    ...data,
    skills
  });
});
