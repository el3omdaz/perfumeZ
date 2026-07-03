// ═══════════════════════════════════════════════════
// printer.js — طابعة ليبل Bluetooth JK-58PL (ESC/POS)
// ═══════════════════════════════════════════════════

const PRINTER = {
  device: null,
  server: null,
  service: null,
  char: null,
  connected: false,

  // ESC/POS service & characteristic UUIDs (standard thermal printers)
  SERVICE_UUID:  0x18F0,
  CHAR_UUID:     0x2AF1,

  // ── Connect via Web Bluetooth ──
  async connect() {
    try {
      if (!navigator.bluetooth) {
        printerToast("❌ المتصفح لا يدعم Bluetooth — استخدم Chrome أو Edge", "error");
        return false;
      }
      printerToast("🔍 جاري البحث عن الطابعة...", "info");

      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { name: "JK-58PL" },
          { namePrefix: "JK" },
          { namePrefix: "Printer" },
          { namePrefix: "RPP" },
          { namePrefix: "MTP" },
        ],
        optionalServices: [
          0x18F0,
          "000018f0-0000-1000-8000-00805f9b34fb",
          "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
          "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        ]
      });

      this.device.addEventListener("gattserverdisconnected", () => {
        this.connected = false;
        updatePrinterBtn();
        printerToast("🔌 انقطع اتصال الطابعة", "warn");
      });

      printerToast("🔗 جاري الاتصال...", "info");
      this.server  = await this.device.gatt.connect();

      // Try multiple service UUIDs (different firmware versions)
      const serviceUUIDs = [
        "000018f0-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-fe7d-4ae5-8fa9-9fafd205e455",
        0x18F0,
      ];
      let service = null;
      for (const uuid of serviceUUIDs) {
        try { service = await this.server.getPrimaryService(uuid); break; }
        catch(e) {}
      }
      if (!service) throw new Error("ما لقينا خدمة الطباعة");

      // Try multiple characteristic UUIDs
      const charUUIDs = [
        "00002af1-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-8841-43f4-a8d4-ecbe34729bb3",
        "49535343-aca3-481c-91ec-d85e28a60318",
        0x2AF1,
      ];
      let char = null;
      for (const uuid of charUUIDs) {
        try { char = await service.getCharacteristic(uuid); break; }
        catch(e) {}
      }
      if (!char) throw new Error("ما لقينا characteristic الطابعة");

      this.service = service;
      this.char    = char;
      this.connected = true;
      updatePrinterBtn();
      printerToast("✅ متصل بالطابعة بنجاح!", "success");
      return true;
    } catch(e) {
      console.error("Printer connect error:", e);
      this.connected = false;
      updatePrinterBtn();
      if (e.name === "NotFoundError") {
        printerToast("⚠️ ما تم اختيار طابعة", "warn");
      } else {
        printerToast("❌ فشل الاتصال: " + (e.message||e), "error");
      }
      return false;
    }
  },

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.connected = false;
    updatePrinterBtn();
    printerToast("🔌 تم قطع الاتصال", "info");
  },

  // ── Write raw bytes ──
  async write(data) {
    if (!this.char) throw new Error("الطابعة غير متصلة");
    const CHUNK = 20; // BLE max packet
    for (let i = 0; i < data.length; i += CHUNK) {
      const chunk = data.slice(i, i + CHUNK);
      await this.char.writeValue(chunk);
      await new Promise(r => setTimeout(r, 30));
    }
  },

  // ── Print a perfume label ──
  async printLabel(data) {
    if (!this.connected) {
      const ok = await this.connect();
      if (!ok) return;
    }
    try {
      printerToast("🖨 جاري الطباعة...", "info");
      const bytes = buildLabel(data);
      await this.write(bytes);
      printerToast("✅ تمت الطباعة!", "success");
    } catch(e) {
      console.error("Print error:", e);
      this.connected = false;
      updatePrinterBtn();
      printerToast("❌ خطأ في الطباعة: " + (e.message||e), "error");
    }
  }
};

// ═══════════════════════════════════════════════════
// ESC/POS Label Builder (58mm thermal — Arabic via UTF-8 / CP1256)
// ═══════════════════════════════════════════════════

