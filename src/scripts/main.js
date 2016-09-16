'use strict';

var $ = require('jquery');
window.jQuery = $ = require('jquery');

var preloader = require('./modules/preloader');
    preloader.init(800);

// var panelTmpl_fn = require('./jade/template.tmpl.jade');
//     panelTmpl_fn({ localVar: "hello world" });

// var FizzyText = function() {
//   this.message = 'mick schouten';
//   this.speed = 0.8;
//   this.displayOutline = false;
//   // this.explode = function() { ... };
//   // Define render logic ...
// };
//
// window.onload = function() {
//   var text = new FizzyText();
//   var gui = new dat.GUI();
//   gui.add(text, 'message');
//   gui.add(text, 'speed', -5, 5);
//   gui.add(text, 'displayOutline');
//   gui.add(text, 'explode');
// };


var two = new Two({
  type: Two.Types.canvas,
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

var ms;
var asset = '/assets/ms2.svg';
two.load(asset, function(svg) {

  ms = svg;
  ms.center();
  // ms.subdivide();
  // ms.subdivide();

  ms.translation.x = two.width / 2;
  ms.translation.y = two.height / 2;

  var u = ms.children[0];
  u.miter = 0;
  u.stroke = 'rgb(255, 50, 50)';
  _.each(u.vertices, function(anchor) {
    var origin = anchor.clone();
    anchor.origin = origin;
  });

  var s = ms.children[1];
  s.miter = 0;
  s.stroke = 'rgb(34, 124, 170)';
  _.each(s.vertices, function(anchor) {
    var origin = anchor.clone();
    anchor.origin = origin;
  });

  var a = ms.children[2];
  a.miter = 0;
  a.stroke = '#333';
  _.each(a.vertices, function(anchor) {
    var origin = anchor.clone();
    anchor.origin = origin;
  });


  two.bind('resize', function() {
    ms.translation.x = two.width / 2;
    ms.translation.y = two.height / 2;
  });

  two.bind('update', function(frameCount) {

    ms.ending = frameCount / 250;

    if ((frameCount % 8) > 1) {
      return;
    }

    _.each(u.vertices, function(anchor, i) {
      var pct = i / u.vertices.length;
      anchor.x = anchor.origin.x + Math.sin(6 * pct + frameCount / 10) * 20;
    });
    _.each(s.vertices, function(anchor, i) {
      // var pct = i / s.vertices.length;
      // anchor.x = anchor.origin.x + Math.cos(6 * pct + frameCount / 10) * 20;
      // anchor.y = anchor.origin.y + Math.sin(6 * pct + frameCount / 10) * 20;
      anchor.x = anchor.origin.x + Math.random() * 10;
      anchor.y = anchor.origin.y + Math.random() * 10;
    });
    _.each(a.vertices, function(anchor, i) {
      var pct = i / a.vertices.length;
      anchor.y = anchor.origin.y + Math.sin(6 * pct + frameCount / 10) * 30;
    });
  });

});
