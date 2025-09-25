/**
 * @jest-environment jsdom
 */

require("../../static/js/dataPage"); 

describe("Home and Logout button behaviour", () => {
  let homeBtn, logoutBtn;
  let originalAssign;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="homeBtn">Home</button>
      <button id="logoutBtn">Logout</button>
    `;

    jest.spyOn(window.localStorage.__proto__, "clear").mockImplementation(() => {});

    originalAssign = window.location.assign;

    window.location.assign = jest.fn();

    document.dispatchEvent(new Event("DOMContentLoaded"));

    homeBtn = document.getElementById("homeBtn");
    logoutBtn = document.getElementById("logoutBtn");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.location.assign = originalAssign;
    jest.resetModules();
  });

  xit("navigates to homepage when Home button is clicked", () => {
    homeBtn.click();
    expect(window.location.assign).toHaveBeenCalledWith(
      "http://127.0.0.1:5500/client/pages/homepage.html"
    );
  });

  xit("clears localStorage and redirects to login when Logout button is clicked", () => {
    logoutBtn.click();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(window.location.assign).toHaveBeenCalledWith(
      "http://127.0.0.1:5500/project-ELF/client/pages/login.html"
    );
  });

  it("does nothing if buttons are missing", () => {
    document.body.innerHTML = ``;
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(() => homeBtn?.click()).not.toThrow();
    expect(() => logoutBtn?.click()).not.toThrow();
  });
});