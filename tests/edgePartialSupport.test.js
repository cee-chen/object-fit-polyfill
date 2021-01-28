describe('when used in Edge 16-18', () => {
  require('./__mocks__/edgeUserAgent');
  require('./__mocks__/mediaLoaded');

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

  require('../src/objectFitPolyfill.js');

  it('does not simply return false', () => {
    expect(window.objectFitPolyfill()).toEqual(true);
  });

  it('does not polyfill <img> tags', () => {
    const img = document.body.querySelector('img');

    expect(img.parentElement.className).not.toEqual(
      expect.stringContaining('object-fit-polyfill')
    );
  });

  it('does polyfill non-img elements', () => {
    const video = document.body.querySelector('video');

    expect(video.parentElement.className).toEqual(
      expect.stringContaining('object-fit-polyfill')
    );
  });
});
