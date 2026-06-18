// ============================================================
// GATEC31 · Fable5 Creator OS · app.js
// ============================================================

// ── LOCAL STORAGE HELPERS ─────────────────────────────────
const LS = {
  get: (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── SEED DATA ─────────────────────────────────────────────
const SEED = {
  videos: [
    { title: 'KDEN → KLAX — Winter Turbulence at FL370', ctr: 5.2, avd: 9.1, ret: 64, subs: 18 },
    { title: 'VR Night Approach: Denver After Dark', ctr: 6.8, avd: 11.3, ret: 71, subs: 27 },
    { title: 'PMDG 737 Tutorial — Cold & Dark to Takeoff', ctr: 7.4, avd: 13.2, ret: 68, subs: 41 },
    { title: 'My Exact KDEN VR Setup (Under $800)', ctr: 8.1, avd: 7.9, ret: 58, subs: 33 },
    { title: 'Real KDEN Approach vs MSFS — Accuracy Test', ctr: 6.3, avd: 8.4, ret: 62, subs: 22 },
  ],
  shorts: [
    { title: 'VR ILS capture KDEN R16L fog 200ft', moment: 'Approach breakout', status: 'live', date: 'Jun 12' },
    { title: 'Wind shear alert on final — real ATC audio', moment: 'Wind shear warning', status: 'ready', date: 'Jun 18' },
    { title: 'PMDG 737 engine bleed fault at cruise', moment: 'System failure', status: 'clip', date: 'Pending' },
    { title: 'FL350 cockpit VR — crystal clear night', moment: 'Cruise scenery', status: 'clip', date: 'Pending' },
  ],
  superfans: [
    { name: 'Bravo_Mike_D', tier: 'VIP', notes: '← answered every poll, builds his own sim' },
    { name: 'kdencrewchief', tier: 'CREW', notes: '← real KDEN ground crew, comments gold' },
    { name: 'NightApproach99', tier: 'VIP', notes: '← bought setup guide, wants Discord' },
    { name: 'JetSetter_VR', tier: 'CREW', notes: '← shares every Shorts, 12 referrals' },
    { name: 'DenverAvgeek', tier: 'CREW', notes: '← local! offered to record real ATC' },
  ],
  affiliates: [
    { name: 'Honeycomb Alpha Yoke', link: 'amzn.to/honey-alpha', est: 120, status: 'active' },
    { name: 'Thrustmaster TCA Airbus', link: 'amzn.to/tca-airbus', est: 85, status: 'active' },
    { name: 'Meta Quest 3 (VR)', link: 'amzn.to/quest-3', est: 200, status: 'active' },
    { name: 'Orbx KDEN Scenery', link: 'orbxdirect.com/?ref=gatec31', est: 45, status: 'pending' },
    { name: 'PMDG 737-800 MSFS', link: 'pmdg.com/?ref=gatec31', est: 60, status: 'pending' },
    { name: 'Navigraph Charts', link: 'navigraph.com/?ref=gatec31', est: 30, status: 'inactive' },
  ],
  pipeline: [
    { id: 'p1', title: 'KDEN → KATL Summer Convection', pillar: 'Destination', status: 'idea' },
    { id: 'p2', title: 'Best VR Headsets MSFS 2024', pillar: 'Tech & Setup', status: 'idea' },
    { id: 'p3', title: 'Recreating KDEN Diversion 2023', pillar: 'Real World × Sim', status: 'script' },
    { id: 'p4', title: 'VR Mountain Wave Turbulence', pillar: 'Destination', status: 'filmed' },
    { id: 'p5', title: 'My exact KDEN VR Setup v2', pillar: 'Tech & Setup', status: 'filmed' },
    { id: 'p6', title: 'PMDG 737 Cold & Dark Tutorial', pillar: 'Tech & Setup', status: 'live' },
  ],
  weekLabels: ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8'],
  ctrData:    [3.1, 4.2, 4.8, 5.2, 6.1, 6.8, 7.4, 8.1],
  avdData:    [5.2, 6.8, 7.1, 8.3, 9.0, 10.1, 11.3, 13.2],
};

// ── BACKEND API LAYER ─────────────────────────────────────
// When a backend base URL is configured, the app talks to the
// Netlify Functions (read+write Sheets, Notion sync). Otherwise
// it falls back to direct browser fetch / localStorage.
const API = {
  base() { return (LS.get('config', {}).backendUrl || '').replace(/\/$/, ''); },
  enabled() { return !!this.base(); },

  async sheetsRead(range = 'Metrics!A:G') {
    const r = await fetch(`${this.base()}/api/sheets?range=${encodeURIComponent(range)}`);
    if (!r.ok) throw new Error('sheets read failed');
    return (await r.json()).values || [];
  },
  async sheetsWrite(values, opts = {}) {
    const r = await fetch(`${this.base()}/api/sheets`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values, ...opts }),
    });
    if (!r.ok) throw new Error('sheets write failed');
    return r.json();
  },
  async notionRead() {
    const r = await fetch(`${this.base()}/api/notion`);
    if (!r.ok) throw new Error('notion read failed');
    return (await r.json()).cards || [];
  },
  async notionCreate(card) {
    const r = await fetch(`${this.base()}/api/notion`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    return r.json();
  },
  async notionUpdate(id, status) {
    const r = await fetch(`${this.base()}/api/notion`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return r.json();
  },
};

// ── CHART INSTANCES ────────────────────────────────────────
let charts = {};

function mkChart(id, labels, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ data, borderColor: color, backgroundColor: color + '18',
        tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: color }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#8BA3BF', font: { size: 10, family: 'Space Mono' } }, grid: { color: 'rgba(0,168,232,0.08)' } },
        y: { ticks: { color: '#8BA3BF', font: { size: 10, family: 'Space Mono' } }, grid: { color: 'rgba(0,168,232,0.08)' } },
      }
    }
  });
}