function buildLabel(d) {
  const e = new ESCBuilder();

  // Init
  e.init();
  e.align("center");

  // ── Header: brand logo text ──
  e.bold(true);
  e.size(2, 2);  // double width & height
  e.text("✦ عطورك ✦");
  e.feed(1);

  e.size(1, 1);
  e.bold(false);
  e.text("━━━━━━━━━━━━━━━━━━━━");
  e.feed(1);

  // ── Perfume name ──
  e.bold(true);
  e.size(1, 2);
  e.text(d.perfName || "");
  e.feed(1);

  // ── Brand ──
  e.bold(false);
  e.size(1, 1);
  e.text(d.brandName || "");
  e.feed(1);

  e.text("━━━━━━━━━━━━━━━━━━━━");
  e.feed(1);

  // ── Details row ──
  e.align("right");
  e.bold(false);
  e.size(1, 1);

  if (d.size)  e.text(`الحجم: ${d.size} مل`);
  e.feed(1);
  if (d.conc)  e.text(`التركيز: ${d.conc}`);
  e.feed(1);
  if (d.family) e.text(`العائلة: ${d.family}`);
  e.feed(1);
  if (d.season) e.text(`الموسم: ${d.season}`);
  e.feed(1);

  // ── Cost / Price ──
  if (d.cost || d.sellPrice) {
    e.align("center");
    e.text("──────────────────");
    e.feed(1);
    e.align("right");
    if (d.cost)      e.text(`التكلفة: ${d.cost} د.ك`);
    e.feed(1);
    if (d.sellPrice) { e.bold(true); e.text(`سعر البيع: ${d.sellPrice} د.ك`); e.bold(false); }
    e.feed(1);
  }

  // ── Ingredients ──
  if (d.items && d.items.length) {
    e.align("center");
    e.text("──────────────────");
    e.feed(1);
    e.text("المقادير");
    e.feed(1);
    e.align("right");
    d.items.forEach(item => {
      e.text(`${item.label}: ${item.v} مل`);
      e.feed(1);
    });
  }

  // ── Footer ──
  e.align("center");
  e.text("━━━━━━━━━━━━━━━━━━━━");
  e.feed(1);
  e.bold(false);
  e.size(1, 1);
  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  e.text(dateStr);
  e.feed(1);
  e.text("perfumez.app");
  e.feed(4);  // eject

  // Cut
  e.cut();

  return e.build();
}

// ═══════════════════════════════════════════════════
// ESC/POS low-level builder
// ═══════════════════════════════════════════════════
class ESCBuilder {
  constructor() { this.buf = []; }

  push(...bytes) { this.buf.push(...bytes); return this; }

  init()  { return this.push(0x1B, 0x40); }  // ESC @

  align(a) {
    const n = a === "left" ? 0 : a === "center" ? 1 : 2;
    return this.push(0x1B, 0x61, n);
  }

  bold(on) { return this.push(0x1B, 0x45, on ? 1 : 0); }

  size(w, h) {
    // w: 1 or 2 (width multiplier), h: 1 or 2 (height multiplier)
    const n = ((w - 1) << 4) | (h - 1);
    return this.push(0x1D, 0x21, n);
  }

  // Print UTF-8 text (Arabic) — wraps text lines
  text(str) {
    if (!str) return this;
    const encoded = encodeArabic(str);
    this.push(...encoded);
    return this;
  }

  feed(n = 1) { return this.push(0x0A); }  // LF × n simplified

  cut() { return this.push(0x1D, 0x56, 0x42, 0x00); }  // GS V B 0 (full cut)

  build() { return new Uint8Array(this.buf); }
}

// ── Arabic text encoding ──
// ESC/POS doesn't natively support Arabic — we use UTF-8 bytes.
// Most modern 58mm printers accept UTF-8 with the right codepage.
function encodeArabic(str) {
  // Set codepage to UTF-8 first: ESC t 255 (or try CP1256 page)
  const header = [0x1B, 0x74, 0xFF];
  const bytes  = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
    } else {
      bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
    }
  }
  bytes.push(0x0A); // newline after each text call
  return [...header, ...bytes];
}

// ═══════════════════════════════════════════════════
// UI Helpers
// ═══════════════════════════════════════════════════
function updatePrinterBtn() {
  document.querySelectorAll(".printer-connect-btn").forEach(btn => {
    if (PRINTER.connected) {
      btn.innerHTML = "🖨 متصل ✓";
      btn.style.borderColor = "rgba(110,200,120,0.6)";
      btn.style.color = "#6ec878";
    } else {
      btn.innerHTML = "🖨 توصيل الطابعة";
      btn.style.borderColor = "";
      btn.style.color = "";
    }
  });
}

