function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

function varyColor(hex, rng, amount) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const vr = Math.min(255, Math.max(0, r + (rng() - 0.5) * amount));
  const vg = Math.min(255, Math.max(0, g + (rng() - 0.5) * amount));
  const vb = Math.min(255, Math.max(0, b + (rng() - 0.5) * amount));
  return `rgb(${Math.floor(vr)},${Math.floor(vg)},${Math.floor(vb)})`;
}

function generateThumbnail(course, canvas, forceNewSalt) {
  const ctx = canvas.getContext('2d');
  const W = 1280;
  const H = 720;

  canvas.width = W;
  canvas.height = H;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const salt = forceNewSalt ? Date.now() + Math.random() * 999999 : Date.now();
  const seed = course.id * 7919 + Math.floor(salt);
  const rng = seededRandom(seed);

  const variant = Math.floor(rng() * 8);
  const niche = course.niche;

  switch(niche) {
    case 'money': renderMoney(ctx, W, H, rng, variant); break;
    case 'communication': renderCommunication(ctx, W, H, rng, variant); break;
    case 'mental': renderMental(ctx, W, H, rng, variant); break;
    case 'productivity': renderProductivity(ctx, W, H, rng, variant); break;
    case 'career': renderCareer(ctx, W, H, rng, variant); break;
  }

  applyVignette(ctx, W, H);
  return canvas.toDataURL('image/png', 1.0);
}

function applyVignette(ctx, W, H) {
  const gradient = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

// ============ MONEY VARIANTS ============
function renderMoney(ctx, W, H, rng, v) {
  const p = { navy: '#0A1628', charcoal: '#1A1A2E', gold: '#D4AF37', red: '#8B0000', green: '#2ECC71', white: '#F5F5F0' };
  switch(v) {
    case 0: moneyScale(ctx, W, H, rng, p); break;
    case 1: moneyVault(ctx, W, H, rng, p); break;
    case 2: moneyMountain(ctx, W, H, rng, p); break;
    case 3: moneyChain(ctx, W, H, rng, p); break;
    case 4: moneyGrid(ctx, W, H, rng, p); break;
    case 5: moneyTree(ctx, W, H, rng, p); break;
    case 6: moneyCompass(ctx, W, H, rng, p); break;
    case 7: moneyHourglass(ctx, W, H, rng, p); break;
  }
}

function moneyScale(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0, p.navy); bg.addColorStop(1, p.charcoal);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H * 0.45;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 160, cy + 10); ctx.lineTo(cx + 160, cy + 10); ctx.stroke();

  const tilt = 0.3 + rng() * 0.15;
  ctx.save(); ctx.translate(cx - 100, cy + 10); ctx.rotate(tilt);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 60, 45, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,0,0,0.8)'; ctx.fill(); ctx.strokeStyle = p.red; ctx.stroke();
  ctx.restore();

  ctx.save(); ctx.translate(cx + 100, cy + 10); ctx.rotate(-tilt * 0.4);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 50); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 60, 45, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(212,175,55,0.25)'; ctx.fill(); ctx.strokeStyle = p.gold; ctx.stroke();
  ctx.restore();

  ctx.beginPath(); ctx.moveTo(cx - 180, H - 100); ctx.lineTo(cx + 180, H - 100);
  ctx.strokeStyle = p.white; ctx.lineWidth = 2; ctx.stroke();

  ctx.beginPath(); ctx.moveTo(cx - 180, H - 100);
  ctx.bezierCurveTo(cx - 90, H - 80, cx - 60, H - 130, cx, H - 160);
  ctx.bezierCurveTo(cx + 60, H - 190, cx + 120, H - 200, cx + 180, H - 180);
  ctx.strokeStyle = p.green; ctx.lineWidth = 3; ctx.stroke();

  const glow = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, 200);
  glow.addColorStop(0, 'rgba(212,175,55,0.15)'); glow.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
}

function moneyVault(ctx, W, H, rng, p) {
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);

  for(let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rng() * 0.04})`;
    ctx.fillRect(rng() * W, rng() * H, 1.5, 1.5);
  }

  const cx = W/2, cy = H/2, r = 200;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 3;
  for(let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.35, i * Math.PI/2, i * Math.PI/2 + Math.PI/4);
    ctx.stroke();
  }

  const lightGrad = ctx.createRadialGradient(cx - r * 0.5, cy, 0, cx - r * 0.5, cy, r * 1.5);
  lightGrad.addColorStop(0, '#FFFAE6'); lightGrad.addColorStop(0.4, '#D4AF37'); lightGrad.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.beginPath(); ctx.ellipse(cx - r * 0.5, cy, r * 0.8, r * 1.2, 0, -Math.PI/2, Math.PI/2);
  ctx.fillStyle = lightGrad; ctx.fill();

  for(let i = 0; i < 8; i++) {
    const a = i/8 * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6);
    ctx.lineTo(cx + Math.cos(a) * r * 1.8, cy + Math.sin(a) * r * 1.8);
    ctx.strokeStyle = `rgba(212,175,55,${0.08 + rng() * 0.06})`; ctx.lineWidth = 2; ctx.stroke();
  }

  [[50, 50], [W - 70, 50], [50, H - 70], [W - 70, H - 70]].forEach(([dx, dy]) => {
    ctx.save(); ctx.translate(dx, dy); ctx.rotate(Math.PI/4);
    ctx.fillStyle = p.gold; ctx.fillRect(-9, -9, 18, 18); ctx.restore();
  });
}

function moneyMountain(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, p.navy); bg.addColorStop(1, '#050D14');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  for(let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rng() * 0.4})`;
    ctx.beginPath(); ctx.arc(rng() * W, rng() * H * 0.4, 0.8, 0, Math.PI * 2); ctx.fill();
  }

  const baseY = H * 0.78;
  const peaks = [
    { x: W * 0.25, h: 140 + rng() * 40, c: p.red },
    { x: W * 0.5, h: 230 + rng() * 60, c: p.gold },
    { x: W * 0.75, h: 170 + rng() * 50, c: '#C0C8D8' }
  ];
  peaks.forEach(pk => {
    ctx.beginPath(); ctx.moveTo(pk.x - 130, baseY); ctx.lineTo(pk.x, baseY - pk.h); ctx.lineTo(pk.x + 130, baseY); ctx.closePath();
    const g = ctx.createLinearGradient(pk.x, baseY - pk.h, pk.x, baseY);
    g.addColorStop(0, pk.c); g.addColorStop(1, '#050D14');
    ctx.fillStyle = g; ctx.fill();
  });

  const top = peaks[1];
  ctx.beginPath(); ctx.arc(top.x, baseY - top.h - 18, 10, 0, Math.PI * 2); ctx.fillStyle = p.gold; ctx.fill();
  const starGlow = ctx.createRadialGradient(top.x, baseY - top.h - 18, 0, top.x, baseY - top.h - 18, 50);
  starGlow.addColorStop(0, 'rgba(212,175,55,0.6)'); starGlow.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = starGlow; ctx.beginPath(); ctx.arc(top.x, baseY - top.h - 18, 50, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = p.gold; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(60, H - 160); ctx.lineTo(60, H - 90); ctx.stroke();
  for(let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(55, H - 160 + i * 14); ctx.lineTo(65, H - 160 + i * 14); ctx.stroke(); }
}

