/* Химия · 3D-лаборатория: «Лаборантская» (свободные опыты) и «Определи вещество» (задание 24 ЕГЭ).
   Открывается поверх тренажёра в Shadow DOM, как lab3d.js. three.js r160 — из ./vendor/three-r160. */
import * as THREE from "./vendor/three-r160/three.module.min.js";
import { OrbitControls } from "./vendor/three-r160/OrbitControls.js";
import { RoomEnvironment } from "./vendor/three-r160/RoomEnvironment.js";
import { SUBS, REAGS, react, PAIRS, makeTask, canTell, OVR, ovTruth, collection, colKey } from "./chemdata.js?v=4170";

const CSS = `
:host { all: initial; position: fixed; inset: 0; z-index: 3000; display: block;
  --bg: #F5F7FB; --ink: #17213A; --ink-2: #56627D; --line: #D6DDEA; --glass: rgba(255,255,255,.86); --glass-line: rgba(23,33,58,.09);
  --accent: #C2185B; --accent-soft: #FBE4EE; --on-accent: #fff; --ok: #24804E; --ok-soft: #E1F3E8; --bad: #C0392B; --bad-soft: #FBE6E3;
  --trap: #8A5A00; --trap-soft: #FFF3D6; --stage-1: #FFFFFF; --stage-2: #E9EEF8; --shadow: 0 1px 2px rgba(23,33,58,.08), 0 8px 24px rgba(23,33,58,.10);
  --font-display: "Unbounded", "Onest", system-ui, sans-serif; --font-body: "Onest", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; --font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; }
[hidden] { display: none !important; }
*, *::before, *::after { box-sizing: border-box; }
.app { position: relative; height: 100%; overflow: hidden; background: radial-gradient(120% 80% at 50% 0%, var(--stage-1), var(--stage-2)); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; }
.app[data-look="night"] { --ink: #E6F0FF; --ink-2: #8FA3C7; --line: #22314F; --glass: rgba(8,12,24,.82); --glass-line: rgba(120,190,255,.16);
  --accent: #4DE1FF; --accent-soft: rgba(77,225,255,.14); --on-accent: #03121A; --ok: #3DDC97; --ok-soft: rgba(61,220,151,.14); --bad: #FF6B8B; --bad-soft: rgba(255,107,139,.14);
  --trap: #FFD166; --trap-soft: rgba(255,209,102,.12); --stage-1: #0F1C38; --stage-2: #03060D; color-scheme: dark; }
.stage { position: absolute; inset: 0; }
.stage canvas { display: block; width: 100%; height: 100%; touch-action: none; }
.res { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; margin: -2px 0 8px; }
.res::-webkit-scrollbar { display: none; }
.res:empty { display: none; }
.res span { flex: none; display: inline-flex; align-items: center; gap: 6px; font: 600 12.5px/1.2 var(--font-body); padding: 6px 10px 6px 7px; border-radius: 999px; background: var(--stage-2); max-width: 82vw; }
.res span i { width: 14px; height: 14px; border-radius: 50%; flex: none; box-shadow: inset 0 0 0 1.5px rgba(0,0,0,.18); }
.res span em { font-style: normal; font-weight: 500; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.grip { display: block; margin: -4px auto 4px; width: 64px; height: 18px; border: 0; background: none; cursor: pointer; position: relative; }
.grip::before { content: ""; position: absolute; left: 50%; top: 7px; width: 40px; height: 5px; margin-left: -20px; border-radius: 3px; background: var(--line); }
.toast { position: absolute; left: 50%; top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 112px); transform: translate(-50%, -10px); opacity: 0; transition: opacity .3s, transform .3s; pointer-events: none;
  background: var(--ink); color: var(--stage-1); font: 600 13.5px var(--font-body); padding: 9px 14px; border-radius: 12px; box-shadow: var(--shadow); white-space: nowrap; z-index: 5; }
.toast.on { opacity: 1; transform: translate(-50%, 0); }
.ibtn.col { width: auto; padding: 0 10px; gap: 4px; display: inline-flex; font: 600 13px var(--font-body); }
.colv { position: absolute; inset: 0; z-index: 6; background: var(--stage-1); overflow: auto; padding: 14px 16px; padding-top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 14px); padding-bottom: calc(var(--tg-bottom, env(safe-area-inset-bottom, 0px)) + 20px); }
.colv .hd { display: flex; align-items: center; gap: 10px; }
.colv h2 { font: 600 20px/1.2 var(--font-display); margin: 0; flex: 1; }
.colv .sub { color: var(--ink-2); font-size: 14px; margin: 10px 0 10px; }
.colv .bar { height: 8px; border-radius: 4px; background: var(--stage-2); overflow: hidden; margin-bottom: 16px; }
.colv .bar i { display: block; height: 100%; background: var(--accent); border-radius: 4px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }
.card { border: 1.5px solid var(--line); border-radius: 14px; padding: 10px; display: grid; gap: 6px; align-content: start; background: var(--stage-1); min-width: 0; }
.card .sw { height: 46px; border-radius: 10px; display: grid; place-items: center; font: 700 20px var(--font-display); color: var(--ink-2); background: var(--stage-2); }
.card b { font-size: 13px; line-height: 1.25; }
.card small { font-size: 11.5px; color: var(--ink-2); line-height: 1.3; }
.card code { font: 500 10.5px/1.35 var(--font-mono); color: var(--ink-2); word-break: break-word; }
.card.lock { opacity: .62; border-style: dashed; }
.card.lock .sw { height: 34px; font-size: 16px; }
.grp { margin: 18px 0 8px; font-size: 15px; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.grp span { font-size: 13px; color: var(--ink-2); }
@media (max-width: 480px) { .ttl small { display: none; } }
.top { position: absolute; left: 0; right: 0; top: 0; display: flex; align-items: center; gap: 10px; padding: 12px 14px 0; padding-top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 12px); pointer-events: none; }
.top > * { pointer-events: auto; }
.ibtn { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); display: grid; place-items: center; box-shadow: var(--shadow); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; font: 600 17px var(--font-body); flex: none; }
.ttl { flex: 1; min-width: 0; }
.ttl small { display: block; font: 500 11px/1.2 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--ink-2); }
.ttl b { display: block; font: 600 16px/1.25 var(--font-display); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modes { position: absolute; left: 50%; transform: translateX(-50%); top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 62px); display: flex; gap: 4px; padding: 4px; border-radius: 14px; background: var(--glass); border: 1px solid var(--glass-line); box-shadow: var(--shadow); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.modes { max-width: calc(100% - 24px); overflow-x: auto; scrollbar-width: none; }
.modes::-webkit-scrollbar { display: none; }
.modes button { border: 0; background: none; color: var(--ink-2); font: 600 13px var(--font-body); padding: 8px 12px; border-radius: 10px; cursor: pointer; white-space: nowrap; }
.modes button[aria-pressed="true"] { background: var(--accent); color: var(--on-accent); }
.sheet { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: min(720px, 100%); max-height: 40%; overflow: auto; padding: 10px 16px 14px; transition: max-height .3s ease; padding-bottom: calc(var(--tg-bottom, env(safe-area-inset-bottom, 0px)) + 14px);
  background: var(--glass); border: 1px solid var(--glass-line); border-bottom: 0; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 30px rgba(23,33,58,.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.sheet.full { max-height: 78%; }
@media (min-width: 760px) { .sheet { bottom: 16px; border-radius: 20px; border-bottom: 1px solid var(--glass-line); max-height: 40%; } .sheet.full { max-height: 70%; } }
.num { font: 500 11px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
.q { margin: 4px 0 8px; font-size: 14.5px; line-height: 1.4; }
.q b, .f { font-family: var(--font-body); font-weight: 700; white-space: nowrap; }
.h { font: 600 12px var(--font-body); color: var(--ink-2); margin: 10px 0 6px; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.chips::-webkit-scrollbar { display: none; }
.wrap { flex-wrap: wrap; overflow: visible; }
.chip { flex: none; border: 1.5px solid var(--line); background: var(--stage-1); color: var(--ink); border-radius: 12px; padding: 8px 11px; font: 600 14px var(--font-body); cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; }
.chip small { font: 500 11px var(--font-body); color: var(--ink-2); }
.chip[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
.chip.tested::after { content: "проверен"; font: 500 10px var(--font-mono); color: var(--ink-2); }
.chip:disabled { opacity: .45; cursor: default; }
.pred { display: grid; gap: 8px; margin: 4px 0 2px; }
.pr { display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px; }
.pr > b { font: 600 13px var(--font-body); }
.pr .chips { flex-wrap: wrap; overflow: visible; gap: 6px; }
.chip.mini { padding: 6px 9px; font-size: 12.5px; border-radius: 10px; }
.chip.mini.right { border-color: var(--ok); background: var(--ok-soft); color: var(--ok); opacity: 1; }
.chip.mini.wrong { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); opacity: 1; }
.chip.mini.truth { border-color: var(--ok); border-style: dashed; color: var(--ok); opacity: 1; }
.row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; align-items: center; }
.hint { font-size: 12px; color: var(--ink-2); }
.btn { border: 1.5px solid var(--line); background: var(--stage-1); color: var(--ink); border-radius: 12px; padding: 10px 14px; font: 600 14px var(--font-body); cursor: pointer; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.btn[aria-pressed="true"] { border-color: var(--trap); background: var(--trap-soft); color: var(--trap); }
.btn:disabled { opacity: .45; cursor: default; }
.log { margin-top: 10px; display: grid; gap: 6px; }
.log div { font-size: 13.5px; line-height: 1.35; padding: 8px 10px; border-radius: 10px; background: var(--stage-2); }
.log div .eq { display: block; font: 500 12.5px var(--font-mono); color: var(--ink-2); margin-top: 3px; }
.fb { margin-top: 10px; padding: 10px 12px; border-radius: 12px; font-size: 14px; line-height: 1.4; }
.fb.ok { background: var(--ok-soft); color: var(--ok); } .fb.bad { background: var(--bad-soft); color: var(--bad); }
.fb p { color: var(--ink); margin: 6px 0 0; }
.fb .ln { display: block; margin-top: 4px; }
.fb .eq { display: block; font: 500 12.5px var(--font-mono); color: var(--ink-2); margin: 2px 0 4px; }
select { appearance: none; -webkit-appearance: none; border: 1.5px solid var(--line); background: var(--stage-1); color: var(--ink); border-radius: 12px; padding: 9px 30px 9px 11px; font: 600 14px var(--font-body); max-width: 100%;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%); background-position: calc(100% - 15px) 55%, calc(100% - 10px) 55%; background-size: 5px 5px; background-repeat: no-repeat; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.two label { font: 600 12px var(--font-body); color: var(--ink-2); display: grid; gap: 5px; min-width: 0; }
.two select { width: 100%; }
@media (max-width: 390px) { .ttl b { font-size: 14px; } .modes button { padding: 8px 8px; font-size: 12.5px; } .ibtn.col { padding: 0 8px; } }
.nogl { position: absolute; inset: 0; display: grid; place-items: center; padding: 30px; text-align: center; color: var(--ink-2); }
`;

