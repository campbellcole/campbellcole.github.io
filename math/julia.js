var head = document.querySelector('h2');
var canv = document.querySelector('canvas');
var ctx = canv.getContext('2d');

var width = window.innerWidth, height = window.innerHeight;
canv.width = width;
canv.height = height;

var mouseX = 0, mouseY = 0;

var j_constant = math.complex(0.28, 0.01);

function update() {
  draw();
}

function move(event) {
  mouseX = event.clientX - canv.offsetLeft;
  mouseY = event.clientY - canv.offsetTop;
  j_constant = complexPoint(mouseX, mouseY);
  j_constant.re = math.round(j_constant.re * 100) / 100;
  j_constant.im = math.round(j_constant.im * 100) / 100;
  update();
}

canv.addEventListener('pointermove', move);

var cc_itr = 0, cc_per = 0, cc_r = 0, cc_g = 0, cc_b = 0;
function complexColor(point) {
  cc_itr = juuleeuh(point);
  cc_per = cc_itr / maxIterations;
  cc_r = cc_per * 255;
  cc_g = cc_per * 255;
  cc_b = cc_per * 255;
  return `rgb(${cc_r}, ${cc_g}, ${cc_b})`;
}

function complexPoint(x, y) {
  return math.complex((x/width)*2-1, 1-(y/height)*2);
}

function drawPixel(x, y, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, 1, 1);
}

var d_pt = 0, d_col = 0;
function draw() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      d_pt = complexPoint(x, y);
      d_col = complexColor(d_pt);
      drawPixel(x, y, d_col);
    }
  }
}

var maxIterations = 32;
function juuleeuh(z, i = 0) {
  z = z.mul(z);
  z = z.add(j_constant);
  if (math.abs(z) > 2 || i == maxIterations) return i;
  else return juuleeuh(z, i+1);
}

update();