// ── F1: STORY ENGINE ──────────────────────────────────────
let lastSpine = null;

const F1 = {
  spines: {
    'Destination Flight': {
      intro:       (r,a) => `"${r.split('→')[1]?.trim() || 'the destination'} is one of those routes that looks routine on paper — and will remind you it isn't."`,
      problem:     (r,a,d) => `"Most sim flights skip the part where everything goes sideways. Tonight it didn't. ${d || 'The weather had other ideas.'}"`,
      revelation:  (r,a,d) => `"Here's what ${d ? d.toLowerCase() : 'that moment'} taught me about ${a} systems — and why it changed how I fly this route."`,
      you:         (r,a) => `"If you want to feel what ${r} actually demands — without buying a ${a.split(' ')[0]} type rating — this is the flight."`,
    },
    'Tech & Setup': {
      intro:       (r,a) => `"I've spent three months testing every option. Here's what I actually kept — and what I threw out."`,
      problem:     (r,a,d) => `"The reviews don't tell you about ${d || 'the real-world tradeoffs in a VR cockpit'}. I found out the hard way."`,
      revelation:  (r,a,d) => `"After all of it, the answer wasn't the most expensive option. It was understanding what actually matters for ${a || 'a sim rig at KDEN'}."`,
      you:         (r,a) => `"If you're building or upgrading your sim setup, this saves you the $400 mistake I already made."`,
    },
    'Real World × Sim': {
      intro:       (r,a) => `"This route made headlines. I flew it in the sim to understand why."`,
      problem:     (r,a,d) => `"The incident reports describe ${d || 'a sequence of decisions that seems obvious in hindsight — it never is in the moment'}."`,
      revelation:  (r,a,d) => `"Rebuilding it in MSFS changed how I read ${d ? 'that event' : 'ATIS and NOTAMs'} — because the sim lets you pause at exactly the wrong second and ask: what would I do?"`,
      you:         (r,a) => `"If you've ever wondered how real crews deal with ${d || 'the unexpected'} — this is the closest you can get without a type rating."`,
    },
  },

  generate() {
    const route     = document.getElementById('s1-route').value.trim() || 'KDEN → ???';
    const aircraft  = document.getElementById('s1-aircraft').value;
    const drama     = document.getElementById('s1-drama').value.trim();
    const realworld = document.getElementById('s1-realworld').value.trim();
    const pillar    = document.getElementById('s1-pillar').value;
    const length    = document.getElementById('s1-length').value;

    const tmpl = this.spines[pillar] || this.spines['Destination Flight'];
    const beats = [
      { label: 'INTRO — The Hook (0:00–0:45)',       text: tmpl.intro(route, aircraft, drama) },
      { label: 'PROBLEM — Raise the Stakes (0:45–2:00)', text: tmpl.problem(route, aircraft, drama) },
      { label: 'REVELATION — The Turn (middle)',      text: tmpl.revelation(route, aircraft, realworld || drama) },
      { label: 'YOU — Address the Viewer (outro)',    text: tmpl.you(route, aircraft) },
    ];

    const titleSuggestion = `${route} — ${drama ? drama.charAt(0).toUpperCase() + drama.slice(1) : 'Full Flight'} | ${aircraft}`;

    const out = document.getElementById('spineOutput');
    out.innerHTML = `
      <div style="font-family:'Space Mono',monospace;font-size:0.6rem;letter-spacing:0.2em;color:var(--radar);margin-bottom:1rem;text-transform:uppercase;">
        ${pillar.toUpperCase()} · ${length} · ${aircraft}
      </div>
      <div style="font-size:0.78rem;color:var(--muted);margin-bottom:0.5rem;font-family:'Space Mono',monospace;">
        SUGGESTED TITLE
      </div>
      <div style="font-size:0.92rem;font-weight:600;color:var(--white);margin-bottom:1.2rem;padding:0.6rem 0.8rem;background:rgba(0,168,232,0.08);border-left:2px solid var(--radar);">
        ${titleSuggestion}
      </div>
      ${beats.map(b => `
        <div class="spine-beat">
          <div class="spine-beat-label">${b.label}</div>
          <div class="spine-beat-text">${b.text}</div>
        </div>
      `).join('')}
    `;

    lastSpine = { route, aircraft, drama, pillar, titleSuggestion };
    document.getElementById('s1-addBtn').style.display = 'block';
  },

  addToPipeline() {
    if (!lastSpine) return;
    const videos = LS.get('pipeline', SEED.pipeline);
    videos.push({
      id: 'p' + Date.now(),
      title: lastSpine.titleSuggestion,
      pillar: lastSpine.pillar,
      status: 'idea',
    });
    LS.set('pipeline', videos);
    Pipeline.render();
    document.getElementById('s1-addBtn').textContent = 'ADDED TO PIPELINE ✓';
    setTimeout(() => { document.getElementById('s1-addBtn').textContent = 'ADD TO PIPELINE →'; }, 2000);
  },
};

