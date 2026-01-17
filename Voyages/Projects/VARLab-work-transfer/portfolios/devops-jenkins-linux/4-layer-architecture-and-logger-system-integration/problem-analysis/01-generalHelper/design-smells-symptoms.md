[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# groovy/generalHelper.groovy - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Main Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (7 change triggers) |
| Fragility | **Medium~High** | 8 domains mixed, 6 implicit dependencies |
| Immobility | **High** | 656 lines/21 functions/8 domains, Hub-like Dependency |
| Viscosity | **Medium** | Missing Encapsulation → copying is easier |
| Needless Complexity | **Low** | 2 Dead Code instances |
| Needless Repetition | **High** | DRY violation (SSH/SCP/Git patterns, logMessage copy) |
| Opacity | **High** | Counter-intuitive variable names, function name mismatch, complex nested/retry logic, magic strings |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 7 change triggers → a single change causes multiple modifications | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 8 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 6 → modifications affect unexpected places | Code Smells + Arch Smells |
| Immobility | [Hub-like Dependency](software-smells-analysis.md#31-dependency-issues) 5 pipelines depend + [Insufficient Modularization](software-smells-analysis.md#modularization-smells) 656 lines/21 functions → excessive dependencies when separating | Arch Smells + Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#encapsulation-smells) SSH/SCP/Git patterns not encapsulated → copying is easier than the right approach | Design Smells |
| Needless Complexity | [Dead Code](srp-violation-analysis.md) 2 functions (`getCurrentCommitHash`, `closeLogfiles`) → unused code exists | SRP Analysis |
| Needless Repetition | [DRY Violation](../DRY-violation-analysis.md) `logMessage()` copy, SSH/SCP pattern repetition → same code repeated | DRY Analysis |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes to other places
>
> **Symptom**: "I thought it was a simple change, but it turned out to be much more complex"

### Inference Evidence: Shotgun Surgery

| Change Trigger | Functions Needing Modification | Number of Locations |
|-------------|--------------|:------------:|
| Git CLI change | 8 functions | 10+ |
| Web server path change | 4 functions | 8 |
| SSH/SCP command structure change | 4 functions | 10 |
| Environment variable name change | 4 functions | 10 |
| User account change | 3 functions | 3 |

**Conclusion**: Changing just the `/var/www/html` path requires modifying 8 locations across 4 functions → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "I touched this, why did that break?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**8 domains mixed in one file**:
- Git, Bitbucket, Deployment (WebServer), SonarQube, File System, Logging, Jenkins Configuration, Parsing

**6 implicit dependencies**:
- Python scripts, SonarQube REST API, Web server file system, Git CLI output, Linux command output, Jenkins Pipeline DSL

**Potential Fragility Scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| Git fetch option change | `cloneOrUpdateRepo` | `mergeBranchIfNeeded` also affected (same pattern in 2 places) |
| Python script argument change | `getFullCommitHash` | `initializeEnvironment` → `sendBuildStatus` chain affected |
| SSH key path change | publish functions | clean functions also use the same pattern |

**Conclusion**: Domains mixed without boundaries → unexpected impact on changes possible → **Medium~High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts for reuse in other systems/modules
>
> **Symptom**: "Trying to separate it brings too many dependencies along"

### Inference Evidence: Hub-like Dependency + Insufficient Modularization

**Problems when attempting separation**:

| Extraction Target | Functions | Dependencies That Follow |
|----------|------|----------------|
| GitHelper | 8 functions | Jenkins DSL (`sh`, `env`, `echo`), `logMessage` |
| BitbucketHelper | 2 functions | Python script path, Jenkins DSL |
| WebServerHelper | 4 functions | `env.SSH_KEY`, `env.DLX_WEB_HOST_URL`, Jenkins DSL |
| SonarQubeHelper | 1 function | `logMessage`, JSON parsing, HTTP client |

**Reuse Cost Analysis**:

```
Separation Cost = Function extraction + Dependency resolution + Test modification + 5 pipeline modifications
Rewrite Cost = Write from scratch

Separation Cost > Rewrite Cost → Immobility
```

**Conclusion**: 656 lines, 21 functions, 8 domains intertwined makes partial extraction difficult → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right approach (maintaining design) is harder than the wrong approach (hacking)
>
> **Symptom**: "Doing it properly takes too long, let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current State (Missing Encapsulation)**:
- `sh 'git fetch origin'` - repeated 2 times
- `sh "ssh -i ${env.SSH_KEY} ..."` - repeated 4 times
- `sh "scp -i ${env.SSH_KEY} ..."` - repeated 4 times

**Right Approach vs Hack**:

| Situation | Right Approach | Hack | Tendency |
|------|------------|------|----------|
| Adding new publish function | Create SSH/SCP helper function then use | Copy-paste from existing function | Copy (faster) |
| Adding Git operation | Create Git command wrapper then use | Call `sh 'git ...'` directly | Direct call (faster) |

**Conclusion**: Lack of encapsulation creates "copying is easier" structure → **Medium Viscosity**

---

## 5. Needless Complexity

> **Definition**: Over-engineering for features not currently needed
>
> **Symptom**: YAGNI violation, "I might need this later"

### Inference Evidence: Dead Code

**Dead Code found in SRP Analysis (2)**:

| Function | Usage Status | Inference |
|------|----------|------|
| `getCurrentCommitHash` | 0 pipelines | Created "just in case" |
| `closeLogfiles` | 0 pipelines | No longer used (legacy) |

**Conclusion**: Dead Code exists → **Low Needless Complexity** (limited to 2 functions)

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "Similar code in multiple places"

### Inference Evidence: DRY Analysis + Missing Encapsulation

**Duplication within Helper file**:

| Duplicate Pattern | Repetition Count | Location |
|----------|:--------:|------|
| `sh 'git fetch origin'` | 2 | `cloneOrUpdateRepo`, `mergeBranchIfNeeded` |
| SSH command pattern | 4 | 4 publish/clean functions |
| SCP transfer pattern | 4 | 4 publish functions |
| Permission setting pattern | 4 | 4 publish functions |

**Duplication between Helper files**:

| Duplicate | GeneralHelper | JsHelper |
|------|:-------------:|:--------:|
| `logMessage()` | line 35-44 | line 7-16 (exact copy) |

**Conclusion**: Same patterns repeated without abstraction → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is difficult to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Counter-intuitive variable name** | Line 66 | `projectExists = sh(..., returnStatus: true)` | 0 = exists, but variable named `projectExists` is counter-intuitive |
| **Function name mismatch** | Lines 5-27 | `parseJson()` | Named "parse" but actually returns fixed data |
| **Function name mismatch** | Line 189 | `isBranchUpToDateWithMain(destinationBranch)` | Named "Main" but parameter is `destinationBranch` |
| **Complex nesting** | Lines 70-107 | 3-level `if-else` nesting | Difficult to trace condition flow |
| **Complex retry loop** | Line 537 | `for` loop + `break`/`continue` | Complex state management |
| **Magic string (regex)** | Line 307 | `/[A-Za-z]+-[0-9]+/` | Pattern meaning undocumented |
| **Complex pipe command** | Lines 117-120 | `git remote show \| grep \| awk` | Step-by-step operation unclear |

### Severity Classification

**High (Bug Risk)**:
- Counter-intuitive variable name: `projectExists` where 0 = exists (line 66)

**Medium (Maintenance Difficulty)**:
- Function name mismatch with actual behavior (`parseJson`, `isBranchUpToDateWithMain`)
- Magic string regex - difficult to understand due to lack of documentation
- Complex nested/retry logic (lines 70-107, 537)

**Low (Readability)**:
- Pipe command complexity (lines 117-120)

**Conclusion**: Counter-intuitive variable names + function name mismatch + complex logic → **High Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
