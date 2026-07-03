/* ═══════════════════════════════════════════════════
   style.css — حاسبة العطور الاحترافية
   ═══════════════════════════════════════════════════ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --g:   #e8c070;
  --gl:  #f5dfa0;
  --bg:  #09070d;
  --cb:  rgba(255,255,255,0.07);
  --ca:  rgba(232,192,112,0.14);
  --tx:  #ffffff;
  --mu:  rgba(255,255,255,0.68);
  --bd:  rgba(232,192,112,0.25);
  --ba:  rgba(232,192,112,0.60);
  --red: #e87777;
  --green: #6ec878;
  --blue:  #6eb5c8;
  --purple:#9e6ec8;
}

/* ── Base ── */
body {
  background: var(--bg);
  color: var(--tx);
  font-family: 'Segoe UI', Tahoma, system-ui, sans-serif;
  direction: rtl;
  min-height: 100vh;
  background-image: radial-gradient(ellipse at 15% 0%, rgba(232,192,112,0.07) 0%, transparent 50%);
}

h1 {
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 300;
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--gl), var(--g), #b8902a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Layout ── */
.container { max-width: 520px; margin: 0 auto; padding: 0 16px 80px; }
.header    { text-align: center; padding: 28px 0 16px; }
.header .logo  { font-size: 44px; margin-bottom: 10px; }
.header .badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(110,200,181,0.1); border: 1px solid rgba(110,200,181,0.3);
  border-radius: 20px; padding: 4px 14px; font-size: 12px; color: #7ddbc9;
  font-weight: 600; margin-top: 6px;
}
.badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #7ddbc9; animation: pulse 2s ease infinite;
}

