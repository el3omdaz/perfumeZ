// ═══════════════════════════════════════════════════
// printer.js — طابعة ليبل JK-58PL Bluetooth (ESC/POS)
// ═══════════════════════════════════════════════════

// ── Bluetooth state ──
const BT = {
  device: null,
  char:   null,
  connected: false,

  async connect() {
    try {
      if (!navigator.bluetooth) {
        _ptoast("❌ المتصفح لا يدعم Bluetooth — استخدم Chrome أو Edge");
        return false;
      }
      _ptoast("🔍 ابحث عن الطابعة...");

      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
          "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        ]
      });

      this.device.addEventListener("gattserverdisconnected", () => {
        this.connected = false; this.char = null;
        _ptoast("🔌 انقطع اتصال الطابعة");
        _updateBtBar();
      });

      _ptoast("🔗 جاري الاتصال...");
      const server = await this.device.gatt.connect();

      // جرب كل service UUID شائعة لطابعات 58mm
      const svcUUIDs = [
        "000018f0-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-fe7d-4ae5-8fa9-9fafd205e455",
      ];
      let svc = null;
      for (const u of svcUUIDs) {
        try { svc = await server.getPrimaryService(u); break; } catch(e) {}
      }
      if (!svc) throw new Error("ما لقينا خدمة الطباعة في الجهاز");

      const chrUUIDs = [
        "00002af1-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-8841-43f4-a8d4-ecbe34729bb3",
        "49535343-aca3-481c-91ec-d85e28a60318",
      ];
      let chr = null;
      for (const u of chrUUIDs) {
        try { chr = await svc.getCharacteristic(u); break; } catch(e) {}
      }
      if (!chr) throw new Error("ما لقينا characteristic الطباعة");

      this.char = chr;
      this.connected = true;
      _ptoast("✅ متصل بالطابعة!");
      _updateBtBar();
      return true;
    } catch(e) {
      this.connected = false; this.char = null;
      if (e.name !== "NotFoundError") _ptoast("❌ " + (e.message || e));
      _updateBtBar();
      return false;
    }
  },

  disconnect() {
    if (this.device && this.device.gatt.connected) this.device.gatt.disconnect();
    this.connected = false; this.char = null;
    _updateBtBar();
    _ptoast("🔌 تم قطع الاتصال");
  },

  async send(bytes) {
    if (!this.char) throw new Error("الطابعة غير متصلة");
    const CHUNK = 20;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      await this.char.writeValue(bytes.slice(i, i + CHUNK));
      await new Promise(r => setTimeout(r, 25));
    }
  },

  async print(labelFields) {
    if (!this.connected) {
      const ok = await this.connect();
      if (!ok) return;
    }
    try {
      _ptoast("🖨 جاري الطباعة...");
      await this.send(_buildESC(labelFields));
      _ptoast("✅ تمت الطباعة!");
    } catch(e) {
      this.connected = false; _updateBtBar();
      _ptoast("❌ خطأ: " + (e.message || e));
    }
  }
};

