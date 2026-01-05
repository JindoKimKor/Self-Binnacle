# Self-Binnacle Contracts

## Table of Contents

- [Contract Philosophy](#contract-philosophy)
  - User-Driven Content Creation
  - Value of Process Guarantee
  - Technical Guarantee
- [1. User ↔ Self-Binnacle](#1-user--self-binnacle)
  - User's Responsibilities
  - Self-Binnacle's Responsibilities
  - Invariants
  - Operations
- [2. User ↔ Time Management App](#2-user--time-management-app)
  - User's Responsibilities
  - Time Management App's Responsibilities
  - Invariants
  - Operations
- [3. Self-Binnacle ↔ Time Management App](#3-self-binnacle--time-management-app)
  - Self-Binnacle's Responsibilities
  - Time Management App's Responsibilities
  - Operations
- [4. User ↔ Git/GitHub](#4-user--gitgithub)
  - User's Responsibilities
  - Git/GitHub's Responsibilities
  - Invariants
  - Operations
- [5. Self-Binnacle ↔ Git/GitHub](#5-self-binnacle--gitgithub)
  - Self-Binnacle's Responsibilities
  - Git/GitHub's Responsibilities
  - Operations
- [6. User ↔ AI](#6-user--ai)
  - User's Responsibilities
  - AI's Responsibilities
  - Invariants
  - Operations
- [7. Self-Binnacle ↔ AI](#7-self-binnacle--ai)
  - Self-Binnacle's Responsibilities
  - AI's Responsibilities
  - Invariants
  - Operations

---

## Contract Philosophy

> ### User-Driven Content Creation
>
> All content creation and modification requires user intention/judgment. Systems can automate analysis, visualization, and detection based on existing data, but cannot create or modify content autonomously.
>
> **User must do:**
> - Create new content (Voyage Plan, Passage Plan, Log, Forecast Review)
> - Modify existing content
> - Make decisions (classification, completion judgment, etc.)
>
> **System can automate:**
> - Analysis/summary/visualization of existing data (Dashboard, Reports)
> - Detection/alerts based on existing data (AI Scan)
>
> ```mermaid
> graph TD
>     U[User]
>     SB[Self-Binnacle]
>     TM[Time Management App]
>     G[Git/GitHub]
>     AI[AI]
>
>     U <--> SB
>     U <--> TM
>     U <--> G
>     U <--> AI
>     SB <--> TM
>     SB <--> G
>     SB <--> AI
> ```

> ### Value of Process Guarantee
>
> The user's manual input process itself is valuable—this is where metacognition develops.
>
> **When user does manually → System guarantees:**
>
> | User Does | System Guarantees |
> |-----------|-------------------|
> | Write Voyage Plan (Why/What/How thinking) | Clarify voyage direction, provide reference point |
> | Write Passage Plan (forecast/judgment thinking) | Metacognition Planning stage experience |
> | Write Log (recording) | Metacognition Monitoring stage experience, data accumulation |
> | Write Forecast Review (evaluation) | Metacognition Evaluating stage experience, pattern analysis data |
> | Create Time Block (trade-off thinking) | Improve daily design ability |
> | Repeat | Compound effect, metacognition development |

> ### Technical Guarantee
>
> When user provides, system technically guarantees:
>
> | User Provides | System Guarantees |
> |---------------|-------------------|
> | Create Voyage | Maintain folder structure, display on Dashboard |
> | Write Voyage Plan | Store as Source of Truth |
> | Write Log | Accumulate, compare for Logbook Reminder |
> | Define Principles | AI monitors/alerts |
> | Git Push | Version control, remote backup |

---

## 1. User ↔ Self-Binnacle

> ### User's Responsibilities
>
> **Voyage Related:**
> - Create Voyage (folder + voyage-plan.md)
> - Write Voyage Plan (Why/What/How)
> - Move to Archive when Voyage complete
>
> **Passage Related:**
> - Create Passage (date folder)
> - Write Passage Plan (Planning)
> - Write Log (Monitoring)
> - Write Forecast Review (Evaluating)
>
> **Principles Related:**
> - Define personal principles
> - Define patterns (criteria for AI monitoring)

> ### Self-Binnacle's Responsibilities
>
> **Provide Structure:**
> - Provide folder structure template
> - Provide file templates (voyage-plan.md, passage-plan.md, log.md, passage-forecast-review.md)
>
> **Data Storage:**
> - Source of Truth for all data
> - Version control (Git integration)
> - Guarantee data ownership
>
> **Visualization:**
> - Auto-generate Dashboard

> ### Invariants
>
> - Every Voyage must have voyage-plan.md
> - Every Passage must belong to one Voyage
> - Every Passage must have passage-plan.md + log.md + passage-forecast-review.md
> - Task has no Logbook (one-off, just finish it)
> - Project/Area has Logbook (need process tracking)

> ### Operations
>
> #### Create Voyage
> - **Preconditions:**
>   - Category selected (Task/Project/Area)
>   - voyage-name decided
> - **Postconditions:**
>   - {Category}/{voyage-name}/ folder created
>   - voyage-plan.md file created
>   - logbook/ folder created (Project/Area only)
>
> #### Create Passage
> - **Preconditions:**
>   - Voyage exists
>   - Date decided
> - **Postconditions:**
>   - logbook/{YYYY-MM-DD}/ folder created
>   - passage-plan.md file created
>   - log.md file created
>   - passage-forecast-review.md file created
>
> #### Complete Voyage
> - **Preconditions:**
>   - Voyage exists
>   - Completion decided (user decision)
> - **Postconditions:**
>   - Voyage folder moved to Archive/{Category}/

---

## 2. User ↔ Time Management App

> ### User's Responsibilities
>
> - Create time blocks
> - Use identifier matching Voyage (title, ID, etc. user-defined)
> - Voyage must exist in Self-Binnacle before creating time block
> - Manage Voyage Plan/Passage Plan copies (optional)

> ### Time Management App's Responsibilities
>
> - Store/manage time blocks
> - Visualize schedule (calendar view)

> ### Invariants
>
> - Time block must match one Voyage
> - Matching method is user-defined
> - Source of Truth is Self-Binnacle

> ### Operations
>
> #### Create Time Block
> - **Preconditions:**
>   - Voyage exists in Self-Binnacle
>   - Connection identifier decided
> - **Postconditions:**
>   - Time block created in Time Management App
>   - Time block matched to Voyage

---

## 3. Self-Binnacle ↔ Time Management App

> ### Self-Binnacle's Responsibilities
>
> - Use Time Management App data when generating Dashboard
> - Compare for Logbook Reminder (time block vs Log existence)

> ### Time Management App's Responsibilities
>
> - Allow time block data access (API, etc.)

> ### Operations
>
> #### Logbook Reminder
> - **Preconditions:**
>   - Time block exists
>   - Time block matched to Voyage
> - **Postconditions:**
>   - Show alert on Dashboard if no Log for that date

---

## 4. User ↔ Git/GitHub

> ### User's Responsibilities
>
> - Create Commit (save changes)
> - Push (sync to remote repository)
> - Branch management (optional)

> ### Git/GitHub's Responsibilities
>
> - Version control (track change history)
> - Remote backup
> - Access from anywhere

> ### Invariants
>
> - Entire Self-Binnacle is managed by Git
> - All changes are recorded in history

> ### Operations
>
> #### Commit
> - **Preconditions:**
>   - Changes exist
> - **Postconditions:**
>   - Changes saved locally
>   - History recorded
>
> #### Push
> - **Preconditions:**
>   - Commit exists
>   - Remote repository connected
> - **Postconditions:**
>   - Synced to remote repository

---

## 5. Self-Binnacle ↔ Git/GitHub

> ### Self-Binnacle's Responsibilities
>
> - Maintain Git-compatible file structure (Markdown, folders)

> ### Git/GitHub's Responsibilities
>
> - Version control
> - Run GitHub Actions (auto-generate Dashboard, etc.)

> ### Operations
>
> #### Auto-generate Dashboard
> - **Preconditions:**
>   - Push occurred or schedule triggered
> - **Postconditions:**
>   - README.md (Dashboard) auto-updated

---

## 6. User ↔ AI

> ### User's Responsibilities
>
> - Request AI (organize content, recommend patterns, etc.)
> - Review AI results and judge
> - Make final decision

> ### AI's Responsibilities
>
> - Perform tasks per user request (organize content, refine, etc.)
> - Recommend patterns (user selects)
> - Provide insights

> ### Invariants
>
> - AI does not generate new content or modify existing content without user's judgment/intention/decision
> - Final decision is always made by user

> ### Operations
>
> #### Content Organization Request
> - **Preconditions:**
>   - User-written content exists
>   - User requests AI
> - **Postconditions:**
>   - AI suggests organized content
>   - User reviews and decides whether to apply
>
> #### Pattern Recommendation Request
> - **Preconditions:**
>   - User requests AI
> - **Postconditions:**
>   - AI suggests patterns
>   - User decides whether to select

---

## 7. Self-Binnacle ↔ AI

> ### Self-Binnacle's Responsibilities
>
> - Provide AI-analyzable data structure (Markdown)
> - Provide principle/pattern definitions

> ### AI's Responsibilities
>
> - Detect principle violations (Security Scan)
> - Detect structure deviations (Structure Scan)
> - Detect scope deviations (Scope Scan)
> - Analyze patterns
> - Generate Self Reflection Report

> ### Invariants
>
> - AI only analyzes existing data (no auto-modification)
> - Detection results delivered to user as alerts

> ### Operations
>
> #### Security Scan
> - **Preconditions:**
>   - File exists
>   - Schedule triggered or Push occurred
> - **Postconditions:**
>   - Alert if sensitive information found
>
> #### Structure Scan
> - **Preconditions:**
>   - File/folder structure exists
>   - Schedule triggered or Push occurred
> - **Postconditions:**
>   - Alert if structure deviation found
>
> #### Scope Scan
> - **Preconditions:**
>   - File content exists
>   - User-defined principles exist
>   - Schedule triggered or Push occurred
> - **Postconditions:**
>   - Alert if scope deviation found
>
> #### Generate Self Reflection Report
> - **Preconditions:**
>   - Logbook data exists
>   - Time Management App data accessible
>   - Schedule triggered (Weekly/Monthly)
> - **Postconditions:**
>   - Report generated
>   - Delivered to user
