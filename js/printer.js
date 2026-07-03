// ═══════════════════════════════════════════════════
// printer.js — إعدادات الليبل والطباعة (Bluetooth + Safari/AirPrint)
// ═══════════════════════════════════════════════════

const LABEL_SETTINGS_KEY = "perfume_label_settings_v2";
const LABEL_DEFAULTS = {
  shopName: "عطورك",
  paperWidth: "58",
  copies: 1,
  autoCut: true,
  fields: {
    shopName: true,
    perfName: true,
    brandName: true,
    size: true,
    conc: true,
    family: false,
    season: false,
    cost: false,
    sellPrice: true,
    note: false,
    items: false,
    date: true
  }
};

let LABEL_SETTINGS = _loadLabelSettings();
window._printCopies = LABEL_SETTINGS.copies || 1;
window._labelFields = null;

function _loadLabelSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(LABEL_SETTINGS_KEY) || "null");
    if (saved && typeof saved === "object") {
      return {
        ...LABEL_DEFAULTS,
        ...saved,
        fields: { ...LABEL_DEFAULTS.fields, ...(saved.fields || {}) }
      };
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(LABEL_DEFAULTS));
}

function _saveLabelSettings() {
  LABEL_SETTINGS.copies = window._printCopies || 1;
  localStorage.setItem(LABEL_SETTINGS_KEY, JSON.stringify(LABEL_SETTINGS));
}

function _printerCompatibility() {
  const ua = navigator.userAgent || "";
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /^((?!chrome|android).)*safari/i.test(ua) || ios;
  const secure = window.isSecureContext || location.hostname === "localhost" || location.protocol === "file:";
  const bluetooth = Boolean(navigator.bluetooth && secure && !ios);
  return { ios, safari, secure, bluetooth };
}

function _collectLabelFields() {
  let result = null;
  let cost = null;
  try {
    result = typeof calcFormula === "function" ? calcFormula() : null;
    cost = result && typeof calcCost === "function" ? calcCost(result) : null;
  } catch (e) {}

  return {
    perfName: typeof S !== "undefined" && S.perf ? (S.perf.n || "") : "",
    brandName: typeof S !== "undefined" && S.brand ? (S.brand.ar || S.brand.b || "") : "",
    size: typeof S !== "undefined" ? String(S.size || "") : "",
    conc: typeof S !== "undefined" && S.conc ? (S.conc.ar || "") : "",
    family: result ? (result.famAr || "") : "",
    season: result ? (result.seasonAr || "") : "",
    cost: cost ? String(cost.total || "") : "",
    sellPrice: typeof S !== "undefined" && S.sellPrice ? String(S.sellPrice) : "",
    note: window._labelFields ? (window._labelFields.note || "") : "",
    items: result && Array.isArray(result.items) ? result.items.map(({ key, v }) => ({
      label: typeof IMETA !== "undefined" && IMETA[key] ? IMETA[key].label : key,
      v
    })) : []
  };
}

function _ensureLabelFields(refresh) {
  if (!window._labelFields || refresh) window._labelFields = _collectLabelFields();
  return window._labelFields;
}

function refreshLabelFromCalculator() {
  _ensureLabelFields(true);
  renderPrinterTab();
  _ptoast("✅ تم جلب بيانات الحاسبة");
}

function _activeLabelFields() {
  const raw = _ensureLabelFields(false);
  const on = LABEL_SETTINGS.fields;
  return {
    shopName: on.shopName ? LABEL_SETTINGS.shopName : "",
    perfName: on.perfName ? raw.perfName : "",
    brandName: on.brandName ? raw.brandName : "",
    size: on.size ? raw.size : "",
    conc: on.conc ? raw.conc : "",
    family: on.family ? raw.family : "",
    season: on.season ? raw.season : "",
    cost: on.cost ? raw.cost : "",
    sellPrice: on.sellPrice ? raw.sellPrice : "",
    note: on.note ? raw.note : "",
    items: on.items ? (raw.items || []) : [],
    showDate: Boolean(on.date),
    autoCut: Boolean(LABEL_SETTINGS.autoCut)
  };
}

