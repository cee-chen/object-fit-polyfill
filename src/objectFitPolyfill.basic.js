/*----------------------------------------
 * objectFitPolyfill 2.0
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
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.objectFitPolyfill = factory());
    });
  } else if (typeof module === "object" && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.objectFitPolyfill = factory();
  }
}(this, function () {
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
      $container.style.position = "relative";
    }
    if (overflow !== "hidden") {
      $container.style.overflow = "hidden";
    }
    // Guesstimating that people want the parent to act like full width/height wrapper here.
    // Mostly attempts to target <picture> elements, which default to inline.
    if (!display || display === "inline") {
      $container.style.display = "block";
    }
    if ($container.clientHeight === 0) {
      $container.style.height = "100%";
    }

    $container.className = $container.className + " object-fit-polyfill";
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
        $media.style[property] = constraints[property];
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
    $media.style.position = "absolute";
    $media.style.height = "100%";
    $media.style.width = "auto";

    if (
      $media.clientWidth > $container.clientWidth
    ) {
      $media.style.top = "0";
      $media.style.marginTop = "0";
      $media.style.left = "50%";
      $media.style.marginLeft = ($media.clientWidth / -2) + "px";
    }
    else {
      $media.style.width = "100%";
      $media.style.height = "auto";
      $media.style.left = "0";
      $media.style.marginLeft = "0";
      $media.style.top = "50%";
      $media.style.marginTop = ($media.clientHeight / -2) + "px";
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

      if (mediaType === "img") {
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

  return objectFitPolyfill;

}));

if (typeof objectFitPolyfill === "function") {
  document.addEventListener("DOMContentLoaded", function() {
    objectFitPolyfill();
  });
  window.addEventListener("resize", function() {
    objectFitPolyfill();
  });
}
