[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)

# JsJenkins/Jenkinsfile - Software Smells Analysis

> Level-based classification: Code Smell (function level) → Design Smell (module level) → Architecture Smell (system level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | High |
| Code | Dispensables | Duplicated Code | High |
| Code | Dispensables | Comments (Dead Code) | Low |
| Code | Bloaters | Long Method | High |
| Code | Bloaters | Primitive Obsession | Low |
| Code | Couplers | Feature Envy | High |
| Implementation | Logic/Flow | Magic String | Low |
| Implementation | Logic/Flow | Deeply Nested Code | Medium |
| Design | Abstraction | Multifaceted Abstraction | High |
| Design | Abstraction | Missing Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | High |
| Design | Abstraction | Imperative Abstraction | Medium |
| Design | Modularization | Insufficient Modularization | High |
| Architecture | Dependency Issues | Implicit Cross-module Dependency | High |

---

## 1. Code Smells (Method/Function Level)

> **Source**: Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*

### 1.1 Change Preventers

<details markdown>
<summary>Divergent Change (5 change reasons)</summary>

**Definition**: A single class/file is frequently changed for multiple different reasons

| Change Reason | Affected Area | Line Numbers | Example Scenario |
|-----------|-------------|--------|----------|
| Jenkins environment config change | `Prepare WORKSPACE` | 69-77 | Script loading path, JSON parsing logic change |
| Git/Bitbucket workflow change | `Prepare WORKSPACE` | 79-94 | Branch check, clone/merge policy change |
| npm/Node config change | `Install Dependencies` | 104-119 | checkNodeVersion, installNpmInTestingDirs call method change |
| Test/report change | `Unit Testing` | 134-246 | Coverage report path, Python script argument change |
| SonarQube config change | `Static Analysis` | 249-285 | Scanner options, Quality Gate condition change |

**Severity Evidence**:
- **Impact Range**: High - Single Jenkinsfile handles entire JS CI pipeline logic
- **Bug Potential**: Medium - Modifying one domain may cause unexpected impact on other domains
- **Modification Cost**: Medium - Separating 5 domains requires shared library or separate script extraction

</details>

<details markdown>
<summary>Shotgun Surgery (6 locations to modify when adding new report type)</summary>

**Definition**: A single change requires modification of multiple classes/functions

**Locations needing modification when adding new report type (e.g., 'admin')**:

| Line Number | Modification Content | Current Code |
|--------|----------|----------|
| 149-156 | Add `publishTestResultsHtmlToWebServer` call | `'server'`, `'client'` |
| 164 | Add `params.ADMIN_SOURCE_FOLDER` condition | `params.SERVER_SOURCE_FOLDER?.trim()` |
| 167 | Add new folder in path | `${params.SERVER_SOURCE_FOLDER}` |
| 184 | Add Python script flag | `' --server'` |
| 206 | Add new condition block | `if (params.CLIENT_SOURCE_FOLDER?.trim())` |
| 226 | Add Python script flag | `' --client'` |

**Change Scenario**: When adding new report type `'admin'`:
- Add `publishTestResultsHtmlToWebServer(..., 'admin')` call
- Add `params.ADMIN_SOURCE_FOLDER` condition block (copy 40+ lines)
- Add `' --admin'` flag
- Missing even one of 6 locations causes new report type to not work

**Severity Evidence**:
- **Impact Range**: High - 6 locations across entire Unit Testing stage (112 lines) need modification
- **Bug Potential**: High - Missing even one of 6 locations causes report omission or runtime error
- **Modification Cost**: Medium - Refactoring needed to extract report types into data structure and process with loops

</details>

### 1.2 Dispensables

<details markdown>
<summary>Duplicated Code (Server/Client report handling pattern repeated 2 times)</summary>

**Definition**: Same code pattern repeated in multiple places

**Server vs Client report handling pattern repetition** (lines 164-203 vs 206-244):

```groovy
// Lines 164-203 (Server-side report)
if (params.SERVER_SOURCE_FOLDER?.trim()) {
    Map serverTestSummaryDirs = jsUtil.retrieveReportSummaryDirs(
        "${env.PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER?.trim() ?: ''}",
        COVERAGE_SUMMARY_FILE_NAME, TEST_SUMMARY_FILE_NAME
    )
    if (!serverTestSummaryDirs.isEmpty()) {
        String cmdArgs = " ${COMMIT_HASH}" +
                        " ${serverTestSummaryDirs['coverageSummaryDir']}" +
                        " ${serverTestSummaryDirs['testSummaryDir']}" +
                        ' --server'
        if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') {
            cmdArgs += ' --debug'
        }
        sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"
    }
}

// Lines 206-244 (Client-side report) - Same pattern, only variable names and flags differ
if (params.CLIENT_SOURCE_FOLDER?.trim()) {
    // ... same structure, uses '--client' flag
}
```

**→ When adding new report type**: Copy-paste of same pattern required (40+ lines of duplication)

**publishTestResultsHtmlToWebServer calls also repeated 2 times** (lines 149-156)

**Severity Evidence**:
- **Impact Range**: High - 2 locations need simultaneous modification when changing report handling logic
- **Bug Potential**: High - Inconsistency if only one of 2 locations modified when Python script argument format changes
- **Modification Cost**: Medium - Refactoring needed to extract report handling logic into function

</details>

<details markdown>
<summary>Comments (Dead Code)</summary>

**Definition**: Commented-out code or incorrect comments remain

| Line Number | Problem | Content |
|--------|------|------|
| 52 | Commented-out code | `// JENKINS_API_KEY = credentials('jenkins-api-key')` - Unused code |
| 63-64 | Incorrect comment | `// Unity Setup, Initial running the project on Unity Editor` - Mentions Unity in JS project |

**Severity Evidence**:
- **Impact Range**: Low - No impact on code behavior
- **Bug Potential**: Low - Just causes confusion during maintenance
- **Modification Cost**: Low - Simple fix by deleting/correcting comments

</details>

### 1.3 Bloaters

<details markdown>
<summary>Long Method - Unit Testing stage (112 lines)</summary>

**Definition**: A single method/area has too many responsibilities

| Stage | Lines | Responsibility Count | Detailed Responsibilities |
|-------|------|----------|----------|
| `Unit Testing` | 112 lines (134-246) | 7 | Test execution, web server deployment (server), web server deployment (client), server report path lookup, server report sending, client report path lookup, client report sending |

**Responsibilities needing separation**:
1. Test execution (lines 136-144): `runUnitTestsInTestingDirs`
2. Web server deployment (lines 148-156): `publishTestResultsHtmlToWebServer` × 2
3. Server report handling (lines 164-203): retrieveReportSummaryDirs + Python script call
4. Client report handling (lines 206-244): Same pattern

**Severity Evidence**:
- **Impact Range**: High - Affects entire Unit Testing stage
- **Bug Potential**: High - Unexpected behavior possible when modifying 112 lines with 7 mixed responsibilities
- **Modification Cost**: Medium - Refactoring needed to separate server/client report handling into separate functions

</details>

<details markdown>
<summary>Primitive Obsession</summary>

**Definition**: Primitive types (strings) used instead of objects/constants

| Case | Current State | Line Numbers | Problem |
|--------|----------|--------|-------|
| Filename constants | `'coverage-summary.json'`, `'test-results.json'` | 159-160 | Defined only inside Unit Testing stage |
| Directory name | `'linting_results'` string | 124 | Same name hardcoded across different Jenkinsfiles |
| SonarQube URL | `'http://localhost:9000/sonarqube'` string | 260 | Hardcoded URL |
| Quality Gate status | `'OK'` string | 274 | Hardcoded status value |
| Report types | `'server'`, `'client'` strings | 152, 156, 184, 226 | Repeated in 4 locations |

**Severity Evidence**:
- **Impact Range**: Low - Affects only functions within single Jenkinsfile file
- **Bug Potential**: Low - No issues with current behavior, just maintenance inconvenience
- **Modification Cost**: Low - Simple fix by extracting to constants

</details>

### 1.4 Couplers

<details markdown>
<summary>Feature Envy</summary>

**Definition**: One class/module is overly dependent on data or methods of another class/module

**Unit Testing stage's Feature Envy**:

| Dependency Target | Call Count | Line Numbers |
|----------|----------|--------|
| `jsUtil` | 3 times | 139, 166-170, 208-212 |
| `generalUtil` | 2 times | 149-152, 153-156 |
| Python script | 2 times | 192, 233 |
| `params` | 6 times | 151, 155, 164, 167, 187, 206, 209, 228 |

**→ Unit Testing stage is more interested in external module functionality than its own responsibilities**

**Severity Evidence**:
- **Impact Range**: High - Entire Unit Testing stage coupled to external dependencies
- **Bug Potential**: Medium - Stage modification required when external modules change
- **Modification Cost**: Medium - Report handling logic needs to move to jsHelper or separate module

</details>

### 1.5 Implementation Smells

<details markdown>
<summary>Magic String</summary>

**Definition**: Unexplained string literals hardcoded in code

| Line Number | Magic String | Problem |
|--------|-------------|-------|
| 260 | `'http://localhost:9000/sonarqube'` | SonarQube URL hardcoded - Code modification required when environment changes |
| 262 | `'3.10'` | Python version hardcoded - Code modification required when version upgrades |
| 274 | `'OK'` | Quality Gate status value hardcoded - Code modification required when API changes |

**Severity Evidence**:
- **Impact Range**: Low - Affects only Static Analysis stage
- **Bug Potential**: Medium - Need to find and modify hardcoded values when SonarQube environment changes
- **Modification Cost**: Low - Simple fix by extracting to constants or environment variables

</details>

<details markdown>
<summary>Deeply Nested Code</summary>

**Definition**: Excessive nesting (3+ levels) reduces code readability

**Unit Testing stage's 3-level nesting** (lines 164-203, 206-244):

```groovy
// 3-level nesting structure
if (params.SERVER_SOURCE_FOLDER?.trim()) {           // Level 1: params existence check
    Map serverTestSummaryDirs = jsUtil.retrieveReportSummaryDirs(...)
    if (!serverTestSummaryDirs.isEmpty()) {          // Level 2: Map not empty check
        if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') {  // Level 3: DEBUG_MODE check
            cmdArgs += ' --debug'
        }
        sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"
    }
    else {
        echo 'Server-side summary files are not founded.'
    }
}
else {
    echo 'params.SERVER_SOURCE_FOLDER is not founded...'
}
```

**Same pattern repeated for Client** (lines 206-244)

**Severity Evidence**:
- **Impact Range**: Medium - Entire Unit Testing stage (112 lines)
- **Bug Potential**: Medium - Hard to track conditional branches due to nested structure
- **Modification Cost**: Low - Refactorable with Early Return pattern or Guard Clause

</details>

---

## 2. Design Smells (Module/File Level)

### 2.1 Symptoms (Martin 2000)

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Detailed analysis inferred from static analysis results: **[design-smells-symptoms.md](design-smells-symptoms.md)**

### 2.2 Principles (Suryanarayana 2014)

> **Source**: Suryanarayana, G. et al. (2014). *Refactoring for Software Design Smells*

#### Abstraction Smells

<details markdown>
<summary>Multifaceted Abstraction</summary>

**Definition**: A single abstraction (class/file) represents multiple concerns (SRP violation)

**JsJenkins/Jenkinsfile's 5 domains**:
- Jenkins environment config: Script loading, JSON parsing, env output
- Git/Bitbucket: Branch check, clone, merge
- npm/Node testing: Dependency installation, test execution, coverage
- Reports: Web server deployment, Python Bitbucket reports (server/client)
- SonarQube: Code analysis, Quality Gate check

**Modules needing separation**:
- `PrepareStage.groovy`: Script loading, branch check, Git workflow
- `TestStage.groovy`: npm dependencies, test execution
- `ReportStage.groovy`: Web server deployment, Bitbucket reports (remove server/client repetition)
- `AnalysisStage.groovy`: SonarQube scan, Quality Gate

**→ Related symptom**: Divergent Change (single file changes for 5 different reasons)

</details>

<details markdown>
<summary>Missing Abstraction</summary>

**Definition**: Concepts implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Area |
|-----------------|----------|--------|--------------|
| Report types | `'server'`, `'client'` hardcoded in 4 locations | 152, 156, 184, 226 | Unit Testing |
| Filename constants | `'coverage-summary.json'`, `'test-results.json'` defined inside stage | 159-160 | Unit Testing |
| SonarQube URL | `'http://localhost:9000/sonarqube'` hardcoded | 260 | Static Analysis |
| Quality Gate status | `'OK'` hardcoded | 274 | Static Analysis |
| Python version | `'3.10'` hardcoded | 262 | Static Analysis |
| Directory name | `'linting_results'` | 124 | Linting |

**Report type abstraction needed**:
```groovy
// Before: Hardcoded per type
generalUtil.publishTestResultsHtmlToWebServer(..., 'server')
generalUtil.publishTestResultsHtmlToWebServer(..., 'client')

// After: Report type objectified
def REPORT_TYPES = [
    server: [folder: params.SERVER_SOURCE_FOLDER, flag: '--server'],
    client: [folder: params.CLIENT_SOURCE_FOLDER, flag: '--client']
]
```

**→ Related symptoms**:
- Primitive Obsession (report types/URLs expressed as primitive type strings)
- Magic String (SonarQube URL, Quality Gate status value)
- Shotgun Surgery (6 locations need modification when adding report type)

</details>

<details markdown>
<summary>Imperative Abstraction</summary>

**Definition**: Abstraction operations written procedurally rather than object-oriented

**JsJenkins/Jenkinsfile's Imperative Abstraction evidence**:

Procedural script structure due to Jenkins Pipeline DSL characteristics:
- `stage()` blocks execute sequentially
- Connected to external scripts/servers via implicit contracts
- Called via `sh` commands without explicit interfaces

| External System | Call Method | Implicit Contract |
|------------|----------|------------|
| `python/create_bitbucket_coverage_report.py` | `sh " python ..."` | Argument order, --server/--client/--debug flags |
| SonarQube Scanner | `sh "${scannerTool}/bin/sonar-scanner ..."` | CLI option format |
| `generalHelper.groovy` | `load()` + function call | 7+ function signatures |
| `jsHelper.groovy` | `load()` + function call | 6 function signatures |
| Jenkins params | `params.SERVER_SOURCE_FOLDER` | Parameter existence assumed |

**→ Related symptom**: Implicit Cross-module Dependency (implicit contracts with 7 external systems)

</details>

#### Encapsulation Smells

<details markdown>
<summary>Missing Encapsulation</summary>

**Definition**: Variations not encapsulated, causing logic to be scattered

**Server/Client report handling pattern repetition** (lines 164-203 vs 206-244):

| Location | Type | Pattern (40 lines) |
|------|------|------------|
| Lines 164-203 | Server | `params check` + `retrieveReportSummaryDirs` + `DEBUG_MODE check` + `Python call` |
| Lines 206-244 | Client | Same pattern, only variable names and flags (`--server`/`--client`) differ |

**Encapsulation approach**: Extract to report handling function

```groovy
// Before: Repeated 2 times (40 lines × 2 = 80 lines)
if (params.SERVER_SOURCE_FOLDER?.trim()) {
    Map serverTestSummaryDirs = jsUtil.retrieveReportSummaryDirs(...)
    if (!serverTestSummaryDirs.isEmpty()) {
        String cmdArgs = " ${COMMIT_HASH} ${serverTestSummaryDirs['coverageSummaryDir']}..."
        if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') { cmdArgs += ' --debug' }
        sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"
    }
}
// Client also repeats same pattern...

// After: Encapsulated in function
def processReport(sourceFolder, reportType) {
    if (!sourceFolder?.trim()) { echo "..."; return }
    Map summaryDirs = jsUtil.retrieveReportSummaryDirs("${env.PROJECT_DIR}/${sourceFolder}", ...)
    if (summaryDirs.isEmpty()) { echo "..."; return }
    String cmdArgs = " ${COMMIT_HASH} ${summaryDirs['coverageSummaryDir']} ... --${reportType}"
    if (isDebugMode()) { cmdArgs += ' --debug' }
    sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"
}
processReport(params.SERVER_SOURCE_FOLDER, 'server')
processReport(params.CLIENT_SOURCE_FOLDER, 'client')
```

**publishTestResultsHtmlToWebServer calls also repeated 2 times** (lines 149-156)

**→ Related symptoms**:
- Duplicated Code (Server/Client pattern repeated 2 times = 80+ lines duplication)
- Shotgun Surgery (2 locations need simultaneous modification when report format changes)
- Deeply Nested Code (3-level nesting repeated 2 times)

</details>

#### Modularization Smells

<details markdown>
<summary>Insufficient Modularization</summary>

**Definition**: Abstraction is too large or complex (God Class/Method)

**Unit Testing stage's excessive size**:

| Metric | Value | Threshold | Status |
|----------|---|--------|------|
| Lines | 112 lines (134-246) | ~30 lines | ❌ Exceeded |
| Responsibility count | 7 | 1-2 | ❌ Exceeded |
| External dependencies | 4 (jsUtil, generalUtil, params, Python) | 2-3 | ❌ Exceeded |
| Nesting depth | 3 levels | 2 levels | ❌ Exceeded |

**7 responsibilities list**:
1. Test execution (`runUnitTestsInTestingDirs`)
2. Web server deployment - Server (`publishTestResultsHtmlToWebServer`)
3. Web server deployment - Client (`publishTestResultsHtmlToWebServer`)
4. Server report path lookup (`retrieveReportSummaryDirs`)
5. Server report sending (`create_bitbucket_coverage_report.py`)
6. Client report path lookup (`retrieveReportSummaryDirs`)
7. Client report sending (`create_bitbucket_coverage_report.py`)

**Separation approach**:
```groovy
// Before: 112-line single stage
stage('Unit Testing') { /* 7 responsibilities mixed */ }

// After: Separated by responsibility
stage('Unit Testing') { jsUtil.runUnitTestsInTestingDirs(...) }
stage('Publish Results') { reportUtil.publishToWebServer(...) }
stage('Send Reports') { reportUtil.sendBitbucketReports(...) }
```

**→ Related symptoms**:
- Long Method (112 lines, 7 responsibilities)
- Feature Envy (excessive dependency on jsUtil, generalUtil, params)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details markdown>
<summary>Implicit Cross-module Dependency</summary>

**Definition**: Hidden dependencies causing coupling to external systems without explicit interfaces

| External System | Line Numbers | Implicit Contract Content |
|-------------|--------|-----------------|
| `python/create_bitbucket_coverage_report.py` | 192, 233 | Argument format (commitHash, coverageDir, testDir, --server/--client, --debug) |
| `generalHelper.groovy` | 72 | `load()` success + function signatures (parseJson, isBranchUpToDateWithRemote, initializeEnvironment, cloneOrUpdateRepo, mergeBranchIfNeeded, publishTestResultsHtmlToWebServer, checkQualityGateStatus, etc.) |
| `jsHelper.groovy` | 73 | `load()` success + function signatures (findTestingDirs, checkNodeVersion, installNpmInTestingDirs, executeLintingInTestingDirs, runUnitTestsInTestingDirs, retrieveReportSummaryDirs) |
| SonarQube Scanner | 254-265 | Scanner path, CLI option format (`-Dsonar.projectKey`, `-Dsonar.host.url`, etc.) |
| SonarQube API | 271 | `checkQualityGateStatus` return value structure (`entireCodeStatus`, `newCodeStatus`) |
| Jenkins Pipeline Params | 164, 206 | `params.SERVER_SOURCE_FOLDER`, `params.CLIENT_SOURCE_FOLDER`, `params.DEBUG_MODE` existence |
| Jenkins Pipeline DSL | Entire file | `env`, `sh()`, `dir()`, `echo()`, `error()`, `tool()`, `withSonarQubeEnv()`, `withCredentials()`, `currentBuild`, etc. |

**Severity Evidence**:
- **Impact Range**: High - Affects Jenkinsfile + 7 external systems/scripts
- **Bug Potential**: High - Runtime errors occur when Python script/SonarQube API/params change (not detectable at compile time)
- **Modification Cost**: Medium - Interface documentation or Wrapper functions needed per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)
