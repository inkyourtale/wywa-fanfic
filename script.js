// Phone interface
const $ = (s) => document.querySelector(s),
  P = $("#phone"),
  A = $("#app"),
  H = $("#home"),
  LK = $("#lock");
const EXT = "png";
const NM = {
  appstore: "App Store",
  camera: "Camera",
  contacts: "Contacts",
  mail: "Mail",
  maps: "Maps",
  messages: "Messages",
  notes: "Notes",
  phone: "Phone",
  photos: "Photos",
  reminders: "Reminders",
  safari: "Safari",
  settings: "Settings",
  weather: "Weather",
  calendar: "Calendar",
  instagram: "Instagram",
  X: "X",
};
const IC = {
  appstore: "#1a8cff",
  camera: "#8e8e93",
  contacts: "#c7c7cc",
  mail: "#2f8cff",
  maps: "#34c759",
  messages: "#30d158",
  notes: "#ffd60a",
  phone: "#30d158",
  photos: "#fff",
  reminders: "#fff",
  safari: "#0a84ff",
  settings: "#8e8e93",
  weather: "#3a8de0",
  calendar: "#fff",
  instagram:
    "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)",
  X: "#fff",
};
const appIconPath = (name) => `icons/${({appstore:"Appstore", maps:"Maps", phone:"Phone"})[name] || name}.${EXT}`;
const ap = (n) =>
  `<button class="ap" onclick="openApp('${n}',this)"><span class="ico" style="--c:${IC[n]}"><img src="${appIconPath(n)}" alt="" onerror="this.remove()"></span><i>${NM[n]}</i></button>`;
H.innerHTML = `<div class="gr">${["calendar", "photos", "camera", "maps", "weather", "reminders", "notes", "contacts", "appstore", "settings"].map(ap).join("")}</div><div class="sp gl">Search</div><div class="dk gl">${["phone", "safari", "messages", "mail"].map(ap).join("")}</div>`;

/* ---------- no zoom + fit to screen ---------- */
["gesturestart", "gesturechange", "dblclick"].forEach((e) =>
  document.addEventListener(e, (x) => x.preventDefault()),
);
document.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) e.preventDefault();
  },
  { passive: false },
);
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) e.preventDefault();
  },
  { passive: false },
);
const mobileLayout = window.matchMedia("(max-width: 600px), (hover: none) and (pointer: coarse)");
function fit() {
  const viewportHeight = window.visualViewport?.height || innerHeight;
  document.documentElement.style.setProperty("--app-height", `${Math.round(viewportHeight)}px`);
  P.style.transform = mobileLayout.matches
    ? "none"
    : `scale(${Math.min(1, (innerHeight - 30) / 874, (innerWidth - 30) / 402)})`;
}
fit();
window.addEventListener("resize", fit);
window.visualViewport?.addEventListener("resize", fit);
window.addEventListener("pageshow", fit);
if (mobileLayout.addEventListener) mobileLayout.addEventListener("change", fit);
if (navigator.standalone || window.matchMedia("(display-mode: standalone)").matches) {
  document.documentElement.classList.add("standalone-app");
}

/* ---------- lock screen ---------- */
let code = "",
  unl = 0,
  y0 = 0;
LK.onpointerdown = (e) => (y0 = e.clientY);
LK.onpointerup = (e) => {
  if (y0 - e.clientY > 70) showPass();
};
const showPass = () => {
  if (!unl) $("#pc").classList.add("on");
};
const dots = () => {
  $("#dots").innerHTML = [0, 1, 2, 3]
    .map((i) => `<s class="${i < code.length ? "f" : ""}"></s>`)
    .join("");
  $("#del").textContent = code ? "Delete" : "Cancel";
};
function key(k) {
  if (code.length >= 4) return;
  code += k;
  dots();
  if (code.length == 4)
    setTimeout(() => {
      if (code == "9194") unlock();
      else {
        const d = $("#dots");
        d.classList.add("shake");
        setTimeout(() => {
          code = "";
          dots();
          d.classList.remove("shake");
        }, 450);
      }
    }, 150);
}
function del() {
  if (code) {
    code = code.slice(0, -1);
    dots();
  } else $("#pc").classList.remove("on");
}
function unlock() {
  unl = 1;
  LK.style.transform = "translateY(-100%)";
  LK.style.pointerEvents = "none";
}
function torch(b) {
  b.classList.toggle("on");
  $("#glow").classList.toggle("on");
}
dots();
$("#hi").onclick = () => {
  if (A.classList.contains("on")) closeApp();
  else showPass();
};
function toast(t) {
  const e = $("#ts");
  e.textContent = t;
  e.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("on"), 1600);
}

/* ---------- app shell ---------- */
let st = [],
  ms,
  sel = -1,
  cm = 2,
  cs = 29;
function paint() {
  A.innerHTML = st[st.length - 1]();
  A.scrollTop = 0;
  P.classList.toggle("lt", !A.querySelector(".fx"));
}
function openApp(n, el) {
  const r = el.getBoundingClientRect(),
    p = P.getBoundingClientRect();
  A.style.transformOrigin = `${((r.left + r.width / 2 - p.left) / p.width) * 100}% ${((r.top + r.height / 2 - p.top) / p.height) * 100}%`;
  st = [ROOT[n]];
  A.classList.add("on");
  paint();
}
function go(f) {
  st.push(f);
  paint();
}
function back() {
  st.pop();
  st.length ? paint() : closeApp();
}
function closeApp() {
  A.classList.remove("on");
  P.classList.remove("lt");
  ms && ms.getTracks().forEach((t) => t.stop());
  ms = 0;
  st = [];
}
const hd = (t, b) =>
  `<div class="hd">${b ? `<button class="bk" onclick="back()">‹ ${b}</button>` : ""}<h1>${t}</h1></div>`;
const rows = (a, f) => `<div class="cd">${a.map(f).join("")}</div>`;
const av = (n, s) =>
  `<span class="av" style="width:${s}px;height:${s}px;font-size:${s * 0.42}px;background:hsl(${(n.charCodeAt(0) * 47) % 360} 35% 60%)">${n[0]}</span>`;

/* ---------- data (edit freely) ---------- */
const CT = [
  ["Bae Joohyun", "011-329 9194", "My Card"],
  ["Dr. Min", "013-446 7290"],
  ["Grandma", "012-338 0417"],
  ["Grandpa", "012-338 0418"],
  ["Hospital", "82-5521 8800"],
  ["Joy", "017-556 0132"],
  ["Seulgi", "016-229 4781"],
  ["Seungwan 🩵", "011-221 9491", "Favourite · Emergency contact"],
  ["Yeri", "011-287 3650"],
];
const CL = [
  ["Seungwan 🩵", "in", "1:48 AM"],
  ["Yeri", "miss", "Yesterday"],
  ["Seulgi", "out", "Yesterday"],
  ["Yeri", "in", "Wednesday"],
  ["Joy", "miss", "Tuesday"],
  ["Seungwan 🩵", "in", "Tuesday"],
  ["Seungwan 🩵", "miss", "Tuesday"],
  ["Seungwan 🩵", "in", "Monday"],
  ["Seungwan 🩵", "in", "Monday"],
  ["Seungwan 🩵", "out", "Sunday"],
  ["Seungwan 🩵", "miss", "Sunday"],
];
const CI = { in: "↙ Incoming", out: "↗ Outgoing", miss: "↙ Missed" };
const MS = [
  [
    "Seungwan 🩵",
    "1:12 AM",
    [
      ["s", "Supplier thing all ok?"],
      ["r", "Eventually. Counting it as a win."],
      ["r", "How was the hospital??"],
      ["s", "Fine. I am walking to the river."],
      ["r", "It is raining there."],
      ["s", "I noticed."],
      ["t", "12:40 PM"],
      ["r", "have you had lunch?"],
      ["s", "Going in a bit."],
      ["s", "you?"],
      ["r", "Still in the meeting."],
      ["r", "keep thinking about you"],
      ["s", "About What?"],
      ["r", "Nothing. Just miss you"],
      ["s", "I miss you too."],
      ["r", "Shall we go out for a date?"],
      ["r", "I mean after work. Let me take you out"],
      ["s", "on a date?"],
      ["r", "Yeah. Dinner, just us"],
      ["r", "And maybe we could stay at a hotel after. If you want."],
      ["s", "You've been looking at hotels, haven't you?"],
      ["r", "A few"],
      ["s", "Send me the one you like."],
      ["r", "https://www.riversidehotel.com/lindenwell"],
      ["s", "A few"],
      ["r", "Haven't booked anything yet."],
      ["s", "Book it. But somewhere close for dinner, okay?"],
      ["s", "I don’t want to spend half the night in the car."],
      ["r", "Ther's a restaurant downstairs."],
      ["s", "Of course you checked"],
      ["r", "So that’s a yes to both?"],
      ["s", "Yes. I’d like a night with you."],
      ["r", "Can’t wait to see you."],
      ["s", " Me too"],
      ["s", "noe let me finish these notes so I can leave on time"],
      ["r", "Okay baby. love you"],
      ["s", "Love you too."],
      ["t", "06:25 PM"],
      ["r", "Sorry, barely moving"],
      ["r", "There’s an accident ahead. Rain’s making everything worse"],
      ["s", "Go straight to the hotel. I’ll take the train"],
      ["r", "No. Stay inside. I'm coming"],
      ["s", "You’d have to come all this way just to turn around."],
      ["s", "It’s four stops. I’ll meet you there"],
      ["r", "You sure? It’s pouring."],
      [
        "s",
        "I’ve got an umbrella. We’re eating downstairs anyway, aren’t we?",
      ],
      ["s", "I’ll wait in the room if I get there first."],
      ["r", "Okay. Text me when you get there."],
      ["s", "I will. Stop texting in traffic"],
    ],
  ],
  [
    "Seulgi",
    "Yesterday",
    [
      ["r", "Did the council letter come?"],
      ["s", "This morning. I am registered."],
      ["r", "Told you. Dinner is on me."],
      ["s", "Already booked. Dinner with Seungwan."],
      ["r", "Oh. Okay. Tell me everything after."],
    ],
  ],
  [
    "Yeri",
    "Yesterday",
    [
      ["r", "Unnie, are you on night shift again?"],
      ["s", "Sunday night."],
      ["r", "Sleep. Actual sleep."],
      ["s", "I will."],
      ["r", "You will not."],
    ],
  ],
  [
    "Joy",
    "Wednesday",
    [
      ["r", "House viewing is Saturday at 11. I will send the address."],
      ["s", "Thanks. Is it the Lindenwell side?"],
      ["r", "Yes, near the river."],
      ["s", "Okay. I will be there."],
    ],
  ],
  [
    "Grandma",
    "Tuesday",
    [
      ["r", "Have you eaten?"],
      ["s", "Yes, Grandma."],
      ["r", "Come on Sunday. I made too much soup."],
      ["s", "I will come after my shift."],
    ],
  ],
  [
    "Dr. Min",
    "Monday",
    [
      ["r", "Your follow up is moved to Thursday, 3 PM."],
      ["s", "Noted. Thank you, Doctor."],
      ["r", "Bring your records."],
    ],
  ],
];
const ML = [
  [
    "National Medical Council",
    "Issuance of Certificate of Registration",
    "Yesterday",
    "Dear Dr. Bae Joohyun,<br><br>Your application has been approved and your name has been entered in the Register of Medical Practitioners. Your Certificate of Registration is attached to this message. Please keep a copy for your employer and present it when asked.<br><br>Registrar's Office<br>National Medical Council",
  ],
  [
    "Municipal Office",
    "ID collection notice",
    "Monday",
    "Dear Resident,<br><br>Your identity card is ready for collection at the Municipal Office counter. Please bring this notice and one other form of identification.<br><br>Counter hours: Monday to Friday, 9:00 AM to 4:30 PM. Cards not collected within 30 days are returned for reprocessing.<br><br>Municipal Office",
  ],
];
const PL = [
  ["Riverside Hotel", "Hotel", 30, 38],
  ["Train Station", "Transit station", 62, 22],
  ["Forest Residence", "Residential", 16, 70],
  ["Municipal Office", "Government office", 72, 52],
  ["Shon Residences", "Residential", 44, 64],
  ["Bakery", "Bakery", 56, 40],
  ["Riverside Lindenwell", "Neighbourhood", 36, 24],
  ["Lindenwell Medical Centre", "Hospital", 80, 78],
];
const NT = [
  [
    "Things I noticed about Seungwan",
    "29 Mar",
    "She holds the cup with both hands even when it is empty. She taps the table twice before answering a question she has already thought about. She apologised to the waiter because it was raining.<br><br>I keep a list of these. I do not know when I started.",
  ],
  [
    "Before dinner",
    "28 Mar",
    "Pick up the tart from the bakery by the station. Wear the grey coat, it is still raining. Call Dr. Min back before seven. Ask Seungwan what she wants to drink before I order for her.",
  ],
  [
    "Night shift",
    "27 Mar",
    "Left the ward at 6:40. Walked to the river because the bus was late. Seungwan texted at 1:12. I read it three times and did not answer until I got home. Typed a reply, deleted it, typed it again.",
  ],
];
const RM = [
  ["Today", "Dinner with Seungwan", "7:00 PM"],
  ["Saturday", "House viewing", "11:00 AM"],
  ["Sunday", "Work night shift", "10:00 PM"],
];
const SH = [
  "lindenwell medical centre night shift",
  "riverside lindenwell apartments for rent",
  "seungwan shon group",
  "bakery near lindenwell train station",
  "municipal office id collection hours",
  "what to bring to a first family dinner",
];
const WK = [
  ["Fri", "🌧", "22", "27"],
  ["Sat", "⛅", "23", "29"],
  ["Sun", "☀️", "24", "31"],
  ["Mon", "☀️", "24", "32"],
  ["Tue", "🌦", "23", "30"],
  ["Wed", "⛈", "22", "28"],
  ["Thu", "⛅", "23", "30"],
];
const MN = ["January", "February", "March", "April"];
const EV = {
  "1-21": [["Seungwan's birthday", "All day"]],
  "2-29": [
    ["Joohyun's birthday", "All day"],
    ["Dinner with Seungwan", "7:00 PM · Reminders"],
  ],
  "2-30": [["House viewing", "11:00 AM · Reminders"]],
  "2-31": [["Work night shift", "10:00 PM · Reminders"]],
};
const PH = Array.from({ length: 15 }, (_, i) => `photos/${i + 1}.jpg`);

/* ---------- views ---------- */
function contacts() {
  return (
    hd("Contacts") +
    `<div class="bd"><div class="cd" style="margin-bottom:18px"><div class="rw" onclick="go(()=>cd(0))">${av("B", 58)}<div><b style="font-size:20px">Bae Joohyun</b><div class="sub">My Card</div></div></div></div>` +
    rows(
      CT.slice(1),
      (c, i) =>
        `<div class="rw" onclick="go(()=>cd(${i + 1}))">${av(c[0], 38)}<div><b>${c[0]}</b>${c[2] ? `<div class="sub">${c[2]}</div>` : ""}</div></div>`,
    ) +
    "</div>"
  );
}
function cd(i) {
  const c = CT[i];
  return `<div class="hd"><button class="bk" onclick="back()">‹ Contacts</button></div><div class="bd" style="text-align:center">${av(c[0], 104)}<h2 class="text-[28px] font-semibold mt-3">${c[0]}</h2>${c[2] ? `<div class="sub">${c[2]}</div>` : ""}<div class="flex justify-center gap-3 my-5"><button class="ab" onclick="toast('Message ${c[1]}')">Message</button><button class="ab" onclick="toast('Calling ${c[1]}')">Call</button></div><div class="cd" style="text-align:left"><div class="rw" style="display:block"><div class="sub">mobile</div><span style="color:#0a84ff">${c[1]}</span></div></div></div>`;
}
function phone() {
  return (
    hd("Recents") +
    `<div class="bd">${rows(CL, (c) => `<div class="rw" onclick="toast('Calling ${c[0]}')"><div style="flex:1"><b style="${c[1] == "miss" ? "color:#ff3b30" : ""}">${c[0]}</b><div class="sub">${CI[c[1]]}</div></div><span class="sub">${c[2]}</span></div>`)}</div>`
  );
}
function messages() {
  return (
    hd("Messages") +
    `<div class="bd">${rows(MS, (m, i) => `<div class="rw" onclick="go(()=>thr(${i}))">${av(m[0], 46)}<div style="flex:1;min-width:0"><div class="flex justify-between"><b>${m[0]}</b><span class="sub">${m[1]}</span></div><div class="sub tr">${m[2][m[2].length - 1][1]}</div></div></div>`)}</div>`
  );
}
function thr(i) {
  const m = MS[i];
  return `<div class="message-thread"><div class="message-header"><button class="bk" onclick="back()">‹</button><div style="display:inline-block">${av(m[0], 44)}</div><div class="text-xs mt-1">${m[0]}</div></div><div class="message-history">${m[2].map((x) => (x[0] === "t" ? `<div class="message-time">${x[1]}</div>` : `<div class="bb ${x[0]}">${x[1]}</div>`)).join("")}</div><div class="message-composer"><div class="ib">iMessage</div></div></div>`;
}
function mail() {
  return mailHome();
}
function md(i) {
  return mailReader(i);
}
function maps() {
  return renderDetailedMap();
}
function notes() {
  return notesHome();
}
function nd(i) {
  return notesReader(notesAll()[i].id);
}
function reminders() {
  return `<div class="hd"><h1 style="color:#ff9f0a">Reminders</h1></div><div class="bd">${RM.map((r) => `<div class="sub" style="margin:14px 4px 6px;font-weight:600">${r[0]}</div>` + rows([r], (x) => `<div class="rw" onclick="this.firstChild.classList.toggle('dn')"><span class="ck"></span><div style="flex:1"><b style="font-weight:500">${x[1]}</b><div class="sub">${x[2]}</div></div></div>`)).join("")}</div>`;
}
function safari() {
  return safariStart();
}
function weather() {
  return weatherView();
}
function calendar() {
  return calendarView();
}
function mv(d) {
  calendarMove(d);
}
function photos() {
  return galleryHome();
}
function pv(p) {
  return galleryViewer(p);
}
function camera() {
  setTimeout(
    () =>
      navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((s) => {
          if (!A.classList.contains("on") || !$("#cv"))
            return s.getTracks().forEach((t) => t.stop());
          ms = s;
          $("#cv").srcObject = s;
        })
        .catch(() => {}),
    60,
  );
  return `<div class="fx" style="background:#000"><video id="cv" autoplay playsinline muted style="position:absolute;top:110px;left:0;width:100%;height:540px;object-fit:cover;transform:scaleX(-1);background:#111;border-radius:22px"></video><div style="position:absolute;bottom:150px;left:0;right:0;display:flex;justify-content:center;gap:26px;font-size:13px;font-weight:600"><span style="opacity:.6">VIDEO</span><span style="color:#ffd60a">PHOTO</span><span style="opacity:.6">PORTRAIT</span></div><button onclick="flash()" style="position:absolute;bottom:62px;left:50%;margin-left:-37px;width:74px;height:74px;border-radius:50%;background:#fff;border:4px solid #000;box-shadow:0 0 0 3px #fff"></button><div id="fl" style="position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .2s;pointer-events:none"></div></div>`;
}
function flash() {
  const f = $("#fl");
  f.style.opacity = 1;
  setTimeout(() => (f.style.opacity = 0), 120);
}
function settings() {
  return settingsHome();
}
function appstore() {
  return `<div class="hd"><div class="sub" style="font-weight:600">Friday 29 March</div><h1>Today</h1></div><div class="bd">${[
    [
      "Plan your week",
      "Calendar, Reminders and Notes working together",
      "#ff9f6b,#e0457b",
    ],
    [
      "Find your way",
      "Get around town without the wrong turns",
      "#6bd4ff,#3a6df0",
    ],
  ]
    .map(
      (c) =>
        `<div class="ts" style="--a:${c[2]}"><b style="font-size:26px;line-height:1.1">${c[0]}</b><span style="opacity:.9;margin-top:4px">${c[1]}</span></div>`,
    )
    .join("")}</div>`;
}
const ROOT = {
  contacts,
  phone,
  messages,
  mail,
  maps,
  notes,
  reminders,
  safari,
  weather,
  calendar,
  photos,
  camera,
  settings,
  appstore,
};

