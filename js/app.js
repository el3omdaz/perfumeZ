// ═══════════════════════════════════════════════════
// app.js — حاسبة العطور الاحترافية
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
let S = {
  tab: "calc",
  // calc
  step: 1,
  catF: "all", season: "all",
  brand: null, perf: null,
  size: 50, conc: null, grade: null,
  dpg: false,
  antiSting: true,
  oilKD: "3", alcKD: "30", alcLtr: "25", bottleKD: "0.600", packKD: "0.100",
  sellPrice: "",
  result: null,
  // blend
  bMode: "suggest",
  bCatF: "all", bSeason: "all",
  bBrand1: null, bPerf1: null,
  bBrand2: null, bPerf2: null,
  bBrand3: null, bPerf3: null,
  bSize: 50,
  bConc: 0.18,
  dominant: "1",
  bResult: null,
  // search
  perfSearch: "",
  gender: "all",
  famF: "all",
};

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function el(id) { return document.getElementById(id); }
function n3(v)  { return parseFloat((+v).toFixed(3)); }
function pickName(list, seed) {
  let h = 0; const s = String(seed || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}

function famBadge(fkey, small) {
  const f = FAM[fkey]; if (!f) return "";
  return `<span class="fam-badge" style="background:${f.color}18;border:1px solid ${f.color}44;color:${f.color};font-size:${small ? 10 : 11}px">${f.e} ${f.ar}</span>`;
}

// ═══════════════════════════════════════════════════
// السعر التقريبي بالكويت (تقدير)
// ═══════════════════════════════════════════════════
function estimatePrices(brand, perf) {
  if (!brand || !perf) return null;
  const base = (typeof PRICE_BRAND !== "undefined" && PRICE_BRAND[brand.b] != null)
      ? PRICE_BRAND[brand.b]
      : (PRICE_CAT_FALLBACK[brand.cat] || PRICE_DEFAULT);
  const cf = priceConcFactor(perf.n);
  return retailSizesFor(brand.cat).map(s => {
    const sf = PRICE_SIZE_FACTOR[s] || (s / 100);
    return { size: s, price: base * cf * sf };
  });
}
function roundKD(x) {
  if (x >= 40) return Math.round(x);            // أرقام كاملة للأسعار العالية
  return Math.round(x * 2) / 2;                  // أقرب 0.5
}
function nfKD(v) { return (Math.round(v * 10) / 10).toString(); }
function priceRange(p) {
  return `${nfKD(roundKD(p * 0.90))}–${nfKD(roundKD(p * 1.12))}`;
}
function priceCardHTML(brand, perf) {
  const pr = estimatePrices(brand, perf);
  if (!pr) return "";
  return `
  <div style="margin-top:11px;padding-top:11px;border-top:1px solid rgba(232,192,112,0.2)">
    <div style="font-size:12px;color:rgba(232,192,112,0.9);font-weight:700;margin-bottom:8px">💵 السعر التقريبي بالكويت <span style="font-weight:400;color:rgba(255,255,255,0.5)">(العطر الأصلي)</span></div>
    <div style="display:grid;grid-template-columns:repeat(${pr.length},1fr);gap:6px">
      ${pr.map(x => `
      <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:8px 4px;text-align:center">
        <div style="font-size:11px;color:rgba(255,255,255,0.6)">${x.size} مل</div>
        <div style="font-size:13px;font-weight:800;color:#e8c070;margin-top:3px;line-height:1.2">${priceRange(x.price)}</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.4)">د.ك</div>
      </div>`).join("")}
    </div>
    <div style="font-size:10px;color:rgba(255,255,255,0.45);margin-top:8px;line-height:1.6">* تقدير تقريبي لسعر الأصلي في السوق الكويتي — يختلف حسب المتجر والعرض والتركيز</div>
  </div>`;
}

// ═══════════════════════════════════════════════════
// FORMULA ENGINE
// ═══════════════════════════════════════════════════
// تحليل حدة الكحول وحساب المخففات اللازمة
function computeSting(p, sz, oilMl, sandalMl, dpgMl) {
  const famPts = (typeof STING_FAM !== "undefined" && STING_FAM[p.f] != null) ? STING_FAM[p.f] : 0;
  const oilRatio = sz > 0 ? oilMl / sz : 0;
  let concPts = oilRatio < 0.08 ? 2 : oilRatio < 0.15 ? 1 : oilRatio < 0.25 ? 0 : -1;
  let modPts = 0;
  if (sandalMl > 0) modPts -= 1;   // زيت ثقيل يكسر التبخر
  if (dpgMl > 0)    modPts -= 1;   // DPG يلطّف
  const score = famPts + concPts + modPts;          // أعلى = أحدّ
  const level = score >= 3 ? "عالية" : score >= 1 ? "متوسطة" : "منخفضة";
  const color = level === "عالية" ? "#e87777" : level === "متوسطة" ? "#c8a96e" : "#6ec878";
  const enabled = S.antiSting !== false;

  let waterMl = 0, ipmMl = 0, maceration, proof;
  if (level === "عالية") {
    waterMl = enabled ? +(sz * 0.07).toFixed(2) : 0;
    ipmMl   = enabled ? +(sz * 0.03).toFixed(2) : 0;
    maceration = "7 ايام"; proof = "80–90%";
  } else if (level === "متوسطة") {
    waterMl = enabled ? +(sz * 0.04).toFixed(2) : 0;
    ipmMl   = enabled ? +(sz * 0.02).toFixed(2) : 0;
    maceration = "5 ايام"; proof = "90–96%";
  } else {
    maceration = "2–3 ايام"; proof = "96% مناسب";
  }

  let verdict;
  if (level === "منخفضة")
    verdict = "هذا العطر يكسر حدة الكحول بنفسه — قاعدته دافئة وزيوته ثقيلة (مسك/عنبر/عود) تبطّئ تبخر الكحول، فالرشة تطلع ناعمة بدون مخففات.";
  else if (level === "متوسطة")
    verdict = "حدة كحول متوسطة — أضفنا مخففات بسيطة وقلّلنا نسبة الكحول لتنعيم الرشة.";
  else
    verdict = "العطر خفيف/منعش لا يكسر الحدة (نوتات حمضية وخضراء تتبخر بسرعة مع الكحول) — أضفنا مخففات أقوى وقلّلنا الكحول وزوّدنا التعتيق.";

  const measures = [];
  if (waterMl > 0) measures.push(`💧 ماء مقطر ${waterMl} مل — يكسر سرعة التبخر`);
  if (ipmMl > 0)   measures.push(`🧴 آيزوبروبيل ميرستات (IPM) ${ipmMl} مل — مخفف زيتي يلطّف الكحول`);
  if (!S.dpg && level !== "منخفضة") measures.push(`➕ فعّل DPG من الإضافات أعلاه — يبطّئ التبخر ويثبّت`);
  if (level !== "منخفضة" && sandalMl <= 0 && p.f !== "oud") measures.push(`🪵 لمسة مسك أو صندل تساعد على تهدئة الكحول`);
  measures.push(`⏳ تعتيق/تهوية: ${maceration} (زجاجة نصف مفتوحة بمكان بارد مظلم)`);
  measures.push(`🧪 تركيز الكحول المقترح: ${proof}`);

  return { score, level, color, verdict, waterMl, ipmMl, maceration, proof, measures, enabled };
}

function calcFormula() {
  const p = S.perf, sz = S.size, c = S.conc, g = S.grade;
  if (!p || !c || !g) return null;
  const isBranded = !!p.isoBranded;
  const baseConc = c.pct;
  const adjConc  = Math.min(baseConc * g.mult, 0.45);
  const oilMl    = parseFloat((sz * adjConc).toFixed(2));
  const dpgMl    = S.dpg ? parseFloat((sz * 0.05).toFixed(2)) : 0;
  const sandalMl = p.sandalPct ? parseFloat((sz * p.sandalPct * g.mult * 0.6).toFixed(2)) : 0;
  const isoseMl  = (!isBranded && p.isosePct) ? Math.min(parseFloat((sz * p.isosePct).toFixed(2)), sz * 0.02) : 0;
  // تحليل حدة الكحول + مخففات
  const sting    = computeSting(p, sz, oilMl, sandalMl, dpgMl);
  const ipmMl    = sting.ipmMl;
  const waterMl  = sting.waterMl;
  const used     = oilMl + sandalMl + isoseMl + dpgMl + ipmMl + waterMl;
  const alcMl    = parseFloat(Math.max(0, sz - used).toFixed(2));
  const items = [];
  items.push({ key: "oil", v: oilMl });
  if (sandalMl > 0) items.push({ key: "sandal", v: sandalMl });
  if (isoseMl > 0)  items.push({ key: "isose",  v: isoseMl });
  if (ipmMl > 0)    items.push({ key: "ipm",    v: ipmMl });
  if (dpgMl > 0)    items.push({ key: "dpg",    v: dpgMl });
  items.push({ key: "alcohol", v: alcMl });
  if (waterMl > 0)  items.push({ key: "water",  v: waterMl });
  const fam = FAM[p.f] || {};
  let tip = "";
  if (isBranded) tip = "هذا اكورد ماركة عالمية — Isose وAmbroxan موجودان داخل الزيت، لذلك لم نضفهم. DPG فقط يمكن اضافته بأمان.";
  else if (p.f === "oud") tip = "عطر عودي ثقيل — استخدم الكحول اقل وحدة قبل الرش. افضل ثبات عند تطبيقه على نقاط الدفء.";
  else if (p.f === "aqua" || p.f === "fresh") tip = "عطر خفيف — تجنب الاماكن الحارة ورش على الملابس للثبات اطول.";
  const season   = fam.season || "both";
  const seasonAr = season === "summer" ? "صيفي" : season === "winter" ? "شتوي" : "مناسب للجميع";
  return { items, oilMl, sandalMl, isoseMl, dpgMl, ipmMl, waterMl, alcMl, isBranded, tip, sting, seasonAr, famAr: fam.ar || "", famColor: fam.color || "#c8a96e" };
}

function calcCost(r) {
  if (!r) return null;
  const oilG = (r.oilMl * 0.90);
  const oilC = (oilG / 50) * (+S.oilKD || 0);
  const alcC = r.alcMl * ((+S.alcKD || 0) / ((+S.alcLtr || 1) * 1000));
  const btl  = +S.bottleKD || 0, pkg = +S.packKD || 0;
  const tot  = oilC + alcC + btl + pkg;
  return { oilG: oilG.toFixed(2), oilC: oilC.toFixed(3), alcC: alcC.toFixed(3), btl: btl.toFixed(3), pkg: pkg.toFixed(3), total: tot.toFixed(3) };
}

