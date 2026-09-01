// Garage Boss Chapter 2 access hotfix
// Allows completed Chapter 1 saves from the original release to reopen the finale
// without awarding the ending bonus more than once.

const chapter2UpdateBeforeHotfix = update;
const chapter2LoadBeforeHotfix = loadGame;

function chapterOneResultsModal() {
  if (S.chapter === 2) return ch2Finale();
  if (!allDone()) {
    return say('MR. H', `Come back when everything is actually ready. (${completeCount()}/${Object.keys(CASES).length})`);
  }

  // Old Chapter 1 saves used ending=true after the first results screen.
  // In that case, the bonus was already awarded. New saves get it once here.
  const endingWasAlreadySeen = Boolean(S.ending || S.chapter1ResultsShown);
  if (!endingWasAlreadySeen) {
    let bonus = 0;
    if (S.min < 1080) bonus += 50;
    if (S.stress < 45) bonus += 40;
    S.score = Math.min(800, S.score + bonus);
    if (S.score >= 760) achievement('perfect');
  }

  S.chapter1ResultsShown = true;
  S.ending = true;
  autosave();

  const rank = S.score >= 760 ? 'LEGENDARY GARAGE BOSS'
    : S.score >= 650 ? 'VICE PRESIDENT OF CHAOS'
    : S.score >= 520 ? 'MANHATTAN PARKING PRO'
    : S.score >= 380 ? 'SOLID OPERATOR'
    : 'SURVIVOR OF MONDAY';

  modal(rank,
    `<div class="ending-rank">${rank}</div>
     <p>Chapter 1 is complete. The garages are standing, the customers are mostly calm, and the sofa has been exiled.</p>
     <div class="statline"><span>Chapter 1 score</span><b>${S.score} / 800</b></div>
     <div class="statline"><span>Stress</span><b>${S.stress}%</b></div>
     <p><b>MR. H:</b> “Good. Now about the United Nations...”</p>
     <h3>CHAPTER 2: THE UNITED NATIONS IS COMING</h3>`,
    [
      ['START CHAPTER 2', () => startChapter2()],
      ['Continue Exploring', () => { S.ending = false; autosave(); hideModal(); }],
      ['Start New Game', () => newGame()]
    ]
  );
}

// Replace the Chapter 1 finale gate with the save-compatible version.
finale = chapterOneResultsModal;

function ensureChapterButton() {
  let button = $('chapterBtn');
  if (!button) {
    button = document.createElement('button');
    button.id = 'chapterBtn';
    button.className = 'iconbtn';
    button.title = 'Chapter access';
    document.querySelector('.top-actions').appendChild(button);
  }
  button.textContent = S.chapter === 2 ? 'Ⅱ✓' : 'Ⅱ';
  button.onclick = () => {
    sfx('click');
    if (S.chapter === 2) return toast('Chapter 2 is already active');
    if (!allDone()) return toast(`Finish Chapter 1 first (${completeCount()}/8)`);
    chapterOneResultsModal();
  };
}

update = function () {
  chapter2UpdateBeforeHotfix();
  ensureChapterButton();
};

loadGame = function () {
  chapter2LoadBeforeHotfix();
  ensureChapterButton();

  // A completed legacy save can go directly to the Chapter 2 launch screen.
  if (S.chapter !== 2 && allDone() && S.ending) {
    setTimeout(() => chapterOneResultsModal(), 50);
  }
};

// The original button was bound before Chapter 2 replaced loadGame.
// Rebind it so both Chapter 1 and Chapter 2 saves load through the current handler.
$('loadBtn').onclick = () => loadGame();

ensureChapterButton();
