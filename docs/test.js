function between(min, max) {
  var d = Math.abs(min - max);
  return min + Math.random() * d;
}

function ranRange(max) {
  return -max + (Math.random() * (max * 2));
}

function deg2rad(d) {
  return d * (Math.PI / 180);
}

function rad2deg(r) {
  return r * (180 / Math.PI);
}

function getXY(radius, angle) {
  return {
    x: Math.sin(deg2rad(angle)) * radius,
    y: Math.cos(deg2rad(angle)) * radius
  }
}

function between(min, max) {
  var d = Math.abs(min - max);
  return min + Math.random() * d;
}

function ranRange(max) {
  return -max + (Math.random() * (max * 2));
}

function map(p, min, max) {
  var delt = Math.abs(max - min);
  return min + delt * p;
}

var elem = document.getElementById('draw-animation');
var two = new Two({
  width: window.innerWidth,
  height: window.innerHeight
}).appendTo(elem);
/*
var circle = two.makeCircle(-70, 0, 50);
var rect = two.makeRectangle(70, 0, 100, 100);
circle.fill = '#FF8000';
rect.fill = 'rgba(0, 200, 255, 0.75)';*/

var ct = 30;
var size = 500;
var g = two.makeGroup();
var shapes = [];

for (var i = 0; i < ct; i++) {
  var p = i / ct;
  var d = 360 * p;
  var xy = getXY(size * 1, d);
  var c = two.makeEllipse(xy.x, xy.y, size, size * .75); //two.makeCircle(xy.x, xy.y, size);
  //c.fill = 'rgba(0, 0, 0, .2)';
  c.stroke = '#666';
  c.opacity = .25;
  c.linewidth = .5;
  c.addTo(g);
  shapes.push(c);
}

g.translation.x = window.innerWidth * .5;
g.translation.y = window.innerHeight * .5;

/*
var group = two.makeGroup(circle, rect);
group.translation.set(two.width / 2, two.height / 2);
group.scale = 0;
group.noStroke();*/

// Bind a function to scale and rotate the group
// to the animation loop.
two.bind('update', function(frameCount) {

  g.rotation += .001;

  for (var i = 0; i < shapes.length; i++) {
    shapes[i].rotation += .01;
  }
  /* // This code is called everytime two.update() is called.
   // Effectively 60 times per second.
   if (group.scale > 0.9999) {
     group.scale = group.rotation = 0;
   }
   var t = (1 - group.scale) * 0.125;
   group.scale += t;
   group.rotation += t * 4 * Math.PI;*/
}).play(); // Finally, start the animation loop