// ═══════════════════════════════════════════════════
// BLEND ENGINE
// ═══════════════════════════════════════════════════
function calcBlend() {
  const perfs  = [S.bPerf1, S.bPerf2, S.bPerf3].filter(Boolean);
  const brands = [S.bBrand1, S.bBrand2, S.bBrand3].filter(Boolean);
  if (perfs.length < 2) return null;
  if (S.bMode === "suggest") {
    const p1 = S.bPerf1, b1 = S.bBrand1, fam1 = p1.f;
    const suggestions = [];
    BRANDS.forEach(brand => {
      brand.items.forEach(perf => {
        if (perf === p1) return;
        const cv = COMPAT[fam1] ? COMPAT[fam1][perf.f] : -1;
        if (cv === 2 && suggestions.length < 6) suggestions.push({ brand, perf, cv });
      });
    });
    const cats = ["🌍", "🌙", "✨"];
    const picks = [];
    cats.forEach(cat => {
      const found = suggestions.find(s => s.brand.cat === cat && !picks.find(p => p.brand === s.brand));
      if (found) picks.push(found);
    });
    while (picks.length < 3 && suggestions.length > picks.length) {
      const extra = suggestions.find(s => !picks.includes(s));
      if (extra) picks.push(extra); else break;
    }
    return { mode: "suggest", picks: picks.slice(0, 3), p1, b1 };
  } else {
    const domIdx = parseInt(S.dominant) - 1;
    const domPerf = perfs[domIdx] || perfs[0];
    const others  = perfs.filter((_, i) => i !== domIdx);
    let totalScore = 0, count = 0;
    for (let i = 0; i < perfs.length; i++) {
      for (let j = i + 1; j < perfs.length; j++) {
        const cv = COMPAT[perfs[i].f] ? COMPAT[perfs[i].f][perfs[j].f] : 1;
        totalScore += cv; count++;
      }
    }
    const avgScore = count > 0 ? totalScore / count : 1;
    const score10  = Math.round(avgScore * 5);
    const domPct   = 60;
    const otherPct = Math.floor((100 - domPct) / others.length);
    const leftover = 100 - domPct - (otherPct * others.length);
    const ratios   = [{ perf: domPerf, brand: brands[domIdx] || brands[0], pct: domPct, role: "رئيسي" }];
    others.forEach((p, i) => {
      const bIdx = perfs.indexOf(p);
      ratios.push({ perf: p, brand: brands[bIdx] || brands[0], pct: i === 0 ? otherPct + leftover : otherPct, role: "داعم" });
    });
    const resFam = FAM[domPerf.f] || {};
    const compatLabel = score10 >= 8 ? "توافق ممتاز" : score10 >= 5 ? "يمكن بحذر" : "غير موصى به";
    const compatColor = score10 >= 8 ? "#6ec878" : score10 >= 5 ? "#c8a96e" : "#e87777";
    const seasonTag   = resFam.season === "summer" ? "صيفي" : resFam.season === "winter" ? "شتوي" : "للجميع";
    const names = ["نفحة الخليج", "روح الصحراء", "سحر الليل", "عبير الورد", "نسيم الفجر", "اسطورة الشرق", "بريق الذهب"];
    const suggestedName = pickName(names, perfs.map(p => p.n).join("|") + "|" + S.dominant);
    return { mode: "eval", ratios, score10, compatLabel, compatColor, seasonTag, resFam, suggestedName, reason: `مزيج ${perfs.map(p => FAM[p.f] ? FAM[p.f].ar : p.f).join(" + ")} — التركيبة تجمع ${perfs.length} عطور بعائلات ${score10 >= 8 ? "متوافقة جداً" : score10 >= 5 ? "متقاربة" : "مختلفة"}.` };
  }
}

// ═══════════════════════════════════════════════════
// FILTERED BRANDS
// ═══════════════════════════════════════════════════
function getFilteredBrands(catF, season, gender, famF) {
  let bs = catF === "all" ? BRANDS : BRANDS.filter(b => b.cat === catF);
  return bs.map(b => {
    let items = b.items;
    if (season !== "all") {
      items = items.filter(p => {
        const s = FAM[p.f] ? FAM[p.f].season : "both";
        if (season === "both") return s === "both";
        return s === season || s === "both";
      });
    }
    if (gender && gender !== "all") {
      items = items.filter(p => !p.g || p.g === gender);
    }
    if (famF && famF !== "all") {
      items = items.filter(p => p.f === famF);
    }
    return { ...b, items };
  }).filter(b => b.items.length > 0)
   .sort((a, b) => {
      // غربي/نيش أولاً (🌍، ✨)، خليجي/يدوي ثانياً (🌙، ⭐)
      const order = { "🌍": 0, "✨": 1, "🌙": 2, "⭐": 3 };
      const catDiff = (order[a.cat] ?? 9) - (order[b.cat] ?? 9);
      if (catDiff !== 0) return catDiff;
      // داخل كل مجموعة: ترتيب أبجدي
      if (a.cat === "🌙" || a.cat === "⭐") {
        // أبجدي عربي
        return (a.ar || a.b).localeCompare(b.ar || b.b, "ar");
      }
      // أبجدي لاتيني
      return a.b.localeCompare(b.b, "fr");
    });
}

// All perfumes flat list for search
function getAllPerfs() {
  const list = [];
  BRANDS.forEach(b => {
    b.items.forEach(p => list.push({ brand: b, perf: p }));
  });
  return list;
}

function searchPerfs(query) {
  if (!query || query.trim() === "") return getAllPerfs();
  const q = query.trim().toLowerCase();
  return getAllPerfs().filter(({ brand, perf }) =>
    perf.n.toLowerCase().includes(q) ||
    brand.ar.includes(q) ||
    brand.b.toLowerCase().includes(q) ||
    (FAM[perf.f] && FAM[perf.f].ar.includes(q))
  );
}

// ═══════════════════════════════════════════════════
// RENDER — TAB CONTROLLER
// ═══════════════════════════════════════════════════
function render() {
  if (S.tab === "calc")  renderCalc();
  else if (S.tab === "blend") renderBlend();
}

