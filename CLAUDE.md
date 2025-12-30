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
│   │       │       ├── forecast-review.md
│   │       │       └── resources/    # Daily materials/outputs (optional)
│   │       └── resources/            # Voyage-wide materials (optional)
│   └── Areas/                    # Ongoing interests
│       └── {area-name}/
│           ├── voyage-plan.md
│           ├── logbook/
│           │   └── {YYYY-MM-DD}/
│           │       ├── passage-plan.md
│           │       ├── log.md
│           │       ├── forecast-review.md
│           │       └── resources/    # Daily materials/outputs (optional)
│           └── resources/            # Voyage-wide materials (optional)
├── Archive/                      # Completed voyages
├── Resources/                    # Global reference materials
├── Blueprint/                    # Framework documentation (public)
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
| Forecast Review | forecast-review.md | Forecast evaluation (Evaluating) |

## Core Principles

- AI is not a pattern generator, but a monitor/coach
- User defines patterns/principles
- Data ownership belongs to the user
- Value of process: Do not automate user's thinking/forecasting/judgment

## Documentation Reference (Blueprint)

- [about.md](Blueprint/about.md) - System essence, mission
- [ontology.md](Blueprint/ontology.md) - Thing definitions
- [terminology.md](Blueprint/terminology.md) - Term definitions
- [principles.md](Blueprint/principles.md) - Principles
- [contracts.md](Blueprint/contracts.md) - System contracts
- [features.md](Blueprint/features.md) - Features
- [design-decisions.md](Blueprint/design-decisions.md) - Design decisions
- [AI-usage-example.md](Blueprint/AI-usage-example.md) - AI interaction patterns
- [templates/](Blueprint/templates/) - Voyage templates