// Phone interface
const PIC = {
  "Bae Joohyun": "imgwr.jpg",
  Seungwan: "imgwen.jpg",
  Yeri: "imgyr.jpg",
  Seulgi: "imgseul.jpg",
  Joy: "imgjoy.jpg",
};
function pics() {
  document.querySelectorAll("#app .av").forEach((a) => {
    let e = a.parentElement,
      t = null;
    for (let i = 0; i < 3 && e && !t; i++, e = e.parentElement)
      t = e.querySelector("b,h2,.text-xs");
    if (!t) return;
    const url = PIC[t.textContent.replace(/[^A-Za-z. ]/g, "").trim()];
    if (!url) return;
    const im = new Image();
    im.onload = () => {
      a.style.background = `url(${url}) center/cover`;
      a.style.color = "transparent";
    };
    im.src = url;
  });
}
const _paint = paint;
paint = function () {
  _paint();
  pics();
};

// Phone interface
(function () {
  const box = document.createElement("div");
  box.id = "nt";
  $("#phone").appendChild(box);

  const N = [
    {
      k: "messages",
      c: "#30d158",
      t: "Seungwan 🩵",
      b: "Can't wait to see you!",
      d: 1400,
    },
    {
      k: "instagram",
      c: "#e1306c",
      t: "Instagram",
      b: "seungwan.s liked your photo.",
      d: 3600,
    },
    {
      k: "X",
      c: "#fff",
      t: "X",
      b: "Lindenwell Weather: Heavy rain expected until morning.",
      d: 5800,
    },
  ];

  function kill(e) {
    if (!e.parentNode || e.classList.contains("out")) return;
    e.classList.add("out");
    setTimeout(() => e.remove(), 350);
  }

  function openN(n, e) {
    if (n.k == "messages") {
      openApp("messages", e);
      go(() => thr(0));
    } else if (ROOT[n.k]) openApp(n.k, e);
    else toast(n.t + " app coming soon");
  }

  function show(n) {
    if (
      typeof phoneSettings !== "undefined" &&
      !phoneSettings.notifications
    )
      return;
    if (n.k == "messages") {
      MS[0][2].push(["r", "Can't wait to see you!"]);
      MS[0][1] = "2:21 AM";
    }
    const e = document.createElement("div");
    e.className = "nb";
    e.innerHTML = `<div class="ni" style="--c:${n.c}"><img src="icons/${n.k}.${EXT}" alt="" onerror="this.remove()"></div><div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between"><b>${n.t}</b><small>now</small></div><span>${n.b}</span></div>`;
    let y0 = 0,
      sw = 0;
    e.onpointerdown = (ev) => {
      y0 = ev.clientY;
      sw = 0;
    };
    e.onpointerup = (ev) => {
      if (y0 - ev.clientY > 20) {
        sw = 1;
        kill(e);
      }
    };
    e.onclick = () => {
      if (sw) return;
      openN(n, e);
      kill(e);
    };
    box.appendChild(e);
    setTimeout(() => kill(e), 5500);
  }

  const u = unlock;
  unlock = function () {
    u();
    N.forEach((n) => setTimeout(() => show(n), n.d));
  };
})();

// Phone interface
(function () {
  Object.assign(NM, { instagram: "Instagram", X: "𝕏" });
  Object.assign(IC, { instagram: "#e1306c", X: "#fff" });
  document
    .querySelector(".gr")
    .insertAdjacentHTML("beforeend", ap("instagram") + ap("X"));
  ROOT.instagram = () => instagram();
  ROOT.X = () => xApp();
})();

// ./src/maps.js
/* Illustrated Lindenwell map; all routes are local previews. */
const mapUI = { query: '', category: 'All', zoom: 1, muted: false, route: false, saved: new Set() };
const mapSymbols = ['▣', '▤', '⌂', '▥', '⌂', '♨', '♧', '+'];
const mapColors = ['#ad72c5', '#5386ca', '#8499a5', '#818da4', '#8499a5', '#de9846', '#6fa582', '#e0717b'];
const mapCategories = ['Stay', 'Transit', 'Home', 'Civic', 'Home', 'Food', 'Parks', 'Health'];
const mapEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function mapMatches() {
  return PL.map((p, i) => i).filter(i => (mapUI.category === 'All' || mapCategories[i] === mapUI.category) && `${PL[i][0]} ${PL[i][1]}`.toLowerCase().includes(mapUI.query.toLowerCase()));
}
function mapSelect(i) { sel = i; mapUI.route = false; paint(); }
function mapCategory(category) { mapUI.category = category; sel = -1; mapUI.route = false; paint(); }
function mapSearch(value) {
  mapUI.query = value;
  sel = -1;
  mapUI.route = false;
  document.querySelector('.maps-results').innerHTML = mapResults();
  document.querySelectorAll('.maps-marker').forEach(marker => {
    marker.hidden = !mapMatches().includes(Number(marker.dataset.place));
    marker.classList.remove('is-selected');
  });
  document.querySelector('.maps-route')?.remove();
}
function mapZoom(step) {
  mapUI.zoom = Math.max(1, Math.min(1.8, mapUI.zoom + step));
  document.querySelector('.maps-world').style.transform = `scale(${mapUI.zoom})`;
}
function mapLocate() {
  mapUI.zoom = 1.35;
  document.querySelector('.maps-world').style.transform = 'scale(1.35) translate(3%, -7%)';
  toast('Centered on your Lindenwell location');
}
function mapSave() {
  mapUI.saved.has(sel) ? mapUI.saved.delete(sel) : mapUI.saved.add(sel);
  paint();
}
function mapResults() {
  if (sel >= 0) {
    const p = PL[sel], saved = mapUI.saved.has(sel);
    return `<div class="maps-detail"><div class="maps-detail-heading"><div><h2>${mapEscape(p[0])}</h2><div class="sub">${mapEscape(p[1])} · Lindenwell</div></div><button class="maps-close" aria-label="Close place" onclick="sel=-1;mapUI.route=false;paint()">×</button></div><p>${mapUI.route ? 'Route preview · From your location<br>Follow the blue line to your destination.' : 'Explore the riverside neighbourhood and nearby places.'}</p><div class="maps-actions"><button onclick="mapUI.route=!mapUI.route;paint()">${mapUI.route ? 'End preview' : '↗ Preview route'}</button><button onclick="mapSave()">${saved ? '✓ Saved' : '+ Save place'}</button></div><p>Illustrated map · Route previews are not for navigation.</p></div>`;
  }
  const matches = mapMatches();
  return `<div class="maps-section-title"><h2>${mapUI.query ? 'Search results' : mapUI.category === 'All' ? 'Explore nearby' : mapUI.category}</h2><span>${matches.length} places</span></div>${matches.map(i => `<button class="maps-place" onclick="mapSelect(${i})"><span class="maps-place-icon" style="--pin:${mapColors[i]}">${mapSymbols[i]}</span><span class="maps-place-text"><b>${mapEscape(PL[i][0])}</b><small>${mapEscape(PL[i][1])} · Lindenwell${mapUI.saved.has(i) ? ' · Saved' : ''}</small></span><span>›</span></button>`).join('') || '<p class="maps-empty">No places found. Try another name or category.</p>'}`;
}
function renderDetailedMap() {
  const blocks = Array.from({length: 64}, (_, i) => {
    const x = 14 + (i % 8) * 51, y = 80 + Math.floor(i / 8) * 68;
    return `<rect x="${x}" y="${y}" width="${22 + i % 3 * 5}" height="${25 + i % 4 * 4}" rx="3" fill="${i % 3 ? '#deded6' : '#d5dace'}" stroke="#d0d2c8" stroke-width=".6"/>`;
  }).join('');
  const streets = 'M0 157H430 M0 291H430 M0 430H430 M0 565H430 M54 0V700 M155 0V700 M260 0V700 M365 0V700 M0 640L430 115';
  const route = mapUI.route && sel >= 0 ? `<path class="maps-route" d="M202 399 L202 430 L${PL[sel][2] * 4.3} 430 L${PL[sel][2] * 4.3} ${PL[sel][3] * 7}" fill="none" stroke="#1688ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : '';
  const matches = mapMatches();
  return `<section class="maps-screen${mapUI.muted ? ' is-muted' : ''}" aria-label="Lindenwell Maps">
    <div class="maps-canvas"><div class="maps-world" style="transform:scale(${mapUI.zoom})">
      <svg viewBox="0 0 430 700" preserveAspectRatio="none" aria-hidden="true">
        <rect width="430" height="700" fill="#eae9e1"/>${blocks}
        <path d="M0 85Q60 60 123 94L133 213 18 237 0 216Z M294 480Q330 447 430 468V650L316 625Z" fill="#c9ddbe"/>
        <path d="M-30 330C65 266 97 375 192 331S315 256 460 312" fill="none" stroke="#98c9db" stroke-width="51"/>
        <path d="M-30 330C65 266 97 375 192 331S315 256 460 312" fill="none" stroke="#b4d9e5" stroke-width="43"/>
        <path d="${streets}" fill="none" stroke="#d0d0c6" stroke-width="13"/>
        <path d="${streets}" fill="none" stroke="#fffef9" stroke-width="10"/>
        <path d="M-20 510Q100 470 187 513T460 485" fill="none" stroke="#d6c58a" stroke-width="17"/>
        <path d="M-20 510Q100 470 187 513T460 485" fill="none" stroke="#fff0b5" stroke-width="12"/>
        <path d="M0 112L430 120" stroke="#b6b4ad" stroke-width="3" stroke-dasharray="6 4"/>
        <g fill="#91958d" font-family="system-ui,sans-serif" font-size="9" text-anchor="middle">
          <text x="218" y="151">STATION ROAD</text><text x="211" y="424">RIVERSIDE DRIVE</text>
          <text x="102" y="558">FOREST LANE</text><text x="304" y="508" transform="rotate(-8 304 508)">LINDEN AVENUE</text>
          <text x="61" y="185" fill="#739067">Riverside Park</text><text x="350" y="590" fill="#739067">Botanical Gardens</text>
          <text x="238" y="316" fill="#6098af" transform="rotate(-13 238 316)">Linden River</text>
          <text x="374" y="376" transform="rotate(-90 374 376)">CIVIC STREET</text>
        </g>${route}
      </svg><div class="maps-label">LINDENWELL</div>
      ${PL.map((p,i) => `<button class="maps-marker${i === sel ? ' is-selected' : ''}" data-place="${i}" ${matches.includes(i) ? '' : 'hidden'} style="left:${p[2]}%;top:${p[3]}%;--pin:${mapColors[i]}" aria-label="${mapEscape(p[0])}" onclick="mapSelect(${i})"><i>${mapSymbols[i]}</i><span>${mapEscape(p[0])}</span></button>`).join('')}
      <div class="maps-location" role="img" aria-label="Your illustrated location"></div>
    </div></div>
    <div class="maps-weather">☁ 24°<small>Lindenwell · Rain</small></div>
    <div class="maps-tools"><button aria-label="Toggle muted map colors" aria-pressed="${mapUI.muted}" onclick="mapUI.muted=!mapUI.muted;paint()">▱</button><button aria-label="Center on your location" onclick="mapLocate()">➤</button><button aria-label="Zoom in" onclick="mapZoom(.2)">+</button><button aria-label="Zoom out" onclick="mapZoom(-.2)">−</button></div>
    <div class="maps-compass">N<span>▲</span></div>
    <div class="maps-sheet"><div class="maps-handle"></div><label class="maps-search"><span aria-hidden="true">⌕</span><input aria-label="Search Maps" placeholder="Search Maps" value="${mapEscape(mapUI.query)}" oninput="mapSearch(this.value)"><button aria-label="Clear search" onclick="mapSearch('');this.previousElementSibling.value=''">×</button></label>
    <div class="maps-categories" aria-label="Place categories">${['All', 'Food', 'Stay', 'Transit', 'Health', 'Parks', 'Home', 'Civic'].map(c => `<button class="${mapUI.category === c ? 'active' : ''}" aria-pressed="${mapUI.category === c}" onclick="mapCategory('${c}')">${c}</button>`).join('')}</div>
    <div class="maps-results">${mapResults()}</div></div>
  </section>`;
}

// Photos: Library, Collections, and locally saved favourites.
const galleryCollections = [
  { name:'Collection 01', photos:PH.slice(0,5) },
  { name:'Collection 02', photos:PH.slice(5,10) },
  { name:'Collection 03', photos:PH.slice(10) },
].filter(c=>c.photos.length);
let galleryFavourites=new Set();
try{const stored=JSON.parse(localStorage.getItem('gallery-favourites')||'[]');if(Array.isArray(stored))galleryFavourites=new Set(stored.filter(p=>PH.includes(p)));}catch{}
const galleryUI={tab:'collections',columns:3,reverse:false,favouritesOnly:false,layout:'large',order:galleryCollections.map((_,i)=>i),pinned:['favourites','all'],panel:null,query:'',info:false,playing:false};
try{const saved=JSON.parse(localStorage.getItem('gallery-layout')||'{}');if(['large','small','list'].includes(saved.layout))galleryUI.layout=saved.layout;if(Array.isArray(saved.order)&&saved.order.length===galleryCollections.length&&new Set(saved.order).size===galleryCollections.length&&saved.order.every(i=>Number.isInteger(i)&&galleryCollections[i]))galleryUI.order=saved.order;if(Array.isArray(saved.pinned))galleryUI.pinned=saved.pinned.filter(k=>['all','favourites',...galleryCollections.map((_,i)=>String(i))].includes(k));}catch{}
let galleryViewing=PH.slice(),galleryTimer=null,galleryTouchX=null;
const galleryEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const galleryCount=items=>`${items.length} photo${items.length===1?'':'s'}`;
function galleryIcon(name){const paths={library:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',collections:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M6 3h12M4 5h16"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',back:'<path d="m15 4-8 8 8 8"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',filter:'<path d="M3 6h18M6 12h12M9 18h6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',play:'<path d="m8 4 13 8-13 8Z"/>',pause:'<path d="M9 4v16M15 4v16"/>',up:'<path d="m5 15 7-7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;}
function galleryCover(p){return `<img src="${p}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;}
function galleryItems(key='all'){const items=key==='all'?PH:key==='favourites'?PH.filter(p=>galleryFavourites.has(p)):galleryCollections[Number(key)]?.photos||[];return items.slice();}
function galleryTitle(key){return key==='all'?'All Photos':key==='favourites'?'Favourites':galleryCollections[Number(key)]?.name||'Photos';}
function galleryPersistLayout(){try{localStorage.setItem('gallery-layout',JSON.stringify({layout:galleryUI.layout,order:galleryUI.order,pinned:galleryUI.pinned}));}catch{}}
function galleryTab(tab){galleryStop();galleryUI.tab=tab;galleryUI.panel=null;galleryUI.query='';paint();}
function galleryPanel(panel){galleryUI.panel=galleryUI.panel===panel?null:panel;paint();}
function galleryLayout(layout){galleryUI.layout=layout;galleryPersistLayout();paint();}
function galleryPin(key){const index=galleryUI.pinned.indexOf(key);index<0?galleryUI.pinned.push(key):galleryUI.pinned.splice(index,1);galleryPersistLayout();paint();}
function galleryReorder(index,step){const to=index+step;if(to<0||to>=galleryUI.order.length)return;[galleryUI.order[index],galleryUI.order[to]]=[galleryUI.order[to],galleryUI.order[index]];galleryPersistLayout();paint();}
function galleryGrid(items,key='all'){return items.length?`<div class="gallery-grid" style="--photo-columns:${galleryUI.columns}">${items.map(p=>`<button class="gallery-thumb" aria-label="Open photo ${PH.indexOf(p)+1}" onclick="galleryOpen('${key}','${p}')">${galleryCover(p)}${galleryFavourites.has(p)?`<span>${galleryIcon('heart')}</span>`:''}</button>`).join('')}</div>`:`<div class="gallery-empty">${galleryIcon('heart')}<h2>No Photos</h2><p>${key==='favourites'?'Tap the heart on a photo to add it here.':'Try another filter or search.'}</p></div>`;}
function galleryPinned(){return `<div class="gallery-pinned">${galleryUI.pinned.map(key=>{const items=galleryItems(key);return `<button onclick="go(()=>galleryAlbum('${key}'))"><span class="gallery-pinned-cover">${items.length?galleryCover(items[0]):galleryIcon(key==='favourites'?'heart':'collections')}<i>${galleryIcon(key==='favourites'?'heart':'collections')}</i></span><b>${galleryTitle(key)}</b><small>${items.length}</small></button>`;}).join('')||'<p class="gallery-muted">Choose your favourite collections with Edit.</p>'}</div>`;}
function galleryCollectionCards(){return `<div class="gallery-collections layout-${galleryUI.layout}">${galleryUI.order.map(i=>{const c=galleryCollections[i];return `<button class="gallery-collection" onclick="go(()=>galleryAlbum(${i}))"><span class="gallery-cover">${galleryCover(c.photos[0])}<span>${c.photos.length}</span></span><span class="gallery-collection-label"><b>${c.name}</b><small>${galleryCount(c.photos)}</small></span></button>`;}).join('')}</div>`;}
function galleryNav(){return `<nav class="gallery-nav" aria-label="Photos navigation"><div class="gallery-tab-pill">${[['library','library','Library'],['collections','collections','Collections']].map(([tab,icon,label])=>`<button ${galleryUI.tab===tab?'aria-current="page"':''} onclick="galleryTab('${tab}')">${galleryIcon(icon)}<span>${label}</span></button>`).join('')}</div><button class="gallery-search-tab" aria-label="Search Photos" aria-pressed="${galleryUI.tab==='search'}" onclick="galleryTab('search')">${galleryIcon('search')}</button></nav>`;}
function galleryHome(){
  const tab=galleryUI.tab,title=tab==='library'?'Library':tab==='search'?'Search':'Collections';let body='';
  if(tab==='library'){let items=galleryUI.favouritesOnly?galleryItems('favourites'):PH.slice();if(galleryUI.reverse)items.reverse();body=`<p class="gallery-library-count">${galleryCount(items)}</p>${galleryGrid(items,galleryUI.favouritesOnly?'favourites':'all')}<p class="gallery-library-end">${galleryCount(items)}<small>On this device</small></p>`;}
  else if(tab==='search')body=`<label class="gallery-search-field">${galleryIcon('search')}<input aria-label="Search photos and albums" placeholder="Photo number or album name" value="${galleryEscape(galleryUI.query)}" oninput="gallerySearch(this.value)"></label><div class="gallery-search-results">${gallerySearchResults()}</div>`;
  else body=`<section class="gallery-section"><header class="gallery-section-heading"><h2>Pinned</h2><button onclick="galleryPanel('pins')">Edit</button></header>${galleryPinned()}</section><section class="gallery-section"><header class="gallery-section-heading"><button class="gallery-section-link" onclick="go(()=>galleryFolder())"><h2>Albums</h2><span>›</span></button><button onclick="galleryPanel('layout')">${galleryIcon('filter')}</button></header>${galleryCollectionCards()}</section><section class="gallery-section"><header class="gallery-section-heading"><h2>Library</h2></header><button class="gallery-library-link" onclick="go(()=>galleryAlbum('all'))"><span class="gallery-library-mini">${PH.slice(0,4).map(galleryCover).join('')}</span><span><b>All Photos</b><small>${galleryCount(PH)}</small></span><span>›</span></button></section>`;
  return `<section class="gallery-app"><header class="gallery-top"><h1>${title}</h1><div class="gallery-top-actions">${tab==='library'?`<button class="gallery-glass-button" aria-label="Library display options" onclick="galleryPanel('filter')">${galleryIcon('filter')}</button>`:''}<button class="gallery-profile" aria-label="About your photo library" onclick="galleryPanel('about')"><img src="imgwr.jpg" alt=""></button></div></header><main class="gallery-content ${tab==='library'?'gallery-library-content':''}">${body}</main>${galleryNav()}${gallerySheet()}</section>`;
}
function gallerySearchResults(){const q=galleryUI.query.toLowerCase().trim();if(!q)return `<h2 class="gallery-search-heading">Your Albums</h2>${galleryCollectionCards()}<p class="gallery-muted">Search by photo number, album name, or “favourites”.</p>`;const items=PH.filter(p=>{const i=PH.indexOf(p),album=galleryCollections.find(c=>c.photos.includes(p));return (`Photo ${i+1} ${p} ${album?.name||''} ${galleryFavourites.has(p)?'favourites':''}`).toLowerCase().includes(q);});return `<p class="gallery-library-count">${galleryCount(items)}</p>${galleryGrid(items,'all')}`;}
function gallerySearch(value){galleryUI.query=value;document.querySelector('.gallery-search-results').innerHTML=gallerySearchResults();}
function gallerySheet(){const panel=galleryUI.panel;if(!panel)return '';let title='',body='';
  if(panel==='filter'){title='Library Options';body=`<p class="gallery-sheet-label">GRID SIZE</p><div class="gallery-choice-row">${[3,5].map(n=>`<button aria-pressed="${galleryUI.columns===n}" onclick="galleryUI.columns=${n};paint()">${n===3?'Larger':'Smaller'} thumbnails</button>`).join('')}</div><button class="gallery-setting-row" aria-pressed="${galleryUI.reverse}" onclick="galleryUI.reverse=!galleryUI.reverse;paint()">Reverse file order <span>${galleryUI.reverse?'✓':''}</span></button><button class="gallery-setting-row" aria-pressed="${galleryUI.favouritesOnly}" onclick="galleryUI.favouritesOnly=!galleryUI.favouritesOnly;paint()">Favourites only <span>${galleryUI.favouritesOnly?'✓':''}</span></button>`;}
  else if(panel==='pins'){title='Edit Pinned';body=['favourites','all',...galleryCollections.map((_,i)=>String(i))].map(key=>`<button class="gallery-setting-row" aria-pressed="${galleryUI.pinned.includes(key)}" onclick="galleryPin('${key}')">${galleryTitle(key)}<span>${galleryUI.pinned.includes(key)?'✓':'+'}</span></button>`).join('');}
  else if(panel==='layout'){title='Collections Layout';body=`<div class="gallery-choice-row">${['large','small','list'].map(layout=>`<button aria-pressed="${galleryUI.layout===layout}" onclick="galleryLayout('${layout}')">${layout[0].toUpperCase()+layout.slice(1)}</button>`).join('')}</div><p class="gallery-sheet-label">ALBUM ORDER</p>${galleryUI.order.map((i,pos)=>`<div class="gallery-setting-row"><span>${galleryCollections[i].name}</span><div class="gallery-reorder"><button aria-label="Move ${galleryCollections[i].name} up" onclick="galleryReorder(${pos},-1)" ${pos===0?'disabled':''}>${galleryIcon('up')}</button><button aria-label="Move ${galleryCollections[i].name} down" onclick="galleryReorder(${pos},1)" ${pos===galleryUI.order.length-1?'disabled':''}>${galleryIcon('down')}</button></div></div>`).join('')}`;}
  else{title='Your Library';body=`<div class="gallery-about"><img src="imgwr.jpg" alt=""><h3>Joohyun’s Photos</h3><p>${galleryCount(PH)} · ${galleryCollections.length} albums</p><p>${galleryFavourites.size} favourites</p><small>Photos come from your existing files. Favourites and layout preferences are stored in this browser.</small></div>`;}
  return `<div class="gallery-modal" onclick="if(event.target===this){galleryUI.panel=null;paint()}"><section class="gallery-sheet" role="dialog" aria-modal="true" aria-label="${title}"><header><h2>${title}</h2><button class="gallery-glass-button" aria-label="Close options" onclick="galleryUI.panel=null;paint()">${galleryIcon('close')}</button></header><div class="gallery-sheet-body">${body}</div></section></div>`;
}
function galleryFolder(){return `<section class="gallery-app"><header class="gallery-album-top"><button class="gallery-glass-button" aria-label="Back to Photos" onclick="back()">${galleryIcon('back')}</button><h1>Albums</h1><span></span></header><main class="gallery-content gallery-album-content"><p class="gallery-library-count">${galleryCollections.length} albums</p>${galleryCollectionCards()}</main></section>`;}
function galleryAlbum(key){const items=galleryItems(key);return `<section class="gallery-app"><header class="gallery-album-top"><button class="gallery-glass-button" aria-label="Back to Photos" onclick="back()">${galleryIcon('back')}</button><h1>${galleryTitle(key)}</h1><span></span></header><main class="gallery-content gallery-album-content"><p class="gallery-library-count">${galleryCount(items)}</p>${galleryGrid(items,key)}</main></section>`;}
function galleryOpen(key,p){galleryStop();galleryViewing=galleryItems(key);if(galleryUI.reverse)galleryViewing.reverse();if(!galleryViewing.includes(p))galleryViewing=PH.slice();galleryUI.info=false;go(()=>pv(p));}
function galleryToggle(p){if(!PH.includes(p))return;galleryFavourites.has(p)?galleryFavourites.delete(p):galleryFavourites.add(p);try{localStorage.setItem('gallery-favourites',JSON.stringify([...galleryFavourites]));}catch{}paint();}
function galleryStep(p,step){const next=galleryViewing[galleryViewing.indexOf(p)+step];if(next){st[st.length-1]=()=>pv(next);paint();}}
function galleryJump(p){if(galleryViewing.includes(p)){st[st.length-1]=()=>pv(p);paint();}}
function galleryStop(){if(galleryTimer)clearInterval(galleryTimer);galleryTimer=null;galleryUI.playing=false;}
function galleryClose(){galleryStop();back();}
function galleryPlay(){if(galleryUI.playing){galleryStop();paint();return;}galleryUI.playing=true;galleryTimer=setInterval(()=>{if(!A.classList.contains('on')||!document.querySelector('.gallery-viewer')){galleryStop();return;}const current=document.querySelector('.gallery-viewer').dataset.photo,index=galleryViewing.indexOf(current);galleryJump(galleryViewing[(index+1)%galleryViewing.length]);},3000);paint();}
function gallerySwipeStart(event){galleryTouchX=event.clientX;}
function gallerySwipeEnd(event,p){if(galleryTouchX===null)return;const delta=event.clientX-galleryTouchX;galleryTouchX=null;if(Math.abs(delta)>50)galleryStep(p,delta<0?1:-1);}
function galleryViewer(p){const index=galleryViewing.indexOf(p),saved=galleryFavourites.has(p);return `<section class="fx gallery-viewer" data-photo="${p}" onkeydown="if(event.key==='ArrowLeft')galleryStep('${p}',-1);if(event.key==='ArrowRight')galleryStep('${p}',1);if(event.key==='Escape')galleryClose()"><header class="gallery-viewer-header"><button class="gallery-glass-button" onclick="galleryClose()" aria-label="Close photo">${galleryIcon('back')}</button><span><b>Photo ${PH.indexOf(p)+1}</b><small>${index+1} of ${galleryViewing.length}</small></span><button class="gallery-glass-button" aria-label="Photo information" aria-pressed="${galleryUI.info}" onclick="galleryUI.info=!galleryUI.info;paint()">${galleryIcon('info')}</button></header><img class="gallery-full-photo" src="${p}" alt="Photo ${PH.indexOf(p)+1}" draggable="false" onpointerdown="gallerySwipeStart(event)" onpointerup="gallerySwipeEnd(event,'${p}')"><div class="gallery-viewer-bottom"><div class="gallery-filmstrip">${galleryViewing.map(photo=>`<button aria-label="View photo ${PH.indexOf(photo)+1}" aria-current="${photo===p?'true':'false'}" onclick="galleryJump('${photo}')">${galleryCover(photo)}</button>`).join('')}</div><div class="gallery-viewer-actions"><button aria-label="Previous photo" onclick="galleryStep('${p}',-1)" ${index<=0?'disabled':''}>${galleryIcon('back')}</button><button aria-label="${saved?'Remove from':'Add to'} favourites" aria-pressed="${saved}" class="gallery-heart" onclick="galleryToggle('${p}')">${galleryIcon('heart')}</button><button aria-label="${galleryUI.playing?'Pause':'Play'} slideshow" aria-pressed="${galleryUI.playing}" onclick="galleryPlay()">${galleryIcon(galleryUI.playing?'pause':'play')}</button><button class="gallery-next" aria-label="Next photo" onclick="galleryStep('${p}',1)" ${index>=galleryViewing.length-1?'disabled':''}>${galleryIcon('back')}</button></div></div>${galleryUI.info?`<aside class="gallery-photo-info"><b>Photo ${PH.indexOf(p)+1}</b><p>${p.split('/').pop()}</p><p>${galleryCollections.find(c=>c.photos.includes(p))?.name||'Photo Library'}${saved?' · Favourite':''}</p><small>No capture date or location metadata is available.</small></aside>`:''}</section>`;}

// ./src/safari.js
const safariUI = { panel: 'start', history: SH.slice(), opened: [] };
const safariFavourites = [
  { name: 'Apple', letter: 'a', color: '#738b9d', url: 'https://www.apple.com' },
  { name: 'Google', letter: 'G', color: '#779bd0', url: 'https://www.google.com' },
  { name: 'Wikipedia', letter: 'W', color: '#b2aca1', url: 'https://www.wikipedia.org' },
  { name: 'YouTube', letter: '▶', color: '#cf7d79', url: 'https://www.youtube.com' },
];
const safariEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safariDestination(value) {
  const text = value.trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) {
    try { return new URL(text).href; } catch { return null; }
  }
  if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#][^\s]*)?$/i.test(text)) return `https://${text}`;
  return `https://www.google.com/search?q=${encodeURIComponent(text)}`;
}
function safariOpen(value) {
  const url = safariDestination(value);
  if (!url) return;
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.click();
  safariUI.history = [value.trim(), ...safariUI.history.filter(v => v !== value.trim())].slice(0, 12);
  safariUI.opened = [url, ...safariUI.opened.filter(v => v !== url)].slice(0, 12);
  paint();
}
function safariRecent(index) { safariOpen(safariUI.history[index]); }
function safariPanel(panel) { safariUI.panel = panel; paint(); }
function safariIcon(name) {
  const paths = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1Z"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function safariStart() {
  const panel = safariUI.panel;
  const favourites = `<div class="safari-favourites">${safariFavourites.map((f,i) => `<button class="safari-favourite" onclick="safariOpen(safariFavourites[${i}].url)" title="Open ${f.name} in a new browser tab"><span class="safari-tile" style="--tile:${f.color}">${f.letter}</span><small>${f.name}</small></button>`).join('')}</div>`;
  const recent = `<div class="safari-recent safari-glass">${safariUI.history.length ? safariUI.history.map((value,i) => `<button onclick="safariRecent(${i})" title="Search in a new browser tab"><span>↺</span><span>${safariEscape(value)}</span><span>↗</span></button>`).join('') : '<p class="safari-empty">Your recent searches will appear here.</p>'}</div>`;
  const content = panel === 'opened' ? `<section class="safari-section"><div class="safari-section-heading"><h2>Opened links</h2><button onclick="safariUI.opened=[];paint()">Clear</button></div><div class="safari-recent safari-glass">${safariUI.opened.map((url,i) => `<button onclick="safariOpen(safariUI.opened[${i}])"><span>↗</span><span>${safariEscape(url)}</span><span>↗</span></button>`).join('') || '<p class="safari-empty">No links opened yet.<br>Search or choose a favourite to get started.</p>'}</div></section>` : `<section class="safari-section"><div class="safari-section-heading"><h2>Favourites</h2><span>${safariFavourites.length} websites</span></div>${favourites}</section>${panel === 'start' ? `<section class="safari-section"><div class="safari-note safari-glass"><span>↗</span><div><b>A little room to explore.</b><p>Your favourite places on the web,<br>all within reach.</p></div></div></section><section class="safari-section"><div class="safari-section-heading"><h2>Recent searches</h2><button onclick="safariUI.history=[];paint()">Clear</button></div>${recent}</section>` : ''}`;
  return `<section class="safari-screen" aria-label="Safari"><div class="safari-scroll"><div class="safari-topline"><span>SAFARI</span><span class="safari-profile">BJ</span></div><header class="safari-hero"><p>Your window to the web</p><h1>${panel === 'start' ? 'Start Page' : panel === 'bookmarks' ? 'Bookmarks' : 'Your browsing'}</h1></header>${content}<p class="safari-footer-note">Websites and searches open in a new browser tab.</p></div><footer class="safari-bottom"><form class="safari-address" onsubmit="event.preventDefault();safariOpen(this.elements.address.value)"><span aria-hidden="true">⌕</span><input name="address" type="text" aria-label="Search or enter website" placeholder="Search or enter website" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"><button type="submit">Go</button></form><nav class="safari-toolbar" aria-label="Browser toolbar"><button onclick="safariPanel('start')" aria-label="Start page" aria-pressed="${panel === 'start'}">${safariIcon('home')}</button><button onclick="document.querySelector('.safari-address input').focus()" aria-label="Search">${safariIcon('search')}</button><button onclick="safariPanel('bookmarks')" aria-label="Bookmarks" aria-pressed="${panel === 'bookmarks'}">${safariIcon('book')}</button><button onclick="safariPanel('opened')" aria-label="Opened links" aria-pressed="${panel === 'opened'}"><span class="safari-count">${safariUI.opened.length}</span></button></nav></footer></section>`;
}

