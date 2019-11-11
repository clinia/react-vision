import Page from './page';

class ExampleSearchBoxHitsPage extends Page {
  get searchBoxInput() {
    return $('.cvi-SearchBox-input');
  }

  get searchBoxClearButton() {
    return $('.cvi-SearchBox-clear');
  }

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

  open() {
    super.open('http://localhost:3000/');
  }

  waitForResultsToLoad() {
    if (!this.hitResultList.isDisplayed() || this.resultsCount === 0) {
      this.hitResultList.waitForDisplayed(500);
    }
  }

  searchFor(clinicName) {
    this.searchBoxInput.setValue(clinicName);
    super.pressEnter();

    this.waitForResultsToLoad();
    return this.hitResultList;
  }
}

export default new ExampleSearchBoxHitsPage();
