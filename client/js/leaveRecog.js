const skillSelect = document.getElementById('skillSelect');
const ratingContainer = document.getElementById('ratingContainer');
const skillRating = document.getElementById('skillRating');
const ratingValue = document.getElementById('ratingValue');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsList = document.getElementById('skillsList');

  // Keep an array of original skill names in order
  const allSkills = Array.from(skillSelect.options)
    .map(opt => opt.value)
    .filter(v => v !== '');

  // Show slider once a skill is selected
  skillSelect.addEventListener('change', () => {
    if (skillSelect.value) {
      ratingContainer.style.display = 'block';
    }
  });

  // Show slider value live
  skillRating.addEventListener('input', () => {
    ratingValue.textContent = skillRating.value;
  });

  // Add skill to list
  addSkillBtn.addEventListener('click', () => {
    const skill = skillSelect.value;
    const rating = skillRating.value;
    if (!skill) return;

    // Create list item
    const li = document.createElement('li');
    li.className =
      'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${skill} - Rating: ${rating}/5`;

    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-sm btn-danger ms-2';
    removeBtn.onclick = () => {
      // Recreate <option> at the correct place in dropdown
      const opt = document.createElement('option');
      opt.value = skill;
      opt.textContent = skill;

      // Find where in allSkills array this skill belongs to originally
      const insertIndex = allSkills.indexOf(skill);
      const currentOptions = Array.from(skillSelect.options);

      // Insert is made before the next skill in the dropdown if it exists
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

    // Remove selected skill from dropdown so it can’t be picked again
    skillSelect.querySelector(
      `option[value="${CSS.escape(skill)}"]`
    )?.remove();

    // Reset dropdown & slider (where the slider stars at when it is loaded)
    skillSelect.value = '';
    ratingContainer.style.display = 'none';
    skillRating.value = 0;
    ratingValue.textContent = 0;
  });

