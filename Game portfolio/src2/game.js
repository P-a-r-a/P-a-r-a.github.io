/* ═══════════════════════════════════════════════════════════════
   game.js  —  2D Milestone Timeline Game
   A side-scrolling platformer where the player walks through
   milestones. Each checkpoint unlocks skill progress.
═══════════════════════════════════════════════════════════════ */

/* ─── MILESTONE DATA ─────────────────────────────────────────
   Each milestone has:
   · year, title, desc
   · skills: which skills improve and by how much (cumulative %)
   ─────────────────────────────────────────────────────────── */
const SKILLS_FINAL = {
  'HTML & CSS':      90,
  'JavaScript':      80,
  'Python':          75,
  'React':           70,
  'Git & GitHub':    85,
  'SQL':             65,
  'Problem Solving': 90,
  'Communication':   80,
};

const MILESTONES = [
  {
    year: '2020',
    title: 'Started the Journey',
    desc: 'Wrote your very first line of code. Built a simple HTML page and got completely hooked on how things work.',
    x: 900,
    skills: { 'HTML & CSS': 20, 'Problem Solving': 15 },
  },
  {
    year: '2021',
    title: 'First Real Project',
    desc: 'Built a full static website from scratch — HTML, CSS, a sprinkle of JS. Deployed it and shared the link proudly.',
    x: 1700,
    skills: { 'HTML & CSS': 55, 'JavaScript': 20, 'Git & GitHub': 25, 'Problem Solving': 35 },
  },
  {
    year: '2021',
    title: 'Started University',
    desc: 'Enrolled in Computer Science. Met like-minded people, got introduced to algorithms, data structures, and proper software thinking.',
    x: 2500,
    skills: { 'Python': 30, 'Problem Solving': 55, 'Communication': 30, 'SQL': 20 },
  },
  {
    year: '2022',
    title: 'Discovered Frontend Dev',
    desc: 'Fell in love with UI/UX. Spent weeks learning modern CSS, flexbox, grid, animations — and realised design matters as much as code.',
    x: 3300,
    skills: { 'HTML & CSS': 75, 'JavaScript': 45, 'Problem Solving': 65, 'Communication': 50 },
  },
  {
    year: '2022',
    title: 'First Open Source Contribution',
    desc: 'Submitted a pull request to an open-source repo. Navigated code reviews, learned Git properly, and felt part of something bigger.',
    x: 4100,
    skills: { 'Git & GitHub': 60, 'JavaScript': 55, 'Communication': 60, 'Problem Solving': 72 },
  },
  {
    year: '2023',
    title: 'Learned React & Backend',
    desc: 'Built a full-stack app using React + Node + MongoDB. Finally understood how the frontend and backend talk to each other.',
    x: 4900,
    skills: { 'React': 55, 'JavaScript': 68, 'SQL': 45, 'Git & GitHub': 75, 'Python': 55 },
  },
  {
    year: '2023',
    title: 'Internship',
    desc: 'Joined a real team. Shipped features, attended standups, got feedback on code, and grew more in 3 months than in the previous year.',
    x: 5700,
    skills: { 'React': 70, 'JavaScript': 80, 'Communication': 80, 'Git & GitHub': 85, 'SQL': 65, 'Problem Solving': 85 },
  },
  {
    year: '2024',
    title: 'Today',
    desc: 'Still learning. Still building. Still excited about what comes next. This portfolio is a snapshot of the journey so far.',
    x: 6500,
    skills: SKILLS_FINAL,
  },
];

/* ─── CANVAS SETUP ─────────────────────────────────────── */
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');
const GAME_H = 500;
const GAME_W = window.innerWidth;

canvas.width  = GAME_W;
canvas.height = GAME_H;

/* ─── WORLD CONSTANTS ──────────────────────────────────── */
const GROUND_Y   = GAME_H - 90;
const GRAVITY    = 0.55;
const JUMP_FORCE = -13;
const SPEED      = 4.5;
const WORLD_END  = MILESTONES[MILESTONES.length - 1].x + 500;

