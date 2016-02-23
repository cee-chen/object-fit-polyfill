# object-fit-polyfill
A jQuery polyfill for browsers that don't support the `object-fit` CSS property. If you're unsure of what the property does, essentially `object-fit` is to `<img>` tags what `background-size` is to `background-image`. You can check out the [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) for more details.

## Demo

You can check out the [bare-bones demo here](http://constancecchen.github.io/object-fit-polyfill). Note that the plugin simply won't do anything if you're on a browser that already supports object-fit, so you'll need to test it on IE.

## How does it work?

Unlike [Primož Cigler's method](https://medium.com/@primozcigler/neat-trick-for-css-object-fit-fallback-on-edge-and-other-browsers-afbc53bbb2c3#.17fpxgk0w) (which is an excellent alternative if you'd rather not use this one), this polyfill does not set a background image on the parent container, but instead resizes and repositions the image (using inline CSS for height, width, absolute positioning, and negative margins).

If you're asking: why even bother using `<img>` tags versus `background-image`, here are two reasonable-ish reasons:

1. `<img>` tags have better SEO/crawling visibility
2. In cases where images are dynamically returned and can't simply be added to your stylesheets (e.g., CMS's), you're forced to inline your background-image. This solves that somewhat-ugly-looking inline CSS.

Of course, there's still plenty of cases where using a background image makes more sense than a regular image.

## Usage

Dependencies:

```
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="objectFitPolyfill.js"></script>
```

Initialization:

```
<script>
	$(function() {
		$(".your-class").objectFitPolyfill();
	});
</script>
```

Minimum HTML required:

```
<div class="container">
  <img class="your-class" src="https://unsplash.it/800/600/" alt="">
</div>
```

Minimum CSS required:

```
.container {
	width: 400px; // Or whatever you want it to be
	height: 400px; // Or whatever
}
.your-class {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
```

## Options / Settings

### `fit`

There's just two options for this right now, `cover` (the default) and `contain`. I'm unsure whether to add `scale-down` support - does anybody have a use for that? Give me a shout or PR if you do!

```
<script>
	$(".your-class").objectFitPolyfill({fit: "contain"});
</script>
```

### `fixContainer`

A boolean that defaults to false. Use this if your normal CSS doesn't have `position: relative` and `overflow: hidden` on the parent container of your images (required for this polyfill, since we're using absolute positioning as a fallback).

```
<script>
	$(".your-class").objectFitPolyfill({fixContainer: true});
</script>
```

---

Please note that I currently don't have support for `object-position` - the positioning currently defaults to the center. If this is a feature a lot of people want, I'd be happy to go back and add it in (or merge a pull request, if someone else wants to do it!)

## But why jQuery?

To be honest, I'm very far from an expert in Javascript, and this is one of my first ever plugins. I'd love some extra help converting it into vanilla Javascript and making it ES6 or module-friendly. Pull requests are welcome!