// ═══════════════════════════════════════════════════
// RENDER CALC
// ═══════════════════════════════════════════════════
function renderCalc() {
  const fb    = getFilteredBrands(S.catF, S.season, S.gender, S.famF);
  const brand = S.brand;
  const perf  = S.perf;

  let html = `
  <div class="steps">
    ${[{n:1,l:"العطر"},{n:2,l:"الحجم"},{n:3,l:"التكاليف"}].map(({n,l},i,a) => `
      <div class="step-dot" style="background:${S.step>n?"#e8c070":"transparent"};border:2px solid ${S.step>=n?"#e8c070":"rgba(232,192,112,0.2)"};color:${S.step>n?"#09070d":S.step===n?"#e8c070":"rgba(255,255,255,0.3)"}">
        ${S.step > n ? "✓" : n}
      </div>
      <div class="step-label" style="color:${S.step===n?"#e8c070":S.step>n?"#f5dfa0":"rgba(255,255,255,0.35)"}">${l}</div>
      ${i < a.length - 1 ? `<div class="step-line" style="background:${S.step>n?"#e8c070":"rgba(232,192,112,0.15)"}"></div>` : ""}
    `).join("")}
  </div>`;

  // STEP 1 — perfume selection with dropdowns
  if (S.step === 1) {
    html += `
    <div class="fi">
      <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin-bottom:8px">
        ${CATS.map(c => `<button class="season-btn${S.catF===c.id?" active":""}" onclick="setCat('${c.id}')">${c.ar}</button>`).join("")}
      </div>
      <div class="season-row">
        ${SEASONS.map(s => `<button class="season-btn${S.season===s.id?" active":""}" onclick="setSeason('${s.id}')">${s.e} ${s.ar}</button>`).join("")}
      </div>
      <div class="season-row" style="margin-bottom:8px">
        ${GENDERS.map(g => `<button class="season-btn${S.gender===g.id?" active":""}" onclick="setGender('${g.id}')">${g.e} ${g.ar}</button>`).join("")}
      </div>
      <div class="season-row" style="margin-bottom:14px">
        <button class="season-btn${S.famF==="all"?" active":""}" onclick="setFamF('all')">🌸 الكل</button>
        ${Object.keys(FAM).map(k => `<button class="season-btn${S.famF===k?" active":""}" onclick="setFamF('${k}')" style="${S.famF===k?`border-color:${FAM[k].color};color:${FAM[k].color}`:""}">${FAM[k].e} ${FAM[k].ar}</button>`).join("")}
      </div>

      <div class="card">
        <div class="field-label">الماركة</div>
        <select onchange="setBrand(this.value)" style="margin-bottom:12px">
          <option value="">— اختر الماركة —</option>
          ${fb.map(b => `<option value="${b.b}" ${brand&&brand.b===b.b?"selected":""}>${b.ar} (${b.b}) ${b.cat}</option>`).join("")}
        </select>

        ${brand ? `
        <div class="field-label" style="margin-top:4px">العطر</div>
        <select onchange="setPerf(this.value)">
          <option value="">— اختر العطر —</option>
          ${(()=>{
            let items = brand.items;
            if(S.gender !== "all") items = items.filter(p => !p.g || p.g === S.gender);
            if(S.famF   !== "all") items = items.filter(p => p.f === S.famF);
            if(items.length === 0) items = brand.items;
            return items.map(p => `<option value="${p.n}" ${perf&&perf.n===p.n?"selected":""}>${p.n} — ${FAM[p.f]?FAM[p.f].e+FAM[p.f].ar:""} ${p.g==="m"?"👨":p.g==="f"?"👩":"🌐"}</option>`).join("");
          })()}
        </select>` : ""}

        ${perf ? `
        <div class="fi" style="margin-top:12px;background:rgba(232,192,112,0.08);border:1px solid rgba(232,192,112,0.25);border-radius:10px;padding:12px">
          <div style="font-size:11px;color:rgba(232,192,112,0.8);margin-bottom:3px">${brand.ar}</div>
          <div style="font-size:17px;font-weight:700;margin-bottom:7px">${perf.n}</div>
          <div style="display:flex;gap:7px;flex-wrap:wrap">${famBadge(perf.f)}
            <span style="font-size:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:2px 9px">${perf.g==="m"?"👨 رجالي":perf.g==="f"?"👩 نسائي":"🌐 يونيسكس"}</span>
          </div>
          ${priceCardHTML(brand, perf)}
        </div>` : ""}
      </div>

      <div class="btn-row" style="margin-bottom:12px">
        <button class="ghost" style="font-size:13px" onclick="openAddBrand()">➕ أضف ماركة / عطر</button>
      </div>
      <div style="text-align:center">
        <button class="btn" ${!perf ? "disabled" : ""} onclick="setStep(2)">التالي ← الحجم</button>
      </div>
    </div>`;
  }

  // STEP 2
  else if (S.step === 2) {
    html += `
    <div class="fi">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;color:rgba(232,192,112,0.8)">${brand && brand.ar}</div>
        <div style="font-size:17px;font-weight:700">${perf && perf.n}</div>
      </div>
      <div class="card">
        <div class="card-title">حجم الزجاجة</div>
        <div class="size-row">
          ${SIZES.map(s => `<button class="size-btn${S.size===s?" active":""}" onclick="setSize(${s})">${s} مل</button>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-title">التركيز</div>
        <div class="conc-grid">
          ${CONCS.map(c => `
          <div class="conc-card${S.conc&&S.conc.id===c.id?" active":""}" onclick="setConc('${c.id}')" style="${S.conc&&S.conc.id===c.id?`background:${c.color}18;border-color:${c.color}`:""}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
              <div class="conc-name" style="color:${S.conc&&S.conc.id===c.id?c.color:"#fff"}">${c.ar}</div>
              <div class="conc-pct" style="color:${c.color}">${(c.pct*100).toFixed(0)}%</div>
            </div>
            <div class="conc-dur">${c.dur}</div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-title">درجة جودة الزيت عندك</div>
        <div class="grade-grid">
          ${GRADES.map((g, i) => `
          <div class="grade-card${S.grade&&S.grade.id===g.id?" active":""}" onclick="setGrade(${i})" style="${S.grade&&S.grade.id===g.id?`border-color:${g.color};background:${g.color}12`:""}">
            <div class="grade-emoji">${g.e}</div>
            <div class="grade-info">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div class="grade-name" style="color:${S.grade&&S.grade.id===g.id?g.color:"#fff"}">${g.label} — ${g.ar}</div>
                <div class="grade-price" style="color:${g.color};background:${g.color}20">${g.price}</div>
              </div>
              <div class="grade-desc">${g.desc}</div>
              ${S.grade&&S.grade.id===g.id?`<div class="grade-mult" style="color:${g.color}">التطبيق سيزيد نسبة الزيت x${g.mult.toFixed(2)} لتعويض التخفيف</div>`:""}
            </div>
            <div class="grade-dot" style="background:${g.color};opacity:${S.grade&&S.grade.id===g.id?1:0}"></div>
          </div>`).join("")}
        </div>
      </div>
      <div class="btn-row">
        <button class="ghost" onclick="setStep(1)">رجوع</button>
        <button class="btn" onclick="setStep(3)">التالي ← التكاليف</button>
      </div>
    </div>`;
  }

  // STEP 3
  else if (S.step === 3) {
    const isBranded = perf ? !!perf.isoBranded : false;
    html += `
    <div class="fi">
      <div style="text-align:center;margin-bottom:14px">
        <div style="font-size:11px;color:rgba(232,192,112,0.8)">${brand&&brand.ar} · ${S.conc&&S.conc.ar} · ${S.size}مل · ${S.grade&&S.grade.label}</div>
        <div style="font-size:17px;font-weight:700">${perf && perf.n}</div>
      </div>
      <div class="card">
        <div class="card-title">💰 تكاليفك (د.ك)</div>
        <div class="cost-grid-2">
          <div><div class="cost-label">💛 زيت / 50 جرام</div>
          <input type="number" class="cost-input" step="0.001" min="0" value="${S.oilKD}" placeholder="3" oninput="S.oilKD=this.value;saveSettings();renderOut()"></div>
          <div><div class="cost-label">🫙 الغرشة</div>
          <input type="number" class="cost-input" step="0.001" min="0" value="${S.bottleKD}" placeholder="0.600" oninput="S.bottleKD=this.value;saveSettings();renderOut()"></div>
        </div>
        <div class="cost-grid-3">
          <div><div class="cost-label">🧴 سعر الكحول</div>
          <input type="number" class="cost-input" step="0.001" min="0" value="${S.alcKD}" placeholder="30" oninput="S.alcKD=this.value;saveSettings();renderOut()"></div>
          <div><div class="cost-label">📦 كمية (لتر)</div>
          <input type="number" class="cost-input" step="0.1" min="0" value="${S.alcLtr}" placeholder="25" oninput="S.alcLtr=this.value;saveSettings();renderOut()"></div>
          <div><div class="cost-label">🎁 تغليف</div>
          <input type="number" class="cost-input" step="0.001" min="0" value="${S.packKD}" placeholder="0.100" oninput="S.packKD=this.value;saveSettings();renderOut()"></div>
        </div>
      </div>
      <div class="card" style="padding:13px 16px">
        <div class="card-title">اضافات</div>
        ${isBranded ? `<div class="info-badge">✅ اكورد ماركة عالمية — Isose وAmbroxan موجودان داخل الزيت تلقائياً</div>` : ""}
        <div class="toggle-row" onclick="S.dpg=!S.dpg;renderCalc()">
          <div class="toggle-track" style="background:${S.dpg?"#e8c070":"rgba(255,255,255,0.1)"}">
            <div class="toggle-thumb" style="left:${S.dpg?20:3}px"></div>
          </div>
          <div><div class="toggle-label">DPG</div><div class="toggle-sub">يبطئ التبخر ويمدد الكمية — آمن مع أي زيت</div></div>
        </div>
        <div class="toggle-row" onclick="S.antiSting=!S.antiSting;renderCalc()">
          <div class="toggle-track" style="background:${S.antiSting?"#6ec8b5":"rgba(255,255,255,0.1)"}">
            <div class="toggle-thumb" style="left:${S.antiSting?20:3}px"></div>
          </div>
          <div><div class="toggle-label">🔥 تنعيم حدة الكحول</div><div class="toggle-sub">يضيف ماء مقطر + IPM ويقلّل الكحول تلقائياً حسب العطر</div></div>
        </div>
      </div>
      <div id="calc-out"></div>
      <div class="btn-row" style="margin-top:10px">
        <button class="ghost" onclick="setStep(2)">رجوع</button>
      </div>
    </div>`;
  }

  el("tab-calc").innerHTML = html;
  if (S.step === 3) renderOut();
}


// ── Results Region ──
function renderOut() {
  const out = el("calc-out"); if (!out) return;
  const result = calcFormula();
  const cost   = result ? calcCost(result) : null;
  out.innerHTML = result ? outHTML(result, cost) : "";
}

function renderProfit() {
  const po = el("profit-out"); if (!po) return;
  const result = calcFormula();
  const cost   = result ? calcCost(result) : null;
  po.innerHTML  = cost ? profitHTML(cost) : "";
}

function outHTML(result, cost) {
  const perf = S.perf;
  return `
  <div class="fi">
    <div class="card" style="padding:12px 15px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        ${famBadge(perf && perf.f)}
        <span style="font-size:12px;color:#7ddbc9;background:rgba(110,200,181,0.1);border:1px solid rgba(110,200,181,0.25);border-radius:20px;padding:2px 10px">${result.seasonAr}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📋 المقادير</div>
      ${result.items.map(({key,v}) => `
      <div class="bar-row">
        <div class="bar-top">
          <div style="display:flex;align-items:center;gap:6px">
            <div class="bar-dot" style="background:${IMETA[key].color}"></div>
            <div class="bar-label">${IMETA[key].label}</div>
            ${key==="isose"&&v>S.size*0.02?`<div class="bar-warn">⚠ لا تزد!</div>`:""}
          </div>
          <div class="bar-val">${v} مل</div>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,(v/S.size)*100)}%;background:${IMETA[key].color}"></div></div>
      </div>`).join("")}
      <div class="strip">
        ${result.items.map(({key,v}) => `<div style="flex:${v/S.size};background:${IMETA[key].color};transition:flex 1s"></div>`).join("")}
      </div>
      <div class="legend">
        ${result.items.map(({key,v}) => `<div class="leg-item"><div class="leg-dot" style="background:${IMETA[key].color}"></div>${IMETA[key].label} ${(v/S.size*100).toFixed(1)}%</div>`).join("")}
      </div>
    </div>
    ${result.sting ? `
    <div class="card" style="border:1px solid ${result.sting.color}55;background:${result.sting.color}0d">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px">
        <div style="font-size:14px;font-weight:700;color:${result.sting.color}">🔥 حدة الكحول</div>
        <span style="font-size:12px;font-weight:800;color:${result.sting.color};background:${result.sting.color}1f;border:1px solid ${result.sting.color}55;border-radius:20px;padding:3px 12px">${result.sting.level}</span>
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.75;margin-bottom:${result.sting.measures.length?10:0}px">${result.sting.verdict}</div>
      ${result.sting.measures.length ? `<div style="display:flex;flex-direction:column;gap:6px">
        ${result.sting.measures.map(m => `<div style="font-size:12px;color:rgba(255,255,255,0.78);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:7px 10px;line-height:1.6">${m}</div>`).join("")}
      </div>` : ""}
      ${result.sting.level!=="منخفضة" && result.sting.enabled===false ? `<div style="font-size:11px;color:#e8c070;margin-top:8px">⚠ تنعيم الكحول مُطفأ — فعّله من الإضافات لإضافة المخففات للتركيبة</div>` : ""}
    </div>` : ""}
    ${cost ? `
    <div class="cost-result">
      <div class="card-title" style="margin-bottom:13px">💰 تكلفة الزجاجة عليك</div>
      ${[{ic:"💛",lb:`زيت العطر — ${cost.oilG}ج`,v:cost.oilC,c:"#c8a96e"},
         {ic:"🧴",lb:`كحول — ${result.alcMl.toFixed(1)}مل`,v:cost.alcC,c:"#6e8fc8"},
         {ic:"🫙",lb:"الغرشة",v:cost.btl,c:"#9e6ec8"},
         {ic:"🎁",lb:"تغليف + ملصق",v:cost.pkg,c:"#6ec878"}].map(({ic,lb,v,c}) => `
      <div class="cost-row">
        <div class="cost-row-label"><div style="width:7px;height:7px;border-radius:2px;background:${c}"></div>${ic} ${lb}</div>
        <div class="cost-row-val">${parseFloat(v).toFixed(3)} د.ك</div>
      </div>`).join("")}
      <div class="cost-total">
        <div class="cost-total-label">الاجمالي</div>
        <div class="cost-total-val">${cost.total} د.ك</div>
      </div>
      <div class="mult-grid">
        ${[{x:3,c:"#6e8fc8",t:"ادنى"},{x:5,c:"#c8a96e",t:"متوسط"},{x:7,c:"#c87a6e",t:"جيد"},{x:10,c:"#9e6ec8",t:"فاخر"}].map(({x,c,t}) => `
        <div class="mult-card" style="background:${c}12;border:1px solid ${c}35">
          <div class="mult-tag">x${x} — ${t}</div>
          <div class="mult-price" style="color:${c}">${(+cost.total*x).toFixed(3)}</div>
          <div class="mult-profit">+${(+cost.total*(x-1)).toFixed(3)}</div>
        </div>`).join("")}
      </div>
    </div>
    <div class="profit-box">
      <div class="profit-title">🧮 احسب ربحك — ادخل سعر البيع</div>
      <input type="number" step="0.001" min="0" value="${S.sellPrice}" placeholder="سعر البيع بالدينار الكويتي..."
        oninput="S.sellPrice=this.value;renderProfit()"
        style="width:100%;background:#0c0a15;border:2px solid ${S.sellPrice?"rgba(110,200,181,0.5)":"var(--bd)"};color:#fff;border-radius:9px;padding:11px;font-size:15px;font-family:inherit;text-align:center">
      <div id="profit-out">${profitHTML(cost)}</div>
    </div>` : ""}
    <div class="card" style="padding:12px 15px">
      <div style="font-size:14px;color:var(--g);font-weight:700;margin-bottom:10px">ترتيب الخلط الصحيح</div>
      <div class="mix-order">
        ${result.items.filter(i => i.key !== "alcohol" && i.key !== "water").map(({key}) => `
          <span class="mix-chip" style="background:${IMETA[key].color}18;border:1px solid ${IMETA[key].color}44;color:#fff">${IMETA[key].label}</span>
          <span class="mix-arrow">←</span>`).join("")}
        <span class="mix-chip" style="background:rgba(110,143,200,0.12);border:1px solid rgba(110,143,200,0.3);color:#8aabdd">كحول${result.waterMl>0?" + ماء مقطر":""} (آخر شي)</span>
      </div>
    </div>
    ${result.tip ? `<div class="tip-box">💡 ${result.tip}</div>` : ""}
    <div class="btn-row">
      <button class="ghost" onclick="copyRecipe()">📋 نسخ</button>
      <button class="ghost label-print-btn" onclick="openPrintLabelModal()" title="طباعة ليبل الزجاجة على الطابعة الحرارية">🏷 ليبل</button>
      <button class="ghost" onclick="printRecipe()">🖨 طباعة</button>
      <button class="ghost" onclick="resetCalc()">🔄 جديد</button>
    </div>
  </div>`;
}

