'use strict';

var $ = require('jquery');

// Functions
/// ----------------------------------------------------------------------------

module.exports = {
  init: function(interval) {
    setTimeout(function() {
      $('[data-vui-preloader]').fadeOut(600, function() {
        $('body').removeClass('vui-modal-open');
      });
    }, interval);
  }
}
