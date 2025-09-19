const { renderDOM } = require('../util/helpers');

let dom;
let document;

describe('Login Page', () => {
  beforeEach(async () => {
    dom = await renderDOM('./client/pages/login.html');
    document = await dom.window.document;
  });
  
  it('has a login button', () => {
    const btn = document.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.innerHTML).toBe("Log In");
  });

  it('Sign Up link exists and links to register page', () => {
    const signupLink = document.querySelector('#signup');
    expect(signupLink).toBeTruthy();
    expect(signupLink.getAttribute('href')).toBe('register.html');
  });

  it('Forgot password exists', () => {
    const forgot = document.querySelector('h3');
    expect(forgot).toBeTruthy();
    expect(forgot.textContent).toBe('Forgot password?');
  });

  it('Can type in username and password inputs', () => {
    const usernameInput = document.querySelector('#loginUsername');
    const passwordInput = document.querySelector('#loginPassword');
    
    usernameInput.value = 'yuki';
    passwordInput.value = 'password123';

    expect(usernameInput.value).toBe('yuki');
    expect(passwordInput.value).toBe('password123');
  });

  it('Form can be submitted', () => {
    const form = document.querySelector('.login_form');
    const usernameInput = document.querySelector('#loginUsername');
    const passwordInput = document.querySelector('#loginPassword');

    usernameInput.value = 'user';
    passwordInput.value = 'pass';

    // Spy for submit
    const spy = jest.fn();
    form.addEventListener('submit', spy);

    // Simulating the form submission
    form.dispatchEvent(new dom.window.Event('submit'));
    
    expect(spy).toHaveBeenCalled();
  });

 it('Can type in username and password inputs', () => {
    const usernameInput = document.querySelector('#loginUsername');
    const passwordInput = document.querySelector('#loginPassword');

    usernameInput.value = 'testuser';
    passwordInput.value = 'password123';

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });
});