describe('when used in a browser that requires polyfilling', () => {
  require('./__mocks__/objectFitUnavailable');

  describe('when the DOM is not yet loaded', () => {
    require('./__mocks__/domNotReady');
    require('../src/objectFitPolyfill.js');

    beforeEach(() => {
      document.body.innerHTML = `
        <div class="container">
          <canvas data-object-fit />
        </div>
      `;
    });

    it('has a DOMContentLoaded listener', () => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect(document.querySelector('.object-fit-polyfill')).toBeTruthy();
    });

    it('has a window resize listener', () => {
      window.dispatchEvent(new Event('resize'));
      expect(document.querySelector('.object-fit-polyfill')).toBeTruthy();
    });
  });

  describe('when media is not yet loaded', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="container">
          <img src="test.jpg" alt="" data-object-fit />
        </div>
        <div class="container">
          <video data-object-fit>
            <source src="test.mp4" type="video/mp4">
          </video>
        </div>
      `;

      window.objectFitPolyfill();
      expect(document.querySelector('.object-fit-polyfill')).toBeFalsy();
    });

    it('has loading listeners for image elements', () => {
      window.objectFitPolyfill();
      expect(document.querySelector('.object-fit-polyfill')).toBeFalsy();

      const img = document.querySelector('img');
      img.dispatchEvent(new Event('load'));

      expect(document.querySelector('.object-fit-polyfill')).toBeTruthy();
    });

    it('has loading listeners for video elements', () => {
      window.objectFitPolyfill();
      expect(document.querySelector('.object-fit-polyfill')).toBeFalsy();

      const video = document.querySelector('video');
      video.dispatchEvent(new Event('loadedmetadata'));

      expect(document.querySelector('.object-fit-polyfill')).toBeTruthy();
    });
  });
});
