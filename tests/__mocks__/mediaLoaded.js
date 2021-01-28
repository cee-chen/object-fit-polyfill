// jsdom defaults images/videos to unloaded state

Object.defineProperty(HTMLImageElement.prototype, 'complete', { value: true });
Object.defineProperty(HTMLMediaElement.prototype, 'readyState', { value: 1 });
