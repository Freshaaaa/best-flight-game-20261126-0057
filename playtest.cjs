// Play-test Archipelago Run in headless Chrome (puppeteer-core).
// Verifies the game is actually playable: start, throttle up, take off,
// fly, pass a ring, and land. Prints a PASS/FAIL line per check.
const puppeteer = require('/home/hatch/workspace/metamask/automation/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/hatch/workspace/chrome/opt/google/chrome/chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,720'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const file = 'file://' + path.resolve(__dirname, 'game/index.html');
  await page.goto(file, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));

  const state = () => page.evaluate(() => ({
    started: S.started, mode: S.mode, speed: +S.speed.toFixed(1),
    y: +S.y.toFixed(1), z: +S.z.toFixed(0), rings: S.rings, score: S.score,
    throttle: +S.throttle.toFixed(2),
  }));
  const check = (name, ok, detail) => console.log((ok ? 'PASS' : 'FAIL') + '  ' + name + (detail ? '  (' + detail + ')' : ''));

  // 1. start screen shown, game not started
  let s = await state();
  check('start screen (not started)', s.started === false, JSON.stringify(s));

  // 2. click to start
  await page.mouse.click(640, 360);
  await new Promise(r => setTimeout(r, 300));
  s = await state();
  check('click starts the game', s.started === true && s.mode === 'takeoff', JSON.stringify(s));

  // 3. throttle up (hold Shift) for 3.5s
  await page.keyboard.down('Shift');
  await new Promise(r => setTimeout(r, 3500));
  await page.keyboard.up('Shift');
  s = await state();
  check('throttle up raises speed', s.speed > 45 && s.throttle > 0.8, 'speed=' + s.speed + ' thr=' + s.throttle);

  // 4. pull up (hold ArrowUp) to take off
  await page.keyboard.down('ArrowUp');
  await new Promise(r => setTimeout(r, 2500));
  await page.keyboard.up('ArrowUp');
  s = await state();
  check('takeoff: airborne', s.mode === 'flying' && s.y > 15, 'mode=' + s.mode + ' y=' + s.y);

  // 5. fly toward ring 1 and pass it (set position just before it, fly through)
  await page.evaluate(() => { S.x = 250; S.y = 260; S.z = 820; S.heading = 0; S.pitch = 0; S.speed = 60; });
  await new Promise(r => setTimeout(r, 2500));
  s = await state();
  check('ring 1 passed', s.rings >= 1, 'rings=' + s.rings + ' score=' + s.score);

  // 6. bank left with ArrowLeft (heading should change)
  const h0 = await page.evaluate(() => S.heading);
  await page.keyboard.down('ArrowLeft');
  await new Promise(r => setTimeout(r, 1500));
  await page.keyboard.up('ArrowLeft');
  const h1 = await page.evaluate(() => S.heading);
  check('banking turns the plane', Math.abs(h1 - h0) > 0.05, 'heading ' + h0.toFixed(2) + ' -> ' + h1.toFixed(2));

  // 7. land on Pulau Bintang (set up a gentle final, let the sim land it)
  await page.evaluate(() => { S.x = 0; S.y = 12; S.z = 8950; S.heading = 0; S.pitch = -0.05; S.speed = 35; S.throttle = 0.25; S.mode = 'flying'; });
  await new Promise(r => setTimeout(r, 3000));
  s = await state();
  check('landing completes the flight', s.mode === 'done', 'mode=' + s.mode + ' score=' + s.score);

  // 8. restart with R
  await page.keyboard.press('r');
  await new Promise(r => setTimeout(r, 300));
  s = await state();
  check('R restarts', s.started === false && s.mode === 'takeoff' && s.rings === 0, JSON.stringify(s));

  // 9. cockpit view toggles with C
  await page.mouse.click(640, 360); // start again
  await page.keyboard.press('c');
  const view = await page.evaluate(() => S.view);
  check('C toggles cockpit view', view === 'cockpit', 'view=' + view);

  console.log('---');
  console.log(errors.length ? 'JS ERRORS:\n' + errors.join('\n') : 'no JS errors');
  await browser.close();
})().catch(e => { console.error('PLAYTEST CRASH:', e.message); process.exit(1); });