function _updateLabelField(key, value) {
  const fields = _ensureLabelFields(false);
  fields[key] = value;
  _refreshAllPreviews();
}

function _setShopName(value) {
  LABEL_SETTINGS.shopName = value;
  _saveLabelSettings();
  _refreshAllPreviews();
}

function _setLabelOption(key, checked) {
  LABEL_SETTINGS.fields[key] = Boolean(checked);
  _saveLabelSettings();
  _refreshAllPreviews();
}

function _setPaperWidth(value) {
  LABEL_SETTINGS.paperWidth = String(value || "58");
  _saveLabelSettings();
  _refreshAllPreviews();
}

function _setAutoCut(checked) {
  LABEL_SETTINGS.autoCut = Boolean(checked);
  _saveLabelSettings();
}

function _setCopies(n) {
  window._printCopies = Number(n) || 1;
  LABEL_SETTINGS.copies = window._printCopies;
  _saveLabelSettings();
  document.querySelectorAll(".copy-btn[data-copy]").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.copy) === window._printCopies);
  });
}

function _fieldOptionHTML(key, label) {
  const checked = LABEL_SETTINGS.fields[key] ? "checked" : "";
  return `<label class="printer-check"><input type="checkbox" ${checked} onchange="_setLabelOption('${key}',this.checked)"><span>${label}</span></label>`;
}

function _inputHTML(label, key, value, placeholder) {
  return `<div><div class="field-label">${label}</div><input type="text" value="${_escAttr(value)}" placeholder="${_escAttr(placeholder || "")}" oninput="_updateLabelField('${key}',this.value)"></div>`;
}

function _compatibilityHTML() {
  const c = _printerCompatibility();
  if (c.ios || c.safari) {
    return `<div class="printer-note" style="background:rgba(110,181,200,.10);border:1px solid rgba(110,181,200,.32);color:#9ed9e8">
      📱 على Safari وiPhone/iPad استخدم <strong>طباعة المتصفح / AirPrint</strong>. اتصال Web Bluetooth المباشر غير متاح في Safari.
    </div>`;
  }
  if (!c.secure) {
    return `<div class="printer-note" style="background:rgba(232,119,119,.10);border:1px solid rgba(232,119,119,.30);color:#e8aaaa">
      🔒 اتصال Bluetooth يحتاج تشغيل التطبيق عبر HTTPS أو localhost. طباعة المتصفح تبقى متاحة.
    </div>`;
  }
  if (!c.bluetooth) {
    return `<div class="printer-note" style="background:rgba(232,119,119,.10);border:1px solid rgba(232,119,119,.30);color:#e8aaaa">
      ⚠️ هذا المتصفح لا يدعم Web Bluetooth. افتح التطبيق في Chrome أو Edge، أو استخدم طباعة المتصفح.
    </div>`;
  }
  return `<div class="printer-note" style="background:rgba(110,200,120,.09);border:1px solid rgba(110,200,120,.28);color:#91d99a">
    ✅ المتصفح يدعم Web Bluetooth. شغّل الطابعة واضغط «توصيل الطابعة».
  </div>`;
}

function _connectionHTML() {
  const c = _printerCompatibility();
  const disabled = c.bluetooth ? "" : "disabled";
  return `<div id="bt-bar" style="background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:10px;padding:11px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px">
    <div id="bt-status-txt" style="font-size:12px;color:rgba(255,255,255,.68)">
      ${BT.connected ? `<span style="color:#6ec878">● متصل</span> — ${_escHtml(BT.device && BT.device.name ? BT.device.name : "الطابعة")}` : '<span style="color:#e87777">● غير متصل</span>'}
    </div>
    <button id="bt-toggle-btn" class="printer-main-btn bluetooth" style="padding:8px 12px" onclick="_toggleBt()" ${disabled}>${BT.connected ? "قطع الاتصال" : "توصيل الطابعة"}</button>
  </div>`;
}

