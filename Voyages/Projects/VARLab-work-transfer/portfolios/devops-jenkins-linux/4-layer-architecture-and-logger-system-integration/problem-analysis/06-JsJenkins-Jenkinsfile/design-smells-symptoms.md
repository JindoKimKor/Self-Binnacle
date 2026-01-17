[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# JsJenkins/Jenkinsfile - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Key Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (6 locations to modify when adding new report type) |
| Fragility | **High** | 5 domains mixed, 7 implicit dependencies |
| Immobility | **High** | 314 lines/5 Stages, entire JS CI orchestration |
| Viscosity | **High** | Missing Encapsulation → copying Server/Client reports is easier |
| Needless Complexity | **Low** | Dead Code (commented-out code, incorrect comments) |
| Needless Repetition | **High** | DRY violation (Server/Client report pattern 80 lines repeated) |
| Opacity | **High** | Undefined variables, complex nesting |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 6 locations to modify when adding new report type | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 5 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 7 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) + [Insufficient Modularization](software-smells-analysis.md#23-modularization-smells) 112-line Stage | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) Server/Client report pattern not encapsulated | Design Smells |
| Needless Complexity | [Comments (Dead Code)](software-smells-analysis.md#12-dispensables) commented-out code | Code Smells |
| Needless Repetition | [Duplicated Code](software-smells-analysis.md#12-dispensables) Server/Client pattern 2 times | Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes in other places
>
> **Symptom**: "Thought it was a simple change but it was much more complex"

### Inference Evidence: Shotgun Surgery

**Locations needing modification when adding new report type (e.g., 'admin')**:

| Line Number | Modification Content |
|--------|----------|
| 149-156 | Add `publishTestResultsHtmlToWebServer` call |
| 164 | Add `params.ADMIN_SOURCE_FOLDER` condition |
| 167 | Add new folder in path |
| 184 | Add Python script flag (`' --admin'`) |
| 206 | Add new condition block (copy 40 lines) |
| 226 | Add Python script flag |

**Conclusion**: 6 locations need simultaneous modification when adding new report type → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "Why did that break when I touched this?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**5 domains mixed in one file**:
- Jenkins environment config, Git/Bitbucket, npm/Node testing, Reports (web server/Bitbucket), SonarQube

**7 implicit dependencies**:
- `python/create_bitbucket_coverage_report.py`
- `generalHelper.groovy`, `jsHelper.groovy`
- SonarQube Scanner, SonarQube API
- Jenkins params (`SERVER_SOURCE_FOLDER`, `CLIENT_SOURCE_FOLDER`, `DEBUG_MODE`)
- Jenkins Pipeline DSL

**Potential Fragility scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| Python script argument order change | Unit Testing | Both Server/Client affected |
| SonarQube URL change | Static Analysis | Hardcoded URL needs modification |
| params name change | Unit Testing | Reference failure in 6 locations |

**Conclusion**: 5 domains mixed + 7 implicit dependencies → **High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts and reuse in other systems/modules
>
> **Symptom**: "Too many dependencies come along when trying to separate"

### Inference Evidence: Multifaceted Abstraction + Insufficient Modularization

**Unit Testing stage's excessive size**:
- 112 lines (lines 134-246)
- 7 responsibilities mixed

**Problems when attempting separation**:

| Extraction Target | Dependencies That Follow |
|----------|----------------|
| TestStage | jsUtil, params, COMMIT_HASH |
| ReportStage | generalUtil, jsUtil, params, Python script, DEBUG_MODE |
| AnalysisStage | SonarQube Scanner, SonarQube API, generalUtil |

**Conclusion**: Entire JS CI in single file + Unit Testing 112 lines → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right way (preserving design) is harder than the wrong way (hacking)
>
> **Symptom**: "It takes too long to do it properly, so let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current state (Missing Encapsulation)**:
- Server/Client report handling pattern repeated 2 times (40 lines each)
- `publishTestResultsHtmlToWebServer` call repeated 2 times

**Right way vs Hacking**:

| Situation | Right Way | Hack | Tendency |
|------|------------|------|----------|
| Add new report type | Create report handling function | Copy-paste existing 40 lines | Copy (faster) |
| Change DEBUG_MODE handling | Modify function | Manually modify 2 places | Manual (faster) |

**Conclusion**: Lack of encapsulation makes "copying is easier" structure → **High Viscosity**

---

## 5. Needless Complexity

> **Definition**: Excessive design for features not currently needed
>
> **Symptom**: YAGNI violation, "might need it later"

### Inference Evidence: Dead Code

| Line Number | Problem | Content |
|--------|------|------|
| 52 | Commented-out code | `// JENKINS_API_KEY = credentials('jenkins-api-key')` |
| 63-64 | Incorrect comment | `// Unity Setup, Initial running the project on Unity Editor` (JS project) |

**Conclusion**: Some Dead Code exists → **Low Needless Complexity**

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "similar code in multiple places"

### Inference Evidence: Duplicated Code

**Server/Client report handling pattern repeated 2 times** (80 lines duplicated):

| Type | Line Numbers | Pattern |
|------|--------|------|
| Server | 164-203 | `params check` + `retrieveReportSummaryDirs` + `DEBUG_MODE check` + `Python call` |
| Client | 206-244 | Same pattern, only variable names and flags differ |

**`publishTestResultsHtmlToWebServer` calls repeated 2 times** (lines 149-156)

**Improvement direction**:
```groovy
def processReport(sourceFolder, reportType) {
    if (!sourceFolder?.trim()) { return }
    Map summaryDirs = jsUtil.retrieveReportSummaryDirs(...)
    if (summaryDirs.isEmpty()) { return }
    String cmdArgs = "... --${reportType}"
    if (isDebugMode()) { cmdArgs += ' --debug' }
    sh "python python/create_bitbucket_coverage_report.py ${cmdArgs}"
}
```

**Conclusion**: Server/Client pattern 80 lines duplicated → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is hard to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Undefined variable usage** | Line 80 | `destinationBranch` | Not defined (should use DESTINATION_BRANCH) |
| **Complex nesting** | Lines 146-244 | Unit Testing Stage | 80 lines of Server/Client handling logic, 3-level if nesting |

### Severity Classification

**High (bug risk)**:
- Undefined variable usage: `destinationBranch` (line 80) - Should use `DESTINATION_BRANCH`

**Medium (maintenance difficulty)**:
- Complex nesting: Unit Testing Stage (lines 146-244) - 80 lines of Server/Client handling logic, 3-level if nesting

**Conclusion**: Undefined variable + complex nesting → **High Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