// ./src/settings.js
const settingsDefaults = { airplane:false, wifi:true, network:'Lindenwell_5G', bluetooth:true, cellular:true, brightness:100, dark:false, blur:14, wallpaper:'original', notifications:true, reduceMotion:false, name:"Joohyun’s iPhone" };
const phoneSettings = {...settingsDefaults};
try {
  const stored = JSON.parse(localStorage.getItem('phone-settings') || '{}');
  for (const key of Object.keys(settingsDefaults)) if (typeof stored?.[key] === typeof settingsDefaults[key]) phoneSettings[key] = stored[key];
} catch {}
phoneSettings.brightness = Math.max(30,Math.min(100,phoneSettings.brightness));
phoneSettings.blur = Math.max(0,Math.min(30,phoneSettings.blur));
const settingsWallpapers = { original:'url(imgbjh.jpg) center/cover', coast:'linear-gradient(145deg,#91b7c7,#506e98 55%,#e9c9bd)', dusk:'linear-gradient(150deg,#373f6a,#9c7a9d 60%,#ecc5b4)' };
if (!settingsWallpapers[phoneSettings.wallpaper]) phoneSettings.wallpaper='original';
const settingsEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function settingsApply() {
  P.style.setProperty('--screen-dim', String(1-phoneSettings.brightness/100));
  P.style.setProperty('--wallpaper-blur',phoneSettings.blur+'px');
  P.classList.toggle('settings-dark',phoneSettings.dark);
  P.classList.toggle('reduce-motion',phoneSettings.reduceMotion);
  H.style.background=settingsWallpapers[phoneSettings.wallpaper];
}
function settingsSet(key,value,repaint=true) {
  if (!(key in settingsDefaults) || typeof value !== typeof settingsDefaults[key]) return;
  phoneSettings[key]=value;
  settingsApply();
  try {localStorage.setItem('phone-settings',JSON.stringify(phoneSettings));} catch {}
  if(repaint) paint();
}
function settingsToggle(key) {settingsSet(key,!phoneSettings[key]);}
function settingsIcon(name){const paths={airplane:'<path d="m22 12-8-3V3l-2-2-2 2v6l-8 3v2l8-1v6l-3 2v1l5-1 5 1v-1l-3-2v-6l8 1Z" fill="currentColor" stroke="none"/>',wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>',bluetooth:'<path d="m6 6 12 12-6 5V1l6 5L6 18"/>',cellular:'<path d="M4 19v-3M9 19v-7M14 19V8M19 19V4" stroke-width="3"/>',display:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',appearance:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>',wallpaper:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m4 17 5-6 4 5 3-3 4 4"/><circle cx="16" cy="8" r="1.5"/>',notifications:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM9 21h6"/>',general:'<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',motion:'<path d="M2 8c4-7 5 7 9 0s5 7 9 0M2 16c4-7 5 7 9 0s5 7 9 0"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',back:'<path d="m15 4-8 8 8 8"/>'};const aliases={'✈':'airplane','≋':'wifi','ᛒ':'bluetooth','▥':'cellular','☀':'display','◐':'appearance','▧':'wallpaper','♧':'notifications','⚙':'general','ⓘ':'info','≈':'motion'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[aliases[name]||name]||paths.info}</svg>`;}
function settingsSwitch(label,key,icon,color,disabled=false) {
  return `<button class="settings-row" role="switch" aria-label="${label}" aria-checked="${phoneSettings[key]}" onclick="settingsToggle('${key}')" ${disabled?'disabled':''}><span class="settings-icon" style="--icon:${color}">${settingsIcon(icon)}</span><span class="settings-row-label">${label}</span><span class="settings-switch" aria-hidden="true"></span></button>`;
}
function settingsLink(label,page,icon,color,value='') {
  return `<button class="settings-row" data-search="${label.toLowerCase()}" onclick="go(()=>settingsDetail('${page}'))"><span class="settings-icon" style="--icon:${color}">${settingsIcon(icon)}</span><span class="settings-row-label">${label}</span><span class="settings-value">${settingsEscape(value)}</span><span class="settings-chevron">›</span></button>`;
}
function settingsGroup(title,content) { return `<section class="settings-group"><h2>${title}</h2><div class="settings-card">${content}</div></section>`; }
function settingsSearch(query) {
  const text=query.trim().toLowerCase();let matches=0;
  document.querySelectorAll('.settings-page .settings-group').forEach(group=>{
    let visible=0;
    group.querySelectorAll('.settings-row').forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(text);if(!row.hidden)visible++;});
    group.hidden=!visible;matches+=visible;
  });
  document.querySelector('.settings-profile').hidden=!!text;
  document.querySelector('.settings-empty').hidden=!!matches;
}
function settingsHome() {
  const p=phoneSettings;
  return `<div class="settings-page settings-home"><h1 class="settings-title">Settings</h1><label class="settings-search">${settingsIcon('search')}<input aria-label="Search settings" placeholder="Search" oninput="settingsSearch(this.value)"></label><button class="settings-profile" onclick="go(()=>settingsDetail('profile'))"><img class="settings-avatar" src="imgwr.jpg" alt=""><span><b>Bae Joohyun</b><small>Personal profile & device</small></span><span class="settings-chevron">›</span></button>
  ${settingsGroup('Connections',settingsSwitch('Airplane Mode','airplane','✈','#ff9500')+settingsLink('Wi-Fi','wifi','≋','#007aff',p.airplane?'Airplane Mode':p.wifi?p.network:'Off')+settingsLink('Bluetooth','bluetooth','ᛒ','#007aff',p.bluetooth?'On':'Off')+settingsLink('Cellular','cellular','▥','#34c759',p.airplane?'Off':p.cellular?'On':'Off'))}
  ${settingsGroup('Personalise',settingsLink('Appearance','appearance','appearance','#5856d6',p.dark?'Dark':'Light')+settingsLink('Display & Brightness','display','☀','#007aff',p.brightness+'%')+settingsLink('Wallpaper','wallpaper','▧','#007aff')+settingsLink('Notifications','notifications','♧','#ff3b30',p.notifications?'On':'Off'))}
  ${settingsGroup('Your device',settingsLink('General','general','⚙','#8e8e93')+settingsLink('About','about','ⓘ','#8e8e93'))}<p class="settings-empty" hidden>No matching settings.</p><p class="settings-note">Preferences apply to this phone preview. Connection controls simulate device settings.</p></div>`;
}
function settingsSlider(label,key,min,max,suffix) {
  return `<div class="settings-card settings-slider"><label for="settings-${key}">${label}<output id="settings-${key}-value">${phoneSettings[key]}${suffix}</output></label><input id="settings-${key}" type="range" min="${min}" max="${max}" value="${phoneSettings[key]}" oninput="settingsSet('${key}',Number(this.value),false);document.getElementById('settings-${key}-value').textContent=this.value+'${suffix}'"></div>`;
}
function settingsInfo(label,value) {return `<div class="settings-row"><span class="settings-row-label">${label}</span><span class="settings-value">${settingsEscape(value)}</span></div>`;}
function settingsDetail(page) {
  const p=phoneSettings;let title='',content='';
  if(page==='wifi') {
    title='Wi-Fi';content=settingsGroup('Connection',settingsSwitch('Wi-Fi','wifi','≋','#007aff',p.airplane));
    content+=settingsGroup('Available networks',['Lindenwell_5G','Riverside Guest','Shon_5G'].map(name=>`<button class="settings-row" ${!p.wifi||p.airplane?'disabled':''} onclick="settingsSet('network','${name}')"><span class="settings-icon" style="--icon:#007aff">${settingsIcon('wifi')}</span><span class="settings-row-label">${name}</span><span class="settings-value">${p.wifi&&!p.airplane&&p.network===name?'Connected ✓':'Join'}</span></button>`).join(''))+'<p class="settings-note">Networks are simulated in this preview. Your computer’s network connection stays unchanged.</p>';
  } else if(page==='bluetooth'||page==='cellular') {
    title=page==='bluetooth'?'Bluetooth':'Cellular';content=settingsGroup('Connection',settingsSwitch(title,page,page==='bluetooth'?'ᛒ':'▥',page==='bluetooth'?'#007aff':'#34c759',page==='cellular'&&p.airplane))+'<p class="settings-note">This switch is a simulated device preference.</p>';
  } else if(page==='appearance') {
    title='Appearance';content=`<div class="settings-card settings-appearance"><button aria-pressed="${!p.dark}" onclick="settingsSet('dark',false)"><span class="settings-theme-preview theme-light"><i></i><b></b><b></b><b></b></span><span>Light</span><i class="settings-radio"></i></button><button aria-pressed="${p.dark}" onclick="settingsSet('dark',true)"><span class="settings-theme-preview theme-dark"><i></i><b></b><b></b><b></b></span><span>Dark</span><i class="settings-radio"></i></button></div><p class="settings-note">Choose the appearance of Settings. Your preference is saved on this browser.</p>`;
  } else if(page==='display') {
    title='Display & Brightness';content=settingsSlider('Brightness','brightness',30,100,'%')+'<p class="settings-note">Adjusts the brightness of the entire phone preview.</p>'+settingsGroup('Appearance',settingsLink('Appearance','appearance','appearance','#5856d6',p.dark?'Dark':'Light'));
  } else if(page==='wallpaper') {
    title='Wallpaper';content=`<div class="settings-card settings-wallpapers">${Object.entries(settingsWallpapers).map(([key,bg])=>`<button class="settings-wallpaper" aria-pressed="${p.wallpaper===key}" onclick="settingsSet('wallpaper','${key}')"><span style="background:${bg}"></span>${key==='original'?'Original':key==='coast'?'Coast':'Dusk'}</button>`).join('')}</div><p class="settings-note">Choose a home screen wallpaper.</p>`+settingsSlider('Wallpaper blur','blur',0,30,'px');
  } else if(page==='notifications') {
    title='Notifications';content=settingsGroup('Banners',settingsSwitch('Allow Notifications','notifications','♧','#ff3b30'))+'<p class="settings-note">Controls the message and social notification banners shown after unlocking. It does not change browser notification permissions.</p>';
  } else if(page==='general') {
    title='General';content=settingsGroup('Accessibility',settingsSwitch('Reduce Motion','reduceMotion','≈','#007aff'))+settingsGroup('Device',settingsLink('About','about','ⓘ','#8e8e93'))+'<p class="settings-note">Reduce Motion disables animations and transitions in this phone preview.</p>';
  } else if(page==='profile') {
    title='Your device';content=`<form class="settings-card settings-field" onsubmit="event.preventDefault();const name=this.elements.deviceName.value.trim();if(name){settingsSet('name',name);toast('Device name saved')}"><label for="settings-device-name">Device name</label><input id="settings-device-name" name="deviceName" value="${settingsEscape(p.name)}" maxlength="40" required><button class="settings-primary" type="submit">Save name</button></form><p class="settings-note">Saved locally in this browser.</p>`;
  } else {
    title='About';content=settingsGroup('Device information',settingsInfo('Name',p.name)+settingsInfo('Interface','iPhone preview')+settingsInfo('Photos',String(PH.length))+settingsInfo('Collections',String(galleryCollections.length)))+'<p class="settings-note">This is an interactive web interface, with preferences stored on this browser.</p>';
  }
  return `<div class="settings-page settings-detail-page"><header class="settings-detail-nav"><button class="settings-back" onclick="back()">${settingsIcon('back')}Settings</button><h1>${title}</h1><span></span></header><main class="settings-detail-body">${content}</main></div>`;
}
settingsApply();

