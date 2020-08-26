//https://github.com/josephg/noisejs

var particles = [];

var CHANGEME_PERIOD = 1 / 800,
    CHANGEME_SCALE = 4, // larger is more grouped
    CHANGEME_VARIABLE_SCALE = false,
    CHANGEME_SCALE_OFFSET = 0.01,
    CHANGEME_3D_ENABLED = true,
    CHANGEME_COLOR_CHANGE_SPEED = 6000, // larger is slower
    CHANGEME_COLOR_CHANGE = false,
    CHANGEME_START_ROTATION_OFFSET_DEGREES = 180,
    CHANGEME_RANDOM_ANGLE = false,
    CHANGEME_CIRCLE_SIZE = 1,
    CHANGEME_MIND_BLOW = false, // allows spawning everywhere
    CHANGEME_SPAWN_HEIGHT = 50,
    CHANGEME_SPAWN_HEIGHT_FADE = true,
    CHANGEME_SPAWN_HEIGHT_FADE_AMOUNT = 0.5,
    CHANGEME_DRAW_BACKGROUND = false,
    CHANGEME_FADE_BACKGROUND = false,
    CHANGEME_FADE_OPACITY = 10,
    CHANGEME_RESEED_INTERVAL = -1, // frames between reset (-1 none)
    CHANGEME_COMPLEM_PARTICLE = true,
    CHANGEME_BACKGROUND_COLOR = 30,
    CHANGEME_PERLIN3D_Z_PERIOD = 1 / 10000,
    CHANGEME_PERLIN3D_Z_INCREMENT = true,
    CHANGEME_PARTICLE_SATURATION = 75,
    CHANGEME_PARTICLE_BRIGHTNESS = 35,
    CHANGEME_PARTICLE_ALPHA = 100,
    CHANGEME_INITIAL_PARTICLE_COUNT = 0,
    CHANGEME_MAX_PARTICLE_COUNT = 800,
    CHANGEME_FORCE_MOBILE = false;

var degtorad = Math.PI / 180;

var _ip_i = 0, _ip_t;
function init_particles() {
    particles = [];
    for (_ip_i = 1; _ip_i <= CHANGEME_INITIAL_PARTICLE_COUNT; _ip_i++) {
        new_particle();
    }
}

var np_a = 0, np_y = 0;
function new_particle() {
    if (CHANGEME_MIND_BLOW) {
        np_y = Math.random() * height;
    } else {
        np_y = height / 2 + (Math.random() - 0.5) * Math.floor(CHANGEME_SPAWN_HEIGHT);
    }
    _ip_t = {
        x: Math.random() * width,
        y: np_y,
        a: CHANGEME_RANDOM_ANGLE ? Math.random()*360 : 0
    };
    particles.push(_ip_t);
    if (CHANGEME_COMPLEM_PARTICLE) {
        np_a = degtorad * CHANGEME_START_ROTATION_OFFSET_DEGREES;
        if (CHANGEME_RANDOM_ANGLE) np_a += _ip_t.a;
        particles.push({
            x: _ip_t.x,
            y: _ip_t.y,
            a: np_a
        });
    }
}

var s_dev = "computer", s_strings = [], s_ci = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(CHANGEME_BACKGROUND_COLOR);
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || CHANGEME_FORCE_MOBILE) {
        CHANGEME_CIRCLE_SIZE /= 4;
        CHANGEME_SCALE *= 8;
        CHANGEME_COLOR_CHANGE_SPEED /= 8;
        CHANGEME_MIND_BLOW = false;
        CHANGEME_SPAWN_HEIGHT_FADE = true;
        CHANGEME_SPAWN_HEIGHT = 5;
        CHANGEME_VARIABLE_SCALE = false;
        CHANGEME_COMPLEM_PARTICLE = false;
        CHANGEME_RANDOM_ANGLE = true;
        CHANGEME_PERLIN3D_Z_PERIOD *= 12;
        CHANGEME_PERIOD *= 8;
        CHANGEME_MAX_PARTICLE_COUNT = Math.floor(CHANGEME_MAX_PARTICLE_COUNT * 0.88);
        s_dev = "phone";
    }
    s_strings = [
        "don't stare too long",
        "pslight",
        `your ${s_dev} is about to do a lot of math`,
        "odg",
        "there's a hole in my ceiling",
        "there's a lot going on here...",
        "","","","",""
    ];
    s_ci = Math.floor(Math.random()*s_strings.length);
    fill(170);
    noStroke();
    text("campbell made this", 8, 20);
    text(s_strings[s_ci], 8, 40);
    init_particles();
    noiselib.seed(Math.random());
    colorMode(HSL);
}

