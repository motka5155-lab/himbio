/* Химбио без зубрёжки · 3D-лаборатория «Клетка» (v4.8). Собрано build_lab3d.py из концепта claude/3d/kletka-3d.src.html.
   three.js r160 лежит рядом: vendor/three-r160. Открывается из модуля «Строение клетки» и по ссылке ?start=cell3d. */
import * as THREE from "./vendor/three-r160/three.module.min.js";
import { OrbitControls } from "./vendor/three-r160/OrbitControls.js";
import { RoomEnvironment } from "./vendor/three-r160/RoomEnvironment.js";
import { mergeGeometries, mergeVertices } from "./vendor/three-r160/BufferGeometryUtils.js";

const MOLS = {"atp":{"atoms":[["N",-6.556,-0.762,2.495],["C",-5.734,-1.162,1.451],["N",-6.264,-1.94,0.48],["C",-5.464,-2.339,-0.532],["N",-4.164,-2.042,-0.739],["C",-3.691,-1.261,0.245],["C",-4.386,-0.782,1.344],["N",-3.573,0.014,2.124],["C",-2.399,-0.016,1.528],["N",-2.427,-0.753,0.374],["C",-1.336,-0.992,-0.556],["O",-0.134,-0.359,-0.037],["C",0.321,0.602,-1.015],["C",0.94,1.818,-0.332],["O",2.121,1.415,0.347],["P",3.087,2.557,0.91],["O",2.398,3.744,1.494],["O",3.94,2.983,-0.386],["O",4.161,1.841,1.823],["P",5.188,0.727,1.35],["O",5.955,0.08,2.461],["O",6.098,1.502,0.286],["O",4.356,-0.302,0.475],["P",4.909,-1.76,0.19],["O",6.21,-1.876,-0.521],["O",4.874,-2.491,1.609],["O",3.681,-2.485,-0.531],["C",-0.911,0.957,-1.838],["O",-0.584,1.501,-3.108],["C",-1.581,-0.401,-1.953],["O",-0.913,-1.184,-2.956],["H",-6.221,0.052,2.997],["H",-7.538,-0.811,2.261],["H",-5.929,-2.979,-1.277],["H",-1.504,0.477,1.89],["H",-1.16,-2.073,-0.58],["H",1.087,0.108,-1.627],["H",1.191,2.588,-1.069],["H",0.252,2.236,0.409],["H",3.739,3.919,-0.6],["H",5.574,1.971,-0.397],["H",5.649,-2.233,2.155],["H",2.945,-2.633,0.09],["H",-1.553,1.66,-1.294],["H",-1.416,1.775,-3.538],["H",-2.63,-0.325,-2.253],["H",-0.607,-0.565,-3.648]],"bonds":[[0,1,1],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,6,1],[6,7,1],[7,8,2],[8,9,1],[9,10,1],[10,11,1],[11,12,1],[12,13,1],[13,14,1],[14,15,1],[15,16,2],[15,17,1],[15,18,1],[18,19,1],[19,20,2],[19,21,1],[19,22,1],[22,23,1],[23,24,2],[23,25,1],[23,26,1],[12,27,1],[27,28,1],[27,29,1],[29,30,1],[6,1,2],[29,10,1],[9,5,1],[0,31,1],[0,32,1],[3,33,1],[8,34,1],[10,35,1],[12,36,1],[13,37,1],[13,38,1],[17,39,1],[21,40,1],[25,41,1],[26,42,1],[27,43,1],[28,44,1],[29,45,1],[30,46,1]],"groups":["aden","aden","aden","aden","aden","aden","aden","aden","aden","aden","rib","rib","rib","rib","pa","pa","pa","pa","pb","pb","pb","pb","pg","pg","pg","pg","pg","rib","rib","rib","rib","aden","aden","aden","aden","rib","rib","rib","rib","pa","pb","pg","pg","rib","rib","rib","rib"],"hiBonds":[[18,15],[18,19],[22,19],[22,23]]},"glucose":{"atoms":[["O",1.916,-2.849,0.135],["C",1.709,-1.533,0.653],["C",0.897,-0.688,-0.342],["O",-0.401,-1.273,-0.593],["C",-1.469,-0.715,0.156],["O",-1.229,-0.887,1.542],["C",-1.671,0.778,-0.191],["O",-2.588,0.946,-1.29],["C",-0.35,1.45,-0.591],["O",-0.372,2.85,-0.265],["C",0.827,0.782,0.111],["O",2.04,1.469,-0.214],["H",2.477,-3.318,0.775],["H",1.19,-1.636,1.609],["H",2.691,-1.082,0.829],["H",1.42,-0.743,-1.306],["H",-2.379,-1.269,-0.099],["H",-1.414,-1.828,1.713],["H",-2.125,1.299,0.66],["H",-2.297,0.348,-2.005],["H",-0.2,1.41,-1.677],["H",-1.193,3.204,-0.659],["H",0.708,0.865,1.198],["H",1.814,2.421,-0.15]],"bonds":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[4,6,1],[6,7,1],[6,8,1],[8,9,1],[8,10,1],[10,11,1],[10,2,1],[0,12,1],[1,13,1],[1,14,1],[2,15,1],[4,16,1],[5,17,1],[6,18,1],[7,19,1],[8,20,1],[9,21,1],[10,22,1],[11,23,1]]},"water":{"atoms":[["O",0.007,0.398,0.0],["H",-0.767,-0.185,0.0],["H",0.76,-0.213,0.0]],"bonds":[[0,1,1],[0,2,1]]}};
const CSS = "\n/* Layout: one-screen 3D lab — full-bleed stage, thin top bar over it, glass bottom sheet. Tokens follow the «Химбио без зубрёжки» trainer. */\n:host {\n  --bg: #F5F7FB;\n  --ink: #17213A;\n  --ink-2: #56627D;\n  --line: #D6DDEA;\n  --glass: rgba(255, 255, 255, .84);\n  --glass-line: rgba(23, 33, 58, .09);\n  --accent: #C2185B;\n  --accent-soft: #FBE4EE;\n  --on-accent: #FFFFFF;\n  --ok: #24804E;\n  --ok-soft: #E1F3E8;\n  --bad: #C0392B;\n  --bad-soft: #FBE6E3;\n  --trap: #8A5A00;\n  --trap-soft: #FFF3D6;\n  --stage-1: #FFFFFF;\n  --stage-2: #E9EEF8;\n  --stage-grid: rgba(120, 140, 190, .11);\n  --shadow: 0 1px 2px rgba(23, 33, 58, .08), 0 8px 24px rgba(23, 33, 58, .10);\n  --font-display: \"Unbounded\", \"Onest\", system-ui, sans-serif;\n  --font-body: \"Onest\", system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n  --font-mono: \"IBM Plex Mono\", ui-monospace, Menlo, Consolas, monospace;\n}\n@media (prefers-color-scheme: dark) {\n  :host(:not([data-theme=\"light\"])) {\n    --bg: #0E1322; --ink: #E8ECF6; --ink-2: #9AA6C2; --line: #2A3452;\n    --glass: rgba(17, 23, 40, .84); --glass-line: rgba(255, 255, 255, .09);\n    --accent: #F06292; --accent-soft: #3A1A2A; --on-accent: #1A0B12;\n    --ok: #4CC28A; --ok-soft: #14301F; --bad: #FF7A6B; --bad-soft: #3A1A17; --trap: #FFCB6B; --trap-soft: #33280F;\n    --stage-1: #1A2440; --stage-2: #0E1322; --stage-grid: rgba(140, 160, 210, .07);\n    --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 8px 24px rgba(0, 0, 0, .35);\n    color-scheme: dark;\n  }\n}\n:host([data-theme=\"dark\"]) {\n  --bg: #0E1322; --ink: #E8ECF6; --ink-2: #9AA6C2; --line: #2A3452;\n  --glass: rgba(17, 23, 40, .84); --glass-line: rgba(255, 255, 255, .09);\n  --accent: #F06292; --accent-soft: #3A1A2A; --on-accent: #1A0B12;\n  --ok: #4CC28A; --ok-soft: #14301F; --bad: #FF7A6B; --bad-soft: #3A1A17; --trap: #FFCB6B; --trap-soft: #33280F;\n  --stage-1: #1A2440; --stage-2: #0E1322; --stage-grid: rgba(140, 160, 210, .07);\n  --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 8px 24px rgba(0, 0, 0, .35);\n  color-scheme: dark;\n}\n/* стиль «Микроскоп»: тёмное поле, флуоресценция */\n.app[data-look=\"scope\"] {\n  --ink: #E6F0FF; --ink-2: #8FA3C7; --line: #22314F;\n  --glass: rgba(6, 10, 20, .80); --glass-line: rgba(120, 190, 255, .16);\n  --accent: #4DE1FF; --accent-soft: rgba(77, 225, 255, .14); --on-accent: #03121A;\n  --ok: #3DDC97; --ok-soft: rgba(61, 220, 151, .14); --bad: #FF6B8B; --bad-soft: rgba(255, 107, 139, .14);\n  --trap: #FFD166; --trap-soft: rgba(255, 209, 102, .12);\n  --stage-1: #0D1A33; --stage-2: #020409; --stage-grid: transparent;\n  color-scheme: dark;\n}\n:host { all: initial; position: fixed; inset: 0; z-index: 3000; display: block; }\n[hidden] { display: none !important; }\n*, *::before, *::after { box-sizing: border-box; }\n.app { position: relative; height: 100%; overflow: hidden; background: var(--stage-2); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; }\n.stage {\n  position: absolute; inset: 0;\n  background:\n    linear-gradient(var(--stage-grid) 1px, transparent 1px) 0 0 / 22px 22px,\n    linear-gradient(90deg, var(--stage-grid) 1px, transparent 1px) 0 0 / 22px 22px,\n    radial-gradient(120% 75% at 50% 38%, var(--stage-1), var(--stage-2));\n  transition: background .4s;\n}\n.stage canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; touch-action: none; outline: none; }\n.fade { position: absolute; inset: 0; background: var(--stage-2); opacity: 0; pointer-events: none; transition: opacity .22s ease; z-index: 4; }\n.fade.on { opacity: 1; }\n\n/* подписи органоидов */\n.labels { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }\n.lbl { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; will-change: transform; transition: opacity .25s; }\n.lbl i { width: 7px; height: 7px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 2px var(--stage-1); flex: none; }\n.lbl span { font: 600 11px/1 var(--font-body); padding: 5px 8px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); color: var(--ink); box-shadow: var(--shadow); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }\n.lbl.flip { flex-direction: row-reverse; }\n.lbl.hi span { background: var(--accent); color: var(--on-accent); border-color: transparent; }\n.lbl.off { opacity: 0; }\n.labels.hidden .lbl { opacity: 0; }\n\n/* верхняя панель */\n.top { position: absolute; z-index: 5; top: 0; left: 0; right: 0; padding-top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 12px); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 10px; pointer-events: none; }\n.top > * { pointer-events: auto; }\n.row { display: flex; align-items: center; gap: 10px; min-width: 0; }\n.iconbtn { flex: none; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); display: grid; place-items: center; box-shadow: var(--shadow); cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }\n.iconbtn svg { width: 18px; height: 18px; }\n.ttl { min-width: 0; flex: 1; }\n.eyebrow { font: 500 10px/1.2 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }\nh1 { margin: 2px 0 0; font: 600 18px/1.15 var(--font-display); letter-spacing: -.01em; text-wrap: balance; overflow-wrap: anywhere; }\n.pill { flex: none; height: 34px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); font: 600 12px/1 var(--font-body); box-shadow: var(--shadow); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }\n.pill[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); border-color: transparent; }\n.app[data-look=\"scope\"] .pill[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.crumbs { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; font: 500 11px/1 var(--font-mono); letter-spacing: .04em; color: var(--ink-2); text-transform: uppercase; }\n.crumbs button { font: inherit; letter-spacing: inherit; text-transform: inherit; color: var(--ink-2); background: none; border: 0; padding: 4px 2px; cursor: pointer; }\n.crumbs button:last-child { color: var(--ink); cursor: default; }\n.crumbs .sep { opacity: .5; }\n.seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); box-shadow: var(--shadow); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); max-width: 100%; overflow-x: auto; scrollbar-width: none; }\n.seg::-webkit-scrollbar { display: none; }\n.seg button { flex: none; border: 0; background: none; color: var(--ink-2); font: 600 12px/1 var(--font-body); padding: 8px 11px; border-radius: 999px; cursor: pointer; white-space: nowrap; }\n.seg button[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); }\n.app[data-look=\"scope\"] .seg button[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.looks { display: flex; align-items: center; gap: 8px; min-width: 0; }\n.looks .seg { min-width: 0; }\n#topicSel { flex: none; max-width: 42%; height: 34px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); font: 600 12px/1 var(--font-body); padding: 0 8px; }\n.iconbtn[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); border-color: transparent; }\n.looks .tag { font: 500 10px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }\n\n/* нижняя шторка */\n.bottom { position: absolute; z-index: 5; left: 0; right: 0; bottom: 0; padding-bottom: calc(var(--tg-bottom, env(safe-area-inset-bottom, 0px)) + 12px); padding-left: max(12px, env(safe-area-inset-left, 0px)); padding-right: max(12px, env(safe-area-inset-right, 0px)); display: grid; gap: 8px; pointer-events: none; }\n.bottom > * { pointer-events: auto; }\n.modes { justify-self: center; }\n.sheet { background: var(--glass); border: 1px solid var(--glass-line); border-radius: 22px; box-shadow: var(--shadow); padding: 14px 16px 14px; max-height: min(46vh, 380px); overflow-y: auto; backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2); max-width: 560px; width: 100%; justify-self: center; box-sizing: border-box; }\n.hint { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 14px; font: 500 12px/1.3 var(--font-body); color: var(--ink-2); }\n.hint b { color: var(--ink); font-weight: 600; }\n.chip { display: inline-flex; align-items: center; gap: 6px; font: 500 10px/1 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; padding: 5px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); }\n.chip i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n.shead { display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.fold { flex: none; width: 30px; height: 30px; margin: -4px -6px -4px 0; border-radius: 50%; border: 0; background: transparent; color: var(--ink-2); display: grid; place-items: center; cursor: pointer; }\n.fold svg { width: 18px; height: 18px; transition: transform .2s; }\n.sheet.min .fold svg { transform: rotate(180deg); }\n.sheet.min .body, .sheet.min .chips { display: none; }\n.sheet h2 { margin: 8px 0 6px; font: 600 17px/1.2 var(--font-display); letter-spacing: -.01em; text-wrap: balance; }\n.sheet p { margin: 0; font: 400 14px/1.45 var(--font-body); color: var(--ink); }\n.trap { margin-top: 10px; padding: 9px 11px; border-radius: 12px; background: var(--trap-soft); color: var(--ink); font: 400 13px/1.4 var(--font-body); }\n.trap b { display: block; font: 500 10px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--trap); margin-bottom: 5px; }\n.part { margin-top: 10px; padding: 9px 11px; border-radius: 12px; border: 1px dashed var(--line); font: 400 13px/1.4 var(--font-body); }\n.part b { font-weight: 600; }\n.acts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }\n.btn { border: 0; border-radius: 12px; padding: 11px 14px; font: 600 13px/1 var(--font-body); cursor: pointer; background: var(--accent); color: var(--on-accent); }\n.btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }\n.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }\n.chips button { border: 1px solid var(--line); background: transparent; color: var(--ink); font: 600 12px/1 var(--font-body); padding: 8px 10px; border-radius: 999px; cursor: pointer; }\n.chips button[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); border-color: transparent; }\n.app[data-look=\"scope\"] .chips button[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.qhead { display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.qcount { font: 500 11px/1 var(--font-mono); color: var(--ink-2); letter-spacing: .06em; }\n.verdict { margin-top: 10px; padding: 9px 11px; border-radius: 12px; font: 500 13px/1.4 var(--font-body); }\n.verdict.ok { background: var(--ok-soft); color: var(--ok); }\n.verdict.bad { background: var(--bad-soft); color: var(--bad); }\n.shake { animation: shake .35s; }\n@keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }\nbutton:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n.nogl { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; font: 500 14px/1.5 var(--font-body); color: var(--ink-2); }\n@media (min-width: 900px) {\n  .bottom { left: auto; width: 420px; right: 16px; bottom: 16px; }\n  h1 { font-size: 22px; }\n}\n@media (prefers-reduced-motion: reduce) { .lbl, .fade, .stage { transition: none; } .shake { animation: none; } }\n";
const HTML = "<div class=\"app\" id=\"app\" data-look=\"notebook\">\n  <div class=\"stage\" id=\"stage\"></div>\n  <div class=\"labels\" id=\"labels\"></div>\n  <div class=\"fade\" id=\"fade\"></div>\n\n  <header class=\"top\">\n    <div class=\"row\">\n      <button class=\"iconbtn\" id=\"back\" aria-label=\"Назад\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 5l-7 7 7 7\"/></svg></button>\n      <div class=\"ttl\">\n        <div class=\"eyebrow\" id=\"eyebrow\">Биология · 3D-лаборатория</div>\n        <h1 id=\"title\">Животная клетка</h1>\n      </div>\n      <button class=\"pill\" id=\"labelsBtn\" type=\"button\" aria-pressed=\"true\">Подписи</button>\n    </div>\n    <nav class=\"crumbs\" id=\"crumbs\" aria-label=\"Уровень\"></nav>\n    <div class=\"looks\">\n      <div class=\"seg\" id=\"types\" role=\"group\" aria-label=\"Какая клетка\"></div>\n      <button class=\"iconbtn\" id=\"lookBtn\" type=\"button\" aria-pressed=\"false\" aria-label=\"Стиль «Микроскоп»\" title=\"Тетрадь / Микроскоп\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 4a8 8 0 0 1 0 16z\" fill=\"currentColor\"/></svg></button>\n    </div>\n  </header>\n\n  <section class=\"bottom\">\n    <div class=\"seg modes\" id=\"modes\" role=\"group\" aria-label=\"Режим\">\n      <button type=\"button\" data-mode=\"learn\" aria-pressed=\"true\">Изучать</button>\n      <button type=\"button\" data-mode=\"quiz\" aria-pressed=\"false\">Найди органоид</button>\n    </div>\n    <div class=\"sheet\" id=\"sheet\" aria-live=\"polite\"></div>\n  </section>\n</div>";

