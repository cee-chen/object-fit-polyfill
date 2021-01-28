describe('when used in IE browsers without dataset support', () => {
  require('./__mocks__/objectFitUnavailable');
  require('./__mocks__/datasetUnavailable');
  require('./__mocks__/clientWidthHeight');
  require('./__mocks__/mediaLoaded');

  document.body.innerHTML = `
    <div style="width: 100px; height: 100px;">
      <img
        src="test.jpg"
        alt=""
        width="150"
        height="50"
        data-object-fit
      />
    </div>
  `;

  require('../src/objectFitPolyfill.js');

  it('still works', () => {
    expect(window.objectFitPolyfill()).toEqual(true);
    expect(document.querySelector('.object-fit-polyfill')).toBeTruthy();
  });

  it('still correctly sets position & dimensions', () => {
    const img = document.querySelector('img');

    expect(img.style.width).toEqual('auto');
    expect(img.style.height).toEqual('100%');
    expect(img.style.marginLeft).toEqual('-75px');
  });
});
