import autoCompletePage from '../pageobjects/AutoCompleteHitsPage';

describe('AutoComplete + Hits', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3001/');
  });

  it('should change results on suggestion clicked', () => {
    autoCompletePage.open();
    const initialResultsCount = autoCompletePage.resultsCount;

    autoCompletePage.autoCompleteInput.click();
    autoCompletePage.enterValue('a');
    autoCompletePage.waitForSuggestionsListToAppear();
    const firstSuggestion = autoCompletePage.suggestions[0];

    firstSuggestion.click();
    browser.pause(1000);
    const afterSuggestionClickResultsCount = autoCompletePage.resultsCount;
    expect(initialResultsCount).not.toEqual(afterSuggestionClickResultsCount);
  });
  it('should change results selecting suggestion using only arrow keys + enter', () => {
    autoCompletePage.open();
    const initialResultsCount = autoCompletePage.resultsCount;

    autoCompletePage.autoCompleteInput.click();
    autoCompletePage.pressKey('a');
    autoCompletePage.waitForSuggestionsListToAppear();
    autoCompletePage.pressKey('ArrowDown');
    autoCompletePage.pressEnter();

    const afterSuggestionClickResultsCount = autoCompletePage.resultsCount;

    expect(afterSuggestionClickResultsCount).toBeGreaterThan(0);
    expect(initialResultsCount).not.toEqual(afterSuggestionClickResultsCount);
  }, 3);
  it('should reset results on clear button click', () => {
    autoCompletePage.open();
    autoCompletePage.waitForResultsToLoad();

    const initialResultsCount = autoCompletePage.resultsCount;
    autoCompletePage.searchFor('cardiology');

    expect(autoCompletePage.resultsCount).not.toEqual(initialResultsCount);
    expect(autoCompletePage.clearButton.isDisplayed()).toBeTruthy();

    autoCompletePage.clearButton.click();
    browser.pause(1000);
    autoCompletePage.waitForResultsToLoad();
    expect(autoCompletePage.resultsCount).toEqual(initialResultsCount);
  }, 3);

  it('should show Clinia resource when filtering for Geriatrics', () => {
    autoCompletePage.open();
    autoCompletePage.searchFor('geriatrics');
    expect(autoCompletePage.resultsCount).toEqual(1);
  }, 3);

  it('should present no resource found', () => {
    autoCompletePage.open();
    autoCompletePage.searchFor('aaaaaaaaaa');

    expect(autoCompletePage.resultsCount).toEqual(0);
    expect(autoCompletePage.noResultsFound.isDisplayed()).toBeTruthy();
  });
});