function profitHTML(cost) {
  if (!cost || !S.sellPrice || isNaN(+S.sellPrice)) return "";
  const sp = +S.sellPrice, tc = +cost.total, pr = sp - tc;
  const pct = tc > 0 ? (pr / tc * 100) : 0;
  return `
  <div class="profit-result fi">
    <div class="profit-cell"><div class="profit-cell-label">التكلفة</div><div class="profit-cell-val" style="color:#c87a6e">${cost.total}</div></div>
    <div class="profit-cell"><div class="profit-cell-label">البيع</div><div class="profit-cell-val" style="color:#6eb5c8">${sp.toFixed(3)}</div></div>
    <div class="profit-cell" style="background:${pr>0?"rgba(110,200,120,0.1)":"rgba(232,119,119,0.08)"}"><div class="profit-cell-label">الربح</div><div class="profit-cell-val" style="color:${pr>0?"#6ec878":"#e87777"}">${pr>0?"+":""}${pr.toFixed(3)}</div></div>
  </div>
  <div class="profit-bar-wrap">
    <div class="profit-bar-meta"><span>هامش الربح</span><span style="color:${pr>0?"#6ec878":"#e87777"};font-weight:700">${pct.toFixed(1)}%</span></div>
    <div class="profit-bar-track"><div class="profit-bar-fill" style="width:${Math.min(100,Math.max(0,pct/10))}%;background:${pr>0?"linear-gradient(90deg,#6ec8b5,#6ec878)":"#e87777"}"></div></div>
    ${pr <= 0 ? `<div class="profit-warn">⚠ سعر اقل من التكلفة!</div>` : ""}
    ${pr > 0 && pct < 300 ? `<div class="profit-hint">💡 هامش منخفض — يُنصح بـ 500%+</div>` : ""}
  </div>`;
}

// ═══════════════════════════════════════════════════
// RENDER BLEND
// ═══════════════════════════════════════════════════
function renderBlend() {
  const fb      = getFilteredBrands(S.bCatF, S.bSeason, S.gender, S.famF);
  const bResult = S.bMode === "eval" && S.bPerf1 && S.bPerf2 ? calcBlend() :
                  S.bMode === "suggest" && S.bPerf1 ? calcBlend() : null;

  let html = `
  <div style="display:flex;gap:8px;justify-content:center;margin-bottom:14px">
    <div onclick="S.bMode='suggest';renderBlend()" style="background:${S.bMode==='suggest'?"rgba(232,192,112,0.14)":"var(--cb)"};border:2px solid ${S.bMode==='suggest'?"var(--ba)":"var(--bd)"};border-radius:11px;padding:11px 16px;cursor:pointer;flex:1;text-align:center">
      <div style="font-size:14px;font-weight:700;color:${S.bMode==='suggest'?"var(--g)":"#fff"}">✨ اقترح لي توافقات</div>
    </div>
    <div onclick="S.bMode='eval';renderBlend()" style="background:${S.bMode==='eval'?"rgba(232,192,112,0.14)":"var(--cb)"};border:2px solid ${S.bMode==='eval'?"var(--ba)":"var(--bd)"};border-radius:11px;padding:11px 16px;cursor:pointer;flex:1;text-align:center">
      <div style="font-size:14px;font-weight:700;color:${S.bMode==='eval'?"var(--g)":"#fff"}">🔬 هل يركبون؟</div>
    </div>
  </div>
  <button class="ghost" onclick="toggleMatrix()" style="width:100%;text-align:center;font-size:13px;margin-bottom:10px" id="matrixBtn">
    ▼ جدول التوافق بين العائلات
  </button>
  <div id="matrixDiv" style="display:none;margin-bottom:12px"></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:7px">
    ${CATS.map(c => `<button class="season-btn${S.bCatF===c.id?" active":""}" onclick="S.bCatF='${c.id}';S.bPerf1=null;S.bPerf2=null;S.bPerf3=null;renderBlend()">${c.ar}</button>`).join("")}
  </div>
  <div class="season-row" style="margin-bottom:12px">
    ${SEASONS.map(s => `<button class="season-btn${S.bSeason===s.id?" active":""}" onclick="S.bSeason='${s.id}';S.bPerf1=null;S.bPerf2=null;S.bPerf3=null;renderBlend()">${s.e} ${s.ar}</button>`).join("")}
  </div>
  <div class="btn-row" style="margin-bottom:12px">
    <button class="ghost" style="font-size:13px" onclick="openAddBrand()">➕ أضف ماركة / عطر</button>
  </div>
  <div class="card">
    <div class="card-title">${S.bMode==="suggest"?"العطر الرئيسي":"اختر العطور (2-3)"}</div>
    ${blendSelectHTML(fb, 1, "العطر الاول", null)}
    ${S.bPerf1 ? blendSelectHTML(fb, 2, "العطر الثاني", S.bPerf1.f) : ""}
    ${S.bMode==="eval" && S.bPerf2 ? blendSelectHTML(fb, 3, "العطر الثالث (اختياري)", S.bPerf2.f) : ""}
  </div>
  ${S.bMode==="eval" && S.bPerf1 && S.bPerf2 ? `
  <div class="card" style="background:rgba(232,192,112,0.06);border-color:var(--ba)">
    <div class="card-title">👑 العطر الرئيسي في الخلطة</div>
    <div style="font-size:12px;color:var(--mu);margin-bottom:10px">العطر الرئيسي يأخذ 60% من الزجاجة</div>
    ${[{idx:"1",p:S.bPerf1,b:S.bBrand1},{idx:"2",p:S.bPerf2,b:S.bBrand2},{idx:"3",p:S.bPerf3,b:S.bBrand3}].filter(x=>x.p).map(({idx,p,b}) => `
    <div class="dom-card${S.dominant===idx?" active":""}" onclick="S.dominant='${idx}';renderBlend()">
      <div class="dom-radio${S.dominant===idx?" active":""}">
        ${S.dominant===idx?`<div class="dom-radio-inner"></div>`:""}
      </div>
      <div style="flex:1">
        <div class="dom-name">${b&&b.ar} · ${p.n}</div>
        ${famBadge(p.f, true)}
      </div>
      ${S.dominant===idx?`<div class="dom-tag">👑 60%</div>`:""}
    </div>`).join("")}
  </div>` : ""}
  <div style="margin-bottom:12px">
    <div class="field-label" style="margin-bottom:7px">حجم الزجاجة</div>
    <div class="size-row">
      ${SIZES.map(s => `<button class="size-btn${S.bSize===s?" active":""}" onclick="S.bSize=${s};renderBlend()">${s}مل</button>`).join("")}
    </div>
  </div>
  <div style="margin-bottom:12px">
    <div class="field-label" style="margin-bottom:7px">تركيز الخلطة</div>
    <div class="size-row">
      ${[{id:0.03,ar:'كولونيا 3%'},{id:0.10,ar:'EDT 10%'},{id:0.18,ar:'EDP 18%'},{id:0.28,ar:'Parfum 28%'}].map(c => `<button class="size-btn${S.bConc===c.id?" active":""}" onclick="S.bConc=${c.id};renderBlend()">${c.ar}</button>`).join("")}
    </div>
  </div>
  ${bResult ? renderBlendResult(bResult) : ""}`;

  el("tab-blend").innerHTML = html;
}

function blendSelectHTML(fb, num, label, compatFam) {
  const brand = S[`bBrand${num}`], perf = S[`bPerf${num}`];
  const perfumes = brand ? brand.items : [];
  return `
  <div style="margin-bottom:12px">
    <div class="field-label">${label}</div>
    <select onchange="setBBlend(${num},'brand',this.value)" style="margin-bottom:8px">
      <option value="">— الماركة —</option>
      ${fb.map(b => `<option value="${b.b}" ${brand&&brand.b===b.b?"selected":""}>${b.ar} (${b.b}) ${b.cat}</option>`).join("")}
    </select>
    ${brand ? `<select onchange="setBBlend(${num},'perf',this.value)">
      <option value="">— العطر —</option>
      ${perfumes.map(p => {
        const cv = compatFam && COMPAT[compatFam] ? COMPAT[compatFam][p.f] : -1;
        const ci = cv >= 0 ? CL[cv] : null;
        return `<option value="${p.n}" ${perf&&perf.n===p.n?"selected":""}>${ci?ci.i+' ':''}${p.n} — ${FAM[p.f]?FAM[p.f].e+FAM[p.f].ar:''}</option>`;
      }).join("")}
    </select>` : ""}
    ${perf ? `<div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:6px">
      ${famBadge(perf.f, true)}
      ${compatFam && perf.f ? (() => { const cv = COMPAT[compatFam]?COMPAT[compatFam][perf.f]:1; const ci = CL[cv]; return `<span style="font-size:11px;color:${ci.c};background:${ci.c}15;border:1px solid ${ci.c}44;border-radius:20px;padding:2px 8px">${ci.i} ${ci.t}</span>`; })() : ""}
    </div>` : ""}
  </div>`;
}


