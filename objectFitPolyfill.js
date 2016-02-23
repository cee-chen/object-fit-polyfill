/*----------------------------------------
* objectFitPolyfill 1.0
*
* Made by Constance Chen
* Released under the MIT license
*
* https://github.com/constancecchen/object-fit-polyfill
*----------------------------------------*/

(function($, window, undefined) {

  // If the browser does support object-fit, we don't need to continue
  if ('objectFit' in document.documentElement.style !== false) {
  //  return;
  }

  $.fn.objectFitPolyfill = function(options) {

    // Setup options
    var settings = $.extend({
			"fit": "cover",
      "fixContainer": false,
    }, options);

    return this.each(function() {

      var $image = $(this);
      var $container = $image.parent();

      var coverAndPosition = function() {
        // If necessary, make the parent container work with absolutely positioned elements
        if (settings.fixContainer) {
          $container.css({
            "position": "relative",
            "overflow": "hidden",
          });
        }

				// Mathematically figure out which side needs covering, and add CSS positioning & centering
        $image.css({
          "position": "absolute",
          "height": $container.outerHeight(),
          "width": "auto"
        });

        if (
					settings.fit === "cover"   && $image.width() < $container.outerWidth() ||
					settings.fit === "contain" && $image.width() > $container.outerWidth()
				) {
					$image.css({
						"top": "50%",
						"left": 0,
						"height": "auto",
						"width": $container.outerWidth(),
						"marginLeft": 0,
					  "marginTop": $image.height() / -2
					});
        } else {
          $image.css({
            "top": 0,
            "left": "50%",
            "marginTop": 0,
						"marginLeft": $image.width() / -2
					});
        }
      };

      // Init - wait for the image to be done loading first, otherwise dimensions will return 0
			$image.on("load", function(){
				coverAndPosition();
			});

      // Recalculate widths & heights on window resize
      $(window).resize(function() {
        coverAndPosition();
      });

    });

  };

})(jQuery, window);
