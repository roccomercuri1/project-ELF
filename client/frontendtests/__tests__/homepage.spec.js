const { renderDOM } = require('../util/helpers');

let dom;
let document;

describe('homepage.html', () => {

  beforeEach(async () => {
    dom = await renderDOM('./client/pages/homepage.html');
    document = await dom.window.document;
  });

  it('has a header with a home icon link', () => {
    const homeLink = document.querySelector('.home-icon a');
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute('href')).toBe('./homepage.html');
  });

  it('displays the correct title in the center of the header', () => {
    const title = document.querySelector('header h3');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Welcome');
  });

  it('has a user dropdown button', () => {
    const dropdownBtn = document.querySelector('#userDropdown');
    expect(dropdownBtn).toBeTruthy();
    expect(dropdownBtn.textContent).toContain('');
  });

  it('contains a link to View Recognitions', () => {
    const recogLink = document.querySelector('a[href="viewRecog.html"]');
    expect(recogLink).toBeTruthy();
    expect(recogLink.textContent).toContain('View Recognitions');
  });

//  
//Need to check isAdmin?
//

  it('has an option card linking to dataPage.html', () => {
    const dataPageLink = document.querySelector('#dataPageLink');
    expect(dataPageLink).toBeTruthy();
    expect(dataPageLink.getAttribute('href')).toBe('dataPage.html');
  });

  it('has an option card linking to viewRecog.html', () => {
    const viewRecogLink = document.querySelector('a[href="./viewRecog.html"]');
    expect(viewRecogLink).toBeTruthy();
    expect(viewRecogLink.textContent).toContain('View Reviews');
  });

});
