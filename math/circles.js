var particles = [];

var num_particles = 50;
var particle_distance = 20;
var angle_increase = 0.1;
var scalar_base = -25;

var rad_to_deg = 180 / Math.PI;

var timescale = 2;

var draw_dots = false;
var draw_lines = true;
var draw_background = false;
var increase_distance = false;
var increase_distance_amount = 0.05;
var increase_speed = false;
var increase_speed_amount = 0.0001;
var wave_lines = true;
var noise_amplifier = 50;
var noise_smooth = 100;

var perlin_iterations = 3;

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

var lastY = 0;
function particle() {
  lastY += particle_distance;
  return {
    angle: 0,
    distance: lastY,
    x: 0,
    y: 0
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  for (var i = 0; i < num_particles; i++) {
    particles.push(particle());
    updateParticle(particles[i]);
  }
  noStroke();
  colorMode(HSB);
  noiselib.seed(Math.random());
  fill(255);
  textSize(15);
  text("Keybinds:", 4, 18);
  text("Up Arrow Key: increase speed", 4, 36);
  text("Down Arrow Key: decrease speed", 4, 54);
  text("H: draw a black box where this text is", 4, 72);
}

function draw() {
  for (var i = 0; i < timescale; i++) do_draw();
}

var angle_accumulator = 0;
function do_draw() {
  if (increase_distance) scalar_base += increase_distance_amount;
  if (draw_dots) {
    for (var i = 0; i < particles.length; i++) {
      fill(particle.angle * 360, 255, 255);
      ellipse(particles[i].x, particles[i].y, 3);
    }
  }
  if (increase_speed) angle_increase += increase_speed_amount;
  for (var i = 0; i < particles.length; i++) {
    var increase = (angle_increase / i);
    if (i % 2 == 0) increase = -increase;
    particles[i].angle += increase;
    var lastX = particles[i].x;
    var lastY = particles[i].y;
    updateParticle(particles[i]);
    if (draw_lines) {
      var color = particles[i].angle;
      if (i % 2 == 0) color = -color;
      color *= rad_to_deg;
      color /= 2;
      stroke(color % 360, 90, 60);
      if (wave_lines) {
        beginShape()
        var dX = particles[i].x - lastX;
        var dY = particles[i].y - lastY;
        var oX = dX / perlin_iterations;
        var oY = dY / perlin_iterations;
        vertex(lastX, lastY);
        var lastNoise = noiselib.perlin3(lastX / noise_smooth, lastY / noise_smooth, frameCount / noise_smooth) * noise_amplifier;
        var lastNoiseX = lastX;
        var lastNoiseY = lastY;
        var thisNoiseX = lastNoiseX + oX;
        var thisNoiseY = lastNoiseY + oY;
        for (var x = 0; x < perlin_iterations; x++) {
          bezierVertex(lastNoiseX, lastNoiseY, thisNoiseX, thisNoiseY, lastNoiseX + lastNoise, lastNoiseY + lastNoise);
          lastNoiseX = thisNoiseX;
          lastNoiseY = thisNoiseY;
          lastNoise = noiselib.perlin3(lastNoiseX / noise_smooth, lastNoiseY / noise_smooth, frameCount / noise_smooth) * noise_amplifier;
          thisNoiseX += oX;
          thisNoiseY += oY;
        }
        endShape();
      } else line(particles[i].x, particles[i].y, lastX, lastY);
    }
  }
  if (draw_background && frameCount % 5 == 0) background(0, 0.2);
}

function updateParticle(particle) {
  var angle = particle.angle;
  var scalar = scalar_base + particle.distance;
  var baseX = centerX;
  var baseY = centerY;
  var x = baseX + sin(angle) * scalar;
  var y = baseY - cos(angle) * scalar;
  particle.x = x;
  particle.y = y;
}

function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    if (timescale > 1) timescale--;
  } else if (keyCode == UP_ARROW) timescale++;
}

function keyTyped() {
  if (key === 'h' || key === 'H') {
    fill(0);
    noStroke();
    rect(0, 0, 244, 72);
  }
}