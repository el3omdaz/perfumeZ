// ═══════════════════════════════════════════════════
// data.js — بيانات حاسبة العطور الاحترافية
// ═══════════════════════════════════════════════════

const FAM = {
  fresh:    { ar: "فريش",     color: "#6eb5c8", e: "💨", season: "summer",  desc: "منعش خفيف يناسب الصيف والنهار" },
  woody:    { ar: "خشبي",     color: "#c8846e", e: "🌲", season: "both",    desc: "دافئ خشبي يناسب جميع الأوقات" },
  oud:      { ar: "عودي",     color: "#8b5e3c", e: "🪵", season: "winter",  desc: "عميق فاخر يناسب الشتاء والليل" },
  oriental: { ar: "شرقي",     color: "#c8a96e", e: "🌙", season: "winter",  desc: "غني حار يناسب المناسبات الرسمية" },
  floral:   { ar: "فلورال",   color: "#c86e9e", e: "🌸", season: "both",    desc: "زهري أنثوي يناسب الربيع والنهار" },
  musky:    { ar: "مسكي",     color: "#a0a0c8", e: "🫧", season: "both",    desc: "ناعم حسي يناسب جميع الأوقات" },
  sweet:    { ar: "حلو",      color: "#c8c06e", e: "🍯", season: "winter",  desc: "حلو دافئ يناسب الشتاء والمناسبات" },
  aromatic: { ar: "اروماتيك", color: "#6ec88a", e: "🌿", season: "both",    desc: "عشبي أخضر يناسب الطبيعة والنهار" },
  aqua:     { ar: "مائي",     color: "#6ec8c8", e: "🌊", season: "summer",  desc: "مائي منعش يناسب الصيف والرياضة" },
};

const COMPAT = {
  fresh:    { fresh:1, woody:2, oud:1, oriental:1, floral:2, musky:2, sweet:1, aromatic:2, aqua:2 },
  woody:    { fresh:2, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:2, aromatic:2, aqua:2 },
  oud:      { fresh:1, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:2, aromatic:1, aqua:0 },
  oriental: { fresh:1, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:2, aromatic:1, aqua:0 },
  floral:   { fresh:2, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:2, aromatic:2, aqua:1 },
  musky:    { fresh:2, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:2, aromatic:2, aqua:2 },
  sweet:    { fresh:1, woody:2, oud:2, oriental:2, floral:2, musky:2, sweet:1, aromatic:2, aqua:0 },
  aromatic: { fresh:2, woody:2, oud:1, oriental:1, floral:2, musky:2, sweet:2, aromatic:2, aqua:2 },
  aqua:     { fresh:2, woody:2, oud:0, oriental:0, floral:1, musky:2, sweet:0, aromatic:2, aqua:2 },
};

const CL = {
  2: { i: "✅", t: "توافق ممتاز", c: "#6ec878" },
  1: { i: "⚠",  t: "يمكن بحذر",  c: "#c8a96e" },
  0: { i: "❌", t: "غير موصى به", c: "#e87777" }
};

