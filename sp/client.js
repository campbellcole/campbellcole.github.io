M.AutoInit();

const SPAWNRATE = 400; // bigger is less frequently

var canv = document.querySelector('canvas');
var ctx = canv.getContext('2d');

canv.width = window.innerWidth;
canv.height = window.innerHeight;

function particle() {
    ctx.beginPath();
    ctx.ellipse(Math.random() * canv.width, Math.random() * canv.height, 1, 1, 0, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.fill();
    setTimeout(() => { particle(); }, Math.random() * SPAWNRATE);
}

var cgrad = ctx.createLinearGradient(0, canv.height/2, canv.width, canv.height/2);
cgrad.addColorStop('0', 'black');
cgrad.addColorStop('0.4', 'grey');
cgrad.addColorStop('0.6', 'grey');
cgrad.addColorStop('1', 'black');

ctx.strokeStyle = cgrad;
ctx.fillStyle = cgrad;
ctx.globalAlpha = 0.6;
ctx.lineWidth = 0.5;

//particle();