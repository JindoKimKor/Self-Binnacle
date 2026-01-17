[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# groovy/jsHelper.groovy - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Main Evidence |
|---------|:------:|----------|
| Rigidity | **Medium** | Shotgun Surgery (npm commands/testingDirs change requires 3 location modifications) |
| Fragility | **Medium** | 5 domains mixed, 5 implicit dependencies |
| Immobility | **Medium** | 356 lines/10 functions/5 domains, 2 pipelines depend |
| Viscosity | **Medium** | Missing Encapsulation → testingDirs parsing copy is easier |
| Needless Complexity | **Low** | N/A (no Dead Code) |
| Needless Repetition | **Medium** | DRY violation (`logMessage` copy, testingDirs parsing 3 times) |
| Opacity | **Medium** | Incomplete implementation, counter-intuitive return values/function names, comma-separated strings |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) npm commands/testingDirs change requires 3 location modifications | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 5 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 5 | Code Smells + Arch Smells |
| Immobility | [Insufficient Modularization](software-smells-analysis.md#23-modularization-smells) 356 lines/10 functions/5 domains | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) testingDirs parsing not encapsulated → copying is easier | Design Smells |
| Needless Complexity | N/A | - |
| Needless Repetition | [DRY Violation](../DRY-violation-analysis.md) `logMessage()` copy + [Duplicated Code](software-smells-analysis.md#12-dispensables) testingDirs parsing 3 times | DRY Analysis + Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes to other places
>
> **Symptom**: "I thought it was a simple change, but it turned out to be much more complex"

### Inference Evidence: Shotgun Surgery

| Change Trigger | Functions Needing Modification | Number of Locations |
|-------------|--------------|:------------:|
| npm command structure change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` | 3 |
| testingDirs format change | Same 3 functions | 3 |
| Directory validation change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs` | 2 |

**Conclusion**: Changing npm command structure requires simultaneous modification of 3 functions → **Medium Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "I touched this, why did that break?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**5 domains mixed in one file**:
- npm/Node, File System, Logging, OS/Shell, Utility

**5 implicit dependencies**:
- Python script, Node.js CLI, npm CLI, Linux find command, Jenkins Pipeline DSL

**Potential Fragility Scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| npm audit output format change | `installNpmInTestingDirs` | Python script call fails |
| Jest report filename change | `runUnitTestsInTestingDirs` | `retrieveReportSummaryDirs` search fails |
| Node version output format change | `checkNodeVersion` | Version parsing fails |

**Conclusion**: Domains mixed without boundaries → unexpected impact on changes possible → **Medium Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts for reuse in other systems/modules
>
> **Symptom**: "Trying to separate it brings too many dependencies along"

### Inference Evidence: Insufficient Modularization

**Problems when attempting separation**:

| Extraction Target | Functions | Dependencies That Follow |
|----------|------|----------------|
| NpmHelper | 5 functions | Jenkins DSL (`sh`, `env`, `echo`), `logMessage`, Python script path |
| VersionHelper | 1 function | Pure function (few dependencies) |
| FileSystemHelper | 2 functions | Jenkins DSL, `find` command |

**Reuse Cost Analysis**:

```
Separation Cost = Function extraction + Dependency resolution + Test modification + 2 pipeline modifications
Rewrite Cost = Write from scratch

Separation Cost ≈ Rewrite Cost → Medium Immobility
```

**Conclusion**: 356 lines, 10 functions, 5 domains mixed → smaller scale than generalHelper but similar pattern → **Medium Immobility**

---

## 4. Viscosity

> **Definition**: The right approach (maintaining design) is harder than the wrong approach (hacking)
>
> **Symptom**: "Doing it properly takes too long, let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current State (Missing Encapsulation)**:
- `testingDirs.split(',') as List<String>` - repeated 3 times (lines 70, 138, 222)
- `if (testingDirs == null || testingDirs.isEmpty())` - repeated 3 times

**Right Approach vs Hack**:

| Situation | Right Approach | Hack | Tendency |
|------|------------|------|----------|
| Using testingDirs in new function | Create parsing helper function then use | Copy-paste from existing function | Copy (faster) |
| Adding npm command | Create npm helper function then use | Call `sh 'npm ...'` directly | Direct call (faster) |

**Conclusion**: Lack of encapsulation creates "copying is easier" structure → **Medium Viscosity**

---

## 5. Needless Complexity

> **Definition**: Over-engineering for features not currently needed
>
> **Symptom**: YAGNI violation, "I might need this later"

### Inference Evidence: Dead Code

**Dead Code found in SRP Analysis**: None

**Conclusion**: No Dead Code → **Low Needless Complexity**

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "Similar code in multiple places"

### Inference Evidence: DRY Analysis + Duplicated Code

**Duplication between Helper files**:

| Duplicate | GeneralHelper | JsHelper |
|------|:-------------:|:--------:|
| `logMessage()` | line 35-44 | line 7-16 (exact copy) |

**Duplication within Helper file**:

| Duplicate Pattern | Repetition Count | Location |
|----------|:--------:|------|
| testingDirs null/empty check | 3 | lines 65-68, 130-134, 214-218 |
| testingDirs parsing | 3 | lines 70, 138, 222 |
| Directory existence check | 2 | lines 73-76, 142-145 |

**Conclusion**: Same patterns repeated without abstraction → **Medium Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is difficult to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Comma-separated string** | Lines 64, 129, 213 | `testingDirs: String` | Type is String but actually a comma-separated list |
| **Counter-intuitive return value** | Line 82 | `exitCode` | Continues even if npm audit fails (only outputs warning) |
| **Function name-message mismatch** | Line 157 | `echo "npx jest failed..."` | Actually calls `npm run test` but mentions "jest" |
| **Incomplete implementation** | Line 199 | Windows `bat()` call | `workingDir` parameter unused |
| **Counter-intuitive function name** | Line 275 | `versionCompare` return value | `true` = "project version is newer" but mismatches function name |

### Severity Classification

**High (Bug Risk)**:
- Incomplete implementation: `workingDir` parameter ignored in Windows `bat()` call (line 199)

**Medium (Maintenance Difficulty)**:
- `testingDirs` comma-separated string (intent unclear from type) (lines 64, 129, 213)
- Function name-message mismatch: calls `npm run test` but mentions "jest" (line 157)
- Counter-intuitive function name: `versionCompare` return value meaning unclear (line 275)
- Counter-intuitive return value: continues even if npm audit fails (line 82)

**Conclusion**: Incomplete implementation + counter-intuitive return values/function names → **Medium Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