var d_i = 0, d_p, d_n, d_a, d_c = 0, d_h = 0, d_ds = 0, d_co = 0, d_so = 0, d_zi = 0;
function draw() {
    d_c++;
    if (CHANGEME_PERLIN3D_Z_INCREMENT) d_zi++;
    if (CHANGEME_DRAW_BACKGROUND) {
        if (CHANGEME_FADE_BACKGROUND) {
            colorMode(RGB);
            d_i = CHANGEME_BACKGROUND_COLOR; // temp var
            fill(d_i, d_i, d_i, CHANGEME_FADE_OPACITY);
            noStroke();
            rect(0, 0, width, height);
            fill(170);
            text("campbell made this", 8, 20);
            text(s_strings[s_ci], 8, 40);
            colorMode(HSL);
        } else {
            colorMode(RGB);
            background(CHANGEME_BACKGROUND_COLOR);
            colorMode(HSL);
        }
    }
    if (CHANGEME_SPAWN_HEIGHT_FADE) {
        CHANGEME_SPAWN_HEIGHT += CHANGEME_SPAWN_HEIGHT_FADE_AMOUNT;
        if (CHANGEME_SPAWN_HEIGHT > height) {
            CHANGEME_MIND_BLOW = true;
        }
    }
    if ((d_c % 5) == 0 && particles.length < CHANGEME_MAX_PARTICLE_COUNT) {
        for (var ni = 0; ni < 1 + (particles.length * 0.01); ni++) {
            new_particle();
        }
    }
    if ((d_c%CHANGEME_RESEED_INTERVAL) == 0 && CHANGEME_RESEED_INTERVAL != -1) {
        noiselib.seed(Math.random());
        init_particles();
        background(CHANGEME_BACKGROUND_COLOR);
    }
    if (CHANGEME_VARIABLE_SCALE) {
        d_so += CHANGEME_SCALE_OFFSET;
    }
    for (d_i = 0; d_i < particles.length; d_i++) {
        d_p = particles[d_i];
        if (CHANGEME_3D_ENABLED) {
            d_n = noiselib.perlin3(d_p.x * CHANGEME_PERIOD, d_p.y * CHANGEME_PERIOD, d_zi * CHANGEME_PERLIN3D_Z_PERIOD);
        } else {
            d_n = noiselib.perlin2(d_p.x * CHANGEME_PERIOD, d_p.y * CHANGEME_PERIOD);
        }
        if (!CHANGEME_COLOR_CHANGE) d_co = 0;
        else d_co = d_c / CHANGEME_COLOR_CHANGE_SPEED;
        d_h = Math.abs(Math.floor(d_n * (360 * (2 + d_co)))) % 360;
        stroke(d_h, CHANGEME_PARTICLE_SATURATION, CHANGEME_PARTICLE_BRIGHTNESS, CHANGEME_PARTICLE_ALPHA);
        fill(d_h, CHANGEME_PARTICLE_SATURATION, CHANGEME_PARTICLE_BRIGHTNESS, CHANGEME_PARTICLE_ALPHA);
        circle(d_p.x, d_p.y, CHANGEME_CIRCLE_SIZE);
        d_a = d_n * (CHANGEME_SCALE + d_so) * Math.PI + d_p.a
        d_p.x += Math.cos(d_a);
        d_p.y += Math.sin(d_a);
        if (d_p.x < 0 || d_p.x > width) {
            d_ds++;
            particles.splice(d_i, 1);
            if (d_ds%2==0 && CHANGEME_COMPLEM_PARTICLE) new_particle();
            else if (!CHANGEME_COMPLEM_PARTICLE) new_particle();
            continue;
        }
        if (d_p.y < 0 || d_p.y > height) {
            d_ds++;
            particles.splice(d_i, 1);
            if (d_ds%2==0 && CHANGEME_COMPLEM_PARTICLE) new_particle();
            else if (!CHANGEME_COMPLEM_PARTICLE) new_particle();
            continue;
        }
        particles[d_i] = d_p;
    }
}

function htr(h, s, l) {
    var c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    if (0 <= h && h < 60) {
          r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
          r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
          r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
          r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
          r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
          r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return [r, g, b];
  }

  function add_particles(amount) {
      for (var i = 0; i < amount; i++) {
          new_particle();
      }
  }

  function print_stats() {
      console.log(`particle count: ${particles.length}`);
      console.log(`deaths: ${d_ds}`);
      console.log(`d_so (draw_scaleoffset): ${d_so}`);
  }

  function blow_mind() {
      CHANGEME_MIND_BLOW = !CHANGEME_MIND_BLOW;
  }

  function touchStarted() {
    //CHANGEME_VARIABLE_SCALE = false;
    toggleIncr();
    return false;
  }

  function touchEnded() {
    //CHANGEME_VARIABLE_SCALE = false;
    toggleIncr();
    return false;
  }

  function toggleIncr() {
    CHANGEME_DRAW_BACKGROUND = !CHANGEME_DRAW_BACKGROUND;
    CHANGEME_PERLIN3D_Z_INCREMENT = !CHANGEME_PERLIN3D_Z_INCREMENT;
  }