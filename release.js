// Garage Boss v0.3 release polish and finale safeguards.
(() => {
  'use strict';

  const RELEASE_VERSION = '0.3.0';
  const RELEASE_TITLE = `Garage Boss v${RELEASE_VERSION}: Command Center`;

  function cloneState() {
    try {
      return typeof structuredClone === 'function'
        ? structuredClone(S)
        : JSON.parse(JSON.stringify(S));
    } catch (error) {
      return null;
    }
  }

  function pendingConsequences() {
    if (!S || S.chapter !== 2 || !S.commandCenter || !S.commandCenter.incidents) return [];
    return Object.values(S.commandCenter.incidents).filter((incident) => (
      incident &&
      incident.status === 'resolved' &&
      incident.followUpAt !== null &&
      incident.followUpAt !== undefined &&
      !incident.followUpApplied
    ));
  }

  function polishReleaseLabels() {
    document.title = RELEASE_TITLE;
    document.body.dataset.releaseVersion = RELEASE_VERSION;

    const footer = document.querySelector('footer');
    if (footer) footer.textContent = `Garage Boss v${RELEASE_VERSION} • Command Center • autosaves locally`;

    const commandVersion = document.querySelector('#commandCenterPanel .panel-title small');
    if (commandVersion && /0\.3\.0-dev/i.test(commandVersion.textContent)) {
      commandVersion.textContent = `v${RELEASE_VERSION}`;
    }

    document.querySelectorAll('button').forEach((button) => {
      if (!button.hasAttribute('type')) button.type = 'button';
      if (!button.hasAttribute('aria-label') && button.title) button.setAttribute('aria-label', button.title);
    });

    const commandButton = document.getElementById('commandBtn');
    if (commandButton) commandButton.setAttribute('aria-label', 'Open Command Center');

    const chapterButton = document.getElementById('chapterBtn');
    if (chapterButton) chapterButton.setAttribute('aria-label', 'Open Chapter 2 access');
  }

  const updateBeforeRelease = update;
  update = function () {
    updateBeforeRelease();
    polishReleaseLabels();
  };

  const modalBeforeRelease = modal;
  modal = function (title, html, actions) {
    const completedHtml = String(html).replace(
      '<h3>CHAPTER 3: THE INSPECTION FROM HELL</h3>',
      `<h3>GARAGE BOSS v${RELEASE_VERSION} COMPLETE</h3>
       <p>Midtown survived, the garages are operating, and the clipboard has earned a quiet five minutes.</p>
       <p><b>TO BE CONTINUED:</b> The fire alarm chirps once.</p>`
    );
    const result = modalBeforeRelease(title, completedHtml, actions);
    polishReleaseLabels();
    return result;
  };

  const ch2FinaleBeforeRelease = ch2Finale;
  ch2Finale = function () {
    if (S.chapter === 2 && ch2AllDone()) {
      const pending = pendingConsequences();
      if (pending.length) {
        const latestFollowUp = Math.max(...pending.map((incident) => Number(incident.followUpAt) || S.min));
        S.min = Math.max(S.min, latestFollowUp);
        update();
        autosave();

        if (S.stress >= 100) return;

        return say(
          'CHRISTINE',
          `${pending.length === 1 ? 'A delayed consequence has' : `${pending.length} delayed consequences have`} arrived before the command review. The shortcuts have now submitted their paperwork.`,
          [
            ['Proceed to Command Review', () => ch2FinaleBeforeRelease()],
            ['Review Dispatch Board', () => document.getElementById('commandBtn')?.click()]
          ]
        );
      }
    }
    return ch2FinaleBeforeRelease();
  };

  window.GarageBoss = Object.freeze({
    version: RELEASE_VERSION,
    getState: cloneState,
    startChapter2: () => startChapter2(),
    save: () => saveGame(),
    load: () => loadGame()
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }, { once: true });
  }

  polishReleaseLabels();
  update();
})();