// ═══════════════════════════════════════════════════
// ESC/POS builder
// ═══════════════════════════════════════════════════
function _buildESC(f) {
  const b = [];
  const esc  = (...v) => b.push(...v);
  const line = (txt, bold, sz) => {
    // bold
    esc(0x1B, 0x45, bold ? 1 : 0);
    // size: sz=1 normal, sz=2 double
    esc(0x1D, 0x21, sz === 2 ? 0x11 : 0x00);
    // UTF-8 codepage hint
    esc(0x1B, 0x74, 0xFF);
    _utf8(b, txt);
    b.push(0x0A);
  };
  const sep  = () => { esc(0x1B, 0x45, 0); esc(0x1D, 0x21, 0); _utf8(b, "────────────────────"); b.push(0x0A); };
  const feed = () => b.push(0x0A);

  // init + center
  esc(0x1B, 0x40);   // ESC @
  esc(0x1B, 0x61, 1); // center

  line("✦ عطورك ✦", true, 2);
  sep();

  // اسم العطر — الأبرز
  if (f.perfName) line(f.perfName, true, 2);
  if (f.brandName) line(f.brandName, false, 1);

  sep();

  // تفاصيل — محاذاة يمين
  esc(0x1B, 0x61, 2);
  if (f.size)      line("الحجم: " + f.size + " مل",   false, 1);
  if (f.conc)      line("التركيز: " + f.conc,          false, 1);
  if (f.family)    line("العائلة: " + f.family,        false, 1);
  if (f.season)    line("الموسم: " + f.season,         false, 1);
  if (f.note)      line(f.note,                         false, 1);

  // تكلفة + بيع
  if (f.cost || f.sellPrice) {
    esc(0x1B, 0x61, 1); sep(); esc(0x1B, 0x61, 2);
    if (f.cost)      line("التكلفة: " + f.cost + " د.ك",    false, 1);
    if (f.sellPrice) line("سعر البيع: " + f.sellPrice + " د.ك", true, 1);
  }

  // مقادير
  if (f.items && f.items.length) {
    esc(0x1B, 0x61, 1); sep(); line("المقادير", true, 1); esc(0x1B, 0x61, 2);
    f.items.forEach(i => line(i.label + ": " + i.v + " مل", false, 1));
  }

  // تاريخ + فوتر
  esc(0x1B, 0x61, 1); sep();
  const d = new Date();
  line(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear(), false, 1);

  // eject + cut
  feed(); feed(); feed(); feed();
  esc(0x1D, 0x56, 0x42, 0x00); // full cut

  return new Uint8Array(b);
}

function _utf8(buf, str) {
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if      (c < 0x80)   buf.push(c);
    else if (c < 0x800)  buf.push(0xC0|(c>>6), 0x80|(c&0x3F));
    else                 buf.push(0xE0|(c>>12), 0x80|((c>>6)&0x3F), 0x80|(c&0x3F));
  }
}

// ═══════════════════════════════════════════════════
// Modal — معاينة + تعديل + طباعة
// ═══════════════════════════════════════════════════
function openPrintLabelModal() {
  // اجمع البيانات من حالة التطبيق
  const result = (typeof calcFormula === "function") ? calcFormula() : null;
  const cost   = (result && typeof calcCost === "function") ? calcCost(result) : null;

  // الحقول الافتراضية — كلها قابلة للتعديل
  window._labelFields = {
    perfName:  (typeof S !== "undefined" && S.perf)  ? S.perf.n   : "",
    brandName: (typeof S !== "undefined" && S.brand) ? S.brand.ar : "",
    size:      (typeof S !== "undefined") ? String(S.size || "") : "",
    conc:      (typeof S !== "undefined" && S.conc)  ? S.conc.ar  : "",
    family:    result ? (result.famAr || "")    : "",
    season:    result ? (result.seasonAr || "") : "",
    cost:      cost   ? cost.total  : "",
    sellPrice: (typeof S !== "undefined" && S.sellPrice) ? S.sellPrice : "",
    note:      "",
    items:     result ? result.items.map(({key, v}) => ({
      label: (typeof IMETA !== "undefined" && IMETA[key]) ? IMETA[key].label : key,
      v
    })) : [],
  };

  window._printCopies = 1;
  _renderLabelModal();
}

