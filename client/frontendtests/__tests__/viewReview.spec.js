const { renderDOM } = require('../util/helpers');

let dom;
let document;

describe('Login Page', () => {
  beforeEach(async () => {
    dom = await renderDOM('./client/pages/viewRecog.html');
    document = await dom.window.document;
  });
  
it('has a Reviews heading and a reviews container', () => {
  const heading = document.querySelector('h2');
  expect(heading).toBeTruthy();
  expect(heading.textContent).toBe('Reviews');

  const reviewsContainer = document.querySelector('#reviewscontainer');
  expect(reviewsContainer).toBeTruthy();
  expect(reviewsContainer.textContent).toBe('Loading reviews...');
});


});