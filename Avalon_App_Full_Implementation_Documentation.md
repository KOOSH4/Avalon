# Avalon Online - Full Implementation Documentation

## 1. Project Overview
- **App Name:** Avalon Online (آوالون آنلاین)
- **Version:** 0.0.0
- **Platform(s) Supported:** Web Browser (Mobile-first responsive design, PWA-ready)
- **Tech Stack:**
  - **Frontend:** React 19, TypeScript
  - **Styling:** Tailwind CSS
  - **Build Tool:** Vite
  - **Icons/Fonts:** Vazirmatn (Persian Body Text), Lalezar (Persian Titles)
- **Architecture Overview:** Client-side Single Page Application (SPA). The game is designed for local multiplayer (pass-and-play) where players share a single device. State is managed entirely in the client's memory.
- **Deployment Setup:** Standard static site deployment. The build process uses `vite build` to generate static files that can be hosted on any static hosting service (e.g., Vercel, Netlify, GitHub Pages).

## 2. Complete Game Logic Documentation
The application implements the social deduction party game "The Resistance: Avalon".

### Full Description of Implemented Rules
Players are secretly divided into two teams: Good (یاران آرتور) and Evil (سرسپردگان موردرد). The game is played over a maximum of 5 rounds (quests). In each round, a leader proposes a team to go on a quest. All players vote on the proposed team. If approved, the team members secretly decide to support (Success) or sabotage (Fail) the quest.

### Supported Roles
#### Good Roles (نیکان)
- **Merlin (مرلین):** Knows all Evil players (except Mordred). Must remain hidden.
- **Percival (پرسیوال):** Knows who Merlin is, but Morgana appears as Merlin to him.
- **Loyal Servant of Arthur (خدمتگزار وفادار):** Standard good player, no special knowledge.
- **Tristan & Isolde (تریستان و ایزولت - Expansion):** Lovers who know each other.

#### Evil Roles (شروران)
- **Assassin (آدمکش):** If Good wins 3 quests, the Assassin can guess who Merlin is to steal the win.
- **Morgana (مورگانا):** Appears as Merlin to Percival.
- **Mordred (موردرد):** Hidden from Merlin.
- **Oberon (اوبرون):** Unknown to other Evil players, and does not know them.
- **Agravaine (آگراوین - Expansion):** Powerful evil role, must fail quests.
- **Lancelot (لنسلات - Expansion):** Complex role with shifting allegiances.

### Win Conditions
- **Good Wins:** 3 quests succeed AND the Assassin fails to identify Merlin.
- **Evil Wins:** 3 quests fail OR 5 consecutive team proposals are rejected in a single round OR the Assassin correctly identifies Merlin.

### Round Flow
1. **Team Proposal:** The current leader selects a specific number of players for the quest.
2. **Team Vote:** All players vote publicly (simulated via app) to approve or reject the team.
3. **Quest Execution:** If approved, team members secretly submit Success or Fail. If rejected, the leader token passes, and the vote track increases.
4. **Quest Result:** Outcomes are shuffled and revealed.

### Mission Fail Conditions
- A quest fails if there is at least 1 "Fail" vote.
- *Note: The standard 2-fail rule for Round 4 with 7+ players is implemented in the quest rules configuration.*

### Assassination Phase Logic
If Good wins 3 quests, the game enters the Assassination phase. The Assassin selects one Good player. If the selected player is Merlin, Evil wins. Otherwise, Good wins.

## 3. Game Configuration & Options
- **Player Count Limits:** 5 to 10 players.
- **Role Distribution Logic:** Roles are automatically assigned based on player count and selected expansions.
- **Custom Rule Toggles:**
  - **Narrated Night (تأیید گروهی شب):** Toggles the guided night phase screen.
  - **Expansion Roles (بسته الحاقی):** Toggles advanced roles like Tristan, Isolde, Lancelot, Agravaine.
- **Language Support:** Persian (Farsi) with RTL layout.

## 4. UI / UX Documentation
### Screens
1. **Setup Screen (`PlayerSetup.tsx`):**
   - **Purpose:** Configure player count, names, and game options.
   - **Interactions:** Dropdown for count, text inputs for names, toggle switches for Night Phase and Expansions.
2. **Role Reveal (`RoleReveal.tsx`):**
   - **Purpose:** Secretly show each player their role and knowledge.
   - **Interactions:** Pass-and-play privacy screen. Tap to reveal, tap to hide.
3. **Narrated Night (`NarratedNight.tsx`):**
   - **Purpose:** Guide players through the initial night phase to establish secret knowledge.
   - **Interactions:** Step-by-step navigation with "Next" and "Previous" buttons.
