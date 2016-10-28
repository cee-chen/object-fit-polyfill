/*----------------------------------------
 * objectFitPolyfill 2.1
 *
 * Basic, no-frills version -
 * Defaults to object-fit: cover and object-position: 50% 50%
 *
 * Made by Constance Chen
 * Released under the MIT license
 *
 * https://github.com/constancecchen/object-fit-polyfill
 *--------------------------------------*/

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD - registered as an anonymous module
    define(factory);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.objectFitPolyfill = factory();
  }
})(this, function () {
  "use strict";

  // If the browser does support object-fit, we don't need to continue
  if ("objectFit" in document.documentElement.style !== false) {
    return;
  }

  /**
   * Check the container's parent element to make sure it will
   * correctly handle and clip absolutely positioned children
   * @private
   * @param $container - parent element
   */
  var checkParentContainer = function($container) {
    var styles = window.getComputedStyle($container, null);
    var position = styles.getPropertyValue("position");
    var overflow = styles.getPropertyValue("overflow");
    var display = styles.getPropertyValue("display");

    if (!position || position === "static") {
      $media.style.setProperty( 'position', 'relative', 'important' );
    }
    if (overflow !== "hidden") {
      $media.style.setProperty( 'overflow', 'hidden', 'important' );
    }
    // Guesstimating that people want the parent to act like full width/height wrapper here.
    // Mostly attempts to target <picture> elements, which default to inline.
    if (!display || display === "inline") {
      $media.style.setProperty( 'display', 'block', 'important' );
    }
    if ($container.clientHeight === 0) {
      $media.style.setProperty( 'height', '100%', 'important' );
    }

    $container.className = $container.className + ' object-fit-polyfill';
  };

  /**
   * Check for pre-set max-width/height or min-width/height,
   * which can mess up image calculations
   * @private
   * @param $media - img/video element
   * @param styles - computed styles of media element
   */
  var checkMediaConstraints = function($media) {
    var styles = window.getComputedStyle($media, null);
    var constraints = {
      "max-width":  "none",
      "max-height": "none",
      "min-width":  "0px",
      "min-height": "0px"
    };

    for (var property in constraints) {
      var constraint = styles.getPropertyValue(property);

      if (constraint !== constraints[property]) {
        $media.style.setProperty( property, constraints[property], 'important' );
      }
    }
  };

  /**
   * Calculate & set object-fit
   * @private
   * @param $media - img/video/picture element
   */
  var objectFit = function($media) {
    // If necessary, make the parent container work with absolutely positioned elements
    var $container = $media.parentNode;
    checkParentContainer($container);

    // Check for max-width/height or min-width/height, which can mess up image calculations
    checkMediaConstraints($media);

    // Mathematically figure out which side needs covering, and add CSS positioning & centering
    $media.style.setProperty( 'position', 'absolute', 'important' );
    $media.style.setProperty( 'height',   '100%',     'important' );
    $media.style.setProperty( 'width',    'auto',     'important' );

    if (
      $media.clientWidth > $container.clientWidth
    ) {
      $media.style.setProperty( 'top',        '0',   'important' );
      $media.style.setProperty( 'margin-top', '0',   'important' );
      $media.style.setProperty( 'left',       '50%', 'important' );
      $media.style.setProperty( 'margin-left', ($media.clientWidth / -2) + 'px', 'important' );
    }
    else {
      $media.style.setProperty( 'width',       '100%', 'important' );
      $media.style.setProperty( 'height',      'auto', 'important' );
      $media.style.setProperty( 'left',        '0',    'important' );
      $media.style.setProperty( 'margin-left', '0',    'important' );
      $media.style.setProperty( 'top',         '50%',  'important' );
      $media.style.setProperty( 'margin-top',  ($media.clientHeight / -2) + 'px', 'important' );
    }
  };

  /**
   * Initialize Plugin
   * @public
   */
  var objectFitPolyfill = function() {
    var media = document.querySelectorAll("[data-object-fit]");

    for (var i = 0; i < media.length; i ++) {
      var mediaType = media[i].nodeName.toLowerCase();

      if (mediaType === 'img') {
        if (media[i].complete) {
          objectFit(media[i]);
        }
        else {
          media[i].addEventListener("load", function() {
            objectFit(this);
          });
        }
      }
      else if (mediaType === "video") {
        if (media[i].readyState > 0) {
          objectFit(media[i]);
        }
        else {
          media[i].addEventListener("loadedmetadata", function() {
            objectFit(this);
          });
        }
      }
    }
  };

  document.addEventListener("DOMContentLoaded", function() {
    objectFitPolyfill();
  });

  window.addEventListener("resize", function() {
    objectFitPolyfill();
  });

});
