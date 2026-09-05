// Garage Boss v0.3: Command Center
// Loaded after the Chapter 2 compatibility hotfix.
(() => {
  'use strict';

  const V03_VERSION = '0.3.0-dev';

  try {
    if (sessionStorage.getItem('garageBossForceFreshStart') === '1') {
      localStorage.removeItem('garageBossSave');
      sessionStorage.removeItem('garageBossForceFreshStart');
    }
  } catch (error) {}
  const SCORE_CAPS = { 1: 800, 2: 1600 };
  const METRIC_LABELS = {
    safety: 'Safety',
    compliance: 'Compliance',
    customer: 'Customer Service',
    revenue: 'Revenue',
    staff: 'Staff Management'
  };

  const DISPATCH_INCIDENTS = [
    {
      id: 'bristolDoor',
      category: 'EQUIPMENT',
      title: 'Bristol: 55th Street Door',
      location: 'BRISTOL GARAGE',
      deadline: 450,
      summary: 'The door needs periodic resets, the motor is aging, and winter is not known for patience.',
      choices: [
        {
          id: 'inspect',
          label: 'Delegate to Romane: inspect the motor and prepare a replacement plan',
          assignee: 'Romane',
          minutes: 12,
          score: 45,
          stress: -4,
          metrics: { safety: 12, compliance: 3, customer: 5, revenue: 3, staff: 8 },
          result: 'Romane confirms the motor is near the end of its useful life and documents the replacement scope before the next failure.'
        },
        {
          id: 'reset',
          label: 'Reset it remotely and keep the door moving',
          assignee: 'Manager on duty',
          minutes: 4,
          score: 8,
          stress: 7,
          metrics: { safety: -10, compliance: -2, customer: 3, revenue: 6, staff: -3 },
          result: 'The door opens. Technically, that is a result.',
          followUp: {
            delay: 35,
            score: -30,
            stress: 12,
            metrics: { safety: -10, customer: -12, revenue: -5, staff: -4 },
            text: 'The Bristol door fails again during the rush. Temporary fixes have submitted their invoice.'
          }
        },
        {
          id: 'replace',
          label: 'Authorize a full motor and door replacement immediately',
          assignee: 'Facilities vendor',
          minutes: 8,
          score: 30,
          stress: 3,
          metrics: { safety: 15, compliance: 6, customer: 7, revenue: -12, staff: 4 },
          result: 'The permanent repair is approved, but the capital budget makes a noise from somewhere downtown.'
        }
      ]
    },
    {
      id: 'marloweDrain',
      category: 'CONSTRUCTION',
      title: 'Marlowe: Collapsed Drain Pipe',
      location: 'MARLOWE GARAGE',
      deadline: 480,
      summary: 'Level A is restricted while the pipe is replaced. Departures still expect to depart, which feels demanding.',
      choices: [
        {
          id: 'capacityPlan',
          label: 'Coordinate Sean’s repair and split displaced cars using a capacity plan',
          assignee: 'Sean and operations',
          minutes: 14,
          score: 50,
          stress: -3,
          metrics: { safety: 11, compliance: 5, customer: 9, revenue: 4, staff: 7 },
          result: 'Construction proceeds while Marlowe and Lucerne share the load without trapping scheduled departures.'
        },
        {
          id: 'allLucerne',
          label: 'Send every displaced vehicle to Lucerne',
          assignee: 'Lucerne team',
          minutes: 6,
          score: 12,
          stress: 9,
          metrics: { safety: -2, customer: -10, revenue: 5, staff: -10 },
          result: 'Marlowe has room. Lucerne now resembles a mechanical puzzle designed by an enemy.',
          followUp: {
            delay: 30,
            score: -25,
            stress: 10,
            metrics: { customer: -13, revenue: -4, staff: -7 },
            text: 'Three Lucerne departures are trapped behind transferred vehicles. Garage Tetris has entered overtime.'
          }
        },
        {
          id: 'stayOpen',
          label: 'Keep Level A operating around the repair',
          assignee: 'Marlowe manager',
          minutes: 3,
          score: -25,
          stress: 14,
          metrics: { safety: -20, compliance: -14, customer: -4, revenue: 8, staff: -5 },
          result: 'Operations continue beside an active pipe repair. Everyone involved immediately regrets the sentence.'
        }
      ]
    },
    {
      id: 'vacationCoverage',
      category: 'STAFFING',
      title: 'Fairmont: Vacation Coverage',
      location: 'GARAGE DIVISION OFFICE',
      deadline: 525,
      summary: 'A verbal approval exists, the written schedule is incomplete, and coverage still has to be real.',
      choices: [
        {
          id: 'documentAndCover',
          label: 'Document the approval and rebalance coverage with the supervisors',
          assignee: 'Rory and supervisors',
          minutes: 15,
          score: 45,
          stress: -2,
          metrics: { safety: 2, compliance: 14, customer: 4, revenue: 2, staff: 14 },
          result: 'The approval, coverage plan, and schedule correction are all recorded. Future fact-finders receive fewer mysteries.'
        },
        {
          id: 'retroDeny',
          label: 'Deny the vacation retroactively because the paperwork is incomplete',
          assignee: 'Office',
          minutes: 4,
          score: -20,
          stress: 12,
          metrics: { compliance: -13, customer: -2, revenue: 5, staff: -19 },
          result: 'The schedule looks simpler for approximately nine minutes.',
          followUp: {
            delay: 45,
            score: -20,
            stress: 8,
            metrics: { compliance: -12, staff: -10 },
            text: 'The retroactive denial returns as a grievance and a fact-finding request. Paperwork has achieved revenge.'
          }
        },
        {
          id: 'overtime',
          label: 'Approve the time and cover every opening with overtime',
          assignee: 'Available staff',
          minutes: 8,
          score: 18,
          stress: -5,
          metrics: { safety: 2, compliance: 5, customer: 5, revenue: -15, staff: 9 },
          result: 'Coverage is secure and morale improves. Payroll quietly opens a calculator.'
        }
      ]
    }
  ];

  Object.assign(ACH, { dispatcher: 'Clipboard General' });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function getScoreMaximum() {
    const explicit = Number(S && S.scoreMax);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const chapter = Number(S && S.chapter) || 1;
    return SCORE_CAPS[chapter] || 800;
  }

  function formatMinute(totalMinutes) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
  }

  function freshIncidentState() {
    return {
      status: 'open',
      overdueApplied: false,
      resolvedAt: null,
      decisionId: null,
      decisionLabel: null,
      assignee: null,
      result: null,
      followUpAt: null,
      followUpApplied: false,
      followUpText: null
    };
  }

  function freshCommandState() {
    const incidents = {};
    DISPATCH_INCIDENTS.forEach((incident) => {
      incidents[incident.id] = freshIncidentState();
    });
    return {
      version: 1,
      metrics: { safety: 50, compliance: 50, customer: 50, revenue: 50, staff: 50 },
      incidents,
      achievementAwarded: false
    };
  }

  function ensureCommandState() {
    if (!S || S.chapter !== 2) return null;
    const fresh = freshCommandState();
    if (!S.commandCenter || typeof S.commandCenter !== 'object') S.commandCenter = fresh;
    const state = S.commandCenter;

    state.version = 1;
    if (!state.metrics || typeof state.metrics !== 'object') state.metrics = {};
    Object.keys(METRIC_LABELS).forEach((key) => {
      if (!Number.isFinite(Number(state.metrics[key]))) state.metrics[key] = fresh.metrics[key];
      state.metrics[key] = clamp(Number(state.metrics[key]), 0, 100);
    });

    if (!state.incidents || typeof state.incidents !== 'object') state.incidents = {};
    DISPATCH_INCIDENTS.forEach((incident) => {
      if (!state.incidents[incident.id] || typeof state.incidents[incident.id] !== 'object') {
        state.incidents[incident.id] = freshIncidentState();
        return;
      }
      const incidentState = state.incidents[incident.id];
      const defaults = freshIncidentState();
      Object.entries(defaults).forEach(([key, value]) => {
        if (!(key in incidentState)) incidentState[key] = value;
      });
    });

    state.achievementAwarded = Boolean(state.achievementAwarded);
    state.overloadTriggered = Boolean(state.overloadTriggered);
    return state;
  }

  function adjustMetrics(delta = {}) {
    const state = ensureCommandState();
    if (!state) return;
    Object.keys(METRIC_LABELS).forEach((key) => {
      state.metrics[key] = clamp(Number(state.metrics[key] || 0) + Number(delta[key] || 0), 0, 100);
    });
  }

  function applyDirectEffects({ score = 0, stress: stressDelta = 0, metrics = {} }, logText) {
    S.score = clamp(Number(S.score || 0) + score, 0, getScoreMaximum());
    S.stress = clamp(Number(S.stress || 0) + stressDelta, 0, 100);
    adjustMetrics(metrics);
    if (logText) addLog(logText);
  }

  function unresolvedIncidents() {
    const state = ensureCommandState();
    if (!state) return [];
    return DISPATCH_INCIDENTS.filter((incident) => state.incidents[incident.id].status !== 'resolved');
  }

  function allDispatchResolved() {
    return S.chapter === 2 && unresolvedIncidents().length === 0;
  }

  function checkCommandTimers() {
    const state = ensureCommandState();
    if (!state) return [];
    const notices = [];

    DISPATCH_INCIDENTS.forEach((incident) => {
      const incidentState = state.incidents[incident.id];
      if (incidentState.status !== 'resolved' && !incidentState.overdueApplied && S.min > incident.deadline) {
        incidentState.overdueApplied = true;
        applyDirectEffects(
          { score: -15, stress: 6, metrics: { customer: -6, staff: -4 } },
          `-15 Dispatch deadline missed: ${incident.title}`
        );
        notices.push(`${incident.title} is overdue.`);
      }

      if (
        incidentState.status === 'resolved' &&
        incidentState.followUpAt !== null &&
        !incidentState.followUpApplied &&
        S.min >= incidentState.followUpAt
      ) {
        const choice = incident.choices.find((item) => item.id === incidentState.decisionId);
        if (choice && choice.followUp) {
          incidentState.followUpApplied = true;
          incidentState.followUpText = choice.followUp.text;
          applyDirectEffects(
            choice.followUp,
            `${choice.followUp.score >= 0 ? '+' : ''}${choice.followUp.score} Delayed consequence: ${incident.title}`
          );
          notices.push(choice.followUp.text);
        }
      }
    });

    return notices;
  }

  function awardDispatchAchievement() {
    const state = ensureCommandState();
    if (!state || state.achievementAwarded || !allDispatchResolved()) return;
    state.achievementAwarded = true;
    if (!S.ach.includes('dispatcher')) {
      S.ach.push('dispatcher');
      toast(`🏆 ${ACH.dispatcher}`);
      sfx('good');
    }
  }

  function applyDispatchDecision(incidentId, choiceId) {
    const state = ensureCommandState();
    const incident = DISPATCH_INCIDENTS.find((item) => item.id === incidentId);
    if (!state || !incident) return;
    const incidentState = state.incidents[incidentId];
    if (incidentState.status === 'resolved') return toast('That dispatch is already closed');

    checkCommandTimers();
    const choice = incident.choices.find((item) => item.id === choiceId);
    if (!choice) return;

    incidentState.status = 'resolved';
    incidentState.decisionId = choice.id;
    incidentState.decisionLabel = choice.label;
    incidentState.assignee = choice.assignee;
    incidentState.result = choice.result;

    S.min += choice.minutes;
    incidentState.resolvedAt = S.min;
    if (choice.followUp) incidentState.followUpAt = S.min + choice.followUp.delay;
    applyDirectEffects(
      choice,
      `${choice.score >= 0 ? '+' : ''}${choice.score} Dispatch resolved: ${incident.title}`
    );
    awardDispatchAchievement();
    const notices = checkCommandTimers();
    autosave();
    choice.score >= 0 ? sfx('good') : sfx('bad');
    update();
    openCommandCenter();
    toast(notices[0] || `${incident.title} assigned to ${choice.assignee}`);

    if (S.stress >= 100) {
      setTimeout(() => gameOver(
        'COMMAND CENTER OVERLOAD',
        'Three emergencies, one clipboard, and exactly zero remaining patience.'
      ), 0);
    }
  }

  function metricAverage() {
    const state = ensureCommandState();
    if (!state) return 0;
    const values = Object.keys(METRIC_LABELS).map((key) => Number(state.metrics[key] || 0));
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }

  function performanceLabel() {
    const average = metricAverage();
    if (average >= 85) return 'NETWORK COMMANDER';
    if (average >= 72) return 'BALANCED OPERATOR';
    if (average >= 58) return 'WORKING THE PROBLEM';
    if (average >= 45) return 'CONTROLLED CHAOS';
    return 'THE CLIPBOARD NEEDS A VACATION';
  }

  function metricsHtml(compact = false) {
    const state = ensureCommandState();
    if (!state) return '';
    return Object.entries(METRIC_LABELS).map(([key, label]) => {
      const value = Math.round(state.metrics[key]);
      return `<div class="command-metric${compact ? ' compact' : ''}">
        <div class="command-metric-label"><span>${label}</span><b>${value}</b></div>
        <div class="command-metric-track"><i style="width:${value}%"></i></div>
      </div>`;
    }).join('');
  }

  function incidentStatusHtml(incident, incidentState) {
    if (incidentState.status === 'resolved') {
      return `<span class="dispatch-status resolved">RESOLVED ${formatMinute(incidentState.resolvedAt)}</span>`;
    }
    if (incidentState.overdueApplied || S.min > incident.deadline) {
      return '<span class="dispatch-status overdue">OVERDUE</span>';
    }
    const remaining = incident.deadline - S.min;
    return `<span class="dispatch-status live">DUE ${formatMinute(incident.deadline)} • ${remaining} MIN</span>`;
  }

  function incidentHtml(incident) {
    const state = ensureCommandState();
    const incidentState = state.incidents[incident.id];
    const resolved = incidentState.status === 'resolved';
    const choices = resolved ? '' : `<div class="dispatch-choices">${incident.choices.map((choice) =>
      `<button data-dispatch="${incident.id}" data-choice="${choice.id}">
        <span>${choice.label}</span>
        <small>${choice.minutes} min • ${choice.score >= 0 ? '+' : ''}${choice.score} score</small>
      </button>`
    ).join('')}</div>`;

    const result = resolved ? `<div class="dispatch-result">
      <b>${incidentState.assignee}</b>
      <p>${incidentState.result}</p>
      ${incidentState.followUpAt !== null && !incidentState.followUpApplied
        ? `<small>Follow-up risk window: ${formatMinute(incidentState.followUpAt)}</small>` : ''}
      ${incidentState.followUpText ? `<p class="dispatch-consequence">${incidentState.followUpText}</p>` : ''}
    </div>` : '';

    return `<article class="dispatch-card ${resolved ? 'resolved' : incidentState.overdueApplied ? 'overdue' : ''}">
      <div class="dispatch-card-head">
        <div><small>${incident.category} • ${incident.location}</small><h3>${incident.title}</h3></div>
        ${incidentStatusHtml(incident, incidentState)}
      </div>
      <p>${incident.summary}</p>
      ${choices}${result}
    </article>`;
  }

  function commandCenterReportHtml() {
    if (!S.commandCenter) return '';
    const resolved = DISPATCH_INCIDENTS.length - unresolvedIncidents().length;
    return `<section class="command-final-report">
      <h3>COMMAND CENTER REPORT</h3>
      <div class="statline"><span>Dispatches resolved</span><b>${resolved}/${DISPATCH_INCIDENTS.length}</b></div>
      <div class="statline"><span>Management rating</span><b>${metricAverage()} • ${performanceLabel()}</b></div>
      <div class="command-metrics">${metricsHtml(true)}</div>
    </section>`;
  }

  function openCommandCenter() {
    if (S.chapter !== 2) {
      modal(
        'COMMAND CENTER LOCKED',
        `<p>The v0.3 dispatch board becomes active in Chapter 2.</p>
         <p>It adds simultaneous emergencies, delegation, deadlines, delayed consequences, and performance tracking.</p>`,
        [['Close', () => hideModal()]]
      );
      return;
    }

    ensureCommandState();
    const notices = checkCommandTimers();
    autosave();
    const unresolved = unresolvedIncidents().length;
    const html = `<div class="command-overview">
      <div><small>LIVE DISPATCHES</small><strong>${unresolved}</strong></div>
      <div><small>MANAGEMENT RATING</small><strong>${metricAverage()}</strong></div>
      <div><small>STATUS</small><strong>${performanceLabel()}</strong></div>
    </div>
    <div class="command-metrics">${metricsHtml()}</div>
    <div class="dispatch-list">${DISPATCH_INCIDENTS.map(incidentHtml).join('')}</div>`;

    modal('GARAGE DIVISION COMMAND CENTER', html, [['Return to Garage Network', () => hideModal()]]);
    document.querySelectorAll('[data-dispatch][data-choice]').forEach((button) => {
      button.onclick = () => applyDispatchDecision(button.dataset.dispatch, button.dataset.choice);
    });
    if (notices.length) toast(notices[0]);
  }

  function ensureCommandButton() {
    let button = $('commandBtn');
    if (!button) {
      button = document.createElement('button');
      button.id = 'commandBtn';
      button.className = 'iconbtn command-btn';
      button.title = 'Command Center';
      const chapterButton = $('chapterBtn');
      if (chapterButton) chapterButton.insertAdjacentElement('beforebegin', button);
      else document.querySelector('.top-actions').appendChild(button);
    }

    const count = S.chapter === 2 ? unresolvedIncidents().length : 0;
    button.textContent = 'CMD';
    button.dataset.count = S.chapter === 2 ? String(count) : '🔒';
    button.classList.toggle('active', S.chapter === 2);
    button.onclick = () => {
      sfx('click');
      openCommandCenter();
    };
  }

  function ensureCommandPanel() {
    let panel = $('commandCenterPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'commandCenterPanel';
      panel.className = 'panel command-center-panel';
      const casePanel = $('caseBoard').closest('.panel');
      casePanel.insertAdjacentElement('afterend', panel);
    }
    return panel;
  }

  function renderCommandPanel() {
    const panel = ensureCommandPanel();
    if (S.chapter !== 2) {
      panel.innerHTML = `<div class="panel-title"><span>COMMAND CENTER</span><small>v${V03_VERSION}</small></div>
        <p class="command-locked">🔒 Activates in Chapter 2</p>
        <button class="command-open">PREVIEW</button>`;
      panel.querySelector('.command-open').onclick = openCommandCenter;
      return;
    }

    const remaining = unresolvedIncidents();
    const next = remaining.slice().sort((a, b) => a.deadline - b.deadline)[0];
    panel.innerHTML = `<div class="panel-title"><span>COMMAND CENTER</span><small>${remaining.length} LIVE</small></div>
      <div class="command-panel-stats">
        <div><span>RATING</span><b>${metricAverage()}</b></div>
        <div><span>NEXT</span><b>${next ? formatMinute(next.deadline) : 'CLEAR'}</b></div>
      </div>
      <div class="command-panel-metrics">${metricsHtml(true)}</div>
      <button class="command-open">OPEN DISPATCH BOARD</button>`;
    panel.querySelector('.command-open').onclick = openCommandCenter;
  }

  function syncScoreHud() {
    const score = $('score');
    if (!score) return;
    const strong = score.parentElement;
    const maximum = getScoreMaximum();
    if (strong.dataset.scoreMaximum !== String(maximum)) {
      strong.innerHTML = `<b id="score">${S.score}</b> / ${maximum}`;
      strong.dataset.scoreMaximum = String(maximum);
    } else {
      $('score').textContent = S.score;
    }
  }

  // Fix the shared engine score cap. Chapter 2 can now reach its advertised ranks.
  points = function (amount, message) {
    S.score = clamp(Number(S.score || 0) + amount, 0, getScoreMaximum());
    addLog(`${amount >= 0 ? '+' : ''}${amount} ${message}`);
    amount >= 0 ? sfx('good') : sfx('bad');
    update();
  };

  const updateBeforeV03 = update;
  update = function () {
    const notices = S.chapter === 2 ? checkCommandTimers() : [];
    updateBeforeV03();
    syncScoreHud();
    ensureCommandButton();
    renderCommandPanel();
    if (notices.length) setTimeout(() => toast(notices[0]), 0);
    if (S.chapter === 2 && S.stress >= 100) {
      const state = ensureCommandState();
      if (state && !state.overloadTriggered) {
        state.overloadTriggered = true;
        setTimeout(() => gameOver(
          'COMMAND CENTER OVERLOAD',
          'Three emergencies, one clipboard, and exactly zero remaining patience.'
        ), 0);
      }
    }
  };

  const loadBeforeV03 = loadGame;
  loadGame = function () {
    loadBeforeV03();
    if (S.chapter === 2) ensureCommandState();
    update();
  };
  $('loadBtn').onclick = () => loadGame();

  const startChapter2BeforeV03 = startChapter2;
  startChapter2 = function () {
    if (S.chapter === 2) {
      const chapterOneScore = Number.isFinite(Number(S.chapter1Score)) ? Number(S.chapter1Score) : Math.min(S.score, 800);
      const chapterTwoAchievements = new Set([...Object.keys(CH2_ACH), 'dispatcher']);
      S.score = chapterOneScore;
      S.ach = (S.ach || []).filter((key) => !chapterTwoAchievements.has(key));
    }
    startChapter2BeforeV03();
    ensureCommandState();
    update();
  };

  // Chapter 2 replaces the Chapter 1 location objects. A full reload is the safest clean replay.
  const newGameBeforeV03 = newGame;
  newGame = function () {
    const chapterTwoObjectsAreActive = S.chapter === 2 || !LOC.office || !CASES.monthly;
    if (chapterTwoObjectsAreActive) {
      try {
        sessionStorage.setItem('garageBossForceFreshStart', '1');
        localStorage.removeItem('garageBossSave');
      } catch (error) {}
      location.reload();
      return;
    }
    newGameBeforeV03();
  };

  const chapterTwoFinaleBeforeV03 = ch2Finale;
  ch2Finale = function () {
    if (S.chapter === 2) {
      if (!ch2AllDone()) return chapterTwoFinaleBeforeV03();
      ensureCommandState();
      checkCommandTimers();
      const remaining = unresolvedIncidents();
      if (remaining.length) {
        return say(
          'CHRISTINE',
          `The case board is clear, but the Command Center still has ${remaining.length} live dispatch${remaining.length === 1 ? '' : 'es'}.`,
          [
            ['Open Command Center', () => openCommandCenter()],
            ['Keep working', () => say('RICHIE', 'The clipboard is not clearing itself.')]
          ]
        );
      }
    }
    return chapterTwoFinaleBeforeV03();
  };

  const modalBeforeV03 = modal;
  modal = function (title, html, actions) {
    if (S.chapter === 2 && S.ending && allDispatchResolved() && html.includes('Total score')) {
      html += commandCenterReportHtml();
    }
    return modalBeforeV03(title, html, actions);
  };

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'c' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    openCommandCenter();
  });

  document.body.classList.add('garage-boss-v03');
  const footer = document.querySelector('footer');
  if (footer) footer.textContent = `Garage Boss v${V03_VERSION} • Command Center development branch • autosaves locally`;

  ensureCommandButton();
  renderCommandPanel();
  syncScoreHud();
})();