function _copiesHTML() {
  const current = window._printCopies || 1;
  return `<div class="copy-row">${[1,2,3,5].map(n => `<button class="copy-btn ${current === n ? "active" : ""}" data-copy="${n}" onclick="_setCopies(${n})">${n}</button>`).join("")}</div>`;
}

function renderPrinterTab() {
  const host = document.getElementById("tab-printer");
  if (!host) return;
  const f = _ensureLabelFields(false);
  const c = _printerCompatibility();

  host.innerHTML = `<div class="fi">
    <div class="card">
      <div class="card-title">🖨 إعدادات الطابعة والليبل</div>
      ${_compatibilityHTML()}
      <button class="ghost" style="width:100%;margin-bottom:12px" onclick="refreshLabelFromCalculator()">🔄 جلب آخر بيانات من الحاسبة</button>
      ${_connectionHTML()}
    </div>

    <div class="card">
      <div class="card-title">☑ اختر المعلومات التي تنطبع</div>
      <div class="printer-grid">
        ${_fieldOptionHTML("shopName", "اسم المحل")}
        ${_fieldOptionHTML("perfName", "اسم العطر")}
        ${_fieldOptionHTML("brandName", "الماركة")}
        ${_fieldOptionHTML("size", "الحجم")}
        ${_fieldOptionHTML("conc", "التركيز")}
        ${_fieldOptionHTML("family", "العائلة العطرية")}
        ${_fieldOptionHTML("season", "الموسم")}
        ${_fieldOptionHTML("sellPrice", "سعر البيع")}
        ${_fieldOptionHTML("cost", "التكلفة")}
        ${_fieldOptionHTML("note", "الملاحظات")}
        ${_fieldOptionHTML("items", "المقادير بالتفصيل")}
        ${_fieldOptionHTML("date", "تاريخ التحضير")}
      </div>
    </div>

    <div class="card">
      <div class="card-title">✏️ بيانات الليبل</div>
      <div style="margin-bottom:10px"><div class="field-label">اسم المحل</div><input type="text" value="${_escAttr(LABEL_SETTINGS.shopName)}" oninput="_setShopName(this.value)"></div>
      <div class="cost-grid-2">
        ${_inputHTML("اسم العطر", "perfName", f.perfName, "اسم العطر")}
        ${_inputHTML("الماركة", "brandName", f.brandName, "الماركة")}
        ${_inputHTML("الحجم (مل)", "size", f.size, "50")}
        ${_inputHTML("التركيز", "conc", f.conc, "Eau de Parfum")}
        ${_inputHTML("العائلة", "family", f.family, "خشبي")}
        ${_inputHTML("الموسم", "season", f.season, "شتاء")}
        ${_inputHTML("سعر البيع (د.ك)", "sellPrice", f.sellPrice, "0.000")}
        ${_inputHTML("التكلفة (د.ك)", "cost", f.cost, "0.000")}
      </div>
      <div style="margin-top:10px">${_inputHTML("ملاحظة إضافية", "note", f.note, "شكرًا لاختياركم")}</div>
      <div style="font-size:11px;color:var(--mu);margin-top:10px">المقادير تُجلب تلقائيًا من نتيجة الحاسبة عند تفعيل خيار «المقادير بالتفصيل».</div>
    </div>

    <div class="card">
      <div class="card-title">🏷 معاينة الليبل</div>
      <div id="printer-tab-preview" class="label-preview-paper"></div>
      <div class="cost-grid-2" style="margin-bottom:12px">
        <div><div class="field-label">عرض الورق</div><select onchange="_setPaperWidth(this.value)"><option value="58" ${LABEL_SETTINGS.paperWidth === "58" ? "selected" : ""}>58 مم</option><option value="80" ${LABEL_SETTINGS.paperWidth === "80" ? "selected" : ""}>80 مم</option></select></div>
        <div><div class="field-label">عدد النسخ</div>${_copiesHTML()}</div>
      </div>
      <label class="printer-check" style="margin-bottom:12px"><input type="checkbox" ${LABEL_SETTINGS.autoCut ? "checked" : ""} onchange="_setAutoCut(this.checked)"><span>قص الورق تلقائيًا بعد الطباعة (إذا كانت الطابعة تدعم)</span></label>
      <div class="printer-actions">
        <button class="printer-main-btn browser" onclick="_printBrowser()">${c.ios || c.safari ? "📱 طباعة / AirPrint" : "🖨 طباعة عبر المتصفح"}</button>
        <button class="printer-main-btn bluetooth" onclick="_doBluetoothPrint()" ${c.bluetooth ? "" : "disabled"}>🔵 طباعة Bluetooth</button>
      </div>
    </div>
  </div>`;

  _refreshPreview("printer-tab-preview");
}

