[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# DLXJenkins/Jenkinsfile - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Main Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (5 locations when Unity Stage name changes) |
| Fragility | **High** | 6 domains mixed, 8 implicit dependencies |
| Immobility | **High** | 286 lines/6 Stages, Hub-like Dependency (entire pipeline orchestration) |
| Viscosity | **Medium** | Missing Encapsulation → stageName/errorMsg copying is easier |
| Needless Complexity | **Low** | N/A |
| Needless Repetition | **High** | DRY violation (stageName/errorMsg pattern repeated 5 times) |
| Opacity | **Medium** | Undefined variables, complex nesting |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 5 locations when Unity Stage name changes | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 6 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 8 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) Entire CI pipeline orchestration | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) Unity Stage execution pattern not encapsulated | Design Smells |
| Needless Complexity | N/A | - |
| Needless Repetition | [Duplicated Code](software-smells-analysis.md#12-dispensables) stageName/errorMsg pattern repeated 5 times | Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes to other places
>
> **Symptom**: "I thought it was a simple change, but it turned out to be much more complex"

### Inference Evidence: Shotgun Surgery

**Unity Stage name hardcoded locations**:

| Line Numbers | Stage Name | Error Message |
|--------|-----------|------------|
| 112-114 | `'Rider'` | `'Synchronizing Unity and Rider IDE solution files failed'` |
| 181-183 | `'EditMode'` | `'EditMode tests failed'` |
| 195-197 | `'PlayMode'` | `'PlayMode tests failed'` |
| 209-211 | `'Coverage'` | `'Code Coverage generation failed'` |
| 237-239 | `'Webgl'` | `'WebGL Build failed'` |

**Change Scenario**: If `unityHelper.groovy`'s Stage constant name changes from `'EditMode'` → `'Edit'`, 5 locations in Jenkinsfile need modification

**Conclusion**: Changing Stage name requires simultaneous modification of 5 locations → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "I touched this, why did that break?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**6 domains mixed in one file**:
- Jenkins environment settings, Git/Bitbucket, Unity settings, Code quality (Linting), Unity build, Report/deployment

**8 implicit dependencies**:
- `python/linting_error_report.py`, `python/create_bitbucket_webgl_build_report.py`
- `Bash/Linting.bash`, `Bash/.editorconfig`, `Builder.cs`
- `generalHelper.groovy`, `unityHelper.groovy`
- Jenkins Pipeline DSL

**Potential Fragility Scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| Linting.bash exit code change | Linting stage | Python report script call logic breaks |
| unityHelper Stage constant change | That Stage | Stage failure in 5 locations in Jenkinsfile |
| Web server path change | publishResultsToWebServer | Report deployment fails |

**Conclusion**: 6 domains mixed in one file + 8 implicit dependencies → **High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts for reuse in other systems/modules
>
> **Symptom**: "Trying to separate it brings too many dependencies along"

### Inference Evidence: Multifaceted Abstraction

**Entire CI pipeline orchestration**:
- Single 286-line Jenkinsfile handles entire DLX CI flow
- All Stage dependencies must be considered when separating

**Problems when attempting separation**:

| Extraction Target | Dependencies That Follow |
|----------|----------------|
| PrepareStage | generalUtil, unityUtil loading, branch check, Unity settings |
| LintingStage | Bash script, Python report, exit code handling |
| UnityTestStage | unityUtil, stageName/errorMsg, coverage settings |
| BuildStage | Builder.cs copy, unityUtil, Python report, web server deployment |

**Conclusion**: Entire CI pipeline in single file → partial extraction difficult → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right approach (maintaining design) is harder than the wrong approach (hacking)
>
> **Symptom**: "Doing it properly takes too long, let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current State (Missing Encapsulation)**:
```groovy
// Same pattern repeated 5 times
String stageName = 'EditMode'
String errorMassage = 'EditMode tests failed'
unityUtil.runUnityStage(stageName, errorMassage)
```

**Right Approach vs Hack**:

| Situation | Right Approach | Hack | Tendency |
|------|------------|------|----------|
| Adding new Unity Stage | Create Stage settings Map then use | Copy-paste existing pattern | Copy (faster) |
| Changing error message format | Modify Stage settings Map in bulk | Manually modify 5 locations | Manual (faster) |

**Conclusion**: Lack of encapsulation creates "copying is easier" structure → **Medium Viscosity**

---

## 5. Needless Complexity

> **Definition**: Over-engineering for features not currently needed
>
> **Symptom**: YAGNI violation, "I might need this later"

### Inference Evidence

**Dead Code or over-engineering**: N/A

**Conclusion**: **Low Needless Complexity**

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "Similar code in multiple places"

### Inference Evidence: Duplicated Code

**stageName/errorMassage pattern repeated 5 times** (3 lines × 5 = 15 lines duplicated):

| Stage | Line Numbers |
|-------|--------|
| Rider | 112-114 |
| EditMode | 181-183 |
| PlayMode | 195-197 |
| Coverage | 209-211 |
| Webgl | 237-239 |

**Improvement Direction**:
```groovy
def UNITY_STAGES = [
    Rider:    [name: 'Rider',    error: 'Synchronizing Unity and Rider IDE solution files failed'],
    EditMode: [name: 'EditMode', error: 'EditMode tests failed'],
    // ...
]
```

**Conclusion**: Same pattern repeated 5 times without abstraction → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is difficult to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Undefined variable usage** | Lines 218-221 | `FOLDER_NAME`, `TICKET_NUMBER` | Definition location unclear (set in generalUtil.initializeEnvironment) |
| **Complex nesting** | Lines 129-166 | Linting Stage | 4-level if-else nesting, exitCode branch hard to trace |

### Severity Classification

**Medium (Maintenance Difficulty)**:
- Undefined variable usage: `FOLDER_NAME`, `TICKET_NUMBER` (lines 218-221) - Definition location unclear (set in generalUtil.initializeEnvironment)
- Complex nesting: Linting Stage (lines 129-166) - 4-level if-else nesting, exitCode branch hard to trace

**Conclusion**: Undefined variables + complex nesting → **Medium Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
