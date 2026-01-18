# Software Smells Analysis & Architecture Redesign

> **Context:** 14-month technical debt resolution at VARLab
>
> **Analysis:** Software Smells (Code/Design/Architecture), SRP, DRY violations
>
> **Solution:** 4-Layer Architecture, 3-Level Logger System
>
> **Keywords:** Jenkins, Groovy, SOLID, Design Patterns

---

## Purpose

This portfolio is a **post-refactoring analysis** of intuitive problem-solving done during VARLab Co-op.

| What I Did | What This Document Does |
|------------|------------------------|
| Refactored 5 monolithic pipelines into 4-Layer Architecture | Classify and define those intuitive fixes using industry conventions |
| Designed 3-Level Logger System | Analyze why the design worked and how it integrates with the architecture |

**Goal:** Transform experience-based understanding into systematic, reusable knowledge

- Learn how problems I "felt" are formally named (Software Smells, Anti-patterns)
- Validate solutions against established principles (SOLID, Design Patterns)
- Understand integration points that made the Logger System possible

---

## Quick Navigation

| Part | Question | Document | Content |
|------|----------|----------|---------|
| **Part 1** | What? | [highlights.md](highlights.md) | Final Architecture, Key Features, Testability |
| **Part 2** | Why? | [problem-analysis-overview.md](problem-analysis-overview.md) | Problems, Analysis Results |
| **Part 3** | How? | [legs/README.md](legs/README.md) | Step-by-step Implementation |

---

## Project Overview

### Background

- 14 months of accumulated Technical Debt
- 5 monolithic pipelines (37% duplication, untestable)
- Discovered Jenkins Global Trusted Shared Library feature at month 13
- Performed refactoring over 54 days (Library setup 35 days, Core refactoring ~2 weeks)

### Timeline

| Milestone | Date | Commit | Repository |
|-----------|------|--------|------------|
| Initial commit (Windows) | 2023-12-17 | `e9d8028` | devops-jenkins-windows |
| Migration to Linux | 2025-01-07 | `5a59d45` | devops-jenkins-linux |
| Baseline (Before refactoring) | 2025-03-20 | `74fc356` | devops-jenkins-linux |
| **Technical Debt Period** | **~14 months** | | |
| Refactoring complete | 2025-05-12 | `ff74ac8` | devops-jenkins-linux |

> Repository started in Windows environment and migrated to Linux.
> Initial commit (2023-12-17) → Baseline (2025-03-20) = ~14 months of accumulated Technical Debt

---

## Document Structure Details

### Part 1: What - Final Results

| Document | Content | Volume |
|----------|---------|--------|
| [highlights.md](highlights.md) | 4-Layer Architecture, Logger, Shell Libraries, Testability | Core |
| [pull-request-documentation.pdf](pull-request-documentation.pdf) | Documentation attached to Pull Request | Detailed |

### Part 2: Why - Problem Analysis

| Document | Content | Volume |
|----------|---------|--------|
| [problem-analysis-overview.md](problem-analysis-overview.md) | Problem Summary | Core |
| [problem-analysis/detailed-analysis.md](problem-analysis/detailed-analysis.md) | Software Smells Analysis by File | In-depth |
| [problem-analysis/baseline-technical-snapshot.md](problem-analysis/baseline-technical-snapshot.md) | Baseline Code Statistics, File Structure (commit `54479b2`) | Detailed |

### Part 3: How - Implementation Process

| Document | Content | Volume |
|----------|---------|--------|
| [legs/README.md](legs/README.md) | 5-stage Leg Overview | Core |
| [legs/leg-0~4/changelog.md](legs/) | Detailed Records by Commit | Detailed |
| [legs/refactoring-result-snapshot.md](legs/refactoring-result-snapshot.md) | Architecture Details, Design Patterns (commit `12910c1`) | Detailed |
| [legs/logger-system-design-integration.md](legs/logger-system-design-integration.md) | 3-Level Logger Design (Problem Analysis → Solution → Implementation) | Detailed |

---

## Document Structure

```
4-layer-architecture-and-logger-system-integration/
│
├── README.md                    # ← This document (entry point)
│
├── Part 1: What (Results)
│   ├── highlights.md            # Final architecture highlights
│   └── pull-request-documentation.pdf   # Pull Request attachment
│
├── Part 2: Why (Problems)
│   ├── problem-analysis-overview.md  # Problem summary
│   └── problem-analysis/        # Detailed analysis
│       ├── detailed-analysis.md      # Analysis methodology, results summary
│       ├── baseline-technical-snapshot.md  # Code statistics/file structure
│       ├── DRY-violation-analysis.md       # System-wide DRY violation analysis
│       │
│       ├── 01-generalHelper/               # Per-file analysis
│       │   ├── srp-violation-analysis.md
│       │   ├── software-smells-analysis.md
│       │   └── design-smells-symptoms.md
│       ├── 02-jsHelper/
│       ├── 03-unityHelper/
│       ├── 04-DLXJenkins-Jenkinsfile/
│       ├── ...                             # (05~08 same structure)
│       │
│       ├── pipeline-sequence-diagrams/
│       │
│       └── reference/                      # Smells Taxonomy reference documents
│           ├── 01-code-smells-taxonomy.md
│           ├── 02a-design-smells-symptoms.md
│           ├── 02b-design-smells-principles.md
│           ├── 03-architecture-smells-taxonomy.md
│           └── ...
│
├── Part 3: How (Process)
│   └── legs/                    # Step-by-step implementation
│       ├── README.md
│       ├── refactoring-result-snapshot.md  # Architecture/patterns detailed
│       ├── logger-system-design-integration.md  # Logger design document
│       ├── leg-0-global-trusted-shared-library-setup/
│       ├── leg-1-shellscript-modularization-and-initialization-stage/
│       ├── leg-2-3-level-logger-system-implementation/
│       ├── leg-3-bitbucket-api-and-shell-library-integration/
│       └── leg-4-full-pipeline-refactoring-and-stage-modularization/
│
└── resources/                   # Images
    ├── stage-logger-before.png
    └── stage-logger-after.png
```

---

## Tech Stack

- Jenkins Pipeline (Declarative/Scripted)
- Groovy
- Jenkins Global Trusted Shared Library
- Bitbucket API
- SonarQube

---

## Reference

- [Jenkins Shared Libraries Documentation](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
