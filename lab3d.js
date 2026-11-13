/* Химбио без зубрёжки · 3D-лаборатория «Клетка» (v4.8). Собрано build_lab3d.py из концепта claude/3d/kletka-3d.src.html.
   three.js r160 лежит рядом: vendor/three-r160. Открывается из модуля «Строение клетки» и по ссылке ?start=cell3d. */
import * as THREE from "./vendor/three-r160/three.module.min.js";
import { OrbitControls } from "./vendor/three-r160/OrbitControls.js";
import { RoomEnvironment } from "./vendor/three-r160/RoomEnvironment.js";
import { mergeGeometries } from "./vendor/three-r160/BufferGeometryUtils.js";

const MOLS = {"atp":{"atoms":[["N",-6.556,-0.762,2.495],["C",-5.734,-1.162,1.451],["N",-6.264,-1.94,0.48],["C",-5.464,-2.339,-0.532],["N",-4.164,-2.042,-0.739],["C",-3.691,-1.261,0.245],["C",-4.386,-0.782,1.344],["N",-3.573,0.014,2.124],["C",-2.399,-0.016,1.528],["N",-2.427,-0.753,0.374],["C",-1.336,-0.992,-0.556],["O",-0.134,-0.359,-0.037],["C",0.321,0.602,-1.015],["C",0.94,1.818,-0.332],["O",2.121,1.415,0.347],["P",3.087,2.557,0.91],["O",2.398,3.744,1.494],["O",3.94,2.983,-0.386],["O",4.161,1.841,1.823],["P",5.188,0.727,1.35],["O",5.955,0.08,2.461],["O",6.098,1.502,0.286],["O",4.356,-0.302,0.475],["P",4.909,-1.76,0.19],["O",6.21,-1.876,-0.521],["O",4.874,-2.491,1.609],["O",3.681,-2.485,-0.531],["C",-0.911,0.957,-1.838],["O",-0.584,1.501,-3.108],["C",-1.581,-0.401,-1.953],["O",-0.913,-1.184,-2.956],["H",-6.221,0.052,2.997],["H",-7.538,-0.811,2.261],["H",-5.929,-2.979,-1.277],["H",-1.504,0.477,1.89],["H",-1.16,-2.073,-0.58],["H",1.087,0.108,-1.627],["H",1.191,2.588,-1.069],["H",0.252,2.236,0.409],["H",3.739,3.919,-0.6],["H",5.574,1.971,-0.397],["H",5.649,-2.233,2.155],["H",2.945,-2.633,0.09],["H",-1.553,1.66,-1.294],["H",-1.416,1.775,-3.538],["H",-2.63,-0.325,-2.253],["H",-0.607,-0.565,-3.648]],"bonds":[[0,1,1],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,6,1],[6,7,1],[7,8,2],[8,9,1],[9,10,1],[10,11,1],[11,12,1],[12,13,1],[13,14,1],[14,15,1],[15,16,2],[15,17,1],[15,18,1],[18,19,1],[19,20,2],[19,21,1],[19,22,1],[22,23,1],[23,24,2],[23,25,1],[23,26,1],[12,27,1],[27,28,1],[27,29,1],[29,30,1],[6,1,2],[29,10,1],[9,5,1],[0,31,1],[0,32,1],[3,33,1],[8,34,1],[10,35,1],[12,36,1],[13,37,1],[13,38,1],[17,39,1],[21,40,1],[25,41,1],[26,42,1],[27,43,1],[28,44,1],[29,45,1],[30,46,1]],"groups":["aden","aden","aden","aden","aden","aden","aden","aden","aden","aden","rib","rib","rib","rib","pa","pa","pa","pa","pb","pb","pb","pb","pg","pg","pg","pg","pg","rib","rib","rib","rib","aden","aden","aden","aden","rib","rib","rib","rib","pa","pb","pg","pg","rib","rib","rib","rib"],"hiBonds":[[18,15],[18,19],[22,19],[22,23]]},"glucose":{"atoms":[["O",1.916,-2.849,0.135],["C",1.709,-1.533,0.653],["C",0.897,-0.688,-0.342],["O",-0.401,-1.273,-0.593],["C",-1.469,-0.715,0.156],["O",-1.229,-0.887,1.542],["C",-1.671,0.778,-0.191],["O",-2.588,0.946,-1.29],["C",-0.35,1.45,-0.591],["O",-0.372,2.85,-0.265],["C",0.827,0.782,0.111],["O",2.04,1.469,-0.214],["H",2.477,-3.318,0.775],["H",1.19,-1.636,1.609],["H",2.691,-1.082,0.829],["H",1.42,-0.743,-1.306],["H",-2.379,-1.269,-0.099],["H",-1.414,-1.828,1.713],["H",-2.125,1.299,0.66],["H",-2.297,0.348,-2.005],["H",-0.2,1.41,-1.677],["H",-1.193,3.204,-0.659],["H",0.708,0.865,1.198],["H",1.814,2.421,-0.15]],"bonds":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[4,6,1],[6,7,1],[6,8,1],[8,9,1],[8,10,1],[10,11,1],[10,2,1],[0,12,1],[1,13,1],[1,14,1],[2,15,1],[4,16,1],[5,17,1],[6,18,1],[7,19,1],[8,20,1],[9,21,1],[10,22,1],[11,23,1]]},"water":{"atoms":[["O",0.007,0.398,0.0],["H",-0.767,-0.185,0.0],["H",0.76,-0.213,0.0]],"bonds":[[0,1,1],[0,2,1]]}};
const CSS = "\n/* Layout: one-screen 3D lab — full-bleed stage, thin top bar over it, glass bottom sheet. Tokens follow the «Химбио без зубрёжки» trainer. */\n:host {\n  --bg: #F5F7FB;\n  --ink: #17213A;\n  --ink-2: #56627D;\n  --line: #D6DDEA;\n  --glass: rgba(255, 255, 255, .84);\n  --glass-line: rgba(23, 33, 58, .09);\n  --accent: #C2185B;\n  --accent-soft: #FBE4EE;\n  --on-accent: #FFFFFF;\n  --ok: #24804E;\n  --ok-soft: #E1F3E8;\n  --bad: #C0392B;\n  --bad-soft: #FBE6E3;\n  --trap: #8A5A00;\n  --trap-soft: #FFF3D6;\n  --stage-1: #FFFFFF;\n  --stage-2: #E9EEF8;\n  --stage-grid: rgba(120, 140, 190, .11);\n  --shadow: 0 1px 2px rgba(23, 33, 58, .08), 0 8px 24px rgba(23, 33, 58, .10);\n  --font-display: \"Unbounded\", \"Onest\", system-ui, sans-serif;\n  --font-body: \"Onest\", system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n  --font-mono: \"IBM Plex Mono\", ui-monospace, Menlo, Consolas, monospace;\n}\n@media (prefers-color-scheme: dark) {\n  :host(:not([data-theme=\"light\"])) {\n    --bg: #0E1322; --ink: #E8ECF6; --ink-2: #9AA6C2; --line: #2A3452;\n    --glass: rgba(17, 23, 40, .84); --glass-line: rgba(255, 255, 255, .09);\n    --accent: #F06292; --accent-soft: #3A1A2A; --on-accent: #1A0B12;\n    --ok: #4CC28A; --ok-soft: #14301F; --bad: #FF7A6B; --bad-soft: #3A1A17; --trap: #FFCB6B; --trap-soft: #33280F;\n    --stage-1: #1A2440; --stage-2: #0E1322; --stage-grid: rgba(140, 160, 210, .07);\n    --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 8px 24px rgba(0, 0, 0, .35);\n    color-scheme: dark;\n  }\n}\n:host([data-theme=\"dark\"]) {\n  --bg: #0E1322; --ink: #E8ECF6; --ink-2: #9AA6C2; --line: #2A3452;\n  --glass: rgba(17, 23, 40, .84); --glass-line: rgba(255, 255, 255, .09);\n  --accent: #F06292; --accent-soft: #3A1A2A; --on-accent: #1A0B12;\n  --ok: #4CC28A; --ok-soft: #14301F; --bad: #FF7A6B; --bad-soft: #3A1A17; --trap: #FFCB6B; --trap-soft: #33280F;\n  --stage-1: #1A2440; --stage-2: #0E1322; --stage-grid: rgba(140, 160, 210, .07);\n  --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 8px 24px rgba(0, 0, 0, .35);\n  color-scheme: dark;\n}\n/* стиль «Микроскоп»: тёмное поле, флуоресценция */\n.app[data-look=\"scope\"] {\n  --ink: #E6F0FF; --ink-2: #8FA3C7; --line: #22314F;\n  --glass: rgba(6, 10, 20, .80); --glass-line: rgba(120, 190, 255, .16);\n  --accent: #4DE1FF; --accent-soft: rgba(77, 225, 255, .14); --on-accent: #03121A;\n  --ok: #3DDC97; --ok-soft: rgba(61, 220, 151, .14); --bad: #FF6B8B; --bad-soft: rgba(255, 107, 139, .14);\n  --trap: #FFD166; --trap-soft: rgba(255, 209, 102, .12);\n  --stage-1: #0D1A33; --stage-2: #020409; --stage-grid: transparent;\n  color-scheme: dark;\n}\n:host { all: initial; position: fixed; inset: 0; z-index: 3000; display: block; }\n[hidden] { display: none !important; }\n*, *::before, *::after { box-sizing: border-box; }\n.app { position: relative; height: 100%; overflow: hidden; background: var(--stage-2); color: var(--ink); font-family: var(--font-body); -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; }\n.stage {\n  position: absolute; inset: 0;\n  background:\n    linear-gradient(var(--stage-grid) 1px, transparent 1px) 0 0 / 22px 22px,\n    linear-gradient(90deg, var(--stage-grid) 1px, transparent 1px) 0 0 / 22px 22px,\n    radial-gradient(120% 75% at 50% 38%, var(--stage-1), var(--stage-2));\n  transition: background .4s;\n}\n.stage canvas { position: absolute; inset: 0; width: 100% !important; height: 100% !important; display: block; touch-action: none; outline: none; }\n.fade { position: absolute; inset: 0; background: var(--stage-2); opacity: 0; pointer-events: none; transition: opacity .22s ease; z-index: 4; }\n.fade.on { opacity: 1; }\n\n/* подписи органоидов */\n.labels { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }\n.lbl { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; will-change: transform; transition: opacity .25s; }\n.lbl i { width: 7px; height: 7px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 2px var(--stage-1); flex: none; }\n.lbl span { font: 600 11px/1 var(--font-body); padding: 5px 8px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); color: var(--ink); box-shadow: var(--shadow); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }\n.lbl.flip { flex-direction: row-reverse; }\n.lbl.hi span { background: var(--accent); color: var(--on-accent); border-color: transparent; }\n.lbl.off { opacity: 0; }\n.labels.hidden .lbl:not(.keep) { opacity: 0; }\n\n/* верхняя панель */\n.top { position: absolute; z-index: 5; top: 0; left: 0; right: 0; padding-top: calc(var(--tg-top, env(safe-area-inset-top, 0px)) + 12px); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 10px; pointer-events: none; }\n.top > * { pointer-events: auto; }\n.row { display: flex; align-items: center; gap: 10px; min-width: 0; }\n.iconbtn { flex: none; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); display: grid; place-items: center; box-shadow: var(--shadow); cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }\n.iconbtn svg { width: 18px; height: 18px; }\n.ttl { min-width: 0; flex: 1; }\n.eyebrow { font: 500 10px/1.2 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }\nh1 { margin: 2px 0 0; font: 600 18px/1.15 var(--font-display); letter-spacing: -.01em; text-wrap: balance; overflow-wrap: anywhere; }\n.pill { flex: none; height: 34px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--ink); font: 600 12px/1 var(--font-body); box-shadow: var(--shadow); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }\n.pill[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); border-color: transparent; }\n.app[data-look=\"scope\"] .pill[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.crumbs { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; font: 500 11px/1 var(--font-mono); letter-spacing: .04em; color: var(--ink-2); text-transform: uppercase; }\n.crumbs button { font: inherit; letter-spacing: inherit; text-transform: inherit; color: var(--ink-2); background: none; border: 0; padding: 4px 2px; cursor: pointer; }\n.crumbs button:last-child { color: var(--ink); cursor: default; }\n.crumbs .sep { opacity: .5; }\n.seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); box-shadow: var(--shadow); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); max-width: 100%; overflow-x: auto; scrollbar-width: none; }\n.seg::-webkit-scrollbar { display: none; }\n.seg button { flex: none; border: 0; background: none; color: var(--ink-2); font: 600 12px/1 var(--font-body); padding: 8px 11px; border-radius: 999px; cursor: pointer; white-space: nowrap; }\n.seg button[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); }\n.app[data-look=\"scope\"] .seg button[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.looks { display: flex; align-items: center; gap: 8px; min-width: 0; }\n.looks .seg { min-width: 0; }\n.iconbtn[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); border-color: transparent; }\n.looks .tag { font: 500 10px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }\n\n/* нижняя шторка */\n.bottom { position: absolute; z-index: 5; left: 0; right: 0; bottom: 0; padding-bottom: calc(var(--tg-bottom, env(safe-area-inset-bottom, 0px)) + 12px); padding-left: max(12px, env(safe-area-inset-left, 0px)); padding-right: max(12px, env(safe-area-inset-right, 0px)); display: grid; gap: 8px; pointer-events: none; }\n.bottom > * { pointer-events: auto; }\n.modes { justify-self: center; }\n.sheet { background: var(--glass); border: 1px solid var(--glass-line); border-radius: 22px; box-shadow: var(--shadow); padding: 14px 16px 14px; max-height: min(46vh, 380px); overflow-y: auto; backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2); max-width: 560px; width: 100%; justify-self: center; box-sizing: border-box; }\n.hint { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 14px; font: 500 12px/1.3 var(--font-body); color: var(--ink-2); }\n.hint b { color: var(--ink); font-weight: 600; }\n.chip { display: inline-flex; align-items: center; gap: 6px; font: 500 10px/1 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; padding: 5px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); }\n.chip i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }\n.shead { display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.fold { flex: none; width: 30px; height: 30px; margin: -4px -6px -4px 0; border-radius: 50%; border: 0; background: transparent; color: var(--ink-2); display: grid; place-items: center; cursor: pointer; }\n.fold svg { width: 18px; height: 18px; transition: transform .2s; }\n.sheet.min .fold svg { transform: rotate(180deg); }\n.sheet.min .body, .sheet.min .chips { display: none; }\n.sheet h2 { margin: 8px 0 6px; font: 600 17px/1.2 var(--font-display); letter-spacing: -.01em; text-wrap: balance; }\n.sheet p { margin: 0; font: 400 14px/1.45 var(--font-body); color: var(--ink); }\n.trap { margin-top: 10px; padding: 9px 11px; border-radius: 12px; background: var(--trap-soft); color: var(--ink); font: 400 13px/1.4 var(--font-body); }\n.trap b { display: block; font: 500 10px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--trap); margin-bottom: 5px; }\n.part { margin-top: 10px; padding: 9px 11px; border-radius: 12px; border: 1px dashed var(--line); font: 400 13px/1.4 var(--font-body); }\n.part b { font-weight: 600; }\n.acts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }\n.btn { border: 0; border-radius: 12px; padding: 11px 14px; font: 600 13px/1 var(--font-body); cursor: pointer; background: var(--accent); color: var(--on-accent); }\n.btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }\n.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }\n.chips button { border: 1px solid var(--line); background: transparent; color: var(--ink); font: 600 12px/1 var(--font-body); padding: 8px 10px; border-radius: 999px; cursor: pointer; }\n.chips button[aria-pressed=\"true\"] { background: var(--ink); color: var(--bg); border-color: transparent; }\n.app[data-look=\"scope\"] .chips button[aria-pressed=\"true\"] { background: var(--accent); color: var(--on-accent); }\n.qhead { display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.qcount { font: 500 11px/1 var(--font-mono); color: var(--ink-2); letter-spacing: .06em; }\n.verdict { margin-top: 10px; padding: 9px 11px; border-radius: 12px; font: 500 13px/1.4 var(--font-body); }\n.verdict.ok { background: var(--ok-soft); color: var(--ok); }\n.verdict.bad { background: var(--bad-soft); color: var(--bad); }\n.shake { animation: shake .35s; }\n@keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }\nbutton:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }\n.nogl { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; font: 500 14px/1.5 var(--font-body); color: var(--ink-2); }\n@media (min-width: 900px) {\n  .bottom { left: auto; width: 420px; right: 16px; bottom: 16px; }\n  h1 { font-size: 22px; }\n}\n@media (prefers-reduced-motion: reduce) { .lbl, .fade, .stage { transition: none; } .shake { animation: none; } }\n";
const HTML = "<div class=\"app\" id=\"app\" data-look=\"notebook\">\n  <div class=\"stage\" id=\"stage\"></div>\n  <div class=\"labels\" id=\"labels\"></div>\n  <div class=\"fade\" id=\"fade\"></div>\n\n  <header class=\"top\">\n    <div class=\"row\">\n      <button class=\"iconbtn\" id=\"back\" aria-label=\"Назад\" type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 5l-7 7 7 7\"/></svg></button>\n      <div class=\"ttl\">\n        <div class=\"eyebrow\" id=\"eyebrow\">Биология · 3D-лаборатория</div>\n        <h1 id=\"title\">Животная клетка</h1>\n      </div>\n      <button class=\"pill\" id=\"labelsBtn\" type=\"button\" aria-pressed=\"true\">Подписи</button>\n    </div>\n    <nav class=\"crumbs\" id=\"crumbs\" aria-label=\"Уровень\"></nav>\n    <div class=\"looks\">\n      <div class=\"seg\" id=\"types\" role=\"group\" aria-label=\"Какая клетка\">\n        <button type=\"button\" data-cell=\"cell\" aria-pressed=\"true\">Животная</button>\n        <button type=\"button\" data-cell=\"plant\" aria-pressed=\"false\">Растение</button>\n        <button type=\"button\" data-cell=\"fungus\" aria-pressed=\"false\">Гриб</button>\n        <button type=\"button\" data-cell=\"bact\" aria-pressed=\"false\">Бактерия</button>\n      </div>\n      <button class=\"iconbtn\" id=\"lookBtn\" type=\"button\" aria-pressed=\"false\" aria-label=\"Стиль «Микроскоп»\" title=\"Тетрадь / Микроскоп\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 4a8 8 0 0 1 0 16z\" fill=\"currentColor\"/></svg></button>\n    </div>\n  </header>\n\n  <section class=\"bottom\">\n    <div class=\"seg modes\" id=\"modes\" role=\"group\" aria-label=\"Режим\">\n      <button type=\"button\" data-mode=\"learn\" aria-pressed=\"true\">Изучать</button>\n      <button type=\"button\" data-mode=\"quiz\" aria-pressed=\"false\">Найди органоид</button>\n    </div>\n    <div class=\"sheet\" id=\"sheet\" aria-live=\"polite\"></div>\n  </section>\n</div>";

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
  const CELL_TITLE = { cell: "Животная клетка", plant: "Растительная клетка", fungus: "Клетка гриба", bact: "Бактериальная клетка" };
  const CELL_SHORT = { cell: "Животная", plant: "Растение", fungus: "Гриб", bact: "Бактерия" };
  const isCell = (k) => k in CELL_TITLE;
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
  const QZ = () => (cellKey === "cell" ? QUIZ_ANIMAL : QUIZ_MORE[cellKey]);

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
  const scenes = { cell: buildCell() };
  const builders = { dna: buildDNA, atp: buildATP, bilayer: buildBilayer, plant: buildPlant, fungus: buildFungus, bact: buildBact };
  let cur = "cell", cellKey = "cell", mode = "learn", tween = null, lastTouch = performance.now();
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
    $("#eyebrow").textContent = !isCell(cur) ? "Молекулярный уровень" : state.org ? "Органоид · " + ORG[state.org].tag.toLowerCase() : "Биология · 3D-лаборатория";
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
  function afterHome() { if (mode === "quiz") renderQ(); else sheetIdle(); }
  function switchScene(key, then) {
    const fade = $("#fade"); fade.classList.add("on");
    setTimeout(() => {
      if (!scenes[key]) { scenes[key] = builders[key](); applyLook(scenes[key]); }
      cur = key; tween = null; mountLabels(scenes[key]);
      $("#modes").hidden = !isCell(key);
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
    if (!isCell(cur)) {
      const h = hits[0];
      if (!h || !s.userData.onPick(h)) { if (s.userData.onClear) s.userData.onClear(); setPart(PARTS[cur].hint); }
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
      if (qTries === 0) { qScore++; try { window.hbLab && window.hbLab.right("l3d", null, "l3d:" + qi); } catch (e) {} }
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
  jump(scenes[cellKey]); mountLabels(scenes[cellKey]); renderCrumbs(); sheetIdle();
  let raf = requestAnimationFrame(frame);
  window.__lab3d = { scenes, selectOrg: (k) => { const o = scenes[cellKey].userData.pick.find((m) => m.userData.org === k); selectOrg(k, o); sheetOrg(k); }, enterMolecule, goCell, setLook, camera, controls, get cur() { return cur; } };

  try { if (tgw && tgw.BackButton) { tgw.BackButton.onClick(onTgBack); tgw.BackButton.show(); } } catch (e) {}
  try { window.hbLab && window.hbLab.goal("lab3d_opened", { how: opts.how || "module" }); } catch (e) {}
  active = { close };
  return active;
}
