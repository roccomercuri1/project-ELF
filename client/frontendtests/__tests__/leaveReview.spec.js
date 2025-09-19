const { renderDOM } = require('../util/helpers');
  
  let dom;
  let document;

  
describe('Leave Recognition Form', () => {

  beforeEach(async () => {
    dom = await renderDOM('./client/pages/leaveRecog.html'); 
    document = dom.window.document;
  });

  it('renders the review form with correct id and name', () => {
    const form = document.querySelector('form#review_form');
    expect(form).toBeTruthy();
    expect(form.getAttribute('name')).toBe('review');
  });

  it('has an employee dropdown with options', () => {
    const employeeSelect = document.querySelector('#employee_section select[name="employee"]');
    expect(employeeSelect).toBeTruthy();

    const options = [...employeeSelect.querySelectorAll('option')].map(o => o.textContent.trim());
    expect(options).toContain('Select employee');
    expect(options).toContain('Max');
    expect(options).toContain('Yuktha');
    expect(options).toContain('Istiak');
    expect(options).toContain('Rocco');
    expect(options).toContain('Israel');
  });

  it('has a category dropdown with options', () => {
    const categorySelect = document.querySelector('#category_section select[name="category"]');
    expect(categorySelect).toBeTruthy();

    const options = [...categorySelect.querySelectorAll('option')].map(o => o.textContent.trim());
    expect(options).toContain('Select feedback type');
    expect(options).toContain('Feedback');
    expect(options).toContain('Sprint');
    expect(options).toContain('Entire Project');
    expect(options).toContain('Recognition');
  });

  it('has title and review input fields', () => {
    const titleInput = document.querySelector('#recog_title');
    const reviewTextarea = document.querySelector('#recog_review');

    expect(titleInput).toBeTruthy();
    expect(reviewTextarea).toBeTruthy();
  });

  it('has a skills dropdown and hidden rating container', () => {
    const skillSelect = document.querySelector('#skillSelect');
    const ratingContainer = document.querySelector('#ratingContainer');
    const skillsList = document.querySelector('#skillsList');

    expect(skillSelect).toBeTruthy();
    expect(ratingContainer).toBeTruthy();
    expect(ratingContainer.style.display).toBe('none'); // hidden by default
    expect(skillsList).toBeTruthy();
  });

  it('has a Create Review submit button', () => {
    const submitButton = document.querySelector('#submit_button');
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent.trim()).toBe('Create Review');
  });
});