// ═══════════════════════════════════════════════════
// BLEND MIX STEPS — خطوات الخلط الصحيحة
// ═══════════════════════════════════════════════════
function blendMixStepsHTML(ratios, bSize, mode, concPct) {
  // concPct = نسبة الزيت العطري الكلية (مثل 0.10 لـ EDT، 0.18 لـ EDP)
  const oilPct      = concPct || S.bConc || 0.18;
  const oilTotal    = parseFloat((bSize * oilPct).toFixed(1));
  const dpgMl       = 0; // DPG اختياري — لا يُضاف تلقائياً في المزج
  const alcMl       = parseFloat(Math.max(0, bSize - oilTotal).toFixed(1));

  const oils = ratios.map(r => ({
    name:  (r.brand ? r.brand.ar + ' · ' : '') + r.perf.n,
    ml:    parseFloat(((r.pct / 100) * oilTotal).toFixed(1)),
    role:  r.role,
    color: FAM[r.perf.f] ? FAM[r.perf.f].color : '#c8a96e',
  }));

  return `
  <div style="background:rgba(232,192,112,0.07);border:2px solid rgba(232,192,112,0.35);border-radius:14px;padding:16px;margin-top:14px">
    <div style="font-size:15px;font-weight:800;color:var(--g);margin-bottom:14px">📋 خطوات الخلط الكاملة — ${bSize}مل</div>

    <div style="font-size:12px;color:rgba(110,200,181,0.9);background:rgba(110,200,181,0.08);border:1px solid rgba(110,200,181,0.25);border-radius:9px;padding:9px 12px;margin-bottom:14px;line-height:1.7">
      ✅ <strong>القاعدة الذهبية:</strong> كل الزيوت أولاً مع بعض ← حرك ← ثم الكحول أخيراً ببطء
    </div>

    <!-- المرحلة الأولى: الزيوت -->
    <div style="font-size:13px;font-weight:700;color:var(--g);margin-bottom:9px">المرحلة الأولى — خلط الزيوت (${oilTotal}مل)</div>
    ${oils.map((o, i) => `
    <div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid ${o.color}33;border-radius:10px;padding:10px 13px;margin-bottom:7px">
      <div style="width:26px;height:26px;border-radius:50%;background:${o.color}25;border:2px solid ${o.color};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:${o.color};flex-shrink:0">${i+1}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:2px">${o.name}</div>
        ${o.role==='رئيسي'?`<span style="font-size:10px;color:var(--g);background:rgba(232,192,112,0.15);border-radius:20px;padding:1px 7px">👑 رئيسي</span>`:`<span style="font-size:10px;color:var(--mu);background:rgba(255,255,255,0.07);border-radius:20px;padding:1px 7px">داعم</span>`}
      </div>
      <div style="font-size:18px;font-weight:800;color:${o.color}">${o.ml} مل</div>
    </div>`).join('')}

    <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 13px;margin-bottom:14px;font-size:13px;color:var(--mu)">
      <span style="font-size:18px">🥄</span>
      <span>حرّك الزيوت بلطف <strong style="color:#fff">دقيقة كاملة</strong> حتى تتجانس تماماً</span>
    </div>

    <!-- المرحلة الثانية: الكحول -->
    <div style="font-size:13px;font-weight:700;color:var(--g);margin-bottom:9px">المرحلة الثانية — إضافة الكحول (${alcMl}مل)</div>
    <div style="display:flex;align-items:center;gap:10px;background:rgba(110,143,200,0.1);border:1px solid rgba(110,143,200,0.3);border-radius:10px;padding:10px 13px;margin-bottom:7px">
      <div style="width:26px;height:26px;border-radius:50%;background:rgba(110,143,200,0.2);border:2px solid #6e8fc8;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#6e8fc8;flex-shrink:0">${oils.length+1}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:#fff">كحول عطري</div>
        <div style="font-size:11px;color:var(--mu)">أضفه ببطء على الزيوت مع التحريك المستمر</div>
      </div>
      <div style="font-size:18px;font-weight:800;color:#6e8fc8">${alcMl} مل</div>
    </div>

    ${dpgMl > 0 ? `
    <div style="display:flex;align-items:center;gap:10px;background:rgba(200,160,110,0.08);border:1px solid rgba(200,160,110,0.25);border-radius:10px;padding:10px 13px;margin-bottom:7px">
      <div style="width:26px;height:26px;border-radius:50%;background:rgba(200,160,110,0.15);border:2px solid #c8a06e;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#c8a06e;flex-shrink:0">${oils.length+2}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:#fff">DPG (اختياري)</div>
        <div style="font-size:11px;color:var(--mu)">يضاف مع الكحول — يبطئ التبخر</div>
      </div>
      <div style="font-size:18px;font-weight:800;color:#c8a06e">${dpgMl} مل</div>
    </div>` : ''}

    <!-- التعتيق -->
    <div style="display:flex;align-items:center;gap:10px;background:rgba(158,110,200,0.08);border:1px solid rgba(158,110,200,0.25);border-radius:10px;padding:10px 13px;margin-top:4px">
      <span style="font-size:22px">⏳</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#c8a0e8">تعتيق 48-72 ساعة</div>
        <div style="font-size:11px;color:var(--mu)">أغلق الزجاجة واحفظها في مكان بارد ومظلم قبل الاستخدام</div>
      </div>
    </div>

    <!-- ملخص -->
    <div style="margin-top:12px;padding-top:11px;border-top:1px solid rgba(232,192,112,0.2)">
      <div style="font-size:12px;color:var(--mu);margin-bottom:5px">ملخص الكميات الكاملة (تركيز ${(oilPct*100).toFixed(0)}%):</div>
      <div style="display:flex;flex-wrap:wrap;gap:7px">
        <span style="font-size:12px;font-weight:700;color:var(--g);background:rgba(232,192,112,0.12);border-radius:20px;padding:3px 11px">زيوت ${oilTotal}مل</span>
        <span style="font-size:12px;font-weight:700;color:#6e8fc8;background:rgba(110,143,200,0.12);border-radius:20px;padding:3px 11px">كحول ${alcMl}مل</span>

        <span style="font-size:12px;font-weight:700;color:var(--green);background:rgba(110,200,120,0.12);border-radius:20px;padding:3px 11px">المجموع ${bSize}مل</span>
      </div>
    </div>
  </div>`;
}

function renderBlendResult(r) {
  if (r.mode === "suggest") {
    return `
    <div class="fi">
      <div style="font-size:14px;color:var(--g);font-weight:700;margin-bottom:12px;text-align:center">
        توافقات مقترحة مع ${r.b1&&r.b1.ar} ${r.p1&&r.p1.n}
      </div>
      ${r.picks.map(({brand, perf, cv}, pickIdx) => {
        const fam = FAM[perf.f] || {};
        const ci  = CL[cv];
        const pct1 = 65, pct2 = 35;
        const ml1  = ((S.bSize*pct1)/100).toFixed(1), ml2 = ((S.bSize*pct2)/100).toFixed(1);
        const names = ["نسيم الشرق","روح العطر","سحر الليل","بريق الذهب","عبق الصحراء"];
        const nm = pickName(names, (r.p1?r.p1.n:"") + "|" + brand.b + "|" + perf.n);
        return `
        <div class="suggest-card">
          <div class="suggest-head">
            <div>
              <div class="suggest-name">${brand.ar} · ${perf.n}</div>
              <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:4px">
                <span class="suggest-type" style="color:${brand.cat==='🌍'?'#6eb5c8':'#c8a96e'};background:${brand.cat==='🌍'?'rgba(110,181,200,0.12)':'rgba(200,169,110,0.12)'};border:1px solid ${brand.cat==='🌍'?'rgba(110,181,200,0.3)':'rgba(200,169,110,0.3)'}">
                  ${brand.cat==='🌍'?'🌍 غربي':'🌙 خليجي'}
                </span>
                ${famBadge(perf.f, true)}
              </div>
            </div>
            <div class="blend-score">${ci.i} ${cv===2?"9":"7"}/10</div>
          </div>
          <div class="suggest-ratios">
            <div class="suggest-ratio-col">
              <div class="suggest-ratio-name">${r.p1?r.p1.n:""}</div>
              <div class="suggest-ratio-pct">${pct1}%</div>
              <div class="suggest-ratio-ml">${ml1}مل</div>
            </div>
            <div style="color:var(--mu);display:flex;align-items:center;font-size:16px">+</div>
            <div class="suggest-ratio-col">
              <div class="suggest-ratio-name">${perf.n}</div>
              <div class="suggest-ratio-pct" style="color:#6eb5c8">${pct2}%</div>
              <div class="suggest-ratio-ml">${ml2}مل</div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--mu);margin-bottom:4px">مزيج ${FAM[r.p1.f]?FAM[r.p1.f].ar:""} + ${fam.ar||""} — نتيجة متوازنة ومميزة</div>
          <div class="result-name">✨ "${nm}"</div>
        </div>`;
      }).join("")}
      ${(() => {
        if (!r.picks || r.picks.length === 0) return "";
        const {brand, perf} = r.picks[0];
        const pct1 = 65, pct2 = 35;
        return blendMixStepsHTML([{perf:perf,brand,pct:pct2,role:"داعم"},{perf:r.p1,brand:r.b1,pct:pct1,role:"رئيسي"}].sort((a,b)=>b.pct-a.pct), S.bSize, "suggest");
      })()}
    </div>`;
  } else {
    const colr = r.compatColor;
    return `
    <div class="fi">
      <div class="blend-result" style="background:${r.score10>=7?"rgba(110,200,120,0.07)":"rgba(200,169,110,0.07)"};border-color:${colr}44">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:16px;font-weight:800;color:${colr}">${r.compatLabel}</div>
          <div style="background:${colr}22;border:1px solid ${colr}55;border-radius:50px;padding:3px 14px;font-size:14px;font-weight:800;color:${colr}">${r.score10}/10</div>
        </div>
        <div style="font-size:13px;color:var(--mu);margin-bottom:12px;line-height:1.7">${r.reason}</div>
        ${r.ratios.map(({perf,brand,pct,role}) => `
        <div class="ratio-row">
          <div class="ratio-name">
            ${role==="رئيسي"?`<span style="font-size:10px;color:var(--g);background:rgba(232,192,112,0.15);border-radius:20px;padding:1px 7px">👑</span>`:""}
            ${brand&&brand.ar} · ${perf.n}
          </div>
          <div class="ratio-vals">
            <span class="ratio-pct">${pct}%</span>
            <span class="ratio-ml">${((S.bSize*pct)/100).toFixed(1)}مل</span>
          </div>
        </div>`).join("")}
        ${r.resFam?`<div style="font-size:12px;color:var(--mu);margin-top:9px">🌸 العائلة الناتجة: <span style="color:#fff">${r.resFam.ar||""}</span></div>`:""}
        <div style="font-size:12px;color:#7ddbc9">الموسم: ${r.seasonTag}</div>
        <div style="font-size:13px;font-weight:700;color:var(--gl);margin-top:9px">✨ "${r.suggestedName}"</div>
      </div>
      ${blendMixStepsHTML(r.ratios, S.bSize, "eval")}
    </div>`;
  }
}