// ═══════════════════════════════════════════════════
// Bluetooth state
// ═══════════════════════════════════════════════════
const BT = {
  device: null,
  char: null,
  connected: false,

  async connect() {
    const compatibility = _printerCompatibility();
    if (!compatibility.bluetooth) {
      _ptoast(compatibility.ios || compatibility.safari
        ? "Safari لا يدعم Bluetooth المباشر — استخدم AirPrint"
        : "المتصفح لا يدعم Web Bluetooth");
      return false;
    }

    try {
      _ptoast("🔍 اختر الطابعة من القائمة");
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
          "49535343-fe7d-4ae5-8fa9-9fafd205e455"
        ]
      });

      this.device.addEventListener("gattserverdisconnected", () => {
        this.connected = false;
        this.char = null;
        _updateBtBar();
        _ptoast("🔌 انقطع اتصال الطابعة");
      });

      _ptoast("🔗 جاري الاتصال بالطابعة");
      const server = await this.device.gatt.connect();
      const svcUUIDs = [
        "000018f0-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-fe7d-4ae5-8fa9-9fafd205e455"
      ];
      let service = null;
      for (const uuid of svcUUIDs) {
        try { service = await server.getPrimaryService(uuid); break; } catch (e) {}
      }
      if (!service) throw new Error("لم يتم العثور على خدمة الطباعة في الجهاز");

      const chrUUIDs = [
        "00002af1-0000-1000-8000-00805f9b34fb",
        "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
        "49535343-8841-43f4-a8d4-ecbe34729bb3",
        "49535343-aca3-481c-91ec-d85e28a60318"
      ];
      let characteristic = null;
      for (const uuid of chrUUIDs) {
        try { characteristic = await service.getCharacteristic(uuid); break; } catch (e) {}
      }
      if (!characteristic) throw new Error("لم يتم العثور على قناة إرسال الطباعة");

      this.char = characteristic;
      this.connected = true;
      _updateBtBar();
      _ptoast("✅ تم الاتصال بالطابعة");
      return true;
    } catch (e) {
      this.connected = false;
      this.char = null;
      _updateBtBar();
      if (e && e.name !== "NotFoundError") _ptoast("❌ " + (e.message || e));
      return false;
    }
  },

  disconnect() {
    if (this.device && this.device.gatt && this.device.gatt.connected) this.device.gatt.disconnect();
    this.connected = false;
    this.char = null;
    _updateBtBar();
    _ptoast("🔌 تم قطع الاتصال");
  },

  async send(bytes) {
    if (!this.char) throw new Error("الطابعة غير متصلة");
    const chunkSize = 20;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      if (typeof this.char.writeValueWithoutResponse === "function") await this.char.writeValueWithoutResponse(chunk);
      else await this.char.writeValue(chunk);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  },

  async print(fields) {
    if (!this.connected) {
      const connected = await this.connect();
      if (!connected) return false;
    }
    try {
      await this.send(_buildESC(fields));
      return true;
    } catch (e) {
      this.connected = false;
      this.char = null;
      _updateBtBar();
      _ptoast("❌ خطأ بالطباعة: " + (e.message || e));
      return false;
    }
  }
};

async function _toggleBt() {
  if (BT.connected) BT.disconnect();
  else await BT.connect();
}

