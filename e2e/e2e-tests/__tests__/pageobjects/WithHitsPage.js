import Page from './page';

export default class WithHitsPage extends Page {
  get hitResultList() {
    return $('.cvi-Hits-list');
  }

  get resultsCount() {
    return (
      (this.hitResultList &&
        Array.isArray(this.hitResultList.$$('.cvi-Hits-item')) &&
        this.hitResultList.$$('.cvi-Hits-item').length) ||
      0
    );
  }

  get noResultsFound() {
    return $('.cvi-Hits-empty');
  }

  waitForResultsToLoad() {
    if (!this.hitResultList.isDisplayed() || this.resultsCount === 0) {
      browser.waitUntil(() => this.hitResultList.isDisplayed(), 5000);
    }
  }
}
