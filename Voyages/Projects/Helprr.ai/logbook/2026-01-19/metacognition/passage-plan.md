---
date: 2026-01-19
---

## Passage Plan (Planning)

### Task
Create GitHub Branch Protection Setup Guide for Helprr.ai

**Purpose:** Protect production line & prevent human error through systematic development workflow protection

**Approach:**
1. Apply for GitHub Education Student Pack (free GitHub Pro)
2. Test Branch Protection on private repo
3. Capture screenshots + demo video
4. Create Confluence documentation
5. Share with Anshita

**GitHub Education Application (Completed):**
- Added school email (jkim8918@conestogac.on.ca) to existing GitHub account
- Student ID submission is fastest, but unsure how to get Conestoga Student ID
- Converted Enrollment PDF to JPG (ilovepdf.com) and submitted
- **Approved** (Jan 19, 2026) - Benefits activate after 72 hours

**Checklist:**

Prerequisites:
- [x] GitHub Education Student Pack application → Approved
- [ ] Verify GitHub Pro activation after 72 hours (expected: Jan 22)
- [x] Or test on public repo first

Ruleset Configuration (changed from Classic Branch Protection):
- [x] Access Settings → Rules → Rulesets → New ruleset
- [x] Create `main-protection` ruleset
- [x] Target branches: `main`
- [x] Enable "Restrict deletions"
- [x] Enable "Require a pull request before merging"
- [x] Set "Required approvals" (1)
- [x] Enable "Dismiss stale approvals"
- [x] Enable "Block force pushes"

Validation:
- [x] Test direct push via VS Code/Git → rejected
- [x] Test direct edit via GitHub Web → auto branch creation + PR prompt
- [x] Create PR → test merge without approval → blocked
- [x] PR with approval → merge success

Documentation:
- [x] Capture screenshots for each step
- [x] Create Setup Guide in Confluence
- [x] Add workflow diagram (Mermaid)

### Time Estimate
- Not estimated

### Difficulty Estimate
- Not estimated

### Raw (AI: organize into sections above)
-