import WithHitsPage from './WithHitsPage';

class AutoCompleteHitsPage extends WithHitsPage {
  get autoCompleteInput() {
    return $('.cvi-AutoComplete-input');
  }

  get suggestionList() {
    return $('.cvi-AutoComplete-suggestion-list');
  }

  get suggestions() {
    return this.suggestionList.$$('.cvi-AutoComplete-suggestion');
  }

  get activeSuggestion() {
    return this.suggestions.$$('.cvi-AutoComplete-active-suggestion');
  }

  get clearButton() {
    return $('.cvi-AutoComplete-clear');
  }

  open() {
    super.open('http://localhost:3001/autocomplete');
  }

  waitForSuggestionsListToAppear() {
    if (!this.suggestionList.isDisplayed() || this.suggestions === 0) {
      browser.waitUntil(() => this.suggestionList.isDisplayed(), 5000);
    }
  }

  enterValue(value) {
    this.autoCompleteInput.setValue(value);
  }

  searchFor(speciality) {
    this.enterValue(speciality);
    super.pressEnter();
    browser.pause(1000);

    this.waitForResultsToLoad();
    return this.hitResultList;
  }
}

export default new AutoCompleteHitsPage();
