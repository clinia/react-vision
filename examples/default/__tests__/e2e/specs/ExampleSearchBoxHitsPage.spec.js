import examplePage from '../pageobjects/ExampleSearchBoxHitsPage';

describe('ExampleSearchBoxHitsPage', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3000/');
  });
  it('should show clinia resource', () => {
    examplePage.open();
    examplePage.searchFor('clinia');

    expect(examplePage.resultsCount).toEqual(1);
  });

  it('should present no resource found', () => {
    examplePage.open();
    examplePage.searchFor('aaaaaaaaaa');

    expect(examplePage.resultsCount).toEqual(0);
  });
});