/* ── Tabs ── */
.tabs { display: flex; gap: 8px; justify-content: flex-start; margin-bottom: 20px; overflow-x: auto; padding: 2px 2px 7px; scrollbar-width: thin; -webkit-overflow-scrolling: touch; }
.tab {
  background: var(--cb); border: 2px solid var(--bd); color: var(--mu);
  border-radius: 50px; padding: 10px 22px; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all .2s; font-family: inherit; white-space: nowrap; flex: 0 0 auto;
}
.tab.active { background: var(--g); color: #09070d; border-color: var(--g); font-weight: 800; }

/* ── Cards ── */
.card { background: var(--cb); border: 1px solid var(--bd); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
.card-title { font-size: 16px; color: var(--g); font-weight: 700; margin-bottom: 14px; }

/* ── Form Controls ── */
.field-label { font-size: 13px; color: var(--mu); margin-bottom: 7px; font-weight: 500; }

select, input[type=number], input[type=text] {
  width: 100%; background: #0c0a15; border: 2px solid var(--bd); color: var(--tx);
  border-radius: 10px; padding: 12px 14px; font-size: 15px; font-family: inherit;
  outline: none; transition: border .2s;
}
select {
  cursor: pointer; appearance: none; padding-left: 36px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23e8c070' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: left 12px center;
}
select:focus, input:focus { border-color: var(--g); }
select option { background: #0c0a15; color: var(--tx); }

/* ── Size Pills ── */
.size-row { display: flex; gap: 8px; flex-wrap: wrap; }
.size-btn {
  background: var(--cb); border: 2px solid var(--bd); color: var(--mu);
  border-radius: 50px; padding: 9px 18px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all .2s; font-family: inherit;
}
.size-btn.active { background: var(--g); color: #09070d; border-color: var(--g); font-weight: 800; }

/* ── Conc Grid ── */
.conc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.conc-card {
  background: var(--cb); border: 2px solid var(--bd); border-radius: 12px;
  padding: 12px 14px; cursor: pointer; transition: all .2s;
}
.conc-card.active { background: rgba(232,192,112,0.12); border-color: var(--g); }
.conc-name { font-size: 14px; font-weight: 700; color: var(--tx); }
.conc-pct  { font-size: 12px; font-weight: 700; background: rgba(232,192,112,0.2); padding: 2px 9px; border-radius: 20px; color: var(--g); }
.conc-dur  { font-size: 12px; color: var(--mu); margin-top: 3px; }

/* ── Grade Cards ── */
.grade-grid { display: flex; flex-direction: column; gap: 9px; }
.grade-card {
  border: 2px solid var(--bd); border-radius: 12px; padding: 13px 15px;
  cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 12px;
}
.grade-card.active { border-color: var(--g); background: rgba(232,192,112,0.09); }
.grade-emoji  { font-size: 24px; flex-shrink: 0; }
.grade-info   { flex: 1; }
.grade-name   { font-size: 15px; font-weight: 700; }
.grade-desc   { font-size: 12px; color: var(--mu); margin-top: 2px; }
.grade-price  { font-size: 12px; font-weight: 700; border-radius: 20px; padding: 2px 10px; white-space: nowrap; }
.grade-mult   { font-size: 11px; font-weight: 600; margin-top: 4px; }
.grade-dot    { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* ── Toggle ── */
.toggle-row {
  display: flex; align-items: center; gap: 12px; cursor: pointer;
  padding: 9px 0; border-bottom: 1px solid var(--bd);
}
.toggle-track  { width: 42px; height: 23px; border-radius: 12px; position: relative; transition: background .25s; flex-shrink: 0; }
.toggle-thumb  { width: 17px; height: 17px; border-radius: 50%; background: #fff; position: absolute; top: 3px; transition: left .25s; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
.toggle-label  { font-size: 14px; font-weight: 500; }
.toggle-sub    { font-size: 11px; color: var(--mu); margin-top: 1px; }

/* ── Cost Inputs ── */
.cost-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.cost-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 9px; }
.cost-label  { font-size: 12px; color: var(--mu); margin-bottom: 5px; font-weight: 500; }
.cost-input  { text-align: center; }

/* ── Results ── */
.result-badge { text-align: center; margin-bottom: 14px; }
.result-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ca); border: 1px solid var(--ba);
  border-radius: 50px; padding: 7px 18px; flex-wrap: wrap; justify-content: center; font-size: 13px;
}
.result-pill span { color: var(--mu); }

.bar-row   { margin-bottom: 12px; }
.bar-top   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.bar-dot   { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.bar-label { font-size: 14px; font-weight: 500; }
.bar-val   { font-size: 15px; font-weight: 800; color: var(--g); }
.bar-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.bar-fill  { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(.4,0,.2,1); }
.bar-warn  { font-size: 10px; color: var(--red); background: rgba(232,119,119,0.12); padding: 1px 6px; border-radius: 4px; }

.strip  { display: flex; border-radius: 5px; overflow: hidden; height: 8px; margin: 12px 0 8px; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 10px; }
.leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--mu); }
.leg-dot  { width: 7px; height: 7px; border-radius: 2px; }

/* ── Cost Result ── */
.cost-result {
  background: rgba(232,192,112,0.07); border: 2px solid rgba(232,192,112,0.35);
  border-radius: 14px; padding: 16px; margin-bottom: 12px;
}
.cost-row       { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cost-row-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--mu); }
.cost-row-val   { font-size: 13px; color: var(--tx); }
.cost-total     { display: flex; justify-content: space-between; border-top: 1px solid var(--g); padding-top: 10px; margin-top: 6px; }
.cost-total-label { font-size: 15px; font-weight: 700; }
.cost-total-val   { font-size: 18px; font-weight: 800; color: var(--g); }

.mult-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 7px; margin-top: 12px; }
.mult-card { border-radius: 10px; padding: 8px 5px; text-align: center; }
.mult-tag  { font-size: 10px; color: var(--mu); margin-bottom: 2px; }
.mult-price { font-size: 14px; font-weight: 800; }
.mult-profit { font-size: 10px; color: var(--mu); }

/* ── Profit ── */
.profit-box { background: rgba(110,200,181,0.07); border: 1px solid rgba(110,200,181,0.25); border-radius: 13px; padding: 15px; margin-bottom: 12px; }
.profit-title { font-size: 14px; color: #7ddbc9; font-weight: 700; margin-bottom: 10px; }
.profit-result { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; }
.profit-cell { background: var(--cb); border-radius: 9px; padding: 9px; text-align: center; }
.profit-cell-label { font-size: 10px; color: var(--mu); margin-bottom: 2px; }
.profit-cell-val { font-size: 14px; font-weight: 800; }
.profit-bar-wrap { margin-top: 9px; }
.profit-bar-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--mu); margin-bottom: 4px; }
.profit-bar-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.profit-bar-fill { height: 100%; border-radius: 3px; transition: width .8s; }
.profit-warn { font-size: 11px; text-align: center; margin-top: 5px; color: var(--red); }
.profit-hint { font-size: 11px; text-align: center; margin-top: 5px; color: var(--g); }

