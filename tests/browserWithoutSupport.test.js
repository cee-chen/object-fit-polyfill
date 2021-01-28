describe('when used in a browser that does require polyfilling', () => {
  require('./__mocks__/objectFitUnavailable');
  require('./__mocks__/clientWidthHeight');
  require('./__mocks__/mediaLoaded');
  require('../src/objectFitPolyfill.js');

  it('does not simply return false', () => {
    expect(window.objectFitPolyfill()).toEqual(true);
  });

  describe('manually calling objectFitPolyfill()', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="container">
          <img src="test.jpg" alt="" data-object-fit />
        </div>
        <div class="container">
          <picture>
            <source srcset="test-large.jpg" media="(min-width: 1800px)">
            <source srcset="test-small.jpg" media="(max-width: 500px)">
            <img src="test-medium.jpg" alt="" data-object-fit />
          </picture>
        </div>
        <div class="container">
          <video data-object-fit>
            <source src="test.mp4" type="video/mp4">
          </video>
        </div>
        <div class="container">
          <canvas data-object-fit />
        </div>
      `;
    });

    it('runs on all [data-object-fit] elements when no arg is passed', () => {
      window.objectFitPolyfill();
      expect(document.querySelectorAll('.object-fit-polyfill')).toHaveLength(4);
    });

    it('runs on a single element', () => {
      const singleElement = document.querySelector('img');

      expect(window.objectFitPolyfill(singleElement)).toEqual(true);
      expect(document.querySelectorAll('.object-fit-polyfill')).toHaveLength(1);
    });

    it('runs on arrays of elements', () => {
      const multipleElements = document.querySelectorAll('img');

      expect(window.objectFitPolyfill(multipleElements)).toEqual(true);
      expect(document.querySelectorAll('.object-fit-polyfill')).toHaveLength(2);
    });

    it('gracefully skips invalid elements', () => {
      const hasInvalidElement = [
        document.querySelector('video'),
        document.querySelector('canvas'),
        'some invalid element',
      ];

      expect(window.objectFitPolyfill(hasInvalidElement)).toEqual(true);
      expect(document.querySelectorAll('.object-fit-polyfill')).toHaveLength(2);
    });

    it('returns false when totally invalid args are passed', () => {
      expect(window.objectFitPolyfill('invalid')).toEqual(false);
      expect(document.querySelectorAll('.object-fit-polyfill')).toHaveLength(0);
    });
  });

  // Note: Due to the limitations of jsdom and the fact that we're mocking
  // static clientHeight & clientWidths, we can't write tests for certain
  // cover/contain combinations (image smaller/larger than the container).
  // TODO: E2E tests could likely solve this problem, but we'd need to find a browser w/o support

  describe('calculating object-fit', () => {
    it('object-fit: none', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="200"
            data-object-fit="none"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.width).toEqual('auto'); // 300px
      expect(img.style.height).toEqual('auto'); // 200px
    });

    it('object-fit: fill', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="200"
            data-object-fit="fill"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.width).toEqual('100%'); // 100px
      expect(img.style.height).toEqual('100%'); // 100px
    });

    it('object-fit: scale-down', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="50"
            data-object-fit="scale-down"
            data-test-subj="expect-none"
          />
        </div>
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="150"
            data-object-fit="scale-down"
            data-test-subj="expect-contain"
          />
        </div>
      `;
      window.objectFitPolyfill();

      const img1 = document.querySelector('[data-test-subj="expect-none"]');
      expect(img1.style.width).toEqual('auto'); // 50px
      expect(img1.style.height).toEqual('auto'); // 50px

      const img2 = document.querySelector('[data-test-subj="expect-contain"]');
      expect(img2.style.width).toEqual('100%'); // 100px
      expect(img2.style.height).toEqual('auto'); // 50px
    });

    it('object-fit: contain', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="150"
            data-object-fit="contain"
            data-test-subj="expect-smaller-height"
          />
        </div>
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="200"
            height="400"
            data-object-fit="contain"
            data-test-subj="expect-smaller-width"
          />
        </div>
      `;
      window.objectFitPolyfill();

      const img1 = document.querySelector(
        '[data-test-subj="expect-smaller-height"]'
      );
      expect(img1.style.width).toEqual('auto'); // 25px
      expect(img1.style.height).toEqual('100%'); // 100px

      const img2 = document.querySelector(
        '[data-test-subj="expect-smaller-width"]'
      );
      expect(img2.style.width).toEqual('100%'); // 100px
      expect(img2.style.height).toEqual('auto'); // 50px
    });

    it('object-fit: cover', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="400"
            height="200"
            data-object-fit="cover"
            data-test-subj="expect-larger-width"
          />
        </div>
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="100"
            data-object-fit="cover"
            data-test-subj="expect-larger-height"
          />
        </div>
      `;
      window.objectFitPolyfill();

      const img1 = document.querySelector(
        '[data-test-subj="expect-larger-width"]'
      );
      expect(img1.style.width).toEqual('auto'); // 200px
      expect(img1.style.height).toEqual('100%'); // 100px

      const img2 = document.querySelector(
        '[data-test-subj="expect-larger-height"]'
      );
      expect(img2.style.width).toEqual('100%'); // 100px
      expect(img2.style.height).toEqual('auto'); // 200px
    });
  });

  describe('calculating object-position', () => {
    it('defaults to center positioning', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="50"
            data-object-fit="none"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.left).toEqual('50%');
      expect(img.style.top).toEqual('50%');
      expect(img.style.marginLeft).toEqual('-25px');
      expect(img.style.marginTop).toEqual('-25px');
    });

    it('correctly calculates % positioning', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="50"
            data-object-fit="none"
            data-object-position="25% 75%"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.left).toEqual('25%');
      expect(img.style.bottom).toEqual('25%');
      expect(img.style.marginLeft).toEqual('-12.5px');
      expect(img.style.marginBottom).toEqual('-12.5px');
    });

    it('correctly sets absolute/unit values for positioning', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="50"
            height="50"
            data-object-fit="none"
            data-object-position="50px"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.left).toEqual('50px');
      expect(img.style.top).toEqual('50px');
      expect(img.style.marginLeft).toEqual('0px');
      expect(img.style.marginBottom).toEqual('0px');
    });

    it('correctly accepts keyword value positioning', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="200"
            data-object-fit="none"
            data-object-position="bottom left"
            data-test-subj="img-1"
          />
        </div>
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="200"
            data-object-fit="none"
            data-object-position="top right"
            data-test-subj="img-2"
          />
        </div>
      `;
      window.objectFitPolyfill();

      const img1 = document.querySelector('[data-test-subj="img-1"]');
      expect(img1.style.left).toEqual('0px');
      expect(img1.style.bottom).toEqual('0px');
      expect(img1.style.marginLeft).toEqual('0px');
      expect(img1.style.marginBottom).toEqual('0px');

      const img2 = document.querySelector('[data-test-subj="img-2"]');
      expect(img2.style.right).toEqual('0px');
      expect(img2.style.top).toEqual('0px');
      expect(img2.style.marginTop).toEqual('0px');
      expect(img2.style.marginRight).toEqual('0px');
    });
  });

  describe('checks for media properties that interfere with calculations', () => {
    it('resets max/min dimensions', () => {
      document.body.innerHTML = `
        <div class="container">
          <img
            src="test.jpg"
            alt=""
            style="max-width: 1000px; min-width: 100px; max-height: 500px; min-height: 50px;"
            data-object-fit
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.maxWidth).toEqual('none');
      expect(img.style.minWidth).toEqual('0px');
      expect(img.style.maxHeight).toEqual('none');
      expect(img.style.minHeight).toEqual('0px');
    });

    it('resets position', () => {
      document.body.innerHTML = `
        <div style="width: 100px; height: 100px;">
          <img
            src="test.jpg"
            alt=""
            width="300"
            height="200"
            style="position: relative; left: 50px; top: 50px;"
            data-object-fit="none"
            data-object-position="left top"
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.position).toEqual('absolute');
      expect(img.style.left).toEqual('0px');
      expect(img.style.top).toEqual('0px');
      // right and bottom should be reset to auto,
      // but for some reason jsdom is struggling with this
    });

    it('resets margins', () => {
      document.body.innerHTML = `
        <div class="container">
          <img
            src="test.jpg"
            alt=""
            style="margin-top: 10px; margin-right: 20px; margin-bottom: 30px; margin-left: 40px;"
            data-object-fit
          />
        </div>
      `;
      window.objectFitPolyfill();
      const img = document.querySelector('img');

      expect(img.style.marginTop).toEqual('0px');
      expect(img.style.marginRight).toEqual('0px');
      expect(img.style.marginBottom).toEqual('0px');
      expect(img.style.marginLeft).toEqual('0px');
    });
  });

  describe('checks parent containers', () => {
    const getParentContainer = () =>
      document.querySelector('[data-object-fit]').parentElement;

    it('overrides specific parent container styles', () => {
      document.body.innerHTML = `
        <div style="position: static; overflow: visible; display: inline; height: 0;">
          <img src="test.jpg" alt="" data-object-fit />
        </div>
      `;
      window.objectFitPolyfill();
      const parentContainer = getParentContainer();

      expect(parentContainer.style.position).toEqual('relative');
      expect(parentContainer.style.overflow).toEqual('hidden');
      expect(parentContainer.style.display).toEqual('block');
      expect(parentContainer.style.height).toEqual('100%');
    });

    it('does not override specific position or display styles', () => {
      document.body.innerHTML = `
        <div style="position: absolute; display: flex;">
          <img src="test.jpg" alt="" data-object-fit />
        </div>
      `;
      window.objectFitPolyfill();
      const parentContainer = getParentContainer();

      expect(parentContainer.style.position).toEqual('absolute');
      expect(parentContainer.style.display).toEqual('flex');
    });

    it('adds an object-fit-polyfill class to parent containers', () => {
      document.body.innerHTML = `
        <div class="test">
          <img src="test.jpg" alt="" data-object-fit />
        </div>
      `;
      window.objectFitPolyfill();
      const parentContainer = getParentContainer();

      expect(parentContainer.className).toEqual('test object-fit-polyfill');
    });
  });
});