// ./src/instagram.js
/* Local interactive Instagram-style demo. No account or network publishing. */
const igUsers = [
  {handle:'joohyun.b',name:'Bae Joohyun',avatar:'imgwr.jpg'},
  {handle:'seungwan.s',name:'Seungwan',avatar:'imgwen.jpg'},
  {handle:'yerim.k',name:'Yeri',avatar:'imgyr.jpg'},
  {handle:'seulgi.k',name:'Seulgi',avatar:'imgseul.jpg'},
  {handle:'joy.p',name:'Joy',avatar:'imgjoy.jpg'},
];
const igSeedPosts = PH.map((photo,i)=>({id:'photo-'+i,photo,user:i%5,caption:['Little moments, kept close.','A day worth remembering.','From my camera roll.','A little collection of lately.','Good company.'][i%5],likes:84+i*17}));
const igData = {likes:[],saved:[],comments:{},following:[1,2,3,4],published:[],bio:'A little collection of my days. ☁'};
try {
  const stored=JSON.parse(localStorage.getItem('instagram-local')||'{}');
  for(const key of ['likes','saved']) if(Array.isArray(stored[key])) igData[key]=stored[key].filter(v=>typeof v==='string');
  if(Array.isArray(stored.following))igData.following=stored.following.filter(v=>Number.isInteger(v)&&v>0&&v<igUsers.length);
  if(typeof stored.bio==='string')igData.bio=stored.bio.slice(0,150);
  if(Array.isArray(stored.published))igData.published=stored.published.filter(p=>p&&typeof p.id==='string'&&PH.includes(p.photo)&&typeof p.caption==='string').map(p=>({...p,user:0,likes:0,caption:p.caption.slice(0,500)}));
  if(stored.comments&&typeof stored.comments==='object')for(const [id,comments] of Object.entries(stored.comments))if(Array.isArray(comments))igData.comments[id]=comments.filter(c=>typeof c==='string').map(c=>c.slice(0,300));
}catch{}
const igUI={screen:'feed',profile:0,query:'',modal:null,post:null,story:0,selected:PH[0],caption:''};
const igEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function igPersist(){try{localStorage.setItem('instagram-local',JSON.stringify(igData));}catch{}}
function igPosts(){return [...igData.published,...igSeedPosts];}
function igGet(id){return igPosts().find(p=>p.id===id);}
function igIcon(name,filled=false){
  const paths={home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',comment:'<path d="M21 11.5A9.5 9.5 0 1 1 4.2 5.4 9.5 9.5 0 0 1 21 11.5Z"/><path d="m18 18 3 3-1-6"/>',save:'<path d="M5 3h14v18l-7-5-7 5Z"/>',plus:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/>',grid:'<path d="M3 3h18v18H3ZM3 9h18M3 15h18M9 3v18M15 3v18"/>'};
  return `<svg viewBox="0 0 24 24" fill="${filled?'currentColor':'none'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function igNavigate(screen,profile=0){igUI.screen=screen;igUI.profile=profile;igUI.modal=null;igUI.query='';igRefresh(true);}
function igRefresh(reset=false){
  const main=document.querySelector('.ig-main');
  if(!main)return;
  const top=reset?0:main.scrollTop; main.innerHTML=igContent(); main.scrollTop=top;
  document.querySelector('.ig-nav').innerHTML=igNav();igRenderModal();
}
function igToggle(type,id){
  if(!igGet(id))return;
  const list=igData[type],index=list.indexOf(id); index<0?list.push(id):list.splice(index,1);igPersist();igRefresh();
}
function igDoubleLike(id){if(!igData.likes.includes(id))igToggle('likes',id);}
function igFollow(user){const i=igData.following.indexOf(user);i<0?igData.following.push(user):igData.following.splice(i,1);igPersist();igRefresh();}
function igPost(p){
  const user=igUsers[p.user],liked=igData.likes.includes(p.id),saved=igData.saved.includes(p.id),comments=igData.comments[p.id]||[];
  return `<article class="ig-post"><header class="ig-post-heading"><button class="ig-user-button" onclick="igNavigate('profile',${p.user})"><img class="ig-avatar" src="${user.avatar}" alt=""><span><b>${user.handle}</b><small>From the photo library</small></span></button></header><img class="ig-post-photo" src="${p.photo}" alt="Photo shared by ${user.handle}" loading="lazy" ondblclick="igDoubleLike('${p.id}')"><div class="ig-post-actions"><button class="ig-action ig-like" aria-label="${liked?'Unlike':'Like'} post" aria-pressed="${liked}" onclick="igToggle('likes','${p.id}')">${igIcon('heart')}</button><button class="ig-action" aria-label="View comments" onclick="igOpenModal('comments','${p.id}')">${igIcon('comment')}</button><button class="ig-action ig-save" aria-label="${saved?'Unsave':'Save'} post" aria-pressed="${saved}" onclick="igToggle('saved','${p.id}')">${igIcon('save')}</button></div><div class="ig-post-copy"><p class="ig-likes">${(p.likes+(liked?1:0)).toLocaleString()} likes</p><p class="ig-caption"><b>${user.handle}</b>${igEscape(p.caption)}</p><button class="ig-comments-link" onclick="igOpenModal('comments','${p.id}')">${comments.length?'View '+comments.length+' comment'+(comments.length===1?'':'s'):'Add a comment…'}</button><p class="ig-time">${p.id.startsWith('local-')?'JUST NOW':'PHOTO DIARY'}</p></div></article>`;
}
function igGrid(posts){return posts.length?`<div class="ig-grid">${posts.map(p=>`<button aria-label="View photo by ${igUsers[p.user].handle}" onclick="igOpenModal('post','${p.id}')"><img src="${p.photo}" alt="" loading="lazy"></button>`).join('')}</div>`:'<div class="ig-empty"><b>Nothing here yet</b>Save a post or share a photo from your library.</div>';}
function igContent(){
  if(igUI.screen==='feed')return `<div class="ig-stories">${igUsers.map((u,i)=>`<button class="ig-story" onclick="igOpenStory(${i})"><span class="ig-story-ring"><img src="${u.avatar}" alt=""></span><small>${i?u.handle:'Your story'}</small></button>`).join('')}</div>${igPosts().map(igPost).join('')}`;
  if(igUI.screen==='explore')return `<label class="ig-search">${igIcon('search')}<input aria-label="Search posts and people" placeholder="Search people or captions" value="${igEscape(igUI.query)}" oninput="igSearch(this.value)"></label><div class="ig-explore-results">${igExploreResults()}</div>`;
  if(igUI.screen==='saved')return `<h1 class="ig-page-heading">Saved</h1><p class="ig-subtitle">A collection just for you</p>${igGrid(igPosts().filter(p=>igData.saved.includes(p.id)))}`;
  if(igUI.screen==='activity')return `<h1 class="ig-page-heading">Your activity</h1><p class="ig-subtitle">Posts you’ve liked</p>${igGrid(igPosts().filter(p=>igData.likes.includes(p.id)))}`;
  const user=igUsers[igUI.profile],posts=igPosts().filter(p=>p.user===igUI.profile),own=igUI.profile===0,following=igData.following.includes(igUI.profile);
  return `<div class="ig-profile"><div class="ig-profile-top"><img class="ig-profile-avatar" src="${user.avatar}" alt="${user.name}"><div class="ig-profile-stats"><span><b>${posts.length}</b><small>posts</small></span><span><b>${own?igData.saved.length:'—'}</b><small>${own?'saved':'followers'}</small></span><span><b>${own?igData.following.length:'—'}</b><small>following</small></span></div></div><h2>${user.handle}</h2><p>${igEscape(own?igData.bio:user.name+' · A photo diary.')}</p><div class="ig-profile-buttons">${own?'<button class="ig-soft-button" onclick="igOpenModal(\'edit\')">Edit profile</button><button class="ig-soft-button" onclick="igNavigate(\'saved\')">Saved posts</button>':`<button class="ig-soft-button ${following?'is-following':''}" onclick="igFollow(${igUI.profile})">${following?'Following ✓':'Follow'}</button><button class="ig-soft-button" onclick="igNavigate('feed')">Back to feed</button>`}</div></div><div class="ig-grid-label">${igIcon('grid')}</div>${igGrid(posts)}`;
}
function igExploreResults(){const q=igUI.query.toLowerCase();return igGrid(igPosts().filter(p=>(igUsers[p.user].handle+' '+igUsers[p.user].name+' '+p.caption).toLowerCase().includes(q)));}
function igSearch(value){igUI.query=value;document.querySelector('.ig-explore-results').innerHTML=igExploreResults();}
function igNav(){return `<button aria-label="Home" ${igUI.screen==='feed'?'aria-current="page"':''} onclick="igNavigate('feed')">${igIcon('home')}</button><button aria-label="Explore" ${igUI.screen==='explore'?'aria-current="page"':''} onclick="igNavigate('explore')">${igIcon('search')}</button><button aria-label="Create post" onclick="igOpenModal('compose')">${igIcon('plus')}</button><button aria-label="Saved posts" ${igUI.screen==='saved'?'aria-current="page"':''} onclick="igNavigate('saved')">${igIcon('save')}</button><button aria-label="Your profile" ${igUI.screen==='profile'&&igUI.profile===0?'aria-current="page"':''} onclick="igNavigate('profile')"><img src="imgwr.jpg" alt=""></button>`;}
function igOpenModal(modal,id=null){igUI.modal=modal;igUI.post=id;igRenderModal();}
function igCloseModal(){igUI.modal=null;igRenderModal();}
function igOpenStory(index){igUI.story=index;igOpenModal('story');}
function igStoryStep(step){igUI.story=Math.max(0,Math.min(igUsers.length-1,igUI.story+step));igRenderModal();}
function igAddComment(form){const text=form.elements.comment.value.trim();if(!text)return;const id=igUI.post;if(!igData.comments[id])igData.comments[id]=[];igData.comments[id].push(text.slice(0,300));igPersist();igRefresh();}
function igPublish(form){
  if(!PH.includes(igUI.selected))return;
  const caption=form.elements.caption.value.trim().slice(0,500);
  igData.published.unshift({id:'local-'+Date.now(),photo:igUI.selected,caption,user:0,likes:0});igPersist();igNavigate('feed');toast('Post added to your local feed');
}
function igRenderModal(){
  const mount=document.querySelector('.ig-modal-mount');if(!mount)return;
  const modal=igUI.modal,p=igGet(igUI.post);
  if(!modal){mount.innerHTML='';return;}
  if(modal==='story'){
    const user=igUsers[igUI.story];mount.innerHTML=`<div class="ig-story-view"><div class="ig-story-progress">${igUsers.map((_,i)=>`<span class="${i<=igUI.story?'seen':''}"></span>`).join('')}</div><div class="ig-story-heading"><img class="ig-avatar" src="${user.avatar}" alt=""><b>${user.handle}</b><button aria-label="Close story" onclick="igCloseModal()">×</button></div><img src="${PH[igUI.story]}" alt="Photo from ${user.handle}"><div class="ig-story-footer"><button onclick="igStoryStep(-1)" ${igUI.story===0?'disabled':''}>‹ Previous</button><button onclick="igStoryStep(1)" ${igUI.story===igUsers.length-1?'disabled':''}>Next ›</button></div></div>`;return;
  }
  let title='',body='',footer='';
  if(modal==='comments'&&p){title='Comments';body=`<div class="ig-comment"><img class="ig-avatar" src="${igUsers[p.user].avatar}" alt=""><p><b>${igUsers[p.user].handle}</b>${igEscape(p.caption)}</p></div>${(igData.comments[p.id]||[]).map(c=>`<div class="ig-comment"><img class="ig-avatar" src="imgwr.jpg" alt=""><p><b>${igUsers[0].handle}</b>${igEscape(c)}</p></div>`).join('')}`;footer='<form class="ig-comment-form" onsubmit="event.preventDefault();igAddComment(this)"><input name="comment" aria-label="Add a comment" placeholder="Add a comment…" maxlength="300" required><button class="ig-submit" type="submit">Post</button></form>';}
  else if(modal==='compose'){title='New post';body=`<form onsubmit="event.preventDefault();igPublish(this)"><label class="ig-form-label">Choose from your existing photos</label><div class="ig-compose-grid">${PH.map(photo=>`<button type="button" aria-label="Select photo ${PH.indexOf(photo)+1}" aria-pressed="${photo===igUI.selected}" onclick="igUI.selected='${photo}';this.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===this?'true':'false'))"><img src="${photo}" alt="" loading="lazy"></button>`).join('')}</div><label class="ig-form-label" for="ig-caption">Caption</label><textarea id="ig-caption" name="caption" placeholder="Write a caption…" maxlength="500"></textarea><button class="ig-primary" type="submit">Add to local feed</button><p class="ig-notice">Posts and comments are saved in this browser. Nothing is sent to Instagram.</p></form>`;}
  else if(modal==='edit'){title='Edit profile';body=`<form onsubmit="event.preventDefault();igData.bio=this.elements.bio.value.trim();igPersist();igCloseModal();igRefresh()"><label class="ig-form-label" for="ig-bio">Bio</label><textarea id="ig-bio" name="bio" maxlength="150">${igEscape(igData.bio)}</textarea><button class="ig-primary" type="submit">Save profile</button></form>`;}
  else if(modal==='post'&&p){title='Post';body=igPost(p);}
  else {igUI.modal=null;mount.innerHTML='';return;}
  mount.innerHTML=`<div class="ig-overlay" onclick="if(event.target===this)igCloseModal()"><section class="ig-sheet" role="dialog" aria-modal="true" aria-label="${title}" onkeydown="if(event.key==='Escape')igCloseModal()"><header class="ig-sheet-heading"><h2>${title}</h2><button aria-label="Close dialog" onclick="igCloseModal()">×</button></header><div class="ig-sheet-body">${body}</div>${footer}</section></div>`;
}
function instagram(){return `<section class="ig-screen" aria-label="Instagram"><header class="ig-header"><button class="ig-wordmark" onclick="igNavigate('feed')">Instagram</button><div class="ig-header-actions"><button aria-label="Your activity" onclick="igNavigate('activity')">${igIcon('heart')}</button><button aria-label="Create post" onclick="igOpenModal('compose')">${igIcon('plus')}</button></div></header><main class="ig-main">${igContent()}</main><nav class="ig-nav" aria-label="Instagram navigation">${igNav()}</nav><div class="ig-modal-mount"></div></section>`;}
ROOT.instagram=instagram;

// ./src/x.js
/* Local X-style timeline. Actions stay inside this browser. */
const xUsers=[
  {name:'Bae Joohyun',handle:'joohyun_b',avatar:'imgwr.jpg'},
  {name:'Seungwan',handle:'seungwan_s',avatar:'imgwen.jpg'},
  {name:'Yeri',handle:'yerim_k',avatar:'imgyr.jpg'},
  {name:'Seulgi',handle:'seulgi_k',avatar:'imgseul.jpg'},
  {name:'Joy',handle:'joy_p',avatar:'imgjoy.jpg'},
];
const xSeed=[
  {id:'seed-0',user:1,text:'A good evening is good company and nowhere to rush. ☁',photo:PH[0],likes:128,reposts:12},
  {id:'seed-1',user:2,text:'Reminder to take a break. And by a break I mean something from the bakery. #LittleThings',photo:null,likes:67,reposts:8},
  {id:'seed-2',user:0,text:'A few moments from the camera roll. Keeping these here.',photo:PH[3],likes:94,reposts:5},
  {id:'seed-3',user:3,text:'The best plans leave a little room for getting lost. #PhotoDiary',photo:PH[6],likes:215,reposts:21},
  {id:'seed-4',user:4,text:'Just one more photo. Always one more photo.',photo:PH[9],likes:143,reposts:9},
  {id:'seed-5',user:1,text:'Some days the little things are the whole story. #LittleThings',photo:null,likes:86,reposts:4},
  {id:'seed-6',user:0,text:'Leaving a little space for the things that make me happy. #PhotoDiary',photo:PH[12],likes:73,reposts:3},
];
const xData={likes:[],reposts:[],bookmarks:[],replies:{},posts:[],following:[1,2,3,4],bio:'Small thoughts. Little moments. ☁'};
try{
  const stored=JSON.parse(localStorage.getItem('x-local')||'{}');
  for(const key of ['likes','reposts','bookmarks'])if(Array.isArray(stored[key]))xData[key]=stored[key].filter(id=>typeof id==='string'&&/^(seed-\d+|local-\d+-\d+)$/.test(id));
  if(Array.isArray(stored.following))xData.following=stored.following.filter(i=>Number.isInteger(i)&&i>0&&i<xUsers.length);
  if(typeof stored.bio==='string')xData.bio=stored.bio.slice(0,160);
  if(Array.isArray(stored.posts))xData.posts=stored.posts.filter(p=>p&&/^local-\d+-\d+$/.test(p.id)&&typeof p.text==='string'&&(p.photo===null||PH.includes(p.photo))).map(p=>({...p,text:p.text.slice(0,280),user:0,likes:0,reposts:0}));
  if(stored.replies&&typeof stored.replies==='object')for(const [id,items]of Object.entries(stored.replies))if(/^(seed-\d+|local-\d+-\d+)$/.test(id)&&Array.isArray(items))xData.replies[id]=items.filter(t=>typeof t==='string').map(t=>t.slice(0,280));
}catch{}
const xUI={screen:'home',tab:'for-you',profile:0,query:'',modal:null,post:null,draft:'',photo:null};
const xEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function xPersist(){try{localStorage.setItem('x-local',JSON.stringify(xData));}catch{}}
function xPosts(){return [...xData.posts,...xSeed];}
function xGet(id){return xPosts().find(p=>p.id===id);}
function xIcon(name){
  const paths={home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM9 21h6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',reply:'<path d="M21 11a9 9 0 0 1-9 9H4l1-4A9 9 0 1 1 21 11Z"/>',repost:'<path d="m4 8 3-3 3 3M7 5v12h7m6-1-3 3-3-3m3 3V7h-7"/>',save:'<path d="M5 3h14v18l-7-5-7 5Z"/>',compose:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>'};
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function xNavigate(screen,profile=0){xUI.screen=screen;xUI.profile=profile;xUI.query='';xUI.modal=null;xRefresh(true);}
function xRefresh(reset=false){
  const main=document.querySelector('.x-main');if(!main)return;
  const top=reset?0:main.scrollTop;main.innerHTML=xContent();main.scrollTop=top;
  document.querySelector('.x-nav').innerHTML=xNav();document.querySelector('.x-header-title').textContent=xTitle();xRenderModal();
}
function xToggle(type,id){if(!['likes','reposts','bookmarks'].includes(type)||!xGet(id))return;const list=xData[type],i=list.indexOf(id);i<0?list.push(id):list.splice(i,1);xPersist();xRefresh();}
function xFollow(user){if(user<1||user>=xUsers.length)return;const i=xData.following.indexOf(user);i<0?xData.following.push(user):xData.following.splice(i,1);xPersist();xRefresh();}
function xPost(p){
  const u=xUsers[p.user],liked=xData.likes.includes(p.id),reposted=xData.reposts.includes(p.id),saved=xData.bookmarks.includes(p.id),replies=xData.replies[p.id]||[];
  return `<article class="x-post"><button class="x-post-user-avatar" aria-label="View ${u.name}'s profile" onclick="xNavigate('profile',${p.user})"><img class="x-avatar" src="${u.avatar}" alt=""></button><div class="x-post-body"><header class="x-post-heading"><button onclick="xNavigate('profile',${p.user})">${u.name}</button><span>@${u.handle} · ${p.id.startsWith('local-')?'now':'photo diary'}</span></header><p class="x-post-text">${xEscape(p.text)}</p>${p.photo?`<button class="x-media" aria-label="Expand photo" onclick="xOpenModal('photo','${p.id}')"><img src="${p.photo}" alt="Photo from ${u.name}" loading="lazy"></button>`:''}<div class="x-post-actions"><button aria-label="Reply" onclick="xOpenModal('replies','${p.id}')">${xIcon('reply')}<span>${replies.length||''}</span></button><button class="${reposted?'x-reposted':''}" aria-label="${reposted?'Undo repost':'Repost'}" aria-pressed="${reposted}" onclick="xToggle('reposts','${p.id}')">${xIcon('repost')}<span>${p.reposts+(reposted?1:0)}</span></button><button class="${liked?'x-liked':''}" aria-label="${liked?'Unlike':'Like'}" aria-pressed="${liked}" onclick="xToggle('likes','${p.id}')">${xIcon('heart')}<span>${p.likes+(liked?1:0)}</span></button><button class="${saved?'x-bookmarked':''}" aria-label="${saved?'Remove bookmark':'Bookmark'}" aria-pressed="${saved}" onclick="xToggle('bookmarks','${p.id}')">${xIcon('save')}</button></div></div></article>`;
}
function xTimeline(posts){return posts.length?posts.map(xPost).join(''):'<div class="x-empty"><b>A little quiet here</b>Follow someone, bookmark a post, or join the conversation.</div>';}
function xTitle(){return {home:'Home',explore:'Explore',activity:'Your activity',bookmarks:'Bookmarks',profile:xUsers[xUI.profile].name}[xUI.screen]||'Home';}
function xContent(){
  if(xUI.screen==='home')return `<div class="x-tabs" role="tablist" aria-label="Timeline"><button role="tab" aria-selected="${xUI.tab==='for-you'}" onclick="xUI.tab='for-you';xRefresh(true)">For you</button><button role="tab" aria-selected="${xUI.tab==='following'}" onclick="xUI.tab='following';xRefresh(true)">Following</button></div>${xTimeline(xPosts().filter(p=>xUI.tab==='for-you'||xData.following.includes(p.user)||p.user===0))}<p class="x-local-note">Your local timeline · Posts and interactions stay in this browser.</p>`;
  if(xUI.screen==='explore')return `<label class="x-search">${xIcon('search')}<input aria-label="Search posts and people" placeholder="Search X" value="${xEscape(xUI.query)}" oninput="xSearch(this.value)"></label><div class="x-search-results">${xSearchResults()}</div>`;
  if(xUI.screen==='bookmarks')return `<h2 class="x-page-title">Your saved corner</h2><p class="x-subtitle">Keep the posts you want to come back to.</p>${xTimeline(xPosts().filter(p=>xData.bookmarks.includes(p.id)))}`;
  if(xUI.screen==='activity')return `<h2 class="x-page-title">Conversations you’re in</h2><p class="x-subtitle">Posts you’ve liked, reposted, or replied to.</p>${xTimeline(xPosts().filter(p=>xData.likes.includes(p.id)||xData.reposts.includes(p.id)||(xData.replies[p.id]||[]).length))}`;
  const user=xUsers[xUI.profile],own=xUI.profile===0,following=xData.following.includes(xUI.profile),posts=xPosts().filter(p=>p.user===xUI.profile||(own&&xData.reposts.includes(p.id)));
  return `<div class="x-profile-cover"></div><div class="x-profile"><div class="x-profile-top"><img src="${user.avatar}" alt="${user.name}">${own?'<button class="x-pill" onclick="xOpenModal(\'edit\')">Edit profile</button>':`<button class="x-pill ${following?'is-following':''}" onclick="xFollow(${xUI.profile})">${following?'Following ✓':'Follow'}</button>`}</div><h2>${user.name}</h2><p class="x-profile-handle">@${user.handle}</p><p class="x-profile-bio">${xEscape(own?xData.bio:'A little photo diary. Thoughts along the way.')}</p><div class="x-profile-stats"><span><b>${posts.length}</b> posts & reposts</span>${own?`<span><b>${xData.following.length}</b> following</span>`:''}</div></div><div class="x-profile-label">Posts</div>${xTimeline(posts)}`;
}
function xSearchResults(){
  if(!xUI.query.trim())return `<h2 class="x-page-title">Explore your circle</h2><p class="x-subtitle">Search people, captions, or a hashtag.</p>${['#LittleThings','#PhotoDiary','Seungwan','Joohyun'].map((q,i)=>`<button class="x-trend" onclick="xChooseSearch(${i})"><small>${i<2?'In your local timeline':'People in your circle'}</small><b>${q}</b></button>`).join('')}`;
  const q=xUI.query.toLowerCase();return xTimeline(xPosts().filter(p=>(p.text+' '+xUsers[p.user].name+' '+xUsers[p.user].handle).toLowerCase().includes(q)));
}
function xSearch(value){xUI.query=value;document.querySelector('.x-search-results').innerHTML=xSearchResults();}
function xChooseSearch(index){const value=['#LittleThings','#PhotoDiary','Seungwan','Joohyun'][index];document.querySelector('.x-search input').value=value;xSearch(value);}
function xNav(){return [['home','home','Home'],['explore','search','Explore'],['activity','bell','Your activity'],['bookmarks','save','Bookmarks'],['profile',null,'Your profile']].map(([screen,icon,label])=>`<button aria-label="${label}" ${xUI.screen===screen&&(screen!=='profile'||xUI.profile===0)?'aria-current="page"':''} onclick="xNavigate('${screen}')">${icon?xIcon(icon):'<img src="imgwr.jpg" alt="">'}</button>`).join('');}
function xOpenModal(modal,id=null){xUI.modal=modal;xUI.post=id;xRenderModal();}
function xCloseModal(){xUI.modal=null;xRenderModal();}
function xDraft(value){xUI.draft=value;document.querySelector('.x-draft-count').textContent=value.length+'/280';}
function xSelectPhoto(photo){xUI.photo=photo;xRenderModal();}
function xPublish(form){
  const text=form.elements.text.value.trim().slice(0,280);if(!text&&!xUI.photo)return;
  if(xUI.photo&&!PH.includes(xUI.photo))return;
  xData.posts.unshift({id:'local-'+Date.now()+'-'+Math.floor(Math.random()*1000000),user:0,text,photo:xUI.photo,likes:0,reposts:0});xPersist();xUI.draft='';xUI.photo=null;xNavigate('home');toast('Posted to your local timeline');
}
function xReply(form){const text=form.elements.reply.value.trim().slice(0,280),id=xUI.post;if(!text||!xGet(id))return;if(!xData.replies[id])xData.replies[id]=[];xData.replies[id].push(text);xPersist();xRefresh();}
function xRenderModal(){
  const mount=document.querySelector('.x-modal-mount');if(!mount)return;const modal=xUI.modal,p=xGet(xUI.post);
  if(!modal){mount.innerHTML='';return;}
  if(modal==='photo'&&p?.photo){mount.innerHTML=`<div class="x-lightbox" role="dialog" aria-label="Photo"><button aria-label="Close photo" onclick="xCloseModal()">×</button><img src="${p.photo}" alt="Photo by ${xUsers[p.user].name}"></div>`;return;}
  let title='',body='',footer='';
  if(modal==='compose'){
    title='New post';body=`<form onsubmit="event.preventDefault();xPublish(this)"><textarea class="x-compose-text" name="text" aria-label="Post text" placeholder="What’s happening?" maxlength="280" oninput="xDraft(this.value)">${xEscape(xUI.draft)}</textarea><div class="x-picker-label"><span>Attach a photo from your library</span><button type="button" onclick="xSelectPhoto(null)">Remove photo</button></div><div class="x-photo-picker">${PH.map((photo,i)=>`<button type="button" aria-label="Attach photo ${i+1}" aria-pressed="${photo===xUI.photo}" onclick="xSelectPhoto('${photo}')"><img src="${photo}" alt="" loading="lazy"></button>`).join('')}</div><div class="x-compose-footer"><output class="x-draft-count">${xUI.draft.length}/280</output><button class="x-submit" type="submit">Post locally</button></div><p class="x-local-note">Only saved in this browser. Nothing is published to X.</p></form>`;
  }else if(modal==='replies'&&p){title='Conversation';body=xPost(p)+(xData.replies[p.id]||[]).map(text=>`<div class="x-reply"><img class="x-avatar" src="imgwr.jpg" alt=""><p><b>${xUsers[0].name}</b>${xEscape(text)}</p></div>`).join('');footer='<form class="x-reply-form" onsubmit="event.preventDefault();xReply(this)"><input name="reply" aria-label="Write a reply" placeholder="Post your reply…" maxlength="280" required><button class="x-submit" type="submit">Reply</button></form>';
  }else if(modal==='edit'){title='Edit profile';body=`<form onsubmit="event.preventDefault();xData.bio=this.elements.bio.value.trim();xPersist();xCloseModal();xRefresh()"><label class="x-picker-label" for="x-bio">Bio</label><textarea id="x-bio" name="bio" class="x-compose-text" maxlength="160">${xEscape(xData.bio)}</textarea><button class="x-submit" type="submit">Save profile</button></form>`;
  }else{xUI.modal=null;mount.innerHTML='';return;}
  mount.innerHTML=`<div class="x-modal" onclick="if(event.target===this)xCloseModal()"><section class="x-sheet" role="dialog" aria-modal="true" aria-label="${title}" onkeydown="if(event.key==='Escape')xCloseModal()"><header class="x-sheet-header"><h2>${title}</h2><button aria-label="Close dialog" onclick="xCloseModal()">×</button></header><div class="x-sheet-body">${body}</div>${footer}</section></div>`;
}
function xApp(){return `<section class="x-screen" aria-label="X"><header class="x-header"><button aria-label="Your profile" onclick="xNavigate('profile')"><img class="x-avatar" src="imgwr.jpg" alt=""></button><h1 class="x-header-title">${xTitle()}</h1><button class="x-logo" aria-label="Home timeline" onclick="xNavigate('home')">𝕏</button></header><main class="x-main">${xContent()}</main><button class="x-fab" aria-label="Create a post" onclick="xOpenModal('compose')">${xIcon('compose')}</button><nav class="x-nav" aria-label="X navigation">${xNav()}</nav><div class="x-modal-mount"></div></section>`;}
ROOT.X=xApp;

// ./src/weather.js
/* Sample weather scenarios, not a live weather service. */
const weatherScenarios={
  sunny:{name:'Sunny',icon:'☀️',temp:27,high:29,low:23,feels:29,wind:9,gust:16,rain:5,mm:0,humidity:64,uv:6,visibility:12,hours:[23,25,27,29,28,25]},
  rain:{name:'Rain',icon:'🌧️',temp:24,high:27,low:22,feels:25,wind:18,gust:31,rain:85,mm:8,humidity:91,uv:2,visibility:5,hours:[22,23,24,26,25,23]},
  storm:{name:'Thunderstorm',icon:'⛈️',temp:23,high:25,low:21,feels:24,wind:32,gust:52,rain:95,mm:22,humidity:95,uv:1,visibility:2,hours:[21,22,23,24,23,22]},
};
const weatherWeek=[{day:'Mon',mode:'rain'},{day:'Tue',mode:'storm'},{day:'Wed',mode:'rain'},{day:'Thu',mode:'sunny'},{day:'Fri',mode:'sunny'},{day:'Sat',mode:'rain'},{day:'Sun',mode:'sunny'}];
const weatherUI={mode:'rain',unit:'C',day:0,trail:'woodland',checked:new Set()};
try{if(localStorage.getItem('weather-unit')==='F')weatherUI.unit='F';}catch{}
function weatherTemp(c){return Math.round(weatherUI.unit==='F'?c*9/5+32:c)+'°';}
function weatherHiking(mode=weatherUI.mode,trail=weatherUI.trail){
  if(mode==='storm')return {label:'Do not hike',tone:'stop',reason:'Thunderstorms and strong gusts make this scenario unsuitable for hiking. Postpone your trip. If thunder is heard, move into a substantial building or a hard-topped vehicle; no outdoor location is safe during a thunderstorm.'};
  if(mode==='rain')return {label:'Not recommended',tone:'caution',reason:'Rain, gusts and reduced visibility make this scenario less suitable for hiking. Wet ground can be slippery. Consider postponing, and check trail closures and local flood alerts before making plans.'};
  return {label:trail==='ridge'?'Extra caution':'More favourable',tone:trail==='ridge'?'caution':'good',reason:trail==='ridge'?'This sunny scenario has lighter wind, but an exposed ridge offers little shade or shelter. Account for UV exposure and changing mountain weather before choosing a route.':'Lighter wind and a low chance of rain make this scenario more favourable. Plan for sun exposure, carry water, and verify the current trail forecast and conditions before setting out.'};
}
function weatherChange(key,value){
  if(!['mode','trail','unit','day'].includes(key))return;
  if(key==='day'&&(!Number.isInteger(value)||!weatherWeek[value]))return;
  if(key==='mode'&&!weatherScenarios[value])return;
  if(key==='trail'&&!['woodland','ridge'].includes(value))return;
  if(key==='unit'&&!['C','F'].includes(value))return;
  const scroll=document.querySelector('.weather-content')?.scrollTop||0;
  weatherUI[key]=value;
  if(key==='mode')weatherUI.day=-1;
  if(key==='unit')try{localStorage.setItem('weather-unit',value);}catch{}
  paint();const content=document.querySelector('.weather-content');if(content)content.scrollTop=scroll;
}
function weatherSelectDay(index){weatherChange('day',index);}
function weatherCheck(index,checked){checked?weatherUI.checked.add(index):weatherUI.checked.delete(index);}
function weatherScene(){
  const mode=weatherUI.mode;
  const rain=mode==='sunny'?'':Array.from({length:mode==='storm'?42:28},(_,i)=>`<i class="weather-drop" style="--left:${(i*37)%101}%;--length:${18+i%5*7}px;--speed:${.7+i%8*.12}s;--delay:-${i*.31}s"></i>`).join('');
  return `<div class="weather-scene" aria-hidden="true">${mode==='sunny'?'<div class="weather-sun"></div>':''}<div class="weather-cloud"></div><div class="weather-cloud second"></div><svg class="weather-landscape" viewBox="0 0 400 700" preserveAspectRatio="none"><path d="M0 400 90 165 160 325 249 80 400 300V700H0Z" fill="#314e62"/><path d="m213 178 36-98 45 112-34-24-16 22Z" fill="#c5d1d6" opacity=".35"/><path d="M0 500 100 320 190 470 300 270 400 430V700H0Z" fill="#2c4a54"/><path d="M0 610Q100 470 190 560T400 505V700H0Z" fill="#1f3c45"/></svg>${rain}${mode==='storm'?'<div class="weather-lightning"></div>':''}</div>`;
}
function weatherView(){
  if(weatherUI.day>=0)weatherUI.mode=weatherWeek[weatherUI.day].mode;
  const w=weatherScenarios[weatherUI.mode],hike=weatherHiking();
  const hours=['06:00','09:00','12:00','15:00','18:00','21:00'];
  return `<section class="fx weather-app weather-${weatherUI.mode}" aria-label="Weather"><div>${weatherScene()}</div><main class="weather-content"><header class="weather-top"><span>WEATHER PREVIEW · SAMPLE DATA</span><button class="weather-unit" aria-label="Switch to degrees ${weatherUI.unit==='C'?'Fahrenheit':'Celsius'}" onclick="weatherChange('unit','${weatherUI.unit==='C'?'F':'C'}')">°${weatherUI.unit} ⇄</button></header><div class="weather-current"><h1>Lindenwell</h1><div class="weather-temperature">${weatherTemp(w.temp)}</div><p class="weather-description">${w.name}</p><div class="weather-high-low">H:${weatherTemp(w.high)} &nbsp; L:${weatherTemp(w.low)} · Feels like ${weatherTemp(w.feels)}</div></div><div class="weather-modes" aria-label="Preview weather conditions">${Object.entries(weatherScenarios).map(([key,s])=>`<button aria-pressed="${weatherUI.mode===key}" onclick="weatherChange('mode','${key}')">${s.icon} ${key==='storm'?'Storm':s.name}</button>`).join('')}</div>
  <section class="weather-glass"><h2 class="weather-card-heading">Hourly · sample day</h2><div class="weather-hourly">${hours.map((hour,i)=>`<div class="weather-hour"><small>${hour}</small><span class="weather-hour-icon" aria-label="${w.name}">${w.icon}</span><span>${weatherTemp(w.hours[i])}</span></div>`).join('')}</div></section>
  <section class="weather-glass"><div class="weather-hike-heading"><div><p class="weather-card-heading">Trail outlook</p><h2>Is it a hiking day?</h2></div><span class="weather-hike-symbol" aria-hidden="true">⛰</span></div><span class="weather-hike-status ${hike.tone}" role="status">${hike.label}</span><p class="weather-hike-copy">${hike.reason}</p><label class="weather-trail-label">Route type<select aria-label="Route type" onchange="weatherChange('trail',this.value)"><option value="woodland" ${weatherUI.trail==='woodland'?'selected':''}>Woodland trail</option><option value="ridge" ${weatherUI.trail==='ridge'?'selected':''}>Exposed ridge</option></select></label><div class="weather-factors"><span><small>Rain chance</small><b>${w.rain}%</b></span><span><small>Wind</small><b>${w.wind} km/h</b></span><span><small>Visibility</small><b>${w.visibility} km</b></span></div></section>
  <div class="weather-details"><section class="weather-glass"><h2 class="weather-card-heading">Wind</h2><p class="weather-metric">${w.wind} <span>km/h</span></p><p class="weather-metric-note">Gusts ${w.gust} km/h</p></section><section class="weather-glass"><h2 class="weather-card-heading">Rainfall</h2><p class="weather-metric">${w.mm} <span>mm</span></p><p class="weather-metric-note">Sample 24-hour total</p></section><section class="weather-glass"><h2 class="weather-card-heading">UV index</h2><p class="weather-metric">${w.uv}</p><p class="weather-metric-note">${w.uv>=6?'High · Plan sun protection':'Lower UV in this scenario'}</p></section><section class="weather-glass"><h2 class="weather-card-heading">Humidity</h2><p class="weather-metric">${w.humidity}<span>%</span></p><p class="weather-metric-note">${w.humidity>85?'Damp conditions':'Moisture in the air'}</p></section></div>
  <section class="weather-glass weather-week"><h2 class="weather-card-heading">Sample week · tap a day</h2>${weatherWeek.map((day,i)=>{const s=weatherScenarios[day.mode];return `<button class="weather-day" aria-label="${day.day}, ${s.name}" aria-pressed="${weatherUI.day===i}" onclick="weatherSelectDay(${i})"><span class="weather-day-name">${day.day}</span><span class="weather-day-icon">${s.icon}</span><span class="weather-day-low">${weatherTemp(s.low)}</span><span class="weather-day-range"></span><span>${weatherTemp(s.high)}</span></button>`;}).join('')}</section>
  <section class="weather-glass weather-checklist"><h2 class="weather-card-heading">Before you head out</h2>${['Check the current local forecast and alerts','Check trail access and conditions','Pack water, layers and sun protection','Share your route and return plan'].map((label,i)=>`<label class="weather-check"><input type="checkbox" ${weatherUI.checked.has(i)?'checked':''} onchange="weatherCheck(${i},this.checked)"><span>${label}</span></label>`).join('')}</section><p class="weather-info">Illustrative conditions, not a live forecast or a trail safety assessment. Use current local forecasts and land-manager advice.<br><a href="https://www.weather.gov/safety/lightning-outdoors" target="_blank" rel="noopener noreferrer">National Weather Service · Lightning safety ↗</a></p></main></section>`;
}
ROOT.weather=weatherView;

// ./src/calendar.js
/* Date and timezone use the visitor's device settings; no location permission needed. */
function calendarKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function calendarParse(key){const [year,month,day]=key.split('-').map(Number);return new Date(year,month-1,day,12);}
const calendarNow=new Date();
const calendarUI={year:calendarNow.getFullYear(),month:calendarNow.getMonth(),selected:calendarKey(calendarNow)};
let calendarEvents=[];
try{const saved=JSON.parse(localStorage.getItem('calendar-events')||'[]');if(Array.isArray(saved))calendarEvents=saved.filter(e=>e&&typeof e.id==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&typeof e.title==='string'&&typeof e.time==='string'&&typeof e.notes==='string');}catch{}
const calendarEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const calendarRequested = [
  {id:'request-dinner',date:'2026-11-06',title:'Dinner with Seungwan',time:'19:00',notes:'Riverside Hotel',seed:true},
  {id:'request-missing',date:'2026-07-21',title:"He's missing",time:'',notes:'',seed:true},
  ...Array.from({length:8},(_,i)=>({id:'request-night-'+(i+1),date:`2026-10-${12+i}`,title:'Working night shift',time:'Night shift',notes:`Night ${i+1} of 8 · 12–19 October`,seed:true})),
  {id:'request-house',date:'2026-11-07',title:'House viewing',time:'11:00',notes:'Saturday house viewing',seed:true},
];
function calendarPendingRequests(){return calendarRequested.filter(e=>e.pending&&!calendarEvents.some(event=>event.requestId===e.id));}
function calendarTimeLabel(time){if(!/^\d{2}:\d{2}$/.test(time))return time||'All day';const [h,m]=time.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`;}
function calendarAllEvents(){
  const year=calendarUI.year,original=[];
  for(const key of Object.keys(EV)){
    const [month,day]=key.split('-').map(Number);
    for(const [i,e] of EV[key].entries())original.push({id:'original-'+key+'-'+i,date:calendarKey(new Date(/birthday/i.test(e[0])?year:2024,month,day,12)),title:e[0],time:e[1]==='All day'?'':e[1],notes:/birthday/i.test(e[0])?'Birthday · repeats yearly':'Original calendar event',seed:true});
  }
  return [...original,...calendarRequested.filter(e=>!e.pending),...calendarEvents,...calendarPendingRequests()].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.time||'').localeCompare(b.time||''));
}
function calendarEventList(){const events=calendarAllEvents();return `<section class="calendar-all-events"><div class="calendar-agenda-heading"><h2>All events</h2><span>${events.length} events</span></div>${events.map(e=>`<article class="calendar-event"><div class="calendar-event-date">${e.date?`<button onclick="calendarSelect('${e.date}')" aria-label="Show event date">${calendarEscape(calendarParse(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'}))}<small>${calendarParse(e.date).getFullYear()}</small></button>`:'<span>Date to<small>confirm</small></span>'}</div><div class="calendar-event-body"><h3>${calendarEscape(e.title)}</h3><p>${e.time?calendarTimeLabel(e.time)+' · ':''}${calendarEscape(e.notes)}</p>${e.pending?`<button class="calendar-schedule" onclick="go(()=>calendarEditor('${e.id}'))">Set date</button>`:''}</div>${!e.seed&&!e.pending?`<button class="calendar-delete" aria-label="Delete event" onclick="calendarDelete('${e.id}')">×</button>`:''}</article>`).join('')}</section>`;}
function calendarZone(){return Intl.DateTimeFormat().resolvedOptions().timeZone||'Device local time';}
function calendarSeedEvents(date){
  const entries=EV[date.getMonth()+'-'+date.getDate()]||[];
  return entries.filter(e=>/birthday/i.test(e[0])||date.getFullYear()===2024).map((e,i)=>({id:'seed-'+i,title:e[0],time:e[1]==='All day'?'':e[1],notes:/birthday/i.test(e[0])?'Birthday · repeats yearly':'Original calendar event',seed:true}));
}
function calendarEventsFor(key){return [...calendarSeedEvents(calendarParse(key)),...calendarRequested.filter(e=>!e.pending&&e.date===key),...calendarEvents.filter(e=>e.date===key)].sort((a,b)=>(a.time||'').localeCompare(b.time||''));}
function calendarSelect(key){const date=calendarParse(key);calendarUI.selected=key;calendarUI.year=date.getFullYear();calendarUI.month=date.getMonth();paint();}
function calendarMove(offset){const date=new Date(calendarUI.year,calendarUI.month+offset,1,12);const selectedDay=calendarParse(calendarUI.selected).getDate();const max=new Date(date.getFullYear(),date.getMonth()+1,0,12).getDate();date.setDate(Math.min(selectedDay,max));calendarSelect(calendarKey(date));}
function calendarToday(){calendarSelect(calendarKey(new Date()));}
function calendarDelete(id){calendarEvents=calendarEvents.filter(e=>e.id!==id);calendarStore();paint();}
function calendarStore(){try{localStorage.setItem('calendar-events',JSON.stringify(calendarEvents));}catch{}}
function calendarCreate(form){
  const title=form.elements.eventTitle.value.trim().slice(0,100),date=form.elements.date.value,time=form.elements.allDay.checked?'':form.elements.time.value,notes=form.elements.notes.value.trim().slice(0,500);
  if(!title||!/^\d{4}-\d{2}-\d{2}$/.test(date)||calendarKey(calendarParse(date))!==date)return;
  const requestId=form.elements.requestId?.value||'',nights=requestId==='request-night'?7:1;
  for(let i=0;i<nights;i++){
    const day=calendarParse(date);day.setDate(day.getDate()+i);
    calendarEvents.push({id:'event-'+Date.now()+'-'+Math.floor(Math.random()*1000000),title,date:calendarKey(day),time,notes:nights===7?`Night ${i+1} of 7${notes?' · '+notes:''}`:notes,requestId});
  }
  calendarStore();
  const selected=calendarParse(date);calendarUI.selected=date;calendarUI.year=selected.getFullYear();calendarUI.month=selected.getMonth();back();
}
function calendarEditor(requestId=''){const request=calendarPendingRequests().find(e=>e.id===requestId);return `<div class="calendar-page"><button class="calendar-back" onclick="back()">‹ Calendar</button><header class="calendar-top"><div><p>Make a little time</p><h1>New event</h1></div></header><form class="calendar-form" onsubmit="event.preventDefault();calendarCreate(this)"><input type="hidden" name="requestId" value="${request?.id||''}"><label for="calendar-title">Title</label><input id="calendar-title" name="eventTitle" placeholder="What’s the plan?" value="${calendarEscape(request?.title||'')}" maxlength="100" required><label for="calendar-date">Date</label><input id="calendar-date" type="date" name="date" value="${request?'':calendarUI.selected}" min="1900-01-01" max="9999-12-31" required><label class="calendar-checkbox"><input type="checkbox" name="allDay" ${request?.id==='request-night'?'checked':''} onchange="this.form.elements.time.disabled=this.checked">All-day event</label><label for="calendar-time">Time</label><input id="calendar-time" type="time" name="time" value="${request?.time||'09:00'}" ${request?.id==='request-night'?'disabled':''}><label for="calendar-notes">Notes</label><textarea id="calendar-notes" name="notes" placeholder="Anything to remember…" maxlength="500">${calendarEscape(request?.id==='request-night'?'Night shift':request?.id==='request-house'?'Saturday house viewing':'')}</textarea><button class="calendar-save" type="submit">Save event</button></form><p class="calendar-note">Events are saved locally in this browser. Dates use ${calendarEscape(calendarZone())}.</p></div>`;}
function calendarView(){
  const now=new Date(),today=calendarKey(now),first=new Date(calendarUI.year,calendarUI.month,1,12),selected=calendarParse(calendarUI.selected),events=calendarEventsFor(calendarUI.selected);
  const start=new Date(calendarUI.year,calendarUI.month,1-first.getDay(),12);
  const cells=Array.from({length:42},(_,i)=>{const date=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i,12),key=calendarKey(date),outside=date.getMonth()!==calendarUI.month;return `<button class="calendar-cell${outside?' is-outside':''}${key===today?' is-today':''}${key===calendarUI.selected?' is-selected':''}" aria-label="${calendarEscape(date.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'}))}" aria-pressed="${key===calendarUI.selected}" ${key===today?'aria-current="date"':''} onclick="calendarSelect('${key}')"><span>${date.getDate()}</span>${calendarEventsFor(key).length?'<i aria-hidden="true"></i>':''}</button>`;}).join('');
  const weekdays=Array.from({length:7},(_,i)=>new Date(2024,0,7+i,12).toLocaleDateString(undefined,{weekday:'short'}));
  return `<div class="calendar-page"><header class="calendar-top"><div><p>Your days, thoughtfully planned</p><h1>Calendar</h1></div><button class="calendar-add" aria-label="Add event" onclick="go(()=>calendarEditor())"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></header><p class="calendar-zone"><span></span>${calendarEscape(calendarZone().replaceAll('_',' '))} · Device local time</p><div class="calendar-month-heading"><div><h2>${first.toLocaleDateString(undefined,{month:'long'})}</h2><p>${calendarUI.year}</p></div><div class="calendar-month-controls"><button class="calendar-today" onclick="calendarToday()">Today</button><button aria-label="Previous month" onclick="calendarMove(-1)">‹</button><button aria-label="Next month" onclick="calendarMove(1)">›</button></div></div><section class="calendar-month-card" aria-label="Month calendar"><div class="calendar-weekdays">${weekdays.map(day=>`<span>${calendarEscape(day)}</span>`).join('')}</div><div class="calendar-days">${cells}</div></section><div class="calendar-legend"><span><i></i>Event scheduled</span><span>Tap a date to see your plans</span></div><section><div class="calendar-agenda-heading"><h2>${calendarUI.selected===today?'Today':selected.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</h2><span>${events.length} event${events.length===1?'':'s'}</span></div>${events.length?events.map(e=>`<article class="calendar-event"><time>${calendarEscape(e.requestId==='request-night'?'Night shift':calendarTimeLabel(e.time))}</time><div class="calendar-event-body"><h3>${calendarEscape(e.title)}</h3>${e.notes?`<p>${calendarEscape(e.notes)}</p>`:''}</div>${!e.seed?`<button class="calendar-delete" aria-label="Delete ${calendarEscape(e.title)}" onclick="calendarDelete('${e.id}')">×</button>`:''}</article>`).join(''):'<div class="calendar-empty"><span>☷</span><h3>A little breathing room</h3><p>No plans for this day.<br>Leave it open, or make it memorable.</p><button onclick="go(()=>calendarEditor())">+ Add a plan</button></div>'}</section>${calendarEventList()}<p class="calendar-note">The app icon follows your device’s local day and date, and updates when you return or the date changes.</p></div>`;
}
let calendarLastDate='',calendarLastZone='';
function calendarUpdateIcon(){
  const now=new Date(),key=calendarKey(now),zone=calendarZone(),icon=document.querySelector(".ap[onclick*=\"'calendar'\"] .ico");
  if(icon){icon.classList.add('calendar-live-icon');icon.innerHTML=`<span class="calendar-icon-weekday">${calendarEscape(now.toLocaleDateString(undefined,{weekday:'short'}).toLocaleUpperCase())}</span><span class="calendar-icon-date">${now.getDate()}</span>`;icon.parentElement.setAttribute('aria-label','Calendar, '+now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}));}
  if((calendarLastDate&&calendarLastDate!==key)||(calendarLastZone&&calendarLastZone!==zone)){
    if(calendarUI.selected===calendarLastDate){calendarUI.selected=key;calendarUI.year=now.getFullYear();calendarUI.month=now.getMonth();}
    if(document.querySelector('.calendar-days'))paint();
  }
  calendarLastDate=key;calendarLastZone=zone;
}
ROOT.calendar=calendarView;
calendarUpdateIcon();
setInterval(calendarUpdateIcon,30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)calendarUpdateIcon();});
window.addEventListener('focus',calendarUpdateIcon);