/* ── Mix Order ── */
.mix-order { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.mix-chip  { border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
.mix-arrow { color: var(--mu); font-size: 13px; }

/* ── Tip Box ── */
.tip-box { background: var(--cb); border: 1px solid var(--bd); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--gl); line-height: 1.7; margin-bottom: 12px; }

/* ── Info Badge ── */
.info-badge { background: rgba(110,200,181,0.08); border: 1px solid rgba(110,200,181,0.25); border-radius: 9px; padding: 9px 13px; font-size: 13px; color: #7ddbc9; margin-bottom: 10px; line-height: 1.6; }

/* ── Buttons ── */
.btn {
  background: var(--g); color: #09070d; border: none; border-radius: 50px;
  padding: 15px 36px; font-size: 16px; font-weight: 800; cursor: pointer;
  font-family: inherit; transition: filter .2s;
  box-shadow: 0 4px 22px rgba(232,192,112,.28); letter-spacing: .3px;
}
.btn:hover    { filter: brightness(1.1); }
.btn:disabled { background: rgba(232,192,112,.2); color: rgba(255,255,255,.3); cursor: not-allowed; box-shadow: none; }
.ghost {
  background: rgba(255,255,255,.07); border: 2px solid rgba(232,192,112,.28);
  color: var(--tx); border-radius: 50px; padding: 11px 22px; font-size: 14px;
  font-weight: 600; cursor: pointer; font-family: inherit; transition: background .2s;
}
.ghost:hover { background: rgba(255,255,255,.11); }
.btn-row     { display: flex; gap: 8px; justify-content: center; }

/* ── Compat Matrix ── */
.matrix-wrap { overflow-x: auto; }
table { border-collapse: collapse; font-size: 11px; width: 100%; min-width: 460px; }
th, td { padding: 5px 4px; text-align: center; }
th { font-weight: 600; }
.cell-icon { font-size: 14px; }
.legend-row { display: flex; gap: 14px; margin-top: 8px; flex-wrap: wrap; }
.leg-c { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--mu); }

/* ── Blend Results ── */
.blend-result { border: 2px solid var(--bd); border-radius: 14px; padding: 15px; margin-bottom: 12px; }
.blend-score  { background: rgba(110,200,181,0.12); border: 1px solid rgba(110,200,181,0.3); border-radius: 50px; padding: 3px 13px; font-size: 13px; font-weight: 800; color: var(--green); }
.ratio-row    { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border-radius: 9px; padding: 9px 12px; margin-bottom: 6px; }
.ratio-name   { font-size: 13px; color: var(--tx); display: flex; align-items: center; gap: 7px; }
.ratio-vals   { display: flex; gap: 9px; align-items: center; }
.ratio-pct    { font-size: 12px; color: var(--mu); }
.ratio-ml     { font-size: 15px; font-weight: 800; color: var(--g); }
.suggest-card { background: var(--cb); border: 1px solid var(--bd); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
.suggest-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 9px; }
.suggest-name { font-size: 14px; font-weight: 700; color: var(--tx); margin-bottom: 4px; }
.suggest-type { font-size: 11px; border-radius: 20px; padding: 2px 9px; font-weight: 600; }
.suggest-ratios { display: flex; gap: 8px; background: rgba(255,255,255,.03); border-radius: 9px; padding: 9px; margin-bottom: 7px; }
.suggest-ratio-col  { flex: 1; text-align: center; }
.suggest-ratio-name { font-size: 10px; color: var(--mu); margin-bottom: 2px; }
.suggest-ratio-pct  { font-size: 15px; font-weight: 800; color: var(--g); }
.suggest-ratio-ml   { font-size: 10px; color: var(--mu); }
.result-name { font-size: 13px; font-weight: 700; color: var(--gl); }

/* ── Family Badge ── */
.fam-badge { border-radius: 20px; padding: 2px 9px; font-size: 11px; font-weight: 600; white-space: nowrap; }

/* ── Season Bar ── */
.season-row { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; margin-bottom: 10px; }
.season-btn {
  background: var(--cb); border: 2px solid var(--bd); color: var(--mu);
  border-radius: 22px; padding: 8px 16px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .2s; font-family: inherit;
}
.season-btn.active { background: rgba(232,192,112,0.15); border-color: var(--g); color: var(--gl); }

/* ── Steps ── */
.steps { display: flex; align-items: center; justify-content: center; gap: 7px; margin-bottom: 18px; flex-wrap: wrap; }
.step-dot   { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; transition: all .3s; flex-shrink: 0; }
.step-label { font-size: 12px; transition: color .3s; }
.step-line  { width: 18px; height: 1px; transition: background .3s; }

/* ── Dominant Selector ── */
.dom-card { display: flex; align-items: center; gap: 10px; border: 2px solid var(--bd); border-radius: 10px; padding: 10px 13px; cursor: pointer; transition: all .2s; margin-bottom: 7px; }
.dom-card.active { background: var(--ca); border-color: var(--ba); }
.dom-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--bd); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .2s; }
.dom-radio.active { background: var(--g); border-color: var(--g); }
.dom-radio-inner { width: 7px; height: 7px; border-radius: 50%; background: #09070d; }
.dom-name { font-size: 13px; font-weight: 500; }
.dom-tag  { font-size: 10px; color: var(--g); background: rgba(232,192,112,0.15); padding: 2px 8px; border-radius: 20px; margin-right: auto; white-space: nowrap; }
/* ── Favorites ── */
.fav-card { background: var(--cb); border: 1px solid var(--bd); border-radius: 14px; padding: 16px; margin-bottom: 12px; transition: border-color .2s; }
.fav-card:hover { border-color: var(--ba); }
.fav-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.fav-name   { font-size: 16px; font-weight: 700; color: var(--gl); }
.fav-brand  { font-size: 12px; color: var(--mu); margin-top: 2px; }
.fav-note   { font-size: 13px; color: var(--tx); line-height: 1.6; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 9px 11px; margin-top: 8px; white-space: pre-wrap; }
.fav-note-empty { font-size: 12px; color: rgba(255,255,255,0.28); font-style: italic; margin-top: 6px; }
.fav-actions { display: flex; gap: 7px; margin-top: 10px; }
.fav-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--bd); color: var(--mu); border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
.fav-btn:hover { background: rgba(255,255,255,0.11); color: var(--tx); }
.fav-btn.del { border-color: rgba(232,119,119,.3); color: #e89b9b; }
.fav-btn.del:hover { background: rgba(232,119,119,.1); }
.fav-empty { text-align: center; padding: 40px 20px; color: var(--mu); }
.fav-empty-icon { font-size: 48px; margin-bottom: 12px; }
.fav-note-edit { width: 100%; background: #0c0a15; border: 2px solid var(--g); color: var(--tx); border-radius: 9px; padding: 10px 12px; font-size: 13px; font-family: inherit; outline: none; resize: vertical; min-height: 80px; margin-top: 8px; }

/* ── Animations ── */
@keyframes pulse {
  0%, 100% { opacity: .3; transform: scale(.8); }
  50%       { opacity: 1;  transform: scale(1.15); }
}
@keyframes fi {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
.fi { animation: fi .35s ease both; }

/* ── Modal ── */
#modal {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,.72); backdrop-filter: blur(3px);
  z-index: 100; align-items: flex-start; justify-content: center;
  padding: 18px; overflow-y: auto;
}
.modal-card {
  background: #0c0a15; border: 1px solid var(--ba); border-radius: 16px;
  padding: 18px; max-width: 440px; width: 100%; margin: 14px auto;
  box-shadow: 0 12px 50px rgba(0,0,0,.6);
}
.custom-tag {
  font-size: 9px; color: #7ddbc9; background: rgba(110,200,181,.12);
  border: 1px solid rgba(110,200,181,.3); border-radius: 20px; padding: 1px 7px; margin-right: 5px;
}

/* ── Toast ── */
#toast {
  position: fixed; bottom: 26px; left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--g); color: #09070d; padding: 10px 22px;
  border-radius: 30px; font-weight: 800; font-size: 14px;
  opacity: 0; pointer-events: none; transition: all .3s;
  z-index: 12000; box-shadow: 0 6px 24px rgba(232,192,112,.4);
}
#toast.toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── Responsive Mobile ── */
@media (max-width: 480px) {
  .container { padding: 0 10px 70px; }
  .tabs { gap: 5px; }
  .tab  { padding: 9px 14px; font-size: 13px; }
  .conc-grid { grid-template-columns: 1fr 1fr; }
  .cost-grid-3 { grid-template-columns: 1fr 1fr; }
  .mult-grid { grid-template-columns: repeat(2, 1fr); }
  .btn { padding: 13px 24px; font-size: 15px; }
  .perf-grid { gap: 9px; }
  .perf-card { padding: 13px 11px 11px; }
  .perf-card-emoji { font-size: 22px; }
  .perf-card-name  { font-size: 12px; }
}

