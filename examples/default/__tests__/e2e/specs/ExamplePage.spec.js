import examplePage from '../pageobjects/ExamplePage';

describe('ExamplePage', () => {
  it('navigates to example page', async () => {
    browser.url('http://localhost:3000/');
  });

  // describe('using search box', () => {
  //   it('should show clinia resource', () => {
  //     examplePage.open();
  //     examplePage.searchFor('clinia');

  //     expect(examplePage.resultsCount).toEqual(1);
  //   });

  //   it('should present no resource found', () => {
  //     examplePage.open();
  //     examplePage.searchFor('aaaaaaaaaa');

  //     expect(examplePage.resultsCount).toEqual(0);
  //   });
  // });

  describe('using autocomplete', () => {
    it('should show Clinia resource when filtering for Geriatrics', () => {
      examplePage.open();
      examplePage.searchFor('geriatrics');

      expect(examplePage.resultsCount).toEqual(1);
    });

    it('should present no resource found', () => {
      examplePage.open();
      examplePage.searchFor('aaaaaaaaaa');

      debugger;
      expect(examplePage.resultsCount).toEqual(0);
    });
  });
});