function _updateBtBar() {
  document.querySelectorAll("#bt-status-txt").forEach(txt => {
    txt.innerHTML = BT.connected
      ? `<span style="color:#6ec878">● متصل</span> — ${_escHtml(BT.device && BT.device.name ? BT.device.name : "الطابعة")}`
      : '<span style="color:#e87777">● غير متصل</span>';
  });
  document.querySelectorAll("#bt-toggle-btn").forEach(btn => {
    btn.textContent = BT.connected ? "قطع الاتصال" : "توصيل الطابعة";
  });
}

async function _doBluetoothPrint() {
  const compatibility = _printerCompatibility();
  if (!compatibility.bluetooth) {
    _ptoast(compatibility.ios || compatibility.safari ? "استخدم طباعة / AirPrint على Safari" : "Bluetooth غير مدعوم هنا");
    return;
  }
  const copies = window._printCopies || 1;
  const fields = _activeLabelFields();
  _ptoast("🖨 جاري الطباعة");
  for (let i = 0; i < copies; i++) {
    const ok = await BT.print(fields);
    if (!ok) return;
    if (i < copies - 1) await new Promise(resolve => setTimeout(resolve, 650));
  }
  _ptoast("✅ تمت الطباعة");
}

async function _doPrint() {
  return _doBluetoothPrint();
}

// ═══════════════════════════════════════════════════
// ESC/POS builder
// ═══════════════════════════════════════════════════
function _buildESC(f) {
  const bytes = [];
  const esc = (...values) => bytes.push(...values);
  const line = (text, bold, size) => {
    esc(0x1B, 0x45, bold ? 1 : 0);
    esc(0x1D, 0x21, size === 2 ? 0x11 : 0x00);
    esc(0x1B, 0x74, 0xFF);
    _utf8(bytes, String(text || ""));
    bytes.push(0x0A);
  };
  const sep = () => { esc(0x1B, 0x45, 0); esc(0x1D, 0x21, 0); _utf8(bytes, "────────────────────"); bytes.push(0x0A); };

  esc(0x1B, 0x40);
  esc(0x1B, 0x61, 1);

  if (f.shopName) line(f.shopName, true, 2);
  if (f.shopName && (f.perfName || f.brandName)) sep();
  if (f.perfName) line(f.perfName, true, 2);
  if (f.brandName) line(f.brandName, false, 1);

  const hasDetails = f.size || f.conc || f.family || f.season || f.note;
  if (hasDetails) {
    sep();
    esc(0x1B, 0x61, 2);
    if (f.size) line("الحجم: " + f.size + " مل", false, 1);
    if (f.conc) line("التركيز: " + f.conc, false, 1);
    if (f.family) line("العائلة: " + f.family, false, 1);
    if (f.season) line("الموسم: " + f.season, false, 1);
    if (f.note) line(f.note, false, 1);
  }

  if (f.cost || f.sellPrice) {
    esc(0x1B, 0x61, 1); sep(); esc(0x1B, 0x61, 2);
    if (f.cost) line("التكلفة: " + f.cost + " د.ك", false, 1);
    if (f.sellPrice) line("سعر البيع: " + f.sellPrice + " د.ك", true, 1);
  }

  if (f.items && f.items.length) {
    esc(0x1B, 0x61, 1); sep(); line("المقادير", true, 1); esc(0x1B, 0x61, 2);
    f.items.forEach(item => line(item.label + ": " + item.v + " مل", false, 1));
  }

  if (f.showDate) {
    esc(0x1B, 0x61, 1); sep();
    line(new Date().toLocaleDateString("ar-KW"), false, 1);
  }

  bytes.push(0x0A, 0x0A, 0x0A);
  if (f.autoCut) esc(0x1D, 0x56, 0x42, 0x00);
  return new Uint8Array(bytes);
}

function _utf8(buffer, text) {
  const encoded = new TextEncoder().encode(text);
  buffer.push(...encoded);
}