/* ═══ Print Overlay ═══ */
#print-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 9999;
  overflow-y: auto;
  padding: 20px;
  padding-top: max(60px, calc(env(safe-area-inset-top) + 20px));
  box-sizing: border-box;
  direction: rtl;
  font-family: Tahoma, Arial, sans-serif;
  color: #1a1a1a;
  line-height: 1.9;
}
#print-overlay-inner {
  max-width: 640px;
  margin: 0 auto;
}
#print-overlay-btns {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}
#print-overlay-btns button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}
.po-btn-print {
  background: #a8852a;
  color: #fff;
}
.po-btn-close {
  background: #eee;
  color: #333;
}
#print-overlay h2 {
  color: #a8852a;
  font-size: 20px;
  border-bottom: 2px solid #e8c070;
  padding-bottom: 8px;
  margin-bottom: 14px;
}
#print-overlay pre {
  white-space: pre-wrap;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 14px;
}
@media print {
  body > *:not(#print-overlay) { display: none !important; }
  #print-overlay {
    position: static;
    padding: 0;
  }
  #print-overlay-btns { display: none !important; }
}

/* ════════════════════════════════════
   زر الهوم — ثابت في الشاشة دائماً
   ════════════════════════════════════ */
#home-btn {
  /* ثابت بالنسبة للـ viewport — لا يتحرك مع الصفحة */
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  left: 20px;
  z-index: 8000;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(232,192,112,0.55);
  background: linear-gradient(145deg, #1c1005, #2e1a05);
  color: #e8c070;
  font-size: 22px;
  cursor: pointer;
  font-family: inherit;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 4px 20px rgba(0,0,0,0.6),
    0 0 0 1px rgba(232,192,112,0.08);

  /* الحالة الافتراضية: مخفي في step 1 */
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
  transition: opacity .22s ease, transform .22s ease;

  /* منع التحديد والإزاحة */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}