function matrixHTML() {
  const keys = Object.keys(FAM);
  let h = `<div class="matrix-wrap"><table><thead><tr><th></th>${keys.map(k=>`<th style="color:${FAM[k].color};font-size:12px">${FAM[k].e}<br>${FAM[k].ar}</th>`).join("")}</tr></thead><tbody>`;
  keys.forEach(r => {
    h += `<tr><td style="color:${FAM[r].color};font-weight:700;font-size:12px;text-align:right;padding-left:6px">${FAM[r].e} ${FAM[r].ar}</td>`;
    keys.forEach(c => {
      const v = COMPAT[r][c];
      h += `<td class="cell-icon" style="${r===c?"background:rgba(232,192,112,0.06)":""}" title="${CL[v].t}">${CL[v].i}</td>`;
    });
    h += `</tr>`;
  });
  h += `</tbody></table><div class="legend-row">${[2,1,0].map(v=>`<div class="leg-c"><span>${CL[v].i}</span><span style="color:${CL[v].c}">${CL[v].t}</span></div>`).join("")}</div></div>`;
  return h;
}

// ═══════════════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════════════
let FAVS = [];
let favEditId = null;
let favAddBrand = null, favAddPerf = null;

function loadFavs() {
  try { FAVS = JSON.parse(localStorage.getItem("fav_v1") || "[]"); } catch(e) { FAVS = []; }
}
function saveFavs() {
  try { localStorage.setItem("fav_v1", JSON.stringify(FAVS)); } catch(e) {}
}

function renderFavs() {
  const tab = el("tab-favs"); if (!tab) return;
  const allBrands = BRANDS;
  const selBrand  = favAddBrand ? allBrands.find(b => b.b === favAddBrand) : null;
  const selPerfs  = selBrand ? selBrand.items : [];

  let addSection = `
  <div class="card fi" style="border-color:var(--ba);background:rgba(232,192,112,0.05)">
    <div class="card-title">➕ أضف عطر للمفضلة</div>
    <div class="field-label">الماركة</div>
    <select onchange="favSetBrand(this.value)" style="margin-bottom:11px">
      <option value="">— اختر الماركة —</option>
      ${allBrands.map(b=>`<option value="${b.b}" ${favAddBrand===b.b?"selected":""}>${b.ar} (${b.b}) ${b.cat}</option>`).join("")}
    </select>
    ${selBrand ? `
    <div class="field-label">العطر</div>
    <select onchange="favSetPerf(this.value)" style="margin-bottom:11px">
      <option value="">— اختر العطر —</option>
      ${selPerfs.map(p=>`<option value="${p.n}" ${favAddPerf===p.n?"selected":""}>${p.n} — ${FAM[p.f]?FAM[p.f].e+FAM[p.f].ar:""}</option>`).join("")}
    </select>` : ""}
    <div class="field-label">ملاحظات (اختياري)</div>
    <textarea id="fav-note-new" class="fav-note-edit" placeholder="مثال: رائحة ثقيلة تناسب المناسبات الشتوية، ثباتها ممتاز على الجلد..."></textarea>
    <button class="btn" style="width:100%;margin-top:12px" onclick="addFav()" ${!favAddPerf?"disabled":""}>⭐ حفظ في المفضلة</button>
  </div>`;

  let listSection = "";
  if (FAVS.length === 0) {
    listSection = `<div class="fav-empty fi"><div class="fav-empty-icon">⭐</div><div style="font-size:16px;font-weight:700;margin-bottom:6px">مفضلتك فارغة</div><div style="font-size:13px">أضف عطورك المفضلة مع ملاحظاتك الشخصية</div></div>`;
  } else {
    listSection = `<div class="fi"><div style="font-size:13px;color:var(--mu);text-align:center;margin-bottom:12px">⭐ ${FAVS.length} عطر محفوظ</div>`;
    FAVS.forEach(fav => {
      const isEditing = favEditId === fav.id;
      listSection += `
      <div class="fav-card fi">
        <div class="fav-header">
          <div>
            <div class="fav-name">${fav.perfName}</div>
            <div class="fav-brand">${fav.brandName} ${fav.famE||""} ${fav.famAr||""}</div>
          </div>
          <div style="font-size:22px">${fav.famE||"⭐"}</div>
        </div>
        ${isEditing ? `
          <div class="field-label">تعديل الملاحظة</div>
          <textarea id="fav-edit-${fav.id}" class="fav-note-edit">${fav.note||""}</textarea>
          <div style="display:flex;gap:7px;margin-top:9px">
            <button class="btn" style="flex:1;padding:10px" onclick="saveFavNote('${fav.id}')">💾 حفظ</button>
            <button class="fav-btn" onclick="favEditId=null;renderFavs()">إلغاء</button>
          </div>
        ` : `
          ${fav.note ? `<div class="fav-note">${fav.note}</div>` : `<div class="fav-note-empty">لا توجد ملاحظات — اضغط تعديل لإضافتها</div>`}
          <div class="fav-actions">
            <button class="fav-btn" onclick="favEditId='${fav.id}';renderFavs()">✏️ تعديل الملاحظة</button>
            <button class="fav-btn del" onclick="delFav('${fav.id}')">🗑 حذف</button>
          </div>
        `}
      </div>`;
    });
    listSection += "</div>";
  }

  tab.innerHTML = `<div class="fi">${addSection}${FAVS.length>0?`<div style="height:4px;border-bottom:1px solid var(--bd);margin:6px 0 16px"></div>`:""}${listSection}</div>`;
}

function favSetBrand(v) { favAddBrand = v || null; favAddPerf = null; renderFavs(); }
function favSetPerf(v)  { favAddPerf  = v || null; renderFavs(); }

function addFav() {
  if (!favAddBrand || !favAddPerf) return;
  const brand = BRANDS.find(b => b.b === favAddBrand); if (!brand) return;
  const perf  = brand.items.find(p => p.n === favAddPerf); if (!perf) return;
  if (FAVS.find(f => f.brandKey === favAddBrand && f.perfName === favAddPerf)) {
    toast("⚠ هذا العطر موجود مسبقاً في المفضلة"); return;
  }
  const note    = (el("fav-note-new") || { value: "" }).value.trim();
  const famInfo = FAM[perf.f] || {};
  FAVS.unshift({ id: "f"+Date.now().toString(36), brandKey: favAddBrand, brandName: brand.ar, perfName: perf.n, famAr: famInfo.ar||"", famE: famInfo.e||"", note });
  saveFavs();
  favAddBrand = null; favAddPerf = null;
  toast("⭐ تمت الإضافة للمفضلة");
  renderFavs();
}
function delFav(id) {
  FAVS = FAVS.filter(f => f.id !== id); saveFavs();
  if (favEditId === id) favEditId = null;
  toast("تم الحذف"); renderFavs();
}
function saveFavNote(id) {
  const ta  = el("fav-edit-"+id); if (!ta) return;
  const fav = FAVS.find(f => f.id === id); if (!fav) return;
  fav.note  = ta.value.trim(); saveFavs();
  favEditId = null; toast("✅ تم حفظ الملاحظة"); renderFavs();
}

// ═══════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════
function showTab(t) {
  S.tab = t;
  el("tab-calc").style.display  = t === "calc"  ? "block" : "none";
  el("tab-blend").style.display = t === "blend" ? "block" : "none";
  el("tab-favs").style.display  = t === "favs"  ? "block" : "none";
  document.querySelectorAll(".tab").forEach((b,i) => b.classList.toggle("active", i === (t==="calc"?0:t==="blend"?1:2)));
  if (t === "favs")  renderFavs();
  else render();
  updateHomeBtn();
}

