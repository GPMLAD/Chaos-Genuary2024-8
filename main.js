const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const resizeScreen = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

resizeScreen();

window.addEventListener("resize", resizeScreen);

const error = 0.01;

class Particle {
  constructor(x, y, z, hue) {
    this.position = { x: x, y: y, z: z };
    this.previousPosition = { x: null, y: null, z: null };
    this.velocity = { x: 0, y: 0, z: 0 };

    this.beta = 8 / 3;
    this.sigma = 10;
    this.rho = 28;

    this.dt = 0.01;
    this.scale = 5;

    this.hue = hue;
  }

  calculateVelocities() {
    this.velocity.x = this.sigma * (this.position.y - this.position.x);
    this.velocity.y =
      this.position.x * (this.rho - this.position.z) - this.position.y;
    this.velocity.z =
      this.position.x * this.position.y - this.beta * this.position.z;
  }

  calculatePositions() {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
    this.previousPosition.z = this.position.z;

    this.position.x += this.velocity.x * this.dt;
    this.position.y += this.velocity.y * this.dt;
    this.position.z += this.velocity.z * this.dt;
  }

  calculatePlotPositions() {
    const plots = {
      xy: { x: null, y: null, px: null, py: null },
      xz: { x: null, z: null, px: null, pz: null },
      yz: { y: null, z: null, py: null, pz: null },
    };
    // Plano xz
    plots.xz.x = this.position.x * this.scale + canvas.width / 2;
    plots.xz.z =
      -this.position.z * this.scale + canvas.height - canvas.height / 3;

    plots.xz.px = this.previousPosition.x * this.scale + canvas.width / 2;
    plots.xz.pz =
      -this.previousPosition.z * this.scale + canvas.height - canvas.height / 3;
    // Plano xy
    plots.xy.x = this.position.x * this.scale + canvas.width / 4;
    plots.xy.y = -this.position.y * this.scale + canvas.height / 2;

    plots.xy.px = this.previousPosition.x * this.scale + canvas.width / 4;
    plots.xy.py = -this.previousPosition.y * this.scale + canvas.height / 2;
    // Plano yz
    plots.yz.y = this.position.y * this.scale + canvas.width - canvas.width / 4;
    plots.yz.z =
      -this.position.z * this.scale + canvas.height - canvas.height / 3;

    plots.yz.py =
      this.previousPosition.y * this.scale + canvas.width - canvas.width / 4;
    plots.yz.pz =
      -this.previousPosition.z * this.scale + canvas.height - canvas.height / 3;

    this.draw(plots);
  }

  draw(plots) {
    ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plots.xz.px, plots.xz.pz);
    ctx.lineTo(plots.xz.x, plots.xz.z);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(plots.xy.px, plots.xy.py);
    ctx.lineTo(plots.xy.x, plots.xy.y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(plots.yz.py, plots.yz.pz);
    ctx.lineTo(plots.yz.y, plots.yz.z);
    ctx.closePath();
    ctx.stroke();
  }

  update() {
    this.calculateVelocities();
    this.calculatePositions();
    this.calculatePlotPositions();
  }
}

const particle = new Particle(0.1, 0, 0, Math.random() * 360);

let particles = [];

const init = (arr, num) => {
  for (let i = 0; i < num; i++) {
    arr.push(
      new Particle(
        0 + Math.random() * error,
        0 + Math.random() * error,
        0 + Math.random() * error,
        Math.random() * 360
      )
    );
  }
};

init(particles, 500);

const clearScreen = () => {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const animate = () => {
  clearScreen();
  particles.forEach((particle) => {
    particle.update();
  });
  requestAnimationFrame(animate);
};

animate();
