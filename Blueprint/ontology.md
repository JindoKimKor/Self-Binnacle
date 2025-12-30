# Self-Binnacle Ontology

Definition of all Things in the Self-Binnacle system.

## Table of Contents
- [Voyage Related](#voyage-related)
- [Metacognition 3-Stage Cycle](#metacognition-3-stage-cycle)
- [Passage Related](#passage-related)
- [Time Management App Related](#time-management-app-related)
- [Source of Truth Principle](#source-of-truth-principle)

---

## Voyage Related
>
> ### Voyage
> - **Definition**: A single voyage (Task, Project, Area)
> - **Created by**: User
> - **Storage**: Self-Binnacle
> - **Lifecycle**: Created → In Progress → Completed/Archive
> - **Relationship**: 1 Voyage : N Passage
>
> ### Voyage Plan
> - **Definition**: Defines Why/What/How of a Voyage
> - **Created by**: User
> - **Storage**: Self-Binnacle (Source of Truth) + Time Management App (optional, copy)
> - **Purpose**: Provide voyage reference, confirm direction
> - **Contents**:
>   - Why: Why am I taking this voyage (Goal, Expectation)
>   - What: What is this voyage (Scope, Background, Context, Problem Statement, Definition, etc.)
>   - How: How will I accomplish it (Workflow, Process, Schedule, etc.)
>   - Progress Tracker, Resources, Notes, Reflection
>
> ### Logbook (Folder)
> - **Definition**: Folder storing voyage records
> - **Storage**: Self-Binnacle
> - **Purpose**: Accumulation, analysis, asset creation
> - **Relationship**:
>   - 1 Voyage : 1 Logbook
>   - 1 Logbook : N Passage
>
> ### Resources (Folder)
> - **Definition**: Folder storing related materials
> - **Storage**:
>   - Voyage level: {voyage}/resources/
>   - Passage level: {voyage}/logbook/{YYYY-MM-DD}/resources/
> - **Purpose**: Accumulate related materials (internal/external)
> - **Relationship**:
>   - 1 Voyage : 1 Resources folder (optional)
>   - 1 Passage : 1 Resources folder (optional)

---

## Metacognition 3-Stage Cycle
>
Self-Binnacle's Passage structure follows a 3-stage cycle based on metacognition research.
>
| Stage | Definition | Self-Binnacle Thing |
|-------|------------|---------------------|
| Planning | Forecast + why you think so | Passage Plan |
| Monitoring | Record what you actually did | Log |
| Evaluating | Compare forecast vs actual, improve forecast accuracy | Forecast Review |

---

## Passage Related
>
> ### Passage (Folder, {YYYY-MM-DD}/)
> - **Definition**: Daily voyage record unit
> - **Created by**: User
> - **Storage**: Self-Binnacle
> - **Relationship**:
>   - 1 Voyage : N Passage
>   - 1 Passage : 1 Passage Plan + 1 Log + 1 Forecast Review
>
---

### Passage Plan

> - **Definition**: Daily forecast (Planning)
> - **Created by**: User
> - **Storage**: logbook/{YYYY-MM-DD}/passage-plan.md
> - **Purpose**: Record time/difficulty forecast and rationale
> - **Lifecycle**: Created at Passage start
> - **Contents**:
>   - Task: What will I do? (including approach)
>   - Time Estimate: How long will it take? + Why?
>   - Difficulty Estimate: How well can I do this? + Why? (including expected obstacles)
> - **Relationship**: 1 Passage : 1 Passage Plan

---
>
> ### Log (Monitoring)
- **Definition**: Daily record (Monitoring)
- **Created by**: User
- **Storage**: logbook/{YYYY-MM-DD}/log.md
- **Purpose**: Record what was actually done, store references
- **Lifecycle**: Written during/after work
- **Contents**:
  - What did I actually do?
  - References
  - Notes
- **Relationship**: 1 Passage : 1 Log
>
> ### Forecast Review
- **Definition**: Compare forecast vs actual (Evaluating)
- **Created by**: User
- **Storage**: logbook/{YYYY-MM-DD}/forecast-review.md
- **Purpose**: Check forecast accuracy, improve next forecast
- **Lifecycle**: Written at Passage end
- **Contents**:
  - Time: Forecast vs Actual, was it accurate? Why?
  - Difficulty: Forecast vs Actual, was it accurate? Why?
  - How can I forecast better next time?
- **Relationship**: 1 Passage : 1 Forecast Review

---

## Time Management App Related
>
> ### Time Block
> - **Definition**: A scheduled time slot on the calendar
> - **Created by**: User
> - **Storage**: Time Management App
> - **Purpose**: Design future, induce execution
> - **Relationship**: N Time Blocks : 1 Passage

---

## Source of Truth Principle
>
> **Self-Binnacle**: Original storage for all Things
> **Time Management App**: Only responsible for time blocks, can have copies of Voyage Plan/Passage Plan
>
> No grey area.