let active = null;
export async function open(opts = {}) {
  if (active) return active;
  const host = document.createElement("div");
  host.className = "l3d-host";
  const sh = host.attachShadow({ mode: "open" });
  sh.innerHTML = `<style>${CSS}</style>${HTML}`;
  const syncTheme = () => {
    const t = document.documentElement.dataset.theme;
    host.dataset.theme = t === "dark" || t === "light" ? t : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  };
  syncTheme();
  const mo = new MutationObserver(syncTheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.body.appendChild(host);
  const prevOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
  // Телеграм: свайп вниз не должен сворачивать приложение, пока крутишь клетку; «Назад» ведёт по уровням
  const tgw = window.Telegram && window.Telegram.WebApp;
  let swipesWere = null;
  try { if (tgw && tgw.disableVerticalSwipes && tgw.isVersionAtLeast && tgw.isVersionAtLeast("7.7")) { swipesWere = tgw.isVerticalSwipesEnabled; tgw.disableVerticalSwipes(); } } catch (e) {}
  const buzz = (k) => { try { const h = tgw && tgw.HapticFeedback; if (!h) return; if (k === "select") h.impactOccurred("light"); else h.notificationOccurred(k); } catch (e) {} };
  let alive = true;
  function close() {
    if (!alive) return; alive = false;
    try { cancelAnimationFrame(raf); } catch (e) {}
    try { ros.forEach((r) => r.disconnect()); } catch (e) {}
    mo.disconnect();
    try { for (const k in scenes) scenes[k].traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); } catch (e) {}
    try { ENV.dispose(); pmrem.dispose(); controls.dispose(); renderer.dispose(); renderer.forceContextLoss(); } catch (e) {}
    try { if (tgw && tgw.BackButton) { tgw.BackButton.offClick(onTgBack); tgw.BackButton.hide(); } } catch (e) {}
    try { if (swipesWere && tgw.enableVerticalSwipes) tgw.enableVerticalSwipes(); } catch (e) {}
    document.body.style.overflow = prevOverflow;
    host.remove(); active = null; delete window.__lab3d;
    if (opts.onClose) try { opts.onClose(); } catch (e) {}
  }
  const onTgBack = () => goBack();
  const LAB_OPTS = opts;
  const $ = (s) => sh.querySelector(s);
  const app = $("#app"), stage = $("#stage"), labelsEl = $("#labels"), sheet = $("#sheet");
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const V3 = THREE.Vector3, D2R = THREE.MathUtils.degToRad;

  /* ───────── рендер ───────── */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    stage.innerHTML = '<div class="nogl">Этому устройству не хватает WebGL, чтобы показать клетку в 3D. Попробуй открыть страницу в Chrome или Safari.</div>';
    mo.disconnect(); document.body.style.overflow = prevOverflow; host.remove(); active = null; throw e;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ENV = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.085; controls.enablePan = false;
  controls.rotateSpeed = 0.75; controls.zoomSpeed = 0.9; controls.autoRotateSpeed = 0.5;

  /* ───────── утилиты ───────── */
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const nz = (x, y, z) => (Math.sin(x * 1.7 + y * 0.3) * Math.cos(y * 1.3 + z * 0.7) + Math.sin(z * 1.9 + x * 0.5) * 0.6 + Math.sin((x + y + z) * 2.3) * 0.3) / 1.9;
  const dirOf = (th, ph) => [-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th)];
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const azOf = (v) => Math.atan2(v.z, v.x);
  function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d); }

  // оболочка-сфера с вырезанным сектором (как на разрезе в учебнике)
  function shellGeo(R, phi0, phiLen, ws, hs, disp, sy = 1, th0 = 0, thLen = Math.PI) {
    const pos = new Float32Array((ws + 1) * (hs + 1) * 3); let k = 0;
    for (let j = 0; j <= hs; j++) {
      const th = th0 + (j / hs) * thLen;
      for (let i = 0; i <= ws; i++) {
        const ph = phi0 + (i / ws) * phiLen, d = dirOf(th, ph), r = R * disp(d[0], d[1], d[2], th, ph);
        pos[k++] = d[0] * r; pos[k++] = d[1] * r * sy; pos[k++] = d[2] * r;
      }
    }
    const idx = [], full = thLen >= Math.PI - 1e-6;
    for (let j = 0; j < hs; j++) for (let i = 0; i < ws; i++) {
      const a = j * (ws + 1) + i + 1, b = j * (ws + 1) + i, c = (j + 1) * (ws + 1) + i, d = (j + 1) * (ws + 1) + i + 1;
      if (j !== 0 || !full) idx.push(a, b, d);
      if (j !== hs - 1 || !full) idx.push(b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  // кромка разреза: толщина мембраны
  function rimGeo(Ro, Ri, ph, hs, disp, sy = 1) {
    const pos = [];
    for (let j = 0; j <= hs; j++) {
      const th = (j / hs) * Math.PI, d = dirOf(th, ph), f = disp(d[0], d[1], d[2], th, ph);
      for (const R of [Ro, Ri]) { const r = R * f; pos.push(d[0] * r, d[1] * r * sy, d[2] * r); }
    }
    const idx = [];
    for (let j = 0; j < hs; j++) { const a = j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  function bumpy(geo, amp, f, seed = 0) {
    const p = geo.attributes.position, v = new V3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const s = 1 + amp * nz(v.x * f + seed, v.y * f, v.z * f - seed); v.multiplyScalar(s); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals(); return geo;
  }

  /* ───────── стили визуала ───────── */
  const LOOKS = {
    notebook: { kind: "phys", exposure: 1.0, hemi: ["#ffffff", "#c7d1ea", 1.05], key: 1.6, rim: 0.7, c: {
      wall: "#FBE4EE", memIn: "#F7C3D7", memEdge: "#C2185B", rim: "#D6417C",
      nucleus: "#8C7BEA", nucleusIn: "#EEE9FF", nucleolus: "#4B36B4", chromatin: "#7B64E2", pore: "#4B36B4",
      mito: "#F2865A", mitoIn: "#FBD0B0", crista: "#E8673A",
      rer: "#5C9DEB", ribo: "#27479A", ser: "#36B5A4", golgi: "#F2B200", vesicle: "#F5C84A",
      lyso: "#DE437A", centriole: "#2FA36B", pcm: "#BFE8D2", skeleton: "#94A3CA", particle: "#C7B4D8",
      bbA: "#4A5A86", bbB: "#8A4A6E", phosphate: "#F08A24", sugar: "#F3E6C8", hbond: "#2B3550", baseA: "#E4572E", baseT: "#F2B93B", baseG: "#2FA36B", baseC: "#3B7FD0",
      head: "#EE6A8C", tail: "#F4D58A", protein: "#5C9DEB", protein2: "#8C7BEA", glycan: "#2FA36B", chol: "#F2865A",
      aC: "#3D4659", aH: "#DCE2EC", aO: "#E5463B", aN: "#3C6FD9", aP: "#F08A24", macro: "#FFC400" } },
    scope: { kind: "glow", exposure: 1.0, hemi: ["#ffffff", "#223355", 0.4], key: 0.6, rim: 0.4, c: {
      wall: "#0E2A52", memIn: "#06223F", memEdge: "#4DE1FF", rim: "#4DE1FF",
      nucleus: "#3D7BFF", nucleusIn: "#1A3C96", nucleolus: "#A9C8FF", chromatin: "#79A6FF", pore: "#C6DBFF",
      mito: "#FF3D6E", mitoIn: "#FF7C9C", crista: "#FFB0C2",
      rer: "#22E38D", ribo: "#C1FFE0", ser: "#20D4E6", golgi: "#FFC23D", vesicle: "#FFE08A",
      lyso: "#FF5FD2", centriole: "#B48CFF", pcm: "#6A48D0", skeleton: "#2EE6C8", particle: "#4DE1FF",
      bbA: "#4DE1FF", bbB: "#FF5FD2", phosphate: "#FFB23D", sugar: "#E6F0FF", hbond: "#FFFFFF", baseA: "#FF4D6D", baseT: "#FFD166", baseG: "#3DDC97", baseC: "#4D8DFF",
      head: "#FF5F9E", tail: "#FFD166", protein: "#3D7BFF", protein2: "#B48CFF", glycan: "#3DDC97", chol: "#FF8A3D",
      aC: "#9DB0D6", aH: "#E6F0FF", aO: "#FF4D6D", aN: "#4D8DFF", aP: "#FFB23D", macro: "#FFE14D" } },
  };
  let LOOK = "notebook";
  const col = (role, look = LOOK) => new THREE.Color(LOOKS[look].c[role] || "#ffffff");

  const FRESNEL_VS = `varying vec3 vN; varying vec3 vW; varying vec3 vC;
  void main(){
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = m * instanceMatrix;
    #endif
    #ifdef USE_INSTANCING_COLOR
      vC = instanceColor;
    #else
      vC = vec3(1.0);
    #endif
    vec4 w = m * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(m) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
  const FRESNEL_FS = `uniform vec3 uIn; uniform vec3 uEdge; uniform float uAMin; uniform float uAMax; uniform float uPow; uniform float uI;
  varying vec3 vN; varying vec3 vW; varying vec3 vC;
  void main(){
    vec3 v = normalize(cameraPosition - vW); vec3 n = normalize(vN);
    float f = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), uPow);
    gl_FragColor = vec4(mix(uIn, uEdge, f) * vC, mix(uAMin, uAMax, f) * uI);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;
  function fresnel({ inner, edge, aMin, aMax, pow = 2, add = false, side = THREE.FrontSide, i = 1 }) {
    const m = new THREE.ShaderMaterial({
      uniforms: { uIn: { value: new THREE.Color(inner) }, uEdge: { value: new THREE.Color(edge) }, uAMin: { value: aMin }, uAMax: { value: aMax }, uPow: { value: pow }, uI: { value: i } },
      vertexShader: FRESNEL_VS, fragmentShader: FRESNEL_FS, transparent: true, depthWrite: false, side,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    m.userData.baseI = i; return m;
  }

  // материал по роли и стилю. opts: side, tint (белый цвет под цвета экземпляров), opacity, basic, glowI
  function makeMat(role, o = {}) {
    const L = LOOKS[LOOK], c = o.tint ? new THREE.Color("#ffffff") : col(role);
    const side = o.side ?? THREE.FrontSide;
    let m;
    if (FRES[role]) {
      const [a, b, lo, hi] = FRES[role];
      m = L.kind === "glow" ? fresnel({ inner: col(a), edge: col(b), aMin: 0.02, aMax: 0.75, pow: 2.4, add: true, side })
                            : fresnel({ inner: col(a), edge: col(b), aMin: lo, aMax: hi, pow: 2.2, side });
    } else if (L.kind === "glow") {
      if (o.basic) m = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o.opacity ?? 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side });
      else m = fresnel({ inner: c.clone().multiplyScalar(o.core ?? 0.32), edge: c, aMin: o.aMin ?? 0.35, aMax: 1.0, pow: o.pow ?? 1.6, add: true, side, i: o.glowI ?? 1 });
    } else if (o.basic) {
      m = new THREE.MeshBasicMaterial({ color: c, transparent: (o.opacity ?? 1) < 1, opacity: o.opacity ?? 1, side, depthWrite: (o.opacity ?? 1) >= 1 });
    } else if (L.kind === "matte") {
      m = new THREE.MeshPhysicalMaterial({ color: c, roughness: o.rough ?? 0.86, metalness: 0, sheen: 0.9, sheenRoughness: 0.75, sheenColor: new THREE.Color("#fff6ea"), envMapIntensity: 0.55, side });
    } else {
      m = new THREE.MeshPhysicalMaterial({ color: c, roughness: o.rough ?? 0.4, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.32, sheen: 0.45, sheenRoughness: 0.6, sheenColor: new THREE.Color("#ffffff"), envMapIntensity: 0.9, side });
    }
    if (!m.isShaderMaterial && o.opacity != null && o.opacity < 1) { m.transparent = true; m.opacity = o.opacity; m.depthWrite = false; }
    if (o.clip && !m.isShaderMaterial) m.clippingPlanes = o.clip;
    m.userData.role = role; m.userData.baseOpacity = m.opacity; m.userData.baseTransparent = m.transparent; m.userData.baseDepthWrite = m.depthWrite;
    if (m.color) m.userData.baseColor = m.color.clone();
    return m;
  }
  function setMatState(m, dim, hi) {
    if (m.isShaderMaterial) { m.uniforms.uI.value = m.userData.baseI * (dim ? 0.14 : 1); return; }
    const want = m.userData.baseOpacity * (dim ? 0.13 : 1);
    const tr = want < 0.999 || m.userData.baseTransparent;
    if (tr !== m.transparent) { m.transparent = tr; m.needsUpdate = true; }
    m.opacity = want; m.depthWrite = dim ? false : m.userData.baseDepthWrite;
    if (m.color && m.userData.baseColor) {
      m.color.copy(m.userData.baseColor);
    }
  }

  /* ───────── сцены и реестр ───────── */
  function makeScene() {
    const s = new THREE.Scene(); s.environment = ENV;
    const hemi = new THREE.HemisphereLight(0xffffff, 0xc7d1ea, 1); const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(8, 14, 10);
    const rim = new THREE.DirectionalLight(0xcfe0ff, 0.7); rim.position.set(-10, 4, -8);
    s.add(hemi, key, rim); s.userData = { hemi, key, rim, items: [], labels: [], pick: [] };
    return s;
  }
  // add: меш + роль + к какой части относится (для выбора и подсветки)
  function add(scene, parent, mesh, role, org, o = {}) {
    mesh.userData.role = role; mesh.userData.org = org; mesh.userData.mo = o;
    scene.userData.items.push(mesh);
    if (org && !o.nopick) scene.userData.pick.push(mesh); else mesh.raycast = () => {};
    parent.add(mesh); return mesh;
  }
  function applyLook(scene) {
    const L = LOOKS[LOOK], u = scene.userData;
    u.hemi.color.set(L.hemi[0]); u.hemi.groundColor.set(L.hemi[1]); u.hemi.intensity = L.hemi[2]; u.key.intensity = L.key; u.rim.intensity = L.rim;
    for (const m of u.items) {
      const old = m.material; m.material = makeMat(m.userData.role, m.userData.mo); if (old) old.dispose();
    }
    if (u.recolor) u.recolor();
    refreshSel(scene);
  }
  function refreshSel(scene) {
    const u = scene.userData, sel = u.sel;
    for (const m of u.items) {
      const own = sel && (m.userData.org === sel || (u.related && u.related[sel] && u.related[sel].includes(m.userData.org)));
      setMatState(m.material, !!sel && !own && !m.userData.mo.nodim, !!own);
    }
  }

  /* ───────── КЛЕТКА ───────── */
  // вырез смотрит на азимут GAP_AZ, камера стоит чуть сбоку от него — видно и разрез, и наружную мембрану
  const GAP_AZ = D2R(52), CAM_AZ = D2R(84), CAM_EL = D2R(27), CAM_D = 28;
  const CAM_HOME = new V3(Math.cos(CAM_AZ) * Math.cos(CAM_EL), Math.sin(CAM_EL), Math.sin(CAM_AZ) * Math.cos(CAM_EL)).multiplyScalar(CAM_D);
  const R_CELL = 10, SY = 0.9, GAP = D2R(104);
  const inGap = (p, extra = 0) => angDiff(azOf(p), GAP_AZ) < GAP / 2 + extra;
  const P = (azDeg, r, y) => new V3(Math.cos(D2R(azDeg)) * r, y, Math.sin(D2R(azDeg)) * r);

  const ORG = {
    membrane: { name: "Плазматическая мембрана", tag: "Оболочка клетки", drill: "bilayer", drillLabel: "Увеличить до липидов",
      text: "Двойной слой липидов со встроенными белками. Отделяет клетку от среды, избирательно пропускает вещества и принимает сигналы.",
      trap: "Мембрана не органоид, а поверхностный аппарат клетки. Снаружи у животных — гликокаликс, у растений — ещё и клеточная стенка." },
    nucleus: { name: "Ядро", tag: "Двумембранный", drill: "dna", drillLabel: "Увеличить до ДНК",
      text: "Хранит наследственную информацию: ДНК с белками образует хроматин. В ядрышке собираются субъединицы рибосом, через ядерные поры выходят иРНК и субъединицы.",
      trap: "У прокариот ядра нет, ДНК лежит в цитоплазме (нуклеоид). Ядрышко мембраной не окружено." },
    mito: { name: "Митохондрия", tag: "Двумембранный", drill: "atp", drillLabel: "Увеличить до АТФ",
      text: "Здесь идёт кислородный этап дыхания и синтез АТФ. Внутренняя мембрана образует кристы, на них работает АТФ-синтаза. Есть своя кольцевая ДНК и рибосомы.",
      trap: "Гликолиз идёт в цитоплазме, а не в митохондрии. В митохондрии — цикл Кребса и окислительное фосфорилирование." },
    rer: { name: "Шероховатая ЭПС", tag: "Одномембранный",
      text: "Сеть плоских цистерн, на мембранах сидят рибосомы. Синтезирует белки на экспорт и для мембран и передаёт их в аппарат Гольджи.",
      trap: "Липиды и углеводы синтезирует гладкая ЭПС, рибосом на ней нет." },
    ser: { name: "Гладкая ЭПС", tag: "Одномембранный",
      text: "Каналы без рибосом. Синтез липидов и углеводов, обезвреживание ядов (много в клетках печени), запас ионов кальция в мышцах.",
      trap: "Белки гладкая ЭПС не синтезирует: рибосом на ней нет." },
    golgi: { name: "Аппарат Гольджи", tag: "Одномембранный",
      text: "Стопка плоских цистерн с пузырьками по краям. Накапливает, дорабатывает и сортирует вещества из ЭПС, упаковывает их в пузырьки, образует лизосомы.",
      trap: "Лизосомы образуются в аппарате Гольджи, а не в ЭПС. У растений он строит материал клеточной стенки." },
    lyso: { name: "Лизосома", tag: "Одномембранный",
      text: "Пузырёк с гидролитическими ферментами. Переваривает пищевые частицы и отслужившие органоиды, при автолизе разрушает всю клетку.",
      trap: "Ферменты лизосом синтезируются на шероховатой ЭПС, а упаковываются в аппарате Гольджи." },
    ribo: { name: "Рибосомы", tag: "Немембранный",
      text: "Две субъединицы из рРНК и белков. Синтезируют белок по матрице иРНК — это трансляция. Бывают свободные и сидящие на шероховатой ЭПС.",
      trap: "В цитоплазме эукариот рибосомы 80S, у прокариот, в митохондриях и хлоропластах — 70S." },
    centro: { name: "Клеточный центр", tag: "Немембранный",
      text: "Две центриоли под прямым углом, каждая из 9 триплетов микротрубочек. Образует веретено деления и микротрубочки цитоскелета.",
      trap: "У высших растений центриолей нет, веретено деления образуется без них." },
  };

  function buildCell() {
    const s = makeScene(), root = new THREE.Group(); s.add(root);
    const R = rng(11);
    // мембрана
    const phiC = Math.PI - GAP_AZ, phi0 = phiC + GAP / 2, phiLen = 2 * Math.PI - GAP;
    const memDisp = (x, y, z) => 1 + 0.035 * nz(x * 2.1, y * 2.1, z * 2.1);
    add(s, root, new THREE.Mesh(shellGeo(R_CELL, phi0, phiLen, 120, 80, memDisp, SY), null), "memOuter", "membrane");
    add(s, root, new THREE.Mesh(shellGeo(R_CELL * 0.965, phi0, phiLen, 120, 80, memDisp, SY), null), "wall", null, { side: THREE.BackSide, rough: 0.95, nodim: true });
    for (const ph of [phi0, phi0 + phiLen]) add(s, root, new THREE.Mesh(rimGeo(R_CELL, R_CELL * 0.965, ph, 80, memDisp, SY), null), "rim", "membrane", { side: THREE.DoubleSide });

    // ядро
    const NC = P(232, 1.5, 0.5), NR = 3.2;
    const nAz = Math.atan2(CAM_HOME.z - NC.z, CAM_HOME.x - NC.x), nG = D2R(112), nPhi0 = Math.PI - nAz + nG / 2, nLen = 2 * Math.PI - nG;
    const nucDisp = (x, y, z) => 1 + 0.025 * nz(x * 3, y * 3, z * 3);
    const nuc = new THREE.Group(); nuc.position.copy(NC); root.add(nuc);
    add(s, nuc, new THREE.Mesh(shellGeo(NR, nPhi0, nLen, 80, 56, nucDisp), null), "nucleus", "nucleus");
    add(s, nuc, new THREE.Mesh(shellGeo(NR * 0.92, nPhi0, nLen, 80, 56, nucDisp), null), "nucleusIn", "nucleus", { side: THREE.BackSide, rough: 0.9 });
    for (const ph of [nPhi0, nPhi0 + nLen]) add(s, nuc, new THREE.Mesh(rimGeo(NR, NR * 0.92, ph, 56, nucDisp), null), "nucleus", "nucleus", { side: THREE.DoubleSide });
    // поры
    const poreGeo = new THREE.TorusGeometry(0.17, 0.055, 6, 14), pores = [], nGapDir = new V3(Math.cos(nAz), 0, Math.sin(nAz));
    for (let i = 0, n = 150; i < n; i++) {
      const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = i * 2.39996;
      const d = new V3(Math.cos(t) * r, y, Math.sin(t) * r);
      if (angDiff(Math.atan2(d.z, d.x), nAz) < nG / 2 + 0.12 && Math.abs(d.y) < 0.995) continue;
      pores.push(d);
    }
    const poreMesh = new THREE.InstancedMesh(poreGeo, null, pores.length), q = new THREE.Quaternion(), Z = new V3(0, 0, 1), mtx = new THREE.Matrix4();
    pores.forEach((d, i) => { q.setFromUnitVectors(Z, d); mtx.compose(d.clone().multiplyScalar(NR * nucDisp(d.x, d.y, d.z) + 0.01), q, new V3(1, 1, 1)); poreMesh.setMatrixAt(i, mtx); });
    add(s, nuc, poreMesh, "pore", "nucleus");
    // ядрышко и хроматин
    const nucleolus = new THREE.Mesh(bumpy(new THREE.IcosahedronGeometry(0.95, 5), 0.12, 2.6, 3), null);
    nucleolus.position.copy(nGapDir.clone().multiplyScalar(0.55)).add(new V3(0, 0.25, 0));
    add(s, nuc, nucleolus, "nucleolus", "nucleus");
    const chrom = [];
    for (let c = 0; c < 9; c++) {
      const pts = []; let p = new V3((R() - 0.5) * 3, (R() - 0.5) * 3, (R() - 0.5) * 3).clampLength(0, 2.3);
      for (let k = 0; k < 8; k++) { pts.push(p.clone()); p = p.clone().add(new V3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(1.3)).clampLength(0, 2.6); }
      chrom.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.07, 6));
    }
    add(s, nuc, new THREE.Mesh(mergeGeometries(chrom), null), "chromatin", "nucleus");

    // шероховатая ЭПС: изогнутые цистерны вокруг ядра + рибосомы
    const rer = new THREE.Group(); rer.position.copy(NC); root.add(rer);
    const backAz = nAz + Math.PI, riboPts = [];
    for (let k = 0; k < 4; k++) {
      const Rk = NR + 0.65 + k * 0.5, span = D2R(78 - k * 6), ph0 = Math.PI - backAz - span, th0 = D2R(28), thL = D2R(124);
      const wav = (x, y, z, th, ph) => 1 + (0.035 * Math.sin(6 * th + k) * Math.sin(5 * ph + k * 2)) * 3 / Rk;
      add(s, rer, new THREE.Mesh(shellGeo(Rk, ph0, 2 * span, 70, 46, wav, 1, th0, thL), null), "rer", "rer", { side: THREE.DoubleSide, rough: 0.5, glowI: 0.42, core: 0.18 });
      for (let i = 0; i < 230; i++) {
        const th = th0 + R() * thL, ph = ph0 + R() * 2 * span, d = dirOf(th, ph), side = R() < 0.5 ? 1 : -1;
        const r = Rk * wav(0, 0, 0, th, ph) + side * 0.09;
        riboPts.push(new V3(d[0] * r, d[1] * r, d[2] * r));
      }
    }
    const riboGeo = new THREE.IcosahedronGeometry(0.085, 1);
    const rerRibo = new THREE.InstancedMesh(riboGeo, null, riboPts.length);
    riboPts.forEach((p, i) => { mtx.makeTranslation(p.x, p.y, p.z); rerRibo.setMatrixAt(i, mtx); });
    add(s, rer, rerRibo, "ribo", "rer");

    // аппарат Гольджи
    const GC = P(-20, 5.2, 1.6), golgi = new THREE.Group(); golgi.position.copy(GC); root.add(golgi);
    // ось стопки — от ядра, но поперёк взгляда камеры: со стартового ракурса стопка видна сбоку
    { const cd = CAM_HOME.clone().sub(GC).normalize(), ax = GC.clone().sub(NC).normalize(); ax.sub(cd.clone().multiplyScalar(ax.dot(cd))).normalize();
      const zA = cd.clone().sub(ax.clone().multiplyScalar(cd.dot(ax))).normalize(), xA = new V3().crossVectors(ax, zA);
      golgi.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, ax, zA)); golgi.scale.setScalar(1.18); }
    const radii = [1.15, 1.42, 1.6, 1.62, 1.48, 1.2], cist = [];
    radii.forEach((ri, i) => {
      const t = 0.16, pts = [new THREE.Vector2(0, t / 2)];
      for (let a = 0; a <= 12; a++) { const an = Math.PI / 2 - (a / 12) * Math.PI; pts.push(new THREE.Vector2(ri - t / 2 + Math.cos(an) * t / 2, Math.sin(an) * t / 2)); }
      pts.push(new THREE.Vector2(0, -t / 2));
      const g = new THREE.LatheGeometry(pts, 48), pp = g.attributes.position;
      for (let v = 0; v < pp.count; v++) { const x = pp.getX(v), z = pp.getZ(v) * 0.62; pp.setXYZ(v, x, pp.getY(v) + 0.2 * x * x - 0.06 * z * z + i * 0.3 - 0.75, z); }
      g.computeVertexNormals(); cist.push(g);
    });
    add(s, golgi, new THREE.Mesh(mergeGeometries(cist), null), "golgi", "golgi");
    const vesG = new THREE.SphereGeometry(1, 14, 10), ves = new THREE.InstancedMesh(vesG, null, 14);
    for (let i = 0; i < 14; i++) {
      const sd = i % 2 ? 1 : -1, y = -0.7 + R() * 1.9, x = sd * (1.7 + R() * 0.55), z = (R() - 0.5) * 1.2, r = 0.11 + R() * 0.1;
      mtx.compose(new V3(x, y + 0.2 * x * x - 0.75, z), new THREE.Quaternion(), new V3(r, r, r)); ves.setMatrixAt(i, mtx);
    }
    add(s, golgi, ves, "vesicle", "golgi");

    // митохондрии (разрезаны вдоль, видны кристы)
    const camDirFrom = (p) => CAM_HOME.clone().sub(p).normalize();
    const mitoSpots = [[140, 5.6, -1.4, 0.3], [190, 6.4, 3.2, 1.2], [-42, 5.9, -2.6, 2.1], [252, 6.6, -4.4, 0.8], [-12, 5.7, 3.6, 2.7], [168, 3.1, -5.2, 1.9], [118, 3.6, 4.0, 0.4], [228, 7.2, 1.8, 1.4], [112, 6.6, -1.6, 2.4]];
    const capO = new THREE.CapsuleGeometry(0.8, 2.25, 8, 28), capI = new THREE.CapsuleGeometry(0.7, 2.2, 8, 28), cris = new THREE.SphereGeometry(1, 16, 8);
    const mitos = [];
    mitoSpots.forEach(([az, r, y, tw], idx) => {
      const pos = P(az, r, y), g = new THREE.Group(); g.position.copy(pos); root.add(g);
      const axis = new V3(Math.cos(tw * 2.1), 0.45 * Math.sin(tw * 3), Math.sin(tw * 1.7)).normalize();
      const cd = camDirFrom(pos), zA = cd.clone().sub(axis.clone().multiplyScalar(cd.dot(axis))).normalize(), xA = new V3().crossVectors(axis, zA);
      g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, axis, zA));
      const clip = [new THREE.Plane(zA.clone().negate(), zA.dot(pos) + 0.02)];
      add(s, g, new THREE.Mesh(capO, null), "mito", "mito", { side: THREE.DoubleSide, clip });
      add(s, g, new THREE.Mesh(capI, null), "mitoIn", "mito", { side: THREE.DoubleSide, clip, rough: 0.7 });
      const cr = new THREE.InstancedMesh(cris, null, 8);
      for (let k = 0; k < 8; k++) { const sd = k % 2 ? 1 : -1; mtx.compose(new V3(sd * 0.24, -1.3 + (k + 0.5) * (2.6 / 8), -0.06), new THREE.Quaternion(), new V3(0.46, 0.05, 0.62)); cr.setMatrixAt(k, mtx); }
      add(s, g, cr, "crista", "mito", { clip });
      g.userData.focus = true; mitos.push(g);
    });

    // лизосомы
    const lysoSpots = [[124, 6.9, 1.2], [-62, 4.1, 4.6], [212, 7.4, -1.2], [300, 5.4, 4.8], [-72, 6.3, -2.6], [150, 4.6, 5.2], [196, 4.2, -4.6]];
    const lysoG = bumpy(new THREE.IcosahedronGeometry(1, 4), 0.05, 3, 1), lysos = [];
    lysoSpots.forEach(([az, r, y], i) => { const m = new THREE.Mesh(lysoG, null); m.scale.setScalar(0.46 + (i % 3) * 0.07); m.position.copy(P(az, r, y)); add(s, root, m, "lyso", "lyso"); lysos.push(m); });

    // клеточный центр
    const CC = P(128, 3.6, -3.1), centro = new THREE.Group(); centro.position.copy(CC); centro.scale.setScalar(1.3); root.add(centro);
    const tubeG = new THREE.CylinderGeometry(0.042, 0.042, 1.0, 10), cent = new THREE.InstancedMesh(tubeG, null, 54);
    let ci = 0;
    for (let c = 0; c < 2; c++) {
      const base = new THREE.Matrix4();
      if (c === 1) base.makeRotationX(Math.PI / 2).setPosition(0, 0.62, 0.42); else base.identity();
      for (let k = 0; k < 9; k++) for (let t = 0; t < 3; t++) {
        const a = (k / 9) * Math.PI * 2 + t * 0.11, rr = 0.27 + t * 0.055;
        const m = new THREE.Matrix4().makeTranslation(Math.cos(a) * rr, 0, Math.sin(a) * rr);
        cent.setMatrixAt(ci++, base.clone().multiply(m));
      }
    }
    add(s, centro, cent, "centriole", "centro");
    const pcm = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 20), null); pcm.position.set(0, 0.3, 0.2);
    add(s, centro, pcm, "pcm", "centro", { opacity: 0.28, rough: 1 });
    // микротрубочки цитоскелета
    const sk = [];
    for (let i = 0; i < 16; i++) {
      const d = new V3(R() - 0.5, (R() - 0.5) * 0.9, R() - 0.5).normalize();
      const end = CC.clone().add(d.clone().multiplyScalar(14)); end.setLength(Math.min(end.length(), 8.6));
      if (inGap(end, 0.1)) continue;
      const ctrl = CC.clone().lerp(end, 0.5).add(new V3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(2));
      sk.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(CC.clone(), ctrl, end), 40, 0.028, 5));
    }
    add(s, root, new THREE.Mesh(mergeGeometries(sk), null), "skeleton", null, { basic: true, opacity: 0.45, nodim: true });

    // гладкая ЭПС: сеть трубочек
    const SC = P(176, 5.4, -2.6), ser = new THREE.Group(); ser.position.copy(SC); root.add(ser);
    const serT = [];
    for (let t = 0; t < 8; t++) {
      const pts = []; let p = new V3((R() - 0.5) * 2, (R() - 0.5) * 1.5, (R() - 0.5) * 2);
      for (let k = 0; k < 6; k++) { pts.push(p.clone()); p = p.clone().add(new V3(R() - 0.5, (R() - 0.5) * 0.8, R() - 0.5).multiplyScalar(1.4)).clampLength(0, 2.1); }
      serT.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.14, 10));
    }
    add(s, ser, new THREE.Mesh(mergeGeometries(serT), null), "ser", "ser", { rough: 0.45 });

    // свободные рибосомы и частицы цитоплазмы
    const free = [], dust = [];
    const okSpot = (p) => !inGap(p, 0.05) && p.distanceTo(NC) > NR + 2.6 && p.distanceTo(GC) > 2.1 && (p.x * p.x + p.z * p.z) / 74 + (p.y * p.y) / 52 < 1;
    while (free.length < 320) { const p = new V3((R() - 0.5) * 19, (R() - 0.5) * 16, (R() - 0.5) * 19); if (okSpot(p)) free.push(p); }
    while (dust.length < 260) { const p = new V3((R() - 0.5) * 19, (R() - 0.5) * 16, (R() - 0.5) * 19); if (okSpot(p)) dust.push(p); }
    const freeM = new THREE.InstancedMesh(riboGeo, null, free.length);
    free.forEach((p, i) => { mtx.makeTranslation(p.x, p.y, p.z); freeM.setMatrixAt(i, mtx); });
    add(s, root, freeM, "ribo", "ribo");
    const dustM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.04, 0), null, dust.length);
    dust.forEach((p, i) => { mtx.makeTranslation(p.x, p.y, p.z); dustM.setMatrixAt(i, mtx); });
    add(s, root, dustM, "particle", null, { basic: true, opacity: 0.55, nodim: true });

    // подписи
    const memAnchor = (() => { const az = GAP_AZ + GAP / 2 + D2R(26), el = D2R(30); return new V3(Math.cos(az) * Math.cos(el), Math.sin(el) * SY, Math.sin(az) * Math.cos(el)).multiplyScalar(R_CELL * 1.01); })();
    const nearest = (arr) => arr.slice().sort((a, b) => b.dot(CAM_HOME) - a.dot(CAM_HOME))[0];
    s.userData.labels = [
      ["membrane", memAnchor], ["nucleus", NC.clone().add(new V3(0, NR + 0.3, 0))],
      ["rer", NC.clone().add(new V3(Math.cos(backAz) * 4.2, 3.2, Math.sin(backAz) * 4.2))],
      ["golgi", GC.clone().add(new V3(0, 1.5, 0))], ["mito", mitos[0].position.clone().add(new V3(0, 1.1, 0))],
      ["lyso", lysos[0].position.clone().add(new V3(0, 0.6, 0))], ["ribo", nearest(free)], ["centro", CC.clone().add(new V3(0, 1.3, 0))],
      ["ser", SC.clone().add(new V3(0, 1.6, 0))],
    ].map(([k, p]) => ({ key: k, text: ORG[k].name.replace("Плазматическая мембрана", "Мембрана"), pos: p }));
    s.userData.related = { nucleus: ["nucleus"], rer: ["rer"] };
    s.userData.home = { dir: CAM_HOME.clone(), target: new V3(0, 0, 0), fitW: 10.6, fitH: 9.4, min: 4, max: 60 };
    s.userData.name = "cell";
    return s;
  }

  /* ───────── ЕЩЁ ТРИ КЛЕТКИ: растительная, грибная, бактериальная ───────── */
  const FRES = { memOuter: ["memIn", "memEdge", 0.06, 0.62], vacuole: ["vacIn", "vacEdge", 0.08, 0.7], slime: ["slimeIn", "slimeEdge", 0.03, 0.45] };
  Object.assign(LOOKS.notebook.c, {
    wallP: "#A8D08D", wallPRim: "#5E9E43", wallF: "#D3B08C", wallFRim: "#9C6B3E", wallB: "#B9A6E0", wallBRim: "#7A62C2",
    inP: "#EEF7E8", inF: "#F8F0E6", inB: "#EEF4FB", vacIn: "#D9EEFC", vacEdge: "#3D8FD6", vacFill: "#CFE7FA", vacRim: "#5AA2E0",
    chl: "#48A84C", chlIn: "#CDEBB0", granum: "#2B7A30", gly: "#7A5A3A", plasmid: "#E0457B", flag: "#7A62C2", pili: "#9F8FD0", slimeIn: "#F3EEFF", slimeEdge: "#9F8FD0" });
  Object.assign(LOOKS.scope.c, {
    wallP: "#7CFF6B", wallPRim: "#B9FF9F", wallF: "#FFB46B", wallFRim: "#FFD3A3", wallB: "#B48CFF", wallBRim: "#D9C2FF",
    inP: "#0E2B1C", inF: "#2B1C0E", inB: "#16113A", vacIn: "#06223F", vacEdge: "#3DA9FF", vacFill: "#0B2E55", vacRim: "#7CC4FF",
    chl: "#3DDC97", chlIn: "#1F6F45", granum: "#9BFFB0", gly: "#FFD166", plasmid: "#FF5FD2", flag: "#B48CFF", pili: "#B48CFF", slimeIn: "#120B33", slimeEdge: "#B48CFF" });
  Object.assign(ORG, {
    wallP: { name: "Клеточная стенка", tag: "Поверхностный аппарат", text: "Жёсткая оболочка поверх мембраны из целлюлозы. Даёт клетке опору и форму, защищает и не даёт лопнуть, когда клетка набирает воду.", trap: "Стенка растений — из целлюлозы, грибов — из хитина, бактерий — из муреина. У животных клеточной стенки нет." },
    wallF: { name: "Клеточная стенка", tag: "Поверхностный аппарат", text: "Жёсткая оболочка из хитина поверх мембраны: опора, форма и защита клетки гриба.", trap: "Хитин — тот же полисахарид, что в покровах членистоногих. Целлюлозы у грибов нет." },
    wallB: { name: "Клеточная стенка", tag: "Поверхностный аппарат", text: "Оболочка из муреина (пептидогликана) поверх мембраны: держит форму бактерии и защищает её.", trap: "Пенициллин мешает бактериям строить муреин — поэтому действует на бактерии и не действует на наши клетки." },
    vacP: { name: "Центральная вакуоль", tag: "Одномембранный", text: "Крупная полость с клеточным соком, окружённая мембраной — тонопластом. Поддерживает тургор, запасает воду, соли и пигменты, копит отходы.", trap: "Крупная центральная вакуоль — признак растительной клетки. У животных вакуоли мелкие." },
    vacF: { name: "Вакуоли", tag: "Одномембранный", text: "Несколько мелких вакуолей: запасают вещества, поддерживают тургор и переваривают ненужное.", trap: "Запасной углевод грибов — гликоген, как у животных, а не крахмал, как у растений." },
    chl: { name: "Хлоропласт", tag: "Двумембранный", text: "Две мембраны, внутри строма и граны — стопки тилакоидов с хлорофиллом. На тилакоидах идёт световая фаза фотосинтеза, в строме — темновая (цикл Кальвина). Своя кольцевая ДНК и рибосомы.", trap: "Кислород выделяется в световой фазе при фотолизе воды, а глюкоза синтезируется в темновой." },
    gly: { name: "Гликоген", tag: "Включение", text: "Гранулы запасного полисахарида. Это не органоид, а включение — временный запас вещества.", trap: "У грибов и животных запас — гликоген, у растений — крахмал." },
    nucleoid: { name: "Нуклеоид", tag: "Без мембраны", drill: "dna", drillLabel: "Увеличить до ДНК", text: "Участок цитоплазмы с одной кольцевой молекулой ДНК. Ядерной оболочки нет — бактерия прокариот.", trap: "У прокариот нет ядра и мембранных органоидов: ни митохондрий, ни ЭПС, ни аппарата Гольджи." },
    plasmid: { name: "Плазмиды", tag: "Без мембраны", text: "Маленькие кольцевые ДНК вне нуклеоида. Несут дополнительные гены, например устойчивости к антибиотикам.", trap: "Плазмиды передаются от бактерии к бактерии — так быстро распространяется устойчивость к антибиотикам." },
    flag: { name: "Жгутик", tag: "Органоид движения", text: "Белковая нить, которая вращается как гребной винт и толкает бактерию вперёд.", trap: "Жгутик бактерии устроен иначе, чем у эукариот: у эукариот внутри микротрубочки по схеме 9 + 2." },
    capsule: { name: "Капсула", tag: "Слизистый слой", text: "Слизь поверх клеточной стенки. Защищает от высыхания и от иммунной системы хозяина.", trap: "Капсула есть не у всех бактерий; болезнетворным она помогает ускользать от фагоцитов." },
    pili: { name: "Пили (ворсинки)", tag: "Без мембраны", text: "Тонкие белковые нити на поверхности. Помогают прикрепляться и передавать ДНК другой бактерии (конъюгация).", trap: "Конъюгация — обмен генами, а не размножение: число бактерий при ней не растёт." },
    riboB: { name: "Рибосомы 70S", tag: "Немембранный", text: "Мелкие рибосомы — единственные органоиды бактерии. Синтезируют белок.", trap: "Рибосомы есть у всех клеток. У бактерий они 70S, в цитоплазме эукариот — 80S." },
  });
  const QUIZ_MORE = {
    plant: [["Где идёт фотосинтез?", ["chl"]], ["Что поддерживает тургор и хранит клеточный сок?", ["vacP"]], ["Найди оболочку из целлюлозы.", ["wallP"]],
            ["Где синтезируется большая часть АТФ при дыхании?", ["mito"]], ["Где хранится наследственная информация?", ["nucleus"]], ["Что упаковывает вещества в пузырьки?", ["golgi"]]],
    fungus: [["Найди оболочку из хитина.", ["wallF"]], ["Найди запасной углевод грибов.", ["gly"]], ["Где синтезируется большая часть АТФ?", ["mito"]],
             ["Где хранится наследственная информация?", ["nucleus"]], ["Что запасает вещества и поддерживает тургор?", ["vacF"]]],
    bact: [["Где у бактерии хранится основная ДНК?", ["nucleoid"]], ["Что несёт гены устойчивости к антибиотикам?", ["plasmid"]], ["Чем бактерия двигается?", ["flag"]],
           ["Что защищает от высыхания и от иммунитета?", ["capsule"]], ["Где синтезируется белок?", ["riboB"]], ["Найди оболочку из муреина.", ["wallB"]], ["Чем бактерия передаёт ДНК другой?", ["pili"]]],
  };
  const QZ = () => (cellKey === "cell" ? QUIZ_ANIMAL : QUIZ_MORE[cellKey]) || [];

  const ellDisp = (a, b, c, amp = 0.02) => (x, y, z) => (1 + amp * nz(x * 2, y * 2, z * 2)) / Math.sqrt((x / a) ** 2 + (y / b) ** 2 + (z / c) ** 2);
  const boxDisp = (a, b, c, p) => (x, y, z) => (1 + 0.015 * nz(x * 2, y * 2, z * 2)) / Math.pow(Math.abs(x / a) ** p + Math.abs(y / b) ** p + Math.abs(z / c) ** p, 1 / p);
  const capDisp = (h, rho) => (x, y, z) => { const r = Math.hypot(y, z), ax = Math.abs(x); if (r > 1e-6 && (rho / r) * ax <= h) return rho / r; return h * ax + Math.sqrt(Math.max(0, h * h * ax * ax - h * h + rho * rho)); };
  const gapPhi = () => { const phiC = Math.PI - GAP_AZ; return [phiC + GAP / 2, 2 * Math.PI - GAP]; };
  // оболочка клетки: (стенка) + мембрана + внутренняя «стенка» цитоплазмы, все с вырезом
  function envelope(s, root, { R, disp, wall = null, inRole }) {
    const [phi0, phiLen] = gapPhi(); let r = R;
    if (wall) {
      add(s, root, new THREE.Mesh(shellGeo(R, phi0, phiLen, 120, 80, disp), null), wall.role, wall.org, { side: THREE.DoubleSide, rough: 0.75 });
      for (const ph of [phi0, phi0 + phiLen]) add(s, root, new THREE.Mesh(rimGeo(R, R * wall.t, ph, 80, disp), null), wall.rim, wall.org, { side: THREE.DoubleSide });
      r = R * wall.t;
    }
    add(s, root, new THREE.Mesh(shellGeo(r, phi0, phiLen, 120, 80, disp), null), "memOuter", "membrane");
    add(s, root, new THREE.Mesh(shellGeo(r * 0.975, phi0, phiLen, 120, 80, disp), null), inRole, null, { side: THREE.BackSide, rough: 0.95, nodim: true });
    for (const ph of [phi0, phi0 + phiLen]) add(s, root, new THREE.Mesh(rimGeo(r, r * 0.975, ph, 80, disp), null), "rim", "membrane", { side: THREE.DoubleSide });
    return (p, k = 0.86) => { const d = p.clone().normalize(); return p.length() < r * disp(d.x, d.y, d.z) * k; };
  }
  function nucleusAt(s, root, NC, NR) {
    const R = rng(17), nAz = Math.atan2(CAM_HOME.z - NC.z, CAM_HOME.x - NC.x), nG = D2R(112), nPhi0 = Math.PI - nAz + nG / 2, nLen = 2 * Math.PI - nG;
    const disp = (x, y, z) => 1 + 0.025 * nz(x * 3, y * 3, z * 3), g = new THREE.Group(); g.position.copy(NC); root.add(g);
    add(s, g, new THREE.Mesh(shellGeo(NR, nPhi0, nLen, 72, 50, disp), null), "nucleus", "nucleus");
    add(s, g, new THREE.Mesh(shellGeo(NR * 0.92, nPhi0, nLen, 72, 50, disp), null), "nucleusIn", "nucleus", { side: THREE.BackSide, rough: 0.9 });
    for (const ph of [nPhi0, nPhi0 + nLen]) add(s, g, new THREE.Mesh(rimGeo(NR, NR * 0.92, ph, 50, disp), null), "nucleus", "nucleus", { side: THREE.DoubleSide });
    const pts = [], n = Math.round(150 * (NR / 3.2) ** 2);
    for (let i = 0; i < n; i++) { const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = i * 2.39996, d = new V3(Math.cos(t) * r, y, Math.sin(t) * r); if (angDiff(Math.atan2(d.z, d.x), nAz) < nG / 2 + 0.12 && Math.abs(d.y) < 0.995) continue; pts.push(d); }
    const pm = new THREE.InstancedMesh(new THREE.TorusGeometry(0.15, 0.05, 6, 14), null, pts.length), q = new THREE.Quaternion(), m = new THREE.Matrix4();
    pts.forEach((d, i) => { q.setFromUnitVectors(new V3(0, 0, 1), d); m.compose(d.clone().multiplyScalar(NR * disp(d.x, d.y, d.z) + 0.01), q, new V3(1, 1, 1)); pm.setMatrixAt(i, m); });
    add(s, g, pm, "pore", "nucleus");
    const gd = new V3(Math.cos(nAz), 0, Math.sin(nAz)), nl = new THREE.Mesh(bumpy(new THREE.IcosahedronGeometry(NR * 0.3, 4), 0.12, 2.6, 3), null);
    nl.position.copy(gd.multiplyScalar(NR * 0.17)).add(new V3(0, NR * 0.08, 0)); add(s, g, nl, "nucleolus", "nucleus");
    const ch = [];
    for (let c = 0; c < 6; c++) { const p = []; let v = new V3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(NR).clampLength(0, NR * 0.7); for (let k = 0; k < 7; k++) { p.push(v.clone()); v = v.clone().add(new V3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(NR * 0.4)).clampLength(0, NR * 0.8); } ch.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), 60, 0.06, 6)); }
    add(s, g, new THREE.Mesh(mergeGeometries(ch), null), "chromatin", "nucleus");
    return { nAz, backAz: nAz + Math.PI };
  }
  function rerAt(s, root, NC, NR, backAz, sheets, spanDeg) {
    const R = rng(23), g = new THREE.Group(); g.position.copy(NC); root.add(g); const rp = [];
    for (let k = 0; k < sheets; k++) {
      const Rk = NR + 0.55 + k * 0.45, span = D2R(spanDeg - k * 6), ph0 = Math.PI - backAz - span, th0 = D2R(32), thL = D2R(116);
      const wav = (x, y, z, th, ph) => 1 + (0.03 * Math.sin(6 * th + k) * Math.sin(5 * ph + k * 2)) * 3 / Rk;
      add(s, g, new THREE.Mesh(shellGeo(Rk, ph0, 2 * span, 56, 36, wav, 1, th0, thL), null), "rer", "rer", { side: THREE.DoubleSide, rough: 0.5, glowI: 0.42, core: 0.18 });
      for (let i = 0; i < 160; i++) { const th = th0 + R() * thL, ph = ph0 + R() * 2 * span, d = dirOf(th, ph), r = Rk * wav(0, 0, 0, th, ph) + (R() < 0.5 ? 0.09 : -0.09); rp.push(new V3(d[0] * r, d[1] * r, d[2] * r)); }
    }
    const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.085, 1), null, rp.length), m = new THREE.Matrix4();
    rp.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m); }); add(s, g, im, "ribo", "rer");
  }
  function golgiAt(s, root, GC, NC, sc = 1) {
    const R = rng(29), g = new THREE.Group(); g.position.copy(GC); root.add(g);
    const cd = CAM_HOME.clone().sub(GC).normalize(), ax = GC.clone().sub(NC).normalize(); ax.sub(cd.clone().multiplyScalar(ax.dot(cd))).normalize();
    const zA = cd.clone().sub(ax.clone().multiplyScalar(cd.dot(ax))).normalize(), xA = new V3().crossVectors(ax, zA);
    g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, ax, zA)); g.scale.setScalar(sc);
    const cist = [];
    [1.15, 1.42, 1.6, 1.62, 1.48, 1.2].forEach((ri, i) => {
      const t = 0.16, pts = [new THREE.Vector2(0, t / 2)];
      for (let a = 0; a <= 12; a++) { const an = Math.PI / 2 - (a / 12) * Math.PI; pts.push(new THREE.Vector2(ri - t / 2 + Math.cos(an) * t / 2, Math.sin(an) * t / 2)); }
      pts.push(new THREE.Vector2(0, -t / 2));
      const geo = new THREE.LatheGeometry(pts, 40), pp = geo.attributes.position;
      for (let v = 0; v < pp.count; v++) { const x = pp.getX(v), z = pp.getZ(v) * 0.62; pp.setXYZ(v, x, pp.getY(v) + 0.2 * x * x - 0.06 * z * z + i * 0.3 - 0.75, z); }
      geo.computeVertexNormals(); cist.push(geo);
    });
    add(s, g, new THREE.Mesh(mergeGeometries(cist), null), "golgi", "golgi");
    const ves = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), null, 12), m = new THREE.Matrix4();
    for (let i = 0; i < 12; i++) { const sd = i % 2 ? 1 : -1, y = -0.7 + R() * 1.9, x = sd * (1.7 + R() * 0.5), z = (R() - 0.5) * 1.2, r = 0.11 + R() * 0.1; m.compose(new V3(x, y + 0.2 * x * x - 0.75, z), new THREE.Quaternion(), new V3(r, r, r)); ves.setMatrixAt(i, m); }
    add(s, g, ves, "vesicle", "golgi");
  }
  // вскрытый органоид-капсула: ориентирован длинной осью, срез смотрит на камеру
  function cutFrame(g, pos, tw) {
    const axis = new V3(Math.cos(tw * 2.1), 0.45 * Math.sin(tw * 3), Math.sin(tw * 1.7)).normalize();
    const cd = CAM_HOME.clone().sub(pos).normalize(), zA = cd.clone().sub(axis.clone().multiplyScalar(cd.dot(axis))).normalize(), xA = new V3().crossVectors(axis, zA);
    g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, axis, zA));
    return [new THREE.Plane(zA.clone().negate(), zA.dot(pos) + 0.02)];
  }
  const MITO_G = { o: null };
  function mitoAt(s, root, pos, tw, sc = 1) {
    if (!MITO_G.o) MITO_G.o = { o: new THREE.CapsuleGeometry(0.8, 2.25, 8, 28), i: new THREE.CapsuleGeometry(0.7, 2.2, 8, 28), c: new THREE.SphereGeometry(1, 16, 8) };
    const G = MITO_G.o, g = new THREE.Group(); g.position.copy(pos); root.add(g); const clip = cutFrame(g, pos, tw); g.scale.setScalar(sc); g.userData.focus = true;
    add(s, g, new THREE.Mesh(G.o, null), "mito", "mito", { side: THREE.DoubleSide, clip });
    add(s, g, new THREE.Mesh(G.i, null), "mitoIn", "mito", { side: THREE.DoubleSide, clip, rough: 0.7 });
    const cr = new THREE.InstancedMesh(G.c, null, 8), m = new THREE.Matrix4();
    for (let k = 0; k < 8; k++) { const sd = k % 2 ? 1 : -1; m.compose(new V3(sd * 0.24, -1.3 + (k + 0.5) * (2.6 / 8), -0.06), new THREE.Quaternion(), new V3(0.46, 0.05, 0.62)); cr.setMatrixAt(k, m); }
    add(s, g, cr, "crista", "mito", { clip }); return g;
  }
  function chloroAt(s, root, pos, tw) {
    const g = new THREE.Group(); g.position.copy(pos); root.add(g); const clip = cutFrame(g, pos, tw); g.userData.focus = true;
    const sph = new THREE.SphereGeometry(1, 36, 24);
    const o = new THREE.Mesh(sph, null); o.scale.set(0.7, 1.75, 1.0); add(s, g, o, "chl", "chl", { side: THREE.DoubleSide, clip });
    const i = new THREE.Mesh(sph, null); i.scale.set(0.62, 1.66, 0.92); add(s, g, i, "chlIn", "chl", { side: THREE.DoubleSide, clip, rough: 0.7 });
    const gr = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.3, 0.3, 0.055, 18), null, 30), m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(new V3(0, 0, 1), Math.PI / 2);
    let n = 0;
    for (let a = 0; a < 5; a++) for (let b = 0; b < 6; b++) { m.compose(new V3(-0.2 + b * 0.08, -1.05 + a * 0.52, -0.08), q, new V3(1, 1, 1)); gr.setMatrixAt(n++, m); }
    add(s, g, gr, "granum", "chl", { clip });
    const lam = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.3, 0.42), null, 4);
    for (let a = 0; a < 4; a++) { m.compose(new V3(0, -0.79 + a * 0.52, -0.08), new THREE.Quaternion(), new V3(1, 1, 1)); lam.setMatrixAt(a, m); }
    add(s, g, lam, "granum", "chl", { clip }); return g;
  }
  function vacuoleAt(s, root, C, a, b, c, org) {
    const vAz = Math.atan2(CAM_HOME.z - C.z, CAM_HOME.x - C.x), G = D2R(118), ph0 = Math.PI - vAz + G / 2, L = 2 * Math.PI - G, disp = ellDisp(a, b, c, 0.04);
    const g = new THREE.Group(); g.position.copy(C); root.add(g);
    add(s, g, new THREE.Mesh(shellGeo(1, ph0, L, 72, 48, disp), null), "vacuole", org);
    add(s, g, new THREE.Mesh(shellGeo(0.97, ph0, L, 72, 48, disp), null), "vacFill", org, { side: THREE.BackSide, opacity: 0.55, rough: 0.2 });
    for (const ph of [ph0, ph0 + L]) add(s, g, new THREE.Mesh(rimGeo(1, 0.97, ph, 48, disp), null), "vacRim", org, { side: THREE.DoubleSide });
    return (p, k = 1.12) => { const d = p.clone().sub(C); return ((d.x / a) ** 2 + (d.y / b) ** 2 + (d.z / c) ** 2) < k * k; };
  }
  function scatter(s, root, n, ok, geo, role, org, o = {}) {
    const R = rng(n * 7 + 3), pts = [];
    for (let t = 0; pts.length < n && t < n * 60; t++) { const p = new V3((R() - 0.5) * 26, (R() - 0.5) * 20, (R() - 0.5) * 22); if (ok(p)) pts.push(p); }
    const im = new THREE.InstancedMesh(geo, null, pts.length), m = new THREE.Matrix4();
    pts.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m); }); add(s, root, im, role, org, o); return pts;
  }
  const lbl = (k, pos) => ({ key: k, text: ORG[k].name.replace("Плазматическая мембрана", "Мембрана"), pos });

  function buildPlant() {
    const s = makeScene(), root = new THREE.Group(); s.add(root);
    const disp = boxDisp(1.3, 0.9, 1.0, 5), R = 9;
    const inside = envelope(s, root, { R, disp, wall: { role: "wallP", rim: "wallPRim", org: "wallP", t: 0.93 }, inRole: "inP" });
    const VC = new V3(0.8, 0.2, -0.6), inVac = vacuoleAt(s, root, VC, 5.6, 4.6, 4.8, "vacP");
    const NC = new V3(-8.2, 0.8, -1.2), NR = 2.1, nuc = nucleusAt(s, root, NC, NR);
    rerAt(s, root, NC, NR, nuc.backAz, 2, 55);
    const chls = [[-6.5, 4.8, 3.0], [-6.0, -5.0, 2.0], [3.0, 5.6, -6.0], [6.5, -5.2, -5.5], [-2.0, 5.8, -6.5], [-3.5, -5.6, -6.3], [9.5, -2.2, -3.0], [-9.0, -2.6, 3.6], [7.5, -1.0, -6.6]]
      .map(([x, y, z], i) => chloroAt(s, root, new V3(x, y, z), 0.4 + i * 0.9));
    const mitos = [[-8.6, 4.5, 0.5], [0.5, -5.8, -6.0], [-1.5, 6.0, -2.0]].map(([x, y, z], i) => mitoAt(s, root, new V3(x, y, z), 1.3 + i, 0.75));
    const GC = new V3(8.4, 3.6, -2.6); golgiAt(s, root, GC, NC, 0.9);
    const ok = (p) => inside(p) && !inGap(p, 0.05) && !inVac(p) && p.distanceTo(NC) > NR + 1.6 && p.distanceTo(GC) > 2;
    const free = scatter(s, root, 260, ok, new THREE.IcosahedronGeometry(0.085, 1), "ribo", "ribo");
    scatter(s, root, 180, ok, new THREE.IcosahedronGeometry(0.04, 0), "particle", null, { basic: true, opacity: 0.55, nodim: true });
    s.userData.labels = [lbl("wallP", new V3(-4, 8.6, 6.2)), lbl("vacP", VC.clone().add(new V3(0, 4.2, 0))), lbl("chl", chls[0].position.clone().add(new V3(0, 1.4, 0))),
      lbl("nucleus", NC.clone().add(new V3(0, NR + 0.3, 0))), lbl("mito", mitos[0].position.clone().add(new V3(0, 1, 0))), lbl("golgi", GC.clone().add(new V3(0, 1.5, 0))), lbl("ribo", free[0])];
    s.userData.home = { dir: CAM_HOME.clone(), target: new V3(0, 0, 0), fitW: 13.6, fitH: 9.2, min: 4, max: 60 }; s.userData.name = "plant";
    return s;
  }
  function buildFungus() {
    const s = makeScene(), root = new THREE.Group(); s.add(root);
    const disp = ellDisp(1.45, 0.8, 0.88), R = 8;
    const inside = envelope(s, root, { R, disp, wall: { role: "wallF", rim: "wallFRim", org: "wallF", t: 0.94 }, inRole: "inF" });
    const NC = new V3(-3.5, 0.6, -1.5), NR = 2.0, nuc = nucleusAt(s, root, NC, NR);
    rerAt(s, root, NC, NR, nuc.backAz, 2, 50);
    const vacs = [[4.5, 0.5, -1.5, 1.9], [6.5, -1.0, -2.8, 1.3], [-7.5, -0.5, 1.5, 1.5]].map(([x, y, z, r]) => vacuoleAt(s, root, new V3(x, y, z), r, r * 0.9, r, "vacF"));
    const mitos = [[-6.2, 2.6, -1.6], [1.0, -3.4, -4.0], [-1.5, 3.6, -3.2], [8.5, 1.8, -2.0]].map(([x, y, z], i) => mitoAt(s, root, new V3(x, y, z), 0.6 + i * 1.1, 0.7));
    const GC = new V3(1.5, 2.6, -4.0); golgiAt(s, root, GC, NC, 0.7);
    const ok = (p) => inside(p) && !inGap(p, 0.05) && p.distanceTo(NC) > NR + 1.4 && !vacs.some((v) => v(p, 1.25)) && p.distanceTo(GC) > 1.6;
    const R2 = rng(41), glyPts = [];
    for (let c = 0; c < 7; c++) { let ctr; do { ctr = new V3((R2() - 0.5) * 20, (R2() - 0.5) * 10, (R2() - 0.5) * 12); } while (!ok(ctr)); for (let i = 0; i < 26; i++) { const p = ctr.clone().add(new V3(R2() - 0.5, R2() - 0.5, R2() - 0.5).multiplyScalar(1.1)); if (ok(p)) glyPts.push(p); } }
    const gm = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.13, 1), null, glyPts.length), m = new THREE.Matrix4();
    glyPts.forEach((p, i) => { m.makeTranslation(p.x, p.y, p.z); gm.setMatrixAt(i, m); }); add(s, root, gm, "gly", "gly");
    const free = scatter(s, root, 220, ok, new THREE.IcosahedronGeometry(0.085, 1), "ribo", "ribo");
    scatter(s, root, 150, ok, new THREE.IcosahedronGeometry(0.04, 0), "particle", null, { basic: true, opacity: 0.55, nodim: true });
    s.userData.labels = [lbl("wallF", new V3(-5, 6.0, 4.5)), lbl("nucleus", NC.clone().add(new V3(0, NR + 0.3, 0))), lbl("vacF", new V3(4.5, 2.6, -1.5)),
      lbl("gly", glyPts[0]), lbl("mito", mitos[0].position.clone().add(new V3(0, 0.9, 0))), lbl("golgi", GC.clone().add(new V3(0, 1.2, 0))), lbl("ribo", free[0])];
    s.userData.home = { dir: CAM_HOME.clone(), target: new V3(0, 0, 0), fitW: 12.6, fitH: 7.4, min: 4, max: 60 }; s.userData.name = "fungus";
    return s;
  }
  function buildBact() {
    const s = makeScene(), root = new THREE.Group(); s.add(root);
    const H = 5.6, RHO = 3.3, R3 = rng(53), [phi0, phiLen] = gapPhi();
    const slime = capDisp(H, RHO * 1.3);
    add(s, root, new THREE.Mesh(shellGeo(1, phi0, phiLen, 120, 70, slime), null), "slime", "capsule");
    const inside = envelope(s, root, { R: 1, disp: capDisp(H, RHO), wall: { role: "wallB", rim: "wallBRim", org: "wallB", t: 0.92 }, inRole: "inB" });
    const ok = (p, k = 0.8) => inside(p, k) && !inGap(p, 0.06);
    // нуклеоид: длинная замкнутая нить ДНК, свёрнутая в центре
    const pts = []; let v = new V3(-2, 0, -0.6);
    for (let i = 0; i < 140; i++) { const n = v.clone().add(new V3(R3() - 0.5, R3() - 0.5, R3() - 0.5).multiplyScalar(1.1)); if (Math.abs(n.x) < 4.2 && Math.hypot(n.y, n.z + 0.5) < 1.7 && !inGap(n, 0.1)) v = n; pts.push(v.clone()); }
    add(s, root, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 900, 0.065, 6, true), null), "chromatin", "nucleoid");
    // плазмиды
    const pg = new THREE.TorusGeometry(0.42, 0.06, 8, 30), plas = [];
    for (const [x, y, z] of [[3.6, 1.6, -1.6], [-4.4, -1.5, -1.4], [1.0, -2.1, -1.2], [-1.6, 2.1, -1.0]]) { const m = new THREE.Mesh(pg, null); m.position.set(x, y, z); m.rotation.set(R3() * 3, R3() * 3, 0); add(s, root, m, "plasmid", "plasmid"); plas.push(m); }
    const free = scatter(s, root, 420, (p) => ok(p) && !(Math.abs(p.x) < 4.2 && Math.hypot(p.y, p.z + 0.5) < 1.5), new THREE.IcosahedronGeometry(0.08, 1), "ribo", "riboB");
    // жгутик: спираль от полюса
    const fl = []; for (let i = 0; i <= 160; i++) { const t = i / 160; fl.push(new V3(-(H + RHO * 0.95) - t * 10, Math.sin(t * 16) * 0.55 * Math.min(1, t * 6), Math.cos(t * 16) * 0.55 * Math.min(1, t * 6) - 0.4)); }
    add(s, root, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fl), 400, 0.075, 8), null), "flag", "flag");
    // пили: короткие нити по поверхности стенки
    const pil = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 5), null, 46), m = new THREE.Matrix4(), q = new THREE.Quaternion(), cap = capDisp(H, RHO);
    let n = 0;
    while (n < 46) { const d = new V3(R3() - 0.5, R3() - 0.5, R3() - 0.5).normalize(); const r = cap(d.x, d.y, d.z); const p = d.clone().multiplyScalar(r * 1.05); if (inGap(p, 0.05)) continue; q.setFromUnitVectors(new V3(0, 1, 0), d); m.compose(p.clone().add(d.clone().multiplyScalar(0.55)), q, new V3(1, 1.1, 1)); pil.setMatrixAt(n++, m); }
    add(s, root, pil, "pili", "pili");
    s.userData.labels = [lbl("capsule", new V3(-3, RHO * 1.3 + 0.2, 1.5)), lbl("wallB", new V3(3, -RHO - 0.2, 2.5)), lbl("nucleoid", pts[60].clone().add(new V3(0, 0.4, 0))),
      lbl("plasmid", plas[0].position.clone().add(new V3(0, 0.6, 0))), lbl("riboB", free[0]), lbl("flag", fl[110]), lbl("pili", new V3(5.5, 3.6, -2))];
    root.rotation.z = 0.55; s.userData.spin = root;   // по диагонали — так палочка крупнее на вертикальном экране
    s.userData.home = { dir: CAM_HOME.clone(), target: new V3(-0.6, -0.4, 0), fitW: 8.6, fitH: 7.4, min: 4, max: 60 }; s.userData.name = "bact";
    return s;
  }

  /* ───────── МОЛЕКУЛЫ ───────── */
  const PARTS = {
    dna: {
      title: "ДНК", name: "Двойная спираль ДНК", tag: "Молекулярный уровень",
      text: "Две антипараллельные цепи нуклеотидов закручены в спираль. Азотистые основания соединяются водородными связями по принципу комплементарности.",
      trap: "А–Т — две водородные связи, Г–Ц — три. Правило Чаргаффа: А = Т, Г = Ц. В ДНК сахар — дезоксирибоза.",
      hint: "Тапни любую ступеньку спирали — покажу пару оснований.",
    },
    atp: {
      title: "АТФ", head: "АТФ", name: "АТФ — аденозинтрифосфат", tag: "Молекулярный уровень",
      text: "Нуклеотид: аденин, рибоза и три остатка фосфорной кислоты. Энергия запасена в двух макроэргических связях между фосфатами.",
      trap: "АТФ → АДФ + Ф выделяет около 40 кДж/моль. Сахар в АТФ — рибоза, а не дезоксирибоза.",
      hint: "Тапни атом — подсвечу часть молекулы.",
    },
    bilayer: {
      title: "Бислой", name: "Липидный бислой", tag: "Молекулярный уровень",
      text: "Фосфолипиды стоят в два слоя: гидрофильные головки смотрят к воде, гидрофобные хвосты прячутся внутрь. В слой встроены белки.",
      trap: "Липиды и белки свободно двигаются в слое — поэтому модель называется жидкостно-мозаичной.",
      hint: "Тапни головку, хвост, белок или холестерин.",
    },
  };
  const BASE_NAME = { A: "А", T: "Т", G: "Г", C: "Ц" }, COMP = { A: "T", T: "A", G: "C", C: "G" };

  function buildDNA() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const seq = "ATGCGTACCGATTGCAGCTAGGCT".split(""), N = seq.length, RAD = 1.0, RISE = 0.34, TW = D2R(34.3), OFF = D2R(150);
    const A = [], B = [];
    for (let i = 0; i < N; i++) {
      const y = (N / 2 - i - 0.5) * RISE, ta = i * TW, tb = ta + OFF;
      A.push(new V3(Math.cos(ta) * RAD, y, Math.sin(ta) * RAD)); B.push(new V3(Math.cos(tb) * RAD, y, Math.sin(tb) * RAD));
    }
    add(s, g, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(A), N * 10, 0.06, 8), null), "bbA", "bb");
    add(s, g, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(B), N * 10, 0.06, 8), null), "bbB", "bb");
    const sph = new THREE.SphereGeometry(1, 16, 12), mtx = new THREE.Matrix4();
    const sug = new THREE.InstancedMesh(sph, null, N * 2), pho = new THREE.InstancedMesh(sph, null, (N - 1) * 2);
    let si = 0, pi = 0;
    for (const S of [A, B]) {
      S.forEach((p) => { mtx.compose(p, new THREE.Quaternion(), new V3(0.15, 0.15, 0.15)); sug.setMatrixAt(si++, mtx); });
      for (let i = 0; i < N - 1; i++) { const m = S[i].clone().lerp(S[i + 1], 0.5), h = new V3(m.x, 0, m.z).normalize().multiplyScalar(RAD * 1.12); mtx.compose(new V3(h.x, m.y, h.z), new THREE.Quaternion(), new V3(0.17, 0.17, 0.17)); pho.setMatrixAt(pi++, mtx); }
    }
    add(s, g, sug, "sugar", "bb"); add(s, g, pho, "phosphate", "bb");
    // основания: две половинки ступеньки и водородные связи между ними
    const slab = new THREE.BoxGeometry(1, 0.085, 0.3), bases = new THREE.InstancedMesh(slab, null, N * 2), hb = new THREE.CylinderGeometry(0.02, 0.02, 1, 6);
    const hbN = seq.reduce((a, c) => a + (c === "A" || c === "T" ? 2 : 3), 0), hbs = new THREE.InstancedMesh(hb, null, hbN);
    const baseInfo = []; let bi = 0, hi = 0; const X = new V3(1, 0, 0), Y = new V3(0, 1, 0), q = new THREE.Quaternion();
    for (let i = 0; i < N; i++) {
      const a = A[i], b = B[i], dir = b.clone().sub(a), L = dir.length(); dir.normalize();
      const gap = 0.2, half = L / 2 - gap / 2 - 0.13;
      q.setFromUnitVectors(X, dir);
      const ca = a.clone().add(dir.clone().multiplyScalar(0.13 + half / 2)), cb = b.clone().sub(dir.clone().multiplyScalar(0.13 + half / 2));
      mtx.compose(ca, q, new V3(half, 1, 1)); bases.setMatrixAt(bi, mtx); baseInfo[bi++] = { i, letter: seq[i] };
      mtx.compose(cb, q, new V3(half, 1, 1)); bases.setMatrixAt(bi, mtx); baseInfo[bi++] = { i, letter: COMP[seq[i]] };
      const mid = a.clone().lerp(b, 0.5), perp = new V3().crossVectors(dir, Y).normalize(), n = seq[i] === "A" || seq[i] === "T" ? 2 : 3;
      const qh = new THREE.Quaternion().setFromUnitVectors(Y, dir);
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 0.085; mtx.compose(mid.clone().add(perp.clone().multiplyScalar(off)), qh, new V3(1, gap + 0.02, 1)); hbs.setMatrixAt(hi++, mtx); }
    }
    add(s, g, bases, "base", "base", { tint: true }); add(s, g, hbs, "hbond", "base", { basic: true, opacity: 0.95 });
    s.userData.bases = bases; s.userData.baseInfo = baseInfo; s.userData.seq = seq;
    s.userData.recolor = () => {
      const hiPair = s.userData.hiPair;
      baseInfo.forEach((b, k) => { const c = col("base" + b.letter); if (hiPair != null && b.i !== hiPair) c.lerp(new THREE.Color(LOOK === "scope" ? "#0A1020" : "#D9DEE8"), 0.72); bases.setColorAt(k, c); });
      bases.instanceColor.needsUpdate = true;
    };
    s.userData.labels = [
      { text: "5′", pos: A[0].clone().add(new V3(0, 0.45, 0)), keep: true }, { text: "3′", pos: A[N - 1].clone().add(new V3(0, -0.45, 0)), keep: true },
      { text: "3′", pos: B[0].clone().add(new V3(0, 0.45, 0)), keep: true }, { text: "5′", pos: B[N - 1].clone().add(new V3(0, -0.45, 0)), keep: true },
    ];
    s.userData.home = { dir: new V3(8.5, 1.2, 9.5), target: new V3(0, 0, 0), fitW: 1.9, fitH: 4.4, depth: 1, min: 3, max: 30 };
    s.userData.spin = g; s.userData.name = "dna";
    s.userData.onPick = (hit) => {
      if (hit.object !== bases) return false;
      const b = baseInfo[hit.instanceId], top = s.userData.seq[b.i], bot = COMP[top], n = top === "A" || top === "T" ? 2 : 3;
      s.userData.hiPair = b.i; s.userData.recolor();
      setPart(`<b>${BASE_NAME[top]} ${n === 2 ? "=" : "≡"} ${BASE_NAME[bot]}</b> — ${n === 2 ? "две водородные связи" : "три водородные связи"}. ${top === "G" || top === "C" ? "Пары Г–Ц прочнее, поэтому участки ДНК с ними труднее «расплавить»." : "Против аденина всегда тимин, в РНК — урацил."}`);
      return true;
    };
    s.userData.onClear = () => { s.userData.hiPair = null; s.userData.recolor(); };
    return s;
  }

  const VDW = { C: 1.7, H: 1.1, O: 1.52, N: 1.55, P: 1.8 }, BALL = { C: 0.34, H: 0.22, O: 0.32, N: 0.33, P: 0.42 };
  const GROUP_NAME = { aden: "Аденин", rib: "Рибоза", pa: "Фосфат α", pb: "Фосфат β", pg: "Фосфат γ" };
  function buildATP() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const M = MOLS.atp, at = M.atoms.map((a) => ({ el: a[0], p: new V3(a[1], a[2], a[3]) })), grp = M.groups;
    const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 28, 20), null, at.length);
    const halves = []; const hiSet = new Set(M.hiBonds.map(([a, b]) => a + "-" + b).concat(M.hiBonds.map(([a, b]) => b + "-" + a)));
    for (const [a, b, ord] of M.bonds) {
      const pa = at[a].p, pb = at[b].p, mid = pa.clone().lerp(pb, 0.5), dir = pb.clone().sub(pa).normalize();
      const perp = new V3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? new V3(0, 1, 0) : new V3(1, 0, 0)).normalize();
      const offs = ord === 2 ? [-0.075, 0.075] : ord === 3 ? [-0.1, 0, 0.1] : [0];
      for (const o of offs) for (const [from, to, ai] of [[pa, mid, a], [mid, pb, b]]) halves.push({ from: from.clone().add(perp.clone().multiplyScalar(o)), to: to.clone().add(perp.clone().multiplyScalar(o)), ai, r: ord > 1 ? 0.06 : 0.085, hi: hiSet.has(a + "-" + b) });
    }
    const bonds = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 14), null, halves.length);
    add(s, g, atoms, "atom", "atom", { tint: true, rough: 0.3 }); add(s, g, bonds, "atom", "atom", { tint: true, rough: 0.35 });
    const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), Y = new V3(0, 1, 0);
    let mix = 0, mixTo = 0;
    const place = () => {
      at.forEach((a, i) => { const r = THREE.MathUtils.lerp(BALL[a.el], VDW[a.el] * 0.92, mix); mtx.compose(a.p, q.identity(), new V3(r, r, r)); atoms.setMatrixAt(i, mtx); });
      halves.forEach((h, i) => { const d = h.to.clone().sub(h.from), L = d.length(), r = h.r * (1 - mix) + 1e-4; q.setFromUnitVectors(Y, d.normalize()); mtx.compose(h.from.clone().lerp(h.to, 0.5), q, new V3(r, L, r)); bonds.setMatrixAt(i, mtx); });
      atoms.instanceMatrix.needsUpdate = true; bonds.instanceMatrix.needsUpdate = true;
    };
    place();
    s.userData.recolor = () => {
      const sel = s.userData.hiGroup, dimC = new THREE.Color(LOOK === "scope" ? "#0A1020" : "#DADFE8");
      const on = (i) => !sel || (sel === "macro" ? grp[i] === "pb" || grp[i] === "pg" || grp[i] === "pa" : sel === "phos" ? grp[i][0] === "p" : grp[i] === sel);
      at.forEach((a, i) => { const c = col("a" + a.el); if (!on(i)) c.lerp(dimC, 0.75); atoms.setColorAt(i, c); });
      halves.forEach((h, i) => { let c = col("a" + at[h.ai].el); if (sel === "macro" && h.hi) c = col("macro"); else if (!on(h.ai)) c.lerp(dimC, 0.75); bonds.setColorAt(i, c); });
      atoms.instanceColor.needsUpdate = true; bonds.instanceColor.needsUpdate = true;
    };
    const centroid = (tag) => { const v = new V3(); let n = 0; at.forEach((a, i) => { if (grp[i] === tag && a.el !== "H") { v.add(a.p); n++; } }); return v.multiplyScalar(1 / n); };
    s.userData.labels = ["aden", "rib", "pa", "pb", "pg"].map((t) => ({ text: GROUP_NAME[t], pos: centroid(t).add(new V3(0, 1.3, 0)), keep: true }));
    const rad = Math.max(...at.map((a) => a.p.length()));
    s.userData.home = { dir: new V3(0.4, 0.5, 1), target: new V3(0, 0, 0), fitW: rad + 0.8, fitH: rad + 0.8, min: 4, max: 70 };
    s.userData.spin = g; s.userData.name = "atp";
    s.userData.setMix = (v) => { mixTo = v; };
    s.userData.tick = (dt) => { if (Math.abs(mix - mixTo) > 1e-3) { mix += (mixTo - mix) * Math.min(1, dt * 7); if (Math.abs(mix - mixTo) < 2e-3) mix = mixTo; place(); } };
    s.userData.pickGroup = (tag) => {
      s.userData.hiGroup = tag; s.userData.recolor();
      const msg = {
        aden: "<b>Аденин</b> — азотистое основание (пурин). Такое же есть в ДНК и РНК.",
        rib: "<b>Рибоза</b> — пятиуглеродный сахар. В ДНК вместо неё дезоксирибоза.",
        phos: "<b>Три остатка фосфорной кислоты.</b> Отщепляется крайний — АТФ становится АДФ.",
        macro: "<b>Макроэргические связи</b> — две, между остатками фосфорной кислоты. При разрыве каждой выделяется около 40 кДж/моль.",
      };
      setPart(msg[tag] || "");
    };
    s.userData.onPick = (hit) => {
      if (hit.object !== atoms && hit.object !== bonds) return false;
      const i = hit.object === atoms ? hit.instanceId : halves[hit.instanceId].ai, t = grp[i][0] === "p" ? "phos" : grp[i];
      s.userData.pickGroup(t); syncAtpChips(); return true;
    };
    s.userData.onClear = () => { s.userData.hiGroup = null; s.userData.recolor(); syncAtpChips(); };
    return s;
  }

  function buildBilayer() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const R = rng(5), N = 11, SP = 0.86, half = ((N - 1) * SP) / 2;
    const chan = new V3(0, 0, 0), glyc = new V3(2.6, 0, -1.9);
    const lip = [];
    for (const leaf of [1, -1]) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const x = -half + i * SP + (R() - 0.5) * 0.18 + (j % 2) * SP * 0.5, z = -half + j * SP * 0.87 + (R() - 0.5) * 0.18;
      const p = new V3(x, 0, z);
      if (p.distanceTo(chan) < 1.55 || p.distanceTo(glyc) < 0.95) continue;
      lip.push({ x, z, leaf, ph: R() * 6.28, kink: R() < 0.5 ? 1 : -1, tilt: (R() - 0.5) * 0.2 });
    }
    const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.36, 18, 12), null, lip.length);
    const tails = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.085, 1.4, 4, 8), null, lip.length * 2);
    add(s, g, heads, "head", "head", { rough: 0.35 }); add(s, g, tails, "tail", "tail", { rough: 0.55 });
    const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    let T = 0;
    const place = () => {
      lip.forEach((l, i) => {
        const jx = REDUCE ? 0 : Math.sin(T * 1.3 + l.ph) * 0.05, jz = REDUCE ? 0 : Math.cos(T * 1.1 + l.ph * 1.7) * 0.05;
        const hy = l.leaf * 1.95;
        mtx.makeTranslation(l.x + jx, hy + (REDUCE ? 0 : Math.sin(T * 0.9 + l.ph) * 0.03), l.z + jz); heads.setMatrixAt(i, mtx);
        for (let t = 0; t < 2; t++) {
          const ox = (t ? 0.11 : -0.11), ang = t ? 0.16 * l.kink : l.tilt;
          e.set(0, 0, ang); q.setFromEuler(e);
          mtx.compose(new V3(l.x + ox + jx * 0.6, l.leaf * 1.0, l.z + jz * 0.6), q, new V3(1, 1, 1)); tails.setMatrixAt(i * 2 + t, mtx);
        }
      });
      heads.instanceMatrix.needsUpdate = true; tails.instanceMatrix.needsUpdate = true;
    };
    place();
    // белок-канал: бочонок из спиралей
    const helix = new THREE.CapsuleGeometry(0.3, 4.2, 6, 18);
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2, m = new THREE.Mesh(helix, null); m.position.set(Math.cos(a) * 0.82, 0, Math.sin(a) * 0.82); m.rotation.set(Math.sin(a) * 0.12, 0, Math.cos(a) * 0.12); add(s, g, m, "protein", "channel"); }
    // гликопротеин с цепочкой углеводов
    const gp = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 4.0, 6, 18), null); gp.position.copy(glyc); add(s, g, gp, "protein2", "glyco");
    const blob = new THREE.Mesh(bumpy(new THREE.IcosahedronGeometry(0.62, 4), 0.12, 2.5, 2), null); blob.position.copy(glyc).add(new V3(0, 2.75, 0)); add(s, g, blob, "protein2", "glyco");
    const sugG = new THREE.IcosahedronGeometry(0.15, 2), link = new THREE.CylinderGeometry(0.035, 0.035, 1, 6);
    const chain = (start, dirs) => { let p = start.clone(); for (const d of dirs) { const n = p.clone().add(d); const c = new THREE.Mesh(link, null); c.position.copy(p.clone().lerp(n, 0.5)); c.scale.set(1, d.length(), 1); c.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); add(s, g, c, "glycan", "glyco"); const b = new THREE.Mesh(sugG, null); b.position.copy(n); add(s, g, b, "glycan", "glyco"); p = n; } return p; };
    const top = glyc.clone().add(new V3(0, 3.3, 0));
    const fork = chain(top, [new V3(0.05, 0.42, 0), new V3(-0.1, 0.4, 0.05)]);
    chain(fork, [new V3(-0.32, 0.3, 0.05), new V3(-0.3, 0.28, -0.1), new V3(-0.15, 0.35, 0)]);
    chain(fork, [new V3(0.3, 0.32, 0), new V3(0.25, 0.3, 0.12), new V3(0.32, 0.25, -0.05)]);
    // периферический белок снизу
    const per = new THREE.Mesh(bumpy(new THREE.IcosahedronGeometry(0.85, 4), 0.14, 2.2, 5), null); per.position.set(-2.6, -2.75, 1.7); per.scale.set(1.25, 0.8, 1); add(s, g, per, "protein", "periph");
    // холестерин между хвостами
    const cholG = new THREE.CapsuleGeometry(0.12, 0.75, 4, 10);
    for (let k = 0; k < 12; k++) { const m = new THREE.Mesh(cholG, null); const sd = k % 2 ? 1 : -1; m.position.set(-half + 0.4 + R() * (half * 2 - 0.8), sd * 1.05, -half + 0.4 + R() * (half * 2 - 0.8)); if (m.position.distanceTo(new V3(0, m.position.y, 0)) < 1.6) m.position.x += 2.4; add(s, g, m, "chol", "chol"); }
    s.userData.labels = [
      { text: "Внеклеточная среда", pos: new V3(-half, 3.2, -half * 0.2), keep: true },
      { text: "Цитоплазма", pos: new V3(-half, -3.2, -half * 0.2), keep: true },
      { text: "Белок-канал", pos: new V3(0, 2.75, 0) },
      { text: "Гликокаликс", pos: glyc.clone().add(new V3(0, 5.0, 0)) },
    ];
    s.userData.home = { dir: new V3(9, 5.5, 12), target: new V3(0, 0.2, 0), fitW: 6.0, fitH: 4.6, min: 4, max: 40 };
    s.userData.spin = null; s.userData.name = "bilayer";
    s.userData.tick = (dt) => { if (!REDUCE) { T += dt; place(); } };
    const MSG = {
      head: "<b>Гидрофильная головка</b>: остаток фосфорной кислоты и глицерин. Смотрит наружу, к воде.",
      tail: "<b>Гидрофобные хвосты</b>: остатки жирных кислот. Прячутся от воды внутрь бислоя.",
      channel: "<b>Белок-канал</b> пронизывает мембрану насквозь. Через него проходят ионы по градиенту — без затрат АТФ.",
      glyco: "<b>Гликокаликс</b>: цепочки углеводов на белках и липидах снаружи клетки. Нужен для узнавания клеток.",
      chol: "<b>Холестерин</b> встраивается между хвостами и делает мембрану прочнее. Есть в мембранах животных клеток.",
      periph: "<b>Периферический белок</b> прилегает к поверхности мембраны, но не пронизывает её.",
    };
    s.userData.onPick = (hit) => { const k = hit.object.userData.org; if (!MSG[k]) return false; s.userData.sel = k; refreshSel(s); setPart(MSG[k]); return true; };
    s.userData.onClear = () => { s.userData.sel = null; refreshSel(s); };
    return s;
  }

  /* ───────── ТЕМЫ: молекулярные виды (белки, вода, нуклеиновые кислоты) ───────── */
  const MOLS2 = {"ala":{"atoms":[["C",-0.485,1.338,-0.054],["C",-0.324,-0.164,-0.248],["C",1.103,-0.649,0.044],["O",1.413,-1.731,0.523],["O",2.066,0.199,-0.369],["N",-1.279,-0.858,0.64],["H",-1.521,1.651,-0.226],["H",-0.197,1.645,0.958],["H",0.145,1.894,-0.758],["H",-0.545,-0.435,-1.286],["H",2.897,-0.262,-0.128],["H",-2.22,-0.772,0.26],["H",-1.052,-1.855,0.644]],"bonds":[[0,1,1],[1,2,1],[2,3,2],[2,4,1],[1,5,1],[0,6,1],[0,7,1],[0,8,1],[1,9,1],[4,10,1],[5,11,1],[5,12,1]],"groups":["rad","alpha","carb","carb","carb","amino","rad","rad","rad","alpha","carb","amino","amino"]},"dipep":{"atoms":[["C",-2.005,0.853,0.443],["C",-1.745,-0.318,-0.495],["C",-0.266,-0.378,-0.93],["O",0.082,-0.207,-2.095],["N",0.627,-0.659,0.089],["C",2.059,-0.556,-0.156],["C",2.605,0.837,0.133],["O",3.746,1.216,-0.08],["O",1.724,1.66,0.744],["N",-2.131,-1.587,0.156],["H",-1.663,1.791,-0.008],["H",-3.076,0.951,0.654],["H",-1.486,0.744,1.401],["H",-2.353,-0.195,-1.398],["H",0.325,-0.427,1.026],["H",2.285,-0.816,-1.194],["H",2.548,-1.258,0.525],["H",2.223,2.499,0.842],["H",-2.046,-2.334,-0.537],["H",-1.453,-1.817,0.88]],"bonds":[[0,1,1],[1,2,1],[2,3,2],[2,4,1],[4,5,1],[5,6,1],[6,7,2],[6,8,1],[1,9,1],[0,10,1],[0,11,1],[0,12,1],[1,13,1],[4,14,1],[5,15,1],[5,16,1],[8,17,1],[9,18,1],[9,19,1]],"groups":["res","res","pep","pep","pep","res","carb","carb","carb","amino","res","res","res","res","pep","res","res","carb","amino","amino"]},"damp":{"atoms":[["N",-3.632,1.536,-2.772],["C",-3.279,1.139,-1.489],["N",-4.239,0.617,-0.693],["C",-3.895,0.218,0.552],["N",-2.685,0.275,1.145],["C",-1.775,0.817,0.32],["C",-1.978,1.265,-0.975],["N",-0.802,1.752,-1.515],["C",0.07,1.679,-0.528],["N",-0.441,1.016,0.557],["C",0.281,0.541,1.723],["C",0.161,-0.965,1.95],["C",1.564,-1.381,2.315],["O",1.723,-1.249,3.732],["C",2.448,-0.378,1.589],["C",2.825,-0.771,0.153],["O",1.672,-0.969,-0.652],["P",1.829,-0.716,-2.227],["O",2.611,0.474,-2.657],["O",2.317,-2.123,-2.795],["O",0.323,-0.708,-2.753],["O",1.689,0.854,1.585],["H",-4.628,1.695,-2.856],["H",-3.015,2.237,-3.166],["H",-4.699,-0.203,1.15],["H",1.095,2.033,-0.568],["H",-0.094,1.109,2.582],["H",-0.573,-1.188,2.732],["H",-0.162,-1.485,1.041],["H",1.783,-2.422,2.061],["H",1.799,-0.303,3.954],["H",3.37,-0.186,2.15],["H",3.436,0.03,-0.276],["H",3.412,-1.695,0.15],["H",1.56,-2.733,-2.856],["H",-0.075,0.189,-2.663]],"bonds":[[0,1,1],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,6,1],[6,7,1],[7,8,2],[8,9,1],[9,10,1],[10,11,1],[11,12,1],[12,13,1],[12,14,1],[14,15,1],[15,16,1],[16,17,1],[17,18,2],[17,19,1],[17,20,1],[14,21,1],[6,1,2],[21,10,1],[9,5,1],[0,22,1],[0,23,1],[3,24,1],[8,25,1],[10,26,1],[11,27,1],[11,28,1],[12,29,1],[13,30,1],[14,31,1],[15,32,1],[15,33,1],[19,34,1],[20,35,1]],"groups":["base","base","base","base","base","base","base","base","base","base","sugar","sugar","sugar","sugar","sugar","sugar","phos","phos","phos","phos","phos","sugar","base","base","base","base","sugar","sugar","sugar","sugar","sugar","sugar","sugar","sugar","phos","phos"]},"ab":{"atoms":[["C",-2.109,2.029,-0.366],["C",-3.0309999999999997,0.807,-0.477],["C",-3.896,0.59,0.771],["C",-4.926,-0.511,0.474],["C",-4.3309999999999995,-1.623,-0.397],["C",-2.7889999999999997,-1.595,-0.364],["O",-2.215,-0.349,-0.748],["O",-2.315,-2.564,-1.294],["O",-4.766,-1.44,-1.763],["O",-5.381,-1.047,1.726],["O",-4.583,1.769,1.197],["O",-1.486,2.086,0.918],["H",-2.6799999999999997,2.954,-0.494],["H",-1.323,1.987,-1.126],["H",-3.6639999999999997,0.971,-1.358],["H",-3.275,0.267,1.617],["H",-5.8100000000000005,-0.081,-0.014],["H",-4.694,-2.611,-0.092],["H",-2.423,-1.861,0.635],["H",-1.35,-2.557,-1.174],["H",-4.1419999999999995,-1.981,-2.291],["H",-5.776,-0.289,2.201],["H",-3.899,2.349,1.584],["H",-0.7359999999999998,2.702,0.837],["C",3.013,-1.993,0.754],["C",3.886,-0.738,0.918],["C",3.074,0.564,1.098],["C",2.606,1.159,-0.243],["C",3.785,1.256,-1.222],["C",4.4399999999999995,-0.134,-1.368],["O",4.881,-0.645,-0.111],["O",3.616,-1.062,-2.054],["O",4.73,2.222,-0.732],["O",1.5699999999999998,0.367,-0.835],["O",3.886,1.532,1.786],["O",2.195,-2.208,1.902],["H",2.346,-1.931,-0.106],["H",3.6399999999999997,-2.879,0.599],["H",4.457,-0.881,1.845],["H",2.211,0.377,1.744],["H",2.207,2.166,-0.072],["H",3.42,1.594,-2.199],["H",5.348,-0.025,-1.97],["H",2.6879999999999997,-0.783,-1.913],["H",5.468,2.254,-1.369],["H",0.8089999999999997,0.391,-0.222],["H",4.539,1.872,1.137],["H",2.785,-2.478,2.629]],"bonds":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[5,7,1],[4,8,1],[3,9,1],[2,10,1],[0,11,1],[6,1,1],[0,12,1],[0,13,1],[1,14,1],[2,15,1],[3,16,1],[4,17,1],[5,18,1],[7,19,1],[8,20,1],[9,21,1],[10,22,1],[11,23,1],[24,25,1],[25,26,1],[26,27,1],[27,28,1],[28,29,1],[29,30,1],[29,31,1],[28,32,1],[27,33,1],[26,34,1],[24,35,1],[30,25,1],[24,36,1],[24,37,1],[25,38,1],[26,39,1],[27,40,1],[28,41,1],[29,42,1],[31,43,1],[32,44,1],[33,45,1],[34,46,1],[35,47,1]],"groups":["ch2oh","ringa","ringa","ringa","ringa","ringa","ringa","c1a","ringa","ringa","ringa","ch2oh","ch2oh","ch2oh","ringa","ringa","ringa","ringa","ringa","c1a","ringa","ringa","ringa","ch2oh","ch2oh","ringb","ringb","ringb","ringb","ringb","ringb","c1b","ringb","ringb","ringb","ch2oh","ch2oh","ch2oh","ringb","ringb","ringb","ringb","ringb","c1b","ringb","ringb","ringb","ch2oh"]},"tg":{"atoms":[["C",9.785,-5.496,0.445],["C",9.06,-4.563,-0.511],["C",8.436,-3.379,0.228],["C",7.704,-2.444,-0.737],["C",7.113,-1.242,0.002],["C",6.36,-0.309,-0.951],["C",5.837,0.922,-0.211],["C",5.046,1.852,-1.135],["C",4.625,3.12,-0.391],["C",3.77,4.046,-1.258],["C",3.457,5.337,-0.502],["C",2.45,6.204,-1.223],["O",2.162,6.137,-2.408],["O",1.906,7.079,-0.327],["C",0.803,7.879,-0.775],["C",-0.552,7.287,-0.347],["O",-1.027,6.319,-1.321],["C",-0.612,5.028,-1.294],["O",0.164,4.541,-0.481],["C",-1.25,4.285,-2.442],["C",-1.074,2.774,-2.314],["C",-1.845,2.038,-3.408],["C",-1.648,0.524,-3.32],["C",-2.491,-0.195,-4.373],["C",-2.269,-1.711,-4.35],["C",-3.151,-2.395,-5.396],["C",-2.919,-3.905,-5.45],["C",-3.831,-4.549,-6.497],["C",-3.6,-6.055,-6.593],["C",-4.523,-6.682,-7.627],["C",-0.579,6.81,1.114],["O",-1.827,6.152,1.39],["C",-1.907,5.662,2.659],["O",-1.171,5.987,3.581],["C",-3.021,4.648,2.763],["C",-2.563,3.467,3.616],["C",-3.537,2.29,3.551],["C",-3.046,1.144,4.438],["C",-3.962,-0.077,4.355],["C",-3.482,-1.173,5.31],["C",-4.37,-2.415,5.245],["C",-3.923,-3.46,6.271],["C",-4.822,-4.697,6.244],["C",-4.399,-5.708,7.312],["C",-5.307,-6.927,7.32],["H",9.098,-5.911,1.191],["H",10.235,-6.33,-0.106],["H",10.588,-4.972,0.974],["H",9.769,-4.199,-1.264],["H",8.281,-5.126,-1.039],["H",7.733,-3.749,0.987],["H",9.22,-2.824,0.759],["H",6.905,-2.996,-1.246],["H",8.401,-2.095,-1.508],["H",6.43,-1.592,0.787],["H",7.92,-0.687,0.499],["H",5.526,-0.852,-1.413],["H",7.029,0.009,-1.761],["H",6.681,1.469,0.226],["H",5.195,0.604,0.621],["H",4.158,1.328,-1.511],["H",5.658,2.123,-2.006],["H",5.521,3.657,-0.057],["H",4.06,2.846,0.507],["H",4.289,4.284,-2.193],["H",2.838,3.537,-1.534],["H",4.369,5.924,-0.348],["H",3.035,5.079,0.478],["H",0.838,8.046,-1.857],["H",0.931,8.854,-0.293],["H",-1.294,8.092,-0.432],["H",-0.79,4.641,-3.372],["H",-2.318,4.53,-2.454],["H",-0.008,2.519,-2.37],["H",-1.426,2.442,-1.328],["H",-1.516,2.393,-4.393],["H",-2.913,2.276,-3.324],["H",-0.589,0.282,-3.462],["H",-1.933,0.171,-2.322],["H",-2.244,0.193,-5.368],["H",-3.553,0.021,-4.199],["H",-2.501,-2.105,-3.354],["H",-1.213,-1.93,-4.552],["H",-2.948,-1.964,-6.384],["H",-4.207,-2.195,-5.169],["H",-3.117,-4.348,-4.464],["H",-1.869,-4.11,-5.695],["H",-4.879,-4.353,-6.238],["H",-3.649,-4.088,-7.476],["H",-2.558,-6.256,-6.87],["H",-3.777,-6.525,-5.618],["H",-4.342,-7.76,-7.693],["H",-4.354,-6.244,-8.618],["H",-5.573,-6.528,-7.359],["H",-0.461,7.676,1.775],["H",0.235,6.111,1.324],["H",-3.273,4.293,1.755],["H",-3.902,5.137,3.189],["H",-2.444,3.793,4.656],["H",-1.572,3.134,3.278],["H",-4.534,2.615,3.878],["H",-3.63,1.944,2.513],["H",-2.032,0.858,4.139],["H",-2.991,1.493,5.477],["H",-4.99,0.209,4.609],["H",-3.975,-0.462,3.327],["H",-2.448,-1.45,5.066],["H",-3.475,-0.781,6.333],["H",-4.334,-2.843,4.236],["H",-5.412,-2.133,5.441],["H",-3.942,-3.016,7.275],["H",-2.884,-3.755,6.067],["H",-5.865,-4.398,6.415],["H",-4.774,-5.167,5.253],["H",-3.365,-6.028,7.134],["H",-4.427,-5.236,8.304],["H",-6.345,-6.64,7.517],["H",-4.993,-7.628,8.102],["H",-5.272,-7.452,6.357]],"bonds":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,1],[8,9,1],[9,10,1],[10,11,1],[11,12,2],[11,13,1],[13,14,1],[14,15,1],[15,16,1],[16,17,1],[17,18,2],[17,19,1],[19,20,1],[20,21,1],[21,22,1],[22,23,1],[23,24,1],[24,25,1],[25,26,1],[26,27,1],[27,28,1],[28,29,1],[15,30,1],[30,31,1],[31,32,1],[32,33,2],[32,34,1],[34,35,1],[35,36,1],[36,37,1],[37,38,1],[38,39,1],[39,40,1],[40,41,1],[41,42,1],[42,43,1],[43,44,1],[0,45,1],[0,46,1],[0,47,1],[1,48,1],[1,49,1],[2,50,1],[2,51,1],[3,52,1],[3,53,1],[4,54,1],[4,55,1],[5,56,1],[5,57,1],[6,58,1],[6,59,1],[7,60,1],[7,61,1],[8,62,1],[8,63,1],[9,64,1],[9,65,1],[10,66,1],[10,67,1],[14,68,1],[14,69,1],[15,70,1],[19,71,1],[19,72,1],[20,73,1],[20,74,1],[21,75,1],[21,76,1],[22,77,1],[22,78,1],[23,79,1],[23,80,1],[24,81,1],[24,82,1],[25,83,1],[25,84,1],[26,85,1],[26,86,1],[27,87,1],[27,88,1],[28,89,1],[28,90,1],[29,91,1],[29,92,1],[29,93,1],[30,94,1],[30,95,1],[34,96,1],[34,97,1],[35,98,1],[35,99,1],[36,100,1],[36,101,1],[37,102,1],[37,103,1],[38,104,1],[38,105,1],[39,106,1],[39,107,1],[40,108,1],[40,109,1],[41,110,1],[41,111,1],[42,112,1],[42,113,1],[43,114,1],[43,115,1],[44,116,1],[44,117,1],[44,118,1]],"groups":["fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","est","est","est","gly","gly","est","est","est","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","gly","est","est","est","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","gly","gly","gly","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","gly","gly","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa"]},"pl":{"atoms":[["C",-2.0,8.858,-2.47],["N",-2.758,9.384,-1.245],["C",-2.928,8.24,-0.252],["C",-4.122,9.881,-1.691],["C",-1.998,10.582,-0.605],["C",-0.658,10.234,0.03],["O",0.218,9.752,-0.963],["P",1.529,8.953,-0.438],["O",2.523,8.913,-1.558],["O",1.844,9.44,0.949],["O",0.861,7.47,-0.292],["C",1.8,6.46,0.054],["C",1.091,5.121,0.249],["C",0.07,5.217,1.392],["O",-0.463,3.921,1.723],["C",-1.421,3.411,0.897],["O",-1.977,4.023,-0.004],["C",-1.679,1.985,1.313],["C",-2.171,1.07,0.191],["C",-2.333,-0.348,0.752],["C",-2.795,-1.387,-0.273],["C",-3.029,-2.719,0.449],["C",-3.451,-3.861,-0.478],["C",-3.745,-5.112,0.36],["C",-4.137,-6.316,-0.495],["C",-4.482,-7.513,0.396],["C",-4.828,-8.75,-0.429],["C",-5.209,-9.923,0.463],["O",2.078,4.114,0.592],["C",1.91,2.885,0.03],["O",1.072,2.61,-0.821],["C",2.864,1.884,0.645],["C",2.775,0.526,-0.063],["C",3.634,-0.54,0.623],["C",3.586,-1.863,-0.149],["C",4.37,-2.971,0.558],["C",4.362,-4.268,-0.258],["C",5.021,-5.433,0.487],["C",4.929,-6.731,-0.316],["C",5.455,-7.937,0.464],["C",5.281,-9.231,-0.334],["C",5.7,-10.453,0.463],["H",-1.143,8.268,-2.147],["H",-1.698,9.709,-3.086],["H",-2.68,8.208,-3.032],["H",-1.943,7.817,-0.021],["H",-3.561,7.475,-0.715],["H",-3.409,8.636,0.647],["H",-4.661,10.256,-0.815],["H",-3.979,10.686,-2.421],["H",-4.672,9.053,-2.143],["H",-1.867,11.319,-1.408],["H",-2.67,11.007,0.151],["H",-0.785,9.508,0.837],["H",-0.22,11.145,0.458],["H",2.325,6.749,0.973],["H",2.558,6.368,-0.736],["H",0.573,4.86,-0.682],["H",-0.742,5.918,1.179],["H",0.566,5.574,2.307],["H",-2.391,1.996,2.141],["H",-0.731,1.576,1.683],["H",-3.125,1.435,-0.207],["H",-1.458,1.071,-0.641],["H",-1.378,-0.678,1.182],["H",-3.057,-0.31,1.576],["H",-2.031,-1.512,-1.051],["H",-3.718,-1.054,-0.759],["H",-2.11,-3.009,0.979],["H",-3.801,-2.569,1.215],["H",-2.651,-4.068,-1.196],["H",-4.349,-3.575,-1.041],["H",-2.861,-5.367,0.957],["H",-4.555,-4.891,1.069],["H",-3.308,-6.574,-1.17],["H",-4.999,-6.059,-1.124],["H",-3.631,-7.745,1.052],["H",-5.332,-7.249,1.04],["H",-3.973,-9.04,-1.05],["H",-5.659,-8.526,-1.111],["H",-5.431,-10.806,-0.14],["H",-4.389,-10.174,1.148],["H",-6.096,-9.682,1.066],["H",2.591,1.768,1.7],["H",3.886,2.276,0.571],["H",3.091,0.645,-1.105],["H",1.732,0.184,-0.083],["H",4.67,-0.193,0.696],["H",3.268,-0.702,1.646],["H",3.995,-1.716,-1.157],["H",2.544,-2.179,-0.271],["H",3.928,-3.155,1.545],["H",5.407,-2.652,0.721],["H",4.883,-4.099,-1.21],["H",3.327,-4.54,-0.506],["H",6.075,-5.2,0.695],["H",4.523,-5.568,1.459],["H",3.883,-6.911,-0.586],["H",5.489,-6.625,-1.255],["H",6.514,-7.789,0.706],["H",4.917,-8.024,1.417],["H",4.237,-9.345,-0.638],["H",5.884,-9.178,-1.25],["H",5.585,-11.36,-0.141],["H",5.077,-10.571,1.36],["H",6.745,-10.387,0.777]],"bonds":[[0,1,1],[1,2,1],[1,3,1],[1,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,2],[7,9,1],[7,10,1],[10,11,1],[11,12,1],[12,13,1],[13,14,1],[14,15,1],[15,16,2],[15,17,1],[17,18,1],[18,19,1],[19,20,1],[20,21,1],[21,22,1],[22,23,1],[23,24,1],[24,25,1],[25,26,1],[26,27,1],[12,28,1],[28,29,1],[29,30,2],[29,31,1],[31,32,1],[32,33,1],[33,34,1],[34,35,1],[35,36,1],[36,37,1],[37,38,1],[38,39,1],[39,40,1],[40,41,1],[0,42,1],[0,43,1],[0,44,1],[2,45,1],[2,46,1],[2,47,1],[3,48,1],[3,49,1],[3,50,1],[4,51,1],[4,52,1],[5,53,1],[5,54,1],[11,55,1],[11,56,1],[12,57,1],[13,58,1],[13,59,1],[17,60,1],[17,61,1],[18,62,1],[18,63,1],[19,64,1],[19,65,1],[20,66,1],[20,67,1],[21,68,1],[21,69,1],[22,70,1],[22,71,1],[23,72,1],[23,73,1],[24,74,1],[24,75,1],[25,76,1],[25,77,1],[26,78,1],[26,79,1],[27,80,1],[27,81,1],[27,82,1],[31,83,1],[31,84,1],[32,85,1],[32,86,1],[33,87,1],[33,88,1],[34,89,1],[34,90,1],[35,91,1],[35,92,1],[36,93,1],[36,94,1],[37,95,1],[37,96,1],[38,97,1],[38,98,1],[39,99,1],[39,100,1],[40,101,1],[40,102,1],[41,103,1],[41,104,1],[41,105,1]],"groups":["head","head","head","head","head","head","head","head","head","head","head","gly","gly","gly","est","est","est","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","est","est","est","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","head","head","head","head","head","head","head","head","head","head","head","head","head","gly","gly","gly","gly","gly","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa","fa"]}};
  Object.assign(LOOKS.notebook.c, { aNa: "#8E63D6", aCl: "#36B25A", baseU: "#9C6ADE", hel: "#E4572E", str: "#F2B93B", loop: "#9AA6C2", heme: "#C0392B", fe: "#F08A24", ssb: "#E8C21A", subA1: "#E4572E", subA2: "#F28C6B", subB1: "#3B7FD0", subB2: "#6FA8DC", dash: "#3B7FD0" });
  Object.assign(LOOKS.scope.c, { aNa: "#B48CFF", aCl: "#3DDC97", baseU: "#B48CFF", hel: "#FF4D6D", str: "#FFD166", loop: "#7F93B8", heme: "#FF3D6E", fe: "#FFB23D", ssb: "#FFE14D", subA1: "#FF4D6D", subA2: "#FF8FA8", subB1: "#4D8DFF", subB2: "#8FB8FF", dash: "#4DE1FF" });
  Object.assign(VDW, { Na: 2.27, Cl: 1.75 }); Object.assign(BALL, { Na: 0.95, Cl: 1.2 });
  const AA_PAL = ["#E4572E", "#F2B93B", "#2FA36B", "#3B7FD0", "#8C7BEA", "#36B5A4"];
  const INFO = {
    ala: { name: "Аминокислота", tag: "Молекулярный уровень", hint: "Тапни группу атомов — подсвечу и объясню.",
      text: "Мономер белка. У всех аминокислот общая часть — аминогруппа и карбоксильная группа у одного атома углерода, а различаются они радикалом (R). Здесь аланин: его радикал — CH₃.",
      trap: "Аминокислоты амфотерны: аминогруппа придаёт основные свойства, карбоксильная — кислотные. Белковых аминокислот 20." },
    dipep: { name: "Пептидная связь", tag: "Молекулярный уровень", hint: "Тапни подсвеченную связь –CO–NH–.",
      text: "Две аминокислоты соединились: карбоксильная группа одной реагирует с аминогруппой другой, выделяется вода. Получился дипептид аланил-глицин.",
      trap: "Пептидная связь –CO–NH– образуется в реакции поликонденсации (с выделением воды) на рибосоме." },
    levels: { name: "Уровни структуры белка", tag: "Молекулярный уровень", hint: "Нажимай уровни — цепь перестроится.",
      text: "Белок — цепь из аминокислот. Нажимай уровни по порядку и смотри, как цепь сворачивается в рабочую форму.",
      trap: "При денатурации пептидные связи не рвутся: первичная структура сохраняется. В мягких условиях белок может восстановиться — ренатурация." },
    h2o: { name: "Молекула воды", tag: "Молекулярный уровень", hint: "Тапни атом кислорода или водорода.",
      text: "Два атома водорода связаны с кислородом ковалентными полярными связями под углом 104,5°. Кислород тянет электроны к себе, поэтому молекула — диполь.",
      trap: "Связи O–H ковалентные полярные, а водородные связи — между разными молекулами воды. Не путай." },
    hb: { name: "Водородные связи", tag: "Молекулярный уровень", hint: "Тапни пунктир — это водородная связь.",
      text: "Водород одной молекулы (δ+) притягивается к кислороду соседней (δ−). Связи постоянно рвутся и возникают снова — смотри, как мигает пунктир.",
      trap: "Водородные связи объясняют высокую теплоёмкость воды, теплоту испарения и поверхностное натяжение. Они в 15–20 раз слабее ковалентных." },
    ice: { name: "Лёд", tag: "Молекулярный уровень", hint: "Покрути решётку — видны шестигранные пустоты.",
      text: "Во льду каждая молекула связана водородными связями с четырьмя соседями. Получается рыхлая решётка с пустотами.",
      trap: "Поэтому лёд легче жидкой воды и плавает: водоёмы промерзают сверху, а жизнь подо льдом сохраняется." },
    salt: { name: "Растворение соли", tag: "Молекулярный уровень", hint: "Тапни ион или воду рядом с ним.",
      text: "Вода — полярный растворитель. Вокруг ионов собирается гидратная оболочка: к Na⁺ молекулы повёрнуты кислородом (δ−), к Cl⁻ — водородом (δ+).",
      trap: "Гидрофильные вещества (соли, сахара) растворяются в воде, гидрофобные (жиры, масла) — нет." },
    rna: { name: "РНК", tag: "Молекулярный уровень", hint: "Тапни основание — назову его.",
      text: "Одна цепь нуклеотидов. Сахар — рибоза, вместо тимина — урацил. Бывает иРНК (матрица для белка), тРНК (несёт аминокислоты) и рРНК (основа рибосом).",
      trap: "В ДНК — А, Т, Г, Ц и дезоксирибоза; в РНК — А, У, Г, Ц и рибоза. ДНК двуцепочечная, РНК обычно одноцепочечная." },
    damp: { name: "Нуклеотид ДНК", tag: "Молекулярный уровень", hint: "Тапни основание, сахар или фосфат.",
      text: "Мономер ДНК: азотистое основание (здесь аденин), сахар дезоксирибоза и остаток фосфорной кислоты. Нуклеотиды соединяются через фосфат и сахар в цепь.",
      trap: "В нуклеотиде ДНК сахар — дезоксирибоза (без одного атома кислорода), в РНК — рибоза." },
  };
  // карточки частей
  const MSG = {
    ala: { amino: "<b>Аминогруппа –NH₂</b> — основные свойства.", carb: "<b>Карбоксильная группа –COOH</b> — кислотные свойства.", rad: "<b>Радикал (R)</b> — у аланина CH₃. Именно радикалы отличают 20 аминокислот друг от друга.", alpha: "<b>α-атом углерода</b> — к нему присоединены все группы." },
    dipep: { pep: "<b>Пептидная связь –CO–NH–</b> соединяет остатки аминокислот. При её образовании выделяется вода.", carb: "<b>Свободная карбоксильная группа</b> — С-конец пептида.", amino: "<b>Свободная аминогруппа</b> — N-конец пептида.", res: "<b>Остатки аминокислот</b>: аланин и глицин." },
    h2o: { o: "<b>Кислород, δ−</b>: электроотрицательнее водорода и оттягивает общие электроны.", h: "<b>Водород, δ+</b>: электроны смещены от него к кислороду." },
    hb: { mol: "<b>Молекула воды</b>: в жидкой воде каждая связана с соседями водородными связями.", dash: "<b>Водородная связь</b>: H (δ+) одной молекулы притягивается к O (δ−) другой." },
    ice: { ice: "<b>Молекулы воды во льду</b>: у каждой четыре соседа, решётка рыхлая.", dash: "<b>Водородная связь</b> держит решётку льда." },
    salt: { na: "<b>Ион Na⁺</b>: молекулы воды повёрнуты к нему кислородом (δ−).", cl: "<b>Ион Cl⁻</b>: молекулы воды повёрнуты к нему водородом (δ+).", wna: "<b>Гидратная оболочка Na⁺</b>: кислород смотрит на ион.", wcl: "<b>Гидратная оболочка Cl⁻</b>: водород смотрит на ион.", dash: "<b>Притяжение ион — диполь</b> удерживает оболочку." },
    damp: { base: "<b>Азотистое основание</b> — аденин (пурин).", sugar: "<b>Дезоксирибоза</b> — пятиуглеродный сахар ДНК.", phos: "<b>Остаток фосфорной кислоты</b> — через него нуклеотиды соединяются в цепь." },
  };
  const CHIPS = {
    ala: [["amino", "–NH₂"], ["carb", "–COOH"], ["rad", "Радикал"]], dipep: [["pep", "Пептидная связь"]],
    h2o: [], hb: [["dash", "Водородные связи"]], ice: [["dash", "Водородные связи"]], salt: [["na", "Na⁺"], ["cl", "Cl⁻"]], damp: [["base", "Основание"], ["sugar", "Сахар"], ["phos", "Фосфат"]],
  };
  const TOPICS = {
    cell: { name: "Строение клетки", views: { cell: ["Животная", "Животная клетка"], plant: ["Растение", "Растительная клетка"], fungus: ["Гриб", "Клетка гриба"], bact: ["Бактерия", "Бактериальная клетка"] } },
    protein: { name: "Белки", views: { levels: ["Структуры", "Уровни структуры белка"], ala: ["Аминокислота", "Аминокислота"], dipep: ["Пептидная связь", "Пептидная связь"] } },
    water: { name: "Вода", views: { hb: ["Водородные связи", "Водородные связи"], h2o: ["Молекула", "Молекула воды"], ice: ["Лёд", "Лёд"], salt: ["Растворение", "Растворение соли"] } },
    nk: { name: "ДНК, РНК и АТФ", views: { dna: ["ДНК", "Двойная спираль ДНК"], rna: ["РНК", "РНК"], damp: ["Нуклеотид", "Нуклеотид ДНК"], atp: ["АТФ", "АТФ"] } },
  };
  /* ───────── ТЕМЫ v4.11: ферменты, углеводы и липиды ───────── */
  Object.assign(LOOKS.notebook.c, { enz: "#8C7BEA", site: "#F2B400", sbA: "#36B5A4", sbB: "#2E9BD6", prod: "#F2865A", inhb: "#C0392B" });
  Object.assign(LOOKS.scope.c, { enz: "#7B6BFF", site: "#FFD166", sbA: "#3DDC97", sbB: "#4DE1FF", prod: "#FF8A5B", inhb: "#FF3D6E" });
  Object.assign(INFO, {
    lock: { name: "Фермент и субстрат", tag: "Молекулярный уровень", hint: "Нажми «Субстрат» или тапни фермент, активный центр, молекулу.",
      text: "Ферменты — биологические катализаторы, почти все они белки. Субстрат подходит к активному центру, как ключ к замку, и превращается в продукты. Сам фермент при этом не расходуется и сразу берётся за следующую молекулу.",
      trap: "Холод не разрушает фермент, а только замедляет реакцию. Сильный нагрев денатурирует белок — активный центр теряет форму. У каждого фермента свой оптимум pH: пепсин работает при pH ≈ 2, трипсин — при pH ≈ 8." },
    ab: { name: "α- и β-глюкоза", tag: "Молекулярный уровень", hint: "Тапни группу –OH у первого атома углерода.",
      text: "Глюкоза C₆H₁₂O₆ в клетке почти всегда свёрнута в кольцо. Две формы отличаются одной деталью — положением группы –OH у первого атома углерода (C1). Слева α-глюкоза, справа β-глюкоза.",
      trap: "Крахмал и гликоген построены из α-глюкозы, целлюлоза — из β-глюкозы. Поэтому крахмал мы перевариваем, а клетчатку — нет: у человека нет фермента, который расщепляет целлюлозу." },
    tg: { name: "Триглицерид (жир)", tag: "Молекулярный уровень", hint: "Тапни глицерин, жирную кислоту или сложноэфирную связь.",
      text: "Жир — сложный эфир глицерина и трёх жирных кислот. Молекула почти целиком состоит из неполярных хвостов, поэтому жиры не растворяются в воде — они гидрофобны.",
      trap: "При окислении 1 г жира выделяется 38,9 кДж — вдвое больше, чем из 1 г углеводов или белков (17,6 кДж). Ещё образуется много воды: верблюд получает её из жира в горбах." },
    pl: { name: "Фосфолипид", tag: "Молекулярный уровень", hint: "Тапни головку или хвосты.",
      text: "У глицерина две жирные кислоты, а вместо третьей — остаток фосфорной кислоты с полярной группой (здесь холин). Головка гидрофильна, хвосты гидрофобны.",
      trap: "Поэтому в воде фосфолипиды сами собираются в бислой: головки наружу, к воде, хвосты внутрь. Это основа всех клеточных мембран." },
  });
  Object.assign(MSG, {
    ab: { ringa: "<b>α-глюкоза</b>: группа –OH у C1 и группа –CH₂OH по разные стороны кольца. Из α-глюкозы — крахмал и гликоген.",
      ringb: "<b>β-глюкоза</b>: группа –OH у C1 и группа –CH₂OH по одну сторону кольца. Из β-глюкозы — целлюлоза.",
      c1a: "<b>OH у C1 в α-глюкозе</b> — по другую сторону кольца от –CH₂OH.", c1b: "<b>OH у C1 в β-глюкозе</b> — по ту же сторону кольца, что и –CH₂OH.",
      ch2oh: "<b>Группа –CH₂OH</b> (шестой атом углерода) — по ней сверяют, где «верх» кольца." },
    tg: { gly: "<b>Остаток глицерина</b> — трёхатомного спирта, основа молекулы.", fa: "<b>Остатки жирных кислот</b> — длинные неполярные хвосты (здесь лауриновая кислота, C₁₂).",
      est: "<b>Сложноэфирная связь</b> –CO–O– возникает между –OH глицерина и –COOH жирной кислоты, при этом выделяется вода." },
    pl: { head: "<b>Гидрофильная головка</b>: остаток фосфорной кислоты и холин. Несёт заряды и тянется к воде.", fa: "<b>Гидрофобные хвосты</b> — два остатка жирных кислот.",
      gly: "<b>Глицерин</b> соединяет головку и хвосты.", est: "<b>Сложноэфирные связи</b> между глицерином и жирными кислотами." },
  });
  Object.assign(CHIPS, { ab: [["c1a", "OH у C1 · α"], ["c1b", "OH у C1 · β"]], tg: [["gly", "Глицерин"], ["fa", "Жирные кислоты"], ["est", "Эфирные связи"]], pl: [["head", "Головка"], ["fa", "Хвосты"]] });
  const LBLTXT = { ab: { ringa: "α-глюкоза", ringb: "β-глюкоза", c1a: "OH у C1", c1b: "OH у C1" }, tg: { gly: "Глицерин", fa: "Жирные кислоты" }, pl: { head: "Головка", fa: "Хвосты", gly: "Глицерин" } };
  Object.assign(TOPICS, {
    enzyme: { name: "Ферменты", views: { lock: ["Фермент", "Фермент и субстрат"] } },
    carb: { name: "Углеводы и липиды", views: { ab: ["α и β", "α- и β-глюкоза"], tg: ["Жир", "Триглицерид"], pl: ["Фосфолипид", "Фосфолипид"], bilayer: ["Мембрана", "Липидный бислой"] } },
  });

  // фермент: белок-глобула с активным центром по форме субстрата
  function buildEnzyme() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const R = 2.5, AMP = 0.07, F = 1.6, SEED = 3, UP = new V3(0, 1, 0), X = new V3(1, 0, 0);
    const PD = new V3(0.22, 0.3, 1).normalize(), AX = X.clone().sub(PD.clone().multiplyScalar(PD.x)).normalize(), BX = new V3().crossVectors(PD, AX).normalize();
    const C = PD.clone().multiplyScalar(2.32), RB = 0.6, HL = 0.62;
    const B1 = C.clone().addScaledVector(AX, -HL), B2 = C.clone().addScaledVector(AX, HL);
    const segD = (p) => { const ab = B2.clone().sub(B1), t = Math.max(0, Math.min(1, p.clone().sub(B1).dot(ab) / ab.lengthSq())); return p.distanceTo(B1.clone().addScaledVector(ab, t)); };
    const inPocket = (p) => p.distanceTo(B1) < RB + 0.07 || p.distanceTo(B2) < RB + 0.07 || segD(p) < 0.42;
    const natR = (u) => { let r = R * (1 + AMP * nz(u.x * R * F + SEED, u.y * R * F, u.z * R * F - SEED)); if (u.dot(PD) > 0.45) { const p = new V3(); for (let t = 1.2; t < r; t += 0.02) { p.copy(u).multiplyScalar(t); if (inPocket(p)) { r = t; break; } } } return r; };
    const denR = (u) => R * (1 + 0.2 * nz(u.x * 2.1 + 7, u.y * 2.4 - 3, u.z * 1.9 + 1) + 0.12 * nz(u.x * 4.7, u.y * 4.1 + 2, u.z * 5.3)) * (1 + 0.16 * u.x * u.x - 0.08 * u.y * u.y);
    let geo = new THREE.IcosahedronGeometry(1, 5); geo.deleteAttribute("normal"); geo.deleteAttribute("uv"); geo = mergeVertices(geo);
    const pos = geo.attributes.position, NAT = new Float32Array(pos.count * 3), DEN = new Float32Array(pos.count * 3), u = new V3();
    for (let i = 0; i < pos.count; i++) { u.fromBufferAttribute(pos, i).normalize(); const a = natR(u), b = denR(u); NAT.set([u.x * a, u.y * a, u.z * a], i * 3); DEN.set([u.x * b, u.y * b, u.z * b], i * 3); }
    pos.array.set(NAT); geo.computeVertexNormals();
    const enz = new THREE.Mesh(geo, null); add(s, g, enz, "enz", "enzyme", { rough: 0.5 });
    // активный центр: остатки аминокислот по краю кармана
    const NS = 8, siteN = [], siteD = [], R2 = rng(19);
    for (let k = 0; k < NS; k++) { const a = (k / NS) * Math.PI * 2, d = C.clone().addScaledVector(AX, Math.cos(a) * 1.22).addScaledVector(BX, Math.sin(a) * 0.82).normalize(); siteN.push(d.clone().multiplyScalar(natR(d) + 0.04)); const e = new V3(R2() - 0.5, R2() - 0.5, R2() - 0.5).multiplyScalar(2.2).add(d).normalize(); siteD.push(e.multiplyScalar(denR(e) + 0.02)); }
    const site = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 16, 12), null, NS); add(s, g, site, "site", "site", { rough: 0.3 });
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), tmp = new V3();
    // субстрат — «гантель» из двух частей; продукты — те же части по отдельности
    const ball = new THREE.SphereGeometry(RB, 28, 20), sub = new THREE.Group(); g.add(sub);
    const sA = new THREE.Mesh(ball, null); sA.position.set(-HL, 0, 0); add(s, sub, sA, "sbA", "substrate", { rough: 0.3 });
    const sB = new THREE.Mesh(ball, null); sB.position.set(HL, 0, 0); add(s, sub, sB, "sbB", "substrate", { rough: 0.3 });
    const sL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, HL * 2, 14), null); sL.rotation.z = Math.PI / 2; add(s, sub, sL, "sbA", "substrate", { rough: 0.35 });
    const pA = new THREE.Mesh(ball, null), pB = new THREE.Mesh(ball, null); add(s, g, pA, "prod", "product", { rough: 0.3 }); add(s, g, pB, "prod", "product", { rough: 0.3 }); pA.visible = pB.visible = false;
    // конкурентный ингибитор: похож на субстрат, но вторая часть — конус
    const inh = new THREE.Group(); g.add(inh);
    const iA = new THREE.Mesh(ball, null); iA.position.set(-HL, 0, 0); add(s, inh, iA, "inhb", "inhib", { rough: 0.3 });
    const iB = new THREE.Mesh(new THREE.ConeGeometry(0.56, 1.15, 24), null); iB.position.set(HL + 0.05, 0, 0); iB.rotation.z = -Math.PI / 2; add(s, inh, iB, "inhb", "inhib", { rough: 0.3 });
    const SUB_HOME = C.clone().addScaledVector(PD, 2.6).addScaledVector(AX, 2.5).addScaledVector(UP, 2.0), INH_HOME = C.clone().addScaledVector(PD, 2.6).addScaledVector(AX, -2.7).addScaledVector(UP, -1.2);
    const Q_SEAT = new THREE.Quaternion().setFromUnitVectors(X, AX), Q_FLOAT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.5, -0.6, 0.7));
    sub.position.copy(SUB_HOME); sub.quaternion.copy(Q_FLOAT); inh.position.copy(INH_HOME); inh.quaternion.copy(Q_FLOAT); inh.scale.setScalar(0.001);
    const st = { den: 0, denTo: 0, sub: "home", inh: "off", cold: false, n: 0 };
    let anims = [], T = 0;
    const run = (dur, step, done, slow = true) => anims.push({ t: 0, dur, step, done, slow });
    const fly = (obj, p0, p1, q0, q1, dur, done, arc = 0) => run(dur, (e) => { obj.position.lerpVectors(p0, p1, e).addScaledVector(UP, arc * Math.sin(Math.PI * e)); obj.quaternion.slerpQuaternions(q0, q1, e); }, done);
    const busy = () => anims.length > 0;
    const placeSite = () => { const k = ease(st.den), sq = st.sub === "seat" ? 0.06 : 0; for (let i = 0; i < NS; i++) { tmp.lerpVectors(siteN[i], siteD[i], k); if (sq && k < 0.01) tmp.addScaledVector(C.clone().sub(tmp).normalize(), sq); m4.makeTranslation(tmp.x, tmp.y, tmp.z); site.setMatrixAt(i, m4); } site.instanceMatrix.needsUpdate = true; };
    const morph = () => { const k = ease(st.den), a = pos.array; for (let i = 0; i < a.length; i++) a[i] = NAT[i] + (DEN[i] - NAT[i]) * k; pos.needsUpdate = true; geo.computeVertexNormals(); placeSite(); };
    placeSite();
    const say = (h) => setPart(h);
    const EMSG = {
      enzyme: "<b>Фермент</b> — белок, свёрнутый в глобулу (третичная структура). Работает, только пока сохраняет свою форму.",
      site: "<b>Активный центр</b> — небольшой участок фермента. По форме и зарядам он совпадает с субстратом, отсюда специфичность: фермент ускоряет одну реакцию или группу похожих.",
      substrate: "<b>Субстрат</b> — вещество, на которое действует фермент.",
      product: "<b>Продукты реакции</b> отходят от фермента, а он остаётся неизменным.",
      inhib: "<b>Конкурентный ингибитор</b> похож на субстрат и занимает активный центр — реакция останавливается. Так действуют некоторые лекарства и яды.",
    };
    const toHome = () => { const h = homeOf(s); if (camera.position.clone().sub(h.target).normalize().dot(h.pos.clone().sub(h.target).normalize()) < 0.93) flyTo(h.pos, h.target, 700); };
    const bounce = (why) => { st.sub = "fly"; const near = C.clone().addScaledVector(PD, 1.35); say(why); fly(sub, SUB_HOME, near, Q_FLOAT, Q_SEAT, 0.9, () => { if (typeof buzz === "function") buzz("error"); fly(sub, near, SUB_HOME, Q_SEAT, Q_FLOAT, 0.8, () => { st.sub = "home"; }, 0.6); }); };
    const react = () => {
      st.sub = "fly"; say("Субстрат подходит к активному центру…");
      fly(sub, SUB_HOME, C, Q_FLOAT, Q_SEAT, 1.2, () => {
        st.sub = "seat"; placeSite(); say("<b>Фермент-субстратный комплекс.</b> Активный центр плотно обхватывает субстрат — связь внутри него ослабевает.");
        run(1.1, () => {}, () => {
          st.sub = "split"; sub.visible = false; placeSite();
          const a0 = sub.localToWorld(new V3(-HL, 0, 0)), b0 = sub.localToWorld(new V3(HL, 0, 0));
          const a1 = C.clone().addScaledVector(PD, 3.2).addScaledVector(AX, -3.0).addScaledVector(UP, 0.4), b1 = C.clone().addScaledVector(PD, 3.0).addScaledVector(AX, 3.2).addScaledVector(UP, -0.9);
          pA.visible = pB.visible = true; st.n++;
          say(`<b>Продукты</b> отходят, фермент не изменился и готов к следующей молекуле. Реакций проведено: ${st.n}.`);
          run(1.7, (e) => { pA.position.lerpVectors(a0, a1, e); pB.position.lerpVectors(b0, b1, e); const sc = e < 0.7 ? 1 : 1 - (e - 0.7) / 0.3; pA.scale.setScalar(Math.max(0.001, sc)); pB.scale.setScalar(Math.max(0.001, sc)); }, () => {
            pA.visible = pB.visible = false; sub.position.copy(SUB_HOME); sub.quaternion.copy(Q_FLOAT); sub.visible = true; sub.scale.setScalar(0.001);
            run(0.5, (e) => sub.scale.setScalar(Math.max(0.001, e)), () => { st.sub = "home"; });
          });
        });
      });
    };
    const inhOut = (msg) => { st.inh = "fly"; fly(inh, inh.position.clone(), INH_HOME, inh.quaternion.clone(), Q_FLOAT, 0.9, () => { run(0.35, (e) => inh.scale.setScalar(Math.max(0.001, 1 - e)), () => { st.inh = "off"; }, false); }); if (msg) say(msg); };
    const CHIP = {
      sub: () => { if (st.den > 0.5) bounce("Активный центр потерял форму — субстрат больше не подходит. Реакция не идёт."); else if (st.inh === "seat") bounce("Активный центр занят ингибитором — субстрату некуда сесть."); else react(); },
      inh: () => {
        if (st.inh === "seat") { inhOut("Ингибитор ушёл — активный центр снова свободен."); return; }
        if (st.den > 0.5) { say("Фермент денатурирован — ингибитору тоже некуда садиться."); return; }
        st.inh = "fly"; inh.position.copy(INH_HOME); inh.quaternion.copy(Q_FLOAT);
        run(0.35, (e) => inh.scale.setScalar(Math.max(0.001, e)), () => fly(inh, INH_HOME, C, Q_FLOAT, Q_SEAT, 1.2, () => { st.inh = "seat"; say(EMSG.inhib + " Нажми «Субстрат» — проверь."); }), false);
        say("Появился <b>ингибитор</b> — он похож на субстрат…");
      },
      cold: () => { st.cold = !st.cold; s.userData.level = st.cold ? "cold" : null; syncViewChips(); say(st.cold ? "<b>Холод (около 0 °C).</b> Молекулы движутся медленнее — реакция идёт медленно, но фермент цел. Нажми «Субстрат»." : "Тепло вернулось — фермент снова работает быстро."); },
      heat: () => {
        if (st.denTo === 1) { say("Белок уже денатурирован. Охлаждение форму не вернёт — нажми «Сброс»."); return; }
        if (st.inh === "seat") inhOut(); st.cold = false; s.userData.level = "heat"; syncViewChips();
        st.denTo = 1; say("<b>Нагрев до 60 °C.</b> Слабые связи, которые держат форму белка, рвутся — фермент денатурирует, активный центр теряет форму.");
      },
      reset: () => {
        anims = []; st.sub = "home"; st.inh = "off"; st.cold = false; st.denTo = 0; s.userData.level = null; syncViewChips();
        sub.visible = true; sub.scale.setScalar(1); sub.position.copy(SUB_HOME); sub.quaternion.copy(Q_FLOAT); pA.visible = pB.visible = false; inh.scale.setScalar(0.001);
        placeSite(); say(INFO.lock.hint);
      },
    };
    s.userData.onChip = (v) => { lastTouch = performance.now(); toHome(); if (v !== "reset" && v !== "cold" && busy()) return; CHIP[v](); };
    const subLbl = new V3(), inhLbl = new V3(), camDir = new V3();
    s.userData.tick = (dt) => {
      T += dt;
      if (anims.length) { lastTouch = performance.now(); const a = anims[0]; a.t += dt * (a.slow && st.cold ? 0.3 : 1) / (REDUCE ? 0.01 : a.dur); const e = ease(Math.min(1, a.t)); a.step(e, a.t); if (a.t >= 1) { anims.shift(); if (a.done) a.done(); } }
      if (Math.abs(st.den - st.denTo) > 1e-3) { st.den += Math.sign(st.denTo - st.den) * Math.min(Math.abs(st.denTo - st.den), dt / (REDUCE ? 0.01 : 1.6)); morph(); }
      if (st.sub === "home" && !REDUCE) sub.position.copy(SUB_HOME).addScaledVector(UP, Math.sin(T * 1.6) * 0.08);
      camera.getWorldDirection(camDir);
      if (sub.visible && sub.scale.x > 0.5 && st.sub !== "seat") subLbl.copy(sub.position).addScaledVector(UP, 0.95); else subLbl.copy(camera.position).addScaledVector(camDir, -5);
      if (inh.scale.x > 0.5 && st.inh !== "seat") inhLbl.copy(inh.position).addScaledVector(UP, -0.95); else inhLbl.copy(camera.position).addScaledVector(camDir, -5);
    };
    s.userData.labels = [
      { text: "Фермент", pos: new V3(-2.3, -1.1, 1.0), keep: true },
      { text: "Активный центр", pos: C.clone().addScaledVector(BX, 1.05).addScaledVector(AX, -0.7), keep: true },
      { text: "Субстрат", pos: subLbl, keep: true },
      { text: "Ингибитор", pos: inhLbl, keep: true },
    ];
    // тап только объясняет, ничего не приглушаем: молекулы должны оставаться хорошо видны
    s.userData.onPick = (hit) => { const k = hit.object.userData.org; if (!EMSG[k]) return false; say(EMSG[k]); return true; };
    s.userData.onClear = () => {};
    s.userData.chips = [["sub", "Субстрат"], ["inh", "Ингибитор"], ["cold", "Холод"], ["heat", "Нагрев 60 °C"], ["reset", "Сброс"]];
    s.userData.home = { dir: new V3(0.3, 0.36, 1), target: new V3(0.2, 0.5, 0.6), fitW: 4.3, fitH: 4.0, min: 3.5, max: 40 };
    s.userData.spin = null; s.userData.name = "lock"; s.userData.info = INFO.lock; s.userData.st = st;
    return s;
  }

  let TOPIC_KEY = (typeof LAB_OPTS !== "undefined" && LAB_OPTS && LAB_OPTS.topic) || location.hash.slice(1) || new URLSearchParams(location.search).get("topic") || "cell";
  if (!TOPICS[TOPIC_KEY]) TOPIC_KEY = "cell";
  const TOPIC = TOPICS[TOPIC_KEY], FIRST_VIEW = Object.keys(TOPIC.views)[0];

  /* данные «на лету»: вода, кластер, лёд, ионы */
  function waterAt(atoms, bonds, groups, O, b, n, tag) {
    const io = atoms.length, A = D2R(52.25);
    atoms.push(["O", O.x, O.y, O.z]); groups.push(tag);
    for (const sg of [1, -1]) { const h = O.clone().add(b.clone().multiplyScalar(0.96 * Math.cos(A)).add(n.clone().multiplyScalar(sg * 0.96 * Math.sin(A)))); atoms.push(["H", h.x, h.y, h.z]); groups.push(tag); bonds.push([io, atoms.length - 1, 1]); }
    return io;
  }
  const perp = (v) => new V3().crossVectors(v, Math.abs(v.y) < 0.9 ? new V3(0, 1, 0) : new V3(1, 0, 0)).normalize();
  function genWater() {
    const one = { atoms: [], bonds: [], groups: [] }; waterAt(one.atoms, one.bonds, one.groups, new V3(0, -0.2, 0), new V3(0, 1, 0), new V3(1, 0, 0), "o");
    one.groups[1] = one.groups[2] = "h";
    // кластер: каждая молекула смотрит водородами на двух ближайших соседей
    const R = rng(71), Os = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = 0; z <= 1; z++) Os.push(new V3(x * 2.85 + (R() - 0.5) * 0.5, y * 2.85 + (R() - 0.5) * 0.5, (z - 0.5) * 2.85 + (R() - 0.5) * 0.5));
    const hb = { atoms: [], bonds: [], groups: [], dashes: [] }, oIdx = [];
    Os.forEach((O, i) => {
      const nb = Os.map((P, j) => [P.distanceTo(O), j]).filter(([d, j]) => j !== i).sort((a, b) => a[0] - b[0]);
      const d1 = Os[nb[0][1]].clone().sub(O).normalize(), d2 = Os[nb[1][1]].clone().sub(O).normalize(), b = d1.clone().add(d2).normalize();
      const n = d1.clone().sub(b.clone().multiplyScalar(d1.dot(b))).normalize();
      oIdx.push(waterAt(hb.atoms, hb.bonds, hb.groups, O, b, n.lengthSq() > 0.1 ? n : perp(b), "mol"));
    });
    oIdx.forEach((io) => { for (const ih of [io + 1, io + 2]) { const H = new V3(...hb.atoms[ih].slice(1)); let best = null, bd = 9; oIdx.forEach((jo) => { if (jo === io) return; const d = H.distanceTo(new V3(...hb.atoms[jo].slice(1))); if (d < bd) { bd = d; best = jo; } }); if (bd < 2.6) hb.dashes.push([ih, best]); } });
    // лёд Ih: кислород в узлах гексагональной решётки, водород — на связях (правило: два водорода у каждого O)
    const a = 4.52, c = 7.36, F = [[1 / 3, 2 / 3, 1 / 16], [2 / 3, 1 / 3, 9 / 16], [1 / 3, 2 / 3, 7 / 16], [2 / 3, 1 / 3, 15 / 16]], Oi = [];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = 0; k < 2; k++) for (const [f1, f2, f3] of F) { const u = i + f1, v = j + f2, w = k + f3; Oi.push(new V3(a * (u - v / 2), c * w - c, a * v * Math.sqrt(3) / 2)); }
    const cen = Oi.reduce((s, p) => s.add(p), new V3()).multiplyScalar(1 / Oi.length); Oi.forEach((p) => p.sub(cen));
    const keep = Oi.filter((p) => Math.hypot(p.x, p.z) < 6.6);
    const ice = { atoms: [], bonds: [], groups: [], dashes: [] }, hc = keep.map(() => 0);
    keep.forEach((p) => { ice.atoms.push(["O", p.x, p.y, p.z]); ice.groups.push("ice"); });
    for (let i = 0; i < keep.length; i++) for (let j = i + 1; j < keep.length; j++) {
      if (keep[i].distanceTo(keep[j]) > 3.0) continue;
      const [o, t] = hc[i] <= hc[j] ? [i, j] : [j, i]; if (hc[o] >= 2) { if (hc[t] >= 2) continue; }
      const from = hc[o] < 2 ? o : t, to = from === o ? t : o; hc[from]++;
      const h = keep[from].clone().lerp(keep[to], 0.98 / keep[from].distanceTo(keep[to]));
      ice.atoms.push(["H", h.x, h.y, h.z]); ice.groups.push("ice"); ice.bonds.push([from, ice.atoms.length - 1, 1]); ice.dashes.push([ice.atoms.length - 1, to]);
    }
    // ионы в гидратных оболочках
    const salt = { atoms: [["Na", -4.6, 0, 0], ["Cl", 4.6, 0, 0]], bonds: [], groups: ["na", "cl"], dashes: [] };
    const oct = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((v) => new V3(...v));
    oct.forEach((d) => { const O = new V3(-4.6, 0, 0).add(d.clone().multiplyScalar(2.4)); const io = waterAt(salt.atoms, salt.bonds, salt.groups, O, d, perp(d), "wna"); salt.dashes.push([0, io]); });
    oct.forEach((d) => {
      const O = new V3(4.6, 0, 0).add(d.clone().multiplyScalar(3.15)), io = salt.atoms.length, n = perp(d), A = D2R(104.5);
      salt.atoms.push(["O", O.x, O.y, O.z]); salt.groups.push("wcl");
      const h1 = O.clone().sub(d.clone().multiplyScalar(0.96)), h2 = O.clone().add(d.clone().multiplyScalar(-0.96 * Math.cos(A))).add(n.clone().multiplyScalar(0.96 * Math.sin(A)));
      for (const h of [h1, h2]) { salt.atoms.push(["H", h.x, h.y, h.z]); salt.groups.push("wcl"); salt.bonds.push([io, salt.atoms.length - 1, 1]); }
      salt.dashes.push([io + 1, 1]);
    });
    return { h2o: one, hb, ice, salt };
  }
  let MOLX = null;
  // универсальный вид-молекула: атомы и связи, подсветка частей, пунктир (водородные связи)
  function buildMolView(key) {
    if (!MOLX) MOLX = Object.assign({}, MOLS2, genWater());
    const M = MOLX[key], s = makeScene(), g = new THREE.Group(); s.add(g);
    const at = M.atoms.map((a) => ({ el: a[0], p: new V3(a[1], a[2], a[3]) })), grp = M.groups, msgs = MSG[key] || {};
    const atoms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 24, 16), null, at.length), halves = [];
    for (const [a, b, ord] of M.bonds) {
      const pa = at[a].p, pb = at[b].p, mid = pa.clone().lerp(pb, 0.5), pp = perp(pb.clone().sub(pa).normalize());
      for (const o of ord === 2 ? [-0.075, 0.075] : [0]) for (const [f, t, ai] of [[pa, mid, a], [mid, pb, b]]) halves.push({ f: f.clone().add(pp.clone().multiplyScalar(o)), t: t.clone().add(pp.clone().multiplyScalar(o)), ai, r: ord > 1 ? 0.06 : 0.085 });
    }
    const bonds = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 12), null, Math.max(1, halves.length));
    const dsh = [], DN = 4;
    for (const [a, b] of M.dashes || []) { const pa = at[a].p, pb = at[b].p; for (let k = 0; k < DN; k++) dsh.push({ f: pa.clone().lerp(pb, (k + 0.15) / DN), t: pa.clone().lerp(pb, (k + 0.65) / DN), bond: dsh.length / DN | 0 }); }
    const dashes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 6), null, Math.max(1, dsh.length));
    add(s, g, atoms, "atom", "atom", { tint: true, rough: 0.3 }); add(s, g, bonds, "atom", "atom", { tint: true, rough: 0.35 });
    if (dsh.length) add(s, g, dashes, "dash", "dash", { basic: true }); else dashes.visible = false;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), Y = new V3(0, 1, 0), on = dsh.map(() => 1);
    const placeD = () => { dsh.forEach((d, i) => { const v = d.t.clone().sub(d.f), L = v.length() * on[i]; q.setFromUnitVectors(Y, v.normalize()); m4.compose(d.f.clone().lerp(d.t, 0.5), q, new V3(1, Math.max(L, 1e-4), 1)); dashes.setMatrixAt(i, m4); }); dashes.instanceMatrix.needsUpdate = true; };
    at.forEach((a, i) => { const r = BALL[a.el]; m4.compose(a.p, q.identity(), new V3(r, r, r)); atoms.setMatrixAt(i, m4); });
    halves.forEach((h, i) => { const v = h.t.clone().sub(h.f), L = v.length(); q.setFromUnitVectors(Y, v.normalize()); m4.compose(h.f.clone().lerp(h.t, 0.5), q, new V3(h.r, L, h.r)); bonds.setMatrixAt(i, m4); });
    placeD();
    s.userData.recolor = () => {
      const sel = s.userData.hiGroup, dimC = new THREE.Color(LOOK === "scope" ? "#0A1020" : "#DADFE8");
      const ok = (i) => !sel || sel === "dash" || grp[i] === sel;
      at.forEach((a, i) => { const c = col("a" + a.el); if (!ok(i)) c.lerp(dimC, 0.75); atoms.setColorAt(i, c); });
      halves.forEach((h, i) => { const c = col("a" + at[h.ai].el); if (!ok(h.ai)) c.lerp(dimC, 0.75); bonds.setColorAt(i, c); });
      atoms.instanceColor.needsUpdate = true; if (bonds.instanceColor) bonds.instanceColor.needsUpdate = true;
      if (s.userData.items.includes(dashes)) setMatState(dashes.material, !!sel && sel !== "dash", sel === "dash");
    };
    const groupsSeen = [...new Set(grp)], cen = (t) => { const v = new V3(); let n = 0; at.forEach((a, i) => { if (grp[i] === t) { v.add(a.p); n++; } }); return v.multiplyScalar(1 / n); };
    const LBL = { h2o: [["δ−", at[0].p.clone().add(new V3(0, -1.1, 0))], ["δ+", at[1].p.clone().add(new V3(0.5, 0.5, 0))], ["δ+", at[2].p.clone().add(new V3(-0.5, 0.5, 0))], ["104,5°", new V3(0, 0.9, 0)]],
      salt: [["Na⁺", at[0].p.clone().add(new V3(0, 1.5, 0))], ["Cl⁻", at[1].p.clone().add(new V3(0, 1.9, 0))]] };
    s.userData.labels = (LBL[key] || []).map(([text, pos]) => ({ text, pos, keep: true }));
    if (key === "ala" || key === "dipep" || key === "damp") s.userData.labels = groupsSeen.filter((t) => msgs[t]).map((t) => ({ text: msgs[t].replace(/<[^>]+>/g, "").split(/[:—–(]/)[0].trim().slice(0, 30), pos: cen(t).add(new V3(0, 1.2, 0)), keep: true }));
    if (LBLTXT[key]) s.userData.labels = groupsSeen.filter((t) => LBLTXT[key][t]).map((t) => ({ text: LBLTXT[key][t], pos: cen(t).add(new V3(0, t.startsWith("c1") ? 0.7 : 1.4, 0)), keep: true }));
    const rad = Math.max(...at.map((a) => a.p.length())) + 1;
    s.userData.home = { dir: new V3(0.35, 0.45, 1), target: new V3(0, 0, 0), fitW: rad, fitH: rad, min: 2.5, max: 80 };
    s.userData.spin = g; s.userData.name = key; s.userData.info = INFO[key];
    let tFlick = 0;
    s.userData.tick = (dt) => { if (!dsh.length || REDUCE || key === "salt") return; tFlick += dt; if (tFlick > 0.45) { tFlick = 0; const nb = dsh.length / DN | 0, R = Math.random; for (let b = 0; b < nb; b++) if (R() < 0.18) { const v = on[b * DN] ? 0 : 1; for (let k = 0; k < DN; k++) on[b * DN + k] = v; } placeD(); } };
    const pick = (t) => { s.userData.hiGroup = t; s.userData.recolor(); setPart(msgs[t] || ""); syncViewChips(); };
    s.userData.onPick = (hit) => {
      if (hit.object === atoms) { pick(grp[hit.instanceId]); return true; }
      if (hit.object === bonds) { pick(grp[halves[hit.instanceId].ai]); return true; }
      if (hit.object === dashes) { pick("dash"); return true; }
      return false;
    };
    s.userData.onClear = () => { s.userData.hiGroup = null; s.userData.recolor(); syncViewChips(); };
    s.userData.onChip = (t) => { if (s.userData.hiGroup === t) s.userData.onClear(); else pick(t); };
    s.userData.chips = CHIPS[key] || [];
    return s;
  }
  function syncViewChips() { const s = scenes[cur]; if (!s) return; sh.querySelectorAll("#vchips button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === (s.userData.hiGroup || s.userData.level)))); }

  // РНК: одна цепь, основания внутрь спирали
  function buildRNA() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const seq = "AUGGCUACGUAGCUUCAAGUCG".split(""), N = seq.length, B = [];
    for (let i = 0; i < N; i++) { const t = i * D2R(32.7); B.push(new V3(Math.cos(t) * 1.1, (N / 2 - i - 0.5) * 0.36, Math.sin(t) * 1.1)); }
    add(s, g, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(B), N * 10, 0.06, 8), null), "bbB", "bb");
    const sph = new THREE.SphereGeometry(1, 16, 12), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    const sug = new THREE.InstancedMesh(sph, null, N); B.forEach((p, i) => { m4.compose(p, q, new V3(0.15, 0.15, 0.15)); sug.setMatrixAt(i, m4); }); add(s, g, sug, "sugar", "bb");
    const bases = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.085, 0.3), null, N);
    B.forEach((p, i) => { const d = new V3(-p.x, 0, -p.z).normalize(); q.setFromUnitVectors(new V3(1, 0, 0), d); m4.compose(p.clone().add(d.clone().multiplyScalar(0.55)), q, new V3(0.8, 1, 1)); bases.setMatrixAt(i, m4); });
    add(s, g, bases, "base", "base", { tint: true });
    s.userData.recolor = () => { const hi = s.userData.hiPair; seq.forEach((l, i) => { const c = col("base" + l); if (hi != null && i !== hi) c.lerp(new THREE.Color(LOOK === "scope" ? "#0A1020" : "#D9DEE8"), 0.72); bases.setColorAt(i, c); }); bases.instanceColor.needsUpdate = true; };
    s.userData.labels = [{ text: "5′", pos: B[0].clone().add(new V3(0, 0.45, 0)), keep: true }, { text: "3′", pos: B[N - 1].clone().add(new V3(0, -0.45, 0)), keep: true }];
    s.userData.home = { dir: new V3(8.5, 1.2, 9.5), target: new V3(0, 0, 0), fitW: 1.9, fitH: 4.2, depth: 1, min: 3, max: 30 };
    s.userData.spin = g; s.userData.name = "rna"; s.userData.info = INFO.rna;
    const NAME = { A: "Аденин (А)", U: "Урацил (У) — есть только в РНК, в ДНК вместо него тимин", G: "Гуанин (Г)", C: "Цитозин (Ц)" };
    s.userData.onPick = (hit) => { if (hit.object !== bases) return false; s.userData.hiPair = hit.instanceId; s.userData.recolor(); setPart(`<b>${NAME[seq[hit.instanceId]]}</b>. Комплементарность в РНК: А–У, Г–Ц.`); return true; };
    s.userData.onClear = () => { s.userData.hiPair = null; s.userData.recolor(); };
    return s;
  }

  // белок: одна цепь из 72 остатков перестраивается по уровням
  function buildLevels() {
    const s = makeScene(), g = new THREE.Group(); s.add(g);
    const N = 72, segOf = (i) => ((i >= 2 && i <= 19) || (i >= 50 && i <= 67) ? "hel" : (i >= 24 && i <= 31) || (i >= 36 && i <= 43) ? "str" : "loop");
    const fill = (P) => {
      const lin = (a, b, i0, i1, bul) => { for (let i = i0; i <= i1; i++) { const t = (i - a + 0) / (b - a); P[i] = P[a].clone().lerp(P[b], t).add(new V3(0, 0, bul * Math.sin(Math.PI * t))); } };
      lin(19, 24, 20, 23, 0.9); lin(31, 36, 32, 35, 0.7); lin(43, 50, 44, 49, -0.9);
      P[1] = P[2].clone().add(new V3(-0.3, 0.45, 0.2)); P[0] = P[2].clone().add(new V3(-0.6, 0.9, 0.3));
      for (let i = 68; i < N; i++) P[i] = P[67].clone().add(new V3(0.3 * (i - 67), 0.4 * (i - 67), 0.2));
      return P;
    };
    const layout = (packed) => {
      const P = new Array(N), hx = packed ? 1.55 : 3.0, sx = packed ? 0.5 : 0.7, sz = packed ? -1.0 : 0, hz = packed ? 0.55 : 0;
      for (let k = 0; k < 18; k++) { const a = k * D2R(100); P[2 + k] = new V3(-hx + 0.75 * Math.cos(a), 3.3 - k * 0.38, hz + 0.75 * Math.sin(a)); P[50 + k] = new V3(hx + 0.75 * Math.cos(a), -3.3 + k * 0.38, hz + 0.75 * Math.sin(a)); }
      for (let k = 0; k < 8; k++) { P[24 + k] = new V3(-sx, -2.6 + k * 0.75, sz + (k % 2) * 0.18); P[36 + k] = new V3(sx, 2.65 - k * 0.75, sz + (k % 2) * 0.18); }
      fill(P);
      if (packed) { const r = new THREE.Matrix4().makeRotationY(D2R(28)); P.forEach((p) => p.applyMatrix4(r)); }
      return P;
    };
    const L1 = [...Array(N)].map((_, i) => { const row = Math.floor(i / 18), col = i % 18; return new V3((row % 2 ? 17 - col : col) * 0.55 - 4.7, 1.65 - row * 1.1 + (col % 2) * 0.12, 0); });
    const L2 = layout(false), L3 = layout(true);
    const SUB = [new V3(-1.75, 1.5, 0), new V3(1.75, 1.5, 0.3), new V3(-1.75, -1.6, 0.3), new V3(1.75, -1.6, 0)], SUBC = ["subA1", "subA2", "subB1", "subB2"];
    const L4 = L3.map((p) => p.clone().multiplyScalar(0.5).add(SUB[0]));
    const R = rng(83), DEN = []; let v = L3[0].clone(), dir = new V3(1, 0, 0);
    for (let i = 0; i < N; i++) { dir.add(new V3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(0.9)).normalize(); v = v.clone().add(dir.clone().multiplyScalar(0.55)); if (v.length() > 6.5) { dir.negate(); v.setLength(6.4); } DEN.push(v.clone()); }
    const LV = { 1: L1, 2: L2, 3: L3, 4: L4, den: DEN };
    const beadG = new THREE.SphereGeometry(0.2, 16, 12), bondG = new THREE.CylinderGeometry(0.07, 0.07, 1, 8);
    const beads = new THREE.InstancedMesh(beadG, null, N), links = new THREE.InstancedMesh(bondG, null, N - 1);
    add(s, g, beads, "bead", "bead", { tint: true, rough: 0.35 }); add(s, g, links, "bead", "bead", { tint: true, rough: 0.4 });
    // три остальные субъединицы и гемы — только на четвертичном уровне
    const copies = [1, 2, 3].map((k) => { const b = new THREE.InstancedMesh(beadG, null, N), l = new THREE.InstancedMesh(bondG, null, N - 1), grp = new THREE.Group(); grp.add(b, l); g.add(grp); add(s, grp, b, "bead", "quat", { tint: true, rough: 0.35 }); add(s, grp, l, "bead", "quat", { tint: true, rough: 0.4 }); return { grp, b, l, k }; });
    const hemes = new THREE.Group(); g.add(hemes);
    SUB.forEach((c) => { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.09, 24), null); d.position.copy(c).add(new V3(0, 0.1, 0.9)); d.rotation.x = Math.PI / 2; add(s, hemes, d, "heme", "heme"); const fe = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), null); fe.position.copy(d.position).add(new V3(0, 0, 0.05)); add(s, hemes, fe, "fe", "heme"); });
    const ss = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 8), null, 2); add(s, g, ss, "ssb", "ssb");
    const SS = [[6, 58], [27, 41]], m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), Y = new V3(0, 1, 0);
    const writeChain = (bm, lm, P) => { P.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); bm.setMatrixAt(i, m4); }); for (let i = 0; i < N - 1; i++) { const d = P[i + 1].clone().sub(P[i]), L = d.length(); q.setFromUnitVectors(Y, d.normalize()); m4.compose(P[i].clone().lerp(P[i + 1], 0.5), q, new V3(1, L, 1)); lm.setMatrixAt(i, m4); } bm.instanceMatrix.needsUpdate = true; lm.instanceMatrix.needsUpdate = true; };
    copies.forEach((c) => { const P = L3.map((p) => p.clone().multiplyScalar(0.5)); const rot = new THREE.Matrix4().makeRotationY(Math.PI * c.k * 0.5 + 0.4); P.forEach((p) => p.applyMatrix4(rot).add(SUB[c.k])); writeChain(c.b, c.l, P); c.grp.scale.setScalar(0.001); });
    let level = 1, from = L1, to = L1, t = 1, quatT = 0, quatTo = 0;
    const cur3 = L1.map((p) => p.clone());
    const setColors = () => {
      const quat = level === 4;
      for (let i = 0; i < N; i++) { const c = level === 1 ? new THREE.Color(AA_PAL[(i * 7) % 6]) : quat ? col(SUBC[0]) : col(level === "den" ? "loop" : segOf(i)); beads.setColorAt(i, c); if (i < N - 1) links.setColorAt(i, c.clone().lerp(new THREE.Color("#ffffff"), 0.25)); }
      copies.forEach((cp) => { const c = col(SUBC[cp.k]); for (let i = 0; i < N; i++) { cp.b.setColorAt(i, c); if (i < N - 1) cp.l.setColorAt(i, c.clone().lerp(new THREE.Color("#ffffff"), 0.25)); } cp.b.instanceColor.needsUpdate = true; cp.l.instanceColor.needsUpdate = true; });
      beads.instanceColor.needsUpdate = true; links.instanceColor.needsUpdate = true;
    };
    s.userData.recolor = setColors;
    const showSS = () => { const vis = level === 3 || level === 4; SS.forEach(([a, b], i) => { const pa = cur3[a], pb = cur3[b], d = pb.clone().sub(pa), L = d.length(); q.setFromUnitVectors(Y, d.normalize()); m4.compose(pa.clone().lerp(pb, 0.5), q, new V3(1, vis ? L : 1e-4, 1)); ss.setMatrixAt(i, m4); }); ss.instanceMatrix.needsUpdate = true; };
    writeChain(beads, links, cur3); showSS(); hemes.scale.setScalar(0.001);
    const LMSG = {
      1: "<b>Первичная структура</b> — последовательность аминокислот, соединённых пептидными связями. Её задаёт ген.",
      2: "<b>Вторичная структура</b> — α-спирали (красные) и β-слои (жёлтые). Держится на водородных связях между группами C=O и N–H.",
      3: "<b>Третичная структура</b> — укладка цепи в глобулу. Держится на дисульфидных мостиках S–S (жёлтые палочки), ионных, водородных связях и гидрофобных взаимодействиях.",
      4: "<b>Четвертичная структура</b> — несколько глобул вместе. Гемоглобин: 4 субъединицы (2 α и 2 β) и 4 гема с железом, которые связывают кислород.",
      den: "<b>Денатурация</b> — нагрев, кислоты, щёлочи, соли тяжёлых металлов разрушают вторичную, третичную и четвертичную структуры. Пептидные связи остаются.",
    };
    s.userData.onChip = (lv) => {
      const L = lv === "den" ? "den" : +lv; if (L === level) return;
      from = cur3.map((p) => p.clone()); to = LV[L]; t = 0; level = L; s.userData.level = String(lv); quatTo = L === 4 ? 1 : 0;
      setColors(); setPart(LMSG[L]); syncViewChips();
    };
    s.userData.tick = (dt) => {
      if (t < 1) { t = Math.min(1, t + dt / (REDUCE ? 0.01 : 1.3)); const e = ease(t); for (let i = 0; i < N; i++) cur3[i].lerpVectors(from[i], to[i], e); writeChain(beads, links, cur3); showSS(); }
      if (Math.abs(quatT - quatTo) > 1e-3) { quatT += (quatTo - quatT) * Math.min(1, dt * 4); const sc = Math.max(0.001, quatT); copies.forEach((c) => c.grp.scale.setScalar(sc)); hemes.scale.setScalar(sc); }
    };
    s.userData.onPick = (hit) => {
      const o = hit.object.userData.org;
      if (o === "heme") { setPart("<b>Гем</b> с ионом железа Fe²⁺ — здесь гемоглобин связывает кислород."); return true; }
      if (o === "ssb") { setPart("<b>Дисульфидный мостик S–S</b> между остатками цистеина — держит третичную структуру."); return true; }
      if (o === "quat") { setPart("<b>Ещё одна субъединица</b> гемоглобина: всего 2 α-цепи и 2 β-цепи."); return true; }
      if (hit.object === beads || hit.object === links) { const i = hit.instanceId; const w = level === 1 || level === "den" ? `<b>Остаток аминокислоты №${i + 1}</b> — звено цепи.` : { hel: "<b>α-спираль</b> — виток цепи, закреплённый водородными связями.", str: "<b>β-слой</b> — участки цепи лежат рядом и сшиты водородными связями.", loop: "<b>Петля</b> — гибкий участок между спиралями и слоями." }[segOf(i)]; setPart(w); return true; }
      return false;
    };
    s.userData.onClear = () => setPart(LMSG[level]);
    s.userData.chips = [["1", "1 · Первичная"], ["2", "2 · Вторичная"], ["3", "3 · Третичная"], ["4", "4 · Четвертичная"], ["den", "Денатурация"]];
    s.userData.level = "1";
    s.userData.labels = [];
    s.userData.home = { dir: new V3(0.25, 0.3, 1), target: new V3(0, 0, 0), fitW: 5.4, fitH: 4.4, min: 3, max: 40 };
    s.userData.spin = g; s.userData.name = "levels"; s.userData.info = INFO.levels;
    return s;
  }

  const CELL_TITLE = {}, CELL_SHORT = {};
  for (const [k, [sh, ti]] of Object.entries(TOPIC.views)) { CELL_SHORT[k] = sh; CELL_TITLE[k] = ti; }
  const isCell = (k) => k in CELL_TITLE;
  const ATP_EXTRA = `<div class="chips" id="atpMode"><button type="button" data-mix="0" aria-pressed="true">Шарики-палочки</button><button type="button" data-mix="1" aria-pressed="false">Объёмная</button></div><div class="chips" id="atpGroups"><button type="button" data-g="aden">Аденин</button><button type="button" data-g="rib">Рибоза</button><button type="button" data-g="phos">Фосфаты</button><button type="button" data-g="macro">Макроэргические связи</button></div>`;

  /* ───────── подписи ───────── */
  let labelNodes = [];
  function mountLabels(scene) {
    labelsEl.innerHTML = "";
    labelNodes = (scene.userData.labels || []).map((l) => {
      const el = document.createElement("div"); el.className = "lbl" + (l.keep ? " keep" : ""); el.innerHTML = `<i></i><span>${l.text}</span>`;
      labelsEl.appendChild(el); return { ...l, el, w: 0 };
    });
  }
  const tmpV = new V3();
  // подписи не должны наезжать друг на друга и на панели: выбранная — первой, остальные по очереди, лишние прячем
  function updateLabels(scene) {
    const w = labelsEl.clientWidth, h = labelsEl.clientHeight, spin = scene.userData.spin, sel = scene.userData.sel;
    const camDir = new V3(); camera.getWorldDirection(camDir);
    const placed = [], order = labelNodes.slice().sort((a, b) => (b.key === sel) - (a.key === sel) || (b.keep ? 1 : 0) - (a.keep ? 1 : 0));
    for (const l of order) {
      tmpV.copy(l.pos); if (spin) tmpV.applyMatrix4(spin.matrixWorld);
      const behind = tmpV.clone().sub(camera.position).dot(camDir) < 0.1;
      tmpV.project(camera);
      const x = (tmpV.x * 0.5 + 0.5) * w, y = (-tmpV.y * 0.5 + 0.5) * h;
      if (!l.w) l.w = l.el.offsetWidth || 90;
      const flip = x + l.w > w - 6;                       // у правого края подпись уходит влево от точки
      const r = flip ? { x0: x - l.w - 4, x1: x + 6, y0: y - 14, y1: y + 14 } : { x0: x - 6, x1: x + l.w + 4, y0: y - 14, y1: y + 14 };
      let hide = behind || r.x0 < -10 || r.x1 > w + 10 || y < view.top + 12 || y > h - view.bot - 10 || (sel && l.key && l.key !== sel);
      if (!hide && placed.some((p) => r.x0 < p.x1 && r.x1 > p.x0 && r.y0 < p.y1 && r.y1 > p.y0)) hide = true;
      if (!hide) placed.push(r);
      l.el.classList.toggle("off", !!hide); l.el.classList.toggle("hi", !!(sel && l.key === sel)); l.el.classList.toggle("flip", flip);
      l.el.style.transform = `translate(${(flip ? x - l.w + 3.5 : x - 3.5).toFixed(1)}px, ${(y - 3.5).toFixed(1)}px)`;
    }
  }

  /* ───────── состояние и интерфейс ───────── */
  const withInfo = (fn, key) => () => { const sc = fn(); if (TOPIC.views[key]) sc.userData.info = PARTS[key]; return sc; };
  const scenes = {};
  const builders = { cell: buildCell, dna: withInfo(buildDNA, "dna"), atp: withInfo(buildATP, "atp"), bilayer: withInfo(buildBilayer, "bilayer"), lock: buildEnzyme, plant: buildPlant, fungus: buildFungus, bact: buildBact, levels: buildLevels, rna: buildRNA };
  for (const k of ["ala", "dipep", "damp", "h2o", "hb", "ice", "salt", "ab", "tg", "pl"]) builders[k] = () => buildMolView(k);
  let cur = FIRST_VIEW, cellKey = FIRST_VIEW, mode = "learn", tween = null, lastTouch = performance.now();
  scenes[cellKey] = builders[cellKey]();
  const state = { org: null };

  // Видимая зона: между верхней панелью и шторкой. Сцена плавно сдвигается в её центр (смещение кадра камеры).
  const view = { w: 1, h: 1, top: 0, bot: 0, shift: 0, shiftTo: 0, baseFov: 40 };
  function measure() {
    const w = stage.clientWidth, h = stage.clientHeight, wide = w >= 900;
    const topR = $(".top").getBoundingClientRect(), botR = $(".bottom").getBoundingClientRect(), st = stage.getBoundingClientRect();
    view.w = w; view.h = h;
    view.top = wide ? 0 : Math.max(0, topR.bottom - st.top);
    view.bot = wide ? 0 : Math.max(0, st.bottom - botR.top);
    view.shiftTo = Math.max(0, (view.bot - view.top) / 2);
  }
  // Смещаем кадр вверх, не меняя масштаба: виртуальный кадр выше на 2s, угол обзора растёт ровно настолько же
  function applyOffset() {
    const s = Math.round(view.shift);
    if (s > 0) {
      const fullH = view.h + 2 * s;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(D2R(view.baseFov / 2)) * fullH / view.h));
      camera.setViewOffset(view.w, fullH, 0, 2 * s, view.w, view.h);
    } else { camera.fov = view.baseFov; camera.clearViewOffset(); camera.aspect = view.w / view.h; }
    camera.updateProjectionMatrix();
  }
  function sizeAll() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    view.baseFov = w / h < 0.75 ? 40 : 34;
    measure(); view.shift = view.shiftTo; applyOffset();
  }
  const ros = [new ResizeObserver(sizeAll), new ResizeObserver(measure), new ResizeObserver(measure)];
  ros[0].observe(stage); ros[1].observe($(".bottom")); ros[2].observe($(".top"));
  sizeAll();

  function halfFovs() {
    const v = D2R(view.baseFov / 2), hH = Math.atan(Math.tan(v) * (view.w / view.h));
    const visFrac = Math.max(0.35, (view.h - view.top - view.bot) / view.h), vV = Math.atan(Math.tan(v) * visFrac);
    return { h: hH, v: vV };
  }
  function homeOf(scene) {
    const hm = scene.userData.home, f = halfFovs();
    const d = Math.max(hm.fitW / Math.tan(f.h), hm.fitH / Math.tan(f.v)) + (hm.depth || 0);
    return { pos: hm.dir.clone().normalize().multiplyScalar(d).add(hm.target), target: hm.target.clone() };
  }
  function jump(scene) {
    const h = homeOf(scene); camera.position.copy(h.pos); controls.target.copy(h.target);
    controls.minDistance = scene.userData.home.min; controls.maxDistance = Math.max(scene.userData.home.max, h.pos.distanceTo(h.target) * 1.6); controls.update();
  }
  function flyTo(pos, target, ms = 950) {
    tween = { t0: performance.now(), ms: REDUCE ? 1 : ms, p0: camera.position.clone(), p1: pos, q0: controls.target.clone(), q1: target };
  }
  function focusOn(obj) {
    const box = new THREE.Box3().setFromObject(obj), sph = box.getBoundingSphere(new THREE.Sphere()), f = halfFovs();
    const dist = Math.max(3.0, (sph.radius / Math.sin(Math.min(f.h, f.v))) * 0.95);
    const dir = camera.position.clone().sub(sph.center).normalize();
    if (dir.y < 0.15) dir.y = 0.25; dir.normalize();
    flyTo(sph.center.clone().add(dir.multiplyScalar(dist)), sph.center.clone());
  }

  function setLook(look) {
    LOOK = look; try { localStorage.setItem("hb.l3d.look", look); } catch (e) {} app.dataset.look = look;
    $("#lookBtn").setAttribute("aria-pressed", String(look === "scope"));
    renderer.toneMappingExposure = LOOKS[look].exposure;
    for (const k in scenes) applyLook(scenes[k]);
  }

  const crumbs = $("#crumbs");
  function renderCrumbs() {
    const items = [["cell", CELL_SHORT[cellKey]]];
    if (state.org) items.push(["org", ORG[state.org].name.replace("Плазматическая мембрана", "Мембрана")]);
    if (!isCell(cur)) items.push(["mol", PARTS[cur].title]);
    crumbs.innerHTML = items.map(([k, t], i) => `${i ? '<span class="sep">›</span>' : ""}<button type="button" data-k="${k}">${t}</button>`).join("");
    crumbs.hidden = items.length < 2;
    $("#title").textContent = !isCell(cur) ? (PARTS[cur].head || PARTS[cur].name) : state.org ? ORG[state.org].name : CELL_TITLE[cellKey];
    $("#eyebrow").textContent = !isCell(cur) ? "Молекулярный уровень" : state.org ? "Органоид · " + ORG[state.org].tag.toLowerCase() : "Биология · " + TOPIC.name;
  }
  crumbs.addEventListener("click", (e) => {
    const k = e.target.closest("button")?.dataset.k; if (!k) return;
    if (k === "cell") goCell(); else if (k === "org" && !isCell(cur)) leaveMolecule();
  });

  /* шторка */
  function sheetIdle() {
    sheet.innerHTML = `<div class="hint"><span><b>Крути</b> пальцем</span><span><b>Щипок</b> — ближе</span><span><b>Тап</b> по органоиду</span></div>`;
  }
  const FOLD = `<button class="fold" type="button" data-act="fold" aria-label="Свернуть карточку" aria-expanded="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>`;
  function sheetOrg(k) {
    const o = ORG[k]; sheet.classList.remove("min");
    sheet.innerHTML = `<div class="shead"><span class="chip"><i></i>${o.tag}</span>${FOLD}</div><h2>${o.name}</h2><div class="body"><p>${o.text}</p><div class="trap"><b>Ловушка ЕГЭ</b>${o.trap}</div></div>
      <div class="acts">${o.drill ? `<button class="btn" type="button" data-act="drill">${o.drillLabel} →</button>` : ""}<button class="btn ghost" type="button" data-act="home">К клетке</button></div>`;
  }
  function sheetMol(key) {
    const m = PARTS[key];
    let extra = "";
    if (key === "atp") extra = `<div class="chips" id="atpMode"><button type="button" data-mix="0" aria-pressed="true">Шарики-палочки</button><button type="button" data-mix="1" aria-pressed="false">Объёмная</button></div>
      <div class="chips" id="atpGroups"><button type="button" data-g="aden">Аденин</button><button type="button" data-g="rib">Рибоза</button><button type="button" data-g="phos">Фосфаты</button><button type="button" data-g="macro">Макроэргические связи</button></div>`;
    sheet.classList.remove("min");
    sheet.innerHTML = `<div class="shead"><span class="chip"><i></i>${m.tag}</span>${FOLD}</div><h2>${m.name}</h2>${extra}<div class="part" id="part">${m.hint}</div><div class="body"><p>${m.text}</p><div class="trap"><b>Ловушка ЕГЭ</b>${m.trap}</div></div>
      <div class="acts"><button class="btn ghost" type="button" data-act="up">← ${ORG[state.org].name.replace("Плазматическая мембрана", "Мембрана")}</button><button class="btn ghost" type="button" data-act="home">К клетке</button></div>`;
    syncAtpChips();
  }
  function setPart(html) { const p = $("#part"); if (p) p.innerHTML = html; }
  function syncAtpChips() {
    const s = scenes.atp; if (!s || cur !== "atp") return;
    sh.querySelectorAll("#atpGroups button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.g === s.userData.hiGroup)));
  }
  sheet.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.act === "fold") { const min = sheet.classList.toggle("min"); b.setAttribute("aria-expanded", String(!min)); b.setAttribute("aria-label", min ? "Развернуть карточку" : "Свернуть карточку"); }
    else if (b.dataset.act === "drill") enterMolecule(ORG[state.org].drill);
    else if (b.dataset.act === "home") goCell();
    else if (b.dataset.act === "up") leaveMolecule();
    else if (b.dataset.act === "next") nextQ();
    else if (b.dataset.mix != null) { scenes.atp.userData.setMix(+b.dataset.mix); sh.querySelectorAll("#atpMode button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }
    else if (b.dataset.v) { const s = scenes[cur]; if (s && s.userData.onChip) s.userData.onChip(b.dataset.v); }
    else if (b.dataset.g) { const s = scenes.atp; if (s.userData.hiGroup === b.dataset.g) s.userData.onClear(); else { s.userData.pickGroup(b.dataset.g); syncAtpChips(); } }
  });

  /* навигация */
  function selectOrg(k, obj) {
    const s = scenes[cellKey]; state.org = k; s.userData.sel = k; refreshSel(s);
    // поднимаемся до группы органоида (одна митохондрия, ядро целиком, стопка Гольджи)
    let f = obj; while (f && f.parent && !f.userData.focus && f.parent.parent !== s) f = f.parent;
    if (k === "membrane") { const h = homeOf(s); flyTo(h.pos.sub(h.target).multiplyScalar(0.8).add(h.target), h.target); }
    else if (k === "ribo") flyTo(camera.position.clone().lerp(controls.target, 0.3), controls.target.clone());
    else focusOn(f || obj);
    renderCrumbs();
  }
  function clearOrg() { const s = scenes[cellKey]; state.org = null; s.userData.sel = null; refreshSel(s); renderCrumbs(); }
  function goCell() {
    if (!isCell(cur)) { switchScene(cellKey, () => { clearOrg(); jump(scenes[cellKey]); afterHome(); }); return; }
    clearOrg(); const h = homeOf(scenes[cellKey]); flyTo(h.pos, h.target); afterHome();
  }
  function afterHome() { const s = scenes[cellKey]; if (mode === "quiz" && QZ().length) renderQ(); else if (s && s.userData.info) sheetView(s); else sheetIdle(); }
  function sheetView(s) {
    const m = s.userData.info; sheet.classList.remove("min");
    const extra = s.userData.name === "atp" ? ATP_EXTRA : (s.userData.chips && s.userData.chips.length ? `<div class="chips" id="vchips">${s.userData.chips.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="false">${l}</button>`).join("")}</div>` : "");
    sheet.innerHTML = `<div class="shead"><span class="chip"><i></i>${m.tag}</span>${FOLD}</div><h2>${m.name}</h2>${extra}<div class="part" id="part">${m.hint}</div><div class="body"><p>${m.text}</p><div class="trap"><b>Ловушка ЕГЭ</b>${m.trap}</div></div>`;
    syncAtpChips(); syncViewChips(); if (s.userData.name === "levels") s.userData.onClear();
  }
  function switchScene(key, then) {
    const fade = $("#fade"); fade.classList.add("on");
    setTimeout(() => {
      if (!scenes[key]) { scenes[key] = builders[key](); applyLook(scenes[key]); }
      cur = key; tween = null; mountLabels(scenes[key]);
      $("#modes").hidden = !isCell(key) || !QZ().length;
      if (then) then();          // сначала шторка, потом камера: кадр считается по её высоте
      renderCrumbs(); measure(); view.shift = view.shiftTo; applyOffset();
      if (!scenes[key].userData.keepCam) jump(scenes[key]);
      scenes[key].userData.keepCam = false;
      requestAnimationFrame(() => fade.classList.remove("on"));
    }, REDUCE ? 0 : 230);
  }
  function enterMolecule(key) { switchScene(key, () => { const s = scenes[key]; if (s.userData.onClear) s.userData.onClear(); sheetMol(key); }); }
  function leaveMolecule() {
    const k = state.org;
    switchScene(cellKey, () => {
      const s = scenes[cellKey]; sheetOrg(k);
      measure(); view.shift = view.shiftTo; applyOffset(); jump(s); s.userData.keepCam = true;
      const obj = s.userData.pick.find((m) => m.userData.org === k && !m.isInstancedMesh) || s.userData.pick.find((m) => m.userData.org === k);
      selectOrg(k, obj); if (tween) tween.ms = 1;
    });
  }

  /* выбор касанием */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  renderer.domElement.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; lastTouch = performance.now(); });
  renderer.domElement.addEventListener("pointerup", (e) => {
    lastTouch = performance.now();
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8 || performance.now() - down.t > 450) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const s = scenes[cur], hits = ray.intersectObjects(s.userData.pick, false);
    if (!isCell(cur) || s.userData.onPick) {
      const h = hits[0];
      if (!h || !s.userData.onPick(h)) { if (s.userData.onClear) s.userData.onClear(); if (s.userData.name !== "levels") setPart((s.userData.info || PARTS[cur]).hint); }
      return;
    }
    const hit = hits.find((h) => h.object.userData.org !== "membrane") || hits[0];
    if (!hit) { if (mode === "learn" && state.org) { clearOrg(); sheetIdle(); } return; }
    const k = hit.object.userData.org;
    if (mode === "quiz") return answerQ(k, hit.object);
    buzz("select"); selectOrg(k, hit.object); sheetOrg(k);
  });
  controls.addEventListener("start", () => { lastTouch = performance.now(); tween = null; });

  /* режим «Найди органоид» */
  const QUIZ_ANIMAL = [
    ["Где синтезируется большая часть АТФ при кислородном дыхании?", ["mito"]],
    ["Какой органоид упаковывает белки в пузырьки и образует лизосомы?", ["golgi"]],
    ["Где синтезируются липиды?", ["ser"]],
    ["Где хранится наследственная информация и собираются субъединицы рибосом?", ["nucleus"]],
    ["Какой органоид образует веретено деления?", ["centro"]],
    ["Что переваривает отслужившие органоиды?", ["lyso"]],
    ["На каком органоиде синтезируются белки на экспорт?", ["rer", "ribo"]],
    ["Что избирательно пропускает вещества в клетку?", ["membrane"]],
  ];
  let qi = 0, qScore = 0, qDone = false, qTries = 0;
  function renderQ(verdict = "") {
    if (qi >= QZ().length) {
      sheet.innerHTML = `<div class="qhead"><span class="chip"><i></i>Найди органоид</span><span class="qcount">${QZ().length} / ${QZ().length}</span></div><h2>Готово: ${qScore} из ${QZ().length} с первой попытки</h2><p>Тапни любой органоид, чтобы повторить его функцию, или пройди ещё раз.</p><div class="acts"><button class="btn" type="button" data-act="restart">Ещё раз</button></div>`;
      sheet.querySelector('[data-act="restart"]').onclick = () => { qi = 0; qScore = 0; renderQ(); };
      return;
    }
    sheet.innerHTML = `<div class="qhead"><span class="chip"><i></i>Найди органоид</span><span class="qcount">${qi + 1} / ${QZ().length}</span></div><h2>${QZ()[qi][0]}</h2><p>Найди его в клетке и тапни.</p>${verdict}${qDone ? `<div class="acts"><button class="btn" type="button" data-act="next">Дальше →</button></div>` : ""}`;
  }
  function answerQ(k, obj) {
    if (qDone || qi >= QZ().length) { selectOrg(k, obj); return; }
    const ok = QZ()[qi][1].includes(k);
    if (ok) {
      if (qTries === 0) { qScore++; try { window.hbLab && window.hbLab.right("l3d", null, "l3d:" + cellKey + ":" + qi); } catch (e) {} }
      buzz("success");
      qDone = true; selectOrg(k, obj);
      renderQ(`<div class="verdict ok">Верно: ${ORG[k].name}. ${ORG[k].text.split(". ")[0]}.</div>`);
    } else {
      qTries++; buzz("error");
      renderQ(`<div class="verdict bad">Это ${ORG[k].name.toLowerCase()}. Попробуй ещё.</div>`);
      sheet.classList.remove("shake"); void sheet.offsetWidth; sheet.classList.add("shake");
    }
  }
  function nextQ() { qi++; qDone = false; qTries = 0; clearOrg(); const h = homeOf(scenes[cellKey]); flyTo(h.pos, h.target); renderQ(); }
  $("#modes").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    mode = b.dataset.mode; sh.querySelectorAll("#modes button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    clearOrg(); if (mode === "quiz") { qi = 0; qScore = 0; qDone = false; qTries = 0; renderQ(); } else sheetIdle();
    const h = homeOf(scenes[cellKey]); flyTo(h.pos, h.target);
  });

  /* кнопки сверху */
  $("#types").innerHTML = Object.entries(CELL_SHORT).map(([k, l]) => `<button type="button" data-cell="${k}" aria-pressed="${k === cellKey}">${l}</button>`).join("");
  $("#types").hidden = Object.keys(CELL_SHORT).length < 2;
  if (typeof LAB_OPTS === "undefined") {   // страница-концепт: выбор темы (в тренажёре тема приходит из модуля)
    const sel = document.createElement("select"); sel.id = "topicSel"; sel.setAttribute("aria-label", "Тема");
    sel.innerHTML = Object.entries(TOPICS).map(([k, t]) => `<option value="${k}"${k === TOPIC_KEY ? " selected" : ""}>${t.name}</option>`).join("");
    sel.addEventListener("change", () => { location.hash = sel.value; location.reload(); });
    $(".looks").prepend(sel);
  }
  $("#lookBtn").addEventListener("click", () => setLook(LOOK === "scope" ? "notebook" : "scope"));
  $("#types").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b || b.dataset.cell === cellKey) return;
    const k = b.dataset.cell; sh.querySelectorAll("#types button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    state.org = null; if (scenes[cellKey]) { scenes[cellKey].userData.sel = null; refreshSel(scenes[cellKey]); }
    cellKey = k; qi = 0; qScore = 0; qDone = false; qTries = 0;
    switchScene(k, () => { const s = scenes[k]; s.userData.sel = null; refreshSel(s); afterHome(); });
  });
  $("#labelsBtn").addEventListener("click", (e) => { const on = e.currentTarget.getAttribute("aria-pressed") !== "true"; e.currentTarget.setAttribute("aria-pressed", String(on)); labelsEl.classList.toggle("hidden", !on); });
  const goBack = () => { if (!isCell(cur)) leaveMolecule(); else if (state.org) goCell(); else close(); };
  $("#back").addEventListener("click", goBack);

  /* цикл */
  let last = performance.now();
  // слабый телефон: если первые кадры идут медленнее ~30 к/с, снижаем чёткость рендера
  const perf = { n: 0, sum: 0, done: false };
  function frame(now) {
    const raw = (now - last) / 1000, dt = Math.min(0.05, raw); last = now;
    if (!perf.done && !document.hidden) {
      perf.n++; if (perf.n > 15) perf.sum += raw;
      if (perf.n === 105) { perf.done = true; if (perf.sum / 90 > 0.034 && renderer.getPixelRatio() > 1.25) { renderer.setPixelRatio(1.25); sizeAll(); } }
    }
    const s = scenes[cur];
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / tween.ms), e = ease(k);
      camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.q0, tween.q1, e);
      if (k >= 1) tween = null;
    }
    if (Math.abs(view.shift - view.shiftTo) > 0.5) { view.shift += (view.shiftTo - view.shift) * Math.min(1, dt * 6); applyOffset(); }
    controls.autoRotate = !REDUCE && !tween && now - lastTouch > 3500 && (!isCell(cur) || !state.org);
    controls.update();
    if (s.userData.tick) s.userData.tick(dt);
    renderer.render(s, camera);
    updateLabels(s);
    if (alive) raf = requestAnimationFrame(frame);
  }

  { let q = null; try { q = localStorage.getItem("hb.l3d.look"); } catch (e) {} setLook(LOOKS[q] ? q : "notebook"); }
  jump(scenes[cellKey]); mountLabels(scenes[cellKey]); renderCrumbs(); $("#modes").hidden = !QZ().length; afterHome();
  let raf = requestAnimationFrame(frame);
  window.__lab3d = { scenes, selectOrg: (k) => { const o = scenes[cellKey].userData.pick.find((m) => m.userData.org === k); selectOrg(k, o); sheetOrg(k); }, enterMolecule, goCell, setLook, camera, controls, get cur() { return cur; } };

  try { if (tgw && tgw.BackButton) { tgw.BackButton.onClick(onTgBack); tgw.BackButton.show(); } } catch (e) {}
  try { window.hbLab && window.hbLab.goal("lab3d_opened", { how: opts.how || "module", topic: opts.topic || "cell" }); } catch (e) {}
  active = { close };
  return active;
}
