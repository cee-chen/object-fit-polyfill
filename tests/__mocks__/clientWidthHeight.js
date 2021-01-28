// Mocks clientWidth and clientHeight of images/divs to their set width="10px" / style="width: 10px"
// Note: Use px for the sake of mock testing, since we don't have an actual renderer

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  get() {
    return parseInt(this.width || this.style.width, 10);
  },
});

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  get() {
    return parseInt(this.height || this.style.height, 10);
  },
});
