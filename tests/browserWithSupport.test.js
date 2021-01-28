describe('when used in a browser that does not require polyfilling', () => {
  require('../src/objectFitPolyfill.js');

  it('returns a function that simply returns false', () => {
    expect(window.objectFitPolyfill()).toEqual(false);
  });
});
