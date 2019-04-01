# object-fit-polyfill

A polyfill for browsers that don't support the `object-fit` CSS property. Unsure of what the `object-fit` does? Essentially `object-fit` is to `<img>` tags what `background-size` is to `background-image`. You can check out the [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) for more details.

## Features

- Lightweight - 3KB (2KB with the basic version)
- Vanilla Javascript - works with or without jQuery
- Supports IE 9+, iOS 7-, and Android 4.4-
- Supports `object-position`
- Works with `img`, `picture`, `srcset`, `video`, and `canvas`
- Plug and play - just include the .js file and set data attributes on your elements.
- Please note: This plugin makes the assumption that the parent container is acting as a picture frame, and already has a height & width set.

## Demo

You can check out the [bare-bones demo here](http://constancecchen.github.io/object-fit-polyfill/demo/). Note that the plugin simply won't do anything if you're on a browser that already supports object-fit, so you'll want to test it on IE or older iOS/Android browsers.

## How does it work?

Unlike [object-fit-images](https://github.com/bfred-it/object-fit-images) or [Primož Cigler's method](https://medium.com/@primozcigler/neat-trick-for-css-object-fit-fallback-on-edge-and-other-browsers-afbc53bbb2c3#.17fpxgk0w) (both excellent alternatives if you'd rather not use this one), this polyfill does not set a background image on the parent container, but instead resizes and repositions the image (using inline CSS for height, width, absolute positioning, and negative margins).

The polyfilled item will receive the class `object-fit-polyfill` if styling issues occur that require overrides.

## Why bother?

If you're wondering: why bother using `<img>` tags versus `background-image`? Here's a couple reasons:

1. `<img>` tags have better SEO/crawling visibility.
2. In cases where images are dynamically returned and can't simply be added to your stylesheets (e.g., CMS's), you're forced to inline your background-image. This solves that somewhat-ugly-looking inline CSS.
3. `background-image` doesn't work with `picture`, `video`, or `canvas` elements.

Of course, there's still plenty of cases where using a background image makes more sense than a regular image.

## Usage

Initialization:

```html
<!-- Minimum CSS -->
<style>
  .container {
    width: 25em; /* Or whatever you want it to be */
    height: 25em; /* Or whatever you want it to be */
  }
  .media {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Or whatever object-fit you want */
  }
</style>

<!-- Minimum HTML -->
<div class="container">
  <img
    alt=""
    src="https://unsplash.it/800/600/"
    class="media"
    data-object-fit="cover"
  />
</div>

<script src="dist/objectFitPolyfill.min.js"></script>
```

Customized object-fit/object-position:

```html
<div class="container">
  <img
    alt=""
    src="https://unsplash.it/800/600/"
    class="media"
    data-object-fit="contain"
    data-object-position="top left"
  />
</div>

<div class="container">
  <img
    alt=""
    src="https://unsplash.it/800/600/"
    class="media"
    data-object-fit="none"
    data-object-position="25% 75%"
  />
</div>

<div class="container">
  <img
    alt=""
    src="https://unsplash.it/800/600/"
    class="media"
    data-object-fit="scale-down"
    data-object-position="3em -1em"
  />
</div>
```

If you're only interested in using the basic polyfill (which assumes `object-fit: cover` and `object-position: 50% 50%`), you can save yourself some bytes by using:

```html
<div class="container">
  <img
    alt=""
    src="https://unsplash.it/800/600/"
    class="media"
    data-object-fit
  />
</div>

<script src="dist/objectFitPolyfill.basic.min.js"></script>
```

## Installation via package managers

Alternatively, if you prefer not to manually add Javascript files to your sites, you can use bower and npm like so:

```
bower install objectFitPolyfill
```

```
npm install objectFitPolyfill
```

## Advanced usage

If you need to dynamically call the polyfill on the fly for any reason (for example, carousels or lazy-loaded images), you can do so quite easily:

```js
// Rerun the polyfill on all elements with the data attribute
objectFitPolyfill();

// Rerun the polyfill on a single DOM node
var element = document.querySelector('.foo');
objectFitPolyfill(element);

// Rerun the polyfill on multiple elements
var elements = document.querySelectorAll('.bar');
objectFitPolyfill(elements);

// Rerun the polyfill with a jQuery selector
objectFitPolyfill($('.baz'));
```

## Requests?

If you'd like to make feature requests such as IE 8- or adding object-position support for Safari, feel free to open an issue or pull request! It's doable and on my radar, but I probably won't get to it without some prodding.
