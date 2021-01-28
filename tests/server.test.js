/**
 * @jest-environment node
 */
describe('when imported in a server-side rendering context', () => {
  it('does not crash when window is undefined', () => {
    // Should not throw an error
    require('../src/objectFitPolyfill.js');
  });
});