// iPhone-style Mail. Existing messages and local drafts; no email is sent.
const mailData={read:[],starred:[],archived:[],drafts:[],categories:{}};
const mailCategoryNames={all:'All Mail',primary:'Primary',transactions:'Transactions',updates:'Updates',promotions:'Promotions'};
try{
 const stored=JSON.parse(localStorage.getItem('mail-local')||'{}');
 for(const key of ['read','starred','archived'])if(Array.isArray(stored[key]))mailData[key]=stored[key].filter(i=>Number.isInteger(i)&&i>=0&&i<ML.length);
 if(Array.isArray(stored.drafts))mailData.drafts=stored.drafts.filter(d=>d&&/^draft-\d+-\d+$/.test(d.id)&&['to','subject','body'].every(k=>typeof d[k]==='string'));
 if(stored.categories&&typeof stored.categories==='object')for(const [id,category]of Object.entries(stored.categories))if(ML[Number(id)]&&['primary','transactions','updates','promotions'].includes(category))mailData.categories[id]=category;
}catch{}
const mailUI={folder:'inbox',filter:'all',query:'',category:'all',layout:'categories',panel:null,details:false};
const mailEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mailPlain(body){return body.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'');}
function mailPersist(){try{localStorage.setItem('mail-local',JSON.stringify(mailData));}catch{}}
function mailIcon(name){const paths={inbox:'<path d="M5 3h14l3 13v5H2v-5ZM2 16h6l2 3h4l2-3h6"/>',archive:'<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v13h14V8M9 12h6"/>',draft:'<path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h5"/>',compose:'<path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M16 3l5 5M10 14l1-5 8-8 4 4-8 8Z"/>',star:'<path d="M5 22V3m0 1c5-5 9 5 15 0v10c-6 5-10-5-15 0"/>',read:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',back:'<path d="m15 4-8 8 8 8"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',filter:'<circle cx="12" cy="12" r="9"/><path d="M7 9h10M9 13h6M11 17h2"/>',more:'<circle cx="5" cy="12" r=".8"/><circle cx="12" cy="12" r=".8"/><circle cx="19" cy="12" r=".8"/>',primary:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',transactions:'<path d="M3 3h2l3 13h11l3-10H6M9 21h.01M18 21h.01"/>',updates:'<path d="M21 11a9 9 0 0 1-9 9H4l1-4A9 9 0 1 1 21 11Z"/>',promotions:'<path d="m3 9 18-6v18L3 15ZM7 16l2 6h4l-2-5"/>',reply:'<path d="m9 4-7 7 7 7M2 11h11c5 0 8 3 8 9"/>',up:'<path d="m5 15 7-7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.read}</svg>`;}
function mailTitle(){return {inbox:'Inbox',archive:'Archive',drafts:'Drafts',starred:'Flagged',unread:'Unread'}[mailUI.folder]||'Inbox';}
function mailFolder(folder){mailUI.folder=folder;mailUI.filter='all';mailUI.query='';mailUI.category='all';mailUI.panel=null;st[st.length-1]=mailHome;paint();}
function mailShowMailboxes(){mailUI.panel=null;st[st.length-1]=mailMailboxes;paint();}
function mailToggle(key,index){if(!['read','starred','archived'].includes(key)||!ML[index])return;const i=mailData[key].indexOf(index);i<0?mailData[key].push(index):mailData[key].splice(i,1);mailPersist();paint();}
function mailOpen(index){if(!ML[index])return;if(!mailData.read.includes(index)){mailData.read.push(index);mailPersist();}mailUI.panel=null;mailUI.details=false;go(()=>mailReader(index));}
function mailCategory(index){return mailData.categories[index]||'primary';}
function mailSetCategory(index,category){if(!ML[index]||!['primary','transactions','updates','promotions'].includes(category))return;mailData.categories[index]=category;mailPersist();paint();}
function mailMatches(){const words=mailUI.query.trim().toLowerCase().split(/\s+/).filter(Boolean);return ML.map((_,i)=>i).filter(i=>{
 const inFolder=mailUI.folder==='archive'?mailData.archived.includes(i):mailUI.folder==='starred'?mailData.starred.includes(i):mailUI.folder==='unread'?!mailData.read.includes(i):!mailData.archived.includes(i);
 return inFolder&&(mailUI.filter!=='unread'||!mailData.read.includes(i))&&(mailUI.filter!=='starred'||mailData.starred.includes(i))&&(mailUI.folder!=='inbox'||mailUI.layout==='list'||mailUI.category==='all'||mailCategory(i)===mailUI.category)&&words.every(word=>ML[i].join(' ').toLowerCase().includes(word));
 });}
function mailAvatar(index){const initials=ML[index][0].split(' ').slice(0,2).map(s=>s[0]).join('');return `<span class="mail-sender-avatar sender-${index%2}">${mailEscape(initials)}</span>`;}
function mailCards(){
 if(mailUI.folder==='drafts'){const drafts=mailData.drafts.filter(d=>(d.to+' '+d.subject+' '+d.body).toLowerCase().includes(mailUI.query.toLowerCase()));return drafts.length?drafts.map(d=>`<article class="mail-card"><span class="mail-dot-slot"></span><span class="mail-sender-avatar sender-draft">${mailIcon('draft')}</span><button class="mail-open" onclick="go(()=>mailComposer('${d.id}'))"><div class="mail-card-meta"><b>${mailEscape(d.to||'No Recipient')}</b><time>Draft</time><span>›</span></div><h2>${mailEscape(d.subject||'No Subject')}</h2><p>${mailEscape(d.body||'Continue writing…')}</p></button><button class="mail-draft-delete" aria-label="Delete draft" onclick="mailDeleteDraft('${d.id}')">${mailIcon('close')}</button></article>`).join(''):'<div class="mail-empty">'+mailIcon('draft')+'<h2>No Drafts</h2><p>Tap compose to start a new draft.</p></div>';}
 const matches=mailMatches();return matches.length?matches.map(i=>{const m=ML[i],unread=!mailData.read.includes(i),flagged=mailData.starred.includes(i);return `<article class="mail-card${unread?' is-unread':''}"><span class="mail-dot-slot">${unread?'<i class="mail-dot" aria-label="Unread"></i>':''}</span>${mailAvatar(i)}<button class="mail-open" onclick="mailOpen(${i})"><div class="mail-card-meta"><b>${mailEscape(m[0])}</b><time>${mailEscape(m[2])}</time><span>›</span></div><h2>${mailEscape(m[1])}</h2><p>${mailEscape(mailPlain(m[3]))}</p></button><button class="mail-row-flag" aria-label="${flagged?'Unflag':'Flag'} message" aria-pressed="${flagged}" onclick="mailToggle('starred',${i})">${mailIcon('star')}</button></article>`;}).join(''):`<div class="mail-empty">${mailIcon('inbox')}<h2>${mailUI.query?'No Results':'No Mail'}</h2><p>${mailUI.query?'Try a different search.':'There are no messages in this view.'}</p></div>`;
}
function mailVisibleCount(){return mailUI.folder==='drafts'?mailData.drafts.filter(d=>(d.to+' '+d.subject+' '+d.body).toLowerCase().includes(mailUI.query.toLowerCase())).length:mailMatches().length;}
function mailSearch(query){mailUI.query=query;document.querySelector('.mail-results').innerHTML=mailCards();const count=document.querySelector('.mail-live-count');if(count){const total=mailVisibleCount();count.textContent=`${total} message${total===1?'':'s'} · Stored on this device`;}}
function mailPanel(panel){mailUI.panel=mailUI.panel===panel?null:panel;paint();}
function mailMarkAllRead(){mailData.read=ML.map((_,i)=>i);mailPersist();paint();}
function mailCategoryBar(){return `<nav class="mail-categories" aria-label="Mail categories">${Object.entries(mailCategoryNames).map(([key,label])=>`<button class="mail-category category-${key}" aria-pressed="${mailUI.category===key}" onclick="mailUI.category='${key}';paint()"><span>${mailIcon(key==='all'?'read':key)}</span><small>${label}</small></button>`).join('')}</nav>`;}
function mailToolbar(){return `<footer class="mail-toolbar"><div class="mail-toolbar-row"><button class="mail-glass-button ${mailUI.filter!=='all'?'is-active':''}" aria-label="Filter messages" onclick="mailPanel('filter')">${mailIcon('filter')}</button><label class="mail-search">${mailIcon('search')}<input aria-label="Search mail" placeholder="Search" value="${mailEscape(mailUI.query)}" oninput="mailSearch(this.value)"></label><button class="mail-glass-button" aria-label="Compose draft" onclick="go(()=>mailComposer())">${mailIcon('compose')}</button></div></footer>`;}
function mailHome(){const total=mailVisibleCount();return `<section class="mail-app" aria-label="Mail"><header class="mail-top"><button class="mail-back" onclick="mailShowMailboxes()">${mailIcon('back')}Mailboxes</button><button class="mail-glass-button" aria-label="Inbox options" onclick="mailPanel('options')">${mailIcon('more')}</button></header><main class="mail-content"><h1 class="mail-title">${mailTitle()}</h1>${mailUI.folder==='inbox'&&mailUI.layout==='categories'?mailCategoryBar():''}${mailUI.filter!=='all'?`<p class="mail-filter-caption">Filtered by: ${mailUI.filter==='unread'?'Unread':'Flagged'}</p>`:''}<div class="mail-results">${mailCards()}</div><p class="mail-local-note mail-live-count">${total} message${total===1?'':'s'} · Stored on this device</p></main>${mailToolbar()}${mailSheet()}</section>`;}
function mailMailboxes(){const rows=[['inbox','inbox','Inbox',ML.filter((_,i)=>!mailData.archived.includes(i)).length],['unread','read','Unread',ML.filter((_,i)=>!mailData.read.includes(i)).length],['starred','star','Flagged',mailData.starred.length],['drafts','draft','Drafts',mailData.drafts.length],['archive','archive','Archive',mailData.archived.length]];return `<section class="mail-app mail-mailboxes"><header class="mail-top"><span></span><button aria-label="Compose draft" class="mail-glass-button" onclick="go(()=>mailComposer())">${mailIcon('compose')}</button></header><main class="mail-content"><h1 class="mail-title">Mailboxes</h1><div class="mail-mailbox-list">${rows.map(([folder,icon,label,count])=>`<button class="mail-mailbox-row" onclick="mailFolder('${folder}')"><span>${mailIcon(icon)}</span><b>${label}</b><small>${count}</small><i>›</i></button>`).join('')}</div><p class="mail-storage-caption">On this device</p></main><footer class="mail-toolbar"><p class="mail-local-note">Your existing messages and drafts, saved locally.</p></footer></section>`;}
function mailSheet(index=null){const panel=mailUI.panel;if(!panel)return '';let title='',body='';
 if(panel==='options'){title='Inbox Options';body=`<div class="mail-choice-row">${[['categories','Categories'],['list','List View']].map(([key,label])=>`<button aria-pressed="${mailUI.layout===key}" onclick="mailUI.layout='${key}';paint()">${label}</button>`).join('')}</div><button class="mail-menu-row" onclick="mailMarkAllRead()">Mark All as Read ${mailIcon('read')}</button>`;}
 else if(panel==='filter'){title='Filter Mail';body=[['all','All Messages'],['unread','Unread'],['starred','Flagged']].map(([key,label])=>`<button class="mail-menu-row" aria-pressed="${mailUI.filter===key}" onclick="mailUI.filter='${key}';paint()">${label}<span>${mailUI.filter===key?'✓':''}</span></button>`).join('');}
 else if(panel==='message'&&ML[index]){title='Message Options';body=`<p class="mail-sheet-label">CATEGORY FOR THIS SENDER</p>${['primary','transactions','updates','promotions'].map(key=>`<button class="mail-menu-row" aria-pressed="${mailCategory(index)===key}" onclick="mailSetCategory(${index},'${key}')">${mailCategoryNames[key]}<span>${mailCategory(index)===key?'✓':''}</span></button>`).join('')}<button class="mail-menu-row" onclick="mailToggle('read',${index})">Mark as ${mailData.read.includes(index)?'Unread':'Read'}${mailIcon('read')}</button>`;}
 else{return '';}
 return `<div class="mail-modal" onclick="if(event.target===this){mailUI.panel=null;paint()}"><section class="mail-sheet" role="dialog" aria-modal="true" aria-label="${title}"><header><h2>${title}</h2><button class="mail-glass-button" aria-label="Close options" onclick="mailUI.panel=null;paint()">${mailIcon('close')}</button></header><div class="mail-sheet-body">${body}</div></section></div>`;
}
function mailReaderStep(index,step){const next=mailMatches()[mailMatches().indexOf(index)+step];if(next!==undefined){if(!mailData.read.includes(next))mailData.read.push(next);mailPersist();mailUI.panel=null;st[st.length-1]=()=>mailReader(next);paint();}}
function mailReader(index){const m=ML[index];if(!m)return mailHome();const flagged=mailData.starred.includes(index),archived=mailData.archived.includes(index),matches=mailMatches(),position=matches.indexOf(index);return `<section class="mail-app mail-reader"><header class="mail-top"><button class="mail-glass-button" aria-label="Back to inbox" onclick="mailUI.panel=null;back()">${mailIcon('back')}</button><div class="mail-reader-top-actions"><button aria-label="Previous message" onclick="mailReaderStep(${index},-1)" ${position<=0?'disabled':''}>${mailIcon('up')}</button><button aria-label="Next message" onclick="mailReaderStep(${index},1)" ${position<0||position>=matches.length-1?'disabled':''}>${mailIcon('down')}</button><button class="mail-glass-button" aria-label="Message options" onclick="mailPanel('message')">${mailIcon('more')}</button></div></header><main class="mail-content"><h1 class="mail-subject">${mailEscape(m[1])}</h1><div class="mail-reader-sender">${mailAvatar(index)}<button class="mail-sender-details" aria-expanded="${mailUI.details}" onclick="mailUI.details=!mailUI.details;paint()"><b>${mailEscape(m[0])}</b><small>To: Bae Joohyun <span>›</span></small></button></div><p class="mail-message-date">${mailEscape(m[2])}</p>${mailUI.details?`<div class="mail-detail-card"><p><b>From:</b> ${mailEscape(m[0])}</p><p><b>To:</b> Bae Joohyun</p><p><b>Category:</b> ${mailCategoryNames[mailCategory(index)]}</p></div>`:''}<article class="mail-message-body">${mailEscape(mailPlain(m[3])).replace(/\n/g,'<br>')}</article></main><footer class="mail-reader-toolbar"><button class="mail-glass-button" aria-label="${archived?'Move to Inbox':'Archive message'}" onclick="mailToggle('archived',${index});mailUI.panel=null;back()">${mailIcon('archive')}</button><button class="mail-glass-button mail-flag-button" aria-label="${flagged?'Unflag':'Flag'} message" aria-pressed="${flagged}" onclick="mailToggle('starred',${index})">${mailIcon('star')}</button><button class="mail-glass-button" aria-label="Mark ${mailData.read.includes(index)?'unread':'read'}" onclick="mailToggle('read',${index})">${mailIcon('read')}</button><button class="mail-glass-button" aria-label="Reply with a draft" onclick="go(()=>mailComposer(null,${index}))">${mailIcon('reply')}</button><button class="mail-glass-button" aria-label="New draft" onclick="go(()=>mailComposer())">${mailIcon('compose')}</button></footer>${mailSheet(index)}</section>`;}
function mailDeleteDraft(id){mailData.drafts=mailData.drafts.filter(d=>d.id!==id);mailPersist();paint();}
function mailSaveDraft(form,id){const draft={id:id||'draft-'+Date.now()+'-'+Math.floor(Math.random()*1000000),to:form.elements.recipient.value.trim().slice(0,200),subject:form.elements.subject.value.trim().slice(0,200),body:form.elements.body.value.slice(0,10000)};if(!draft.to&&!draft.subject&&!draft.body.trim()){toast('Write something before saving');return;}mailData.drafts=[draft,...mailData.drafts.filter(d=>d.id!==draft.id)];mailPersist();mailUI.folder='drafts';mailUI.panel=null;back();toast('Draft saved locally');}
function mailComposer(id=null,replyIndex=null){const reply=ML[replyIndex],draft=mailData.drafts.find(d=>d.id===id)||{to:reply?reply[0]:'',subject:reply?'Re: '+reply[1]:'',body:''};return `<section class="mail-app mail-composer"><header class="mail-top"><button onclick="back()">Cancel</button><span class="mail-compose-label">Draft</span><button class="mail-done" type="submit" form="mail-compose-form">Done</button></header><main class="mail-content"><h1 class="mail-compose-title">${mailEscape(draft.subject||(reply?'Reply':'New Message'))}</h1><form id="mail-compose-form" class="mail-compose-form" onsubmit="event.preventDefault();mailSaveDraft(this,${id?`'${id}'`:'null'})"><div class="mail-compose-field"><label for="mail-to">To:</label><input id="mail-to" name="recipient" aria-label="Recipient" value="${mailEscape(draft.to)}" placeholder="Name or email" maxlength="200"></div><div class="mail-compose-field"><label for="mail-subject">Subject:</label><input id="mail-subject" name="subject" value="${mailEscape(draft.subject)}" placeholder="Subject" maxlength="200"></div><textarea name="body" aria-label="Message body" placeholder="" maxlength="10000">${mailEscape(draft.body)}</textarea></form></main><footer class="mail-toolbar"><p class="mail-local-note">Done saves a local draft. No email is sent.</p></footer></section>`;}
ROOT.mail=mailHome;

// ./src/notes-data.js
const notesEarlier = [
  {
    "id": "earlier-01",
    "title": "Things to remember about Seungwan",
    "body": "- Doesn't like being called Your Grace.\n- Drinks coffee even when she says she's cutting down.\n- Forgets her glasses but never forgets anybody's birthday.\n- Checks her emails before breakfast. Grandma hates this.\n- Hates being late.\n- Pretends she isn't tired when she's clearly exhausted.\n- Leaves cupboard doors open.\n- Doesn't like asking for help.\n- Likes having someone beside her when she's working. Says she doesn't, but she does.\n\nShe has a scar near her hairline. I haven't asked how she got it.\n\nI want to know everything about her.\n\nNot because of who she looks like.\n\nBecause she's Seungwan."
  },
  {
    "id": "earlier-02",
    "title": "Things I shouldn't forget",
    "body": "The first time I saw her, she was standing by the river.\n\nI ran toward her without thinking. I was so sure it was him.\n\nShe looked frightened when I hugged her. She didn't know who I was.\n\nI remember being angry when she asked me to let go.\n\nShe was a stranger. I had no right to expect anything from her.\n\nShe still helped me.\n\nI don't know what would have happened if she hadn't."
  },
  {
    "id": "earlier-03",
    "title": "Her family",
    "body": "Grandpa likes to pretend he's strict.\n\nGrandma knows exactly when Seungwan is lying about how much work she's done.\n\nYeri steals food from everybody's plates and leaves her things in the wrong rooms.\n\nJoy knows Seungwan's schedule better than Seungwan does.\n\nSeulgi talks too much. Seungwan says that, but she listens to everything.\n\nMrs. Han always makes enough food for another person.\n\nNobody has asked me when I'm leaving.\n\nSometimes that makes me uncomfortable.\n\nMost of the time, I'm grateful."
  },
  {
    "id": "earlier-04",
    "title": "Medical licensing",
    "body": "Documents to prepare:\n\n- Previous academic records\n- Clinical training history\n- Registration papers\n- Assessment application\n- Examination materials\n- Copies of everything\n\nSeungwan called the office again today.\n\nI asked her to stop doing things for me.\n\nShe said she wasn't doing the work for me. She was just making sure somebody actually read my application.\n\nI know she means well.\n\nI wish I could explain how frightening it is to have nothing here that proves the person I used to be.\n\nShe doesn't treat me like I'm nobody.\n\nThat's probably why I keep letting her help."
  },
  {
    "id": "earlier-05",
    "title": "Little things",
    "body": "She moves her plate closer to me when there's something she thinks I'll like.\n\nShe stands on the outside when we walk beside traffic.\n\nShe knocks before entering my room, even when the door is open.\n\nShe remembers which tea I prefer.\n\nLast night she left a book outside my door because I'd mentioned wanting to read it.\n\nI hadn't asked her to find it.\n\nShe remembered anyway."
  },
  {
    "id": "earlier-06",
    "title": "I miss him",
    "body": "I haven't opened his messages for four days.\n\nThat sounds terrible when I write it down.\n\nI used to read them every night. Sometimes I'd scroll back to conversations about absolutely nothing, just to remember what it felt like to have him around.\n\nToday I was having dinner with Seungwan and I laughed so hard I nearly spilled my drink.\n\nIt took me hours to realize I hadn't thought of him once.\n\nI don't know what that means.\n\nI don't know why being happy makes me feel guilty."
  },
  {
    "id": "earlier-07",
    "title": "About her",
    "body": "She isn't him.\n\nThey have similar faces. Sometimes they make the same expression when they're annoyed. Their voices are close enough that I still turn too quickly when she calls my name.\n\nBut he liked sleeping late. She wakes before her alarm.\n\nHe hated paperwork. She practically lives with it.\n\nHe would have laughed when I got lost. She came to find me.\n\nI keep discovering things that belong only to her.\n\nI think I like that more than I should."
  },
  {
    "id": "earlier-08",
    "title": "The first time",
    "body": "She kissed me today.\n\nI kissed her back.\n\nWe sat in the garden afterward, and she asked whether I was alright.\n\nI said yes.\n\nShe didn't seem convinced.\n\nI wanted to kiss her again, but I was afraid she'd think I'd changed my mind about everything I told her before.\n\nI haven't.\n\nI just don't know how to explain that I can miss somebody and still want to be with somebody else."
  },
  {
    "id": "earlier-09",
    "title": "Things I noticed this week",
    "body": "Monday: She fell asleep reading a report.\n\nTuesday: She left without breakfast. I packed something for her.\n\nWednesday: She called during lunch to ask if I'd eaten. I hadn't.\n\nThursday: She stayed up helping me review my documents.\n\nFriday: She came home early.\n\nSaturday: We spent most of the morning doing nothing.\n\nSunday: She asked if I wanted to go somewhere with her.\n\nI said it didn't matter where.\n\nIt really didn't."
  },
  {
    "id": "earlier-10",
    "title": "The pen",
    "body": "She gave me a pen with my name engraved on it.\n\nSaid I was always losing mine.\n\nI told her that putting my name on it wouldn't stop me from losing it.\n\nShe said it might improve the odds.\n\nI've been using it for everything.\n\nI think she noticed."
  },
  {
    "id": "earlier-11",
    "title": "When she's away",
    "body": "Things to tell Seungwan when she calls:\n\n- Yeri passed her assessment.\n- Grandma asked about her three times.\n- The licensing office finally replied.\n- Seulgi took the last slice of cake.\n- I fixed the loose handle in the kitchen.\n- Her glasses are on the desk. Again.\n\nAsk if she ate.\n\nAsk when she's coming home.\n\nDon't ask too many times.\n\nShe already knows I miss her."
  },
  {
    "id": "earlier-12",
    "title": "Her side of the bed",
    "body": "She sleeps badly when she's stressed.\n\nSometimes I wake up because she's sitting against the headboard answering messages.\n\nShe says she'll be finished in five minutes.\n\nIt's never five minutes.\n\nLast night I took her phone and put it on my bedside table.\n\nShe complained.\n\nThen she moved closer and fell asleep with her arm around me.\n\nI didn't sleep for another twenty minutes because her hand was trapped beneath my back.\n\nI didn't want to wake her."
  },
  {
    "id": "earlier-13",
    "title": "A normal day",
    "body": "We went grocery shopping.\n\nShe insisted we didn't need a list.\n\nWe bought milk, bread, vegetables, and three things Yeri had asked for.\n\nWe forgot the eggs.\n\nWe went back.\n\nSeungwan said the entire trip would have been faster if she'd gone alone.\n\nI told her she could try that next time.\n\nShe held my hand all the way to the car.\n\nI don't think she realized she was doing it."
  },
  {
    "id": "earlier-14",
    "title": "Things she says",
    "body": "\"Did you eat?\"\n\n\"Take a jacket.\"\n\n\"Call me when you finish.\"\n\n\"You can't live on coffee.\"\n\n\"Five more minutes.\"\n\n\"I know what I'm doing.\"\n\n\"Where did I put my glasses?\"\n\n\"Come here.\"\n\nI used to find some of these annoying.\n\nNow I wait to hear them."
  },
  {
    "id": "earlier-15",
    "title": "Things I'm afraid to tell her",
    "body": "Sometimes I wake up and check that she's still beside me.\n\nI haven't told her why.\n\nI spent two years waking up and remembering that somebody wasn't coming home.\n\nThere are mornings when I hear her moving around the room and I still need a few seconds to believe she's here.\n\nI don't think she knows how much it helps when she turns around and says good morning."
  },
  {
    "id": "earlier-16",
    "title": "Why I love her",
    "body": "I wanted to write something proper.\n\nI've been staring at this for ten minutes.\n\nShe's kind to people who can't do anything for her.\n\nShe remembers things I forget.\n\nShe listens when I talk about work, even when she doesn't understand half of it.\n\nShe makes terrible excuses when she's worried about me.\n\nShe lets me be upset without trying to make me feel better immediately.\n\nShe knows I loved someone before her.\n\nShe has never once asked me to love him less.\n\nI don't know how to explain the rest.\n\nI just love her."
  },
  {
    "id": "earlier-17",
    "title": "Our house",
    "body": "Pale green front door.\n\nTwo storeys.\n\nSmall garden that needs work.\n\nKitchen window facing the back.\n\nTwenty-five minutes from the clinic on a good day.\n\nSecond bedroom could be a study.\n\nSeungwan thinks so, anyway.\n\nYeri will probably claim it within a week.\n\nThings to check during viewing:\n- Water pressure\n- Roof\n- Heating\n- Storage\n- Bus route\n- Neighbours\n- Kitchen cupboards\n\nI can already imagine her leaving her shoes by the door.\n\nI hope we get it."
  },
  {
    "id": "earlier-18",
    "title": "Things we need for the house",
    "body": "- A proper dining table\n- Two bedside lamps\n- Spare bedding\n- Bookshelves\n- A bigger laundry basket\n- Desk for Seungwan\n- Curtains\n- More mugs\n- Something for the garden\n\nShe wants a coffee machine.\n\nI said we already have one.\n\nShe said the new house deserves a new one.\n\nWe haven't even bought the house.\n\nI love this ridiculous woman."
  },
  {
    "id": "earlier-19",
    "title": "The proposal",
    "body": "She proposed in the kitchen.\n\nThere were files on the table, my tea was cold, and I think she'd spent the entire evening trying to find a good moment.\n\nI knew something was wrong because she kept rearranging things that didn't need rearranging.\n\nThen she took out the ring.\n\nI said yes before she finished.\n\nShe laughed because her hands were shaking.\n\nI asked if she was alright.\n\nShe said she was just nervous.\n\nI didn't know she could be nervous about me.\n\nI've been looking at the ring all evening.\n\nShe's asleep beside me now.\n\nI don't think I've ever been this happy."
  },
  {
    "id": "earlier-20",
    "title": "Wedding",
    "body": "Things to discuss:\n\n- Date\n- Venue\n- Guest list\n- Clothes\n- Flowers\n- Food\n- Whether Yeri gets to choose the music\n- Whether Seungwan's family will insist on a formal ceremony\n\nI don't need anything extravagant.\n\nI just want to marry her.\n\nMaybe somewhere small.\n\nSomewhere we won't have to spend the entire evening greeting people.\n\nI want a photograph of us where she's actually looking at the camera.\n\nI want her to remember eating her own wedding dinner.\n\nAnd I want to go home with her afterward.\n\nTo our house."
  },
  {
    "id": "earlier-21",
    "title": "Future plans",
    "body": "She's talking about renovating the garden.\n\nI've been looking at hospitals closer to the house.\n\nWe should take a proper holiday after the wedding.\n\nShe wants to teach me how to drive on the other side of the road.\n\nI said she's a terrible passenger.\n\nShe said she's a very good teacher.\n\nWe argued about it for fifteen minutes.\n\nWe have so many things left to do."
  },
  {
    "id": "earlier-22",
    "title": "If she ever reads this",
    "body": "Seungwan,\n\nYou probably found this because I forgot to lock my phone.\n\nPlease stop reading my notes.\n\nEspecially the ones about you.\n\nI know I don't say certain things enough.\n\nI know I get impatient when you worry too much and I complain when you work late.\n\nBut I like taking care of you.\n\nI like waiting for you at the end of the day.\n\nI like knowing you'll come looking for me when you can't find me in the house.\n\nI'm happier here than I ever expected to be.\n\nA lot of that is because of you.\n\nPlease don't make fun of me for writing this.\n\nI love you."
  },
  {
    "id": "earlier-23",
    "title": "Her voice",
    "body": "I recorded her talking about work yesterday.\n\nShe thought I was taking a photograph.\n\nI have no good explanation for why I did that.\n\nI just wanted to keep it.\n\nShe was complaining about a meeting and telling me what she wanted for dinner.\n\nIt's a terrible recording.\n\nJoy interrupts halfway through.\n\nI'm keeping it anyway."
  },
  {
    "id": "earlier-24",
    "title": "Things I want to ask",
    "body": "Does she know how often I watch her when she isn't looking?\n\nDoes she know I can tell when she's worried by how quietly she closes the door?\n\nDoes she realize she stopped asking whether I was going to leave?\n\nDid she notice when I stopped thinking of her family's house as somewhere I was staying?\n\nDoes she know I would choose her again?\n\nEven if I knew everything that was going to happen?"
  },
  {
    "id": "earlier-25",
    "title": "Don't forget",
    "body": "Her laugh when something catches her off guard.\n\nThe way she rubs her forehead when she's tired.\n\nThe scar near her hairline.\n\nHer handwriting.\n\nThe way she says my name when she's half asleep.\n\nThe sound of her keys when she comes home.\n\nHow she checks whether I'm still in the room before turning off the light.\n\nHow she always moves closer in her sleep.\n\nI don't know why I'm writing these things down.\n\nI see them every day."
  },
  {
    "id": "earlier-26",
    "title": "If anything happens",
    "body": "We've spent so much time trying to understand how I got here.\n\nWe still don't know.\n\nSometimes I wonder whether I could leave the same way.\n\nI haven't told Seungwan how often I think about it.\n\nI don't want her worrying about something neither of us can control.\n\nBut if it happens, I hope she knows I wouldn't leave her willingly.\n\nI hope she doesn't think I changed my mind."
  },
  {
    "id": "earlier-27",
    "title": "Friday",
    "body": "Yeri is coming for dinner.\n\nNeed eggs. Maybe milk.\n\nCheck with Mrs. Han about the pancakes.\n\nSeungwan has a meeting. She thinks she'll be late.\n\nI told her I'd wait.\n\nNeed to ask about Saturday's house viewing.\n\nCharge phone.\n\nBring the ring to be checked? It feels slightly loose.\n\nRemember to tell Seungwan I love her.\n\nActually tell her this time, not just in a text."
  },
  {
    "id": "earlier-28",
    "title": "For Seungwan",
    "body": "I was going to tell you tonight.\n\nI've been thinking about the house again.\n\nI know we said we'd wait until after the viewing to decide anything, but I really want it.\n\nNot because of the garden or the kitchen.\n\nI want to live somewhere with you that we chose together.\n\nI want to come home and complain about work.\n\nI want you to leave your files on the table and forget your glasses upstairs.\n\nI want to argue about what we're having for dinner.\n\nI want you to get old and annoying.\n\nI want to be there for all of it."
  },
  {
    "id": "earlier-29",
    "title": "Reminder",
    "body": "Dinner with Seungwan.\n\nDon't be late."
  },
  {
    "id": "earlier-30",
    "title": "Untitled",
    "body": "Need to buy eggs.\n\nSeungwan said she'd be there.\n\nI'll wait."
  }
];

const notesLater = [
  {id:'later-1',title:'Things I remember',body:`Her name is Shon Seungwan.

She has a younger sister named Yeri.

Her best friend is Seulgi.

Joy works for her.

She lives with her grandparents.

She helped me get my medical licence.

She gave me a pen with my name on it.

She asked me to marry her.

I said yes.

We were going to look at a house.

It had a green door.

I need to remember the green door.

I need to remember her voice.

I need to remember how she looked when I said yes.

I can't remember exactly what she said before she kissed me that night.

I've been trying.

I'm scared I'll forget the rest.`},
  {id:'later-2',title:'Three weeks',body:`I tried.

I really did.

He's here. He's alive.

For two years, that was all I wanted.

I should be happy.

I am happy that he's alive.

But I keep reaching for a ring that isn't there.

Sometimes he says something and I wait for her to answer instead.

He doesn't know.

Nobody does.

I don't know how to tell him that I lost someone, too.`},
  {id:'later-3',title:"I hope you're alright",body:`Did you get home safely?

Did somebody tell you what happened?

Were you waiting at the restaurant?

Did Yeri call you?

Who told Grandma?

I keep thinking about the hospital.

You hate hospitals when you're the patient.

I hope you weren't hurt.

I hope somebody's taking care of you.

I hope you're eating.

I hope you know I didn't choose to leave.`},
  {id:'later-4',title:'Something happened today',body:`I forgot the sound of her laugh.

Not completely.

I know she laughed.

I remember what made her laugh.

I remember her covering her mouth when she couldn't stop.

But I tried to hear it in my head and I couldn't.

I spent almost an hour trying.

I don't know what to do.`},
  {id:'later-5',title:'For the woman I was going to marry',body:`I went to work today.

I had lunch with my colleagues.

I bought groceries on the way home.

Someone asked if I was seeing anybody.

I said no.

I hated saying it.

I didn't know what else to say.

I'm sorry.`},
  {id:'later-6',title:'Saturday',body:`I went back to the mountain.

Nothing happened.

I stayed longer than I'd planned.

I told her about my week.

About the hospital.

About the patient who brought biscuits.

About the lamp I finally bought.

I told her I was doing alright.

Then I cried in the car.

I'll try again next month.`},
  {id:'later-7',title:'One thing',body:`I don't remember the exact colour of the bedroom curtains anymore.

I know that's not important.

But I remember standing beside her while we chose them.

She wanted the darker ones.

I wanted something lighter.

We didn't agree.

I would give anything to argue with her about curtains again.`},
];

// ./src/notes.js
const notesSeed=[...notesLater.map(n=>({...n,collection:'later'})),...notesEarlier.map(n=>({...n,collection:'earlier'}))];
const notesLocal={pinned:[],edits:{},created:[]};
try{
  const saved=JSON.parse(localStorage.getItem('notes-local-v1')||'{}');
  if(Array.isArray(saved.pinned))notesLocal.pinned=saved.pinned.filter(id=>typeof id==='string');
  if(Array.isArray(saved.created))notesLocal.created=saved.created.filter(n=>n&&/^personal-\d+-\d+$/.test(n.id)&&typeof n.title==='string'&&typeof n.body==='string').map(n=>({...n,collection:'personal'}));
  if(saved.edits&&typeof saved.edits==='object')for(const [id,n]of Object.entries(saved.edits))if(n&&typeof n.title==='string'&&typeof n.body==='string'&&notesSeed.some(s=>s.id===id))notesLocal.edits[id]={title:n.title,body:n.body};
}catch{}
const notesUI={collection:'all',query:''};
const notesEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notesAll(){return [...notesLocal.created,...notesSeed].map(n=>({...n,...notesLocal.edits[n.id]}));}
function notesGet(id){return notesAll().find(n=>n.id===id);}
function notesPersist(){try{localStorage.setItem('notes-local-v1',JSON.stringify(notesLocal));}catch{}}
function notesLabel(n){return {later:'Things I remember',earlier:'Earlier notes',personal:'Personal note'}[n.collection];}
function notesMatches(){return notesAll().filter(n=>(notesUI.collection==='all'||notesUI.collection==='pinned'&&notesLocal.pinned.includes(n.id)||n.collection===notesUI.collection)&&(n.title+' '+n.body).toLowerCase().includes(notesUI.query.toLowerCase())).sort((a,b)=>Number(notesLocal.pinned.includes(b.id))-Number(notesLocal.pinned.includes(a.id)));}
function notesCollection(collection){notesUI.collection=collection;notesUI.query='';st[st.length-1]=notesHome;paint();}
function notesIcon(name){const paths={back:'<path d="m15 4-8 8 8 8"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',folder:'<path d="M3 7V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',compose:'<path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M16 3l5 5M10 14l1-5 8-8 4 4-8 8Z"/>',pin:'<path d="m15 3 6 6-3 1-4 4v4l-3-3-6 6m6-6-5-5h4l4-4Z"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;}
function notesShowFolders(){st[st.length-1]=notesFolders;paint();}
function notesFolderTitle(){return {all:'Notes',later:'Things I remember',earlier:'Earlier notes',personal:'Personal notes',pinned:'Pinned'}[notesUI.collection]||'Notes';}
function notesFolders(){const all=notesAll(),folders=[['all','All Notes',all.length],['later','Things I remember',all.filter(n=>n.collection==='later').length],['earlier','Earlier notes',all.filter(n=>n.collection==='earlier').length],['personal','Personal notes',all.filter(n=>n.collection==='personal').length],['pinned','Pinned',all.filter(n=>notesLocal.pinned.includes(n.id)).length]];return `<section class="notes-app notes-folders"><header class="notes-header"><span></span><button aria-label="New note" onclick="go(()=>notesEditor())">${notesIcon('compose')}</button></header><main class="notes-main"><h1 class="notes-title">Folders</h1><h2 class="notes-folder-heading">On My iPhone</h2><div class="notes-folder-list">${folders.map(([id,title,count])=>`<button class="notes-folder-row" onclick="notesCollection('${id}')"><span class="notes-folder-icon">${notesIcon(id==='pinned'?'pin':'folder')}</span><span>${title}</span><small>${count}</small><span class="notes-folder-chevron">›</span></button>`).join('')}</div><p class="notes-storage-caption">Saved in this browser</p></main><footer class="notes-footer"><span></span><span>${all.length} Notes</span><button aria-label="New note" onclick="go(()=>notesEditor())">${notesIcon('compose')}</button></footer></section>`;}
function notesSearch(value){notesUI.query=value;document.querySelector('.notes-results').innerHTML=notesCards();}
function notesPin(id){if(!notesGet(id))return;const index=notesLocal.pinned.indexOf(id);index<0?notesLocal.pinned.push(id):notesLocal.pinned.splice(index,1);notesPersist();const top=document.querySelector('.notes-main')?.scrollTop||0;paint();const main=document.querySelector('.notes-main');if(main)main.scrollTop=top;}
function notesCards(){const items=notesMatches();if(!items.length)return '<div class="notes-empty">No Notes<br><small>Try a different search or add a new note.</small></div>';const pinned=items.filter(n=>notesLocal.pinned.includes(n.id)),others=items.filter(n=>!notesLocal.pinned.includes(n.id));function group(title,entries){if(!entries.length)return '';return `<section class="notes-list-section"><h2 class="notes-list-label">${title}</h2><div class="notes-list-group">${entries.map(n=>`<article class="notes-card"><button class="notes-card-open" onclick="go(()=>notesReader('${n.id}'))"><h3>${notesEscape(n.title)}</h3><p>${notesEscape(n.body.replace(/\n/g,' '))}</p><small>${notesIcon('folder')}${notesLabel(n)}</small></button><button class="notes-pin" aria-label="${notesLocal.pinned.includes(n.id)?'Unpin':'Pin'} note" aria-pressed="${notesLocal.pinned.includes(n.id)}" onclick="notesPin('${n.id}')">${notesIcon('pin')}</button></article>`).join('')}</div></section>`;}return group('Pinned',pinned)+group(notesUI.query?'Search Results':notesUI.collection==='all'?'Notes':notesFolderTitle(),others);}
function notesHome(){return `<section class="notes-app"><header class="notes-header"><button class="notes-back" onclick="notesShowFolders()">${notesIcon('back')}Folders</button><button aria-label="View pinned notes" onclick="notesCollection('pinned')">${notesIcon('pin')}</button></header><main class="notes-main"><h1 class="notes-title">${notesFolderTitle()}</h1><label class="notes-search">${notesIcon('search')}<input aria-label="Search notes" placeholder="Search" value="${notesEscape(notesUI.query)}" oninput="notesSearch(this.value)"></label><div class="notes-results">${notesCards()}</div></main><footer class="notes-footer"><button aria-label="Show folders" onclick="notesShowFolders()">${notesIcon('folder')}</button><span>${notesAll().filter(n=>notesUI.collection==='all'||notesUI.collection==='pinned'&&notesLocal.pinned.includes(n.id)||n.collection===notesUI.collection).length} Notes</span><button aria-label="New note" onclick="go(()=>notesEditor())">${notesIcon('compose')}</button></footer></section>`;}
function notesBody(body){return body.split(/\n\s*\n/).map(block=>block.split('\n').every(line=>line.startsWith('- '))?`<ul>${block.split('\n').map(line=>`<li>${notesEscape(line.slice(2))}</li>`).join('')}</ul>`:`<p>${notesEscape(block).replace(/\n/g,'<br>')}</p>`).join('');}
function notesStep(id,step){const all=notesMatches(),index=all.findIndex(n=>n.id===id),next=all[index+step];if(next){st[st.length-1]=()=>notesReader(next.id);paint();}}
function notesReader(id){const n=notesGet(id);if(!n)return notesHome();const items=notesMatches(),index=items.findIndex(item=>item.id===id);return `<section class="notes-app notes-reader"><header class="notes-header"><button class="notes-back" onclick="back()">${notesIcon('back')}Notes</button><div class="notes-header-actions"><button aria-label="${notesLocal.pinned.includes(id)?'Unpin':'Pin'} note" aria-pressed="${notesLocal.pinned.includes(id)}" onclick="notesPin('${id}')">${notesIcon('pin')}</button><button aria-label="Edit note" onclick="go(()=>notesEditor('${id}'))">${notesIcon('compose')}</button></div></header><main class="notes-main"><h1 class="notes-reader-title">${notesEscape(n.title)}</h1><article class="notes-prose">${notesBody(n.body)}</article></main><footer class="notes-footer"><button onclick="notesStep('${id}',-1)" ${index<=0?'disabled':''}>‹ Previous</button><span>${index>=0?index+1:'—'} of ${items.length}</span><button onclick="notesStep('${id}',1)" ${index<0||index>=items.length-1?'disabled':''}>Next ›</button></footer></section>`;}
function notesSave(form,id){const title=form.elements.title.value.trim(),body=form.elements.body.value;if(!title)return;if(id){const existing=notesLocal.created.find(n=>n.id===id);if(existing){existing.title=title;existing.body=body;}else notesLocal.edits[id]={title,body};}else{notesLocal.created.unshift({id:'personal-'+Date.now()+'-'+Math.floor(Math.random()*1000000),title,body,collection:'personal'});}notesPersist();back();}
function notesEditor(id=null){const n=notesGet(id)||{title:'',body:''};return `<section class="notes-app notes-reader notes-editor"><header class="notes-header"><button onclick="back()">Cancel</button><button class="notes-done" type="submit" form="notes-editor">Done</button></header><main class="notes-main"><form id="notes-editor" onsubmit="event.preventDefault();notesSave(this,${id?`'${id}'`:'null'})"><input class="notes-editor-title" name="title" aria-label="Note title" placeholder="Title" value="${notesEscape(n.title)}" maxlength="150" required><textarea class="notes-editor-body" name="body" aria-label="Note text" placeholder="Start writing…">${notesEscape(n.body)}</textarea></form></main><footer class="notes-footer"><span></span><span>${id?notesLabel(n):'New Note'}</span><span></span></footer></section>`;}
ROOT.notes=notesHome;

// ./src/widgets.js
/* Small app previews; keep weather explicitly labelled as sample data. */
const widgetEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function homeWidgetEvent(now=new Date()){
  const today=calendarKey(now),events=calendarEventsFor(today);
  if(events.length)return {...events[0],date:today,isToday:true};
  return [...calendarRequested.filter(e=>e.date&&!e.pending),...calendarEvents].filter(e=>e.date>today).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''))[0]||null;
}
function homeWidgetNote(){const all=notesAll();return all.find(n=>notesLocal.pinned.includes(n.id))||all.find(n=>n.id==='later-1')||all[0];}
function homeWidgetOpen(app,button){
  if(app==='notes'){notesUI.collection='all';notesUI.query='';}
  if(app==='calendar'){
    const now=new Date(),event=homeWidgetEvent(now),date=calendarParse(event?.date||calendarKey(now));
    calendarUI.selected=calendarKey(date);calendarUI.year=date.getFullYear();calendarUI.month=date.getMonth();
  }
  openApp(app,button);
  if(app==='notes'){const note=homeWidgetNote();if(note)go(()=>notesReader(note.id));}
}
function homeWidgetsMarkup(now=new Date()){
  const event=homeWidgetEvent(now),mode=weatherUI.day>=0?weatherWeek[weatherUI.day].mode:weatherUI.mode,w=weatherScenarios[mode],note=homeWidgetNote();
  const eventLabel=event?(event.isToday?'Today':calendarParse(event.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}))+' · '+calendarTimeLabel(event.time):'Make room for something good';
  return `<button class="home-widget home-widget-calendar" aria-label="Open calendar${event?', '+widgetEscape(event.title):''}" onclick="homeWidgetOpen('calendar',this)"><span class="home-widget-label">${widgetEscape(now.toLocaleDateString(undefined,{weekday:'long'}))}</span><span class="home-widget-date">${now.getDate()}</span><span class="home-widget-event"><b>${event?widgetEscape(event.title):'No upcoming plans'}</b><small>${widgetEscape(eventLabel)}</small></span></button><button class="home-widget home-widget-weather ${mode}" aria-label="Open weather, ${w.name}, sample data" onclick="homeWidgetOpen('weather',this)"><span class="home-widget-label">Lindenwell</span><span class="home-widget-weather-symbol" aria-hidden="true">${w.icon}</span><span class="home-widget-temperature">${weatherTemp(w.temp)}</span><span class="home-widget-weather-description">${w.name}</span><span class="home-widget-weather-range">H:${weatherTemp(w.high)} &nbsp; L:${weatherTemp(w.low)}</span><span class="home-widget-sample">SAMPLE</span></button><button class="home-widget home-widget-note" aria-label="Open featured note" onclick="homeWidgetOpen('notes',this)"><span class="home-widget-label">${note&&notesLocal.pinned.includes(note.id)?'Pinned note':'From your notes'}</span><b>${widgetEscape(note?.title||'A fresh page')}</b><p>${widgetEscape(note?.body.split('\n').find(line=>line.trim())||'Keep a thought for later.')}</p></button>`;
}
function homeWidgetsUpdate(){const mount=document.querySelector('.home-widgets');if(mount)mount.innerHTML=homeWidgetsMarkup();}
const homeLayout=document.createElement('div');homeLayout.className='home-layout';
const homeWidgetMount=document.createElement('section');homeWidgetMount.className='home-widgets';homeWidgetMount.setAttribute('aria-label','Home screen widgets');
homeLayout.appendChild(homeWidgetMount);homeLayout.appendChild(H.querySelector('.gr'));H.appendChild(homeLayout);homeWidgetsUpdate();
new MutationObserver(()=>{if(!A.classList.contains('on'))homeWidgetsUpdate();}).observe(A,{attributes:true,attributeFilter:['class']});
setInterval(homeWidgetsUpdate,60000);
window.addEventListener('focus',homeWidgetsUpdate);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)homeWidgetsUpdate();});

