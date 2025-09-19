const { renderDOM } = require('../util/helpers');

let dom;
let document;

describe('Login Page', () => {
  beforeEach(async () => {
    dom = await renderDOM('./client/pages/login.html');
    document = await dom.window.document;
  });
  
  it('has a button', () => {
    const btn = document.querySelector('button')
    expect(btn).toBeTruthy
    expect(btn.innerHTML).toBe("Log In")
  })


  it('Sign Up button links to Sign Up page', () => {
    const btn = document.querySelector('#signup');
    expect(btn).toBeTruthy();
    btn.click();
    expect(btn.getAttribute('href')).toBe('signup.html');
  });

  
//   it('Forgot password exists', () => {
//     const forgot = document.querySelector('h3');
//     expect(forgot).toBeTruthy();
//     expect(forgot.textContent).toContain('Forgot password');
//   });

  
  it('Can type in username and password inputs', () => {
    const usernameInput = document.querySelector('#loginUsername');
    const passwordInput = document.querySelector('#loginPassword');

    usernameInput.value = 'testuser';
    passwordInput.value = 'password123';

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });


  it('Form can be submitted', () => {
    const form = document.querySelector('.login_form');
    const usernameInput = document.querySelector('#loginUsername');
    const passwordInput = document.querySelector('#loginPassword');

    usernameInput.value = 'user';
    passwordInput.value = 'pass';

    //spy for submit
    const spy = jest.fn();
    form.addEventListener('submit', spy);

    // Simulating theform submission
    form.dispatchEvent(new dom.window.Event('submit'));
    
    expect(spy).toHaveBeenCalled();
  });
});