function moneyChain(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0D0D0D'); bg.addColorStop(1, '#1A0A00');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const cy = H/2, linkW = 55, linkH = 85;

  for(let i = 0; i < 4; i++) {
    const lx = 180 + i * 80;
    ctx.beginPath(); ctx.ellipse(lx, cy, linkW, linkH, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 10; ctx.stroke();
  }

  const bx = 180 + 4 * 80;
  ctx.save(); ctx.rotate(-0.25); ctx.beginPath(); ctx.ellipse(bx - 35, cy, linkW, linkH, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#777'; ctx.lineWidth = 10; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.rotate(0.25); ctx.beginPath(); ctx.ellipse(bx + 35, cy, linkW, linkH, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#777'; ctx.lineWidth = 10; ctx.stroke(); ctx.restore();

  for(let i = 0; i < 10; i++) {
    const ang = rng() * Math.PI * 2, dist = 25 + rng() * 50;
    ctx.beginPath(); ctx.arc(bx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, 3 + rng() * 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${0.6 + rng() * 0.4})`; ctx.fill();
  }

  const rightGlow = ctx.createRadialGradient(W * 0.8, cy, 0, W * 0.8, cy, 250);
  rightGlow.addColorStop(0, 'rgba(212,175,55,0.2)'); rightGlow.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.fillStyle = rightGlow; ctx.fillRect(0, 0, W, H);

  const leftGlow = ctx.createRadialGradient(W * 0.2, cy, 0, W * 0.2, cy, 200);
  leftGlow.addColorStop(0, 'rgba(139,0,0,0.25)'); leftGlow.addColorStop(1, 'rgba(139,0,0,0)');
  ctx.fillStyle = leftGlow; ctx.fillRect(0, 0, W, H);
}

function moneyGrid(ctx, W, H, rng, p) {
  ctx.fillStyle = p.navy; ctx.fillRect(0, 0, W, H);

  ctx.save(); ctx.translate(W/2, H * 0.7);
  ctx.strokeStyle = 'rgba(212,175,55,0.2)'; ctx.lineWidth = 1;
  for(let i = -30; i <= 30; i++) {
    ctx.beginPath(); ctx.moveTo(i * 30, 0); ctx.lineTo(i * 8, -H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-W, i * 15 - H * 0.3); ctx.lineTo(W, i * 15 - H * 0.3); ctx.stroke();
  }
  ctx.restore();

  ctx.save(); ctx.translate(W/2, H * 0.6);
  ctx.beginPath(); ctx.moveTo(-50, 100); ctx.lineTo(0, -80); ctx.lineTo(50, 100); ctx.closePath();
  const arrGrad = ctx.createLinearGradient(0, 100, 0, -80);
  arrGrad.addColorStop(0, p.red); arrGrad.addColorStop(1, p.gold);
  ctx.fillStyle = arrGrad; ctx.fill();
  ctx.strokeStyle = p.gold; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(212,175,55,0.1)';
  ctx.beginPath(); ctx.arc(W/2, H * 0.5, 300, 0, Math.PI * 2); ctx.fill();
}

function moneyTree(ctx, W, H, rng, p) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
  skyGrad.addColorStop(0, p.navy); skyGrad.addColorStop(0.65, p.charcoal);
  skyGrad.addColorStop(0.65, '#1A0800'); skyGrad.addColorStop(1, '#0A0400');
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H);

  const groundY = H * 0.65;
  ctx.strokeStyle = 'rgba(139,69,19,0.5)'; ctx.lineWidth = 1;
  for(let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(0, groundY + i * 4); ctx.lineTo(W, groundY + i * 4 + rng() * 3); ctx.stroke(); }

  const tx = W/2, ty = groundY;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 180); ctx.stroke();

  const branches = [
    { ang: -Math.PI/2 - 0.6, len: 100 }, { ang: -Math.PI/2 - 0.3, len: 120 },
    { ang: -Math.PI/2, len: 130 }, { ang: -Math.PI/2 + 0.3, len: 120 }, { ang: -Math.PI/2 + 0.6, len: 100 }
  ];
  branches.forEach(b => {
    ctx.beginPath(); ctx.moveTo(tx, ty - 150); ctx.lineTo(tx + Math.cos(b.ang) * b.len, ty - 150 + Math.sin(b.ang) * b.len); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx + Math.cos(b.ang) * b.len, ty - 150 + Math.sin(b.ang) * b.len, 10, 0, Math.PI * 2); ctx.fillStyle = p.gold; ctx.fill();
  });

  const roots = [
    { ang: Math.PI/2 - 0.5, len: 80 }, { ang: Math.PI/2, len: 100 }, { ang: Math.PI/2 + 0.5, len: 80 }
  ];
  ctx.strokeStyle = 'rgba(139,69,19,0.8)';
  roots.forEach(r => {
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.cos(r.ang) * r.len, ty + Math.sin(r.ang) * r.len); ctx.stroke();
  });
}

function moneyCompass(ctx, W, H, rng, p) {
  ctx.fillStyle = '#080C14'; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H/2, r = 180;

  ctx.setLineDash([8, 8]); ctx.strokeStyle = p.gold; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]); ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.stroke();

  for(let i = 0; i < 8; i++) {
    const ang = i * Math.PI/4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r * 0.3, cy + Math.sin(ang) * r * 0.3);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.85, cy + Math.sin(ang) * r * 0.85);
    ctx.strokeStyle = i === 0 ? p.gold : '#C0C8D8';
    ctx.lineWidth = i === 0 ? 5 : 2; ctx.stroke();
  }

  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI/2);
  ctx.beginPath(); ctx.moveTo(0, -r * 0.25); ctx.lineTo(r * 0.08, 0); ctx.lineTo(0, r * 0.7); ctx.lineTo(-r * 0.08, 0); ctx.closePath();
  ctx.fillStyle = p.gold; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, r * 0.25); ctx.lineTo(r * 0.08, 0); ctx.lineTo(0, -r * 0.7); ctx.lineTo(-r * 0.08, 0); ctx.closePath();
  ctx.fillStyle = '#C0C8D8'; ctx.fill();
  ctx.restore();

  [[80, 100], [W - 100, 80], [90, H - 110], [W - 110, H - 100]].forEach(([x, y]) => {
    ctx.strokeStyle = 'rgba(212,175,55,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y + 20); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 45, y + 25, 5, 0, Math.PI * 2); ctx.stroke();
  });
}

function moneyHourglass(ctx, W, H, rng, p) {
  const leftGrad = ctx.createLinearGradient(0, 0, W/2, 0);
  leftGrad.addColorStop(0, '#200000'); leftGrad.addColorStop(1, '#100000');
  ctx.fillStyle = leftGrad; ctx.fillRect(0, 0, W/2, H);
  const rightGrad = ctx.createLinearGradient(W/2, 0, W, 0);
  rightGrad.addColorStop(0, '#001000'); rightGrad.addColorStop(1, '#002000');
  ctx.fillStyle = rightGrad; ctx.fillRect(W/2, 0, W/2, H);

  const cx = W/2, cy = H/2, topY = 140, botY = H - 140, waistY = cy;

  ctx.strokeStyle = p.gold; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(cx - 80, topY); ctx.lineTo(cx - 15, waistY); ctx.lineTo(cx + 80, botY);
  ctx.moveTo(cx + 80, topY); ctx.lineTo(cx + 15, waistY); ctx.lineTo(cx - 80, botY);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 100, topY); ctx.lineTo(cx + 100, topY);
  ctx.moveTo(cx - 100, botY); ctx.lineTo(cx + 100, botY);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,235,180,0.6)';
  ctx.beginPath(); ctx.moveTo(cx - 75, topY + 10); ctx.lineTo(cx - 18, waistY - 10); ctx.lineTo(cx + 75, topY + 10); ctx.closePath(); ctx.fill();

  ctx.beginPath(); ctx.moveTo(cx - 70, botY - 20); ctx.lineTo(cx - 20, waistY + 10); ctx.lineTo(cx + 70, botY - 20);
  ctx.lineTo(cx + 20, waistY + 10); ctx.closePath(); ctx.fill();

  for(let i = 0; i < 15; i++) {
    const sx = cx - 10 + rng() * 20;
    ctx.beginPath(); ctx.arc(sx, waistY + 30 + rng() * 60, 2 + rng() * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${0.4 + rng() * 0.6})`; ctx.fill();
  }

  ctx.strokeStyle = p.gold; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 20, waistY); ctx.lineTo(cx + 20, waistY); ctx.stroke();
}

// ============ COMMUNICATION VARIANTS ============
function renderCommunication(ctx, W, H, rng, v) {
  const p = { brown: '#1A0A00', amber: '#2D1B00', orange: '#E8651A', gold: '#F5A623', cream: '#FFF8F0' };
  switch(v) {
    case 0: commSoundWave(ctx, W, H, rng, p); break;
    case 1: commBridge(ctx, W, H, rng, p); break;
    case 2: commOrbit(ctx, W, H, rng, p); break;
    case 3: commRipple(ctx, W, H, rng, p); break;
    case 4: commKnot(ctx, W, H, rng, p); break;
    case 5: commFrequency(ctx, W, H, rng, p); break;
    case 6: commMirror(ctx, W, H, rng, p); break;
    case 7: commWeb(ctx, W, H, rng, p); break;
  }
}

function commSoundWave(ctx, W, H, rng, p) {
  ctx.fillStyle = p.brown; ctx.fillRect(0, 0, W, H);
  const cx = W * 0.35, cy = H/2;
  for(let i = 5; i >= 1; i--) {
    ctx.globalAlpha = 0.15 + (5-i) * 0.15;
    ctx.beginPath(); ctx.arc(cx, cy, i * 60, -Math.PI/2.5, Math.PI/2.5);
    ctx.strokeStyle = p.orange; ctx.lineWidth = 4 - i * 0.5; ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fillStyle = p.orange; ctx.fill();
}

function commBridge(ctx, W, H, rng, p) {
  ctx.fillStyle = '#0D0D0D'; ctx.fillRect(0, 0, W, H);
  const y = H * 0.55;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(100, y - 120); ctx.lineTo(100, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 100, y - 120); ctx.lineTo(W - 100, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(120, y); ctx.lineTo(W - 120, y); ctx.stroke();
  for(let i = 0; i < 12; i++) {
    const x = 120 + i * (W - 240) / 11;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (i < 6 ? 100 : -100) * (i % 2 === 0 ? 1 : -1), y - 120);
    ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = 'rgba(245,166,35,0.1)'; ctx.fillRect(100, y, W - 200, 60);
}

function commOrbit(ctx, W, H, rng, p) {
  ctx.fillStyle = '#050510'; ctx.fillRect(0, 0, W, H);
  const left = { x: W * 0.25, y: H/2 }, right = { x: W * 0.75, y: H/2 };

  ctx.beginPath(); ctx.arc(left.x, left.y, 60, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(232,101,26,0.2)'; ctx.fill(); ctx.strokeStyle = p.orange; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(left.x, left.y - 50, 12, 0, Math.PI * 2); ctx.arc(left.x, left.y + 20, 4, 0, Math.PI * 2);
  ctx.fillStyle = p.cream; ctx.fill();

  ctx.beginPath(); ctx.arc(right.x, right.y, 80, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245,166,35,0.15)'; ctx.fill(); ctx.strokeStyle = p.gold; ctx.stroke();
  [[0, -40], [-30, 30], [30, 30], [-50, 60], [50, 60]].forEach(([ox, oy]) => {
    ctx.beginPath(); ctx.arc(right.x + ox, right.y + oy, 10, 0, Math.PI * 2); ctx.fillStyle = p.cream; ctx.fill();
  });

  ctx.strokeStyle = 'rgba(245,166,35,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(W/2, H/2, W * 0.3, H * 0.15, 0, 0, Math.PI * 2); ctx.stroke();

  for(let i = 0; i < 5; i++) {
    const t = i / 4, x = left.x + (right.x - left.x) * (0.5 + 0.5 * Math.cos(Math.PI + t * Math.PI)), y = H/2 + H * 0.12 * Math.sin(Math.PI + t * Math.PI);
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = p.orange; ctx.fill();
  }
}

function commRipple(ctx, W, H, rng, p) {
  ctx.fillStyle = '#001A1A'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H * 0.55;

  for(let i = 5; i >= 1; i--) {
    ctx.beginPath(); ctx.arc(cx, cy, i * 80, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(232,101,26,${0.25 - i * 0.04})`; ctx.lineWidth = 3; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fillStyle = p.gold; ctx.fill();

  ctx.beginPath(); ctx.moveTo(0, H * 0.85); ctx.lineTo(W, H * 0.85);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.stroke();
}

function commKnot(ctx, W, H, rng, p) {
  ctx.fillStyle = '#150800'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2;

  ctx.strokeStyle = p.gold; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(cx - 150, cy); ctx.bezierCurveTo(cx - 150, cy - 100, cx - 50, cy - 100, cx, cy);
  ctx.bezierCurveTo(cx + 50, cy + 100, cx + 150, cy + 100, cx + 150, cy);
  ctx.bezierCurveTo(cx + 150, cy - 100, cx + 50, cy - 100, cx, cy);
  ctx.bezierCurveTo(cx - 50, cy + 100, cx - 150, cy + 100, cx - 150, cy);
  ctx.stroke();

  ctx.strokeStyle = p.orange; ctx.lineWidth = 8;
  ctx.stroke();

  ctx.lineWidth = 3; ctx.strokeStyle = '#884400';
  ctx.beginPath(); ctx.moveTo(cx - 155, cy + 50); ctx.lineTo(cx - 200, cy + 100);
  for(let i = 0; i < 4; i++) { ctx.moveTo(cx - 200 + i * 12, cy + 100 + rng() * 8); ctx.lineTo(cx - 200 + i * 12 + 8, cy + 108 + rng() * 8); } ctx.stroke();
}

function commFrequency(ctx, W, H, rng, p) {
  ctx.fillStyle = '#0A0A14'; ctx.fillRect(0, 0, W, H);
  const barCount = 40, barW = W / barCount - 4, baseY = H * 0.75;

  for(let i = 0; i < barCount; i++) {
    const x = i * (barW + 4) + 2;
    let h;
    if(i < barCount * 0.35) h = 20 + rng() * 150;
    else if(i < barCount * 0.65) h = 50 + rng() * 80;
    else h = 60 + Math.sin((i / barCount) * Math.PI * 3) * 60 + 40;

    ctx.fillStyle = i < barCount * 0.35 ? `rgba(100,100,100,${0.3 + rng() * 0.2})` : p.orange;
    ctx.fillRect(x, baseY - h, barW, h);
  }
}

function commMirror(ctx, W, H, rng, p) {
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W/2, H);
  ctx.fillStyle = '#1A1000'; ctx.fillRect(W/2, 0, W/2, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();

  const drawProfile = (x, facing) => {
    ctx.fillStyle = p.cream;
    ctx.beginPath(); ctx.arc(x, H * 0.4, 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + (facing > 0 ? -50 : 50), H * 0.4 + 50);
    ctx.lineTo(x + (facing > 0 ? -70 : 70), H * 0.7); ctx.lineTo(x + (facing > 0 ? -30 : 30), H * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = p.brown;
    ctx.beginPath(); ctx.arc(x + (facing > 0 ? -15 : 15), H * 0.38, 8, 0, Math.PI * 2); ctx.fill();
  };
  drawProfile(W * 0.35, 1); drawProfile(W * 0.65, -1);

  const midGlow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 150);
  midGlow.addColorStop(0, 'rgba(245,166,35,0.4)'); midGlow.addColorStop(1, 'rgba(245,166,35,0)');
  ctx.fillStyle = midGlow; ctx.fillRect(0, 0, W, H);
}

function commWeb(ctx, W, H, rng, p) {
  ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, W, H);

  const nodes = [];
  for(let i = 0; i < 18; i++) {
    nodes.push({ x: 100 + rng() * (W - 200), y: 100 + rng() * (H - 200), bright: rng() > 0.7 });
  }
  nodes[0].x = W * 0.1; nodes[0].y = H/2; nodes[0].bright = true;
  nodes[1].x = W * 0.9; nodes[1].y = H/2; nodes[1].bright = true;
  nodes[2].x = W/2; nodes[2].y = H/2; nodes[2].bright = true;

  nodes.forEach((n, i) => {
    nodes.slice(i + 1).forEach(m => {
      const d = Math.hypot(n.x - m.x, n.y - m.y);
      if(d < 300) {
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = n.bright && m.bright ? p.gold : 'rgba(200,200,200,0.15)'; ctx.lineWidth = n.bright && m.bright ? 2 : 1; ctx.stroke();
      }
    });
  });
  nodes.forEach(n => {
    ctx.beginPath(); ctx.arc(n.x, n.y, n.bright ? 10 : 4, 0, Math.PI * 2);
    ctx.fillStyle = n.bright ? p.gold : '#666'; ctx.fill();
  });
}

// ============ MENTAL VARIANTS ============
function renderMental(ctx, W, H, rng, v) {
  const p = { darkGreen: '#020D0A', forest: '#051A12', sage: '#4A9B7F', mint: '#7EC8B0', lavender: '#9B89C4', white: '#F0FFF8' };
  switch(v) {
    case 0: mentalStorm(ctx, W, H, rng, p); break;
    case 1: mentalBloom(ctx, W, H, rng, p); break;
    case 2: mentalBrainWaves(ctx, W, H, rng, p); break;
    case 3: mentalLabyrinth(ctx, W, H, rng, p); break;
    case 4: mentalTide(ctx, W, H, rng, p); break;
    case 5: mentalRootsSky(ctx, W, H, rng, p); break;
    case 6: mentalChrysalis(ctx, W, H, rng, p); break;
    case 7: mentalConstellation(ctx, W, H, rng, p); break;
  }
}

function mentalStorm(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0, '#1A1028'); bg.addColorStop(0.45, '#1A1028'); bg.addColorStop(0.55, p.darkGreen); bg.addColorStop(1, p.darkGreen);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = p.lavender; ctx.lineWidth = 2;
  for(let i = 0; i < 20; i++) {
    const x = rng() * W * 0.45, y = rng() * H, len = 30 + rng() * 80, ang = rng() * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); ctx.stroke();
  }

  ctx.strokeStyle = p.sage; ctx.lineWidth = 2;
  for(let i = 0; i < 12; i++) {
    const yOff = H * 0.2 + i * H * 0.05;
    ctx.beginPath(); ctx.moveTo(W * 0.55, yOff);
    for(let x = W * 0.55; x < W; x += 20) ctx.lineTo(x, yOff + Math.sin((x - W * 0.55) * 0.05) * 8); ctx.stroke();
  }

  ctx.beginPath(); ctx.arc(W * 0.85, H * 0.15, 25, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = 'rgba(155,137,196,0.6)'; ctx.lineWidth = 4; ctx.stroke();
}

function mentalBloom(ctx, W, H, rng, p) {
  ctx.fillStyle = p.forest; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2, colors = [p.sage, p.mint, p.lavender, p.white];

  for(let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 - Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * 120, cy + Math.sin(ang) * 120);
    ctx.lineTo(cx + Math.cos(ang + Math.PI/5) * 50, cy + Math.sin(ang + Math.PI/5) * 50); ctx.closePath();
    ctx.fillStyle = colors[i % 4]; ctx.fill(); ctx.strokeStyle = p.white; ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fillStyle = p.mint; ctx.fill();

  for(let i = 0; i < 12; i++) {
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(i * Math.PI/6) * 400, cy + Math.sin(i * Math.PI/6) * 400);
    ctx.strokeStyle = 'rgba(126,200,176,0.1)'; ctx.stroke();
  }
}

function mentalBrainWaves(ctx, W, H, rng, p) {
  ctx.fillStyle = '#030810'; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = p.lavender; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H * 0.35);
  for(let x = 0; x < W; x += 10) ctx.lineTo(x, H * 0.35 + (rng() - 0.5) * 40 + Math.sin(x * 0.08) * 15);
  ctx.stroke();

  ctx.strokeStyle = p.sage; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, H * 0.65);
  for(let x = 0; x < W; x += 5) ctx.lineTo(x, H * 0.65 + Math.sin(x * 0.02) * 20);
  ctx.stroke();

  const midGrad = ctx.createLinearGradient(0, H * 0.35, 0, H * 0.65);
  midGrad.addColorStop(0, 'rgba(155,137,196,0.15)'); midGrad.addColorStop(1, 'rgba(74,155,127,0.15)');
  ctx.fillStyle = midGrad; ctx.fillRect(0, H * 0.35, W, H * 0.3);
}

function mentalLabyrinth(ctx, W, H, rng, p) {
  ctx.fillStyle = '#020A08'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2;

  for(let ring = 5; ring >= 1; ring--) {
    ctx.strokeStyle = p.sage; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, ring * 50, 0, Math.PI * 1.8); ctx.stroke();
    if(ring < 5) { ctx.beginPath(); ctx.moveTo(cx + ring * 50, cy); ctx.lineTo(cx + (ring + 1) * 50, cy); ctx.stroke(); }
  }
  ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fillStyle = p.mint; ctx.fill();

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  glow.addColorStop(0, 'rgba(126,200,176,0.5)'); glow.addColorStop(1, 'rgba(126,200,176,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.fill();
}

function mentalTide(ctx, W, H, rng, p) {
  ctx.fillStyle = '#001A1A'; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = p.forest;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H * 0.6);
  for(let x = 0; x <= W; x += 30) ctx.lineTo(x, H * 0.6 + Math.sin(x * 0.015) * 25 + Math.sin(x * 0.04) * 12);
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  for(let i = 0; i < 4; i++) {
    ctx.fillStyle = `rgba(126,200,176,${0.05 - i * 0.01})`;
    ctx.fillRect(0, H * 0.15 + i * 25, W, 20);
  }

  for(let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(rng() * W, rng() * H * 0.3, 1.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill(); }
}

function mentalRootsSky(ctx, W, H, rng, p) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.6);
  skyGrad.addColorStop(0, '#020D14'); skyGrad.addColorStop(1, p.darkGreen);
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H * 0.6);
  ctx.fillStyle = '#0A0800'; ctx.fillRect(0, H * 0.6, W, H * 0.4);

  const cx = W/2, groundY = H * 0.6;
  ctx.strokeStyle = 'rgba(139,69,19,0.7)'; ctx.lineWidth = 4;
  [[0.7, 70], [0.8, 50], [0.9, 60]].forEach(([ang, len]) => {
    ctx.beginPath(); ctx.moveTo(cx, groundY); ctx.lineTo(cx + Math.cos(ang) * len, groundY + Math.sin(ang) * len); ctx.stroke();
  });

  ctx.strokeStyle = p.sage; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, groundY - 30); ctx.lineTo(cx, groundY - 180); ctx.stroke();
  [[150, 80], [150, -80], [120, 40], [120, -40]].forEach(([h, ang]) => {
    ctx.beginPath(); ctx.moveTo(cx, groundY - h); ctx.lineTo(cx + Math.sin(ang * Math.PI/180) * 60, groundY - h + Math.cos(ang * Math.PI/180) * 60); ctx.stroke();
  });

  const bodyGrad = ctx.createLinearGradient(cx, groundY - 180, cx, groundY + 30);
  bodyGrad.addColorStop(0, '#020D14'); bodyGrad.addColorStop(1, '#0A0800');
  ctx.fillStyle = bodyGrad; ctx.beginPath(); ctx.ellipse(cx, groundY - 90, 35, 100, 0, 0, Math.PI * 2); ctx.fill();
}

function mentalChrysalis(ctx, W, H, rng, p) {
  ctx.fillStyle = '#0A0010'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2;

  ctx.fillStyle = '#1A0030'; ctx.beginPath(); ctx.ellipse(cx, cy, 80, 160, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = p.lavender; ctx.lineWidth = 3; ctx.stroke();

  const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
  innerGlow.addColorStop(0, p.mint); innerGlow.addColorStop(0.5, 'rgba(126,200,176,0.3)'); innerGlow.addColorStop(1, 'rgba(126,200,176,0)');
  ctx.fillStyle = innerGlow; ctx.beginPath(); ctx.ellipse(cx - 20, cy - 20, 40, 80, 0.3, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = p.mint; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 60, cy - 80); ctx.lineTo(cx + 80, cy + 20); ctx.moveTo(cx + 55, cy - 60); ctx.lineTo(cx + 70, cy + 40); ctx.stroke();
}

function mentalConstellation(ctx, W, H, rng, p) {
  ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, W, H);

  for(let i = 0; i < 50; i++) {
    ctx.beginPath(); ctx.arc(rng() * W, rng() * H, 0.8 + rng() * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.4})`; ctx.fill();
  }

  const figure = [[0.5, 0.25], [0.45, 0.4], [0.55, 0.4], [0.48, 0.55], [0.52, 0.55], [0.42, 0.7], [0.58, 0.7], [0.5, 0.85]];
  figure.forEach(([fx, fy], i) => {
    const x = W * fx + rng() * 20, y = H * fy + rng() * 15;
    ctx.beginPath(); ctx.arc(x, y, i === 0 ? 10 : 5, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? p.white : p.sage; ctx.fill();
    if(i > 0) {
      const px = W * figure[figure.findIndex(f => f[0] === fx && f[1] === fy) - 1]?.[0] || x;
      const py = H * figure[figure.findIndex(f => f[0] === fx && f[1] === fy) - 1]?.[1] || y;
    }
  });

  const chestX = W * 0.5, chestY = H * 0.45;
  ctx.beginPath(); ctx.arc(chestX, chestY, 12, 0, Math.PI * 2); ctx.fillStyle = '#FFFAE6'; ctx.fill();
  const chestGlow = ctx.createRadialGradient(chestX, chestY, 0, chestX, chestY, 40);
  chestGlow.addColorStop(0, 'rgba(255,250,230,0.6)'); chestGlow.addColorStop(1, 'rgba(255,250,230,0)');
  ctx.fillStyle = chestGlow; ctx.beginPath(); ctx.arc(chestX, chestY, 40, 0, Math.PI * 2); ctx.fill();
}

// ============ PRODUCTIVITY VARIANTS ============
function renderProductivity(ctx, W, H, rng, v) {
  const p = { navy: '#050A14', blue: '#0A1428', electric: '#0066FF', cyan: '#00CCFF', grey: '#8899AA', white: '#F0F4FF' };
  switch(v) {
    case 0: prodGrid(ctx, W, H, rng, p); break;
    case 1: prodLaser(ctx, W, H, rng, p); break;
    case 2: prodCircuit(ctx, W, H, rng, p); break;
    case 3: prodRocket(ctx, W, H, rng, p); break;
    case 4: prodDigitalHourglass(ctx, W, H, rng, p); break;
    case 5: prodChess(ctx, W, H, rng, p); break;
    case 6: prodAtom(ctx, W, H, rng, p); break;
    case 7: prodDashboard(ctx, W, H, rng, p); break;
  }
}

function prodGrid(ctx, W, H, rng, p) {
  ctx.fillStyle = p.navy; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(0,102,255,0.2)'; ctx.lineWidth = 1;
  ctx.save(); ctx.translate(W/2, H * 0.75);
  for(let i = -25; i <= 25; i++) {
    ctx.beginPath(); ctx.moveTo(i * 25, 0); ctx.lineTo(i * 6, -H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-W, i * 12 - H * 0.25); ctx.lineTo(W, i * 12 - H * 0.25); ctx.stroke();
  }
  ctx.restore();

  [[W * 0.3, H * 0.55, 40, 60, 'rgba(0,204,255,0.4)'], [W * 0.5, H * 0.45, 50, 80, p.cyan], [W * 0.7, H * 0.6, 35, 50, 'rgba(136,153,170,0.5)']].forEach(([x, y, w, h, c]) => {
    ctx.fillStyle = c; ctx.fillRect(x - w/2, y - h/2, w, h);
    ctx.strokeStyle = p.electric; ctx.lineWidth = 1; ctx.strokeRect(x - w/2, y - h/2, w, h);
  });

  ctx.beginPath(); ctx.arc(W * 0.82, H * 0.18, 30, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,204,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
  for(let i = 0; i < 12; i++) { const a = i * Math.PI/6; ctx.beginPath(); ctx.moveTo(W * 0.82 + Math.cos(a) * 25, H * 0.18 + Math.sin(a) * 25); ctx.lineTo(W * 0.82 + Math.cos(a) * 30, H * 0.18 + Math.sin(a) * 30); ctx.stroke(); }
}

function prodLaser(ctx, W, H, rng, p) {
  ctx.fillStyle = '#030308'; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H/2;
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
  outerGlow.addColorStop(0, 'rgba(0,204,255,0.15)');
  outerGlow.addColorStop(0.15, 'rgba(0,204,255,0.02)');
  outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = outerGlow; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = p.cyan; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();
  const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  coreGlow.addColorStop(0, 'rgba(0,204,255,0.8)'); coreGlow.addColorStop(1, 'rgba(0,204,255,0)');
  ctx.fillStyle = coreGlow; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = p.electric; ctx.lineWidth = 80;
  ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(136,153,170,0.2)';
  ctx.beginPath(); ctx.arc(W * 0.2, H * 0.3, 30, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W * 0.8, H * 0.7, 25, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W * 0.15, H * 0.65, 20, 0, Math.PI * 2); ctx.fill();
}

function prodCircuit(ctx, W, H, rng, p) {
  ctx.fillStyle = p.navy; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(0,102,255,0.3)'; ctx.lineWidth = 2;
  for(let y = 80; y < H; y += 80) {
    for(let x = 80; x < W; x += 80) {
      ctx.beginPath(); ctx.rect(x - 3, y - 3, 6, 6); ctx.fillStyle = p.electric; ctx.fill();
      if(x + 80 < W) { ctx.beginPath(); ctx.moveTo(x + 3, y); ctx.lineTo(x + 77, y); ctx.stroke(); }
      if(y + 80 < H) { ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x, y + 77); ctx.stroke(); }
    }
  }

  ctx.strokeStyle = p.cyan; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(160, 160);
  ctx.lineTo(160, 320); ctx.lineTo(320, 320); ctx.lineTo(320, 480); ctx.lineTo(480, 480);
  ctx.lineTo(480, 320); ctx.lineTo(640, 320); ctx.lineTo(640, 160); ctx.lineTo(800, 160); ctx.stroke();

  ctx.beginPath(); ctx.arc(W * 0.85, H * 0.85, 40, 0, Math.PI * 2);
  ctx.strokeStyle = p.cyan; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = 'rgba(0,204,255,0.2)'; ctx.fill();
}

function prodRocket(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#010108'); bg.addColorStop(1, '#020208');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  for(let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(rng() * W, rng() * H, 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.4})`; ctx.fill(); }

  ctx.save(); ctx.translate(W * 0.35, H * 0.55); ctx.rotate(-0.6);
  ctx.fillStyle = p.white; ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(25, 40); ctx.lineTo(-25, 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.electric; ctx.beginPath(); ctx.moveTo(-12, 40); ctx.lineTo(0, 100); ctx.lineTo(12, 40); ctx.closePath(); ctx.fill();
  ctx.restore();

  const trailGrad = ctx.createLinearGradient(W * 0.35, H * 0.55, W * 0.6, H * 0.75);
  trailGrad.addColorStop(0, 'rgba(0,204,255,0.8)'); trailGrad.addColorStop(1, 'rgba(0,204,255,0)');
  ctx.strokeStyle = trailGrad; ctx.lineWidth = 20;
  ctx.beginPath(); ctx.moveTo(W * 0.35, H * 0.55); ctx.lineTo(W * 0.6, H * 0.75); ctx.stroke();

  for(let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(W * 0.38 + i * 15, H * 0.45); ctx.lineTo(W * 0.35 + i * 18, H * 0.3); ctx.strokeStyle = `rgba(0,204,255,${0.3 - i * 0.03})`; ctx.lineWidth = 1; ctx.stroke(); }
}

function prodDigitalHourglass(ctx, W, H, rng, p) {
  ctx.fillStyle = p.navy; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H/2;
  ctx.strokeStyle = p.cyan; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 100, cy - 180); ctx.lineTo(cx - 20, cy); ctx.lineTo(cx + 100, cy - 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 100, cy + 180); ctx.lineTo(cx + 20, cy); ctx.lineTo(cx - 100, cy + 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 120, cy - 180); ctx.lineTo(cx + 120, cy - 180);
  ctx.moveTo(cx - 120, cy + 180); ctx.lineTo(cx + 120, cy + 180); ctx.stroke();

  ctx.strokeStyle = 'rgba(0,204,255,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 95, cy - 175); ctx.lineTo(cx - 25, cy - 5); ctx.lineTo(cx + 95, cy - 175); ctx.stroke();

  for(let i = 0; i < 30; i++) {
    const px = cx - 60 + rng() * 120, py = cy + 20 + rng() * 140;
    ctx.beginPath(); ctx.arc(px, py, 3 + rng() * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,204,255,${0.4 + rng() * 0.6})`; ctx.fill();
  }

  ctx.beginPath(); ctx.moveTo(cx - 25, cy); ctx.lineTo(cx + 25, cy); ctx.strokeStyle = p.cyan; ctx.lineWidth = 5; ctx.stroke();
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
  glow.addColorStop(0, 'rgba(0,204,255,0.5)'); glow.addColorStop(1, 'rgba(0,204,255,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill();
}

function prodChess(ctx, W, H, rng, p) {
  ctx.fillStyle = '#030308'; ctx.fillRect(0, 0, W, H);

  const sq = 100, startX = W/2 - 2 * sq, startY = H/2 - 2 * sq;
  for(let r = 0; r < 4; r++) {
    for(let c = 0; c < 4; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#080810' : '#101020';
      ctx.fillRect(startX + c * sq, startY + r * sq, sq, sq);
    }
  }

  const knightX = startX + 1.5 * sq, knightY = startY + 2.5 * sq;
  ctx.fillStyle = p.cyan; ctx.beginPath(); ctx.moveTo(knightX, knightY - 60);
  ctx.quadraticCurveTo(knightX + 15, knightY - 75, knightX + 20, knightY - 50);
  ctx.lineTo(knightX + 25, knightY); ctx.lineTo(knightX - 25, knightY); ctx.closePath(); ctx.fill();

  ctx.strokeStyle = p.electric; ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(knightX, knightY); ctx.lineTo(knightX - sq, knightY + sq * 2); ctx.lineTo(knightX - sq + sq, knightY + sq * 2); ctx.stroke();
  ctx.setLineDash([]);
}

function prodAtom(ctx, W, H, rng, p) {
  ctx.fillStyle = '#030314'; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H/2;
  ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fillStyle = p.cyan; ctx.fill();
  const nucleusGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  nucleusGlow.addColorStop(0, 'rgba(0,204,255,0.6)'); nucleusGlow.addColorStop(1, 'rgba(0,204,255,0)');
  ctx.fillStyle = nucleusGlow; ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.fill();

  const orbits = [0.3 * Math.PI, Math.PI/2 + 0.2, -0.35 * Math.PI];
  const radii = [150, 180, 160];
  orbits.forEach((rot, i) => {
    ctx.save(); ctx.rotate(rot);
    ctx.strokeStyle = `rgba(0,102,255,${0.4 + i * 0.1})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, radii[i] * 1.3, radii[i] * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
    const eAngle = rng() * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx + Math.cos(eAngle) * radii[i] * 1.3, cy + Math.sin(eAngle) * radii[i] * 0.5, 6, 0, Math.PI * 2); ctx.fillStyle = p.white; ctx.fill();
    ctx.restore();
  });
}

function prodDashboard(ctx, W, H, rng, p) {
  ctx.fillStyle = '#030A14'; ctx.fillRect(0, 0, W, H);

  const panels = [
    { x: 60, y: 60, w: 350, h: 250, type: 'bars' },
    { x: W - 410, y: 60, w: 350, h: 250, type: 'ring' },
    { x: 60, y: H - 310, w: 350, h: 250, type: 'line' },
    { x: W - 410, y: H - 310, w: 350, h: 250, type: 'dots' }
  ];

  panels.forEach(panel => {
    ctx.strokeStyle = p.electric; ctx.lineWidth = 1; ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
    ctx.fillStyle = 'rgba(0,102,255,0.05)'; ctx.fillRect(panel.x + 1, panel.y + 1, panel.w - 2, panel.h - 2);

    switch(panel.type) {
      case 'bars':
        for(let i = 0; i < 8; i++) {
          const barH = 30 + rng() * 120; ctx.fillStyle = p.cyan;
          ctx.fillRect(panel.x + 25 + i * 38, panel.y + panel.h - 30 - barH, 25, barH);
        } break;
      case 'ring':
        const ringR = 80, progress = 0.73;
        ctx.strokeStyle = 'rgba(0,102,255,0.2)'; ctx.lineWidth = 12;
        ctx.beginPath(); ctx.arc(panel.x + panel.w/2, panel.y + panel.h/2, ringR, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = p.cyan; ctx.beginPath(); ctx.arc(panel.x + panel.w/2, panel.y + panel.h/2, ringR, -Math.PI/2, -Math.PI/2 + progress * Math.PI * 2); ctx.stroke();
        break;
      case 'line':
        ctx.beginPath(); ctx.moveTo(panel.x + 30, panel.y + panel.h - 50);
        for(let i = 1; i < 10; i++) ctx.lineTo(panel.x + 30 + i * 35, panel.y + panel.h - 50 - 20 - rng() * 100);
        ctx.strokeStyle = p.electric; ctx.lineWidth = 2; ctx.stroke();
        break;
      case 'dots':
        for(let r = 0; r < 6; r++) for(let c = 0; c < 10; c++) {
          ctx.beginPath(); ctx.arc(panel.x + 40 + c * 32, panel.y + 40 + r * 35, 8, 0, Math.PI * 2);
          ctx.fillStyle = (r * 10 + c) < 47 ? p.cyan : 'rgba(0,102,255,0.2)'; ctx.fill();
        } break;
    }
  });
}

// ============ CAREER VARIANTS ============
function renderCareer(ctx, W, H, rng, v) {
  const p = { purple: '#0A0514', violet: '#14082A', bright: '#7B2FBE', gold: '#F0B429', silver: '#C0C8D8', white: '#FFF8FF' };
  switch(v) {
    case 0: careerLadder(ctx, W, H, rng, p); break;
    case 1: careerOrbits(ctx, W, H, rng, p); break;
    case 2: careerCrown(ctx, W, H, rng, p); break;
    case 3: careerKey(ctx, W, H, rng, p); break;
    case 4: careerNetwork(ctx, W, H, rng, p); break;
    case 5: careerSeal(ctx, W, H, rng, p); break;
    case 6: careerRoad(ctx, W, H, rng, p); break;
    case 7: careerBlueprint(ctx, W, H, rng, p); break;
  }
}

function careerLadder(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, p.purple); bg.addColorStop(1, p.violet);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const cx = W/2, baseY = H - 80;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - 60, baseY); ctx.lineTo(cx - 20, 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 60, baseY); ctx.lineTo(cx + 20, 100); ctx.stroke();

  const rungs = 7;
  for(let i = 0; i < rungs; i++) {
    const t = i / (rungs - 1);
    const y = baseY - t * (baseY - 120);
    const scaleX = 1 - t * 0.7;
    ctx.strokeStyle = p.silver; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 60 * scaleX, y); ctx.lineTo(cx + 60 * scaleX, y); ctx.stroke();
  }

  const topGlow = ctx.createRadialGradient(cx, 80, 0, cx, 80, 100);
  topGlow.addColorStop(0, 'rgba(240,180,41,0.6)'); topGlow.addColorStop(1, 'rgba(240,180,41,0)');
  ctx.fillStyle = topGlow; ctx.beginPath(); ctx.arc(cx, 80, 100, 0, Math.PI * 2); ctx.fill();
}

function careerOrbits(ctx, W, H, rng, p) {
  ctx.fillStyle = '#050008'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2;

  const orbitRadii = [80, 140, 200];
  orbitRadii.forEach((r, i) => {
    ctx.strokeStyle = `rgba(123,47,190,${0.2 + i * 0.1})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    const ang = rng() * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 8 - i * 2, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? p.gold : i === 1 ? p.silver : 'rgba(192,200,216,0.5)'; ctx.fill();
  });

  ctx.strokeStyle = p.bright; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy - orbitRadii[0]); ctx.lineTo(cx, cy - orbitRadii[2]); ctx.stroke();
  for(let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(cx - 10, cy - orbitRadii[0] - i * 20); ctx.lineTo(cx + 10, cy - orbitRadii[0] - i * 20); ctx.stroke(); }
}

function careerCrown(ctx, W, H, rng, p) {
  ctx.fillStyle = '#0A0814'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H * 0.5;

  ctx.fillStyle = p.violet; ctx.beginPath();
  ctx.moveTo(cx - 180, cy + 60);
  ctx.lineTo(cx - 150, cy - 100);
  ctx.lineTo(cx - 80, cy + 10);
  ctx.lineTo(cx, cy - 140);
  ctx.lineTo(cx + 80, cy + 10);
  ctx.lineTo(cx + 150, cy - 100);
  ctx.lineTo(cx + 180, cy + 60);
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = p.gold; ctx.lineWidth = 3; ctx.stroke();

  ctx.fillStyle = p.gold;
  [[cx - 150, cy - 100], [cx, cy - 140], [cx + 150, cy - 100]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
  });

  const starGlow = ctx.createRadialGradient(cx, cy - 140, 0, cx, cy - 140, 50);
  starGlow.addColorStop(0, 'rgba(240,180,41,0.6)'); starGlow.addColorStop(1, 'rgba(240,180,41,0)');
  ctx.fillStyle = starGlow; ctx.beginPath(); ctx.arc(cx, cy - 140, 50, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = p.silver; ctx.fillRect(cx - 160, cy + 60, 320, 30);
}

function careerKey(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, p.purple); bg.addColorStop(1, '#1A0828');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const cx = W/2, cy = H/2;
  ctx.strokeStyle = p.gold; ctx.lineWidth = 8;

  ctx.beginPath(); ctx.arc(cx - 150, cy, 70, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  for(let i = 0; i < 6; i++) { const a = i * Math.PI/3; ctx.moveTo(cx - 150 + Math.cos(a) * 50, cy + Math.sin(a) * 50); ctx.lineTo(cx - 150 + Math.cos(a) * 65, cy + Math.sin(a) * 65); }
  ctx.lineWidth = 4; ctx.stroke();

  ctx.beginPath(); ctx.moveTo(cx - 80, cy); ctx.lineTo(cx + 200, cy); ctx.lineWidth = 10; ctx.stroke();

  ctx.fillStyle = p.gold;
  [[cx + 80, cy + 25], [cx + 130, cy + 35], [cx + 180, cy + 25]].forEach(([x, y]) => {
    ctx.fillRect(x - 25, cy, 18, y - cy);
  });

  const shine = ctx.createLinearGradient(cx - 220, cy - 80, cx - 80, cy + 80);
  shine.addColorStop(0, 'rgba(255,255,240,0.3)'); shine.addColorStop(0.5, 'rgba(255,255,240,0)'); shine.addColorStop(1, 'rgba(255,255,240,0.3)');
  ctx.fillStyle = shine; ctx.beginPath(); ctx.arc(cx - 150, cy, 70, 0, Math.PI * 2); ctx.fill();
}

function careerNetwork(ctx, W, H, rng, p) {
  ctx.fillStyle = p.purple; ctx.fillRect(0, 0, W, H);

  const nodes = [
    { x: W/2, y: H * 0.2, size: 25, color: p.gold },
    { x: W/3, y: H * 0.45, size: 18, color: p.silver },
    { x: W * 2/3, y: H * 0.45, size: 18, color: p.silver },
    { x: W/4, y: H * 0.7, size: 12, color: 'rgba(192,200,216,0.5)' },
    { x: W/2, y: H * 0.7, size: 12, color: 'rgba(192,200,216,0.5)' },
    { x: W * 3/4, y: H * 0.7, size: 12, color: 'rgba(192,200,216,0.5)' }
  ];

  nodes.forEach((n, i) => {
    if(i === 1 || i === 2) { ctx.strokeStyle = p.silver; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(n.x, n.y); ctx.stroke(); }
    if(i >= 3) { const parent = i < 5 ? 1 : 2; ctx.strokeStyle = 'rgba(192,200,216,0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(nodes[parent].x, nodes[parent].y); ctx.lineTo(n.x, n.y); ctx.stroke(); }
  });

  ctx.strokeStyle = p.gold; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(nodes[3].x, nodes[3].y); ctx.lineTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[0].x, nodes[0].y); ctx.stroke();

  nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2); ctx.fillStyle = n.color; ctx.fill(); });
}

function careerSeal(ctx, W, H, rng, p) {
  ctx.fillStyle = '#060310'; ctx.fillRect(0, 0, W, H);
  const cx = W/2, cy = H/2, r = 180;

  ctx.strokeStyle = p.gold; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

  for(let i = 0; i < 24; i++) { const a = i * Math.PI/12; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - 15), cy + Math.sin(a) * (r - 15)); ctx.lineTo(cx + Math.cos(a) * (r - 35), cy + Math.sin(a) * (r - 35)); ctx.strokeStyle = p.gold; ctx.lineWidth = 2; ctx.stroke(); }

  ctx.beginPath(); ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = p.violet; ctx.fill(); ctx.strokeStyle = p.gold; ctx.lineWidth = 4; ctx.stroke();

  ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.35); ctx.lineTo(cx + r * 0.25, cy + r * 0.2); ctx.lineTo(cx - r * 0.25, cy + r * 0.2); ctx.closePath();
  ctx.fillStyle = p.gold; ctx.fill();

  for(let i = 0; i < 12; i++) { const a = i * Math.PI/6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5); ctx.strokeStyle = 'rgba(240,180,41,0.2)'; ctx.lineWidth = 1; ctx.stroke(); }
}

function careerRoad(ctx, W, H, rng, p) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#020208'); bg.addColorStop(1, p.purple);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const cx = W/2, horizon = H * 0.25;

  ctx.fillStyle = 'rgba(40,25,50,0.5)';
  ctx.beginPath(); ctx.moveTo(cx - 80, H); ctx.lineTo(cx - 10, horizon); ctx.lineTo(cx + 10, horizon); ctx.lineTo(cx + 80, H); ctx.closePath(); ctx.fill();

  ctx.strokeStyle = p.silver; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 80, H); ctx.lineTo(cx - 10, horizon); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 80, H); ctx.lineTo(cx + 10, horizon); ctx.stroke();

  ctx.strokeStyle = p.gold; ctx.lineWidth = 4;
  for(let i = 0; i < 10; i++) {
    const t = i / 9, y = H - t * (H - horizon - 30), halfW = 40 + t * 60;
    ctx.beginPath(); ctx.moveTo(cx - halfW + 30, y); ctx.lineTo(cx + halfW - 30, y); ctx.stroke();
  }

  const horizonGlow = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, 200);
  horizonGlow.addColorStop(0, 'rgba(123,47,190,0.4)'); horizonGlow.addColorStop(0.5, 'rgba(240,180,41,0.2)'); horizonGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = horizonGlow; ctx.fillRect(0, 0, W, H * 0.5);

  for(let i = 0; i < 25; i++) { ctx.beginPath(); ctx.arc(rng() * W, rng() * horizon, 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.3})`; ctx.fill(); }
}

function careerBlueprint(ctx, W, H, rng, p) {
  ctx.fillStyle = '#050814'; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(240,180,41,0.15)'; ctx.lineWidth = 1;
  for(let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for(let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = p.gold; ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(W * 0.3, H * 0.8); ctx.lineTo(W * 0.3, H * 0.4); ctx.lineTo(W * 0.35, H * 0.3); ctx.lineTo(W * 0.5, H * 0.25);
  ctx.lineTo(W * 0.65, H * 0.3); ctx.lineTo(W * 0.7, H * 0.4); ctx.lineTo(W * 0.7, H * 0.8);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(W * 0.35, H * 0.35, 40, 0, Math.PI * 2); ctx.strokeStyle = p.bright; ctx.stroke();
  ctx.beginPath(); ctx.arc(W * 0.65, H * 0.35, 40, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.rect(W * 0.4, H * 0.5, W * 0.2, H * 0.25); ctx.strokeStyle = p.silver; ctx.stroke();

  ctx.strokeStyle = 'rgba(240,180,41,0.5)'; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.8); ctx.lineTo(W * 0.25, H * 0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.75, H * 0.8); ctx.lineTo(W * 0.75, H * 0.3); ctx.stroke();
  ctx.setLineDash([]);
}