// Static page controls
document.querySelector("[data-phone-action-1]").addEventListener("click", function(event) { torch(this) });
document.querySelector("[data-phone-action-2]").addEventListener("click", function(event) { openApp('camera', this) });
document.querySelector("[data-phone-action-3]").addEventListener("click", function(event) { showPass() });
document.querySelector("[data-phone-action-4]").addEventListener("click", function(event) { key(1) });
document.querySelector("[data-phone-action-5]").addEventListener("click", function(event) { key(2) });
document.querySelector("[data-phone-action-6]").addEventListener("click", function(event) { key(3) });
document.querySelector("[data-phone-action-7]").addEventListener("click", function(event) { key(4) });
document.querySelector("[data-phone-action-8]").addEventListener("click", function(event) { key(5) });
document.querySelector("[data-phone-action-9]").addEventListener("click", function(event) { key(6) });
document.querySelector("[data-phone-action-10]").addEventListener("click", function(event) { key(7) });
document.querySelector("[data-phone-action-11]").addEventListener("click", function(event) { key(8) });
document.querySelector("[data-phone-action-12]").addEventListener("click", function(event) { key(9) });
document.querySelector("[data-phone-action-13]").addEventListener("click", function(event) { key(0) });
document.querySelector("[data-phone-action-14]").addEventListener("click", function(event) { del() });
