import searchBoxPage from '../pageobjects/SearchBoxHitsPage';

describe('ExamplePage', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3001/');
  });

  it('should show clinia resource', () => {
    searchBoxPage.open();
    searchBoxPage.searchFor('clinia');

    expect(searchBoxPage.resultsCount).toEqual(1);
  });

  it('should present no resource found', () => {
    searchBoxPage.open();
    searchBoxPage.searchFor('aaaaaaaaaa');

    expect(searchBoxPage.resultsCount).toEqual(0);
  });
});