/* ─── GAME STATE ───────────────────────────────────────── */
const state = {
  camX: 0,
  cardOpen: false,
  skillsVisible: false,
  activeMilestoneIdx: -1,
  unlockedSkills: {},   // skill → current %
  milestonesDone: new Set(),
};

/* ─── PLAYER ───────────────────────────────────────────── */
const player = {
  x: 120, y: GROUND_Y,
  w: 24,  h: 32,
  vx: 0,  vy: 0,
  onGround: false,
  facing: 1,
  animFrame: 0,
  animTimer: 0,
};

/* ─── INPUT ────────────────────────────────────────────── */
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && !state.cardOpen) tryInteract();
  if ((e.key === 'Escape') && state.cardOpen) closeCard();
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

/* ─── HELPERS ──────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }

/* ─── MILESTONE CARD UI ────────────────────────────────── */
const card      = document.getElementById('milestone-card');
const mcClose   = document.getElementById('mc-close');
const skillsSidebar = document.getElementById('game-skills');

mcClose.addEventListener('click', closeCard);

function openCard(idx) {
  const m = MILESTONES[idx];
  state.cardOpen = true;
  state.activeMilestoneIdx = idx;

  document.getElementById('mc-year').textContent  = m.year;
  document.getElementById('mc-title').textContent = m.title;
  document.getElementById('mc-desc').textContent  = m.desc;

  // Update skill progress
  Object.assign(state.unlockedSkills, m.skills);
  renderMilestoneSkills(m.skills);
  updateSkillsSidebar();

  card.classList.add('visible');

  // Show skills sidebar on first interaction
  if (!state.skillsVisible) {
    state.skillsVisible = true;
    skillsSidebar.classList.add('visible');
  }
}

function closeCard() {
  state.cardOpen = false;
  card.classList.remove('visible');
}

function renderMilestoneSkills(skills) {
  const list = document.getElementById('mc-skills-list');
  list.innerHTML = '';
  Object.entries(skills).forEach(([name, pct]) => {
    list.innerHTML += `
      <div class="mc-skill">
        <div class="mc-skill-top">
          <span class="mc-skill-name">${name}</span>
          <span class="mc-skill-pct">${pct}%</span>
        </div>
        <div class="mc-bar"><div class="mc-fill" style="width:0" data-target="${pct}"></div></div>
      </div>`;
  });
  // Animate fills
  setTimeout(() => {
    list.querySelectorAll('.mc-fill').forEach(fill => {
      fill.style.width = fill.dataset.target + '%';
    });
  }, 80);
}

function updateSkillsSidebar() {
  const sidebar = document.getElementById('game-skills');
  sidebar.innerHTML = '<p class="gs-title">Skills Unlocked</p>';
  Object.entries(state.unlockedSkills).forEach(([name, pct]) => {
    const existing = sidebar.querySelector(`[data-name="${name}"]`);
    if (existing) {
      existing.querySelector('.gs-fill').style.width = pct + '%';
      existing.querySelector('.gs-pct').textContent  = pct + '%';
    } else {
      const el = document.createElement('div');
      el.className = 'gs-skill';
      el.dataset.name = name;
      el.innerHTML = `
        <div class="gs-top">
          <span class="gs-name">${name}</span>
          <span class="gs-pct">${pct}%</span>
        </div>
        <div class="gs-bar"><div class="gs-fill" style="width:0"></div></div>`;
      sidebar.appendChild(el);
      setTimeout(() => { el.querySelector('.gs-fill').style.width = pct + '%'; }, 60);
    }
  });
}

/* ─── INTERACTION ──────────────────────────────────────── */
function tryInteract() {
  const px = player.x + player.w / 2;
  MILESTONES.forEach((m, i) => {
    if (state.milestonesDone.has(i)) return;
    const mx = m.x - state.camX;
    if (Math.abs(px - (m.x - state.camX + 16)) < 80) {
      state.milestonesDone.add(i);
      openCard(i);
    }
  });
}