function goHome() {
  // Close any open modal
  const modal = el("modal");
  if (modal) { modal.style.display = "none"; modal.innerHTML = ""; }
  const pmModal = document.getElementById("print-label-modal");
  if (pmModal) pmModal.remove();
  const printOverlay = document.getElementById("print-overlay");
  if (printOverlay) printOverlay.remove();
  // Reset to calc tab step 1
  resetCalc();
  showTab("calc");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateHomeBtn() {
  // Show home button only when not on calc step 1
  const btn = el("home-btn");
  if (!btn) return;
  const onCalcStep1 = S.tab === "calc" && S.step === 1;
  btn.style.opacity = onCalcStep1 ? "0" : "1";
  btn.style.pointerEvents = onCalcStep1 ? "none" : "auto";
}

function setCat(v)    { S.catF = v; S.brand = null; S.perf = null; renderCalc(); }
function setSeason(v) { S.season = v; S.brand = null; S.perf = null; renderCalc(); }
function setGender(v)  { S.gender = v; S.brand = null; S.perf = null; renderCalc(); }
function setFamF(v)    { S.famF = v; S.perf = null; renderCalc(); }

function setBrand(v) {
  // Always find from full BRANDS list — keeps all items regardless of filters
  S.brand = BRANDS.find(b => b.b === v) || null;
  S.perf  = null;
  renderCalc();
}
function setPerf(v) {
  // Always search full brand items
  S.perf = S.brand ? S.brand.items.find(p => p.n === v) : null;
  renderCalc();
}

function setStep(n) {
  // Validate step 2 requires conc + grade defaults
  if (n === 2 && !S.conc)  S.conc  = CONCS[2];
  if (n === 2 && !S.grade) S.grade = GRADES[2];
  S.step = n; renderCalc(); updateHomeBtn();
}
function setSize(s)  { S.size  = s; renderCalc(); }
function setConc(id) { S.conc  = CONCS.find(c => c.id === id); renderCalc(); }
function setGrade(i) { S.grade = GRADES[i]; renderCalc(); }
function resetCalc() { S.step = 1; S.brand = null; S.perf = null; S.size = 50; S.conc = CONCS[2]; S.grade = GRADES[2]; S.dpg = false; S.sellPrice = ""; S.result = null; S.perfSearch = ""; S.gender = "all"; S.famF = "all"; renderCalc(); }

function setBBlend(num, type, val) {
  if (type === "brand") {
    const fb = getFilteredBrands(S.bCatF, S.bSeason);
    S[`bBrand${num}`] = fb.find(b => b.b === val) || null;
    S[`bPerf${num}`]  = null;
  } else {
    const brand = S[`bBrand${num}`];
    S[`bPerf${num}`] = brand ? brand.items.find(p => p.n === val) : null;
  }
  renderBlend();
}

let matrixVisible = false;
function toggleMatrix() {
  matrixVisible = !matrixVisible;
  const d = el("matrixDiv"), btn = el("matrixBtn");
  if (matrixVisible) { d.innerHTML = matrixHTML(); d.style.display = "block"; d.classList.add("fi"); btn.innerHTML = "▲ اخفاء جدول التوافق"; }
  else { d.style.display = "none"; btn.innerHTML = "▼ جدول التوافق بين العائلات"; }
}

// ═══════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════
function saveSettings() {
  try { localStorage.setItem("pcalc_settings", JSON.stringify({ oilKD: S.oilKD, alcKD: S.alcKD, alcLtr: S.alcLtr, bottleKD: S.bottleKD, packKD: S.packKD })); } catch(e) {}
}
function loadSettings() {
  try {
    const d = JSON.parse(localStorage.getItem("pcalc_settings") || "null");
    if (d) { ["oilKD","alcKD","alcLtr","bottleKD","packKD"].forEach(k => { if (d[k] != null && d[k] !== "") S[k] = d[k]; }); }
  } catch(e) {}
}
function saveCustom() {
  try { localStorage.setItem("pcalc_brands", JSON.stringify(CUSTOM)); } catch(e) {}
}
function loadCustom() {
  try {
    const d = JSON.parse(localStorage.getItem("pcalc_brands") || "[]");
    if (Array.isArray(d)) {
      CUSTOM = d;
      CUSTOM.forEach(b => { if (!BRANDS.find(x => x.b === b.b)) BRANDS.push(b); });
    }
  } catch(e) {}
}

// ═══════════════════════════════════════════════════
// ADD CUSTOM BRAND / PERFUME (Modal)
// ═══════════════════════════════════════════════════
let aiSearchResults   = null;
let aiSearchLoading   = false;
let aiSearchQuery     = "";
let aiSelectedPerfs   = new Set();
let abBrandNameOverride = "";
let aiSearchTimer     = null;

function openAddBrand() { renderModal(); el("modal").style.display = "flex"; }
function closeAdd() {
  const m = el("modal"); if (m) { m.style.display = "none"; m.innerHTML = ""; }
  aiSearchResults = null; aiSearchLoading = false; aiSearchQuery = "";
  aiSelectedPerfs = new Set(); abBrandNameOverride = "";
}

function renderModal() {
  const m = el("modal"); if (!m) return;
  if (!m.querySelector("#modal-shell")) {
    m.innerHTML = `
    <div id="modal-shell" class="modal-card fi">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
        <div style="font-size:16px;font-weight:700;color:var(--g)">➕ إضافة ماركة / عطر</div>
        <button class="ghost" style="padding:6px 13px" onclick="closeAdd()">✕</button>
      </div>
      <div class="field-label">🔍 اكتب اسم الماركة (عربي أو إنجليزي)</div>
      <div style="position:relative;margin-bottom:4px">
        <input id="ab-brand" type="text" placeholder="مثال: Versace أو فيرساتشي..." style="width:100%;padding-left:38px"
          oninput="abAutoSearch(this.value)"
          onkeydown="if(event.key==='Enter'){clearTimeout(aiSearchTimer);searchBrandAI(this.value);}">
        <div id="ab-search-icon" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none">🔍</div>
      </div>
      <div style="font-size:11px;color:var(--mu);margin-bottom:14px">يبحث تلقائياً بعد توقفك عن الكتابة ✨</div>
      <div id="ai-results-zone"></div>
      <div id="custom-list-zone"></div>
    </div>`;
    setTimeout(() => { const i = el("ab-brand"); if (i) i.focus(); }, 60);
  }
  renderModalResults();
}

function renderModalResults() {
  const zone   = el("ai-results-zone");
  const clZone = el("custom-list-zone");
  const icon   = el("ab-search-icon");
  if (!zone) return;
  if (icon) icon.textContent = aiSearchLoading ? "⏳" : "🔍";
  const famOpts = Object.keys(FAM).map(k => `<option value="${k}">${FAM[k].e} ${FAM[k].ar}</option>`).join("");
  let html = "";
  if (aiSearchLoading) {
    html = `<div style="text-align:center;padding:22px 0;color:var(--mu)">
      <div style="font-size:28px;margin-bottom:8px;animation:pulse 1.2s ease infinite">🔍</div>
      <div style="font-size:13px">جاري البحث عن <strong style="color:var(--g)">${aiSearchQuery}</strong>...</div>
      <div style="font-size:11px;margin-top:5px;color:rgba(255,255,255,0.3)">يجلب أشهر العطور...</div>
    </div>`;
  } else if (aiSearchResults) {
    const brandDisplay = abBrandNameOverride || aiSearchResults.brandAr;
    const perfs = aiSearchResults.perfumes || [];
    if (perfs.length === 0) {
      html = `<div style="background:rgba(232,119,119,0.08);border:1px solid rgba(232,119,119,0.25);border-radius:10px;padding:12px;font-size:13px;color:#e89b9b;text-align:center;margin-bottom:10px">⚠ ما لقينا عطور لهذه الماركة — جرب تكتب الاسم بالإنجليزي</div>`;
    } else {
      const allSelected = perfs.every(p => aiSelectedPerfs.has(p.n));
      html = `
      <div style="background:rgba(232,192,112,0.07);border:1px solid rgba(232,192,112,0.3);border-radius:12px;padding:14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div>
            <input id="ab-brand-name" type="text" value="${brandDisplay.replace(/"/g,'&quot;')}"
              style="background:transparent;border:none;border-bottom:1px solid var(--ba);color:var(--gl);font-size:15px;font-weight:700;width:180px;outline:none;padding:2px 4px"
              oninput="abBrandNameOverride=this.value">
            <div style="font-size:10px;color:var(--mu);margin-top:2px">${aiSearchResults.brandEn||""}</div>
          </div>
          <div style="font-size:12px;color:var(--mu)">${perfs.length} عطر</div>
        </div>
        <div style="font-size:11px;color:var(--mu);margin-bottom:8px">✓ اختر العطور اللي تبيها تضاف:</div>
        <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px">
          ${perfs.map(p => {
            const fInfo = FAM[p.f] || { ar:"", e:"❓", color:"rgba(255,255,255,0.15)" };
            const checked = aiSelectedPerfs.has(p.n);
            const safeName = p.n.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
            return `<div onclick="toggleAiPerf('${safeName}')" style="display:flex;align-items:center;gap:10px;background:${checked?"rgba(232,192,112,0.12)":"rgba(255,255,255,0.03)"};border:1.5px solid ${checked?"var(--ba)":"var(--bd)"};border-radius:9px;padding:9px 12px;cursor:pointer;transition:all .2s">
              <div style="width:18px;height:18px;border-radius:5px;border:2px solid ${checked?"var(--g)":"var(--bd)"};background:${checked?"var(--g)":"transparent"};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s">
                ${checked?'<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#09070d" stroke-width="2" fill="none" stroke-linecap="round"/></svg>':""}
              </div>
              <div style="flex:1;font-size:13px">${p.n}</div>
              <div style="font-size:11px;background:${fInfo.color}22;border:1px solid ${fInfo.color}44;border-radius:20px;padding:2px 8px;color:${fInfo.color};white-space:nowrap">${fInfo.e} ${fInfo.ar}</div>
            </div>`;
          }).join("")}
        </div>
        <div style="display:flex;gap:7px;margin-top:10px">
          <button class="ghost" style="flex:1;font-size:12px;padding:9px" onclick="toggleAllAiPerfs()">${allSelected?"إلغاء الكل":"تحديد الكل"}</button>
          <button class="btn" style="flex:2;padding:10px" onclick="addCustomBulk()" ${aiSelectedPerfs.size===0?"disabled":""}>💾 أضف ${aiSelectedPerfs.size>0?aiSelectedPerfs.size+" عطر":""}</button>
        </div>
      </div>`;
    }
  } else {
    html = `<div style="margin-top:6px;border-top:1px solid var(--bd);padding-top:14px">
      <div class="field-label" style="margin-bottom:10px">أو أضف عطراً يدوياً</div>
      <div class="field-label">اسم العطر</div>
      <input id="ab-perf" type="text" placeholder="مثال: خلطة المسك الملكي" style="margin-bottom:11px">
      <div class="field-label">العائلة العطرية</div>
      <select id="ab-fam" style="margin-bottom:11px">${famOpts}</select>
      <div class="field-label">نوع الزيت</div>
      <select id="ab-type" style="margin-bottom:11px" onchange="el('ab-adv').style.display=this.value==='local'?'block':'none'">
        <option value="local">خلطة / زيت محلي (يُضاف له صندل و Isose)</option>
        <option value="branded">زيت تجاري جاهز / مركّز كامل</option>
      </select>
      <div id="ab-adv">
        <div class="cost-grid-2">
          <div><div class="cost-label">نسبة زيت الصندل %</div><input id="ab-sandal" type="number" step="0.1" min="0" value="2" class="cost-input"></div>
          <div><div class="cost-label">نسبة Isose %</div><input id="ab-isose" type="number" step="0.1" min="0" value="1.2" class="cost-input"></div>
        </div>
        <div style="font-size:11px;color:var(--mu);margin-top:6px;line-height:1.5">القيم الافتراضية مناسبة لأغلب الزيوت — للعود ارفع الصندل لـ 4%</div>
      </div>
      <div id="ab-err" style="color:var(--red);font-size:12px;margin-top:9px;display:none"></div>
      <button class="btn" style="width:100%;margin-top:12px" onclick="addCustom()">💾 حفظ العطر</button>
    </div>`;
  }
  zone.innerHTML = html;
  if (clZone) {
    clZone.innerHTML = CUSTOM.length ? `
    <div style="margin-top:16px;border-top:1px solid var(--bd);padding-top:12px">
      <div class="field-label">ماركاتك المضافة</div>
      ${CUSTOM.map(b=>`
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border:1px solid var(--bd);border-radius:8px;padding:8px 11px;margin-bottom:6px">
          <div style="font-size:12px">${b.ar} <span style="color:var(--mu)">— ${b.items.length} عطر</span></div>
          <button class="ghost" style="padding:4px 11px;font-size:11px;border-color:rgba(232,119,119,.4);color:#e89b9b" onclick="delCustom('${b.b}')">حذف</button>
        </div>`).join("")}
    </div>` : "";
  }
}

function abAutoSearch(val) {
  clearTimeout(aiSearchTimer);
  const q = (val || "").trim();
  if (q.length < 2) {
    if (aiSearchResults || aiSearchLoading) {
      aiSearchResults = null; aiSearchLoading = false; aiSearchQuery = "";
      aiSelectedPerfs = new Set(); abBrandNameOverride = "";
      renderModalResults();
    }
    return;
  }
  aiSearchTimer = setTimeout(() => searchBrandAI(q), 750);
}

async function searchBrandAI(forcedQuery) {
  const query = ((typeof forcedQuery === "string" ? forcedQuery : (el("ab-brand")||{value:""}).value) || "").trim();
  if (!query || query.length < 2) return;
  aiSearchQuery = query; aiSearchResults = null;
  aiSelectedPerfs = new Set(); abBrandNameOverride = "";
  aiSearchLoading = true; renderModalResults();
  const famList = Object.keys(FAM).map(k=>`${k}: ${FAM[k].ar} ${FAM[k].e}`).join(", ");
  const famKeys = Object.keys(FAM).join(", ");
  const searchPrompt = `ابحث عن عطور ماركة "${query}" واجلب قائمة بأشهر عطورها الحقيقية.\nأجب فقط بـ JSON (بدون أي نص أو markdown):\n{"brandAr":"اسم بالعربي","brandEn":"الاسم الإنجليزي الرسمي","perfumes":[{"n":"اسم العطر بالإنجليزي","f":"رمز_العائلة"}]}\nالعائلات: ${famList}\nاستخدم: ${famKeys}\nإذا ما عرفت الماركة أرجع perfumes فارغة.`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: [{ role: "user", content: searchPrompt }] })
    });
    const data = await res.json();
    const hasToolUse = data.content.some(b => b.type === "tool_use");
    let finalText = "";
    if (hasToolUse) {
      const r2 = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: [{ role: "user", content: searchPrompt }, { role: "assistant", content: data.content }] })
      });
      const d2 = await r2.json();
      finalText = d2.content.filter(b => b.type === "text").map(b => b.text||"").join("");
    } else {
      finalText = data.content.filter(b => b.type === "text").map(b => b.text||"").join("");
    }
    const clean = finalText.replace(/```json|```/g,"").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : clean);
    aiSearchResults = parsed;
    (parsed.perfumes || []).forEach(p => aiSelectedPerfs.add(p.n));
  } catch(e) {
    console.error("Search error:", e);
    aiSearchResults = { brandAr: query, brandEn: query, perfumes: [] };
  }
  aiSearchLoading = false; renderModalResults();
}

