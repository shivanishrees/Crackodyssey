# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Crack Odyssey – Dungeon of Knowledge** is a browser-based educational game teaching OOP concepts. Players navigate mazes to collect knowledge gems, then complete MCQ quizzes to advance levels. All state is stored in `localStorage` — there is no backend or build system.

## Running the App

Because `index.html` loads JS via `<script type="module">`, it **cannot** be opened directly as a `file://` URL (CORS restriction). Serve it with a local HTTP server:

```bash
# Option 1 – Python (no install needed)
python -m http.server 8080

# Option 2 – Node (requires npx)
npx serve .

# Option 3 – VS Code Live Server extension
```

Then open `http://localhost:8080`.

There are no build, lint, or test scripts — this is a zero-dependency, plain HTML/CSS/JS project.

## Architecture

### Screen System (SPA)
All screens exist simultaneously in `index.html` as `<div class="screen">` elements. Navigation works by toggling the `active` CSS class. `app.js` owns the `navigateTo(screenName)` function and is the single source of navigation truth. Screen names map to DOM IDs via the `SCREENS` object in `app.js`.

**Important:** `#screen-level3` (the Encapsulation Lock System) exists in `index.html` but is **not** registered in `app.js`'s `SCREENS` object and has no corresponding JS module. It is partially implemented — the HTML and CSS are present, but the game-flow wiring and module are missing.

### Module Responsibilities

| File | Role |
|---|---|
| `js/app.js` | Entry point. Initialises all modules, owns `navigateTo`, wires game-flow callbacks (maze→quiz→dashboard). |
| `js/store.js` | **All persistence.** Reads/writes `localStorage`. Exports every state-mutating function used by other modules. No module writes to `localStorage` directly except `store.js`. |
| `js/auth.js` | Login/register form wiring. Delegates to `store.js`. Receives `navigateTo` from `app.js`. |
| `js/dashboard.js` | Exports `initDashboard(navigateTo)` (event wiring) and `refreshDashboard()` (DOM update from store). |
| `js/levelMap.js` | Dynamically builds the level-select DOM from `LEVELS` data. Receives a `startMaze(levelId)` callback from `app.js`. |
| `js/maze.js` | Canvas-based maze engine. Handles keyboard (`WASD`/arrows) and on-screen button input. Calls `onMazeComplete(levelId)` when the player exits. |
| `js/quiz.js` | MCQ quiz engine. Awards XP/coins via `store.js` and calls `completeLevel()` on finish. Pass threshold is 6/10; failed attempts show a retry button without advancing the level. |
| `js/data/levels.js` | Static level definitions. Grid is a flat `number[]` where `0`=path, `1`=wall; `startPos`/`exitPos` are `{row, col}`. Each `rewards[]` entry has `{id, row, col, title, explanation, example}`. Level 3 has an empty grid (`gridCols: 0, gridRows: 0`) — it is a non-maze challenge type. |
| `js/data/quizzes.js` | Static quiz data keyed by level ID. Each question has `options[]` and a `correct` index. |

### Game Flow
```
Start Gate → (login/register) → Dashboard → Level Map → Maze → Quiz → Dashboard
```
- Maze completion triggers `onMazeComplete(levelId)` → `app.js` navigates to quiz.
- Quiz completion triggers `onQuizComplete(levelId)` → `app.js` navigates to dashboard.
- `store.completeLevel(levelId)` unlocks the next level by advancing `profile.currentLevel`.
- Level 3 (`Encapsulation Lock System`) is a step-by-step vault interaction (Make Private → Add Getter → Add Setter) defined in HTML/CSS only; the JS wiring to route into it and handle its completion does not yet exist.

### State Shape (localStorage)
- Key `crack_odyssey_users`: `{ [username]: { password: string, profile: Profile } }`
- Key `crack_odyssey_current_user`: `string` (logged-in username)
- `Profile` fields: `coins`, `xp`, `level`, `levelsCompleted[]`, `mazeProgress: { [levelId]: { rewardsCollected[], completed } }`, `quizScores: { [levelId]: { score, stars } }`, `achievements[]`, `currentLevel`

### CSS / Styling
Each CSS file in `css/` corresponds to exactly one screen (`main.css` is global). There is no CSS preprocessor. `css/level3` styles are not yet present — a `css/level3.css` will be needed when Level 3 is fully wired.

## Known Discrepancies
- `getOverallMazePercent()` in `store.js` hardcodes `totalRewards = 10`, but Levels 1 and 2 each contain 15 reward gems (30 total). The maze progress percentage will max out at ~100% prematurely. Update `totalRewards` to match the actual gem count when adding or changing levels.
- `levelMap.js` always renders `⭐⭐⭐` for completed level nodes regardless of the player's actual quiz score; it does not call `getStarsForLevel()`. The star data is saved correctly in `store.js` but is unused in the map rendering.
- `dashboard.js` `refreshDashboard()` displays levels as `${completed} / 3`, but `index.html` still has the placeholder `0 / 2`. The JS value takes effect at runtime.

## Adding a New Maze Level
1. Add an entry to `LEVELS` in `js/data/levels.js` with a 15×15 flat grid array, `rewards[]`, `startPos`, and `exitPos`.
2. Add a matching entry to `QUIZZES` in `js/data/quizzes.js`.
3. Update `totalRewards` in `getOverallMazePercent()` in `store.js` to reflect the new total gem count.
4. Update the `/ N` literal in `refreshDashboard()` in `js/dashboard.js` and the placeholder in `index.html` (line 111).

## Completing Level 3 Integration
To fully wire Level 3 into the game:
1. Create `js/level3.js` with an `initLevel3(navigateTo, onCompleteFn)` / `startLevel3()` export, mirroring the maze/quiz module pattern.
2. Add `'level3': 'screen-level3'` to the `SCREENS` map in `app.js`.
3. Import and call `initLevel3` in `app.js`'s `init()`, passing an `onLevel3Complete` callback that navigates to the quiz.
4. In `handleStartMaze`, detect `levelId === 3` and route to `level3` instead of `maze`.
