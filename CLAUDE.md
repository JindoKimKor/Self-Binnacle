# Self-Binnacle Project Instructions

## System Essence

I navigate myself as a ship in the ocean of life. Self-Binnacle is a framework that holds my defined north (reference point) and voyage records.

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
│   │       │       ├── passage-plan.md
│   │       │       ├── log.md
│   │       │       ├── passage-forecast-review.md
│   │       │       └── resources/    # Daily materials/outputs (optional)
│   │       └── resources/            # Voyage-wide materials (optional)
│   └── Areas/                    # Ongoing interests
│       └── {area-name}/
│           ├── voyage-plan.md
│           ├── logbook/
│           │   └── {YYYY-MM-DD}/             # Passage
│           │       ├── passage-plan.md
│           │       ├── log.md
│           │       ├── passage-forecast-review.md
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

## Terminology

| Nautical Term | Self-Binnacle | Description |
|---------------|---------------|-------------|
| Voyage | Task, Project, Area | A single voyage |
| Voyage Plan | voyage-plan.md | Defines Why/What/How |
| Logbook | logbook/ | Folder storing voyage records |
| Passage | {YYYY-MM-DD}/ | Daily voyage record unit |
| Passage Plan | passage-plan.md | Daily forecast (Planning) |
| Log | log.md | Daily record (Monitoring) |
| Passage Forecast Review | passage-forecast-review.md | Forecast evaluation (Evaluating) |

## Core Principles

- AI is not a pattern generator, but a monitor/coach
- User defines patterns/principles
- Data ownership belongs to the user
- Value of process: Do not automate user's thinking/forecasting/judgment

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
  - Planning (passage-plan.md): Forecast time/difficulty with reasoning
  - Monitoring (log.md): Record what actually happened
  - Evaluating (passage-forecast-review.md): Compare forecast vs actual, improve forecasting
- Forecast accuracy (time/difficulty estimates vs actual)
- Quality of reflection and lessons learned
- Actionable next steps
- Proper use of resources and references

## Dashboard Generation

To update the Dashboard (README.md), run:

```bash
python _system/scripts/generate_dashboard.py
```

This script:
- Scans Voyages folders (Tasks, Projects, Areas)
- Fetches time data from Google Calendar (events with `[Project]` or `[Area]` prefix)
- Generates README.md with activity visualization

Note: Requires Google Calendar API credentials in `_system/credentials/`

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
