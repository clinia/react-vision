import exampleSearchBoxHitsPage from '../pageobjects/ExampleSearchBoxHitsPage';

describe('ExampleSearchBoxHitsPage', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3000/');
  });
  it('should show clinia resource', () => {
    exampleSearchBoxHitsPage.open();
    exampleSearchBoxHitsPage.searchFor('clinia');

    expect(exampleSearchBoxHitsPage.resultsCount).toEqual(1);
  });

  it('should present no resource found', () => {
    exampleSearchBoxHitsPage.open();
    exampleSearchBoxHitsPage.searchFor('aaaaaaaaaa');

    expect(exampleSearchBoxHitsPage.resultsCount).toEqual(0);
  });
});
