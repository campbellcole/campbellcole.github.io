M.AutoInit();

const SPAWNRATE = 5000;

var canv = document.querySelector('canvas');
var ctx = canv.getContext('2d');

canv.width = window.innerWidth;
canv.height = window.innerHeight;

function particle() {
    ctx.beginPath();
    ctx.ellipse(Math.random() * canv.width, Math.random() * canv.height, 1, 1, 0, 0, 2 * Math.PI, false);
    ctx.stroke();
    setTimeout(() => { particle(); }, Math.random() * SPAWNRATE);
}

ctx.strokeStyle = "#F0F0F0";

particle();