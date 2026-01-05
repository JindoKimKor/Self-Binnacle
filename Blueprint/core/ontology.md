# Self-Binnacle Ontology

Definition of all Things in the Self-Binnacle system.

## Table of Contents

- [Voyage Related](#voyage-related)
  - Voyage
  - Voyage Plan
  - Logbook
  - Resources
- [Passage Related](#passage-related)
  - Metacognition 3-Stage Cycle
  - Passage
  - Passage Plan
  - Log
  - Forecast Review
- [Time Management App Related](#time-management-app-related)
  - Time Block
- [Source of Truth Principle](#source-of-truth-principle)

---

## Voyage Related

> ### Voyage
>
> | Property | Value |
> |----------|-------|
> | Definition | A single voyage (Task, Project, Area) |
> | Created by | User |
> | Storage | Self-Binnacle |
> | Lifecycle | Created → In Progress → Completed/Archive |
> | Relationship | 1 Voyage : N Passage |

> ### Voyage Plan
>
> | Property | Value |
> |----------|-------|
> | Definition | Defines Why/What/How of a Voyage |
> | Created by | User |
> | Storage | Self-Binnacle (Source of Truth) + Time Management App (optional, copy) |
> | Purpose | Provide voyage reference, confirm direction |
> | Contents | Why (Goal, Expectation), What (Scope, Background, Context), How (Workflow, Process, Schedule), Progress Tracker, Resources, Notes, Reflection |

> ### Logbook (Folder)
>
> | Property | Value |
> |----------|-------|
> | Definition | Folder storing voyage records |
> | Storage | Self-Binnacle |
> | Purpose | Accumulation, analysis, asset creation |
> | Relationship | 1 Voyage : 1 Logbook, 1 Logbook : N Passage |

> ### Resources (Folder)
>
> | Property | Value |
> |----------|-------|
> | Definition | Folder storing related materials |
> | Storage | Voyage level: `{voyage}/resources/`, Passage level: `{voyage}/logbook/{YYYY-MM-DD}/resources/` |
> | Purpose | Accumulate related materials (internal/external) |
> | Relationship | 1 Voyage : 1 Resources folder (optional), 1 Passage : 1 Resources folder (optional) |

---

## Passage Related

> ### Metacognition 3-Stage Cycle
>
> Self-Binnacle's Passage structure follows a 3-stage cycle based on metacognition research.
>
> | Stage | Definition | Self-Binnacle Thing |
> |-------|------------|---------------------|
> | Planning | Forecast + why you think so | Passage Plan |
> | Monitoring | Record what you actually did | Log |
> | Evaluating | Compare forecast vs actual, improve forecast accuracy | Forecast Review |

> ### Passage (Folder)
>
> | Property | Value |
> |----------|-------|
> | Definition | Daily voyage record unit |
> | Created by | User |
> | Storage | Self-Binnacle (`logbook/{YYYY-MM-DD}/`) |
> | Relationship | 1 Voyage : N Passage, 1 Passage : 1 Passage Plan + 1 Log + 1 Forecast Review |

> ### Passage Plan
>
> | Property | Value |
> |----------|-------|
> | Definition | Daily forecast (Planning stage) |
> | Created by | User |
> | Storage | `logbook/{YYYY-MM-DD}/passage-plan.md` |
> | Purpose | Record time/difficulty forecast and rationale |
> | Lifecycle | Created at Passage start |
> | Contents | Task (what + approach), Time Estimate (how long + why), Difficulty Estimate (how well + expected obstacles) |
> | Relationship | 1 Passage : 1 Passage Plan |

> ### Log
>
> | Property | Value |
> |----------|-------|
> | Definition | Daily record (Monitoring stage) |
> | Created by | User |
> | Storage | `logbook/{YYYY-MM-DD}/log.md` |
> | Purpose | Record what was actually done, store references |
> | Lifecycle | Written during/after work |
> | Contents | What did I actually do?, References, Notes |
> | Relationship | 1 Passage : 1 Log |

> ### Forecast Review
>
> | Property | Value |
> |----------|-------|
> | Definition | Compare forecast vs actual (Evaluating stage) |
> | Created by | User |
> | Storage | `logbook/{YYYY-MM-DD}/passage-forecast-review.md` |
> | Purpose | Check forecast accuracy, improve next forecast |
> | Lifecycle | Written at Passage end |
> | Contents | Time (forecast vs actual + accuracy + why), Difficulty (forecast vs actual + accuracy + why), How to forecast better next time |
> | Relationship | 1 Passage : 1 Forecast Review |

---

## Time Management App Related

> ### Time Block
>
> | Property | Value |
> |----------|-------|
> | Definition | A scheduled time slot on the calendar |
> | Created by | User |
> | Storage | Time Management App |
> | Purpose | Design future, induce execution |
> | Relationship | N Time Blocks : 1 Passage |

---

## Source of Truth Principle

> | System | Responsibility |
> |--------|----------------|
> | Self-Binnacle | Original storage for all Things |
> | Time Management App | Only responsible for time blocks, can have copies of Voyage Plan/Passage Plan |
>
> No grey area.
