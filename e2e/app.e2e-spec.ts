import { PtHelperPage } from './app.po';

describe('pt-helper App', () => {
  let page: PtHelperPage;

  beforeEach(() => {
    page = new PtHelperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