const HTML = `<div class="app" id="app" data-look="lab">
  <div class="stage" id="stage"></div>
  <header class="top">
    <button class="ibtn" id="back" type="button" aria-label="Назад">←</button>
    <div class="ttl"><small>Химия · лаборатория</small><b id="ttl">Задание 24</b></div>
    <button class="ibtn col" id="colBtn" type="button" aria-label="Коллекция реакций">📒 <span id="colN">0</span></button>
    <button class="ibtn" id="lookBtn" type="button" aria-label="Сменить стиль">☾</button>
  </header>
  <div class="toast" id="toast" role="status"></div>
  <nav class="modes" id="modes"><button type="button" data-mode="lab">Лаборантская</button><button type="button" data-mode="task">Задание 24</button><button type="button" data-mode="ovr">ОВР по средам</button></nav>
  <section class="sheet" id="sheet"><button class="grip" id="grip" type="button" aria-label="Развернуть карточку" aria-expanded="false"></button><div class="res" id="res"></div><div id="sbody"></div></section>
  <section class="colv" id="colv" hidden></section>
</div>`;

const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const SUBD = "₀₁₂₃₄₅₆₇₈₉";
const plainF = (f) => String(f).replace(/([A-Za-z\)\]])(\d+)/g, (m, a, d) => a + [...d].map((c) => SUBD[+c]).join(""));
const htmlF = (f) => String(f).replace(/([A-Za-z\)\]])(\d+)/g, "$1<sub>$2</sub>");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let active = null;
export async function open(opts = {}) {
  if (active) return active;
  const host = document.createElement("div");
  host.className = "chl-host";
  const sh = host.attachShadow({ mode: "open" });
  sh.innerHTML = `<style>${CSS}</style>${HTML}`;
  document.body.appendChild(host);
  const prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
  const tgw = window.Telegram && window.Telegram.WebApp;
  let swipesWere = null;
  try { if (tgw && tgw.disableVerticalSwipes && tgw.isVersionAtLeast && tgw.isVersionAtLeast("7.7")) { swipesWere = tgw.isVerticalSwipesEnabled; tgw.disableVerticalSwipes(); } } catch (e) {}
  const buzz = (k) => { try { const h = tgw && tgw.HapticFeedback; if (!h) return; if (k === "select") h.impactOccurred("light"); else h.notificationOccurred(k); } catch (e) {} };
  const $ = (s) => sh.querySelector(s);
  const app = $("#app"), stage = $("#stage"), sheet = $("#sheet"), sbody = $("#sbody");
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const V3 = THREE.Vector3;
  let alive = true, raf = 0;

  /* ───────── рендер ───────── */
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { stage.innerHTML = '<div class="nogl">Этому устройству не хватает WebGL для 3D-лаборатории. Попробуй открыть в Chrome или Safari.</div>'; }
  if (!renderer) { $("#back").onclick = close; return { close }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ENV = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const scene = new THREE.Scene(); scene.environment = ENV;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.085, enablePan: false, rotateSpeed: 0.7, zoomSpeed: 0.9,
    minDistance: 7, maxDistance: 22, minPolarAngle: 0.55, maxPolarAngle: 1.42, minAzimuthAngle: -1.0, maxAzimuthAngle: 1.0 });
  const TARGET = new V3(0, 4.3, -0.4);
  controls.target.copy(TARGET);

  /* ───────── стили ───────── */
  // «Лаборатория» — дневной свет; «Ночь» — тот же кабинет в полутьме, растворы и стекло светятся
  const LOOKS = {
    lab: { exposure: 1.0, hemi: ["#ffffff", "#9aa3b2", 0.85], key: 1.9, glassEdge: "#8A97B8", glow: 0 },
    night: { exposure: 1.05, hemi: ["#7fa6ff", "#05080f", 0.35], key: 0.45, glassEdge: "#4DE1FF", glow: 1 },
  };
  let LOOK = "lab";
  try { const q = localStorage.getItem("hb.chl.look"); if (LOOKS[q]) LOOK = q; } catch (e) {}
  if (opts.look && LOOKS[opts.look]) LOOK = opts.look;

  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa3b2, 1); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6ea, 1.9); key.position.set(5, 13, 9); scene.add(key);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0006; key.shadow.radius = 5;
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 11, bottom: -3, near: 2, far: 40 }); key.shadow.camera.updateProjectionMatrix();
  const rimL = new THREE.DirectionalLight(0x9fd8ff, 0.6); rimL.position.set(-6, 5, -6); scene.add(rimL);

  /* ───────── кабинет: кафельная стена, полка с посудой, лабораторная столешница ───────── */
  const cv = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const tileTex = (base, grout, hi) => { const t = cv(512, 512, (g) => {
    g.fillStyle = grout; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const gr = g.createLinearGradient(x * 128, y * 128, x * 128 + 128, y * 128 + 128); gr.addColorStop(0, hi); gr.addColorStop(1, base); g.fillStyle = gr; g.fillRect(x * 128 + 3, y * 128 + 3, 122, 122); }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 5); return t; };
  const topTex = (base, fleck) => { const t = cv(1024, 512, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = fleck[i % fleck.length]; g.globalAlpha = 0.25 + Math.random() * 0.4; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
    g.globalAlpha = 1;
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); return t; };
  const TEX = {
    lab: { wall: tileTex("#EEF1F4", "#C9D0D9", "#FAFBFC"), top: topTex("#2C313A", ["#3B424E", "#22262D", "#4A5260"]) },
    night: { wall: tileTex("#121A2C", "#070B14", "#1A2540"), top: topTex("#0B111D", ["#16203A", "#05080F", "#1D2A4A"]) },
  };
  const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(44, 18), wallMat); wall.position.set(0, 8.4, -5.6); wall.receiveShadow = true; scene.add(wall);
  const benchMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 });
  const bench = new THREE.Mesh(new THREE.BoxGeometry(44, 0.7, 11.4), benchMat); bench.position.set(0, -0.35, 0.1); bench.receiveShadow = true; scene.add(bench);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x1A1E25, roughness: 0.6 });
  const edge = new THREE.Mesh(new THREE.BoxGeometry(44, 0.12, 0.12), edgeMat); edge.position.set(0, 0.0, 5.8); scene.add(edge);
  // полка с посудой на стене — по бокам, чтобы не мешать пробиркам
  const decor = new THREE.Group(); scene.add(decor);
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0xB9C1CC, roughness: 0.45, metalness: 0.4 });
  const decoGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.06, transmission: 0.9, thickness: 0.2, transparent: true, opacity: 0.45, depthWrite: false });
  const lathe = (pts, seg = 32) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
  const FLASK = lathe([[0.0001, 0], [0.9, 0], [0.95, 0.08], [0.42, 1.25], [0.24, 1.55], [0.24, 2.1], [0.29, 2.15]]);
  const FLASK_L = lathe([[0.0001, 0], [0.86, 0], [0.62, 0.62], [0.0001, 0.62]]);
  const BEAKER = lathe([[0.0001, 0], [0.7, 0], [0.72, 1.5], [0.8, 1.56]]);
  const BEAKER_L = lathe([[0.0001, 0], [0.66, 0], [0.68, 0.8], [0.0001, 0.8]]);
  const ROUND = lathe([...Array(13)].map((_, i) => { const a = -Math.PI / 2 + (i / 12) * Math.PI * 0.86; return [Math.max(0.0001, 0.8 * Math.cos(a)), 0.8 + 0.8 * Math.sin(a)]; }).concat([[0.2, 1.75], [0.2, 2.5]]));
  const ROUND_L = lathe([...Array(7)].map((_, i) => { const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2.4); return [Math.max(0.0001, 0.76 * Math.cos(a)), 0.8 + 0.76 * Math.sin(a)]; }).concat([[0.0001, 0.8 + 0.76 * Math.sin(-Math.PI / 2 + Math.PI / 2.4)]]));
  const CYL = lathe([[0.0001, 0], [0.45, 0], [0.45, 0.12], [0.22, 0.14], [0.22, 2.6], [0.27, 2.66]]);
  const CYL_L = lathe([[0.0001, 0.14], [0.2, 0.14], [0.2, 1.6], [0.0001, 1.6]]);
  const liqM = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, transparent: true, opacity: 0.82 });
  function deco(geo, liq, liqCol, x, z, s = 1, y = 0) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); decor.add(g);
    const gl = new THREE.Mesh(geo, decoGlass); g.add(gl);
    if (liq) { const l = new THREE.Mesh(liq, liqM(liqCol)); l.scale.set(0.95, 1, 0.95); l.castShadow = true; g.add(l); }
    return g;
  }
  const SH_Y = 6.3, SH_Z = -4.9;
  [[-1, 1], [1, 1]].forEach(([sd]) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 1.2), shelfMat); board.position.set(sd * 6.3, SH_Y, SH_Z); board.castShadow = true; board.receiveShadow = true; decor.add(board);
    [-2.6, 2.6].forEach((dx) => { const br = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 1.0), shelfMat); br.position.set(sd * 6.3 + dx, SH_Y - 0.4, SH_Z - 0.05); decor.add(br); });
  });
  deco(FLASK, FLASK_L, "#57C7BD", -8.0, SH_Z, 0.95, SH_Y + 0.08); deco(BEAKER, BEAKER_L, "#F0A43A", -6.4, SH_Z + 0.1, 0.85, SH_Y + 0.08); deco(CYL, CYL_L, "#8E7CF0", -5.0, SH_Z, 0.95, SH_Y + 0.08);
  deco(ROUND, ROUND_L, "#E5679E", 5.2, SH_Z, 0.85, SH_Y + 0.08); deco(FLASK, FLASK_L, "#6FB4F2", 6.8, SH_Z, 0.85, SH_Y + 0.08); deco(BEAKER, null, null, 8.2, SH_Z + 0.1, 0.8, SH_Y + 0.08);
  // на столе у стены: штатив с колбой и мерный стакан
  deco(FLASK, FLASK_L, "#F3D35B", -6.1, -3.6, 1.15); deco(BEAKER, BEAKER_L, "#9FD8F5", 6.0, -3.5, 1.1);
  [[-7.3, -3.9, "#7B4A2A"], [7.4, -3.9, "#7B4A2A"]].forEach(([x, z, c]) => {   // тёмные склянки
    const b = new THREE.Mesh(lathe([[0.0001, 0], [0.6, 0], [0.6, 1.5], [0.3, 1.85], [0.3, 2.15], [0.0001, 2.15]]), new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, metalness: 0.1 }));
    b.position.set(x, 0, z); b.castShadow = true; decor.add(b);
  });

  /* ───────── стекло ───────── */
  const FRES_VS = `varying vec3 vN; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position,1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`;
  const FRES_FS = `uniform vec3 uC; uniform float uA; uniform float uP; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - abs(dot(normalize(vN), vV)), uP); gl_FragColor = vec4(uC, clamp(f * uA, 0., 1.)); }`;
  const rimMat = () => new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color("#7C8BB0") }, uA: { value: 0.9 }, uP: { value: 2.2 } }, vertexShader: FRES_VS, fragmentShader: FRES_FS,
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.NormalBlending });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.12, ior: 1.47, transparent: true, opacity: 0.35, envMapIntensity: 1.2, side: THREE.DoubleSide, depthWrite: false });
  const rims = [];

  /* ───────── пробирки ───────── */
  // пробирки висят в штативе над спиртовками: низ на высоте TUBE_Y
  const TR = 0.5, TH = 6.2, FILL0 = 2.15, TUBE_Y = 1.75, TUBE_X = 1.35;
  function tubeProfile(r, h, closed) {
    const p = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * (Math.PI / 2); p.push(new THREE.Vector2(Math.max(0.0001, r * Math.cos(a)), r + r * Math.sin(a))); }
    p.push(new THREE.Vector2(r, h));
    if (closed) p.push(new THREE.Vector2(0.0001, h));
    return p;
  }
  function liquidGeo(h) { return new THREE.LatheGeometry(tubeProfile(TR * 0.9, h, true), 40); }
  const PN = 420, BN = 70;
  // «серебряное зеркало»: полосы отражений, как на хроме
  const chromeTex = (() => { const c = document.createElement("canvas"); c.width = 256; c.height = 8; const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 0, 256, 0);
    [[0, "#5E6672"], [0.12, "#F7F9FC"], [0.2, "#9AA3B0"], [0.38, "#E9EDF3"], [0.5, "#4B525D"], [0.62, "#DCE1E8"], [0.78, "#FFFFFF"], [0.88, "#7D8693"], [1, "#5E6672"]].forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 8); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const sphereG = new THREE.IcosahedronGeometry(1, 1), flakeG = new THREE.DodecahedronGeometry(1, 0);
  function makeTube(x, letter) {
    const g = new THREE.Group(); g.position.set(x, TUBE_Y, 0); scene.add(g);
    const outer = new THREE.LatheGeometry(tubeProfile(TR, TH, false), 48);
    const glass = new THREE.Mesh(outer, glassMat); g.add(glass);
    const rim = new THREE.Mesh(outer, rimMat()); rim.renderOrder = 5; g.add(rim); rims.push(rim);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(TR + 0.03, 0.045, 10, 48), glassMat); lip.rotation.x = Math.PI / 2; lip.position.y = TH; g.add(lip);
    const liqMat = new THREE.MeshPhysicalMaterial({ color: 0xE8F3FA, roughness: 0.12, transmission: 0.55, thickness: 0.8, ior: 1.33, transparent: true, opacity: 0.55, depthWrite: false, emissive: 0x000000 });
    const liquid = new THREE.Mesh(liquidGeo(FILL0), liqMat); liquid.renderOrder = 2; g.add(liquid);
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, roughness: 1 });
    const cloud = new THREE.Mesh(liquidGeo(FILL0 * 0.98), cloudMat); cloud.scale.set(0.97, 1, 0.97); cloud.renderOrder = 3; g.add(cloud);
    const mirMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: chromeTex, metalness: 0.75, roughness: 0.12, transparent: true, opacity: 0, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false });
    const mirror = new THREE.Mesh(new THREE.LatheGeometry(tubeProfile(TR * 0.93, FILL0 + 0.35, false), 48), mirMat); mirror.renderOrder = 4; g.add(mirror);
    const pMat = new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0, transparent: true, opacity: 1 });
    const parts = new THREE.InstancedMesh(flakeG, pMat, PN); parts.instanceMatrix.setUsage(THREE.DynamicDrawUsage); parts.count = 0; parts.renderOrder = 3; parts.frustumCulled = false; g.add(parts);
    const bMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.7, transparent: true, opacity: 0.55, depthWrite: false });
    const bubbles = new THREE.InstancedMesh(sphereG, bMat, BN); bubbles.count = 0; bubbles.renderOrder = 4; bubbles.frustumCulled = false; g.add(bubbles);
    // этикетка на самой пробирке (как полоска лейкопластыря): буква или среда + формула — подписи больше не налезают друг на друга
    const tagC = document.createElement("canvas"); tagC.width = 256; tagC.height = 320;
    const tagT = new THREE.CanvasTexture(tagC); tagT.colorSpace = THREE.SRGBColorSpace; tagT.anisotropy = 4;
    const tag = new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.015, TR + 0.015, 1.5, 32, 1, true, -0.85, 1.7), new THREE.MeshStandardMaterial({ map: tagT, roughness: 0.8, transparent: true }));
    tag.position.y = TH - 1.55; tag.renderOrder = 6; g.add(tag);
    const T = { g, letter, liquid, liqMat, cloud, cloudMat, mirror, mirMat, parts, pMat, bubbles, level: FILL0, sub: null, tagC, tagT,
      P: [], B: [], gasT: 0, colNow: new THREE.Color(0xE8F3FA), colTo: new THREE.Color(0xE8F3FA), cloudTo: 0, mirTo: 0, pptCol: new THREE.Color(0xffffff), pptTo: null, label: null, obs: "", smell: "" };
    return T;
  }
  const allTubes = [makeTube(-TUBE_X, "А"), makeTube(TUBE_X, "Б"), makeTube(0, "В")];
  let tubes = allTubes.slice(0, 2);

  /* штатив: под 2 или 3 пробирки */
  const rackMat = new THREE.MeshStandardMaterial({ color: 0xF4F1EA, roughness: 0.6 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xC9C3B6, roughness: 0.5 });
  const rack = new THREE.Group(); scene.add(rack);
  // штатив-держатель: две стойки на ножках и верхняя планка с кольцами; под пробирками пусто — там спиртовки
  const PLATE_Y = TUBE_Y + 3.05;
  function buildRack(xs) {
    rack.clear();
    const half = Math.max(...xs.map(Math.abs)) + 0.85, W = half * 2;
    const rb = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rackMat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; rack.add(m); return m; };
    for (const sx of [-1, 1]) { rb(0.24, PLATE_Y + 0.1, 0.24, sx * (half - 0.15), (PLATE_Y + 0.1) / 2, 0); rb(0.5, 0.12, 1.6, sx * (half - 0.15), 0.06, 0); }
    rb(W, 0.16, 1.2, 0, PLATE_Y, 0);
    for (const x of xs) { const ring = new THREE.Mesh(new THREE.TorusGeometry(TR + 0.08, 0.07, 8, 32), ringMat); ring.rotation.x = Math.PI / 2; ring.position.set(x, PLATE_Y + 0.09, 0); ring.castShadow = true; rack.add(ring); }
  }
  /* спиртовки (нагрев) */
  // спиртовка стоит прямо под пробиркой: пламя касается дна
  const lampLiq = new THREE.MeshStandardMaterial({ color: 0x9FD3F0, transparent: true, opacity: 0.55, roughness: 0.2 });
  function makeLamp(x) {
    const g = new THREE.Group(); g.position.set(x, 0, 0); scene.add(g);
    const body = new THREE.Mesh(lathe([[0.0001, 0], [0.62, 0], [0.66, 0.08], [0.66, 0.42], [0.5, 0.66], [0.2, 0.78], [0.0001, 0.78]], 28), decoGlass); g.add(body);
    const spirit = new THREE.Mesh(lathe([[0.0001, 0.02], [0.6, 0.02], [0.6, 0.36], [0.0001, 0.36]], 24), lampLiq); g.add(spirit);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0xBFC6D4, metalness: 0.7, roughness: 0.3 })); neck.position.y = 0.9; g.add(neck);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8), new THREE.MeshStandardMaterial({ color: 0x3A3027, roughness: 0.9 })); wick.position.y = 1.1; g.add(wick);
    const fl = new THREE.Group(); fl.position.y = 1.16; g.add(fl);
    const outer = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshBasicMaterial({ color: 0xFFA43A, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); outer.scale.set(1, 2.6, 1); outer.position.y = 0.3; fl.add(outer);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), new THREE.MeshBasicMaterial({ color: 0x5AA0FF, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); inner.scale.set(1, 1.8, 1); inner.position.y = 0.12; fl.add(inner);
    const light = new THREE.PointLight(0xffa040, 0, 5); light.position.y = 0.4; fl.add(light);
    g.visible = false; light.removeFromParent(); light.position.set(x, 1.6, 0.5); scene.add(light);
    return { g, fl, light };
  }
  const allLamps = allTubes.map((t) => makeLamp(t.g.position.x));
  let lamps = allLamps.slice(0, 2);
  // сколько пробирок на столе: 2 (лаборантская, №24) или 3 (ОВР: кислая · нейтральная · щелочная)
  function layout(n) {
    const xs = n === 3 ? [-2.1, 0, 2.1] : [-TUBE_X, TUBE_X];
    tubes = n === 3 ? [allTubes[0], allTubes[2], allTubes[1]] : allTubes.slice(0, 2);
    lamps = n === 3 ? [allLamps[0], allLamps[2], allLamps[1]] : allLamps.slice(0, 2);
    allTubes.forEach((T) => (T.g.visible = tubes.includes(T)));
    tubes.forEach((T, i) => { T.g.position.x = xs[i]; lamps[i].g.position.x = xs[i]; lamps[i].light.position.x = xs[i]; });
    allLamps.forEach((L) => { if (!lamps.includes(L)) { L.g.visible = false; L.light.intensity = 0; } });
    buildRack(xs); mountLabels();
  }

  /* склянки с реактивами */
  function labelTex(f, name) {
    const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d");
    g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#C2185B"; g.lineWidth = 10; g.strokeRect(10, 10, 492, 236);
    const fs = String(plainF(f)).length > 9 ? 62 : 84;
    g.fillStyle = "#17213A"; g.font = `700 ${fs}px Onest, system-ui, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(plainF(f), 256, 112, 470);
    g.font = "500 34px Onest, system-ui, sans-serif"; g.fillStyle = "#56627D"; g.fillText(name.length > 26 ? name.slice(0, 25) + "…" : name, 256, 196, 470);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const bottleG = new THREE.LatheGeometry([[0.0001, 0], [0.62, 0], [0.66, 0.06], [0.66, 1.45], [0.6, 1.7], [0.34, 1.95], [0.24, 2.05], [0.24, 2.3], [0.0001, 2.3]].map(([x, y]) => new THREE.Vector2(x, y)), 36);
  function makeBottle(rk) {
    const R = REAGS[rk], g = new THREE.Group(); scene.add(g);
    const tint = R.glass || "#DDE8F2";
    const glass = new THREE.Mesh(bottleG, new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.08, transmission: R.glass ? 0.25 : 0.9, thickness: 0.3, transparent: true, opacity: R.glass ? 0.95 : 0.5, depthWrite: false }));
    glass.castShadow = !!R.glass; g.add(glass);
    const lc = R.ppt || R.liq;
    if (lc && !R.glass) { const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1.1, 32), new THREE.MeshStandardMaterial({ color: lc, transparent: true, opacity: 0.75, roughness: 0.3 })); liq.position.y = 0.62; g.add(liq); }
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.675, 0.675, 0.82, 40, 1, true, -0.95, 1.9), new THREE.MeshStandardMaterial({ map: labelTex(R.f, R.name), roughness: 0.7 }));
    label.position.y = 0.82; label.rotation.y = Math.PI / 2; label.castShadow = true; g.add(label);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.26, 24), new THREE.MeshStandardMaterial({ color: 0x2A3148, roughness: 0.5 })); cap.position.y = 2.36; cap.castShadow = true; g.add(cap);
    g.userData.rk = rk; g.traverse((o) => (o.userData.rk = rk));
    return g;
  }
  let bottles = [];
  function placeBottles(list) {
    bottles.forEach((b) => scene.remove(b)); bottles = list.map(makeBottle);
    // по бокам от штатива: слева и справа, ближние чуть впереди — так их не загораживают пробирки
    const SLOTS = { 1: [[-3.45, -0.5]], 2: [[-3.45, -0.5], [3.45, -0.5]], 3: [[-3.45, -0.5], [3.45, -0.5], [-4.55, -2.0]], 4: [[-3.35, -0.4], [-4.5, -2.1], [3.35, -0.4], [4.5, -2.1]] };
    const sl = SLOTS[bottles.length] || SLOTS[4];
    bottles.forEach((b, i) => { const [x, z] = sl[i % sl.length]; b.position.set(x, 0, z); b.rotation.y = Math.atan2(camera.position.x - x, camera.position.z - z) * 0.6 - Math.PI / 2; });
  }

  /* пипетка */
  const pip = new THREE.Group(); scene.add(pip);
  { const tubeM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.9, 16), glassMat); tubeM.position.y = 1.15; pip.add(tubeM);
    const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.9, 16), rimMat()); r2.position.y = 1.15; pip.add(r2); rims.push(r2);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.32, 16), glassMat); tip.rotation.x = Math.PI; tip.position.y = 0.04; pip.add(tip);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), new THREE.MeshStandardMaterial({ color: 0xD6417C, roughness: 0.55 })); bulb.scale.y = 1.5; bulb.position.y = 2.35; pip.add(bulb);
    const fillM = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0xE8F3FA, transparent: true, opacity: 0.7 })); fillM.position.y = 0.55; pip.add(fillM); pip.userData.fill = fillM; }
  const PIP_HOME = new V3(2.6, 0.12, 2.6);
  pip.position.copy(PIP_HOME); pip.rotation.z = -1.25;
  const drops = [];
  const dropMat = new THREE.MeshPhysicalMaterial({ color: 0xE8F3FA, roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.85 });

  function setLook(l) {
    LOOK = l; app.dataset.look = l; try { localStorage.setItem("hb.chl.look", l); } catch (e) {}
    const L = LOOKS[l]; renderer.toneMappingExposure = L.exposure;
    hemi.color.set(L.hemi[0]); hemi.groundColor.set(L.hemi[1]); hemi.intensity = L.hemi[2]; key.intensity = L.key; rimL.intensity = l === "night" ? 1.4 : 0.6;
    wallMat.map = TEX[l].wall; wallMat.needsUpdate = true; benchMat.map = TEX[l].top; benchMat.needsUpdate = true;
    rackMat.color.set(l === "night" ? 0x1B2744 : 0xE9E4D8); ringMat.color.set(l === "night" ? 0x2A3A60 : 0xB9B3A6); shelfMat.color.set(l === "night" ? 0x2A3654 : 0xB9C1CC);
    rims.forEach((r) => { r.material.uniforms.uC.value.set(L.glassEdge); r.material.uniforms.uA.value = l === "night" ? 1.25 : 0.7; r.material.blending = l === "night" ? THREE.AdditiveBlending : THREE.NormalBlending; r.material.needsUpdate = true; });
    glassMat.opacity = l === "night" ? 0.12 : 0.3;
    allTubes.forEach((t) => { t.liqMat.emissiveIntensity = l === "night" ? 0.55 : 0; t.pMat.emissiveIntensity = l === "night" ? 0.35 : 0; });
    tubes.forEach(drawTag);
    $("#lookBtn").textContent = l === "night" ? "☀" : "☾";
  }

  /* ───────── состояние пробирки и эффекты ───────── */
  const COLORLESS = new THREE.Color(0xE8F3FA);
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new V3(), tmpP = new V3();
  function baseColor(sub) { const s = SUBS[sub]; return s && s.liq ? new THREE.Color(s.liq) : COLORLESS.clone(); }
  function setLevel(T, h) { T.level = h; T.liquid.geometry.dispose(); T.liquid.geometry = liquidGeo(h); T.cloud.geometry.dispose(); T.cloud.geometry = liquidGeo(h * 0.98); }
  function resetTube(T, sub) {
    T.sub = sub; setLevel(T, FILL0); T.P = []; T.B = []; T.gasT = 0; T.parts.count = 0; T.bubbles.count = 0;
    const c = baseColor(sub); T.colNow.copy(c); T.colTo.copy(c); T.cloudTo = SUBS[sub] && SUBS[sub].op ? 0.18 : 0; T.cloudMat.opacity = T.cloudTo; T.cloudMat.color.copy(c);
    T.mirTo = 0; T.mirMat.opacity = 0; T.obs = ""; T.smell = ""; T.n = {}; T.reag = null; T.pptTo = null;
  }
  function spawnPpt(T, color, shape = "fine", amount = 1) {
    const n = Math.round((shape === "curd" ? 220 : shape === "gel" ? 200 : 320) * amount), c = new THREE.Color(color);
    T.pptCol.copy(c); T.pMat.color.copy(c); T.pMat.emissive.copy(c); T.pMat.opacity = shape === "gel" ? 0.8 : 1;
    for (let i = 0; i < n && T.P.length < PN; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * TR * 0.35;
      T.P.push({ x: Math.cos(a) * r, y: T.level - 0.08 - Math.random() * 0.35, z: Math.sin(a) * r, vx: (Math.random() - 0.5) * 1.1, vy: -0.2 - Math.random() * 0.9, vz: (Math.random() - 0.5) * 1.1,
        s: (shape === "curd" ? 0.03 + Math.random() * 0.045 : shape === "gel" ? 0.035 + Math.random() * 0.04 : 0.016 + Math.random() * 0.018), life: 0, rest: false, fade: 1,
        q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)), k: [0.7 + Math.random() * 0.6, 0.4 + Math.random() * 0.4, 0.7 + Math.random() * 0.6], sink: 0.7 + Math.random() * 0.9 });
    }
    T.cloudMat.color.copy(c); T.cloudTo = Math.max(T.cloudTo, shape === "fine" ? 0.42 : 0.3); T.cloudPulse = 1;
    setTimeout(() => { if (alive) T.cloudTo = shape === "fine" ? 0.16 : 0.08; }, 1800);
  }
  function dissolvePpt(T) { T.P.forEach((p) => (p.dis = true)); T.cloudTo = 0; }
  function startGas(T, sec = 3.2) { T.gasT = sec; }
  function applyEffect(T, e, rk) {
    const R = REAGS[rk];
    T.obs = e.t; T.sh = e.sh || ""; T.smell = e.smell || ""; T.eq = e.eq || ""; T.lastE = e;
    discover(e, T.sub, rk);
    switch (e.k) {
      case "ppt": if (e.col) T.colTo.set(e.col); if (e.replace) { T.pptTo = new THREE.Color(e.c); T.cloudMat.color.set(e.c); T.cloudTo = 0.25; setTimeout(() => { if (alive) T.cloudTo = 0.1; }, 2200); if (!T.P.length) spawnPpt(T, e.c, e.shape, 0.8); } else spawnPpt(T, e.c, e.shape); break;
      case "col": T.colTo.set(e.c); if (T.P.length && rk === "CuOH") dissolvePpt(T); T.cloudMat.color.set(e.c); T.cloudTo = 0.22; setTimeout(() => { if (alive) T.cloudTo = 0; }, 1400); break;
      case "gas": startGas(T); break;
      case "gasppt": startGas(T); spawnPpt(T, e.c, e.shape); break;
      case "decol": T.colNow.set(R.liq || "#ffffff"); if (e.to) T.colTo.set(e.to); else T.colTo.copy(baseColor(T.sub)); if (e.ppt) spawnPpt(T, e.ppt, "fine", 0.7); if (rk === "form" || (e.t || "").includes("газ")) startGas(T, 2); break;
      case "dis": dissolvePpt(T); if (e.c) T.colTo.set(e.c); break;
      case "mirror": T.mirTo = 0.97; T.colTo.set("#C9CED6"); break;
      case "weak": if (R.liq) T.colTo.copy(baseColor(T.sub)).lerp(new THREE.Color(R.liq), 0.55); T.cloudMat.color.set("#ffffff"); T.cloudTo = Math.max(T.cloudTo, 0.08); break;
      default: if (e.c) T.colTo.set(e.c); else if (R.liq) T.colTo.copy(baseColor(T.sub)).lerp(new THREE.Color(R.liq), rk === "lit" ? 0.85 : 0.6);
    }
    if (e.gas) startGas(T, 4);
  }
  // капля реактива попала в пробирку
  function dropInto(T, rk, heat) {
    T.n[rk] = (T.n[rk] || 0) + 1; T.reag = rk;
    if (T.level < FILL0 + 0.9) setLevel(T, T.level + 0.12);
    const R = REAGS[rk];
    if (R.ppt && T.n[rk] === 1) spawnPpt(T, R.ppt, "gel", 0.9);
    const e = react(T.sub, rk, { heat, n: T.n[rk] });
    T.obs = e.t; T.eq = e.eq || "";
    setTimeout(() => { if (alive) { applyEffect(T, e, rk); showObs(T); } }, R.ppt ? 700 : 150);
    return e;
  }

  /* ───────── анимации: пипетка ───────── */
  const anims = [];
  const tween = (ms, fn) => new Promise((res) => anims.push({ t0: performance.now(), ms: REDUCE ? 1 : ms, fn, res }));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  async function moveTo(to, ms, rotTo = 0) {
    const from = pip.position.clone(), r0 = pip.rotation.z;
    await tween(ms, (k) => { const e = easeIO(k); pip.position.lerpVectors(from, to, e); pip.position.y += Math.sin(Math.PI * e) * 0.8 * (from.distanceTo(to) > 2 ? 1 : 0); pip.rotation.z = r0 + (rotTo - r0) * e; });
  }
  let busy = false;
  async function runDrops(rk, which = [0, 1], heat = false) {
    if (busy) return []; busy = true; buzz("select");
    const R = REAGS[rk], out = [];
    const b = bottles.find((x) => x.userData.rk === rk) || bottles[0];
    pip.userData.fill.material.color.set(R.ppt || R.liq || "#E8F3FA"); dropMat.color.set(R.ppt || R.liq || "#E8F3FA");
    if (b) { await moveTo(new V3(b.position.x, 2.75, b.position.z), 650); await tween(260, (k) => (pip.position.y = 2.75 - 0.5 * Math.sin(Math.PI * k))); }
    for (const i of which) {
      const T = tubes[i];
      await moveTo(new V3(T.g.position.x, TUBE_Y + TH + 0.65, 0), 700);
      for (let d = 0; d < 3; d++) {
        const m = new THREE.Mesh(sphereG, dropMat); m.scale.set(0.07, 0.1, 0.07); m.position.set(T.g.position.x, TUBE_Y + TH + 0.55, 0); scene.add(m);
        drops.push({ m, vy: 0, stop: TUBE_Y + T.level, T });
        await tween(150, () => {});
      }
      await tween(420, () => {});
      out.push(dropInto(T, rk, heat));
    }
    await moveTo(PIP_HOME, 750, -1.25);
    busy = false;
    return out;
  }

  /* ───────── этикетки на пробирках и полоса наблюдений в карточке ───────── */
  const MED_SHORT = { H2SO4: "кислая", H2O: "нейтр.", KOH: "щёлочь" };
  // формула с нижними индексами на канве
  function drawF(g, f, x, y, size, maxW) {
    // цифра — нижний индекс, если стоит после буквы, скобки или другой цифры-индекса
    const parts = []; let prev = "", prevSub = false;
    for (const ch of String(f)) {
      const sub = /\d/.test(ch) && (/[A-Za-z\)\]]/.test(prev) || (/\d/.test(prev) && prevSub));
      const lastP = parts[parts.length - 1];
      if (lastP && lastP[1] === (sub ? 1 : 0)) lastP[0] += ch; else parts.push([ch, sub ? 1 : 0]);
      prev = ch; prevSub = sub;
    }
    const font = (sub) => `700 ${sub ? Math.round(size * 0.62) : size}px Onest, system-ui, sans-serif`;
    let w = 0; parts.forEach(([t, sub]) => { g.font = font(sub); w += g.measureText(t).width; });
    const k = Math.min(1, maxW / w); g.save(); g.translate(x - (w * k) / 2, y); g.scale(k, k); let cx = 0;
    parts.forEach(([t, sub]) => { g.font = font(sub); g.fillText(t, cx, sub ? size * 0.28 : 0); cx += g.measureText(t).width; });
    g.restore();
  }
  function drawTag(T) {
    if (!T || !T.tagC) return;
    const g = T.tagC.getContext("2d"), W = T.tagC.width, H = T.tagC.height, s = SUBS[T.sub] || {};
    g.clearRect(0, 0, W, H);
    g.fillStyle = "rgba(255,253,246,.96)"; g.beginPath(); g.roundRect ? g.roundRect(26, 20, W - 52, H - 40, 16) : g.rect(26, 20, W - 52, H - 40); g.fill();
    g.strokeStyle = "rgba(194,24,91,.55)"; g.lineWidth = 5; g.stroke();
    g.fillStyle = "#17213A"; g.textAlign = "left"; g.textBaseline = "alphabetic";
    if (T.tagOx) { g.textAlign = "center"; drawF(g, T.tagOx, W / 2, 150, 60, W - 70); g.font = "600 40px Onest, system-ui, sans-serif"; g.fillStyle = "#56627D"; g.fillText("капнем", W / 2, 240); }
    else if (s.med) { drawF(g, s.med, W / 2, 150, 66, W - 70); g.font = "600 40px Onest, system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = "#56627D"; g.fillText(MED_SHORT[s.med], W / 2, 240); }
    else {
      g.textAlign = "center"; g.font = "700 120px Unbounded, Onest, system-ui, sans-serif"; g.fillText(T.letter, W / 2, T.showSub ? 150 : 205);
      if (T.showSub && s.f) { g.textAlign = "left"; g.fillStyle = "#56627D"; drawF(g, s.f, W / 2, 252, 48, W - 70); }
    }
    T.tagT.needsUpdate = true;
  }
  function nameTube(T, showSub) { T.showSub = !!showSub; drawTag(T); }
  const resEl = $("#res");
  const swatch = (T) => {
    if (T.mirTo > 0) return "linear-gradient(135deg,#f4f6f9,#8a929e 50%,#e7ebf0)";
    const e = T.lastE; if (!e) return "#" + T.colTo.getHexString();
    if (e.k === "ppt" || e.k === "gasppt") return e.c; if (e.ppt) return e.ppt; if (e.k === "gas") return "radial-gradient(circle at 35% 35%, #fff 0 22%, #cfe3f3 23% 100%)";
    return "#" + T.colTo.getHexString();
  };
  function renderRes() {
    const short = (T) => T.sh || (T.obs.includes(" — ") ? T.obs.split(" — ").pop() : T.obs).split(/[,:.(]/)[0].trim();
    resEl.innerHTML = tubes.filter((T) => T.obs).map((T) => { const s = SUBS[T.sub] || {}, nm = T.tagOx ? plainF(T.tagOx) : s.med ? MED_SHORT[s.med] : T.letter;
      return `<span><i style="background:${swatch(T)}"></i>${esc(nm)}<em>${esc(short(T))}${T.smell ? " · 👃" : ""}</em></span>`; }).join("");
  }
  function showObs(T) { renderRes(); }
  function clearObs(T) { T.obs = ""; T.sh = ""; T.smell = ""; T.eq = ""; T.lastE = null; renderRes(); }
  function mountLabels() { tubes.forEach(drawTag); renderRes(); }
  function updateLabels() {}

  /* ───────── коллекция реакций ───────── */
  const COL = collection(), COL_N = COL.length, CK = "hb.chl.col";
  let found = {}; try { found = JSON.parse(localStorage.getItem(CK) || "{}") || {}; } catch (e) { found = {}; }
  const toastEl = $("#toast"); let toastT = 0;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("on"), 2600); }
  const syncColN = () => { $("#colN").textContent = `${Object.keys(found).length}/${COL_N}`; };
  function discover(e, sub, rk) {
    if (!e || e.weak || e.k === "none") return;
    const k = colKey(e); if (found[k]) return;
    found[k] = [rk, sub]; try { localStorage.setItem(CK, JSON.stringify(found)); } catch (er) {}
    syncColN(); buzz("success"); toast(`✨ Новая реакция в коллекции · ${Object.keys(found).length}/${COL_N}`);
  }
  const KIND_W = { ppt: "осадок", gas: "газ", gasppt: "газ и осадок", col: "окраска", decol: "обесцвечивание", dis: "осадок растворяется", mirror: "зеркало на стенках" };
  const shortT = (e) => e.sh || (e.t.includes(" — ") ? e.t.split(" — ").pop() : e.t).split(/[,:(]/)[0].trim();
  const swE = (e) => e.k === "mirror" ? "linear-gradient(135deg,#f4f6f9,#8a929e 50%,#e7ebf0)" : e.k === "gas" ? "radial-gradient(circle at 30% 30%, #fff 0 14%, transparent 15%), radial-gradient(circle at 65% 60%, #fff 0 10%, transparent 11%), #cfe3f3"
    : e.k === "decol" ? `linear-gradient(135deg, ${REAGS.Br2.liq} 0 45%, #E8F3FA 55%)` : e.k === "dis" && !e.c ? "#E8F3FA" : e.c || e.col || e.ppt || "#E8F3FA";
  function openCol() {
    const n = Object.keys(found).length, v = $("#colv");
    v.innerHTML = `<div class="hd"><button class="ibtn" id="colX" type="button" aria-label="Закрыть">←</button><h2>Коллекция реакций</h2></div>
      <p class="sub">Открыто <b>${n} из ${COL_N}</b>. Каждая реакция открывается, когда ты сам проведёшь её в лаборантской, задании №24 или ОВР.</p>
      <div class="bar"><i style="width:${(n / COL_N) * 100}%"></i></div>
      ${[...new Set(COL.map((c) => c.r))].map((r) => { const cs = COL.filter((c) => c.r === r), got = cs.filter((c) => found[c.key]).length;
        return `<div class="grp"><b class="f">${htmlF(REAGS[r].f)}</b> <span>${esc(REAGS[r].name)} · ${got} из ${cs.length}</span></div><div class="cards">${cs.map((c) => { const f = found[c.key];
          if (!f) return `<div class="card lock"><div class="sw">?</div><small>${KIND_W[c.e.k] || "реакция"}${c.heat ? " · при нагревании" : ""}</small></div>`;
          const [rk, sb] = f; return `<div class="card"><div class="sw" style="background:${swE(c.e)}"></div><b>${esc(shortT(c.e)[0].toUpperCase() + shortT(c.e).slice(1))}</b><small>${htmlF(REAGS[rk].f)} + ${htmlF((SUBS[sb] || {}).f || "")}</small>${c.e.eq ? `<code>${esc(c.e.eq)}</code>` : ""}</div>`; }).join("")}</div>`; }).join("")}`;
    v.hidden = false; $("#colX").onclick = () => (v.hidden = true);
  }
  $("#colBtn").onclick = openCol;
  syncColN();
  // шрифты подгрузились — перерисовать этикетки (иначе на канве системный шрифт)
  try { document.fonts && document.fonts.ready.then(() => alive && allTubes.forEach(drawTag)); } catch (e) {}

  /* ───────── кадр ───────── */
  let last = performance.now(), tAll = 0;
  function stepTube(T, dt) {
    T.colNow.lerp(T.colTo, Math.min(1, dt * 1.6));
    const colored = Math.abs(T.colNow.r - COLORLESS.r) + Math.abs(T.colNow.g - COLORLESS.g) + Math.abs(T.colNow.b - COLORLESS.b);
    T.liqMat.color.copy(T.colNow); T.liqMat.emissive.copy(T.colNow).multiplyScalar(LOOK === "night" ? 0.45 * Math.min(1, colored * 1.5) : 0);
    T.liqMat.opacity = 0.48 + Math.min(0.46, colored * 0.75); T.liqMat.transmission = 0.6 - Math.min(0.5, colored * 0.8);
    T.cloudMat.opacity += (T.cloudTo - T.cloudMat.opacity) * Math.min(1, dt * 2.2);
    T.mirMat.opacity += (T.mirTo - T.mirMat.opacity) * Math.min(1, dt * 0.7);
    if (T.pptTo) { T.pptCol.lerp(T.pptTo, Math.min(1, dt * 0.8)); T.pMat.color.copy(T.pptCol); T.pMat.emissive.copy(T.pptCol); }
    // частицы осадка: опускаются и ложатся на дно горкой
    let n = 0;
    const floor = (x, z) => { const r = Math.hypot(x, z) / (TR * 0.86); return TR * 0.9 - Math.sqrt(Math.max(0, 1 - Math.min(1, r) ** 2)) * TR * 0.9 + 0.03; };
    for (const p of T.P) {
      if (p.dis) { p.fade -= dt * 0.9; if (p.fade <= 0) continue; }
      if (!p.rest) {
        p.vx *= 1 - dt * 1.6; p.vz *= 1 - dt * 1.6; p.vy += (-1.1 * p.sink - p.vy) * dt * 1.5;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        const rr = Math.hypot(p.x, p.z), lim = TR * 0.82; if (rr > lim) { p.x *= lim / rr; p.z *= lim / rr; }
        const f = floor(p.x, p.z) + p.s * 0.5;
        if (p.y <= f) { p.rest = true; p.y = f + Math.random() * Math.min(0.28, 0.04 + T.P.length / 1400); }
      }
      tmpP.set(p.x, p.y, p.z); const s = p.s * (p.dis ? Math.max(0, p.fade) : 1); tmpS.set(s * p.k[0], s * p.k[1], s * p.k[2]);
      tmpM.compose(tmpP, p.q, tmpS); T.parts.setMatrixAt(n++, tmpM);
    }
    T.P = T.P.filter((p) => !(p.dis && p.fade <= 0));
    T.parts.count = n; T.parts.instanceMatrix.needsUpdate = true;
    // пузырьки газа
    if (T.gasT > 0) { T.gasT -= dt; for (let k = 0; k < 3 && T.B.length < BN; k++) T.B.push({ x: (Math.random() - 0.5) * TR, y: 0.15 + Math.random() * 0.3, z: (Math.random() - 0.5) * TR, v: 0.9 + Math.random() * 1.2, s: 0.025 + Math.random() * 0.045 }); }
    if (T.boil) { if (Math.random() < dt * 8 && T.B.length < BN) T.B.push({ x: (Math.random() - 0.5) * TR * 0.8, y: 0.12, z: (Math.random() - 0.5) * TR * 0.8, v: 0.6 + Math.random() * 0.5, s: 0.02 + Math.random() * 0.02 }); }
    let m = 0;
    for (const b of T.B) { b.y += b.v * dt; b.x += Math.sin(tAll * 7 + b.y * 5) * 0.004; if (b.y > T.level - 0.03) { b.dead = true; continue; } tmpP.set(b.x, b.y, b.z); tmpS.setScalar(b.s); tmpM.compose(tmpP, tmpQ, tmpS); T.bubbles.setMatrixAt(m++, tmpM); }
    T.B = T.B.filter((b) => !b.dead); T.bubbles.count = m; T.bubbles.instanceMatrix.needsUpdate = true;
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; tAll += dt;
    for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i], k = Math.min(1, (now - a.t0) / a.ms); a.fn(k); if (k >= 1) { anims.splice(i, 1); a.res(); } }
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.vy -= 18 * dt; d.m.position.y += d.vy * dt; if (d.m.position.y <= d.stop) { scene.remove(d.m); drops.splice(i, 1); } }
    tubes.forEach((T) => stepTube(T, dt));
    lamps.forEach((L) => { if (!L.g.visible) return; const f = 1 + Math.sin(tAll * 23) * 0.06 + Math.sin(tAll * 37) * 0.04; L.fl.scale.set(1, f, 1); L.light.intensity = LOOK === "night" ? 2.2 * f : 1.2 * f; });
    controls.update(); renderer.render(scene, camera); updateLabels();
    if (alive) raf = requestAnimationFrame(frame);
  }

  // камера: вся сцена (склянки, штатив, пробирки с подписями) помещается между шапкой и карточкой снизу
  const SCENE_W = 10.2, SCENE_H = 8.9;
  function size() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h;
    const topPx = $("#modes").getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 8, sheetPx = sheet.getBoundingClientRect().height;
    const avail = Math.max(h * 0.3, h - topPx - sheetPx - 6), tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const d = Math.max((SCENE_H * h / avail) / 2 / tanH, (SCENE_W / 2) / (tanH * camera.aspect));
    camera.setViewOffset(w, h, 0, h / 2 - (topPx + avail / 2), w, h);
    const dir = size.done ? camera.position.clone().sub(controls.target).normalize() : new V3(0, 0.27, 0.96).normalize();
    if (!size.done || Math.abs(size.d - d) > 0.05) { camera.position.copy(controls.target).addScaledVector(dir, d); size.d = d; size.done = true; }
    controls.minDistance = d * 0.55; controls.maxDistance = d * 1.35;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(size); ro.observe(stage); ro.observe(sheet);

  /* ───────── режимы ───────── */
  let lastMode = null; try { lastMode = localStorage.getItem("hb.chl.mode"); } catch (e) {}
  let mode = ["lab", "task", "ovr"].includes(opts.mode) ? opts.mode : ["lab", "task", "ovr"].includes(lastMode) ? lastMode : "task";
  let heat = false;
  const setHeat = (on) => { heat = on; lamps.forEach((L) => { L.g.visible = on; if (!on) L.light.intensity = 0; }); tubes.forEach((T) => (T.boil = on)); };

  // «Определи вещество»
  const TK = "hb.chl.v1"; let st = {}; try { st = JSON.parse(localStorage.getItem(TK) || "{}") || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(TK, JSON.stringify(st)); } catch (e) {} };
  let run = null;
  function newRun() {
    const pairs = PAIRS.slice().sort(() => Math.random() - 0.5).slice(0, 8);
    run = { qs: pairs.map((p) => makeTask(p)).filter(Boolean), i: 0, ok: 0 };
  }
  function startQ() {
    const q = run.qs[run.i]; q.tested = {}; q.pick = null; q.done = false; q.res = {};
    resetTube(tubes[0], q.a); resetTube(tubes[1], q.b); tubes.forEach((T) => { nameTube(T, false); clearObs(T); });
    setHeat(false); placeBottles(q.opts); renderTask();
  }
  const fChip = (rk) => `<span class="f">${htmlF(REAGS[rk].f)}</span><small>${esc(REAGS[rk].name)}</small>`;
  function renderTask() {
    const q = run.qs[run.i], A = SUBS[q.a], B = SUBS[q.b];
    $("#ttl").textContent = "Задание 24";
    if (q.fin) return;
    sbody.innerHTML = `<span class="num">Задание ${run.i + 1} из ${run.qs.length} · №24</span>
      <p class="q">В пробирках <b>А</b> и <b>Б</b> — растворы <b>${htmlF(A.f)}</b> и <b>${htmlF(B.f)}</b>, какой где — неизвестно. Капни реактивами и найди тот, которым их можно различить.</p>
      <div class="h">Реактивы — нажми, чтобы капнуть в обе пробирки</div>
      <div class="chips">${q.opts.map((rk) => `<button type="button" class="chip${q.tested[rk] ? " tested" : ""}" data-r="${rk}" ${q.done ? "disabled" : ""}>${fChip(rk)}</button>`).join("")}</div>
      <div class="row"><button type="button" class="btn" id="heat" aria-pressed="${heat}" ${q.done ? "disabled" : ""}>🔥 ${heat ? "Греется" : "Нагреть"}</button><button type="button" class="btn" id="more" ${q.last && !q.done ? "" : "disabled"}>+ Ещё капля</button></div>
      <div class="log">${Object.entries(q.res).map(([rk, r]) => `<div><b class="f">${htmlF(REAGS[rk].f)}</b>: А — ${esc(r[0])} · Б — ${esc(r[1])}</div>`).join("")}</div>
      <div class="h">Каким реактивом можно различить ${htmlF(A.f)} и ${htmlF(B.f)}?</div>
      <div class="chips wrap">${q.opts.map((rk) => `<button type="button" class="chip" data-pick="${rk}" aria-pressed="${q.pick === rk}" ${q.done ? "disabled" : ""}><span class="f">${htmlF(REAGS[rk].f)}</span></button>`).join("")}</div>
      ${q.done ? feedback(q) : `<div class="row"><button type="button" class="btn primary" id="answer" ${q.pick ? "" : "disabled"}>Ответить</button></div>`}`;
    sbody.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => testReag(b.dataset.r)));
    sbody.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => { q.pick = b.dataset.pick; buzz("select"); renderTask(); }));
    const hb = $("#heat"); if (hb) hb.onclick = () => { setHeat(!heat); if (q.last) reHeat(q); renderTask(); };
    const mb = $("#more"); if (mb) mb.onclick = () => q.last && testReag(q.last, true);
    const ab = $("#answer"); if (ab) ab.onclick = () => answer(q);
    const nb = $("#next"); if (nb) nb.onclick = next;
    requestAnimationFrame(size);
  }
  async function testReag(rk, more = false) {
    const q = run.qs[run.i]; if (busy || q.done) return;
    if (!more || q.last !== rk) { resetTube(tubes[0], q.a); resetTube(tubes[1], q.b); tubes.forEach(clearObs); }   // каждый реактив — в свежие порции растворов
    q.last = rk; q.tested[rk] = 1; renderTask();
    const r = await runDrops(rk, [0, 1], heat);
    q.res[rk] = r.map((e) => e.t); renderTask();
  }
  function reHeat(q) {   // нагрели или остудили после того, как капнули
    tubes.forEach((T) => { if (!T.reag) return; const e = react(T.sub, T.reag, { heat, n: T.n[T.reag] }); const was = T.obs; if (e.t !== was) { applyEffect(T, e, T.reag); showObs(T); } });
    if (q.last) q.res[q.last] = tubes.map((T) => T.obs || "без видимых изменений");
  }
  function answer(q) {
    q.done = true; q.right2 = canTell(q.a, q.b, q.pick) === true; if (q.right2) run.ok++;
    buzz(q.right2 ? "success" : "error"); setTimeout(() => sheet.scrollTo({ top: sheet.scrollHeight, behavior: "smooth" }), 60);
    try { if (q.right2 && window.hbLab && window.hbLab.right) window.hbLab.right("chl24", null, "chl24:" + [q.a, q.b].sort().join("/")); } catch (e) {}
    renderTask();
  }
  function explain(q, rk) {
    const ea = react(q.a, rk, { heat: true, n: 3 }), eb = react(q.b, rk, { heat: true, n: 3 }), e1 = react(q.a, rk, { heat: true, n: 1 }), f1 = react(q.b, rk, { heat: true, n: 1 });
    const A = SUBS[q.a], B = SUBS[q.b], one = (S, e) => `<b class="f">${htmlF(S.f)}</b> — ${esc(e.t)}${e.eq ? `<span class="eq">${esc(e.eq)}</span>` : ""}`;
    const useMore = ea.t !== e1.t || eb.t !== f1.t;
    const ln = (x) => `<span class="ln">${x}</span>`;
    return `<b class="f">${htmlF(REAGS[rk].f)}</b>${ln(one(A, e1))}${ln(one(B, f1))}${useMore ? `<span class="ln"><i>В избытке:</i></span>${ln(one(A, ea))}${ln(one(B, eb))}` : ""}`;
  }
  function feedback(q) {
    const ok = q.right2, right = q.ok.filter((r) => q.opts.includes(r));
    return `<div class="fb ${ok ? "ok" : "bad"}"><b>${ok ? "Верно ✓" : "Не тот реактив ✗"}</b>
      <p>${explain(q, right[0] || q.right)}</p>${ok ? "" : `<p>${explain(q, q.pick)}<span class="ln"><b>Результат одинаковый — этим реактивом не различить.</b></span></p>`}</div>
      <div class="row"><button type="button" class="btn primary" id="next">${run.i + 1 < run.qs.length ? "Дальше →" : "Итог"}</button></div>`;
  }
  function next() {
    if (run.i + 1 < run.qs.length) { run.i++; startQ(); return; }
    st.best = Math.max(st.best || 0, run.ok); save();
    sbody.innerHTML = `<span class="num">Итог</span><p class="q">Верно с первого раза: <b>${run.ok} из ${run.qs.length}</b>${st.best ? ` · лучший результат ${st.best}` : ""}</p>
      <p class="q" style="font-size:14px;color:var(--ink-2)">В задании 24 ловушка — реактив, который даёт одинаковый результат с обоими веществами: осадок есть и там, и там. Различает только тот, что ведёт себя по-разному.</p>
      <div class="row"><button type="button" class="btn primary" id="again">Ещё 8 заданий</button><button type="button" class="btn" id="tolab">В лаборантскую</button></div>`;
    $("#again").onclick = () => { newRun(); startQ(); };
    $("#tolab").onclick = () => setMode("lab");
    requestAnimationFrame(size);
  }

  // «Лаборантская»
  const LAB = { a: "CuSO4", b: "FeCl3", r: "NaOH" };
  const subOpts = (sel) => [["in", "Неорганические"], ["org", "Органические"]].map(([g, t]) => `<optgroup label="${t}">${Object.entries(SUBS).filter(([, s]) => s.g === g).map(([k, s]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${plainF(s.f)} — ${s.name}</option>`).join("")}</optgroup>`).join("");
  function startLab() {
    resetTube(tubes[0], LAB.a); resetTube(tubes[1], LAB.b); tubes.forEach((T) => { nameTube(T, true); clearObs(T); });
    setHeat(false); placeBottles([LAB.r]); renderLab();
  }
  function renderLab() {
    $("#ttl").textContent = "Лаборантская";
    const eqs = tubes.filter((T) => T.obs).map((T) => `<div><b class="f">${T.letter} · ${htmlF(SUBS[T.sub].f)}</b>: ${esc(T.obs)}${T.eq ? `<span class="eq">${esc(T.eq)}</span>` : ""}</div>`).join("");
    sbody.innerHTML = `<span class="num">Свободные опыты</span>
      <div class="two" style="margin-top:8px"><label>Пробирка А<select id="sa">${subOpts(LAB.a)}</select></label><label>Пробирка Б<select id="sb">${subOpts(LAB.b)}</select></label></div>
      <div class="h">Реактив</div>
      <div class="chips">${Object.keys(REAGS).filter((rk) => !REAGS[rk].ovrOnly).map((rk) => `<button type="button" class="chip" data-lr="${rk}" aria-pressed="${LAB.r === rk}">${fChip(rk)}</button>`).join("")}</div>
      <div class="row"><button type="button" class="btn primary" data-d="0">Капнуть в А</button><button type="button" class="btn primary" data-d="1">Капнуть в Б</button><button type="button" class="btn" data-d="2">В обе</button>
        <button type="button" class="btn" id="heat" aria-pressed="${heat}">🔥 ${heat ? "Греется" : "Нагреть"}</button><button type="button" class="btn" id="fresh">🧪 Чистые пробирки</button></div>
      <div class="log">${eqs}</div>`;
    $("#sa").onchange = (e) => { LAB.a = e.target.value; resetTube(tubes[0], LAB.a); nameTube(tubes[0], true); clearObs(tubes[0]); renderLab(); };
    $("#sb").onchange = (e) => { LAB.b = e.target.value; resetTube(tubes[1], LAB.b); nameTube(tubes[1], true); clearObs(tubes[1]); renderLab(); };
    sbody.querySelectorAll("[data-lr]").forEach((b) => (b.onclick = () => { LAB.r = b.dataset.lr; placeBottles([LAB.r]); buzz("select"); renderLab(); }));
    sbody.querySelectorAll("[data-d]").forEach((b) => (b.onclick = async () => { const d = +b.dataset.d; await runDrops(LAB.r, d === 2 ? [0, 1] : [d], heat); renderLab(); }));
    $("#heat").onclick = () => { setHeat(!heat); tubes.forEach((T) => { if (!T.reag) return; const e = react(T.sub, T.reag, { heat, n: T.n[T.reag] }); if (e.t !== T.obs) { applyEffect(T, e, T.reag); showObs(T); } }); renderLab(); };
    $("#fresh").onclick = () => { resetTube(tubes[0], LAB.a); resetTube(tubes[1], LAB.b); tubes.forEach(clearObs); renderLab(); };
    requestAnimationFrame(size);
  }

  // «ОВР · среда»: три пробирки, в каждую капаем окислитель; сначала угадываешь, что увидишь
  const OK_KEY = "hb.chl.ovr"; let ovDone = {}; try { ovDone = JSON.parse(localStorage.getItem(OK_KEY) || "{}") || {}; } catch (e) { ovDone = {}; }
  let OV = { i: 0, done: false, pick: [null, null, null] };
  // начать с первого непройденного набора
  { const k = OVR.findIndex((o) => !ovDone[o.key]); OV.i = k < 0 ? 0 : k; }
  const MED_W = { H2SO4: "Кислая", H2O: "Нейтральная", KOH: "Щелочная" };
  const sameOx = (o) => o.oxs.every((x) => x === o.oxs[0]), sameSub = (o) => o.subs.every((x) => x === o.subs[0]);
  const rowName = (o, i) => sameSub(o) ? `капнем ${htmlF(REAGS[o.oxs[i]].f)}` : sameOx(o) ? MED_W[SUBS[o.subs[i]].med] : `${MED_W[SUBS[o.subs[i]].med]} + ${htmlF(REAGS[o.oxs[i]].f)}`;
  function startOvr() {
    const o = OVR[OV.i]; OV.done = false; OV.pick = [null, null, null];
    o.subs.forEach((sk, i) => { const T = tubes[i]; T.tagOx = sameSub(o) ? REAGS[o.oxs[i]].f : null; resetTube(T, sk); nameTube(T, true); clearObs(T); });
    setHeat(false); placeBottles([...new Set(o.oxs)]); renderOvr();
  }
  async function ovRun(o) {
    for (const ox of [...new Set(o.oxs)]) await runDrops(ox, o.oxs.map((x, i) => (x === ox ? i : -1)).filter((i) => i >= 0), false);
  }
  function renderOvr() {
    const o = OVR[OV.i], S0 = SUBS[o.subs[0]];
    const truth = o.subs.map((_, i) => ovTruth(o, i)), picked = OV.pick.some(Boolean);
    const hit = (i) => OV.pick[i] && truth[i].includes(OV.pick[i]);
    const ok = OV.done && picked ? [0, 1, 2].filter(hit).length : 0;
    const nDone = OVR.filter((x) => ovDone[x.key]).length;
    $("#ttl").textContent = "ОВР";
    const q = o.q || `Во всех трёх пробирках <b>${htmlF(S0.f)}</b>, только среда разная. Угадай, что будет с <b>${htmlF(REAGS[o.oxs[0]].f)}</b> в каждой, и капни.`;
    const go = sameOx(o) ? `Капнуть ${htmlF(REAGS[o.oxs[0]].f)} во все три` : "Капнуть окислители";
    sbody.innerHTML = `<span class="num">ОВР · набор ${OV.i + 1} из ${OVR.length} · пройдено ${nDone}</span>
      <div class="chips" style="margin-top:8px">${OVR.map((x, i) => `<button type="button" class="chip" data-ov="${i}" aria-pressed="${i === OV.i}"><span class="f">${ovDone[x.key] ? "✓ " : ""}${esc(x.title)}</span></button>`).join("")}</div>
      <p class="q">${q}</p>
      <div class="pred">${o.subs.map((sk, i) => `<div class="pr"><b>${i + 1} · ${rowName(o, i)}</b><div class="chips">${o.cats.map((c) => {
        const st = OV.done && OV.pick[i] === c ? (truth[i].includes(c) ? " right" : " wrong") : OV.done && !hit(i) && c === truth[i][0] ? " truth" : "";
        return `<button type="button" class="chip mini${st}" data-pi="${i}" data-pc="${esc(c)}" aria-pressed="${OV.pick[i] === c}" ${OV.done ? "disabled" : ""}>${esc(c)}</button>`; }).join("")}</div></div>`).join("")}</div>
      ${OV.done ? "" : `<div class="row"><button type="button" class="btn primary" id="ovgo">${go}</button>${picked ? "" : `<span class="hint">можно и без догадки</span>`}</div>`}
      ${OV.done ? `${picked ? `<div class="fb ${ok === 3 ? "ok" : "bad"}"><b>${ok === 3 ? "Все три угадал ✓" : `Угадал ${ok} из 3`}</b></div>` : ""}
      <div class="log">${tubes.map((T, i) => `<div><b class="f">${i + 1} · ${rowName(o, i)}</b>: ${esc(T.obs || "без видимых изменений")}${T.eq ? `<span class="eq">${esc(T.eq)}</span>` : ""}</div>`).join("")}</div>
      <div class="fb ok"><b>Запомни</b><p>${esc(o.rule)}</p></div>
      <div class="row"><button type="button" class="btn" id="ovfresh">🧪 Ещё раз</button>${OV.i + 1 < OVR.length ? `<button type="button" class="btn primary" id="ovnext">Следующий набор →</button>` : `<button type="button" class="btn primary" id="ovfirst">К первому набору</button>`}</div>` : ""}`;
    sbody.querySelectorAll("[data-ov]").forEach((b) => (b.onclick = () => { if (busy) return; OV.i = +b.dataset.ov; buzz("select"); startOvr(); sheet.scrollTo({ top: 0 }); }));
    sbody.querySelectorAll("[data-pi]").forEach((b) => (b.onclick = () => { if (busy) return; const i = +b.dataset.pi; OV.pick[i] = OV.pick[i] === b.dataset.pc ? null : b.dataset.pc; buzz("select"); renderOvr(); }));
    const gb = $("#ovgo"); if (gb) gb.onclick = async () => {
      if (busy || OV.done) return;
      gb.disabled = true; await ovRun(o); OV.done = true;
      if (OV.pick.some(Boolean)) { const n = [0, 1, 2].filter(hit).length; buzz(n === 3 ? "success" : "error");
        if (n === 3) { ovDone[o.key] = 1; try { localStorage.setItem(OK_KEY, JSON.stringify(ovDone)); } catch (e) {} }
        try { if (n === 3 && window.hbLab && window.hbLab.right) window.hbLab.right("chlovr", null, "chlovr:" + o.key); } catch (e) {} }
      renderOvr(); setTimeout(() => { const lg = sbody.querySelector(".log"); if (lg) sheet.scrollTo({ top: lg.offsetTop - 60, behavior: "smooth" }); }, 80);
    };
    const fb = $("#ovfresh"); if (fb) fb.onclick = () => { if (!busy) { startOvr(); sheet.scrollTo({ top: 0 }); } };
    const nb = $("#ovnext"); if (nb) nb.onclick = () => { if (busy) return; OV.i++; startOvr(); sheet.scrollTo({ top: 0 }); };
    const f1 = $("#ovfirst"); if (f1) f1.onclick = () => { if (busy) return; OV.i = 0; startOvr(); sheet.scrollTo({ top: 0 }); };
    { const row = sbody.querySelector(".chips"), act = row && row.querySelector('[aria-pressed="true"]'); if (act) row.scrollLeft = act.offsetLeft - (row.clientWidth - act.offsetWidth) / 2 - row.offsetLeft; }
    requestAnimationFrame(size);
  }

  function setMode(m) {
    mode = m; try { localStorage.setItem("hb.chl.mode", m); } catch (e) {} allTubes.forEach((T) => (T.tagOx = null)); sh.querySelectorAll("#modes button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    layout(m === "ovr" ? 3 : 2);
    if (m === "task") { if (!run) newRun(); startQ(); } else if (m === "ovr") startOvr(); else startLab();
  }
  sh.querySelectorAll("#modes button").forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));

  // тап по склянке в сцене — капнуть ею
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let downAt = null;
  renderer.domElement.addEventListener("pointerdown", (e) => (downAt = [e.clientX, e.clientY]));
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8) return;
    const r = renderer.domElement.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera); const hit = ray.intersectObjects(bottles, true)[0]; if (!hit) return;
    const rk = hit.object.userData.rk; if (mode === "task") testReag(rk); else if (mode === "ovr") $("#ovgo") && $("#ovgo").click(); else runDrops(rk, [0, 1], heat).then(renderLab);
  });

  $("#lookBtn").onclick = () => setLook(LOOK === "night" ? "lab" : "night");
  // карточка снизу: свёрнута — больше места пробиркам; ручкой разворачивается
  $("#grip").onclick = () => { const full = sheet.classList.toggle("full"); $("#grip").setAttribute("aria-expanded", String(full)); buzz("select"); };
  $("#back").onclick = () => close();
  function close() {
    if (!alive) return; alive = false; cancelAnimationFrame(raf); ro.disconnect();
    try { renderer.dispose(); pmrem.dispose(); } catch (e) {}
    try { if (tgw && swipesWere && tgw.enableVerticalSwipes) tgw.enableVerticalSwipes(); } catch (e) {}
    document.body.style.overflow = prevOverflow; host.remove(); active = null; if (opts.onClose) opts.onClose();
  }

  mountLabels(); setLook(LOOK); setMode(mode); size();
  raf = requestAnimationFrame(frame);
  const ff = (sec) => { for (let t = 0; t < sec; t += 0.033) tubes.forEach((T) => stepTube(T, 0.033)); renderRes(); };
  active = { close, setMode, setLook, _dbg: { ff, OV, startOvr, OVR, OVR_N: OVR.length, ovTruth, SUBS, REAGS, get busy() { return busy; }, tubes, runDrops, react, get run() { return run; }, testReag, setHeat, LAB, renderLab, placeBottles } };
  window.__chl = active;
  return active;
}