// ═══════════════════════════════════════════════════
// Preview and browser/AirPrint
// ═══════════════════════════════════════════════════
function _labelInnerHTML() {
  const f = _activeLabelFields();
  const sep = `<div style="border-top:1px dashed #aaa;margin:6px 0"></div>`;
  const row = (label, value, bold) => value ? `<div style="font-size:10px;color:#333;text-align:right;direction:rtl;line-height:1.8;${bold ? "font-weight:700" : ""}">${label ? label + ": " : ""}${_escHtml(value)}</div>` : "";
  const items = (f.items || []).map(item => row(item.label, item.v + " مل", false)).join("");
  const parts = [];

  if (f.shopName) parts.push(`<div style="font-weight:800;font-size:15px;color:#1a0800;margin-bottom:2px">${_escHtml(f.shopName)}</div>`);
  if (f.shopName && (f.perfName || f.brandName)) parts.push(sep);
  if (f.perfName) parts.push(`<div style="font-weight:800;font-size:16px;color:#3a1200;margin:4px 0;line-height:1.3">${_escHtml(f.perfName)}</div>`);
  if (f.brandName) parts.push(`<div style="font-size:11px;color:#666;margin-bottom:4px">${_escHtml(f.brandName)}</div>`);

  const details = [
    row("الحجم", f.size ? f.size + " مل" : ""),
    row("التركيز", f.conc),
    row("العائلة", f.family),
    row("الموسم", f.season)
  ].join("");
  if (details) parts.push(sep, details);
  if (f.cost || f.sellPrice) parts.push(sep, row("التكلفة", f.cost ? f.cost + " د.ك" : ""), row("البيع", f.sellPrice ? f.sellPrice + " د.ك" : "", true));
  if (f.note) parts.push(sep, row("", f.note));
  if (items) parts.push(sep, `<div style="font-weight:700;font-size:10px;margin-bottom:3px">المقادير</div>`, items);
  if (f.showDate) parts.push(sep, `<div style="font-size:9px;color:#999">${new Date().toLocaleDateString("ar-KW")}</div>`);

  return parts.join("") || `<div style="font-size:11px;color:#777;padding:30px 4px">اختر معلومة واحدة على الأقل لعرض الليبل</div>`;
}

function _refreshPreview(id) {
  const preview = document.getElementById(id || "label-preview");
  if (preview) preview.innerHTML = _labelInnerHTML();
}

function _refreshAllPreviews() {
  _refreshPreview("printer-tab-preview");
  _refreshPreview("label-preview");
}

