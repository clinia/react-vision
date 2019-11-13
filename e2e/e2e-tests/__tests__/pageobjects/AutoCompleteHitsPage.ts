import WithHitsPage from './WithHitsPage';

class AutoCompleteHitsPage extends WithHitsPage {
  get autoCompleteInput() {
    return $('.cvi-AutoComplete-input');
  }

  open() {
    super.open('http://localhost:3001/autocomplete');
  }

  searchFor(speciality) {
    this.autoCompleteInput.setValue(speciality);
    super.pressEnter();

    this.waitForResultsToLoad();
    return this.hitResultList;
  }
}

export default new AutoCompleteHitsPage();
