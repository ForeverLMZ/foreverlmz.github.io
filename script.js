// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================================
// Hero signature: an "attention spotlight" over a color-cluster
// grid. Each cell sits dim and muted by default; a focal point
// (the cursor, or a slow drift when idle) brightens cells near
// it into full color — a small, literal picture of the idea
// this site is about: attention selecting what stands out from
// a field of otherwise-equal observations.
// ============================================================
(function () {
  const canvas = document.getElementById("attn-grid");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const holder = canvas.parentElement;

  const SPECTRUM = [
    [226, 87, 76],   // coral
    [232, 162, 61],  // amber
    [79, 178, 134],  // teal
    [76, 127, 214],  // blue
    [139, 95, 191],  // violet
  ];
  const MUTED = [99, 101, 111]; // fg-faint, used as the resting color

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let cells = [];
  let cell = 30;
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let focal = { x: 0, y: 0 };
  let target = { x: 0, y: 0 };
  let usingPointer = false;
  let idleT = 0;

  function hashInt(x, y) {
    let n = x * 374761393 + y * 668265263;
    n = (n ^ (n >> 13)) * 1274126177;
    return (n ^ (n >> 16)) >>> 0;
  }

  function buildGrid() {
    const rect = holder.getBoundingClientRect();
    w = Math.max(rect.width, 320);
    h = Math.max(rect.height, 260);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cell = w < 640 ? 24 : 30;
    const cols = Math.ceil(w / cell) + 1;
    const rows = Math.ceil(h / cell) + 1;
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hsh = hashInt(c, r);
        cells.push({
          x: c * cell + cell / 2,
          y: r * cell + cell / 2,
          color: SPECTRUM[hsh % SPECTRUM.length],
          jitter: ((hsh >> 8) % 100) / 100, // 0..1, varies size/alpha slightly
        });
      }
    }
    focal.x = target.x = w * 0.72;
    focal.y = target.y = h * 0.38;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const radius = Math.max(w, h) * 0.26;

    for (const cl of cells) {
      const dx = cl.x - focal.x;
      const dy = cl.y - focal.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let t = 1 - dist / radius;
      t = Math.max(0, Math.min(1, t));
      t = t * t * (3 - 2 * t); // smoothstep falloff

      const [r, g, b] = cl.color;
      const mixR = MUTED[0] + (r - MUTED[0]) * t;
      const mixG = MUTED[1] + (g - MUTED[1]) * t;
      const mixB = MUTED[2] + (b - MUTED[2]) * t;
      const alpha = 0.10 + 0.55 * t + cl.jitter * 0.05;
      const size = (cell * 0.34) + t * cell * 0.16;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${mixR | 0}, ${mixG | 0}, ${mixB | 0}, ${alpha.toFixed(3)})`;
      ctx.arc(cl.x, cl.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!usingPointer) {
      idleT += 0.0032;
      target.x = w * 0.5 + Math.sin(idleT) * w * 0.32;
      target.y = h * 0.42 + Math.cos(idleT * 0.7) * h * 0.28;
    }
    focal.x += (target.x - focal.x) * 0.06;
    focal.y += (target.y - focal.y) * 0.06;
    draw();
    requestAnimationFrame(loop);
  }

  function onPointer(e) {
    const rect = holder.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    target.x = p.clientX - rect.left;
    target.y = p.clientY - rect.top;
    usingPointer = true;
    clearTimeout(onPointer._t);
    onPointer._t = setTimeout(() => { usingPointer = false; }, 2200);
  }

  buildGrid();
  window.addEventListener("resize", buildGrid);
  holder.addEventListener("mousemove", onPointer);
  holder.addEventListener("touchmove", onPointer, { passive: true });

  if (reduceMotion) {
    draw(); // single static frame, no animation loop, no ambient drift
  } else {
    requestAnimationFrame(loop);
  }
})();
