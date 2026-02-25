# Self-Binnacle Project Instructions

## Table of Contents

### 1. Overview
- [System Essence](#system-essence)
- [Core Principles](#core-principles)
- [Terminology](#terminology)

### 2. Structure
- [Project Structure](#project-structure)
- [Documentation Reference](#documentation-reference-blueprint)

### 3. AI Guidelines
- [Korean Question Handling](#korean-question-handling)
- [Context Management](#context-management)
- [Q&A Save Format](#qa-save-format)
- [AI Passage Creation](#ai-passage-creation)
- [AI Passage Evaluation](#ai-passage-evaluation)
- [AI Raw Processing](#ai-raw-processing)
- [AI Sailing Orders Management](#ai-sailing-orders-management)

### 4. Tools
- [Dashboard Generation](#dashboard-generation)

### 5. Safety
- [File Deletion Policy](#file-deletion-policy)

---

# 1. Overview

## System Essence

I navigate myself as a ship in the ocean of life. Self-Binnacle is a framework that holds my defined north (reference point) and voyage records.

## Core Principles

- AI is not a pattern generator, but a monitor/coach
- User defines patterns/principles
- Data ownership belongs to the user
- Value of process: Do not automate user's thinking/forecasting/judgment

## Terminology

| Nautical Term | Self-Binnacle | Description |
|---------------|---------------|-------------|
| Voyage | Task, Project, Area | A single voyage |
| Voyage Plan | voyage-plan.md | Defines Why/What/How |
| Logbook | logbook/ | Folder storing voyage records |
| Passage | {YYYY-MM-DD}/ | Daily voyage record unit |
| Passage Plan | metacognition/passage-plan.md | Daily forecast (Planning) |
| Log | log.md | Daily record (Monitoring) |
| Passage Forecast Review | metacognition/passage-forecast-review.md | Forecast evaluation (Evaluating) |
| Sailing Orders | Sailing Orders section | Voyage-level future tasks/orders |

---

# 2. Structure

## Project Structure

```
Self-Binnacle/
├── Voyages/
│   ├── Tasks/                    # One-off tasks
│   │   └── {task-name}/
│   │       ├── {task-name}.md
│   │       └── resources/        # (optional)
│   ├── Projects/                 # Goal with deadline
│   │   └── {project-name}/
│   │       ├── voyage-plan.md
│   │       ├── logbook/
│   │       │   └── {YYYY-MM-DD}/
│   │       │       ├── log.md
│   │       │       ├── metacognition/
│   │       │       │   ├── passage-plan.md
│   │       │       │   └── passage-forecast-review.md
│   │       │       └── resources/    # Daily materials/outputs (optional)
│   │       └── resources/            # Voyage-wide materials (optional)
│   └── Areas/                    # Ongoing interests
│       └── {area-name}/
│           ├── voyage-plan.md
│           ├── logbook/
│           │   └── {YYYY-MM-DD}/             # Passage
│           │       ├── log.md
│           │       ├── metacognition/
│           │       │   ├── passage-plan.md
│           │       │   └── passage-forecast-review.md
│           │       └── resources/    # Daily materials/outputs (optional)
│           └── resources/            # Voyage-wide materials (optional)
├── Archive/                      # Completed voyages
├── Resources/                    # Global reference materials
├── Blueprint/                    # Framework documentation (public)
│   ├── core/                     # Core concepts (about, terminology, ontology, principles)
│   ├── guides/                   # Usage guides (AI-usage-example)
│   ├── system/                   # System docs (contracts, features, design-decisions)
│   └── voyage-templates/         # Voyage/Task templates
│       ├── task/                 # Task template
│       └── voyage/               # Project/Area template (logbook/YYYY-MM-DD/)
├── _system/                      # Internal system (private)
│   ├── scripts/                  # Automation scripts
│   ├── credentials/              # API credentials
│   ├── inbox/                    # Unsorted ideas and tasks
│   └── AI-Conversations/         # AI conversation logs
├── README.md                     # Dashboard (auto-generated)
└── LICENSE                       # CC BY-NC-SA 4.0
```

## Documentation Reference (Blueprint)

### Core
- [about.md](Blueprint/core/about.md) - System essence, mission
- [terminology.md](Blueprint/core/terminology.md) - Term definitions
- [ontology.md](Blueprint/core/ontology.md) - Thing definitions
- [principles.md](Blueprint/core/principles.md) - Principles

### System
- [contracts.md](Blueprint/system/contracts.md) - System contracts
- [features.md](Blueprint/system/features.md) - Features
- [design-decisions.md](Blueprint/system/design-decisions.md) - Design decisions

### Guides
- [AI-usage-example.md](Blueprint/guides/AI-usage-example.md) - AI interaction patterns

### Voyage Templates
- [voyage-templates/](Blueprint/voyage-templates/) - Voyage templates

---

# 3. AI Guidelines

## Git Policy

- **NEVER suggest adding files in `.gitignore` to git.** All items in `.gitignore` are intentionally excluded from version control by design.
- When committing, only stage files that are NOT in `.gitignore`.

## Korean Question Handling

When the user writes in Korean:
1. First, translate the question to English and show as: **Q (EN):** [translated question]
2. Then provide the answer

## Context Management

- When you see a compacting warning or context is running low:
  1. First, organize the conversation in Q&A format
  2. Save to `_system/AI-Conversations/YYYY-MM/YYYY-MM-DD-topic.md`
  3. Then continue

## Q&A Save Format

- User's question: Keep original, organize but do not summarize
- AI's answer: Summarize concisely

```markdown
### Q: [User's original question - not summarized]

**Answer:** [Summarized solution/response]
```

## AI Passage Creation

When creating a new passage:
1. Copy templates from `Blueprint/voyage-templates/voyage/logbook/YYYY-MM-DD/`
2. Create folder with today's date (get from system)
3. Update `date:` field in frontmatter to today's date
4. Do NOT fill in content - let user fill it themselves

## AI Passage Evaluation

When user requests "ai-passage-evaluation", evaluate the passage and create `ai-passage-evaluation.md` with:

```markdown
# AI Passage Evaluation

## What Went Well
- [Positive aspects of the passage documentation]

## Areas for Improvement
- [Suggestions for better documentation]

## Overall Grade: [A/B/C/D]
- [Brief justification]

## Patterns to Watch
- [Notable patterns for future reference]
```

Evaluation criteria:
- Metacognition 3-Stage Cycle:
  - Planning (metacognition/passage-plan.md): Forecast time/difficulty with reasoning
  - Monitoring (log.md): Record what actually happened
  - Evaluating (metacognition/passage-forecast-review.md): Compare forecast vs actual, improve forecasting
- Forecast accuracy (time/difficulty estimates vs actual)
- Quality of reflection and lessons learned
- Actionable next steps
- Proper use of resources and references

## AI Raw Processing

When user requests to organize a passage file (log.md, passage-plan.md, or passage-forecast-review.md):
1. Read the `### Raw` section content
2. Categorize each item into appropriate sections:
   - Items belonging to current file → move to sections above
   - Items belonging to sibling files → move to those files
3. Move processed items from Raw to their correct locations
4. Keep Raw section empty after processing (just `-`)

### Cross-File Organization (passage-forecast-review.md)
When organizing `passage-forecast-review.md` Raw section:
- Time/Difficulty actuals → stay in passage-forecast-review.md
- Metacognition insights → stay in passage-forecast-review.md
- Reflection on process/experience → move to `../log.md` Reflection section
- Blockers encountered → move to `../log.md` Blockers section
- Next steps identified → move to `../log.md` Next Steps section
- General notes → move to `../log.md` Notes section

## AI Sailing Orders Management

When user requests Sailing Orders operations:

1. **Format**: Blockquote-wrapped table + optional `<details>` + `<br>` separator
   ```markdown
   > | Deadline | Created | Order | Purpose |
   > |----------|---------|-------|---------|
   > | YYYY-MM-DD or - | YYYY-MM-DD | Order description | Purpose |
   >
   > <details>
   > <summary>Details</summary>
   >
   > - Detail item 1
   > - Detail item 2
   >
   > </details>
   <br>
   ```
2. **Subsections**: Plotted (Underway) / Plotted Courses / Plotted (Reached)
3. **Operations**:
   - Add new order → Place in appropriate subsection with today's date as Created
   - Start order → Move from Plotted Courses → Plotted (Underway)
   - Complete order → Move from Plotted (Underway) → Plotted (Reached)
   - Delete order → Remove table and details
4. **Fields**:
   - Deadline: Due date or `-` if none - Format: `YYYY-MM-DD`
   - Created: Date order was added (required) - Format: `YYYY-MM-DD`
   - Order: Task description (required)
   - Purpose: Why this order exists (optional)
5. **Details**: Inside `<details>` block (optional)
   - Use `<summary>Details</summary>` for Plotted (Underway) / Plotted Courses
   - Use `<summary>Result</summary>` for Plotted (Reached)
6. **Spacing**: Add `<br>` after each order block for visual separation

---

# 4. Tools

## Dashboard Generation

To update the Dashboard (README.md), run:

```bash
py _system/scripts/generate_dashboard.py
```

This script:
- Scans Voyages folders (Tasks, Projects, Areas)
- Fetches time data from Google Calendar (events with `[Project]` or `[Area]` prefix)
- Generates README.md with activity visualization

Note: Requires Google Calendar API credentials in `_system/credentials/`

## Environment

- **Python:** Always use `py` (not `python` or `python3`). Windows App Execution Aliases redirect `python`/`python3` to Microsoft Store stubs, causing failures.
- **PDF:** pypdf (`from pypdf import PdfReader`) is installed. Use this for all PDF text extraction. Do not install other PDF libraries.

---

# 5. Safety

## File Deletion Policy

- **NEVER use `rm`, `del`, `Remove-Item`, or any permanent delete command.** This is a hard rule with zero exceptions.
- **To remove files, send to Windows Recycle Bin:**
  ```bash
  powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('FULL_FILE_PATH', 'OnlyErrorDialogs', 'SendToRecycleBin')"
  ```
- **NEVER delete, remove, or overwrite user's image files (screenshots, PNGs, etc.) without explicit user approval.**
- Before removing any file: list every file by name, explain why, and **wait for user confirmation** before executing.