4. **Team Proposal (`GameBoard.tsx - TeamProposal`):**
   - **Purpose:** Leader selects team members.
   - **Interactions:** Toggle player selection. "Finalize Team" button enables when the correct number is selected.
5. **Team Vote (`GameBoard.tsx - TeamVote`):**
   - **Purpose:** Players confirm the proposed team.
   - **Interactions:** "Approve" and "Reject" buttons.
6. **Quest Execution (`GameBoard.tsx - QuestExecution`):**
   - **Purpose:** Team members secretly vote Success or Fail.
   - **Interactions:** Privacy screen per team member. Good players can only select Success. Evil players can select Success or Fail.
7. **Quest Result (`GameBoard.tsx - QuestResultDisplay`):**
   - **Purpose:** Show the shuffled outcomes of the quest.
   - **Interactions:** Modal display with animated reveal of cards.
8. **Assassination (`GameBoard.tsx - Assassination`):**
   - **Purpose:** Assassin selects Merlin.
   - **Interactions:** Select target, confirm prompt.
9. **Game Over (`GameBoard.tsx - GameOver`):**
   - **Purpose:** Display winner and reveal all roles.
   - **Interactions:** "Return to Main Menu" button to reset the game.

## 5. State Management & Data Flow
- **State Storage:** React `useReducer` hook (`useGameLogic.ts`).
- **Data Structures:**
  - `GameState`: Holds players, phase, current round, quests, vote track, temporary outcomes, etc.
  - `Player`: ID, name, role, team.
  - `Quest`: ID, team size, fails required, result, team members, outcomes.
- **State Transitions:** Managed via dispatched actions (e.g., `SETUP_GAME`, `PROPOSE_TEAM`, `PROCESS_QUEST_RESULT`).
- **Offline Handling:** The app is fully client-side and works offline once loaded. State is lost on page refresh unless persisted (currently in-memory only).

## 6. Backend Documentation
- **N/A:** The application is entirely client-side. No backend, database, or API is used.

## 7. Code Structure
- `/components/`: UI components for each game phase and reusable elements (Modal, PrivacyScreen).
- `/hooks/useGameLogic.ts`: Core state machine and game rules implementation.
- `/constants.tsx`: Static game data, role configurations, quest rules, and UI strings.
- `/game-config.ts`: Centralized configuration for names, roles, and UI text.
- `/types.ts`: TypeScript interfaces and enums defining the data models.
- `/App.tsx`: Main application container and routing logic based on `GameState.phase`.
- `/index.tsx` & `/index.html`: Entry points.

## 8. Algorithms & Special Logic
- **Randomization:** `shuffleArray` utility used for role distribution and shuffling quest outcomes to maintain anonymity.
- **Role Distribution:** Predefined arrays of roles based on player count, shuffled and assigned to players.
- **Quest Outcome Processing:** Counts 'Fail' votes and compares against `failsRequired` for the current round.

## 9. Assets & Design
- **Fonts:** Vazirmatn (Body), Lalezar (Headings).
- **Colors:** Dark theme (slate/gray) with vibrant accents (yellow/amber for UI, blue for Good, red/rose for Evil).
- **Visual Effects:** Tailwind animations (`animate-fade-in`, `animate-pulse`), backdrop blurs for glassmorphism, drop shadows for depth.

## 10. Known Limitations & Technical Debt
- **State Persistence:** Game state is lost on page refresh. Implementing `localStorage` persistence would improve UX.
- **Local Multiplayer Only:** Requires passing the device. No remote multiplayer support (WebSockets/Server).
- **Scalability:** The UI is optimized for mobile (max-w-md). Desktop experience is a centered mobile view.

## 11. Build & Deployment Instructions
- **Environment Setup:** Node.js (v18+ recommended).
- **Run Locally:** `npm install` -> `npm run dev`.
- **Build Production:** `npm run build`. Outputs to `/dist`.
- **Deploy:** Upload the `/dist` folder to any static hosting provider.

## 12. Ownership & Access
- **Repository:** Local file system.
- **Third-Party Accounts:** None required for the core app.
- **API Keys:** None required.

## 13. Future Expansion Considerations
- **Remote Multiplayer:** Implement WebSockets (e.g., Socket.io) and a Node.js backend to allow players to join via room codes on their own devices.
- **State Persistence:** Save `GameState` to `localStorage` to recover from accidental refreshes.
- **More Roles/Expansions:** Add remaining roles from Avalon expansions.
- **Sound Effects:** Add audio cues for phase changes and night narration.
