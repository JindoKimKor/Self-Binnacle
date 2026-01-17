[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# groovy/unityHelper.groovy - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Main Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (7 locations when adding new Stage) |
| Fragility | **Medium** | 4 domains mixed, 6 implicit dependencies |
| Immobility | **Medium** | 357 lines/8 functions/4 domains, 2 pipelines depend |
| Viscosity | **High** | Missing Encapsulation → Stage logic copying is easier |
| Needless Complexity | **Low** | N/A (no Dead Code) |
| Needless Repetition | **High** | Stage-specific conditional branches in 7 locations |
| Opacity | **Medium** | Complex nested conditions, complex Map/JSON structures |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 7 locations when adding new Stage | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 4 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 6 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) 357 lines/8 functions/4 domains | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) Stage-specific conditions not encapsulated → copying is easier | Design Smells |
| Needless Complexity | N/A | - |
| Needless Repetition | [Switch Statements](software-smells-analysis.md#12-bloaters) same branch pattern repeated in 7 locations | Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes to other places
>
> **Symptom**: "I thought it was a simple change, but it turned out to be much more complex"

### Inference Evidence: Shotgun Surgery

**Locations needing modification when adding new Stage "Android"**:

| Modification Location | Line Numbers | Change Content |
|----------|--------|----------|
| Stage constant definition | 6-10 | Add `this.ANDROID = 'Android'` |
| `setLogFilePathAndUrl` mapping | 139-160 | Add `(ANDROID): [path: ..., url: ...]` |
| `getTestRunArgs` condition | 209 | Decide whether to include Android |
| `getCodeCoverageArguments` condition | 212 | Decide whether to include Android |
| `getAdditionalArgs` mapping | 192-196 | Add `Android: '...'` |
| Command assembly branch | 220-226 | Add else if |
| Graphics/quit options | 229-233 | Add Android condition |

**Conclusion**: Adding just one new Stage requires simultaneous modification of 7 locations → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "I touched this, why did that break?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**4 domains mixed in one file**:
- Unity batch mode, Python scripts, Bitbucket, File System

**6 implicit dependencies**:
- Python scripts (`create_bitbucket_test_report.py`, `get_unity_version.py`)
- Unity Hub CLI
- Unity batch mode CLI
- Unity Code Coverage JSON (Settings.json)
- Jenkins Pipeline DSL

**Potential Fragility Scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| Unity CLI option change | `runUnityBatchMode` | All 7 conditional locations need review |
| Python script argument change | `getUnityExecutable` | `sendTestReport` may also be affected |
| Code Coverage JSON structure change | `loadPathsToExclude` | `getCodeCoverageArguments` fails |

**Conclusion**: Stage-specific conditional branches scattered → unexpected impact on changes possible → **Medium Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts for reuse in other systems/modules
>
> **Symptom**: "Trying to separate it brings too many dependencies along"

### Inference Evidence: Multifaceted Abstraction

**Problems when attempting separation**:

| Extraction Target | Functions | Dependencies That Follow |
|----------|------|----------------|
| UnityBatchModeHelper | 6 functions | Jenkins DSL, Stage constants, environment variables, Python scripts |
| UnityInstallHelper | 1 function | Jenkins DSL, Python scripts, Unity Hub CLI |
| BitbucketReportHelper | 1 function | Jenkins DSL, Python scripts |

**Reuse Cost Analysis**:

```
Separation Cost = Function extraction + Stage conditional branch refactoring + 2 pipeline modifications
Rewrite Cost = Write from scratch

Separation Cost > Rewrite Cost (Stage conditional branches complex) → Medium~High Immobility
```

**Conclusion**: 357 lines, 8 functions, 4 domains + Stage-specific conditional branches scattered → **Medium Immobility**

---

## 4. Viscosity

> **Definition**: The right approach (maintaining design) is harder than the wrong approach (hacking)
>
> **Symptom**: "Doing it properly takes too long, let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → Conditional Branch Copy-Paste Induced

**Current State (Missing Encapsulation)**:
- `[EDIT_MODE, PLAY_MODE].contains(stageName)` - repeated 3 times
- `stageName == COVERAGE` - repeated 2 times
- `[WEBGL, RIDER].contains(stageName)` - repeated 2 times

**Right Approach vs Hack**:

| Situation | Right Approach | Hack | Tendency |
|------|------------|------|----------|
| Adding new Stage | Objectify Stage with Strategy pattern | Copy-paste conditional statements in 7 locations | Copy (faster) |
| Changing Stage options | Modify Stage settings data structure | Direct modification of the conditional | Direct modification (faster) |

**Conclusion**: Lack of encapsulation creates "conditional copy is easier" structure → **High Viscosity**

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

### Inference Evidence: Switch Statements

**Stage-specific Conditional Branch Repetition**:

| Branch Type | Repetition Count | Location |
|----------|:--------:|------|
| `[EDIT_MODE, PLAY_MODE].contains(stageName)` | 3 times | lines 209, 220, 303 |
| `stageName == COVERAGE` | 2 times | lines 222, 307 |
| `[WEBGL, RIDER].contains(stageName)` | 2 times | lines 216, 224 |
| `stageName != WEBGL && stageName != PLAY_MODE` | 1 time | line 229 |
| `stageName != PLAY_MODE && stageName != EDIT_MODE` | 1 time | line 233 |

**Solution**: Objectify Stage pattern (Strategy pattern or extract to data structure)

**Conclusion**: Same Stage conditional branches scattered in 7 locations → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is difficult to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Complex nested condition** | Lines 98-105 | `if (exitCode == 0) ... else if (CI_PIPELINE) ...` | 3-level conditional branch |
| **Complex Map structure** | Lines 139-160 | `logConfig` Map | Difficult to trace Stage-specific path/url settings |
| **Complex JSON parsing** | Lines 320-340 | `loadPathsToExclude()` | `m_Dictionary.m_DictionaryValues` path meaning unclear |

### Severity Classification

**Medium (Readability)**:
- Complex nested condition: 3-level conditional branch (lines 98-105)
- Complex Map structure: Difficult to trace Stage-specific path/url settings (lines 139-160)
- Complex JSON parsing: `m_Dictionary.m_DictionaryValues` path meaning unclear (lines 320-340)

**Conclusion**: Complex nested/Map/JSON structures → **Medium Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