function _printBrowser() {
  const old = document.getElementById("print-overlay");
  if (old) old.remove();

  const copies = window._printCopies || 1;
  const width = LABEL_SETTINGS.paperWidth === "80" ? "80mm" : "58mm";
  const labels = Array.from({ length: copies }, (_, index) => `<div class="browser-label" style="${index < copies - 1 ? "page-break-after:always;" : ""}">${_labelInnerHTML()}</div>`).join("");
  const overlay = document.createElement("div");
  overlay.id = "print-overlay";
  overlay.innerHTML = `<style>
    #print-overlay-inner{max-width:720px;margin:0 auto}
    .browser-label{width:${width};max-width:100%;margin:0 auto 16px;background:#fff;color:#111;padding:12px;text-align:center;font-family:Tahoma,Arial,sans-serif;box-sizing:border-box}
    @media print{@page{margin:0;size:${width} auto}.browser-label{margin:0 auto;padding:3mm;width:${width}}}
  </style>
  <div id="print-overlay-inner">
    <div id="print-overlay-btns">
      <button class="po-btn-print" onclick="window.print()">🖨 طباعة الآن</button>
      <button class="po-btn-close" onclick="document.getElementById('print-overlay').remove()">✕ إغلاق</button>
    </div>
    ${labels}
  </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => window.print(), 120);
}

// ═══════════════════════════════════════════════════
// Label modal opened from calculator result
// ═══════════════════════════════════════════════════
function openPrintLabelModal() {
  _ensureLabelFields(true);
  window._printCopies = LABEL_SETTINGS.copies || 1;
  _renderLabelModal();
}

function _renderLabelModal() {
  const old = document.getElementById("print-label-modal");
  if (old) old.remove();
  const f = _ensureLabelFields(false);
  const c = _printerCompatibility();

  const overlay = document.createElement("div");
  overlay.id = "print-label-modal";
  overlay.style.cssText = "position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.84);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(3px)";
  overlay.innerHTML = `<div style="background:#0f0a18;border:1px solid rgba(232,192,112,.35);border-radius:18px 18px 0 0;padding:20px 16px 40px;width:100%;max-width:520px;max-height:94vh;overflow-y:auto;animation:_slideUp .22s ease;font-family:inherit;direction:rtl">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-size:16px;font-weight:700;color:#e8c070">🏷 تعديل وطباعة الليبل</div>
      <button onclick="document.getElementById('print-label-modal').remove()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;padding:6px 13px;font-size:13px;cursor:pointer;font-family:inherit">✕</button>
    </div>
    ${_compatibilityHTML()}
    <div class="card" style="padding:13px">
      <div class="card-title" style="font-size:14px">☑ المعلومات المطبوعة</div>
      <div class="printer-grid">
        ${_fieldOptionHTML("shopName", "اسم المحل")}${_fieldOptionHTML("perfName", "اسم العطر")}${_fieldOptionHTML("brandName", "الماركة")}${_fieldOptionHTML("size", "الحجم")}${_fieldOptionHTML("conc", "التركيز")}${_fieldOptionHTML("family", "العائلة")}${_fieldOptionHTML("season", "الموسم")}${_fieldOptionHTML("sellPrice", "سعر البيع")}${_fieldOptionHTML("cost", "التكلفة")}${_fieldOptionHTML("note", "الملاحظات")}${_fieldOptionHTML("items", "المقادير")}${_fieldOptionHTML("date", "التاريخ")}
      </div>
    </div>
    <div class="card" style="padding:13px">
      <div style="margin-bottom:9px"><div class="field-label">اسم المحل</div><input type="text" value="${_escAttr(LABEL_SETTINGS.shopName)}" oninput="_setShopName(this.value)"></div>
      <div class="cost-grid-2">
        ${_inputHTML("اسم العطر", "perfName", f.perfName)}${_inputHTML("الماركة", "brandName", f.brandName)}${_inputHTML("الحجم", "size", f.size)}${_inputHTML("التركيز", "conc", f.conc)}${_inputHTML("العائلة", "family", f.family)}${_inputHTML("الموسم", "season", f.season)}${_inputHTML("سعر البيع", "sellPrice", f.sellPrice)}${_inputHTML("التكلفة", "cost", f.cost)}
      </div>
      <div style="margin-top:9px">${_inputHTML("ملاحظة", "note", f.note)}</div>
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px;text-align:center">معاينة الليبل</div>
    <div id="label-preview" class="label-preview-paper"></div>
    ${_connectionHTML()}
    <div style="margin-bottom:13px"><div class="field-label">عدد النسخ</div>${_copiesHTML()}</div>
    <div class="printer-actions">
      <button class="printer-main-btn browser" onclick="_printBrowser()">${c.ios || c.safari ? "📱 طباعة / AirPrint" : "🖨 طباعة المتصفح"}</button>
      <button class="printer-main-btn bluetooth" onclick="_doBluetoothPrint()" ${c.bluetooth ? "" : "disabled"}>🔵 طباعة Bluetooth</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  _refreshPreview("label-preview");
}

function _escHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function _escAttr(value) {
  return _escHtml(value);
}

function _ptoast(message) {
  if (typeof toast === "function") toast(message);
  else console.log("[Printer]", message);
}

(function injectPrinterStyles() {
  if (document.getElementById("_printer-style")) return;
  const style = document.createElement("style");
  style.id = "_printer-style";
  style.textContent = "@keyframes _slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}";
  document.head.appendChild(style);
})();
