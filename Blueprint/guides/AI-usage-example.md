# Self-Binnacle Usage Examples

## Table of Contents
- [1. Structure Creation](#1-structure-creation)
- [2. Content Writing and Organization](#2-content-writing-and-organization)
- [3. Discussion/Development](#3-discussiondevelopment)
- [4. Pattern Recommendation](#4-pattern-recommendation)
- [5. Missing Check](#5-missing-check)
- [6. Connection Suggestion](#6-connection-suggestion)
- [7. Past Reference](#7-past-reference)
- [8. Passage Writing Flow](#8-passage-writing-flow)
- [9. AI Scan Alerts](#9-ai-scan-alerts)
- [10. Raw Processing](#10-raw-processing)
- [11. Sailing Orders Management](#11-sailing-orders-management)

---

## 1. Structure Creation

**User:** "Create Unity CI Enabler project"

**AI:** "Is it a Project or Area?"

**User:** "Project"

**AI:** "Which visibility tier? public, private, or embryonic?"

**User:** "public"

**AI:**
- Create Voyages/public/Projects/unity-ci-enabler/ folder
- Create voyage-plan.md (template)
- Create logbook/ folder

"Created. Would you like to write voyage-plan.md?"

---

## 2. Content Writing and Organization

**User:** Rough draft in voyage-plan.md:
```
gonna make the ci/cd from varlab open source
so unity devs can use it without knowing devops
using azure and github actions integration
```

**User:** "Organize this"

**AI:** Organization suggestion:
```markdown
## Why
Provide serverless build/test environment for Unity developers without DevOps experience

## What
Package VARLab's CI/CD infrastructure as open-source plug-and-play solution

## How
- Azure-based cloud architecture
- GitHub Actions integration
```

**User:** "Add milestones to How"

**AI:** Revision suggestion:
```markdown
## How
- Azure-based cloud architecture
- GitHub Actions integration
- Milestones:
  1. VM provisioning
  2. License activation
  3. Build pipeline
```

**User:** "Good"

---

## 3. Discussion/Development

**User:** "What do you think about this approach?"

**AI:** "You could also consider Container Apps instead of Azure Functions. Which fits better in terms of cost or complexity?"

**User:** "Container Apps seems too complex"

**AI:** "Then Azure Functions is the right choice. It might be good to document why you chose Functions for future reference."

---

## 4. Pattern Recommendation

**AI:** "Looking at other projects, they also include 'expected risks' in the How section. Want to add that?"

**User:** "Sure, add it"

---

## 5. Missing Check

**AI:** "voyage-plan.md has Why and What, but How is empty. Would you like to write it?"

**User:** "Oh right, I'll write it"

---

## 6. Connection Suggestion

**User:** Writing Passage Plan

**AI:** "Doesn't this connect to the portfolio item in Job Search project? Want me to add a link there too?"

**User:** "Oh yes, add it"

---

## 7. Past Reference

**User:** "How did I set up Azure networking?"

**AI:** "Looking at the 2024-12-15 Log, you got stuck on network security group settings and solved it by testing in Portal first."

**User:** "Oh right, that's what I did"

---

## 8. Passage Writing Flow

### Creating a Passage (Passage Builder CONTRACT)

**User:** "riipen passage 만들어줘" (or "create riipen passage")

**AI:**
1. Runs `voyage/resolve.py "riipen"` → resolves to `[Project] Riipen` at `Voyages/private/Projects/riipen`
2. Runs `calendar/query.py "[Project] Riipen" "2026-03-03"` → checks Calendar
3. Applies decision matrix:

**Case A — Event exists, plan filled:**
- Runs `calendar/read-description.py` → gets plan content
- Creates passage folder with pre-filled `metacognition/passage-plan.md`

**Case B — Event exists, plan empty, before event:**
- "Would you like to write the plan first?"
- User writes plan in Calendar → AI re-reads and creates passage

**Case C — No Calendar event:**
- Creates empty passage
- "No Calendar event found. Would you like to create one?"
- User provides start/end time → AI runs `calendar/create-event.py`

### Writing Passage Plan

**User:** "I'll do vm provisioning, referring to varlab code. Should take about 3 hours since I have azure experience. Might get stuck on networking though"

**AI:** Organization suggestion:
```markdown
## Passage Plan (Planning)

### Task
Implement VM provisioning. Referring to existing VARLab code.

### Time Estimate
- 3 hours
- Done similar work at VARLab, can reference the code

### Difficulty Estimate
- Medium
- Have Azure VM experience so basics are doable. Might get stuck on network settings.
```

**User:** "Good"

---

### Writing Log

**User:** "Work done. Completed VM provisioning, got stuck 30 min on network security group but solved it by testing in Portal"

**AI:** Organization suggestion:
```markdown
## Log (Monitoring)

### What did I actually do?
- Completed VM provisioning implementation
- Added network resource creation
- Network security group setup (inbound rules)

### References
- Azure VM official docs
- VARLab existing code

### Notes
- Testing in Portal first then moving to code was effective
```

**User:** "Good"

---

### Writing Forecast Review

**User:** "Estimated 3 hours but took 3.5 hours. Networking took 30 min longer. Difficulty was medium as expected, got stuck on network security group."

**AI:** Organization suggestion:
```markdown
## Forecast Review (Evaluating)

### Time
- Forecast: 3h → Actual: 3.5h
- Networking task took +30 min

### Difficulty
- Forecast: Medium → Actual: Medium
- Got stuck on network security group as expected

### How can I forecast better next time? (Metacognition)
- Add +30 min buffer for networking tasks
- Consider Portal testing time for Azure work
```

**User:** "Good"

---

## 9. AI Scan Alerts

**AI:** (Auto-detection)
- "voyage-plan.md contains an API key. Want to remove it?" (Security Scan)
- "job-search is classified as Task but has a Logbook. Change to Project?" (Structure Scan)
- "Reflection contains 'finance management' content, which is outside system scope. Want to manage it separately?" (Scope Scan)

---

## 10. Raw Processing

### Basic Raw Processing

**User:** (writes rough notes in log.md Raw section)
```
finished vm setup
got stuck on networking
need to check azure docs tomorrow
```

**User:** "Organize raw"

**AI:** Organized into sections:
- What did I actually do? → "Finished VM setup"
- Blockers → "Got stuck on networking"
- Next Steps → "Check Azure docs tomorrow"
- Raw → (cleared)

---

### Cross-File Raw Processing (Forecast Review)

**User:** (writes in passage-forecast-review.md Raw section)
```
took 2 hours as expected
was easier than thought because AI did most of the work
this assignment doesn't teach anything real
```

**User:** "Organize raw"

**AI:** Organized into:
- passage-forecast-review.md:
  - Time > Actual: 2 hours
  - Difficulty > Was it accurate?: Easier than expected, AI handled most work
- log.md > Reflection:
  - "This assignment doesn't teach anything real"

"Cross-file items moved to log.md Reflection section."

---

## 11. Sailing Orders Management

### Adding a New Order

**User:** "Add cloud benchmarking to VARLab project orders"

**AI:** "What's the purpose and deadline?"

**User:** "For portfolio completeness, no deadline"

**AI:** Added to Plotted Courses in VARLab voyage-plan.md:

> | Deadline | Created | Order | Purpose |
> |----------|---------|-------|---------|
> | - | 2026-01-20 | Cloud benchmarking section | Portfolio completeness |
>
> <details>
> <summary>Details</summary>
>
> - ACI, ACA, AKS vs Azure Batch comparison
>
> </details>
<br>

---

### Moving Order Status

**User:** "Start working on cloud benchmarking"

**AI:** Moved from Plotted Courses → Plotted (Underway):

### Plotted (Underway)

> | Deadline | Created | Order | Purpose |
> |----------|---------|-------|---------|
> | - | 2026-01-20 | Cloud benchmarking section | Portfolio completeness |
>
> <details>
> <summary>Details</summary>
>
> - ACI, ACA, AKS vs Azure Batch comparison
>
> </details>
<br>

---

### Completing an Order

**User:** "Finished cloud benchmarking"

**AI:** Moved from Plotted (Underway) → Plotted (Reached):

### Plotted (Reached)

> | Deadline | Created | Order | Purpose |
> |----------|---------|-------|---------|
> | - | 2026-01-20 | Cloud benchmarking section | Portfolio completeness |
>
> <details>
> <summary>Result</summary>
>
> - Completed ACI, ACA, AKS vs Azure Batch comparison
>
> </details>
<br>
