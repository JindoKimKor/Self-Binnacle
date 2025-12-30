# Self-Binnacle Usage Examples

---

## 1. Structure Creation

**User:** "Create Unity CI Enabler project"

**AI:** "Is it a Project or Area?"

**User:** "Project"

**AI:**
- Create Projects/unity-ci-enabler/ folder
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

### Writing Passage Plan

**User:** "Starting Unity CI work today"

**AI:** "Should I create a Passage for today's date?"

**User:** "Yes"

**AI:**
- Create logbook/2024-12-29/ folder
- Create passage-plan.md, log.md, forecast-review.md

"Would you like to start with passage-plan.md?"

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

**User:** "Write the forecast review"

**AI:** Organization suggestion:
```markdown
## Forecast Review (Evaluating)

### Time
- Forecast: 3 hours
- Actual: 3.5 hours
- Was it accurate? Almost. 30 min added for networking.

### Difficulty
- Forecast: Medium, might get stuck on networking
- Actual: Medium, got stuck on network security group
- Was it accurate? Yes. Got stuck where expected.

### How can I forecast better next time?
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
