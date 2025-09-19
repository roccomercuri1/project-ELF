// util/helpers.js
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const renderDOM = async (filename) => {
  const filePath = path.join(process.cwd(), filename);

  const virtualConsole = new jsdom.VirtualConsole();
  // comment out next line if you want to see jsdom resource errors
  virtualConsole.on('error', () => {}); 

  const dom = await JSDOM.fromFile(filePath, {
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole,
    beforeParse(window) {
      // Simple in-memory localStorage shim so app code works in tests
      const store = {};
      window.localStorage = {
        getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; },
        clear: () => { for (const key of Object.keys(store)) delete store[key]; },
        key: (i) => Object.keys(store)[i] || null,
        get length() { return Object.keys(store).length; }
      };
    }
  });

  // Wait for DOM + (most) external resources to be ready
  return new Promise((resolve) => {
    const done = () => resolve(dom);
    // If your tests rely on scripts that attach on DOMContentLoaded, this is enough:
    dom.window.document.addEventListener('DOMContentLoaded', done, { once: true });
    // If you ever need to wait for all external scripts/images, use 'load' instead:
    // dom.window.addEventListener('load', done, { once: true });
  });
};

module.exports = { renderDOM };
