export default class Page {
  open(path) {
    browser.url(path);
  }

  pressEnter() {
    browser.keys('Enter');
  }
}
