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
| User-driven | User does directly or requests AI (user intention/judgment present) | Create Voyage, write Voyage Plan, create folders, organize content, etc. |
| System-auto | Script runs automatically without user intervention | Dashboard generation |
| System-auto + AI | AI analyzes/detects without user intervention | Principle violation detection, structure deviation detection, human error catch |

Things requiring user's thinking/judgment process are user-driven; processing based on existing data is system-auto.