let printerToastTimer;
function printerToast(msg, type = "info") {
  // Reuse app toast if available
  if (typeof toast === "function") { toast(msg); return; }
  let t = document.getElementById("printer-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "printer-toast";
    t.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1a1008;border:1px solid rgba(232,192,112,0.4);color:#e8c070;padding:10px 18px;border-radius:20px;font-size:13px;z-index:9999;font-family:inherit;white-space:nowrap;transition:opacity .3s";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(printerToastTimer);
  printerToastTimer = setTimeout(() => { t.style.opacity = "0"; }, 2200);
}

// ═══════════════════════════════════════════════════
// Main entry — called from app.js result section
// ═══════════════════════════════════════════════════
function openPrintLabelModal() {
  // Collect current state from app
  const result = typeof calcFormula === "function" ? calcFormula() : null;
  const cost   = result && typeof calcCost === "function" ? calcCost(result) : null;

  // Build label data from current S state + formula result
  const labelData = {
    perfName:  (typeof S !== "undefined" && S.perf)  ? S.perf.n  : "",
    brandName: (typeof S !== "undefined" && S.brand) ? S.brand.ar : "",
    size:      (typeof S !== "undefined") ? S.size  : "",
    conc:      (typeof S !== "undefined" && S.conc)  ? S.conc.ar  : "",
    family:    result ? result.famAr   : "",
    season:    result ? result.seasonAr : "",
    cost:      cost   ? cost.total     : "",
    sellPrice: (typeof S !== "undefined" && S.sellPrice) ? S.sellPrice : "",
    items:     result ? result.items.map(({key,v}) => ({
      label: (typeof IMETA !== "undefined" && IMETA[key]) ? IMETA[key].label : key,
      v
    })) : [],
  };

  showPrintModal(labelData);
}

function showPrintModal(labelData) {
  // Remove old
  const old = document.getElementById("print-label-modal");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "print-label-modal";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:flex-end;justify-content:center;z-index:9000;backdrop-filter:blur(4px)";

  overlay.innerHTML = `
  <div style="background:#0f0a18;border:1px solid rgba(232,192,112,0.35);border-radius:18px 18px 0 0;padding:22px 18px 36px;width:100%;max-width:520px;animation:slideUp .25s ease">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
      <div style="font-size:16px;font-weight:700;color:#e8c070">🖨 طباعة ليبل الزجاجة</div>
      <button onclick="document.getElementById('print-label-modal').remove()" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:8px;padding:6px 13px;font-size:13px;cursor:pointer;font-family:inherit">✕</button>
    </div>

    <!-- Label Preview -->
    <div style="background:#fff;border-radius:10px;padding:16px 14px;margin-bottom:16px;text-align:center;color:#111;font-family:inherit;border:2px dashed rgba(232,192,112,0.4)">
      <div style="font-size:10px;color:#888;margin-bottom:4px">معاينة الليبل (58مم)</div>
      <div style="font-weight:800;font-size:17px;color:#1a0a00">✦ عطورك ✦</div>
      <div style="font-size:11px;color:#555;margin:3px 0">━━━━━━━━━━━━━━</div>
      <div style="font-weight:700;font-size:16px;color:#3a1a00">${labelData.perfName}</div>
      <div style="font-size:11px;color:#666;margin-bottom:5px">${labelData.brandName}</div>
      <div style="font-size:10px;color:#555">━━━━━━━━━━━━━━</div>
      <div style="font-size:11px;color:#333;text-align:right;direction:rtl;line-height:1.9;margin-top:4px">
        ${labelData.size ? `الحجم: ${labelData.size} مل<br>` : ""}
        ${labelData.conc ? `التركيز: ${labelData.conc}<br>` : ""}
        ${labelData.family ? `العائلة: ${labelData.family}<br>` : ""}
        ${labelData.cost ? `التكلفة: ${labelData.cost} د.ك<br>` : ""}
        ${labelData.sellPrice ? `<strong>البيع: ${labelData.sellPrice} د.ك</strong><br>` : ""}
      </div>
      <div style="font-size:9px;color:#aaa;margin-top:6px">${new Date().toLocaleDateString('ar-KW')}</div>
    </div>

    <!-- Bluetooth Status -->
    <div id="bt-status-bar" style="background:rgba(255,255,255,0.05);border:1px solid rgba(232,192,112,0.2);border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:12px;color:rgba(255,255,255,0.7)">
        ${PRINTER.connected
          ? `<span style="color:#6ec878">● متصل</span> — ${PRINTER.device ? PRINTER.device.name : "الطابعة"}`
          : '<span style="color:#e87777">● غير متصل</span> — JK-58PL'}
      </div>
      <button onclick="togglePrinterConnect()" class="printer-connect-btn ghost" style="font-size:12px;padding:6px 12px">
        ${PRINTER.connected ? "🖨 متصل ✓" : "🖨 توصيل الطابعة"}
      </button>
    </div>

    <!-- Bluetooth Note -->
    ${!navigator.bluetooth ? `
    <div style="background:rgba(232,119,119,0.1);border:1px solid rgba(232,119,119,0.3);border-radius:9px;padding:10px;font-size:12px;color:#e8aaaa;margin-bottom:14px;line-height:1.6">
      ⚠️ متصفحك لا يدعم Web Bluetooth — استخدم <strong>Chrome</strong> أو <strong>Edge</strong> على Android أو الكمبيوتر
    </div>` : ""}

    <!-- Copies -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="font-size:13px;color:rgba(255,255,255,0.7)">عدد النسخ:</div>
      <div style="display:flex;gap:6px">
        ${[1,2,3,5].map(n => `
        <button onclick="setPrintCopies(${n})" id="copies-btn-${n}"
          style="background:${n===1?"rgba(232,192,112,0.2)":"rgba(255,255,255,0.07)"};border:2px solid ${n===1?"rgba(232,192,112,0.6)":"rgba(255,255,255,0.15)"};color:${n===1?"#e8c070":"rgba(255,255,255,0.8)"};border-radius:8px;padding:7px 14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">
          ${n}
        </button>`).join("")}
      </div>
    </div>

    <!-- Print Button -->
    <button onclick="doPrintLabel()" style="width:100%;padding:15px;background:linear-gradient(135deg,#4a2a00,#c8902a);border:none;border-radius:12px;color:#fff;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;letter-spacing:0.5px">
      🖨 اطبع الليبل
    </button>

    <!-- Fallback: Browser Print -->
    <div style="text-align:center;margin-top:10px">
      <button onclick="printViaScreen()" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:12px;cursor:pointer;font-family:inherit;text-decoration:underline">
        أو اطبع عبر المتصفح (بديل)
      </button>
    </div>
  </div>`;

  document.body.appendChild(overlay);
  // Store label data for print
  window._labelData = labelData;
  window._printCopies = 1;
}

function setPrintCopies(n) {
  window._printCopies = n;
  [1,2,3,5].forEach(c => {
    const btn = document.getElementById(`copies-btn-${c}`);
    if (!btn) return;
    const active = c === n;
    btn.style.background = active ? "rgba(232,192,112,0.2)" : "rgba(255,255,255,0.07)";
    btn.style.borderColor = active ? "rgba(232,192,112,0.6)" : "rgba(255,255,255,0.15)";
    btn.style.color = active ? "#e8c070" : "rgba(255,255,255,0.8)";
  });
}

async function togglePrinterConnect() {
  if (PRINTER.connected) {
    PRINTER.disconnect();
    // Refresh status bar in modal
    const bar = document.getElementById("bt-status-bar");
    if (bar) bar.querySelector("div").innerHTML = '<span style="color:#e87777">● غير متصل</span> — JK-58PL';
  } else {
    const ok = await PRINTER.connect();
    const bar = document.getElementById("bt-status-bar");
    if (bar && ok) bar.querySelector("div").innerHTML = `<span style="color:#6ec878">● متصل</span> — ${PRINTER.device ? PRINTER.device.name : "الطابعة"}`;
  }
  updatePrinterBtn();
}

async function doPrintLabel() {
  const data = window._labelData;
  const copies = window._printCopies || 1;
  if (!data) return;
  for (let i = 0; i < copies; i++) {
    await PRINTER.printLabel(data);
    if (i < copies - 1) await new Promise(r => setTimeout(r, 800));
  }
}

function printViaScreen() {
  const d = window._labelData || {};
  const items = (d.items || []).map(i => `<div style="font-size:11px;color:#333">${i.label}: ${i.v} مل</div>`).join("");
  const win = window.open("", "_blank", "width=300,height=500");
  win.document.write(`
  <!DOCTYPE html><html lang="ar" dir="rtl">
  <head><meta charset="UTF-8"><title>ليبل عطر</title>
  <style>
    body { font-family: Arial, sans-serif; text-align:center; padding:16px; background:#fff; color:#111; width:200px; margin:0 auto; }
    h1 { font-size:16px; margin:0 0 4px; }
    .sep { border:none; border-top:1px dashed #999; margin:6px 0; }
    .detail { font-size:11px; text-align:right; line-height:1.9; }
    .footer { font-size:9px; color:#999; margin-top:8px; }
    @media print { @page { margin:0; size: 58mm auto; } }
  </style></head>
  <body>
    <div style="font-size:14px;font-weight:800">✦ عطورك ✦</div>
    <hr class="sep">
    <h1>${d.perfName||""}</h1>
    <div style="font-size:11px;color:#555;margin-bottom:6px">${d.brandName||""}</div>
    <hr class="sep">
    <div class="detail">
      ${d.size ? `الحجم: ${d.size} مل<br>` : ""}
      ${d.conc ? `التركيز: ${d.conc}<br>` : ""}
      ${d.family ? `العائلة: ${d.family}<br>` : ""}
      ${d.cost ? `التكلفة: ${d.cost} د.ك<br>` : ""}
      ${d.sellPrice ? `<strong>البيع: ${d.sellPrice} د.ك</strong><br>` : ""}
    </div>
    ${items ? `<hr class="sep">${items}` : ""}
    <div class="footer">${new Date().toLocaleDateString('ar-KW')}<br>perfumez.app</div>
    <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),800)}<\/script>
  </body></html>`);
  win.document.close();
}
