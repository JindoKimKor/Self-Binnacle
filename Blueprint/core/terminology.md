# Self-Binnacle Terminology

### Term Definitions

| Nautical Term | Self-Binnacle | Description |
|---------------|---------------|-------------|
| Voyage | Task, Project, Area | A single voyage |
| Voyage Plan | voyage-plan.md | Defines Why/What/How |
| Logbook | logbook/ | Folder storing voyage records |
| Passage | {YYYY-MM-DD}/ | Daily voyage record unit |
| Passage Plan | passage-plan.md | Daily forecast |
| Log | log.md | Daily record |
| Passage Forecast Review | passage-forecast-review.md | Forecast evaluation |

### Folder Structure
```
{Category}/
└── {voyage-name}/
    ├── voyage-plan.md
    ├── logbook/
    │   └── {YYYY-MM-DD}/
    │       ├── passage-plan.md
    │       ├── log.md
    │       ├── passage-forecast-review.md
    │       └── resources/       # Daily materials/outputs (optional)
    └── resources/               # Voyage-wide materials (optional)
```
