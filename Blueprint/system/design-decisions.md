# Self-Binnacle Design Decisions

---

## 1. PARA Method Applied

Based on Tiago Forte's PARA methodology.

- **Projects**: Goals with deadlines
- **Areas**: Ongoing domains to manage
- **Resources**: Reference materials
- **Archive**: Completed/ended items

---

## 2. Task as Separate Category

Unlike original PARA, Task is separated as its own category.

| Category | Characteristics |
|----------|-----------------|
| Task | Simple, short-term, with or without deadline, no Logbook needed |
| Project | Complex, long-term, has deadline, Logbook needed |

Task is something to just finish; Project requires process tracking.

---

## 3. Nautical Metaphor

Nautical terminology is applied throughout the system.

**Why nautical metaphor:**

Life is like a voyage:
- Many unpredictable situations (weather, reefs, currents, external factors)
- Destination exists but route is flexible (plan vs reality)
- Cannot control everything alone
- Check direction with compass, track course with Logbook
- Accumulated Logbook becomes reference for future voyages

Binnacle is actually a tool that stores both compass (direction) and Logbook (records). This system also holds reference points (principles) and records (Logbook) together.

Consistent metaphor makes terminology intuitive and memorable.

See terminology.md for term definitions.

---

## 4. Metacognition 3-Stage Cycle

Passage structure follows a 3-stage cycle based on metacognition research.

| Stage | Definition | Self-Binnacle Thing |
|-------|------------|---------------------|
| Planning | Forecast + why you think so | Passage Plan |
| Monitoring | Record what you actually did | Log |
| Evaluating | Compare forecast vs actual, improve forecast accuracy | Forecast Review |

**Why this structure:**
- Core of metacognition is forecast accuracy: "Did I get the results I expected?"
- Must record forecast + reasoning to analyze later why right/wrong
- Forecast ability improves through repeated forecast vs actual comparison
- Improved forecast ability = metacognition development = compound effect

---

## 5. Source of Truth

Self-Binnacle is the Source of Truth for all data.

| System | Role |
|--------|------|
| Self-Binnacle | Original storage for all Things |
| Time Management App | Only responsible for time blocks, can have copies of Voyage Plan/Passage Plan |
| Git/GitHub | Version control, backup |

---

## 6. Execution Agent Classification

| Classification | Description | Examples |
|----------------|-------------|----------|
| User-driven | User does directly or requests AI (user intention/judgment present) | Create Voyage, write Voyage Plan, create folders, organize content |
| AI-orchestrated | AI interprets CONTRACT rules, invokes micro scripts, delivers metacognition awareness | Passage Builder (resolve → query → decision matrix → create files) |
| System-auto | Script runs automatically without user intervention | Dashboard generation, Passage Plan Observer |
| System-auto + AI | AI analyzes/detects without user intervention | Principle violation detection, structure deviation detection |

Things requiring user's thinking/judgment process are user-driven; processing based on existing data is system-auto. AI-orchestrated is the middle ground: AI follows CONTRACT rules but user triggers and makes decisions.

---

## 7. CONTRACT-Driven Architecture

System behavior is defined by `CONTRACT.md` files rather than hard-coded logic.

**Pattern:** `CONTRACT.md` (rules) + micro scripts (stateless tools) + AI (orchestrator)

**Why this pattern:**
- CONTRACTs are human-readable — user can audit and modify rules
- Scripts are stateless and single-purpose — easy to test, replace, reuse
- AI handles the conditional logic and user interaction — flexible orchestration
- Adding new behavior = writing a new CONTRACT + scripts, not modifying existing code

**Script classification by system role:**

| System | Role | Examples |
|--------|------|---------|
| PARA | Organizing/navigating what exists | Dashboard, Voyage Resolver |
| Metacognition | Improving how you think and work | Passage Builder, Passage Plan Observer |
| Self-Binnacle | Core infrastructure serving both | Calendar micro scripts |

---

## 8. Voyage Tier System

Voyages are separated by visibility into three tiers.

| Tier | Git | Location | Purpose |
|------|-----|----------|---------|
| Public | Submodule (public repo) | `Voyages/public/` | Shareable work (portfolio, open-source) |
| Private | Independent repo (private) | `Voyages/private/` | Sensitive work (school, client projects) |
| Embryonic | No git (local only) | `Voyages/embryonic/` | Ideas not yet committed to |

**Why this separation:**
- Public work can be shared/showcased without exposing private data
- Private work has full version control but restricted access
- Embryonic ideas have zero friction — no git overhead until the voyage is worth tracking

---

## 9. Calendar as First-Class Data Source

Google Calendar events are not just schedule reminders — they are data sources that drive system behavior.

**How Calendar events are used:**
- **Dashboard**: Fetches time data from `[Project]`/`[Area]` events for activity visualization
- **Passage Plan Observer**: Scans upcoming events, injects planning skeleton into empty descriptions
- **Passage Builder**: Queries events to determine timing (before/during/after), reads plan content from descriptions

**Why Calendar (not a database or task manager):**
- User already plans their day in Calendar — no new tool to adopt
- Calendar event descriptions become the planning stage of metacognition
- Time data is naturally embedded (start/end times = duration tracking)