function toggleAiPerf(name) {
  if (aiSelectedPerfs.has(name)) aiSelectedPerfs.delete(name); else aiSelectedPerfs.add(name);
  renderModalResults();
}
function toggleAllAiPerfs() {
  const perfs = aiSearchResults && aiSearchResults.perfumes || [];
  const allSel = perfs.every(p => aiSelectedPerfs.has(p.n));
  if (allSel) aiSelectedPerfs.clear(); else perfs.forEach(p => aiSelectedPerfs.add(p.n));
  renderModalResults();
}

function addCustomBulk() {
  if (!aiSearchResults || aiSelectedPerfs.size === 0) return;
  const brandInput = el("ab-brand-name");
  const brandName = (brandInput ? brandInput.value.trim() : "") || abBrandNameOverride || aiSearchResults.brandAr || aiSearchQuery;
  const perfs = aiSearchResults.perfumes.filter(p => aiSelectedPerfs.has(p.n));
  if (perfs.length === 0) return;
  let brand = CUSTOM.find(b => b.ar === brandName);
  if (!brand) {
    let base = "custom_"+Date.now().toString(36), bk = base, i = 1;
    while (BRANDS.find(x => x.b === bk)) { bk = base+"_"+(i++); }
    brand = { b: bk, ar: brandName, cat: "🌍", custom: true, items: [] };
    CUSTOM.push(brand); BRANDS.push(brand);
  }
  let added = 0;
  perfs.forEach(p => {
    if (!brand.items.find(x => x.n === p.n)) {
      brand.items.push({ n: p.n, f: p.f||"woody", isoBranded: true, sandalPct: 0, isosePct: 0, custom: true });
      added++;
    }
  });
  saveCustom(); toast(`✅ تمت إضافة ${added} عطر من ${brandName}`);
  aiSearchResults = null; aiSearchQuery = ""; aiSelectedPerfs = new Set(); abBrandNameOverride = "";
  const shell = el("modal-shell"); if (shell) shell.remove();
  renderModal(); el("modal").style.display = "flex";
  render();
}

function addCustom() {
  const pn   = (el("ab-perf")||{value:""}).value.trim();
  const fam  = (el("ab-fam")||{value:"woody"}).value;
  const type = (el("ab-type")||{value:"branded"}).value;
  const err  = el("ab-err");
  const showErr = msg => { if (err) { err.textContent = msg; err.style.display = "block"; } };
  if (!pn) { showErr("اكتب اسم العطر"); return; }
  const isoBranded = type === "branded";
  let sandalPct = 0, isosePct = 0;
  if (!isoBranded) {
    sandalPct = Math.max(0, (+((el("ab-sandal")||{value:2}).value)||0)) / 100;
    isosePct  = Math.max(0, (+((el("ab-isose")||{value:1.2}).value)||0)) / 100;
  }
  const item = { n: pn, f: fam, isoBranded, sandalPct, isosePct, custom: true };
  const brandKey = "manual_"+Date.now().toString(36);
  let brand = CUSTOM.find(b => b.ar === "يدوي") || null;
  if (!brand) { brand = { b: brandKey, ar: "يدوي", cat: "⭐", custom: true, items: [] }; CUSTOM.push(brand); BRANDS.push(brand); }
  if (brand.items.find(p => p.n === pn)) { showErr("هذا العطر موجود مسبقاً"); return; }
  brand.items.push(item); saveCustom();
  if (err) err.style.display = "none";
  toast("✅ تمت إضافة العطر");
  aiSearchResults = null; renderModalResults(); render();
}

function delCustom(b) {
  const ci = CUSTOM.findIndex(x => x.b === b); if (ci < 0) return;
  CUSTOM.splice(ci, 1);
  const bi = BRANDS.findIndex(x => x.b === b); if (bi >= 0) BRANDS.splice(bi, 1);
  if (S.brand && S.brand.b === b) { S.brand = null; S.perf = null; }
  [1,2,3].forEach(n => { if (S["bBrand"+n] && S["bBrand"+n].b === b) { S["bBrand"+n] = null; S["bPerf"+n] = null; } });
  saveCustom(); toast("تم الحذف"); renderModal(); render();
}

// ═══════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════
function recipeText() {
  const r = calcFormula(); if (!r) return "";
  const cost = calcCost(r);
  const L = [];
  L.push("✦ وصفة عطر ✦");
  L.push(`${S.brand?S.brand.ar:""} — ${S.perf?S.perf.n:""}`);
  L.push(`الحجم: ${S.size} مل | التركيز: ${S.conc&&S.conc.ar} | الجودة: ${S.grade&&S.grade.label}`);
  L.push(`العائلة: ${r.famAr} | ${r.seasonAr}`);
  L.push("———————————");
  L.push("المقادير:");
  r.items.forEach(({key,v}) => L.push(`• ${IMETA[key].label}: ${v} مل`));
  L.push(`ترتيب الخلط: الزيوت${r.ipmMl>0?" + IPM":""} أولاً ثم الكحول${r.waterMl>0?" + الماء المقطر":""} أخيراً`);
  if (r.sting) {
    L.push("———————————");
    L.push(`🔥 حدة الكحول: ${r.sting.level}`);
    r.sting.measures.forEach(m => L.push(`• ${m.replace(/^[^\u0600-\u06FF\w]+\s*/,"")}`));
  }
  if (cost) {
    L.push("———————————");
    L.push(`التكلفة الإجمالية: ${cost.total} د.ك`);
    L.push(`أسعار مقترحة: x3=${(+cost.total*3).toFixed(3)} | x5=${(+cost.total*5).toFixed(3)} | x7=${(+cost.total*7).toFixed(3)} | x10=${(+cost.total*10).toFixed(3)} د.ك`);
    if (S.sellPrice && !isNaN(+S.sellPrice)) {
      const pr = (+S.sellPrice) - (+cost.total);
      L.push(`سعر بيعك: ${(+S.sellPrice).toFixed(3)} د.ك | ربح الزجاجة: ${pr.toFixed(3)} د.ك`);
    }
  }
  return L.join("\n");
}

function copyRecipe() {
  const t = recipeText(); if (!t) return;
  const done = () => toast("✅ تم نسخ الوصفة");
  if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done).catch(() => fallbackCopy(t, done)); }
  else fallbackCopy(t, done);
}
function fallbackCopy(t, cb) {
  const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand("copy"); } catch(e) {}
  document.body.removeChild(ta); cb && cb();
}
function printRecipe() {
  const t = recipeText(); if (!t) return;
  const safe = t.replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const old = document.getElementById("print-overlay");
  if (old) old.remove();
  const overlay = document.createElement("div");
  overlay.id = "print-overlay";
  overlay.innerHTML = `<div id="print-overlay-inner"><div id="print-overlay-btns"><button class="po-btn-print" onclick="window.print()">🖨 طباعة</button><button class="po-btn-close" onclick="document.getElementById('print-overlay').remove()">✕ إغلاق</button></div><h2>🧴 حاسبة العطور</h2><pre>${safe}</pre></div>`;
  document.body.appendChild(overlay);
}

// ═══════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════
let toastT;
function toast(msg) {
  const t = el("toast"); if (!t) return;
  t.textContent = msg; t.className = "toast-show";
  clearTimeout(toastT); toastT = setTimeout(() => { t.className = ""; }, 1900);
}

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
loadSettings();
loadCustom();
loadFavs();
S.conc  = CONCS[2];
S.grade = GRADES[2];
render();
setTimeout(updateHomeBtn, 100);