function _renderLabelModal() {
  const old = document.getElementById("print-label-modal");
  if (old) old.remove();

  const f = window._labelFields || {};

  const overlay = document.createElement("div");
  overlay.id = "print-label-modal";
  overlay.style.cssText = [
    "position:fixed","inset:0","z-index:9500",
    "background:rgba(0,0,0,0.82)","display:flex",
    "align-items:flex-end","justify-content:center",
    "backdrop-filter:blur(3px)"
  ].join(";");

  overlay.innerHTML = `
  <div style="
    background:#0f0a18;
    border:1px solid rgba(232,192,112,0.35);
    border-radius:18px 18px 0 0;
    padding:20px 16px 40px;
    width:100%; max-width:520px;
    max-height:92vh; overflow-y:auto;
    animation:_slideUp .22s ease;
    font-family:inherit; direction:rtl;
  ">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:16px;font-weight:700;color:#e8c070">🏷 تعديل وطباعة الليبل</div>
      <button onclick="document.getElementById('print-label-modal').remove()"
        style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);
        color:#fff;border-radius:8px;padding:6px 13px;font-size:13px;cursor:pointer;font-family:inherit">✕</button>
    </div>

    <!-- حقول قابلة للتعديل -->
    <div style="background:rgba(232,192,112,0.05);border:1px solid rgba(232,192,112,0.2);border-radius:12px;padding:14px;margin-bottom:14px">
      <div style="font-size:13px;color:rgba(232,192,112,0.9);font-weight:700;margin-bottom:12px">✏️ تعديل بيانات الليبل</div>

      ${_field("اسم العطر",  "lf-perfName",  f.perfName,  "text",   true)}
      ${_field("الماركة",    "lf-brandName", f.brandName, "text")}
      ${_field("الحجم (مل)", "lf-size",      f.size,      "text")}
      ${_field("التركيز",    "lf-conc",      f.conc,      "text")}
      ${_field("العائلة",    "lf-family",    f.family,    "text")}
      ${_field("الموسم",     "lf-season",    f.season,    "text")}
      ${_field("التكلفة (د.ك)", "lf-cost",   f.cost,      "text")}
      ${_field("سعر البيع (د.ك)", "lf-sell", f.sellPrice, "text")}
      ${_field("ملاحظة إضافية", "lf-note",  f.note || "", "text")}
    </div>

    <!-- معاينة الليبل -->
    <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;text-align:center">معاينة الليبل (58مم)</div>
    <div id="label-preview" style="
      background:#fff; color:#111;
      border-radius:10px; padding:14px 12px;
      text-align:center; font-family:Tahoma,Arial,sans-serif;
      margin-bottom:14px; border:2px dashed rgba(232,192,112,0.45);
      max-width:220px; margin-left:auto; margin-right:auto;
    "></div>

    <!-- Bluetooth -->
    <div id="bt-bar" style="
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(232,192,112,0.2);
      border-radius:10px; padding:10px 14px;
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:12px;
    ">
      <div id="bt-status-txt" style="font-size:12px;color:rgba(255,255,255,0.65)">
        ${BT.connected
          ? `<span style="color:#6ec878">● متصل</span> — ${BT.device ? BT.device.name : "الطابعة"}`
          : '<span style="color:#e87777">● غير متصل</span> — JK-58PL'}
      </div>
      <button id="bt-toggle-btn" onclick="_toggleBt()"
        style="background:rgba(255,255,255,0.07);border:1px solid rgba(232,192,112,0.3);
        color:#e8c070;border-radius:8px;padding:6px 13px;font-size:12px;
        cursor:pointer;font-family:inherit">
        ${BT.connected ? "قطع الاتصال" : "🖨 توصيل"}
      </button>
    </div>

    <div id="bt-compat-warn"></div>

    <!-- عدد النسخ -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <div style="font-size:13px;color:rgba(255,255,255,0.7);white-space:nowrap">عدد النسخ:</div>
      <div style="display:flex;gap:6px">
        ${[1,2,3,5].map(n => `
        <button onclick="_setCopies(${n})" id="cp-${n}"
          style="background:${n===1?"rgba(232,192,112,0.2)":"rgba(255,255,255,0.07)"};
          border:2px solid ${n===1?"rgba(232,192,112,0.6)":"rgba(255,255,255,0.15)"};
          color:${n===1?"#e8c070":"rgba(255,255,255,0.8)"};
          border-radius:8px;padding:7px 14px;font-size:14px;font-weight:700;
          cursor:pointer;font-family:inherit">${n}</button>`).join("")}
      </div>
    </div>

    <!-- أزرار الطباعة -->
    <button onclick="_doPrint()"
      style="width:100%;padding:15px;background:linear-gradient(135deg,#3a1f00,#c8902a);
      border:none;border-radius:12px;color:#fff;font-size:16px;font-weight:800;
      cursor:pointer;font-family:inherit;margin-bottom:10px">
      🖨 اطبع الليبل
    </button>
    <div style="text-align:center">
      <button onclick="_printBrowser()"
        style="background:none;border:none;color:rgba(255,255,255,0.4);
        font-size:12px;cursor:pointer;font-family:inherit;text-decoration:underline">
        أو اطبع عبر المتصفح (بديل)
      </button>
    </div>
  </div>`;

  document.body.appendChild(overlay);

  // فحص دعم Bluetooth بعد التحميل — ديناميكي وليس static
  const warnEl = document.getElementById("bt-compat-warn");
  if (warnEl && !navigator.bluetooth) {
    warnEl.innerHTML = `
    <div style="background:rgba(232,119,119,0.1);border:1px solid rgba(232,119,119,0.3);
      border-radius:9px;padding:10px;font-size:12px;color:#e8aaaa;margin-bottom:12px;line-height:1.6">
      ⚠️ Web Bluetooth يحتاج <strong>Chrome</strong> أو <strong>Edge</strong> — Safari لا يدعمه
    </div>`;
  }

  // ربط حقول التعديل بالمعاينة
  ["perfName","brandName","size","conc","family","season","cost","sell","note"].forEach(k => {
    const inp = document.getElementById("lf-" + k);
    if (!inp) return;
    inp.addEventListener("input", () => {
      const fk = k === "sell" ? "sellPrice" : k;
      window._labelFields[fk] = inp.value;
      _refreshPreview();
    });
  });

  _refreshPreview();
}

// حقل إدخال بتصميم التطبيق
function _field(label, id, val, type, highlight) {
  return `
  <div style="margin-bottom:9px">
    <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-bottom:4px">${label}</div>
    <input id="${id}" type="${type || "text"}" value="${_esc(val)}"
      style="width:100%;background:#0c0a15;
      border:2px solid ${highlight ? "rgba(232,192,112,0.55)" : "rgba(232,192,112,0.2)"};
      color:#fff;border-radius:9px;padding:9px 12px;
      font-size:${highlight ? "15px" : "13px"};font-weight:${highlight ? "700" : "400"};
      font-family:inherit;outline:none;transition:border .2s"
      onfocus="this.style.borderColor='rgba(232,192,112,0.7)'"
      onblur="this.style.borderColor='${highlight ? "rgba(232,192,112,0.55)" : "rgba(232,192,112,0.2)"}'">
  </div>`;
}

function _esc(s) { return String(s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"); }

// ── تحديث المعاينة ──
function _refreshPreview() {
  const f = window._labelFields || {};
  const p = document.getElementById("label-preview");
  if (!p) return;

  const sep = `<div style="border-top:1px dashed #aaa;margin:6px 0"></div>`;
  const row = (label, val, bold) => val
    ? `<div style="font-size:10px;color:#333;text-align:right;direction:rtl;line-height:1.8;${bold?"font-weight:700":""}">
        ${label ? label + ": " : ""}${_esc(val)}
       </div>` : "";

  p.innerHTML = `
    <div style="font-weight:800;font-size:15px;color:#1a0800;margin-bottom:2px">✦ عطورك ✦</div>
    ${sep}
    <div style="font-weight:800;font-size:16px;color:#3a1200;margin:4px 0;line-height:1.3">${_esc(f.perfName||"—")}</div>
    <div style="font-size:11px;color:#666;margin-bottom:4px">${_esc(f.brandName||"")}</div>
    ${sep}
    ${row("الحجم", f.size ? f.size+" مل" : "")}
    ${row("التركيز", f.conc)}
    ${row("العائلة", f.family)}
    ${row("الموسم", f.season)}
    ${(f.cost || f.sellPrice) ? sep : ""}
    ${row("التكلفة", f.cost ? f.cost+" د.ك" : "")}
    ${row("", f.sellPrice ? "البيع: "+f.sellPrice+" د.ك" : "", true)}
    ${f.note ? `${sep}${row("", f.note)}` : ""}
    ${sep}
    <div style="font-size:9px;color:#999">${new Date().toLocaleDateString("ar-KW")}</div>
  `;
}

// ── أزرار ──
function _setCopies(n) {
  window._printCopies = n;
  [1,2,3,5].forEach(c => {
    const b = document.getElementById("cp-" + c);
    if (!b) return;
    const on = c === n;
    b.style.background   = on ? "rgba(232,192,112,0.2)" : "rgba(255,255,255,0.07)";
    b.style.borderColor  = on ? "rgba(232,192,112,0.6)" : "rgba(255,255,255,0.15)";
    b.style.color        = on ? "#e8c070" : "rgba(255,255,255,0.8)";
  });
}

async function _toggleBt() {
  if (BT.connected) { BT.disconnect(); }
  else              { await BT.connect(); }
}

function _updateBtBar() {
  const txt = document.getElementById("bt-status-txt");
  const btn = document.getElementById("bt-toggle-btn");
  if (txt) txt.innerHTML = BT.connected
    ? `<span style="color:#6ec878">● متصل</span> — ${BT.device ? BT.device.name : "الطابعة"}`
    : '<span style="color:#e87777">● غير متصل</span> — JK-58PL';
  if (btn) btn.textContent = BT.connected ? "قطع الاتصال" : "🖨 توصيل";
}

async function _doPrint() {
  const copies = window._printCopies || 1;
  const fields = window._labelFields || {};
  for (let i = 0; i < copies; i++) {
    await BT.print(fields);
    if (i < copies - 1) await new Promise(r => setTimeout(r, 700));
  }
}

function _printBrowser() {
  const f = window._labelFields || {};
  const items = (f.items || []).map(i =>
    `<div style="font-size:10px;color:#333;text-align:right">${i.label}: ${i.v} مل</div>`
  ).join("");

  const win = window.open("", "_blank", "width=280,height=520");
  if (!win) { _ptoast("⚠ السماح بالنوافذ المنبثقة أولاً"); return; }
  win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
  <head><meta charset="UTF-8"><title>ليبل</title>
  <style>
    body{font-family:Tahoma,Arial,sans-serif;text-align:center;padding:12px;background:#fff;color:#111;width:195px;margin:auto}
    .sep{border:none;border-top:1px dashed #aaa;margin:5px 0}
    .detail{font-size:10px;text-align:right;line-height:1.9}
    @media print{@page{margin:0;size:58mm auto}body{width:auto}}
  </style></head><body>
  <div style="font-weight:800;font-size:14px">✦ عطورك ✦</div>
  <hr class="sep">
  <div style="font-weight:800;font-size:15px;line-height:1.3;margin:4px 0">${f.perfName||""}</div>
  <div style="font-size:10px;color:#666;margin-bottom:4px">${f.brandName||""}</div>
  <hr class="sep">
  <div class="detail">
    ${f.size      ? "الحجم: "+f.size+" مل<br>" : ""}
    ${f.conc      ? "التركيز: "+f.conc+"<br>" : ""}
    ${f.family    ? "العائلة: "+f.family+"<br>" : ""}
    ${f.season    ? "الموسم: "+f.season+"<br>" : ""}
    ${f.cost      ? "التكلفة: "+f.cost+" د.ك<br>" : ""}
    ${f.sellPrice ? "<strong>البيع: "+f.sellPrice+" د.ك</strong><br>" : ""}
    ${f.note      ? f.note+"<br>" : ""}
  </div>
  ${items ? `<hr class="sep">${items}` : ""}
  <hr class="sep">
  <div style="font-size:9px;color:#999">${new Date().toLocaleDateString("ar-KW")}</div>
  <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),600)}<\/script>
  </body></html>`);
  win.document.close();
}

function _ptoast(msg) {
  if (typeof toast === "function") { toast(msg); return; }
  console.log("[Printer]", msg);
}

// ── CSS animation لـ slide-up ──
(function() {
  if (document.getElementById("_printer-style")) return;
  const s = document.createElement("style");
  s.id = "_printer-style";
  s.textContent = `@keyframes _slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}`;
  document.head.appendChild(s);
})();