// وصف مختصر لكل عطر للبطاقات
const PERF_DESC = {
  // Dior
  "Sauvage EDT":         "أمواج من اللافندر والفلفل على قاعدة أميربوكسان",
  "Sauvage EDP":         "عمق أكبر مع نوتات السيدار والأميربوكسان الكثيفة",
  "Sauvage Parfum":      "القمة الفاخرة — صندل هندي مع لافندر مكثّف",
  "Homme Intense EDP":   "بنفسج كريمي ولافندر معتق — أناقة باريسية",
  "Miss Dior EDP":       "وردة وردية ناعمة مع باتشولي خفيف",
  "J'adore EDP":         "باقة من الزهور الفاخرة — أيقونة الأنوثة",
  "Fahrenheit EDT":      "بنزين وزهر العرعر — جرأة بلا حدود",
  // Chanel
  "Bleu de Chanel EDT":  "حمضيات وزنجبيل منعشة على قاعدة سيدار",
  "Bleu de Chanel EDP":  "غنى أكبر مع توافق صندل وفرنكنسنس",
  "Platinum Egoiste EDT":"نعناع بارد على قاعدة خشبية فضية",
  "Allure Homme Sport EDT":"حمضيات رياضية مع لمسة بحرية منعشة",
  "Coco Mademoiselle EDP":"وردة وبرتقال على قاعدة باتشولي غنية",
  "Chance Eau Tendre EDP":"خوخ وياسمين خفيف — شباب ودفء",
  "N5 EDP":              "الإطار الذهبي للعطور — ألدهيدات وزهور فاخرة",
  // Tom Ford
  "Oud Wood EDP":        "عود نادر مع توابل ذكية وصندل كثيف",
  "Black Orchid EDP":    "أوركيد أسود غامض مع شوكولاتة وباتشولي",
  "Tobacco Vanille EDP": "تبغ حلو مع فانيلا كريمية — دفء مطلق",
  "Noir EDP":            "هيل مدخّن مع لدان وورد داكن",
  "Lost Cherry EDP":     "كرز أسود مع لوز ومسك — إغراء حقيقي",
  "Grey Vetiver EDP":    "فيتيفر رمادي راقٍ مع غريب فروت منعش",
  "Ombre Leather EDP":   "جلد حار مع باتشولي وزهر البرتقال المدخّن",
  // Bond No. 9
  "Scent of Peace EDP":  "مسك أبيض ناعم مع ياسمين وبرغموت",
  "Wall Street EDP":     "بحر وأملاح على قاعدة فيتيفر وعنبر",
  "New York Oud EDP":    "عود شرقي مع ورد ومسك — رفاهية نيويورك",
  "Bleecker Street EDP": "بنفسج وسويد على قاعدة مسكية راقية",
  "Greenwich Village EDP":"كمون وياسمين وباتشولي — بوهيمي جذاب",
  "Chinatown EDP":       "خوخ وفاوانيا على قاعدة خشب الغياك",
  "Hamptons EDP":        "برغموت وليمون شمسي مع مسك أبيض",
  "Madison Avenue EDP":  "ورد وفاوانيا على قاعدة مسك فضية",
  "New York Nights EDP": "عنبر وعود ليلي — فخامة المدينة ليلاً",
  "Tribeca EDP":         "سيدار وصندل مع توابل دافئة",
  "Chez Bond EDP":       "لافندر وخزامى على قاعدة خشبية",
  "Chelsea Nights EDP":  "خوخ وروم مع باتشولي — ليلة لا تُنسى",
  "Nolita EDP":          "يوسفي وفريزيا وليلي — طاقة شبابية",
  "Lafayette Street EDP":"سيدار وأملاح مع مسك ذكوري",
  "New York Flowers EDP":"ورد وياسمين وفاوانيا — حديقة نيويورك",
  // Creed
  "Aventus EDP":         "أناناس ودخان وتفاح — ملك العطور",
  "Silver Mountain Water EDT":"شاي أخضر وبرغموت مع مسك نظيف",
  "Green Irish Tweed EDT":"لافندر أخضر وأيريس — كلاسيك لا يُنسى",
  "Viking EDP":          "لافندر وبرغموت على قاعدة خشبية جبلية",
  "Himalaya EDP":        "برغموت وتفاح على قاعدة صندل راقية",
  // YSL
  "La Nuit de l Homme EDT":"هيل وبخور على قاعدة خشبية شرقية",
  "Y EDP":               "جنكة وزنجبيل مع سيدار معاصر",
  "Black Opium EDP":     "قهوة وفانيلا مع زهور بيضاء",
  "Libre EDP":           "لافندر ومسك أبيض — حرية نسائية",
  "MYSLF EDP":           "تفاح وأخضر أخضر — شباب وحيوية",
  // Armani
  "Acqua di Gio EDT":    "البحر الأبيض المتوسط — الأيقونة المائية",
  "Acqua di Gio EDP":    "عمق أكبر بإضافة البخور على قاعدة مائية",
  "Code EDT":            "عرق السوس وبزنج على قاعدة خشبية",
  "Stronger With You EDP":"هيل حلو وفانيلا مع حكمة رجولية",
  "Prive Oud Royal EDP": "عود ملكي مع عود هندي وورد",
  // Versace
  "Eros EDT":            "نعناع وتفاح على قاعدة فانيلا وسيدار",
  "Eros EDP":            "أكثر عمقاً مع دخان وعنبر",
  "Eros Flame EDP":      "برتقال وليمون حار مع خشب رانجون",
  "Dylan Blue EDT":      "تين وخوخ على قاعدة أميربوكسان",
  "Pour Homme EDT":      "برغموت ونعناع مع مسك أبيض",
  // Paco Rabanne
  "1 Million EDT":       "دم برتقالي وقرفة على قاعدة جلدية",
  "1 Million EDP":       "أكثر دفئاً مع عنبر وباتشولي",
  "Invictus EDT":        "غريب فروت وبحر على قاعدة خشب الغياك",
  "Phantom EDT":         "لافندر وليمون على قاعدة خشبية",
  "Lady Million EDP":    "تفاح وورد على قاعدة باتشولي وعسل",
  // Givenchy
  "Gentleman EDT":       "فريزيا وورد إيريس على صندل",
  "Gentleman Boisee EDP":"سيدار وصندل مع إيريس أرسطوقراطي",
  "L Interdit EDP":      "زهور بيضاء مع مسك وخشب الغياك الأسود",
  // Hugo Boss
  "Boss Bottled EDT":    "تفاح وقرفة على قاعدة صندل وسيدار",
  "The Scent EDT":       "جينيبر وزنجبيل على قاعدة جلدية",
  "Hugo EDT":            "نعناع وتفاح على قاعدة سيدار خفيف",
  // Montblanc
  "Legend EDT":          "لافندر وورق الأوراق على قاعدة مسكية",
  "Legend EDP":          "مسك دافئ مع بخور وباتشولي",
  "Explorer EDP":        "برغموت وأخشاب الغابات — مغامرة",
  // Calvin Klein
  "CK One EDT":          "شاي أخضر وليمون — وحدة للجنسين",
  "Eternity EDT":        "ياسمين وإيريس على قاعدة صندل",
  "Euphoria EDP":        "رمان وأوركيد على قاعدة خشبية",
  // Davidoff
  "Cool Water EDT":      "نعناع وأعشاب بحرية — أيقونة التسعينيات",
  "Zino EDT":            "توابل وعود على قاعدة سيدار",
  // Jean Paul Gaultier
  "Le Male EDT":         "لافندر وفانيلا — ثنائي لا يُنسى",
  "Ultra Male EDT":      "كمثرى حلوة وفانيلا محسّنة",
  "Scandal Pour Homme EDT":"جلد ودخان على قاعدة خشبية جريئة",
  // Bvlgari
  "Man in Black EDP":    "رام وعود على قاعدة جلدية غامقة",
  "Aqva Pour Homme EDT": "بحر ونبتون — عطر بحري أيقوني",
  "Wood Neroli EDP":     "زهر البرتقال مع سيدار هندي",
  // Hermes
  "Terre d Hermes EDP":  "برتقال دامسوني على قاعدة فيتيفر",
  "H24 EDP":             "حكيا أخضر مع صندل هندي راقٍ",
  // Carolina Herrera
  "Good Girl EDP":       "توت أزرق وياسمين على قاعدة باتشولي",
  "Bad Boy EDT":         "برق الرعد وورد إيريس مع صندل",
  "212 VIP Men EDP":     "كوكتيل فاخر — سوبرالودن وكالاموس",
  // Parfums de Marly
  "Layton EDP":          "تفاح وفانيلا وهيل — ملك الأناقة",
  "Pegasus EDP":         "لافندر وفانيلا وصندل — خيال فاخر",
  "Percival EDP":        "لافندر ورامج — نقاء ملكي",
  "Herod EDP":           "تبغ وفانيلا على قاعدة باتشولي",
  "Delina EDP":          "لتشي وورد دمشقي وفاوانيا",
  "Delina Exclusif EDP": "فاوانيا وورد ومسك خالص",
  // MFK
  "Baccarat Rouge 540 EDP":"ياسمين وعود مع مسك أبيض — أيقونة",
  "Grand Soir EDP":      "عنبر وفانيلا على قاعدة بنزين فاخرة",
  "Oud Satin Mood EDP":  "عود ووردة دمشقية مع مسك ناعم",
  "724 EDP":             "برغموت ومسك نظيف — عطر مدني عصري",
  // Amouage
  "Reflection Man EDP":  "ياسمين وورد دمشقي مع لافندر",
  "Interlude Man EDP":   "بخور ومر على قاعدة باتشولي غني",
  "Jubilation XXV EDP":  "فرنكنسنس وورد وعود — احتفال ملكي",
  "Epic Man EDP":        "كاردامون وورد على قاعدة عود هندي",
  // Xerjoff
  "Naxos EDP":           "عسل وتبغ وفانيلا — يونانية فاخرة",
  "Alexandria II EDP":   "ورد ولدان وعنبر — ملكة الإسكندرية",
  "Cruz del Sur EDP":    "ليمون وصندل على قاعدة خشبية",
  // Lattafa
  "Badee Al Oud Amethyst EDP":"عود ورد مع عنبر ومسك",
  "Khamrah EDP":         "فانيلا وعرق سوس وعنبر — حلاوة شرقية",
  "Asad EDP":            "سيدار وباتشولي على قاعدة مسكية",
  "Qaaid Al Fursan EDP": "لافندر وتفاح مع مسك عربي",
  "Ameer Al Oudh EDP":   "عود وسافرون وعنبر ملكي",
  "Yara EDP":            "فراولة وفانيلا مع وردة وياسمين",
  "Oud Mood Elixir EDP": "عود فاخر مع توابل وعنبر",
  "Oud For Glory EDP":   "عود هندي مع ورد وزعفران",
  // Arabian Oud
  "Firdaus EDP":         "ورد وياسمين على قاعدة مسكية",
  "Rose Malaki EDP":     "ورد دمشقي خالص — ملكة الزهور",
  "Syed Al Oud EDP":     "عود سيادي على قاعدة صندل وعنبر",
  "Al Musk Al Abyad EDP":"مسك أبيض نقي مع نوتات حليبية",
  "Noble EDP":           "سيدار وصندل مع مسك الخليج",
  "Kalemat EDP":         "عنبر وعود مع توابل شرقية",
  // Al Haramain
  "L Aventure EDP":      "تفاح وزعفران على قاعدة سيدار",
  "Amber Oud Gold EDP":  "عنبر ذهبي مع عود وتوابل",
  "Princess EDP":        "ورد وفانيلا مع مسك أبيض",
  "Oudh India EDP":      "عود هندي مع باتشولي ومسك",
  "Midnight Oud EDP":    "عود ليلي مع وردة وعنبر",
  // Rasasi
  "La Yuqawam Homme EDP":"تفاح وزنجبيل على قاعدة سيدار",
  "Hawas Men EDP":       "أعشاب بحرية ولافندر مع مسك",
  "Mukhallat Al Oudh EDP":"مخلط عود فاخر مع توابل",
  "Faqat Lil Rijal EDP": "لافندر وهيل على قاعدة خشبية",
  // Swiss Arabian
  "Shaghaf Oud Aswad EDP":"عود أسود مع وردة وعنبر",
  "Wajaha Men EDP":      "توابل شرقية على قاعدة عنبر وسيدار",
  "Dehn El Oud Mubarak EDP":"زيت عود خالص — ترف مطلق",
  "Hayati EDP":          "لافندر وهيل مع صندل ومسك",
  // Ajmal
  "Wisal EDP":           "ياسمين ووردة مع مسك أبيض",
  "Shadow for Him EDP":  "تبغ وسيدار مع مسك خليجي",
  "Dhan Al Oudh Abiyad EDP":"عود أبيض نادر مع صندل",
  "Sacrifice for Him EDP":"هيل وعود على قاعدة سيدار",
  // Abdul Samad
  "Abiyad Musk EDP":     "مسك أبيض نادر — نقاء وانتماء",
  "Al Oud Al Abiyad EDP":"عود أبيض مع صندل ومسك",
  "Amber Wood EDP":      "عنبر وصندل على قاعدة شرقية",
  // Kayali
  "Vanilla 28 EDP":      "فانيلا مضاعفة مع مسك سكري",
  "Musk 12 EDP":         "مسك نظيف على قاعدة أرضية ناعمة",
  "Eden Juicy Apple 01 EDP":"تفاح عصيري مع وردة وكيوي",
};

