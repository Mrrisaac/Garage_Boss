# Garage Boss v0.3.0: Command Center

An original parking-management comedy point-and-click adventure inspired by classic 1990s adventure-game design.

## Play

### [▶ Play Garage Boss v0.3.0](https://mrrisaac.github.io/Garage_Boss/)

The game runs directly in a browser with no installation or build step. It contains two complete story chapters, autosaves progress locally, and includes manual save and load controls.

## Chapter 1: The Last Space in Manhattan

Richie handles a chaotic Monday involving a damage claim, a POS failure, a stuck stacker, prohibited furniture, a misapplied monthly payment, an inspection, an oversized vehicle dispute, and missing keys.

## Chapter 2: The United Nations Is Coming

The garage network faces street closures, diplomatic vehicles, security checkpoints, event rates, validations, gridlock, press equipment, and overflow capacity.

## v0.3 Command Center

Chapter 2 now includes a live management layer with:

- Three simultaneous dispatch incidents with in-game deadlines
- Delegation choices involving equipment, construction, and staffing
- Immediate and delayed consequences
- Chapter-aware scoring, with Chapter 2 supporting its full 1,600-point range
- Safety, Compliance, Customer Service, Revenue, and Staff Management ratings
- A final Command Center performance report
- Save migration for earlier Chapter 2 saves
- A safe full reset when replaying from Chapter 1
- Mobile layout improvements and keyboard access with the `C` key
- Installable and offline-capable web app support after the first online visit

The Command Center can be opened from the `CMD` button, the sidebar panel, or the `C` key.

## Controls

Use **WALK**, **LOOK**, **TALK**, **USE**, and **TAKE** to interact with scene objects. To use an inventory item on mobile, select **USE**, tap the inventory item, then tap the scene object.

## Release testing

The repository includes Playwright end-to-end tests for desktop Chrome and a Pixel-sized mobile viewport. The tests cover startup, score caps, Command Center decisions, delayed consequences, saving and loading, the Chapter 2 finale, clean replay, and viewport overflow.

Run locally with:

```bash
npm install
npx playwright install chromium
npm test
```

GitHub Actions runs the same release suite for pull requests and pushes to `main`.

## Publishing

The production game is served directly from the repository root through GitHub Pages.
