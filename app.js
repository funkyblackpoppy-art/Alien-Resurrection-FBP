// ============================================================
// Creator HQ — app.js
// IIFE module pattern, no build tools required.
// ============================================================
const CreatorOS = (function () {

  // ── SEED DATA ─────────────────────────────────────────────

  const AUDIT_DATA = [
    { title: 'Identity & Brand Clarity', score: 4, action: 'Define a crisp one-liner: "I fly sims so you don\'t have to wait 10 years for a PPL."' },
    { title: 'Hook Architecture', score: 3, action: 'Open every video in the cockpit, mid-action — skip the intro card.' },
    { title: 'Niche SEO', score: 5, action: 'Target "MSFS [airport/scenario]" long-tails — high search, low competition.' },
    { title: 'Monetization Infrastructure', score: 2, action: 'Add affiliate links to description NOW — Honeycomb, Thrustmaster, Orbx.' },
    { title: 'Shorts Pipeline', score: 3, action: 'Clip every long-form at the landing, a turbulence spike, and an ATC moment.' },
    { title: 'Community Architecture', score: 2, action: 'Set up Discord with #flight-reports, #gear-talk, #passenger-seat channels.' },
    { title: 'Retention Systems', score: 4, action: 'Study your top 20% AVD timestamps — those are your story beats to repeat.' },
    { title: 'Sponsorship Readiness', score: 1, action: 'Build a media kit Google Doc now — even at 0 subs, brands respect preparation.' },
  ];

  const FABLE5_DATA = [
    {
      icon: '📖', title: 'Story Engine', status: 'building',
      desc: 'Compression-driven storytelling: Intro → Problem → Revelation → You',
      tasks: [
        'Write the channel trailer script using the 4-part spine',
        'Apply the Flight Plan template to every upload (see Content Pillars)',
        'Edit your last 3 videos: find where the story starts — cut everything before it',
        'Create a "story beat" checklist you tick before exporting each video',
        'Practice the "you" turn: end every video addressing the viewer directly',
      ]
    },
    {
      icon: '📡', title: 'Retention Radar', status: 'planned',
      desc: 'Track AVD, CTR, rewatch spikes, and comment sentiment weekly',
      tasks: [
        'Set up the Google Sheets metrics tab (see /creator-hq sheets-setup)',
        'Log CTR and AVD for every video within 48h of publishing',
        'Find your highest-retention 30-second window — reverse-engineer why',
        'Build a "rewatch spike" journal: what caused viewers to replay?',
        'Review comment sentiment monthly: what do viewers thank you for?',
      ]
    },
    {
      icon: '⚡', title: 'Shorts Autopilot', status: 'building',
      desc: 'Clip every long-form at 3 viral moments: arrival, chaos, landing',
      tasks: [
        'After each upload, export 3 clips: arrival, unexpected event, landing',
        'Add text overlays: location + altitude + speed in Shorts',
        'Test 3 different thumbnail styles for Shorts this month',
        'Track which Shorts moment drives the most long-form clicks',
        'Set a Shorts publishing schedule: 3x/week, same days',
      ]
    },
    {
      icon: '🏘️', title: 'Community Brief', status: 'planned',
      desc: 'Weekly Discord/Community post brief driven by analytics',
      tasks: [
        'Create Discord with: #flight-reports, #gear-talk, #passenger-seat, #polls',
        'Post a weekly "where should I fly next?" Community poll',
        'Feature one subscriber comment/question in each video',
        'Write a monthly "crew debrief" Community post with your metrics highlights',
        'Run a monthly "name this livery" contest for engagement',
      ]
    },
    {
      icon: '🏔️', title: 'Revenue Tower', status: 'planned',
      desc: 'Six-stream ladder: affiliate → membership → merch → sponsors → digital → courses',
      tasks: [
        'Add 5 affiliate links to every video description today',
        'Draft the two membership tier descriptions (Co-Pilot / Captain)',
        'Design 1 merch concept — minimal, flight-sim themed',
        'Write a one-page sponsorship pitch doc (even at 0 subs)',
        'Outline one digital product: "Ultimate MSFS Landing Checklist" PDF',
      ]
    },
  ];

  const PILLARS_DATA = [
    {
      name: 'Destination Flights', pct: '40%',
      ideas: [
        { title: 'Landing at Lukla at Night — The World\'s Most Dangerous Airport', status: 'idea' },
        { title: 'Cross-Atlantic in a Cessna 172 — Can We Make It?', status: 'scripted' },
        { title: 'Flying into JFK During a Category 2 Thunderstorm', status: 'idea' },
        { title: 'Every Major Airport in Japan — 24-Hour Challenge', status: 'idea' },
        { title: 'The Patagonia Run: Ushuaia to Santiago in an A320', status: 'idea' },
      ]
    },
    {
      name: 'Tech & Setup', pct: '35%',
      ideas: [
        { title: 'The $300 Budget Sim Setup That Actually Works', status: 'scripted' },
        { title: 'Best Free Liveries for MSFS 2024 — My Top 10', status: 'idea' },
        { title: 'Honeycomb Alpha vs Logitech G Yoke: Real Talk', status: 'idea' },
        { title: 'How I Got My MSFS Looking Cinematic for Under $50', status: 'filmed' },
        { title: 'The Add-Ons Worth Paying For vs. Free Alternatives', status: 'idea' },
      ]
    },
    {
      name: 'Real World × Sim', pct: '25%',
      ideas: [
        { title: 'Recreating Southwest 1380: Engine Failure Over PA', status: 'idea' },
        { title: 'The Miracle on the Hudson — Full Approach Reconstructed', status: 'scripted' },
        { title: 'I Followed a Real Pilot\'s Actual Flight Log in MSFS', status: 'idea' },
        { title: 'Air France 447: What the Sim Teaches You About Automation', status: 'idea' },
        { title: 'Flying the Route That Changed Aviation: Kitty Hawk in a Flyer', status: 'idea' },
      ]
    },
  ];

  const RUNWAY_DATA = [
    {
      phase: 'Phase 1 · Foundations', days: 'Days 1–30',
      weeks: [
        { label: 'Week 1', tasks: ['Finalize channel art, banner, and one-liner bio', 'Write and record channel trailer using the 4-part story spine', 'Set up Discord with 4 starter channels'] },
        { label: 'Week 2', tasks: ['Publish Destination Flight #1 using the Flight Plan template', 'Add 5 affiliate links to description', 'Clip 3 Shorts from the video'] },
        { label: 'Week 3', tasks: ['Publish Tech & Setup video — budget sim rig', 'Research top 10 MSFS SEO keywords in your niche', 'Post first Community poll: "Where next?"'] },
        { label: 'Week 4', tasks: ['Publish Real World × Sim video', 'Review Week 1-3 CTR and AVD — log in Google Sheets', 'Write 2 more video scripts based on highest-retention moments'] },
      ]
    },
    {
      phase: 'Phase 2 · Consistency', days: 'Days 31–60',
      weeks: [
        { label: 'Week 5–6', tasks: ['Publish 2 videos/week cadence begins', 'A/B test 2 thumbnail styles on next upload', 'Feature first subscriber comment/question in a video'] },
        { label: 'Week 7–8', tasks: ['Publish Shorts 3x/week — track which drives long-form clicks', 'Write and schedule 4 Community posts for the month', 'Hit 250 subs? Post a milestone video'] },
        { label: 'Week 9–10', tasks: ['Audit retention: find your #1 story beat — double down on it', 'Create "Crew Debrief" monthly metrics post', 'Draft media kit (even with small numbers — brands respect it)'] },
        { label: 'Week 11–12', tasks: ['Review affiliate link performance — swap out underperformers', 'Start scripting digital product: Landing Checklist PDF', 'Collaborate: reach out to 3 other MSFS creators for a collab'] },
      ]
    },
    {
      phase: 'Phase 3 · Monetize', days: 'Days 61–90',
      weeks: [
        { label: 'Week 13–14', tasks: ['Launch Channel Membership if at 500+ subs — two tiers', 'Publish and promote Landing Checklist digital product', 'Run a Discord "co-pilot seat" event: fly together live'] },
        { label: 'Week 15–16', tasks: ['Pitch 3 sim hardware brands with your media kit', 'Design first merch drop — one clean flight-themed item', 'Review 90-day metrics: CTR, AVD, sub rate — plan Q2'] },
        { label: 'Week 17–18', tasks: ['Film and publish "90-Day Results" transparency video', 'Outline online course if at 2K+ subs', 'Set Q2 targets: subs, revenue, content volume'] },
        { label: 'Week 19–20', tasks: ['Lock in first brand deal if outreach paid off', 'Schedule Season 2 content calendar', 'Celebrate — you built a creator OS from scratch'] },
      ]
    },
  ];

  const KPI_DATA = [
    { label: 'Click-Through Rate', value: '—', unit: '%', target: 'Target: 8%', trend: '' },
    { label: 'Avg View Duration', value: '—', unit: 'min', target: 'Target: 8 min', trend: '' },
    { label: 'Sub Growth / Week', value: '—', unit: '', target: 'Target: +50/wk', trend: '' },
    { label: 'RPM', value: '—', unit: '$', target: 'Target: $3', trend: '' },
    { label: 'Engagement Rate', value: '—', unit: '%', target: 'Target: 5%', trend: '' },
    { label: 'Shorts → Long Conv.', value: '—', unit: '%', target: 'Target: 3%', trend: '' },
  ];

  const SAMPLE_WEEKS = ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6', 'Wk7', 'Wk8'];
  const SAMPLE_METRICS = {
    ctr:        [1.2, 1.8, 2.1, 2.8, 3.4, 4.1, 4.9, 5.6],
    avd:        [2.1, 2.8, 3.5, 4.0, 4.8, 5.5, 6.2, 7.1],
    subgrowth:  [2,   5,   9,  15,  22,  31,  40,  52],
    rpm:        [0.8, 1.1, 1.3, 1.5, 1.8, 2.1, 2.4, 2.7],
    engagement: [1.2, 1.9, 2.5, 3.0, 3.5, 3.8, 4.2, 4.7],
    conversion: [0.3, 0.5, 0.8, 1.1, 1.4, 1.8, 2.2, 2.6],
  };

  const REVENUE_DATA = [
    {
      icon: '🔗', name: 'Affiliate Links', tier: 'now', tierLabel: 'Start Now',
      desc: 'Honeycomb Alpha, Thrustmaster TCA, Orbx scenery, PMDG aircraft, PC parts.',
      range: '$20–$200/mo early on',
      action: 'Add links to description →',
    },
    {
      icon: '👥', name: 'Channel Membership', tier: 'tier500', tierLabel: 'At 500 subs',
      desc: 'Co-Pilot ($2.99/mo): early access. Captain ($9.99/mo): Discord, Q&A, livery requests.',
      range: '$150–$600/mo at 1K subs',
      action: 'Draft tier descriptions →',
    },
    {
      icon: '👕', name: 'Merch', tier: 'tier1k', tierLabel: 'At 1K subs',
      desc: 'Minimal flight-themed apparel via Printful/Spring. Start with one hero item.',
      range: '$100–$400/mo at 2K subs',
      action: 'Design first item →',
    },
    {
      icon: '📄', name: 'Digital Products', tier: 'tier2k', tierLabel: 'At 2K subs',
      desc: 'MSFS landing checklists, livery packs, approach procedures, custom scenery files.',
      range: '$200–$800/mo at 5K subs',
      action: 'Outline checklist PDF →',
    },
    {
      icon: '🤝', name: 'Brand Sponsorships', tier: 'tier5k', tierLabel: 'At 5K subs',
      desc: 'Honeycomb, Thrustmaster, Orbx, Navigraph, SimBrief — all sponsor creators at this scale.',
      range: '$500–$2,000/video',
      action: 'Write media kit →',
    },
    {
      icon: '🎓', name: 'Online Course', tier: 'tier10k', tierLabel: 'At 10K subs',
      desc: '"Learn to Fly Sims" — beginner to IFR in MSFS. Self-paced, video-led, $49–$99.',
      range: '$1,000–$5,000/launch',
      action: 'Outline course modules →',
    },
  ];

  // ── HELPERS ────────────────────────────────────────────────

  function ragFromScore(score) {
    if (score >= 7) return 'green';
    if (score >= 4) return 'amber';
    return 'red';
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  // ── CHANNEL AUDIT ──────────────────────────────────────────

  function renderAudit() {
    const grid = document.getElementById('auditGrid');
    grid.innerHTML = '';
    AUDIT_DATA.forEach(item => {
      const rag = ragFromScore(item.score);
      const card = el('div', 'card');
      card.innerHTML = `
        <div class="audit-card-header">
          <span class="audit-card-title">${item.title}</span>
          <span class="rag-dot" data-rag="${rag}"></span>
        </div>
        <div class="audit-score">${item.score}<span>/10</span></div>
        <div class="audit-action">${item.action}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ── FABLE5 ─────────────────────────────────────────────────

  function renderFable5() {
    const stack = document.getElementById('fable5Stack');
    stack.innerHTML = '';
    FABLE5_DATA.forEach(item => {
      const card = el('div', 'card fable5-card');
      card.innerHTML = `
        <div class="fable5-card-header">
          <span class="fable5-icon">${item.icon}</span>
          <div class="fable5-meta">
            <div class="fable5-title">${item.title}</div>
            <div class="fable5-desc">${item.desc}</div>
          </div>
          <span class="status-badge ${item.status}">${item.status}</span>
          <span class="fable5-toggle">▼</span>
        </div>
        <div class="fable5-tasks">
          <ul class="task-list">
            ${item.tasks.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      `;
      card.querySelector('.fable5-card-header').addEventListener('click', () => {
        card.classList.toggle('expanded');
        card.querySelector('.fable5-toggle').textContent = card.classList.contains('expanded') ? '▲' : '▼';
      });
      stack.appendChild(card);
    });
  }

  // ── CONTENT PILLARS ────────────────────────────────────────

  function renderPillars() {
    const notionCfg = CREATOROS_CONFIG.notionProxyUrl;
    const cta = document.getElementById('pillarsNotionCta');
    if (!notionCfg) {
      cta.innerHTML = `<div class="notion-cta">💡 Connect Notion to sync your live content pipeline — run <strong>/creator-hq notion-setup</strong> for the guide.</div>`;
    }

    const grid = document.getElementById('pillarsGrid');
    grid.innerHTML = '';
    PILLARS_DATA.forEach(pillar => {
      const card = el('div', 'card');
      card.innerHTML = `
        <div class="pillar-header">
          <div class="pillar-name">${pillar.name}</div>
          <span class="pillar-pct">${pillar.pct}</span>
        </div>
        ${pillar.ideas.map(idea => `
          <div class="video-idea">
            <div class="idea-status ${idea.status}"></div>
            <span>${idea.title}</span>
          </div>
        `).join('')}
      `;
      grid.appendChild(card);
    });
  }

  // ── 90-DAY RUNWAY ──────────────────────────────────────────

  function runwayKey(phase, week, task) {
    return `runway_${phase}_${week}_${task}`;
  }

  function renderRunway() {
    const panels = document.getElementById('runwayPanels');
    panels.innerHTML = '';

    RUNWAY_DATA.forEach((phase, pi) => {
      const panel = el('div', `phase-panel${pi === 0 ? ' active' : ''}`);
      panel.dataset.phase = pi;

      // Count total tasks
      let total = 0, done = 0;
      phase.weeks.forEach((week, wi) => {
        week.tasks.forEach((_, ti) => {
          total++;
          if (localStorage.getItem(runwayKey(pi, wi, ti)) === '1') done++;
        });
      });
      const pct = total ? Math.round((done / total) * 100) : 0;

      panel.innerHTML = `
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${phase.days} · ${done}/${total} tasks complete</p>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="runway-weeks"></div>
      `;

      const weeksEl = panel.querySelector('.runway-weeks');
      phase.weeks.forEach((week, wi) => {
        const wb = el('div', 'week-block card', `<div class="week-label">${week.label}</div><div class="task-checks"></div>`);
        const checks = wb.querySelector('.task-checks');
        week.tasks.forEach((task, ti) => {
          const key = runwayKey(pi, wi, ti);
          const isDone = localStorage.getItem(key) === '1';
          const item = el('label', `task-check-item${isDone ? ' done' : ''}`);
          item.innerHTML = `<input type="checkbox" ${isDone ? 'checked' : ''} />${task}`;
          item.querySelector('input').addEventListener('change', e => {
            localStorage.setItem(key, e.target.checked ? '1' : '0');
            item.classList.toggle('done', e.target.checked);
            renderRunway(); // re-render to update progress
          });
          checks.appendChild(item);
        });
        weeksEl.appendChild(wb);
      });

      panels.appendChild(panel);
    });

    // Phase tab switching
    document.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.phase-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.phase-panel').forEach(p => p.classList.remove('active'));
        document.querySelector(`.phase-panel[data-phase="${btn.dataset.phase}"]`).classList.add('active');
      });
    });
  }

  // ── METRICS ────────────────────────────────────────────────

  let chartInstances = [];

  function renderMetrics(liveData) {
    const sheetsOk = CREATOROS_CONFIG.googleSheetsApiKey && CREATOROS_CONFIG.googleSheetsId;
    const cta = document.getElementById('sheetsStatusCta');
    if (!sheetsOk) {
      cta.innerHTML = `<div class="sheets-cta">📊 Connect Google Sheets to show live metrics — run <strong>/creator-hq sheets-setup</strong> for the step-by-step guide.</div>`;
    } else {
      cta.innerHTML = '';
    }

    // KPI tiles
    const kpiGrid = document.getElementById('kpiGrid');
    kpiGrid.innerHTML = '';
    KPI_DATA.forEach(k => {
      kpiGrid.innerHTML += `
        <div class="card kpi-card">
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-value">${k.value}${k.unit ? `<small style="font-size:14px">${k.unit}</small>` : ''}</div>
          <div class="kpi-target">${k.target}</div>
        </div>
      `;
    });

    // Charts
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
    const chartsGrid = document.getElementById('chartsGrid');
    chartsGrid.innerHTML = '';

    const chartDefs = [
      { label: 'CTR (%)',            key: 'ctr',        unit: '%' },
      { label: 'Avg View Duration',  key: 'avd',        unit: 'min' },
      { label: 'Sub Growth / Week',  key: 'subgrowth',  unit: '' },
      { label: 'RPM ($)',            key: 'rpm',        unit: '$' },
      { label: 'Engagement Rate (%)',key: 'engagement', unit: '%' },
      { label: 'Shorts → Long (%)',  key: 'conversion', unit: '%' },
    ];

    const data = liveData || SAMPLE_METRICS;
    const labels = liveData ? liveData.labels : SAMPLE_WEEKS;

    chartDefs.forEach(def => {
      const wrap = el('div', 'card chart-card');
      wrap.innerHTML = `<div class="chart-title">${def.label}${!liveData ? ' <span style="color:var(--text-muted);font-weight:400;">(sample data)</span>' : ''}</div><canvas></canvas>`;
      chartsGrid.appendChild(wrap);
      const ctx = wrap.querySelector('canvas');
      const inst = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data: data[def.key] || [],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.08)',
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#00d4ff',
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          }
        }
      });
      chartInstances.push(inst);
    });
  }

  // ── GOOGLE SHEETS FETCH ────────────────────────────────────

  async function fetchGoogleSheets() {
    const { googleSheetsApiKey: key, googleSheetsId: id, googleSheetsTab: tab } = CREATOROS_CONFIG;
    if (!key || !id) return null;
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${tab}!A:G?key=${key}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      const rows = json.values || [];
      if (rows.length < 2) return null;
      const labels = rows.slice(1).map(r => r[0] || '');
      return {
        labels,
        ctr:        rows.slice(1).map(r => parseFloat(r[1]) || 0),
        avd:        rows.slice(1).map(r => parseFloat(r[2]) / 60 || 0),
        subgrowth:  rows.slice(1).map(r => parseFloat(r[3]) || 0),
        rpm:        rows.slice(1).map(r => parseFloat(r[4]) || 0),
        engagement: rows.slice(1).map(r => parseFloat(r[5]) || 0),
        conversion: rows.slice(1).map(r => parseFloat(r[6]) || 0),
      };
    } catch (_) { return null; }
  }

  // ── REVENUE ────────────────────────────────────────────────

  function renderRevenue() {
    const grid = document.getElementById('revenueGrid');
    grid.innerHTML = '';
    REVENUE_DATA.forEach(item => {
      grid.innerHTML += `
        <div class="card">
          <div class="revenue-card-top">
            <span class="revenue-icon">${item.icon}</span>
            <span class="tier-badge ${item.tier}">${item.tierLabel}</span>
          </div>
          <div class="revenue-name">${item.name}</div>
          <div class="revenue-desc">${item.desc}</div>
          <div class="revenue-range">${item.range}</div>
          <button class="revenue-action">${item.action}</button>
        </div>
      `;
    });
  }

  // ── NAV / SCROLL ───────────────────────────────────────────

  function initNav() {
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Highlight active nav tab on scroll
    const sections = document.querySelectorAll('main section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
          const tab = document.querySelector(`.nav-tab[data-target="${e.target.id}"]`);
          if (tab) tab.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // Fade sections in on scroll
  function initScrollReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.05 });
    document.querySelectorAll('main section').forEach(s => io.observe(s));
  }

  // ── INIT ───────────────────────────────────────────────────

  async function init() {
    renderAudit();
    renderFable5();
    renderPillars();
    renderRunway();
    renderRevenue();
    renderMetrics(null); // render with sample data first
    initNav();
    initScrollReveal();

    // Then try to load live Google Sheets data
    const live = await fetchGoogleSheets();
    if (live) renderMetrics(live);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', CreatorOS.init);