const BRANDS = [
  {b:"Dior", ar:"ديور", cat:"🌍", items:[
    {n:"Sauvage EDT",        f:"fresh",    isoBranded:true, sandalPct:0.010, g:"m"},
    {n:"Sauvage EDP",        f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Sauvage Parfum",     f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Homme Intense EDP",  f:"floral",   isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Miss Dior EDP",      f:"floral",   isoBranded:true, sandalPct:0,     g:"f"},
    {n:"J'adore EDP",        f:"floral",   isoBranded:true, sandalPct:0,     g:"f"},
    {n:"Fahrenheit EDT",     f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
  ]},
  {b:"Chanel", ar:"شانيل", cat:"🌍", items:[
    {n:"Bleu de Chanel EDT",       f:"aromatic", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Bleu de Chanel EDP",       f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Platinum Egoiste EDT",     f:"aromatic", isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Allure Homme Sport EDT",   f:"fresh",    isoBranded:true, sandalPct:0.010, g:"m"},
    {n:"Coco Mademoiselle EDP",    f:"oriental", isoBranded:true, sandalPct:0.015, g:"f"},
    {n:"Chance Eau Tendre EDP",    f:"floral",   isoBranded:true, sandalPct:0,     g:"f"},
    {n:"N5 EDP",                   f:"floral",   isoBranded:true, sandalPct:0.010, g:"f"},
  ]},
  {b:"Tom Ford", ar:"توم فورد", cat:"🌍", items:[
    {n:"Oud Wood EDP",       f:"oud",      isoBranded:true, sandalPct:0.040, g:"u"},
    {n:"Black Orchid EDP",   f:"oriental", isoBranded:true, sandalPct:0.020, g:"u"},
    {n:"Tobacco Vanille EDP",f:"sweet",    isoBranded:true, sandalPct:0.030, g:"u"},
    {n:"Noir EDP",           f:"oriental", isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Lost Cherry EDP",    f:"sweet",    isoBranded:true, sandalPct:0.020, g:"u"},
    {n:"Grey Vetiver EDP",   f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Ombre Leather EDP",  f:"woody",    isoBranded:true, sandalPct:0.025, g:"u"},
  ]},
  {b:"BondNo9", ar:"بوند نو 9", cat:"🌍", items:[
    {n:"Scent of Peace EDP",     f:"floral",   isoBranded:true, sandalPct:0.012, g:"u"},
    {n:"Wall Street EDP",        f:"aqua",     isoBranded:true, sandalPct:0.010, g:"m"},
    {n:"New York Oud EDP",       f:"oud",      isoBranded:true, sandalPct:0.035, g:"u"},
    {n:"Bleecker Street EDP",    f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"Greenwich Village EDP",  f:"oriental", isoBranded:true, sandalPct:0.020, g:"f"},
    {n:"Chinatown EDP",          f:"oriental", isoBranded:true, sandalPct:0.025, g:"f"},
    {n:"Hamptons EDP",           f:"fresh",    isoBranded:true, sandalPct:0.008, g:"u"},
    {n:"Madison Avenue EDP",     f:"floral",   isoBranded:true, sandalPct:0.015, g:"f"},
    {n:"New York Nights EDP",    f:"oriental", isoBranded:true, sandalPct:0.022, g:"u"},
    {n:"Tribeca EDP",            f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"Chez Bond EDP",          f:"aromatic", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Chelsea Nights EDP",     f:"oriental", isoBranded:true, sandalPct:0.025, g:"f"},
    {n:"Nolita EDP",             f:"floral",   isoBranded:true, sandalPct:0.010, g:"f"},
    {n:"Lafayette Street EDP",   f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"New York Flowers EDP",   f:"floral",   isoBranded:true, sandalPct:0.012, g:"f"},
  ]},
  {b:"Creed", ar:"كريد", cat:"🌍", items:[
    {n:"Aventus EDP",               f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Silver Mountain Water EDT", f:"fresh",    isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Green Irish Tweed EDT",     f:"aromatic", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Viking EDP",                f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Himalaya EDP",              f:"aromatic", isoBranded:true, sandalPct:0.018, g:"m"},
  ]},
  {b:"YSL", ar:"ايف سان لوران", cat:"🌍", items:[
    {n:"La Nuit de l Homme EDT", f:"oriental", isoBranded:true, sandalPct:0.030, g:"m"},
    {n:"Y EDP",                  f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"Black Opium EDP",        f:"sweet",    isoBranded:true, sandalPct:0.015, g:"f"},
    {n:"Libre EDP",              f:"aromatic", isoBranded:true, sandalPct:0.012, g:"f"},
    {n:"MYSLF EDP",              f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
  ]},
  {b:"Armani", ar:"جورجيو ارماني", cat:"🌍", items:[
    {n:"Acqua di Gio EDT",       f:"aqua",     isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Acqua di Gio EDP",       f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Code EDT",               f:"sweet",    isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Stronger With You EDP",  f:"oriental", isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Prive Oud Royal EDP",    f:"oud",      isoBranded:true, sandalPct:0.035, g:"u"},
  ]},
  {b:"Versace", ar:"فيرساتشي", cat:"🌍", items:[
    {n:"Eros EDT",       f:"fresh",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Eros EDP",       f:"oriental", isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Eros Flame EDP", f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Dylan Blue EDT", f:"aqua",     isoBranded:true, sandalPct:0.012, g:"m"},
    {n:"Pour Homme EDT", f:"aqua",     isoBranded:true, sandalPct:0,     g:"m"},
  ]},
  {b:"Paco Rabanne", ar:"باكو رابان", cat:"🌍", items:[
    {n:"1 Million EDT",      f:"fresh",    isoBranded:true, sandalPct:0.012, g:"m"},
    {n:"1 Million EDP",      f:"oriental", isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"Invictus EDT",       f:"aqua",     isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Phantom EDT",        f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Lady Million EDP",   f:"floral",   isoBranded:true, sandalPct:0,     g:"f"},
  ]},
  {b:"Givenchy", ar:"جيفنشي", cat:"🌍", items:[
    {n:"Gentleman EDT",       f:"woody",    isoBranded:true, sandalPct:0.035, g:"m"},
    {n:"Gentleman Boisee EDP",f:"woody",    isoBranded:true, sandalPct:0.030, g:"m"},
    {n:"L Interdit EDP",      f:"floral",   isoBranded:true, sandalPct:0.015, g:"f"},
  ]},
  {b:"Hugo Boss", ar:"هوغو بوس", cat:"🌍", items:[
    {n:"Boss Bottled EDT", f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
    {n:"The Scent EDT",    f:"oriental", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Hugo EDT",         f:"fresh",    isoBranded:true, sandalPct:0,     g:"m"},
  ]},
  {b:"Montblanc", ar:"مون بلان", cat:"🌍", items:[
    {n:"Legend EDT",    f:"aromatic", isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Legend EDP",    f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Explorer EDP",  f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
  ]},
  {b:"Calvin Klein", ar:"كالفن كلاين", cat:"🌍", items:[
    {n:"CK One EDT",    f:"fresh",    isoBranded:true, sandalPct:0,     g:"u"},
    {n:"Eternity EDT",  f:"fresh",    isoBranded:true, sandalPct:0,     g:"u"},
    {n:"Euphoria EDP",  f:"oriental", isoBranded:true, sandalPct:0.018, g:"f"},
  ]},
  {b:"Davidoff", ar:"دافيدوف", cat:"🌍", items:[
    {n:"Cool Water EDT", f:"aqua",  isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Zino EDT",       f:"woody", isoBranded:true, sandalPct:0.020, g:"m"},
  ]},
  {b:"Jean Paul Gaultier", ar:"جان بول غوتييه", cat:"🌍", items:[
    {n:"Le Male EDT",             f:"aromatic", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Ultra Male EDT",          f:"sweet",    isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Scandal Pour Homme EDT",  f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
  ]},
  {b:"Bvlgari", ar:"بولغاري", cat:"🌍", items:[
    {n:"Man in Black EDP",   f:"oriental", isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Aqva Pour Homme EDT",f:"aqua",     isoBranded:true, sandalPct:0,     g:"m"},
    {n:"Wood Neroli EDP",    f:"woody",    isoBranded:true, sandalPct:0.020, g:"u"},
  ]},
  {b:"Hermes", ar:"ايرمس", cat:"🌍", items:[
    {n:"Terre d Hermes EDP", f:"woody", isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"H24 EDP",            f:"woody", isoBranded:true, sandalPct:0.020, g:"m"},
  ]},
  {b:"Carolina Herrera", ar:"كارولينا هيريرا", cat:"🌍", items:[
    {n:"Good Girl EDP",   f:"sweet",    isoBranded:true, sandalPct:0.015, g:"f"},
    {n:"Bad Boy EDT",     f:"woody",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"212 VIP Men EDP", f:"woody",    isoBranded:true, sandalPct:0.015, g:"m"},
  ]},
  {b:"Parfums de Marly", ar:"بارفان دو مارلي", cat:"✨", items:[
    {n:"Layton EDP",          f:"sweet",    isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Pegasus EDP",         f:"sweet",    isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"Percival EDP",        f:"aromatic", isoBranded:true, sandalPct:0.018, g:"m"},
    {n:"Herod EDP",           f:"woody",    isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Delina EDP",          f:"floral",   isoBranded:true, sandalPct:0.015, g:"f"},
    {n:"Delina Exclusif EDP", f:"floral",   isoBranded:true, sandalPct:0.018, g:"f"},
  ]},
  {b:"MFK", ar:"ميزون فرنسيس", cat:"✨", items:[
    {n:"Baccarat Rouge 540 EDP", f:"floral",   isoBranded:true, sandalPct:0.020, g:"u"},
    {n:"Grand Soir EDP",         f:"oriental", isoBranded:true, sandalPct:0.018, g:"u"},
    {n:"Oud Satin Mood EDP",     f:"oud",      isoBranded:true, sandalPct:0.030, g:"u"},
    {n:"724 EDP",                f:"fresh",    isoBranded:true, sandalPct:0,     g:"u"},
  ]},
  {b:"Amouage", ar:"عمواج", cat:"✨", items:[
    {n:"Reflection Man EDP", f:"floral",   isoBranded:true, sandalPct:0.015, g:"m"},
    {n:"Interlude Man EDP",  f:"woody",    isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Jubilation XXV EDP", f:"oud",      isoBranded:true, sandalPct:0.035, g:"m"},
    {n:"Epic Man EDP",       f:"oud",      isoBranded:true, sandalPct:0.030, g:"m"},
  ]},
  {b:"Xerjoff", ar:"اكسيرجوف", cat:"✨", items:[
    {n:"Naxos EDP",         f:"sweet",    isoBranded:true, sandalPct:0.025, g:"m"},
    {n:"Alexandria II EDP", f:"oriental", isoBranded:true, sandalPct:0.030, g:"u"},
    {n:"Cruz del Sur EDP",  f:"woody",    isoBranded:true, sandalPct:0.020, g:"m"},
  ]},
  {b:"Lattafa", ar:"لطافة", cat:"🌙", items:[
    {n:"Badee Al Oud Amethyst EDP",f:"oud",     isoBranded:false, sandalPct:0.030, isosePct:0.015, g:"u"},
    {n:"Khamrah EDP",              f:"sweet",   isoBranded:false, sandalPct:0.035, isosePct:0,     g:"u"},
    {n:"Asad EDP",                 f:"woody",   isoBranded:false, sandalPct:0.028, isosePct:0.015, g:"m"},
    {n:"Qaaid Al Fursan EDP",      f:"aromatic",isoBranded:false, sandalPct:0.022, isosePct:0.010, g:"m"},
    {n:"Ameer Al Oudh EDP",        f:"oud",     isoBranded:false, sandalPct:0.040, isosePct:0.015, g:"m"},
    {n:"Yara EDP",                 f:"floral",  isoBranded:false, sandalPct:0.012, isosePct:0,     g:"f"},
    {n:"Oud Mood Elixir EDP",      f:"oud",     isoBranded:false, sandalPct:0.045, isosePct:0.015, g:"u"},
    {n:"Oud For Glory EDP",        f:"oud",     isoBranded:false, sandalPct:0.040, isosePct:0.018, g:"m"},
  ]},
  {b:"Arabian Oud", ar:"العربية للعود", cat:"🌙", items:[
    {n:"Firdaus EDP",        f:"floral",  isoBranded:false, sandalPct:0.030, isosePct:0,     g:"f"},
    {n:"Rose Malaki EDP",    f:"floral",  isoBranded:false, sandalPct:0.018, isosePct:0,     g:"f"},
    {n:"Syed Al Oud EDP",    f:"oud",     isoBranded:false, sandalPct:0.045, isosePct:0.015, g:"m"},
    {n:"Al Musk Al Abyad EDP",f:"musky", isoBranded:false, sandalPct:0.015, isosePct:0,     g:"u"},
    {n:"Noble EDP",          f:"woody",   isoBranded:false, sandalPct:0.030, isosePct:0.012, g:"m"},
    {n:"Kalemat EDP",        f:"oriental",isoBranded:false, sandalPct:0.025, isosePct:0,     g:"u"},
  ]},
  {b:"Al Haramain", ar:"الحرمين", cat:"🌙", items:[
    {n:"L Aventure EDP",      f:"woody",   isoBranded:false, sandalPct:0.020, isosePct:0.010, g:"m"},
    {n:"Amber Oud Gold EDP",  f:"oriental",isoBranded:false, sandalPct:0.030, isosePct:0,     g:"u"},
    {n:"Princess EDP",        f:"floral",  isoBranded:false, sandalPct:0.012, isosePct:0,     g:"f"},
    {n:"Oudh India EDP",      f:"oud",     isoBranded:false, sandalPct:0.045, isosePct:0.015, g:"u"},
    {n:"Midnight Oud EDP",    f:"oud",     isoBranded:false, sandalPct:0.040, isosePct:0.015, g:"u"},
  ]},
  {b:"Rasasi", ar:"رصاصي", cat:"🌙", items:[
    {n:"La Yuqawam Homme EDP", f:"woody",    isoBranded:false, sandalPct:0.022, isosePct:0.012, g:"m"},
    {n:"Hawas Men EDP",        f:"aqua",     isoBranded:false, sandalPct:0.015, isosePct:0.008, g:"m"},
    {n:"Mukhallat Al Oudh EDP",f:"oud",      isoBranded:false, sandalPct:0.040, isosePct:0.015, g:"u"},
    {n:"Faqat Lil Rijal EDP",  f:"aromatic", isoBranded:false, sandalPct:0.018, isosePct:0.008, g:"m"},
  ]},
  {b:"Swiss Arabian", ar:"سويس عربيان", cat:"🌙", items:[
    {n:"Shaghaf Oud Aswad EDP",   f:"oud",      isoBranded:false, sandalPct:0.030, isosePct:0.012, g:"u"},
    {n:"Wajaha Men EDP",          f:"oriental", isoBranded:false, sandalPct:0.025, isosePct:0.010, g:"m"},
    {n:"Dehn El Oud Mubarak EDP", f:"oud",      isoBranded:false, sandalPct:0.040, isosePct:0.015, g:"u"},
    {n:"Hayati EDP",              f:"aromatic", isoBranded:false, sandalPct:0.015, isosePct:0.008, g:"m"},
  ]},
  {b:"Ajmal", ar:"اجمل", cat:"🌙", items:[
    {n:"Wisal EDP",              f:"floral",   isoBranded:false, sandalPct:0.012, isosePct:0,     g:"f"},
    {n:"Shadow for Him EDP",     f:"woody",    isoBranded:false, sandalPct:0.022, isosePct:0.010, g:"m"},
    {n:"Dhan Al Oudh Abiyad EDP",f:"oud",      isoBranded:false, sandalPct:0.035, isosePct:0.012, g:"u"},
    {n:"Sacrifice for Him EDP",  f:"oriental", isoBranded:false, sandalPct:0.025, isosePct:0.008, g:"m"},
  ]},
  {b:"Abdul Samad Al Qurashi", ar:"عبدالصمد القرشي", cat:"🌙", items:[
    {n:"Abiyad Musk EDP",    f:"musky",    isoBranded:false, sandalPct:0.012, isosePct:0,     g:"u"},
    {n:"Al Oud Al Abiyad EDP",f:"oud",     isoBranded:false, sandalPct:0.040, isosePct:0.015, g:"u"},
    {n:"Amber Wood EDP",     f:"oriental", isoBranded:false, sandalPct:0.028, isosePct:0,     g:"u"},
  ]},
  {b:"Kayali", ar:"خيالي", cat:"🌙", items:[
    {n:"Vanilla 28 EDP",          f:"sweet",   isoBranded:false, sandalPct:0.025, isosePct:0,     g:"f"},
    {n:"Musk 12 EDP",             f:"musky",   isoBranded:false, sandalPct:0.012, isosePct:0,     g:"u"},
    {n:"Eden Juicy Apple 01 EDP", f:"fresh",   isoBranded:false, sandalPct:0,     isosePct:0,     g:"f"},
  ]},
];

// ═══════════════════════════════════════════════════
// توسعة القائمة: أشهر العطور الإضافية لكل ماركة
// غربي/نيش: isoBranded:true (+sandalPct) — خليجي 🌙: isoBranded:false (+sandalPct,isosePct)
// ═══════════════════════════════════════════════════
const EXTRA_PERFUMES = {
  "Dior":[
    {n:"Dior Homme EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Dior Homme Cologne",f:"fresh",g:"m",isoBranded:true,sandalPct:0},
    {n:"Homme Sport EDT",f:"fresh",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Eau Sauvage EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Sauvage Elixir",f:"woody",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Joy EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Hypnotic Poison EDT",f:"sweet",g:"f",isoBranded:true,sandalPct:0.015},
    {n:"Poison EDT",f:"oriental",g:"f",isoBranded:true,sandalPct:0.020},
    {n:"Dior Addict EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.015},
    {n:"Miss Dior Blooming Bouquet",f:"floral",g:"f",isoBranded:true,sandalPct:0},
  ],
  "Chanel":[
    {n:"Allure Homme Sport Eau Extreme",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Egoiste EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Antaeus EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Allure Homme EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Bleu de Chanel Parfum",f:"woody",g:"m",isoBranded:true,sandalPct:0.022},
    {n:"Coco Noir EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.015},
    {n:"Chance EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Chance Eau Fraiche EDT",f:"fresh",g:"f",isoBranded:true,sandalPct:0},
    {n:"Gabrielle EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Coco Mademoiselle Intense",f:"oriental",g:"f",isoBranded:true,sandalPct:0.015},
  ],
  "Tom Ford":[
    {n:"Tobacco Oud EDP",f:"oud",g:"u",isoBranded:true,sandalPct:0.035},
    {n:"Oud Wood Intense EDP",f:"oud",g:"u",isoBranded:true,sandalPct:0.040},
    {n:"Soleil Blanc EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.010},
    {n:"Fucking Fabulous EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Bitter Peach EDP",f:"sweet",g:"u",isoBranded:true,sandalPct:0.015},
    {n:"Costa Azzurra EDP",f:"aromatic",g:"u",isoBranded:true,sandalPct:0.012},
    {n:"Neroli Portofino EDP",f:"fresh",g:"u",isoBranded:true,sandalPct:0},
    {n:"Tuscan Leather EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Noir Extreme EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Black Orchid Parfum",f:"oriental",g:"u",isoBranded:true,sandalPct:0.022},
    {n:"Rose Prick EDP",f:"floral",g:"u",isoBranded:true,sandalPct:0.012},
    {n:"Cafe Rose EDP",f:"floral",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Mandarino di Amalfi EDP",f:"fresh",g:"u",isoBranded:true,sandalPct:0},
    {n:"Beau de Jour EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
  ],
  "BondNo9":[
    {n:"Brooklyn EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Signature Scent EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Andy Warhol Silver Factory EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.018},
    {n:"Saks en Rose EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.012},
  ],
  "Creed":[
    {n:"Aventus Cologne",f:"fresh",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Aventus for Her EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
    {n:"Royal Oud EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.022},
    {n:"Original Santal EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.025},
    {n:"Royal Mayfair EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Millesime Imperial EDP",f:"aqua",g:"u",isoBranded:true,sandalPct:0.010},
    {n:"Bois du Portugal EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Virgin Island Water EDP",f:"aqua",g:"u",isoBranded:true,sandalPct:0},
    {n:"Love in White EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
  ],
  "YSL":[
    {n:"L Homme EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"L Homme Le Parfum",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Y Le Parfum",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"La Nuit de l Homme Le Parfum",f:"oriental",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Mon Paris EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Libre Intense EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"Tuxedo EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.015},
  ],
  "Armani":[
    {n:"Acqua di Gio Profumo",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Acqua di Gio Profondo",f:"aqua",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Code Profumo",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Stronger With You Intensely",f:"oriental",g:"m",isoBranded:true,sandalPct:0.022},
    {n:"Stronger With You Absolutely",f:"oriental",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Si EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"My Way EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Code Absolu",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
  ],
  "Versace":[
    {n:"Dylan Blue Pour Femme EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Bright Crystal EDT",f:"floral",g:"f",isoBranded:true,sandalPct:0},
    {n:"Crystal Noir EDT",f:"oriental",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"Eros Parfum",f:"oriental",g:"m",isoBranded:true,sandalPct:0.022},
    {n:"The Dreamer EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Oud Noir EDP",f:"oud",g:"m",isoBranded:true,sandalPct:0.035},
    {n:"Man Eau Fraiche EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
  ],
  "Paco Rabanne":[
    {n:"1 Million Lucky EDT",f:"fresh",g:"m",isoBranded:true,sandalPct:0.012},
    {n:"1 Million Elixir",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Invictus Victory",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Invictus Aqua EDT",f:"aqua",g:"m",isoBranded:true,sandalPct:0},
    {n:"Pure XS EDT",f:"oriental",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Black XS EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Olympea EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.012},
  ],
  "Givenchy":[
    {n:"Gentleman Reserve Privee EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Gentleman EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Gentleman Society EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Pi EDT",f:"sweet",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Ange ou Demon EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"L Interdit Rouge EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
  ],
  "Hugo Boss":[
    {n:"Boss Bottled Night EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Boss Bottled Parfum",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"The Scent Absolute EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Boss Bottled Infinite EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Boss Number One EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
  ],
  "Montblanc":[
    {n:"Legend Spirit EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Explorer Ultra Blue EDP",f:"aqua",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Explorer Platinum EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Legend Night EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Legend Red EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
  ],
  "Calvin Klein":[
    {n:"CK Be EDT",f:"aromatic",g:"u",isoBranded:true,sandalPct:0},
    {n:"Obsession for Men EDT",f:"oriental",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Eternity for Men EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Euphoria Men EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"CK One Gold EDT",f:"aromatic",g:"u",isoBranded:true,sandalPct:0.010},
  ],
  "Davidoff":[
    {n:"Cool Water Intense EDP",f:"aqua",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Cool Water Woman EDT",f:"fresh",g:"f",isoBranded:true,sandalPct:0},
    {n:"Champion EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"The Brilliant Game EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
  ],
  "Jean Paul Gaultier":[
    {n:"Le Male Le Parfum",f:"oriental",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Le Male Elixir",f:"sweet",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Ultra Male Intense",f:"sweet",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Le Beau EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.012},
    {n:"Le Beau Le Parfum",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Scandal Pour Femme EDP",f:"sweet",g:"f",isoBranded:true,sandalPct:0.010},
  ],
  "Bvlgari":[
    {n:"Man Wood Essence EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Man Glacial Essence EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Man in Black Essence EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Le Gemme Tygar EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Le Gemme Man Onekh EDP",f:"oud",g:"m",isoBranded:true,sandalPct:0.035},
    {n:"Aqva Amara EDT",f:"aqua",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Omnia Crystalline EDT",f:"floral",g:"f",isoBranded:true,sandalPct:0},
  ],
  "Hermes":[
    {n:"Terre d Hermes EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Terre d Hermes Parfum",f:"woody",g:"m",isoBranded:true,sandalPct:0.022},
    {n:"Terre d Hermes Eau Intense Vetiver",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"H24 Herbes Vives EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Twilly d Hermes EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
    {n:"Un Jardin sur le Nil EDT",f:"fresh",g:"u",isoBranded:true,sandalPct:0},
  ],
  "Carolina Herrera":[
    {n:"212 VIP Black EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"212 Men EDT",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.010},
    {n:"Bad Boy Cobalt EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Good Girl Supreme EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"Very Good Girl EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
    {n:"CH Men EDT",f:"woody",g:"m",isoBranded:true,sandalPct:0.015},
  ],
  "Parfums de Marly":[
    {n:"Galloway EDP",f:"aromatic",g:"u",isoBranded:true,sandalPct:0.012},
    {n:"Carlisle EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Greenley EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.015},
    {n:"Sedley EDP",f:"aqua",g:"u",isoBranded:true,sandalPct:0.010},
    {n:"Haltane EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Godolphin EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Althair EDP",f:"sweet",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Habdan EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Meliora EDP",f:"sweet",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"Valaya EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
    {n:"Oriana EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
    {n:"Cassili EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.010},
  ],
  "MFK":[
    {n:"Baccarat Rouge 540 Extrait",f:"floral",g:"u",isoBranded:true,sandalPct:0.022},
    {n:"Oud Silk Mood EDP",f:"oud",g:"u",isoBranded:true,sandalPct:0.030},
    {n:"Gentle Fluidity Gold EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.018},
    {n:"Gentle Fluidity Silver EDP",f:"aromatic",g:"u",isoBranded:true,sandalPct:0.015},
    {n:"Amyris Homme EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"L Homme A la Rose EDP",f:"floral",g:"m",isoBranded:true,sandalPct:0.012},
    {n:"Aqua Universalis EDT",f:"fresh",g:"u",isoBranded:true,sandalPct:0},
    {n:"Petit Matin EDP",f:"fresh",g:"u",isoBranded:true,sandalPct:0},
  ],
  "Amouage":[
    {n:"Reflection 45 EDP",f:"floral",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Interlude 53 EDP",f:"oriental",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Jubilation 40 EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.025},
    {n:"Honour Man EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.018},
    {n:"Lyric Man EDP",f:"woody",g:"m",isoBranded:true,sandalPct:0.025},
    {n:"Memoir Man EDP",f:"aromatic",g:"m",isoBranded:true,sandalPct:0.020},
    {n:"Reflection Woman EDP",f:"floral",g:"f",isoBranded:true,sandalPct:0.012},
    {n:"Interlude Woman EDP",f:"oriental",g:"f",isoBranded:true,sandalPct:0.020},
    {n:"Guidance EDP",f:"sweet",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Search EDP",f:"oud",g:"u",isoBranded:true,sandalPct:0.030},
  ],
  "Xerjoff":[
    {n:"Erba Pura EDP",f:"sweet",g:"u",isoBranded:true,sandalPct:0.015},
    {n:"Accento EDP",f:"floral",g:"u",isoBranded:true,sandalPct:0.012},
    {n:"Cruz del Sur II EDP",f:"sweet",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"More than Words EDP",f:"woody",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"40 Knots EDP",f:"aqua",g:"u",isoBranded:true,sandalPct:0.010},
    {n:"Golden Dallah EDP",f:"oud",g:"u",isoBranded:true,sandalPct:0.035},
    {n:"Ivory Route EDP",f:"oriental",g:"u",isoBranded:true,sandalPct:0.020},
    {n:"Torino21 EDP",f:"sweet",g:"u",isoBranded:true,sandalPct:0.015},
  ],
  "Lattafa":[
    {n:"Khamrah Qahwa EDP",f:"sweet",g:"u",isoBranded:false,sandalPct:0.030,isosePct:0},
    {n:"Raghba EDP",f:"sweet",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Raghba Wood Intense EDP",f:"woody",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.012},
    {n:"Fakhar Black EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.022,isosePct:0.010},
    {n:"Fakhar Rose EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
    {n:"Yara Candy EDP",f:"sweet",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
    {n:"Yara Tous EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
    {n:"Mashrabya EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Asad Zanzibar EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.025,isosePct:0.012},
    {n:"Maahir EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.022,isosePct:0.010},
    {n:"Maahir Black EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.025,isosePct:0.012},
    {n:"Najdia EDP",f:"aromatic",g:"m",isoBranded:false,sandalPct:0.018,isosePct:0.008},
    {n:"Velvet Oud EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.040,isosePct:0.015},
    {n:"Nebras EDP",f:"sweet",g:"u",isoBranded:false,sandalPct:0.020,isosePct:0.008},
    {n:"Ana Abiyedh EDP",f:"musky",g:"u",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Eternal Oud EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.035,isosePct:0.015},
  ],
  "Arabian Oud":[
    {n:"Kalemat Amber EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Kalemat Black EDP",f:"woody",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Madawi EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Sahar EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Ghroob EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.022,isosePct:0.010},
    {n:"Resala EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.020,isosePct:0.010},
    {n:"Tharwah Gold EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.035,isosePct:0.012},
  ],
  "Al Haramain":[
    {n:"Amber Oud EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.028,isosePct:0.010},
    {n:"Amber Oud Rouge EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.028,isosePct:0.010},
    {n:"Amber Oud Carbon Edition EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Amber Oud Blue Edition EDP",f:"aqua",g:"m",isoBranded:false,sandalPct:0.015,isosePct:0.008},
    {n:"L Aventure Knight EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.020,isosePct:0.010},
    {n:"Junoon EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Dehn Al Oudh EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.045,isosePct:0.015},
  ],
  "Rasasi":[
    {n:"Hawas Pour Femme EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
    {n:"Hawas Ice EDP",f:"aqua",g:"m",isoBranded:false,sandalPct:0.012,isosePct:0.008},
    {n:"Hawas Fire EDP",f:"woody",g:"u",isoBranded:false,sandalPct:0.018,isosePct:0.010},
    {n:"Daarej EDP",f:"sweet",g:"m",isoBranded:false,sandalPct:0.018,isosePct:0.008},
    {n:"Shuhrah Pour Homme EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.020,isosePct:0.010},
    {n:"Egra EDP",f:"oriental",g:"m",isoBranded:false,sandalPct:0.020,isosePct:0.008},
    {n:"Blue Lady EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
    {n:"Afshan EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.022,isosePct:0.008},
  ],
  "Swiss Arabian":[
    {n:"Shaghaf Oud EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.030,isosePct:0.012},
    {n:"Shaghaf Oud Maliki EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.032,isosePct:0.012},
    {n:"Casablanca EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Rasheeqa EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Layali EDP",f:"oriental",g:"f",isoBranded:false,sandalPct:0.020,isosePct:0.008},
    {n:"Mukhallat Malaki EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.035,isosePct:0.012},
  ],
  "Ajmal":[
    {n:"Amber Wood EDP",f:"oriental",g:"u",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Aristocrat EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.020,isosePct:0.010},
    {n:"Carbon EDP",f:"aromatic",g:"m",isoBranded:false,sandalPct:0.015,isosePct:0.008},
    {n:"Wisal Dhahab EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Blu EDP",f:"aqua",g:"m",isoBranded:false,sandalPct:0.012,isosePct:0.008},
    {n:"Dahn Al Oudh Moattaq EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.045,isosePct:0.015},
    {n:"Aurum EDP",f:"floral",g:"f",isoBranded:false,sandalPct:0.012,isosePct:0},
  ],
  "Abdul Samad Al Qurashi":[
    {n:"Safari Extreme EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.040,isosePct:0.015},
    {n:"Blue Oud EDP",f:"woody",g:"m",isoBranded:false,sandalPct:0.025,isosePct:0.010},
    {n:"Majmoua EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.035,isosePct:0.012},
    {n:"Dahn Al Oudh Cambodi EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.045,isosePct:0.015},
    {n:"Musk Ghazal EDP",f:"musky",g:"u",isoBranded:false,sandalPct:0.015,isosePct:0},
  ],
  "Kayali":[
    {n:"Yum Pistachio Gelato 33 EDP",f:"sweet",g:"f",isoBranded:false,sandalPct:0.020,isosePct:0},
    {n:"Sweet Diamond Pink Pepper 25 EDP",f:"sweet",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Lovefest Burning Cherry 42 EDP",f:"sweet",g:"f",isoBranded:false,sandalPct:0.015,isosePct:0},
    {n:"Oudgasm Oud Maracuja 30 EDP",f:"oud",g:"u",isoBranded:false,sandalPct:0.035,isosePct:0.012},
  ],
};
// دمج العطور الإضافية في الماركات (تجاهل المكرر بالاسم)
function mergeExtraPerfumes(){
  Object.keys(EXTRA_PERFUMES).forEach(bk=>{
    const brand = BRANDS.find(b => b.b === bk);
    if(!brand) return;
    EXTRA_PERFUMES[bk].forEach(it=>{ if(!brand.items.find(x => x.n === it.n)) brand.items.push(it); });
  });
}
mergeExtraPerfumes();

const CONCS = [
  {id:"cologne", ar:"كولونيا",       pct:0.03, dur:"2-3 ساعات",  color:"#6eb5c8"},
  {id:"edt",     ar:"توايليت EDT",   pct:0.10, dur:"4-6 ساعات",  color:"#c8a96e"},
  {id:"edp",     ar:"بيرفيوم EDP",   pct:0.18, dur:"6-8 ساعات",  color:"#c87a6e"},
  {id:"parfum",  ar:"بارفان Parfum", pct:0.28, dur:"8-12 ساعة",  color:"#9e6ec8"},
];

const SIZES = [10, 30, 50, 100, 200];

const GRADES = [
  {id:"a", label:"Grade A", ar:"درجة اولى",   desc:"مركز 95-100% — موردين متخصصين",         color:"#6ec878", price:"15-30 د.ك / 50ج",    mult:1.00, e:"💎"},
  {id:"b", label:"Grade B", ar:"درجة ثانية",  desc:"مخفف 30-40% — محلات متخصصة",           color:"#c8a96e", price:"8-15 د.ك / 50ج",     mult:1.30, e:"🥈"},
  {id:"c", label:"Grade C", ar:"درجة ثالثة",  desc:"مخفف 50-60% — السوق العام بالكويت",    color:"#c8846e", price:"2-5 د.ك / 50ج",      mult:1.56, e:"🥉"},
  {id:"d", label:"Grade D", ar:"درجة رابعة",  desc:"مخفف 70%+ — بسطات رخيصة",             color:"#e87777", price:"اقل من 2 د.ك / 50ج", mult:2.00, e:"⚠"},
];

const IMETA = {
  oil:     {label:"زيت العطر",    color:"#c8a96e"},
  sandal:  {label:"زيت الصندل",  color:"#c8846e"},
  isose:   {label:"Isose Super", color:"#9e6ec8"},
  dpg:     {label:"DPG",         color:"#c8a06e"},
  ipm:     {label:"IPM مخفف زيتي", color:"#b39ddb"},
  water:   {label:"ماء مقطر",     color:"#6ec8e8"},
  alcohol: {label:"كحول عطري",   color:"#6e8fc8"},
};

// ميل كل عائلة لحدة الكحول (Alcohol Sting): + يزيد الحدة، − يكسرها
const STING_FAM = {
  fresh:   +2,  // منعش خفيف يطلق الكحول
  aqua:    +2,  // مائي/حمضي يضاعف الحدة
  aromatic:+1,  // أعشاب خضراء تتبخر مع الكحول
  floral:   0,  // محايد
  woody:   -1,  // خشبي يبطّئ التبخر
  sweet:   -1,  // راتنجي/فانيلي يلطّف
  musky:   -2,  // المسك يلتصق بالكحول ويبطئه
  oriental:-2,  // راتنجات وعنبر تكسر الحدة
  oud:     -2,  // زيوت ثقيلة تكسر تبخر الكحول
};

const SEASONS = [
  {id:"all",    ar:"كل الاوقات", e:"🗓"},
  {id:"summer", ar:"صيف",        e:"☀"},
  {id:"winter", ar:"شتاء",       e:"❄"},
  {id:"both",   ar:"للجميع",     e:"🌤"},
];

const CATS = [
  {id:"all", ar:"الكل"},
  {id:"🌍",  ar:"🌍 غربي"},
  {id:"🌙",  ar:"🌙 خليجي"},
  {id:"✨",  ar:"✨ نيش"},
  {id:"⭐",  ar:"⭐ ماركاتي"},
];

const GENDERS = [
  {id:"all", ar:"الكل",      e:"👤"},
  {id:"m",   ar:"رجالي",     e:"👨"},
  {id:"f",   ar:"نسائي",     e:"👩"},
  {id:"u",   ar:"يونيسكس",  e:"🌐"},
];

// ═══════════════════════════════════════════════════
// تقدير السعر التقريبي للعطر الأصلي في السوق الكويتي (د.ك)
// PRICE_BRAND = سعر مرجعي لحجم 100مل بتركيز EDP — مُعاير من متاجر كويتية
// ═══════════════════════════════════════════════════
const PRICE_BRAND = {
  "Dior":45, "Chanel":50, "Tom Ford":95, "BondNo9":100, "Creed":95, "YSL":42, "Armani":40,
  "Versace":32, "Paco Rabanne":33, "Givenchy":38, "Hugo Boss":30, "Montblanc":28, "Calvin Klein":24,
  "Davidoff":22, "Jean Paul Gaultier":38, "Bvlgari":38, "Hermes":46, "Carolina Herrera":38,
  "Parfums de Marly":72, "MFK":95, "Amouage":130, "Xerjoff":130,
  "Lattafa":9, "Arabian Oud":26, "Al Haramain":14, "Rasasi":16, "Swiss Arabian":14, "Ajmal":18,
  "Abdul Samad Al Qurashi":35, "Kayali":40,
};
const PRICE_CAT_FALLBACK = { "🌍":35, "✨":110, "🌙":14, "⭐":30 }; // حسب الفئة لو الماركة غير معروفة
const PRICE_DEFAULT = 30;
// معامل التركيز (مستنتج من اسم العطر)
function priceConcFactor(name){
  const n = (name||"").toLowerCase();
  if(/cologne/.test(n)) return 0.62;
  if(/(parfum|elixir|extrait|intense|absolu|absolutely|exclusif|le parfum|profumo|profondo|essence)/.test(n)) return 1.18;
  if(/(edt|toilette)/.test(n)) return 0.72;
  return 1.0; // EDP / افتراضي
}
// معامل الحجم نسبةً لـ 100مل (الأصغر أغلى للملل)
const PRICE_SIZE_FACTOR = { 30:0.45, 50:0.66, 75:0.82, 100:1.0, 125:1.18, 200:1.52 };
// الأحجام المتوفرة عادةً حسب الفئة
function retailSizesFor(cat){
  if(cat === "🌙") return [30, 50, 100];        // خليجي
  if(cat === "✨") return [50, 75, 100, 125];    // نيش
  return [30, 50, 100, 200];                      // غربي / افتراضي
}

// custom (user-added) brands, persisted in localStorage
let CUSTOM = [];
