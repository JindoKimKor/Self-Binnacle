# Voyages Contract

This contract defines the relationship between Self-Binnacle (framework) and its Voyage repositories.

---

## Parties

| Party | Role | Git |
|-------|------|-----|
| **Self-Binnacle** | Framework provider (Blueprint, scripts, templates, Dashboard) | Public repo |
| **Voyages/public** | Open voyage content, serves as framework usage example | Public repo (submodule) |
| **Voyages/private** | Personal voyage content, not publicly accessible | Private repo (independent) |
| **Voyages/embryonic** | Uncommitted voyages, not yet born | No git |

---

## Self-Binnacle's Responsibilities

- Define and maintain voyage structure conventions (folder structure, templates)
- Provide Blueprint documentation for voyage creation
- Scan all Voyage repos (public + private + embryonic) for Dashboard generation
- Register `Voyages/public` as submodule for public access

## Voyage Repos' Responsibilities

- Follow the folder structure convention defined by Self-Binnacle:
  ```
  {visibility}/
  ├── Projects/
  │   └── {project-name}/
  │       ├── voyage-plan.md        (required)
  │       ├── logbook/              (required)
  │       │   └── {YYYY-MM-DD}/
  │       └── resources/            (optional)
  ├── Areas/
  │   └── {area-name}/
  │       ├── voyage-plan.md        (required)
  │       ├── logbook/              (required)
  │       │   └── {YYYY-MM-DD}/
  │       └── resources/            (optional)
  └── Tasks/
      └── {task-name}/
          ├── {task-name}.md        (required)
          └── resources/            (optional)
  ```
- Every Project/Area must have `voyage-plan.md`
- Every Passage must follow `logbook/{YYYY-MM-DD}/` convention

---

## Invariants

### Structure
- All Voyage repos share the same internal structure convention
- A Voyage belongs to exactly one visibility tier (public, private, or embryonic)
- Voyage type taxonomy (Projects/Areas/Tasks) is preserved across all tiers

### Visibility
- **public**: Fully open. Submodule-linked to Self-Binnacle. Anyone who clones Self-Binnacle can access this content.
- **private**: Not accessible from Self-Binnacle repo. Managed as independent private GitHub repo. May use internal `.gitignore` for fine-grained control.
- **embryonic**: No git tracking. Exists only on local machine. Entire folder ignored by Self-Binnacle.

### Movement
- A Voyage can move between tiers (e.g., embryonic → public when ready)
- Moving between tiers requires updating the Voyage's location and relevant git tracking

---

## Operations

### Create Voyage
- **Preconditions:**
  - Visibility tier decided (public / private / embryonic)
  - Category decided (Task / Project / Area)
  - Voyage name decided
- **Postconditions:**
  - Folder created in `Voyages/{visibility}/{category}/{voyage-name}/`
  - `voyage-plan.md` created (Project/Area) or `{task-name}.md` created (Task)

### Move Voyage Between Tiers
- **Preconditions:**
  - Voyage exists in source tier
  - Target tier decided
- **Postconditions:**
  - Voyage folder moved to target tier
  - Source tier git updated (removed if tracked)
  - Target tier git updated (added if tracked)

### Dashboard Generation
- **Preconditions:**
  - At least one Voyage exists in any tier
- **Postconditions:**
  - Dashboard scans all three tiers
  - All Voyages displayed regardless of visibility tier