/* يظهر عند إضافة كلاس visible */
#home-btn.home-btn-visible {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}

#home-btn:active {
  transform: scale(0.88);
  background: linear-gradient(145deg, #2e1a05, #4a2a08);
}

/* ═══ صفحة أسعار العطور ═══ */
.container.wide-tab { max-width: 1500px; }
.market-tab-shell {
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--bd);
  border-radius: 18px;
  overflow: hidden;
  min-height: calc(100vh - 190px);
  box-shadow: 0 14px 40px rgba(0,0,0,.18);
}
#market-list-frame {
  display: block;
  width: 100%;
  min-height: calc(100vh - 190px);
  height: 980px;
  border: 0;
  background: #09070d;
}

/* ═══ بطاقة السعر التقريبي ═══ */
.retail-price-card {
  margin-top: 12px;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid rgba(232,192,112,.22);
  background:
    linear-gradient(135deg, rgba(232,192,112,.105), rgba(255,255,255,.035) 52%, rgba(110,181,200,.055));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
.retail-price-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 11px;
}
.retail-price-eyebrow {
  font-size: 10px;
  color: rgba(255,255,255,.48);
  margin-bottom: 3px;
}
.retail-price-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--gl);
}
.retail-price-range {
  text-align: left;
  flex: 0 0 auto;
}
.retail-price-range strong {
  display: block;
  color: var(--g);
  font-size: 14px;
  line-height: 1.1;
}
.retail-price-range span {
  display: block;
  color: rgba(255,255,255,.42);
  font-size: 9px;
  margin-top: 4px;
}
.retail-price-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}
.retail-price-item {
  min-width: 0;
  text-align: center;
  padding: 9px 5px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.085);
  background: rgba(8,7,13,.34);
}
.retail-price-item.featured {
  border-color: rgba(232,192,112,.34);
  background: rgba(232,192,112,.07);
}
.retail-price-size {
  display: block;
  color: rgba(255,255,255,.54);
  font-size: 10px;
  margin-bottom: 4px;
}
.retail-price-item strong {
  display: block;
  color: var(--gl);
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}
.retail-price-item small {
  display: block;
  color: rgba(255,255,255,.38);
  font-size: 8px;
  margin-top: 2px;
}
.retail-price-note {
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,.07);
  color: rgba(255,255,255,.43);
  font-size: 9px;
  line-height: 1.65;
}

@media (max-width: 560px) {
  #market-list-frame { min-height: 720px; height: 1040px; }
  .container.wide-tab { padding-left: 4px; padding-right: 4px; }
  .market-tab-shell { border-radius: 14px; }
  .retail-price-head { align-items: center; }
  .retail-price-range strong { font-size: 12px; }
  .retail-price-item { padding: 8px 3px; }
  .retail-price-item strong { font-size: 11px; }
}
