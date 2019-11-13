import autoCompletePage from '../pageobjects/SearchBoxHitsPage';

describe('ExamplePage', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3001/');
  });

  it('should show Clinia resource when filtering for Geriatrics', () => {
    autoCompletePage.open();
    autoCompletePage.searchFor('geriatrics');

    expect(autoCompletePage.resultsCount).toEqual(1);
  });

  it('should present no resource found', () => {
    autoCompletePage.open();
    autoCompletePage.searchFor('aaaaaaaaaa');

    expect(autoCompletePage.resultsCount).toEqual(0);
  });
});
