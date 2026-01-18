[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)

# PipelineForJenkins/Jenkinsfile - Software Smells Analysis

> Level-based classification: Code Smell (function level) → Design Smell (module level) → Architecture Smell (system level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | Medium |
| Code | Dispensables | Duplicated Code | High |
| Code | Bloaters | Primitive Obsession | Low |
| Implementation | Coding Standards | Typo in Code | High |
| Implementation | Logic/Flow | Magic String | Medium |
| Design | Abstraction | Multifaceted Abstraction | High |
| Design | Abstraction | Missing Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | High |
| Design | Abstraction | Imperative Abstraction | Medium |
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
| Jenkins environment config change | `Prepare Workspace` | 72-76 | Script loading path, JSON parsing logic change |
| Git/Bitbucket workflow change | `Prepare Workspace` | 78-95 | Branch check, clone/checkout policy change |
| Groovy lint config change | `Lint Groovy Code` | 105-190 | Docker image, lint options, Python report script change |
| Documentation config change | `Generate Groovydoc` | 194-224 | groovydoc options, web server deployment method change |
| SonarQube config change | `Static Analysis` | 242-285 | Scanner options, Quality Gate condition change |

**Severity Evidence**:
- **Impact Range**: High - Single Jenkinsfile handles entire pipeline shared library CI logic
- **Bug Potential**: Medium - Modifying one domain may cause unexpected impact on other domains
- **Modification Cost**: Medium - Separating 5 domains requires shared library or separate script extraction

</details>

<details markdown>
<summary>Shotgun Surgery (4 locations to modify when adding lint type)</summary>

**Definition**: A single change requires modification of multiple classes/functions

**Locations needing modification when adding new lint type (e.g., 'Python')**:

| Line Number | Modification Content | Current Code |
|--------|----------|----------|
| 111 | Add Docker image variable | `def imageStr = 'nvuillam/npm-groovy-lint'` |
| 115-127 | Add new lint execution block | `docker.image(imageStr).inside(...)` |
| 131-145 | Add new lint result handling block | `if (exitCodeGroovy != 0) { ... }` |
| 168 | Add new exit code condition | `if (exitCodeJenkins != 0 || exitCodeGroovy != 0)` |

**Change Scenario**: When adding new lint type `'Python'`:
- Add Docker image variable (`def pythonImageStr = '...'`)
- Add `exitCodePython` variable and execution block (30+ lines)
- Add `|| exitCodePython != 0` to result handling condition
- Modify Python report script call

**Severity Evidence**:
- **Impact Range**: Medium - 4 locations across entire Lint Groovy Code stage (85 lines) need modification
- **Bug Potential**: High - Missing even one of 4 locations causes lint omission or incorrect report
- **Modification Cost**: Low - Refactorable by extracting lint config into data structure and processing with loops

</details>

### 1.2 Dispensables

<details markdown>
<summary>Duplicated Code (Groovy/Jenkinsfile lint pattern repeated 2 times)</summary>

**Definition**: Same code pattern repeated in multiple places

**Groovy vs Jenkinsfile lint pattern repetition** (lines 115-145 vs 150-190):

```groovy
// Lines 115-127 (Groovy lint execution)
def exitCodeGroovy = docker.image(imageStr).inside(entrypointStr) {
    return sh(
        returnStatus: true,
        script: """
            echo "Linting Groovy scripts in ${PROJECT_DIR}/groovy ..."
            npm-groovy-lint \\
                --failon error \\
                --output groovy-lint-report.json \\
                --config ${PROJECT_DIR}/.groovylintrc.groovy.json \\
                ${PROJECT_DIR}/groovy
        """
    )
}

// Lines 150-164 (Jenkinsfile lint execution) - Same pattern, only config file/target paths differ
def exitCodeJenkins = docker.image(imageStr).inside(entrypointStr) {
    return sh(
        returnStatus: true,
        script: """
            echo "Linting Jenkinsfiles in DLXJenkins, JsJenkins, PipelineForJenkins ..."
            npm-groovy-lint \\
                --failon error \\
                --output jenkins-lint-report.json \\
                --config ${PROJECT_DIR}/.groovylintrc.jenkins.json \\
                ${PROJECT_DIR}/DLXJenkins ${PROJECT_DIR}/JsJenkins ${PROJECT_DIR}/PipelineForJenkins
        """
    )
}
```

**Result handling pattern also repeated 2 times** (lines 131-145 vs 168-190):

```groovy
// Pattern: Python report script call + catchError
if (exitCode != 0) {
    sh script: """python '${env.WORKSPACE}/python/Lint_groovy_report.py' ... Fail ..."""
    catchError(...) { error("linting failed") }
} else {
    sh script: """python '${env.WORKSPACE}/python/Lint_groovy_report.py' ... Pass ..."""
}
```

**→ When adding new lint type**: 30+ lines copy-paste required

**Severity Evidence**:
- **Impact Range**: High - 2 locations need simultaneous modification when changing lint logic
- **Bug Potential**: High - Inconsistency if only one of 2 locations modified when Docker options or lint config changes
- **Modification Cost**: Medium - Refactoring needed to extract lint execution/result handling into parameterized functions

</details>

### 1.3 Bloaters

<details markdown>
<summary>Primitive Obsession</summary>

**Definition**: Primitive types (strings) used instead of objects/constants

| Case | Current State | Line Numbers | Problem |
|--------|----------|--------|-------|
| Docker image | `'nvuillam/npm-groovy-lint'` string | 111 | Hardcoded image name |
| Lint config files | `'.groovylintrc.groovy.json'`, `'.groovylintrc.jenkins.json'` | 123, 158 | Hardcoded config file paths |
| SonarQube URL | `'http://localhost:9000/sonarqube'` string | 254 | Hardcoded URL |
| Python version | `'3.10'` string | 260 | Hardcoded version |
| Quality Gate status | `'OK'` string | 274 | Hardcoded status value |
| Lint target folders | `'DLXJenkins'`, `'JsJenkins'`, `'PipelineForJenkins'` | 159-161 | Hardcoded folder list |

**Severity Evidence**:
- **Impact Range**: Low - Affects only functions within single Jenkinsfile file
- **Bug Potential**: Low - No issues with current behavior, just maintenance inconvenience
- **Modification Cost**: Low - Simple fix by extracting to constants or environment variables

</details>

### 1.4 Implementation Smells

<details markdown>
<summary>Typo in Code</summary>

**Definition**: Potential bugs due to typos in code

| Line Number | Typo | Correct Form | Impact |
|--------|-----|-----------|------|
| 247 | `buildResults:` | `buildResult:` | catchError parameter name error - uncertain runtime behavior |
| 247 | `stageResults:` | `stageResult:` | catchError parameter name error - uncertain runtime behavior |
| 271 | `buildResults:` | `buildResult:` | Same typo repeated |
| 271 | `stageResults:` | `stageResult:` | Same typo repeated |

**Code comparison**:

```groovy
// Lines 247, 271 (current - typo)
catchError(buildResults: buildResults.SUCCESS, stageResults: stageResults.FAILURE) { ... }

// Correct form (used in other Jenkinsfiles)
catchError(buildResult: buildResults.SUCCESS, stageResult: stageResults.FAILURE) { ... }
```

**Severity Evidence**:
- **Impact Range**: Low - Affects only Static Analysis stage
- **Bug Potential**: High - Jenkins Pipeline DSL may ignore incorrect parameter names, causing unexpected behavior
- **Modification Cost**: Low - Simple fix by correcting typos

</details>

<details markdown>
<summary>Magic String</summary>

**Definition**: Unexplained string literals hardcoded in code

| Line Number | Magic String | Problem |
|--------|-------------|-------|
| 111 | `'nvuillam/npm-groovy-lint'` | Docker image hardcoded - Code modification required when version upgrades |
| 112 | `'--entrypoint=""'` | Docker option hardcoded |
| 254 | `'http://localhost:9000/sonarqube'` | SonarQube URL hardcoded |
| 256 | `'DEBUG'` | Log level hardcoded |
| 260 | `'3.10'` | Python version hardcoded |

**Severity Evidence**:
- **Impact Range**: Medium - Affects Lint Groovy Code, Static Analysis stages
- **Bug Potential**: Medium - Need to find and modify hardcoded values when environment changes
- **Modification Cost**: Low - Simple fix by extracting to constants or environment variables

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

**PipelineForJenkins/Jenkinsfile's 5 domains**:
- Jenkins environment config: Script loading, JSON parsing, error handling
- Git/Bitbucket: Branch check, clone, checkout
- Code quality: Groovy lint, Jenkinsfile lint (Docker + npm-groovy-lint)
- Documentation: Groovydoc generation, web server deployment
- SonarQube: Code analysis, Quality Gate check

**Modules needing separation**:
- `PrepareStage.groovy`: Script loading, branch check, Git workflow
- `LintStage.groovy`: Groovy/Jenkinsfile lint (remove pattern repetition)
- `DocStage.groovy`: Groovydoc generation, web server deployment
- `AnalysisStage.groovy`: SonarQube scan, Quality Gate

**→ Related symptom**: Divergent Change (single file changes for 5 different reasons)

</details>

<details markdown>
<summary>Missing Abstraction</summary>

**Definition**: Concepts implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Area |
|-----------------|----------|--------|--------------|
| Docker image | `'nvuillam/npm-groovy-lint'` hardcoded | 111 | Lint Groovy Code |
| Lint config files | `'.groovylintrc.groovy.json'`, `'.groovylintrc.jenkins.json'` hardcoded | 123, 158 | Lint Groovy Code |
| Lint target folders | `'DLXJenkins'`, `'JsJenkins'`, `'PipelineForJenkins'` hardcoded | 159-161 | Lint Groovy Code |
| SonarQube URL | `'http://localhost:9000/sonarqube'` hardcoded | 254 | Static Analysis |
| Python version | `'3.10'` hardcoded | 260 | Static Analysis |
| Quality Gate status | `'OK'` hardcoded | 274 | Static Analysis |

**Lint config abstraction needed**:
```groovy
// Before: Hardcoded per type
def exitCodeGroovy = docker.image('nvuillam/npm-groovy-lint').inside(...) {
    sh "npm-groovy-lint --config ${PROJECT_DIR}/.groovylintrc.groovy.json ${PROJECT_DIR}/groovy"
}
def exitCodeJenkins = docker.image('nvuillam/npm-groovy-lint').inside(...) {
    sh "npm-groovy-lint --config ${PROJECT_DIR}/.groovylintrc.jenkins.json ${PROJECT_DIR}/DLXJenkins ..."
}

// After: Lint config objectified
def LINT_CONFIGS = [
    groovy: [
        config: '.groovylintrc.groovy.json',
        targets: ['groovy'],
        reportFile: 'groovy-lint-report.json'
    ],
    jenkins: [
        config: '.groovylintrc.jenkins.json',
        targets: ['DLXJenkins', 'JsJenkins', 'PipelineForJenkins'],
        reportFile: 'jenkins-lint-report.json'
    ]
]
```

**→ Related symptoms**:
- Primitive Obsession (lint config expressed as primitive type strings)
- Magic String (Docker image, SonarQube URL, Python version)
- Shotgun Surgery (4 locations need modification when adding lint type)

</details>

<details markdown>
<summary>Imperative Abstraction</summary>

**Definition**: Abstraction operations written procedurally rather than object-oriented

**PipelineForJenkins/Jenkinsfile's Imperative Abstraction evidence**:

Procedural script structure due to Jenkins Pipeline DSL characteristics:
- `stage()` blocks execute sequentially
- Connected to external tools (Docker, SonarQube) via implicit contracts
- Called via `sh` commands without explicit interfaces

| External System | Call Method | Implicit Contract |
|------------|----------|------------|
| Docker (npm-groovy-lint image) | `docker.image().inside()` | Image exists, entrypoint config, CLI option format |
| `python/Lint_groovy_report.py` | `sh "python ..."` | Argument order (5), Pass/Fail strings |
| `.groovylintrc.*.json` | npm-groovy-lint --config | Config file existence and format |
| SonarQube Scanner | `sh "${scannerHome}/bin/sonar-scanner ..."` | CLI option format |
| `generalHelper.groovy` | `load()` + function call | 9 function signatures |
| Jenkins Tools | `tool 'Groovy'`, `tool 'JDK 17'` | Tool names exist |

**→ Related symptom**: Implicit Cross-module Dependency (implicit contracts with 9 external systems)

</details>

#### Encapsulation Smells

<details markdown>
<summary>Missing Encapsulation</summary>

**Definition**: Variations not encapsulated, causing logic to be scattered

**Groovy/Jenkinsfile lint pattern repetition** (lines 115-145 vs 150-190):

| Location | Type | Pattern (30 lines) |
|------|------|------------|
| Lines 115-145 | Groovy | `docker.image().inside()` + `sh npm-groovy-lint` + `if (exitCode != 0) { Python report + catchError }` |
| Lines 150-190 | Jenkinsfile | Same pattern, only config file/target paths differ |

**Encapsulation approach**: Extract to lint function

```groovy
// Before: Repeated 2 times (30 lines × 2 = 60 lines)
def exitCodeGroovy = docker.image(imageStr).inside(entrypointStr) {
    return sh(returnStatus: true, script: """
        npm-groovy-lint --failon error --output groovy-lint-report.json \\
            --config ${PROJECT_DIR}/.groovylintrc.groovy.json ${PROJECT_DIR}/groovy
    """)
}
if (exitCodeGroovy != 0) {
    sh script: "python '${env.WORKSPACE}/python/Lint_groovy_report.py' ..."
    catchError(...) { error("Groovy linting failed") }
}
// Jenkinsfile also repeats same pattern...

// After: Encapsulated in function
def runLint(configFile, targetPaths, reportFile, lintType) {
    def exitCode = docker.image(LINT_IMAGE).inside(ENTRYPOINT) {
        return sh(returnStatus: true, script: """
            npm-groovy-lint --failon error --output ${reportFile} \\
                --config ${PROJECT_DIR}/${configFile} ${targetPaths.join(' ')}
        """)
    }
    processLintResult(exitCode, reportFile, lintType)
    return exitCode
}
runLint('.groovylintrc.groovy.json', ['groovy'], 'groovy-lint-report.json', 'Groovy')
runLint('.groovylintrc.jenkins.json', ['DLXJenkins', 'JsJenkins', 'PipelineForJenkins'], 'jenkins-lint-report.json', 'Jenkinsfile')
```

**→ Related symptoms**:
- Duplicated Code (Groovy/Jenkinsfile lint pattern 60 lines repeated)
- Shotgun Surgery (2 locations need simultaneous modification when lint options change)

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
| `generalHelper.groovy` | 72 | `load()` success + function signatures (parseJson, isBranchUpToDateWithRemote, getFullCommitHash, initializeEnvironment, cloneOrUpdateRepo, checkoutBranch, publishGroovyDocToWebServer, checkQualityGateStatus, sendBuildStatus) |
| `python/Lint_groovy_report.py` | 133-139, 170-176, 183-189 | Argument format (groovyReportPath, jenkinsReportPath, commitHash, Pass/Fail, projectDir) |
| Docker (npm-groovy-lint image) | 115-127, 150-164 | Image existence, entrypoint config, npm-groovy-lint CLI option format |
| `.groovylintrc.groovy.json` | 123 | Config file existence and format |
| `.groovylintrc.jenkins.json` | 158 | Config file existence and format |
| SonarQube Scanner | 248-263 | Scanner path, CLI option format (`-Dsonar.projectKey`, `-Dsonar.host.url`, `-Dsonar.lang.patterns.grvy`, etc.) |
| SonarQube API | 272 | `checkQualityGateStatus` return value structure (`entireCodeStatus`, `newCodeStatus`) |
| Jenkins Tools | 9-11, 53-55 | `groovy 'Groovy'`, `jdk 'JDK 17'`, `gradle 'Gradle'` tool names exist |
| Jenkins Pipeline DSL | Entire file | `env`, `sh()`, `dir()`, `echo()`, `error()`, `tool()`, `docker.image()`, `withSonarQubeEnv()`, `withCredentials()`, `currentBuild`, `junit()`, etc. |

**Severity Evidence**:
- **Impact Range**: High - Jenkinsfile coupled to 9 external systems/config files
- **Bug Potential**: High - Runtime errors occur when Docker image updates, lint config file format changes, Python script argument changes (not detectable at compile time)
- **Modification Cost**: Medium - Interface documentation or Wrapper functions needed per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)
