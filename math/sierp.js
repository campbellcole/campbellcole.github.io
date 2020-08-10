var tloc,
  tlen = 150;
var tp = [];

var rpoints = [];
var rind = 0;

var degrad = Math.PI / 180;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  tloc = createVector(width / 2, height / 2);
  init_tri();
  noFill();
}

function init_tri() {
  tp = [createVector(tlen * Math.cos(0 * degrad) + tloc.x, tlen * Math.sin(0 * degrad) + tloc.y), createVector(tlen * Math.cos(120 * degrad) + tloc.x, tlen * Math.sin(120 * degrad) + tloc.y), createVector(tlen * Math.cos(240 * degrad) + tloc.x, tlen * Math.sin(240 * degrad) + tloc.y)];
  var r1 = Math.random(),
    r2 = Math.random();
  var rx = (1 - Math.sqrt(r1)) * tp[0].x + (Math.sqrt(r1) * (1 - r2)) * tp[1].x + (Math.sqrt(r1) * r2) * tp[2].x;
  var ry = (1 - Math.sqrt(r1)) * tp[0].y + (Math.sqrt(r1) * (1 - r2)) * tp[1].y + (Math.sqrt(r1) * r2) * tp[2].y;
  rpoints.push(createVector(rx, ry));
  stroke(255);
}

var d_chosenpoint = 1,
  d_pos = 0,
  d_dist = 0,
  d_a = 0,
  d_dx = 0,
  d_dy = 0,
  d_pc = 0,
  d_pmax = 5000,
  d_fact = 1.6;

var d_db = false;
var auto = true;

function draw() {
  if (mouseIsPressed) {
    if (!d_db) {
      tlen *= 1.5;
      init_tri();
      d_db = true;
    }
  } else {
    d_db = false;
  }
  for (d_pc = 0; d_pc < d_pmax; d_pc++) {
    d_chosenpoint = Math.floor(Math.random() * 3);
    d_pos = rpoints[rind];
    point(d_pos.x, d_pos.y);
    d_dist = Math.sqrt(Math.pow((tp[d_chosenpoint].x - d_pos.x), 2) +
      Math.pow((tp[d_chosenpoint].y - d_pos.y), 2));
    d_dist /= d_fact;
    d_a = Math.atan2(tp[d_chosenpoint].y - d_pos.y, tp[d_chosenpoint].x - d_pos.x);
    d_dx = d_dist * Math.cos(d_a) + tp[d_chosenpoint].x;
    d_dy = d_dist * Math.sin(d_a) + tp[d_chosenpoint].y;
    rpoints.push(createVector(d_dx, d_dy));
    rind++;
  }
  if (auto) {
    tlen *= 1.001;
    init_tri();
  }
  d_fact += 0.001;
}

function createVector(x, y) {
  return {
    x: x,
    y: y
  };
}