---
date: 2026-01-27
---

## Log (Monitoring)

### What did I actually do?
- Reorganized resources/ folder
  - Split `schreen-shots.md` + 10 images → by topic
  - [github-plans/](../../resources/github-plans/) - GitHub Free vs Pro comparison
  - [github-rulesets/](../../resources/github-rulesets/) - Branch protection ruleset setup guide
- Researched and tested GitHub Ruleset private repo issue
  - Anshita found issue when applying ruleset to private repo → investigated solution
  - Upgraded Free account to Pro and tested directly

### Blockers
-

### Reflection
- Splitting scattered screenshots by topic makes them much easier to find
- GitHub UI is unhelpful - shows "move to org" instead of "upgrade to Pro", causing confusion

### Next Steps
-

### References
-

### Notes

#### GitHub Ruleset - Private Repo Issue

**Problem**
- Anshita tried to apply ruleset to private repo, got "move to GitHub Team organization" message
- Jin only tested on public repo, so missed this issue

**Ruleset Support by Plan**
| Plan | Private Repo Ruleset |
|------|---------------------|
| GitHub Free | X (public only) |
| GitHub Pro ($4/mo) | O |
| GitHub Team (org) | O (org level) |

**Test Results**
- Free account (blitzlycos-wq) → Pro upgrade → private repo ruleset works
- Education Pro account (JindoKimKor) → works without warning

**Conclusion**
- No need to move to org, just upgrade personal account to Pro ($4/mo)
- $4 per account covers multiple repos
- Downgrading keeps ruleset json (just won't be enforced)

### Raw (AI: organize into sections above)
-
