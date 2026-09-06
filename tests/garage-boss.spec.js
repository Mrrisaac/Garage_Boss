const { test, expect } = require('@playwright/test');

async function openGame(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  await page.goto('/?releaseTest=1');
  await expect(page).toHaveTitle('Garage Boss v0.3.0: Command Center');
  await expect(page.locator('#modalTitle')).toHaveText('MONDAY, 7:58 AM');
  await expect(page.getByRole('button', { name: 'Start Chapter 1' })).toBeVisible();
  await expect(page.locator('footer')).toContainText('Garage Boss v0.3.0');
  await expect(page.locator('footer')).not.toContainText('development');

  return errors;
}

async function startChapter2(page, carriedScore = 800) {
  await page.evaluate((score) => {
    eval(`S.score=${Number(score)}`);
    window.GarageBoss.startChapter2();
  }, carriedScore);
  await expect(page.locator('#modalTitle')).toHaveText('CHAPTER 2: 6:30 AM');
  await page.getByRole('button', { name: 'Enter Command Center' }).click();
  await expect(page.locator('#sceneLabel')).toContainText('Garage Division Command Center');
  await expect(page.locator('#score').locator('xpath=..')).toContainText('/ 1600');
}

async function openDispatchBoard(page) {
  await page.getByRole('button', { name: 'Open Command Center' }).click();
  await expect(page.locator('#modalTitle')).toHaveText('GARAGE DIVISION COMMAND CENTER');
}

async function finishChapterTwoCases(page) {
  await page.evaluate(() => {
    eval(`
      Object.keys(CH2_CASES).forEach((key) => { S.flags[key] = 1; });
      LOC.command.open = true;
      S.loc = 'command';
      renderScene();
      update();
      ch2Finale();
    `);
  });
}

test('loads the finished release without runtime errors', async ({ page }) => {
  const errors = await openGame(page);

  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '🔒');
  await expect(page.locator('#commandCenterPanel')).toContainText('Activates in Chapter 2');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');

  expect(errors).toEqual([]);
});

test('uses the correct score cap in both chapters', async ({ page }) => {
  const errors = await openGame(page);
  await page.getByRole('button', { name: 'Start Chapter 1' }).click();

  await page.evaluate(() => eval("S.score=790; points(50,'release cap test')"));
  await expect(page.locator('#score')).toHaveText('800');
  await expect(page.locator('#score').locator('xpath=..')).toContainText('/ 800');

  await startChapter2(page, 800);
  await page.evaluate(() => eval("S.score=1590; points(50,'chapter two cap test')"));
  await expect(page.locator('#score')).toHaveText('1600');
  await expect(page.locator('#score').locator('xpath=..')).toContainText('/ 1600');

  expect(errors).toEqual([]);
});

test('completes the Command Center, Chapter 2 finale, and clean replay', async ({ page }) => {
  const errors = await openGame(page);
  await startChapter2(page, 800);

  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '3');
  await openDispatchBoard(page);

  await page.getByRole('button', { name: /Delegate to Romane/ }).click();
  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '2');

  await page.getByRole('button', { name: /Coordinate Sean’s repair/ }).click();
  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '1');

  await page.getByRole('button', { name: /Document the approval and rebalance coverage/ }).click();
  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '0');
  await expect(page.locator('#commandCenterPanel')).toContainText('CLEAR');

  await page.getByRole('button', { name: 'Return to Garage Network' }).click();
  await finishChapterTwoCases(page);

  await expect(page.locator('#modalBody')).toContainText('GARAGE BOSS v0.3.0 COMPLETE');
  await expect(page.locator('#modalBody')).toContainText('COMMAND CENTER REPORT');
  await expect(page.locator('#modalBody')).toContainText('Dispatches resolved');
  await expect(page.getByRole('button', { name: 'Replay From Chapter 1' })).toBeVisible();

  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.getByRole('button', { name: 'Replay From Chapter 1' }).click()
  ]);

  await expect(page.locator('#modalTitle')).toHaveText('MONDAY, 7:58 AM');
  await expect(page.locator('#score')).toHaveText('0');
  await expect(page.locator('#score').locator('xpath=..')).toContainText('/ 800');
  const saved = await page.evaluate(() => localStorage.getItem('garageBossSave'));
  expect(saved).toBeNull();
  expect(errors).toEqual([]);
});

test('applies delayed consequences once before the final review', async ({ page }) => {
  const errors = await openGame(page);
  await startChapter2(page, 500);
  await openDispatchBoard(page);

  await page.getByRole('button', { name: /Reset it remotely/ }).click();
  let state = await page.evaluate(() => window.GarageBoss.getState());
  expect(state.score).toBe(508);
  expect(state.commandCenter.incidents.bristolDoor.followUpApplied).toBe(false);

  await page.evaluate(() => eval(`
    S.min = S.commandCenter.incidents.bristolDoor.followUpAt;
    update();
  `));
  state = await page.evaluate(() => window.GarageBoss.getState());
  expect(state.score).toBe(478);
  expect(state.commandCenter.incidents.bristolDoor.followUpApplied).toBe(true);
  expect(state.commandCenter.incidents.bristolDoor.followUpText).toContain('fails again');

  await page.evaluate(() => eval('update(); update();'));
  const stateAfterRepeatedUpdates = await page.evaluate(() => window.GarageBoss.getState());
  expect(stateAfterRepeatedUpdates.score).toBe(478);

  expect(errors).toEqual([]);
});

test('preserves a resolved dispatch through save and load', async ({ page }) => {
  const errors = await openGame(page);
  await startChapter2(page, 600);
  await openDispatchBoard(page);
  await page.getByRole('button', { name: /Delegate to Romane/ }).click();

  await page.evaluate(() => window.GarageBoss.save());
  await page.reload();
  await expect(page.locator('#modalTitle')).toHaveText('MONDAY, 7:58 AM');
  await page.getByRole('button', { name: 'Load Saved Game' }).click();

  await expect(page.locator('#sceneLabel')).toContainText('Garage Division Command Center');
  await expect(page.locator('#commandBtn')).toHaveAttribute('data-count', '2');
  const state = await page.evaluate(() => window.GarageBoss.getState());
  expect(state.chapter).toBe(2);
  expect(state.commandCenter.incidents.bristolDoor.status).toBe('resolved');

  expect(errors).toEqual([]);
});

test('keeps the release controls inside the viewport', async ({ page, isMobile }) => {
  const errors = await openGame(page);
  await startChapter2(page, 800);

  const initialLayout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth,
    buttons: [...document.querySelectorAll('.top-actions button')].map((button) => {
      const rect = button.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
    })
  }));

  expect(initialLayout.pageWidth).toBeLessThanOrEqual(initialLayout.viewportWidth + 1);
  for (const button of initialLayout.buttons) {
    expect(button.left).toBeGreaterThanOrEqual(-1);
    expect(button.right).toBeLessThanOrEqual(initialLayout.viewportWidth + 1);
    expect(button.height).toBeGreaterThanOrEqual(isMobile ? 40 : 36);
  }

  await openDispatchBoard(page);
  const modalLayout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth,
    cardWidth: document.querySelector('.modal-card').getBoundingClientRect().width
  }));
  expect(modalLayout.pageWidth).toBeLessThanOrEqual(modalLayout.viewportWidth + 1);
  expect(modalLayout.cardWidth).toBeLessThanOrEqual(modalLayout.viewportWidth);

  expect(errors).toEqual([]);
});