/* ─── DRAWING HELPERS ──────────────────────────────────── */
function drawBackground() {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_H);
  sky.addColorStop(0,   '#0e0e0e');
  sky.addColorStop(0.6, '#141414');
  sky.addColorStop(1,   '#1a1a1a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_W, GAME_H);

  // Stars (static, parallax offset)
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  const starPositions = [
    [80,40],[220,90],[400,30],[600,70],[800,20],[1050,60],[1300,35],
    [150,120],[350,150],[700,130],[900,100],[1100,140],[500,170]
  ];
  starPositions.forEach(([sx, sy]) => {
    const screenX = ((sx - state.camX * 0.2) % GAME_W + GAME_W) % GAME_W;
    ctx.beginPath();
    ctx.arc(screenX, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Ground
  const grd = ctx.createLinearGradient(0, GROUND_Y, 0, GAME_H);
  grd.addColorStop(0, '#1e1e1e');
  grd.addColorStop(1, '#111111');
  ctx.fillStyle = grd;
  ctx.fillRect(0, GROUND_Y + 4, GAME_W, GAME_H - GROUND_Y);

  // Ground line
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 4);
  ctx.lineTo(GAME_W, GROUND_Y + 4);
  ctx.stroke();

  // Grid lines on ground for depth
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const lineX = (i * 100 - (state.camX * 0.5 % 100) + 100) % GAME_W;
    ctx.beginPath();
    ctx.moveTo(lineX, GROUND_Y + 4);
    ctx.lineTo(lineX, GAME_H);
    ctx.stroke();
  }
}

function drawTimeline() {
  // Dashed timeline path on the ground
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(139,92,246,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 2);
  ctx.lineTo(GAME_W, GROUND_Y + 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawMilestones() {
  MILESTONES.forEach((m, i) => {
    const screenX = m.x - state.camX;
    if (screenX < -80 || screenX > GAME_W + 80) return;

    const done = state.milestonesDone.has(i);
    const nearPlayer = Math.abs((player.x + player.w / 2) - screenX) < 80;

    // Pole
    ctx.strokeStyle = done ? 'rgba(139,92,246,0.8)' : 'rgba(80,80,80,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX, GROUND_Y + 4);
    ctx.lineTo(screenX, GROUND_Y - 70);
    ctx.stroke();

    // Flag
    const flagColor = done ? '#8b5cf6' : '#333';
    ctx.fillStyle = flagColor;
    ctx.beginPath();
    ctx.moveTo(screenX, GROUND_Y - 70);
    ctx.lineTo(screenX + 32, GROUND_Y - 58);
    ctx.lineTo(screenX, GROUND_Y - 46);
    ctx.closePath();
    ctx.fill();

    // Glow ring when near and undone
    if (nearPlayer && !done) {
      ctx.strokeStyle = 'rgba(139,92,246,0.6)';
      ctx.lineWidth = 1.5;
      const pulse = Math.sin(Date.now() / 300) * 3;
      ctx.beginPath();
      ctx.arc(screenX, GROUND_Y - 10, 14 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // "Press E" hint
      ctx.fillStyle = 'rgba(139,92,246,0.9)';
      ctx.font = '500 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[E] Interact', screenX, GROUND_Y - 30);
    }

    // Year label
    ctx.fillStyle = done ? '#8b5cf6' : '#444';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m.year, screenX, GROUND_Y + 18);

    // Title below year
    ctx.fillStyle = done ? '#aaa' : '#333';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillText(m.title.length > 16 ? m.title.slice(0, 14) + '…' : m.title, screenX, GROUND_Y + 30);
  });

  ctx.textAlign = 'left';
}

function drawPlayer() {
  const { x, y, w, h, facing, onGround } = player;
  const screenX = x;

  // Body — simple geometric rectangle character
  const bodyColor = '#c4b5fd';   // light purple
  const headColor = '#ede9fe';
  const legColor  = '#7c3aed';

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(screenX + w / 2, y + h + 2, w * 0.6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (animated when moving)
  const legOffset = onGround && (keys['ArrowLeft'] || keys['a'] || keys['A'] || keys['ArrowRight'] || keys['d'] || keys['D'])
    ? Math.sin(Date.now() / 120) * 4 : 0;

  ctx.fillStyle = legColor;
  ctx.fillRect(screenX + 3,            y + h - 8, 7, 8);  // left leg
  ctx.fillRect(screenX + w - 10,       y + h - 8, 7, 8);  // right leg
  if (onGround) {
    ctx.fillRect(screenX + 3,           y + h - 8 + legOffset, 7, 8);
    ctx.fillRect(screenX + w - 10,      y + h - 8 - legOffset, 7, 8);
  }

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(screenX, y + 8, w, h - 14, 4);
  ctx.fill();

  // Head
  ctx.fillStyle = headColor;
  ctx.beginPath();
  ctx.roundRect(screenX + 2, y, w - 4, 12, 5);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1a1a2e';
  const eyeX = facing > 0 ? screenX + w - 8 : screenX + 4;
  ctx.fillRect(eyeX, y + 3, 4, 3);

  // Purple accent stripe on body
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(screenX + 4, y + 12, w - 8, 2);
}

function drawHUD() {
  // Progress indicator top-right
  const done  = state.milestonesDone.size;
  const total = MILESTONES.length;
  const pct   = done / total;

  ctx.fillStyle = 'rgba(28,28,28,0.75)';
  ctx.beginPath();
  ctx.roundRect(GAME_W - 180, 16, 160, 36, 8);
  ctx.fill();

  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.roundRect(GAME_W - 168, 28, 136, 4, 2);
  ctx.fill();

  if (pct > 0) {
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(GAME_W - 168, 28, 136 * pct, 4, 2);
    ctx.fill();
  }

  ctx.fillStyle = '#a0a0a0';
  ctx.font = '11px Outfit, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${done} / ${total} milestones`, GAME_W - 16, 24);
  ctx.textAlign = 'left';
}

/* ─── PHYSICS & UPDATE ─────────────────────────────────── */
function update() {
  if (state.cardOpen) return; // pause physics while card is open

  // Horizontal movement
  const left  = keys['ArrowLeft']  || keys['a'] || keys['A'];
  const right = keys['ArrowRight'] || keys['d'] || keys['D'];
  const jump  = keys['ArrowUp']    || keys['w'] || keys['W'];

  if (left)       { player.vx = -SPEED; player.facing = -1; }
  else if (right) { player.vx =  SPEED; player.facing =  1; }
  else            { player.vx = 0; }

  // Jump
  if (jump && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
  }

  // Gravity
  player.vy += GRAVITY;

  // Move
  player.x += player.vx;
  player.y += player.vy;

  // Ground collision
  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.onGround = true;
  }

  // World boundaries
  player.x = Math.max(0, Math.min(player.x, WORLD_END - player.w));

  // Camera follows player with some lead
  const targetCam = player.x - GAME_W * 0.35;
  state.camX = lerp(state.camX, Math.max(0, Math.min(targetCam, WORLD_END - GAME_W)), 0.1);
}

/* ─── MAIN LOOP ────────────────────────────────────────── */
function loop() {
  ctx.clearRect(0, 0, GAME_W, GAME_H);
  update();
  drawBackground();
  drawTimeline();
  drawMilestones();
  drawPlayer();
  drawHUD();
  requestAnimationFrame(loop);
}

/* ─── RESIZE ───────────────────────────────────────────── */
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
});

/* ─── BOOT ─────────────────────────────────────────────── */
// Build skills sidebar skeleton
(function buildSidebarSkeleton() {
  const sidebar = document.getElementById('game-skills');
  sidebar.innerHTML = '<p class="gs-title">Skills Unlocked</p><p style="font-size:0.75rem;color:#444;line-height:1.6">Interact with milestones<br>to unlock skills.</p>';
})();

loop();