// ── F2: RETENTION RADAR ───────────────────────────────────
const F2 = {
  render() {
    const videos = LS.get('videos', SEED.videos);
    const avgCTR = (videos.reduce((a,v) => a + v.ctr, 0) / videos.length).toFixed(1);
    const avgAVD = (videos.reduce((a,v) => a + v.avd, 0) / videos.length).toFixed(1);
    const avgRet = Math.round(videos.reduce((a,v) => a + v.ret, 0) / videos.length);
    const totalSubs = videos.reduce((a,v) => a + v.subs, 0);

    const kpis = [
      { val: avgCTR+'%', lbl: 'Avg CTR', target: 'Target 8%', cls: avgCTR >= 6 ? 'good' : avgCTR >= 4 ? 'amber' : 'warn' },
      { val: avgAVD+'m', lbl: 'Avg View Duration', target: 'Target 10min', cls: avgAVD >= 9 ? 'good' : avgAVD >= 6 ? 'amber' : 'warn' },
      { val: avgRet+'%', lbl: 'Avg Retention', target: 'Target 60%', cls: avgRet >= 60 ? 'good' : avgRet >= 45 ? 'amber' : 'warn' },
      { val: '+'+totalSubs, lbl: 'Subs from Videos', target: 'Tracked total', cls: '' },
    ];

    document.getElementById('kpiGrid').innerHTML = kpis.map(k => `
      <div class="kpi-cell">
        <div class="kpi-val ${k.cls}">${k.val}</div>
        <div class="kpi-lbl">${k.lbl}</div>
        <div class="kpi-target">${k.target}</div>
      </div>
    `).join('');

    // Video log
    document.getElementById('videoLog').innerHTML = videos.map(v => `
      <div class="video-row">
        <span class="vr-title">${v.title}</span>
        <span class="vr-num ${v.ctr >= 6 ? 'good' : v.ctr < 4 ? 'warn' : 'neutral'}">${v.ctr}%</span>
        <span class="vr-num ${v.avd >= 9 ? 'good' : v.avd < 6 ? 'warn' : 'neutral'}">${v.avd}m</span>
        <div><div class="vr-bar-wrap"><div class="vr-bar-fill" style="width:${v.ret}%"></div></div><div style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--muted);margin-top:2px">${v.ret}%</div></div>
        <span class="vr-num neutral">+${v.subs}</span>
      </div>
    `).join('');
  },

  showAddForm() {
    const f = document.getElementById('addVideoForm');
    f.style.display = f.style.display === 'none' ? 'grid' : 'none';
    f.style.display = 'block';
  },

  addVideo() {
    const t = document.getElementById('nv-title').value.trim();
    if (!t) return;
    const v = {
      title: t,
      ctr: parseFloat(document.getElementById('nv-ctr').value) || 0,
      avd: parseFloat(document.getElementById('nv-avd').value) || 0,
      ret: parseInt(document.getElementById('nv-ret').value) || 0,
      subs: parseInt(document.getElementById('nv-subs').value) || 0,
    };
    const videos = LS.get('videos', SEED.videos);
    videos.unshift(v);
    LS.set('videos', videos);
    document.getElementById('addVideoForm').style.display = 'none';
    ['nv-title','nv-ctr','nv-avd','nv-ret','nv-subs'].forEach(id => document.getElementById(id).value = '');
    this.render();
  },

  async pullFromSheets() {
    const cfg = LS.get('config', {});
    const useBackend = API.enabled();
    if (!useBackend && (!cfg.sheetsKey || !cfg.sheetsId)) {
      alert('Set a Backend URL, or a Google Sheets API Key + Sheet ID, in the Config section first.');
      return;
    }
    const btn = document.getElementById('pullSheetsBtn');
    btn.textContent = 'PULLING...';
    try {
      let rows;
      if (useBackend) {
        rows = (await API.sheetsRead('Metrics!A:G')).slice(1);
      } else {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${cfg.sheetsId}/values/Metrics!A:G?key=${cfg.sheetsKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Sheets API error');
        rows = ((await res.json()).values || []).slice(1);
      }
      if (rows.length) {
        const live = rows.map(r => ({
          title: r[0] || 'Untitled',
          ctr: parseFloat(r[1]) || 0,
          avd: (parseFloat(r[2]) || 0) / 60,
          ret: parseFloat(r[3]) || 0,
          subs: parseInt(r[4]) || 0,
        }));
        LS.set('videos', live);
        this.render();
        document.getElementById('sheetsStatusNav').textContent = useBackend ? 'BACKEND · LIVE' : 'SHEETS · LIVE';
      }
      btn.textContent = 'PULLED ✓';
    } catch (e) {
      btn.textContent = 'ERROR — CHECK CONFIG';
    }
    setTimeout(() => { btn.textContent = '↓ PULL FROM SHEETS'; }, 3000);
  },
};

// ── F3: SHORTS AUTOPILOT ─────────────────────────────────
const F3 = {
  hooks: {
    '15s': [
      m => `${m} — and nobody said a word. [no music]`,
      m => `POV: ${m} in VR. This is why I built this.`,
      m => `Real pilots don't warn you about ${m.split(' ').slice(0,3).join(' ')}.`,
    ],
    '30s': [
      m => `Denver approach gave me ${m}. Here's what happened at minimums.`,
      m => `I've flown this approach 300 times. ${m} — still not routine.`,
      m => `This is ${m}. VR, KDEN, MSFS 2024. The algorithm says 30 seconds. Let's go.`,
    ],
    '60s': [
      m => `Nobody makes a 60-second video about ${m}. Until now. Full breakdown.`,
      m => `${m} — from the left seat, in VR, at KDEN. Here's everything you didn't expect.`,
      m => `The sim got ${m} exactly right. A real pilot weighed in. This is what they said.`,
    ],
  },

  render() {
    const shorts = LS.get('shorts', SEED.shorts);
    document.getElementById('shortsQueue').innerHTML = shorts.map((s, i) => `
      <div class="short-card" onclick="F3.cycleStatus(${i})">
        <div class="short-card-top">
          <span class="short-title">${s.title}</span>
          <span class="short-status ${s.status}">${s.status.toUpperCase()}</span>
        </div>
        <div class="short-meta">${s.moment} · ${s.date}</div>
      </div>
    `).join('');
  },

  cycleStatus(i) {
    const shorts = LS.get('shorts', SEED.shorts);
    const order = ['clip','ready','live'];
    const cur = order.indexOf(shorts[i].status);
    shorts[i].status = order[(cur + 1) % order.length];
    LS.set('shorts', shorts);
    this.render();
  },

  generateHooks() {
    const moment = document.getElementById('s3-moment').value.trim() || 'VR approach KDEN at minimums';
    const len = document.getElementById('s3-len').value;
    const variants = (this.hooks[len] || this.hooks['30s']).map(fn => fn(moment));
    document.getElementById('hookVariants').innerHTML = variants.map(v => `
      <div class="hook-variant" onclick="navigator.clipboard.writeText(this.textContent)">
        "${v}" <span style="color:var(--radar);font-size:0.6rem;"> — click to copy</span>
      </div>
    `).join('');
  },

  addShort() {
    const title = prompt('Clip title / moment:');
    if (!title) return;
    const shorts = LS.get('shorts', SEED.shorts);
    shorts.unshift({ title, moment: 'New clip', status: 'clip', date: 'Pending' });
    LS.set('shorts', shorts);
    this.render();
  },
};

// ── F4: COMMUNITY BRIEF ───────────────────────────────────
const F4 = {
  posts: {
    'route-vote': (ctx) => `📡 FLIGHT BRIEFING — ROUTE VOTE

Where's GATEC31 flying next? Vote below and I'll file the plan this week.

${ctx ? `Context: ${ctx}\n` : ''}→ Option A: High-altitude weather routing (Rocky Mountain crossing)
→ Option B: Classic IFR approach to a major hub
→ Option C: Real-world incident recreation — you pick the event

Comment your vote + the reason. Top comment wins. Wheels up Friday. ✈

#MSFS2024 #FlightSim #KDEN`,

    'debrief': (ctx) => `📊 WEEKLY DEBRIEF — CO-PILOT BRIEFING

Here's what happened on the channel this week:

${ctx ? `→ ${ctx}` : '→ Flew three routes, logged the retention data, found one story worth doubling down on.'}

What landed: the approach sequence. What didn't: the briefing ran too long.
Next week: tighter hook, same route, different weather.

One question for the crew: what's the one thing I should stop doing in my videos? Drop it below. Every answer gets read. ✈`,

    'question': (ctx) => `❓ ONE QUESTION FOR THE CREW

${ctx ? ctx : 'What made you first get into flight simulation?'}

I'll share the best answers in the next video. Keep it under 3 sentences — like a good hook. ✈

#FlightSim #MSFS #KDEN`,

    'milestone': (ctx) => `🎯 MILESTONE UNLOCKED

${ctx || 'We hit a new milestone — and I wouldn\'t have made it here without this crew.'}

This channel started as a KDEN cockpit and a camera. Now it's a real crew.

What's next: more routes, better stories, and the Discord "Virtual First Officer" tier launching soon.

Thank you for flying with me. ✈ — CharlieThirtyOne`,

    'atis': (ctx) => `📻 ATIS REPORT — KDEN INFORMATION ${['ALPHA','BRAVO','CHARLIE','DELTA','ECHO'][Math.floor(Math.random()*5)]}

Time: ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} local / ZULU
${ctx ? `Conditions: ${ctx}` : 'Conditions: Clear above FL180, mountain wave activity west of KDEN, expect light chop on departure'}
Winds: Variable
Altimeter: 30.12
Remarks: The sim is up. The crew is in. Filing a flight plan tonight.

Reply with your local weather — let's see who's flying in the worst conditions this week. ✈`,
  },

  render() {
    const fans = LS.get('superfans', SEED.superfans);
    document.getElementById('superfanList').innerHTML = fans.map((f, i) => `
      <div class="superfan-row">
        <span class="sf-name">${f.name}</span>
        <span class="sf-tier ${f.tier === 'VIP' ? 'vip' : ''}">${f.tier}</span>
        <span class="sf-actions">${f.notes}</span>
      </div>
    `).join('');
  },

  generatePost() {
    const type = document.getElementById('postType').value;
    const ctx = document.getElementById('postContext').value.trim();
    const out = document.getElementById('postOutput');
    const fn = this.posts[type] || this.posts['question'];
    out.textContent = fn(ctx);
    out.classList.remove('empty');
  },

  copyPost() {
    const text = document.getElementById('postOutput').textContent;
    if (text && !text.includes('Post will appear here')) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  },

  addSuperfan() {
    const name = prompt('Username / handle:');
    if (!name) return;
    const tier = prompt('Tier (VIP or CREW):')?.toUpperCase() || 'CREW';
    const notes = prompt('Notes (engagement, what they do):') || '';
    const fans = LS.get('superfans', SEED.superfans);
    fans.unshift({ name, tier, notes });
    LS.set('superfans', fans);
    this.render();
  },
};

// ── F5: REVENUE TOWER ─────────────────────────────────────
const F5 = {
  render() {
    const aff = LS.get('affiliates', SEED.affiliates);
    const active = aff.filter(a => a.status === 'active');
    const totalEst = active.reduce((s, a) => s + a.est, 0);
    const memberEst = 100 * 5; // 100 superfans × $5
    const productEst = 10 * 29;

    document.getElementById('revenueSummary').innerHTML = [
      { val: '$' + totalEst, lbl: 'Affiliate Est./Mo' },
      { val: '$' + memberEst, lbl: 'Membership Potential' },
      { val: '$' + productEst, lbl: 'Digital Products' },
      { val: '$' + (totalEst + memberEst + productEst), lbl: 'Total Potential/Mo' },
    ].map(r => `
      <div class="rev-cell">
        <div class="rev-val">${r.val}</div>
        <div class="rev-lbl">${r.lbl}</div>
      </div>
    `).join('');

    document.getElementById('affiliateRows').innerHTML = aff.map((a, i) => `
      <div class="af-row">
        <span class="af-name">${a.name}</span>
        <span class="af-link" title="${a.link}">${a.link}</span>
        <span class="af-earnings">$${a.est}</span>
        <div class="af-status-dot ${a.status}"></div>
        <span class="af-edit" onclick="F5.editAffiliate(${i})">EDIT</span>
      </div>
    `).join('');
  },

  editAffiliate(i) {
    const aff = LS.get('affiliates', SEED.affiliates);
    const a = aff[i];
    const link = prompt('Affiliate link:', a.link);
    if (link === null) return;
    const est = parseInt(prompt('Estimated monthly earnings ($):', a.est)) || a.est;
    const status = prompt('Status (active/pending/inactive):', a.status) || a.status;
    aff[i] = { ...a, link: link || a.link, est, status };
    LS.set('affiliates', aff);
    this.render();
  },

  addAffiliate() {
    const name = prompt('Product/Brand name:');
    if (!name) return;
    const link = prompt('Affiliate link:') || '';
    const est = parseInt(prompt('Estimated monthly earnings ($):')) || 0;
    const aff = LS.get('affiliates', SEED.affiliates);
    aff.push({ name, link, est, status: 'pending' });
    LS.set('affiliates', aff);
    this.render();
  },
};

// ── PIPELINE ─────────────────────────────────────────────
const Pipeline = {
  dragging: null,

  async syncFromNotion() {
    if (!API.enabled()) return;
    try {
      const cards = await API.notionRead();
      if (cards.length) { LS.set('pipeline', cards); this.render(); }
      const nav = document.getElementById('sheetsStatusNav');
      if (nav) nav.textContent = 'NOTION · SYNCED';
    } catch (e) { /* fall back to localStorage silently */ }
  },

  render() {
    const videos = LS.get('pipeline', SEED.pipeline);
    const cols = { idea: 'col-idea', script: 'col-script', filmed: 'col-filmed', live: 'col-live' };
    Object.entries(cols).forEach(([status, colId]) => {
      const col = document.getElementById(colId);
      const header = col.querySelector('.pipeline-col-header');
      col.innerHTML = '';
      col.appendChild(header);
      videos.filter(v => v.status === status).forEach(v => {
        const card = document.createElement('div');
        card.className = 'pipeline-card';
        card.draggable = true;
        card.dataset.id = v.id;
        card.innerHTML = `<div class="pc-pillar">${v.pillar}</div>${v.title}`;
        card.addEventListener('dragstart', e => {
          Pipeline.dragging = v.id;
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        col.appendChild(card);
      });
    });
  },

  onDragOver(e) { e.preventDefault(); },

  onDrop(e, newStatus) {
    e.preventDefault();
    if (!Pipeline.dragging) return;
    const videos = LS.get('pipeline', SEED.pipeline);
    const v = videos.find(x => x.id === Pipeline.dragging);
    if (v) {
      v.status = newStatus;
      LS.set('pipeline', videos);
      this.render();
      if (API.enabled() && String(v.id).length > 20) API.notionUpdate(v.id, newStatus).catch(() => {});
    }
    Pipeline.dragging = null;
  },

  addCard() {
    const title = prompt('Video idea title:');
    if (!title) return;
    const pillar = prompt('Pillar (Destination / Tech & Setup / Real World × Sim):') || 'Destination';
    const card = { id: 'p' + Date.now(), title, pillar, status: 'idea' };
    const videos = LS.get('pipeline', SEED.pipeline);
    videos.push(card);
    LS.set('pipeline', videos);
    this.render();
    if (API.enabled()) API.notionCreate({ title, pillar, status: 'idea' }).then(() => this.syncFromNotion()).catch(() => {});
  },
};

// ── CONFIG ────────────────────────────────────────────────
const Config = {
  statusText(c) {
    if (c.backendUrl) return 'BACKEND · READY';
    if (c.sheetsKey && c.sheetsId) return 'SHEETS · READY';
    return 'NOT CONNECTED';
  },

  load() {
    const c = LS.get('config', {});
    document.getElementById('cfg-channel').value = c.channel || '@gatec31';
    document.getElementById('cfg-backend').value = c.backendUrl || '';
    document.getElementById('cfg-key').value = c.sheetsKey || '';
    document.getElementById('cfg-sheetid').value = c.sheetsId || '';
    document.getElementById('cfg-notion').value = c.notionProxy || '';
    const nav = document.getElementById('sheetsStatusNav');
    if (nav) nav.textContent = this.statusText(c);
  },

  save() {
    const c = {
      channel:     document.getElementById('cfg-channel').value.trim(),
      backendUrl:  document.getElementById('cfg-backend').value.trim(),
      sheetsKey:   document.getElementById('cfg-key').value.trim(),
      sheetsId:    document.getElementById('cfg-sheetid').value.trim(),
      notionProxy: document.getElementById('cfg-notion').value.trim(),
    };
    LS.set('config', c);
    const msg = document.getElementById('configMsg');
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 2500);
    const nav = document.getElementById('sheetsStatusNav');
    if (nav) nav.textContent = this.statusText(c);
    // Pull live data immediately if backend just got configured
    if (c.backendUrl) { Pipeline.syncFromNotion(); }
  },
};

// ── NAV + SCROLL ──────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const el = document.getElementById(id) || document.querySelector('.hero');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.querySelectorAll('.nav-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.target === id);
        });
        e.target.classList.add('visible');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  document.querySelectorAll('main section').forEach(s => {
    io.observe(s);
    // also fade in
    new IntersectionObserver(([e]) => { if (e.isIntersecting) e.target.classList.add('visible'); }, { threshold: 0.04 }).observe(s);
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Config.load();
  F2.render();
  F3.render();
  F4.render();
  F5.render();
  Pipeline.render();
  initNav();

  // Charts with seed data
  mkChart('ctrChart', SEED.weekLabels, SEED.ctrData, '#00A8E8');
  mkChart('avdChart', SEED.weekLabels, SEED.avdData, '#52B788');

  // If a backend is configured, pull live data
  if (API.enabled()) {
    Pipeline.syncFromNotion();
    F2.pullFromSheets?.();
  }
});
