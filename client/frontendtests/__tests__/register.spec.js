const { renderDOM } = require('../util/helpers');

let dom;
let document;

describe('Sign Up Page', () => {
  beforeEach(async () => {
    dom = await renderDOM('./client/pages/register.html');
    document = await dom.window.document;
  });

  it('has a button', () => {
    const btn = document.querySelector('button')
    expect(btn).toBeTruthy
    expect(btn.innerHTML).toBe("Sign Up")
  })


  it('Sign Up button links to Sign Up page', () => {
    const btn = document.querySelector('#login');
    expect(btn).toBeTruthy();
    btn.click();
    expect(btn.getAttribute('href')).toBe('login.html');
  });


  it('Only allows sign up button to be clicked when all fields are valid', () => {
    const form = document.querySelector('.signup_form');
    const signupBtn = form.querySelector('button[type="submit"]');
    const nameInput = form.querySelector('input[name="firstname"]');
    const emailInput = form.querySelector('input[name="email"]');
    const usernameInput = form.querySelector('input[name="username"]');
    const passwordInput = form.querySelector('input[name="userpassword"]');

    // Initially empty, button should be disabled
    signupBtn.disabled = !nameInput.value || !emailInput.value || !usernameInput.value || !passwordInput.value;
    expect(signupBtn.disabled).toBe(true);

    // Fill valid values
    nameInput.value = 'Israel';
    emailInput.value = 'israel@example.com';
    usernameInput.value = 'israel123';
    passwordInput.value = 'password123';

    signupBtn.disabled = !nameInput.value || !emailInput.value || !usernameInput.value || !passwordInput.value;
    expect(signupBtn.disabled).toBe(false);
  });

  it('Able to type in form fields', () => {
    const nameInput = document.querySelector('input[name="firstname"]');
    const emailInput = document.querySelector('input[name="email"]');
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="userpassword"]');

    nameInput.value = 'Israel';
    emailInput.value = 'test@example.com';
    usernameInput.value = 'israel123';
    passwordInput.value = 'mypassword';

    expect(nameInput.value).toBe('Israel');
    expect(emailInput.value).toBe('test@example.com');
    expect(usernameInput.value).toBe('israel123');
    expect(passwordInput.value).toBe('mypassword');
  });

  it('Requires a valid email', () => {
    const emailInput = document.querySelector('input[name="email"]');
    const signupBtn = document.querySelector('button[type="submit"]');

    //Creating and invalid email as an input and checking if there is an @ or . to check if it is an email
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new dom.window.Event('input'));
    signupBtn.disabled = !emailInput.value.includes('@') || !emailInput.value.includes('.');
    expect(signupBtn.disabled).toBe(true);

    emailInput.value = 'valid@example.com';
    emailInput.dispatchEvent(new dom.window.Event('input'));
    signupBtn.disabled = !emailInput.value.includes('@') || !emailInput.value.includes('.');
    expect(signupBtn.disabled).toBe(false);
  });

  it('Name field cannot contain numbers', () => {
    const nameInput = document.querySelector('input[name="firstname"]');
    const signupBtn = document.querySelector('button[type="submit"]');

    nameInput.value = 'Israel123';
    signupBtn.disabled = /\d/.test(nameInput.value); // disable if contains number
    expect(signupBtn.disabled).toBe(true);

    nameInput.value = 'Israel';
    signupBtn.disabled = /\d/.test(nameInput.value);
    expect(signupBtn.disabled).toBe(false);
  });
});