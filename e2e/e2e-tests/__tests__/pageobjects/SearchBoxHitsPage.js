import WithHitsPage from './WithHitsPage';

class SearchBoxHitsPage extends WithHitsPage {
  get searchBoxInput() {
    return $('.cvi-SearchBox-input');
  }

  get searchBoxClearButton() {
    return $('.cvi-SearchBox-clear');
  }

  open() {
    super.open('http://localhost:3001/searchbox');
  }

  searchFor(clinicName) {
    this.searchBoxInput.setValue(clinicName);
    super.pressEnter();

    this.waitForResultsToLoad();
    return this.hitResultList;
  }
}

export default new SearchBoxHitsPage();
