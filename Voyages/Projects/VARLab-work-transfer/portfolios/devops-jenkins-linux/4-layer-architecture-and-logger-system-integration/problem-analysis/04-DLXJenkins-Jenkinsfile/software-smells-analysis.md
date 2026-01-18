[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)

# DLXJenkins/Jenkinsfile - Software Smells Analysis

> Level-based Classification: Code Smell (Function Level) → Design Smell (Module Level) → Architecture Smell (System Level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | Medium |
| Code | Dispensables | Duplicated Code | Medium |
| Code | Bloaters | Primitive Obsession | Low |
| Design | Abstraction | Multifaceted Abstraction | High |
| Design | Abstraction | Missing Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | Medium |
| Design | Abstraction | Imperative Abstraction | Medium |
| Architecture | Dependency Issues | Implicit Cross-module Dependency | High |

---

## 1. Code Smells (Method/Function Level)

> **Source**: Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*

### 1.1 Change Preventers

<details markdown>
<summary>Divergent Change (6 change reasons)</summary>

**Definition**: A single class/file is frequently changed for several different reasons

| Change Reason | Affected Area | Line Numbers | Example Situation |
|-----------|-------------|--------|----------|
| Jenkins environment settings change | `Prepare WORKSPACE` | 70-80 | env output conditions, script loading path change |
| Git/Bitbucket workflow change | `Prepare WORKSPACE` | 82-94 | Branch check conditions, clone/merge policy change |
| Unity settings change | `Prepare WORKSPACE` | 101-115 | Unity version detection, Rider sync policy change |
| Linting policy change | `Linting` | 119-167 | editorconfig path, exit code handling change |
| Unity build change | `EditMode Tests`, `PlayMode Tests`, `Code Coverage`, `Build Project` | 172-258 | Test/coverage/build Stage change |
| Web server deployment change | `Code Coverage`, `Build Project` | 217-222, 253-255 | Deployment path, report type change |

**Severity Evidence**:
- **Impact Scope**: High - Single Jenkinsfile handles entire CI pipeline logic
- **Bug Potential**: Medium - Modifying one domain may unexpectedly affect other domains
- **Modification Cost**: Medium - Separating 6 domains requires shared library or separate script separation

</details>

<details markdown>
<summary>Shotgun Surgery (5 locations when Unity Stage name changes)</summary>

**Definition**: A single change requires modifications to multiple classes/functions

**Unity Stage name hardcoded locations**:

| Line Numbers | Stage Name | Error Message |
|--------|-----------|------------|
| 112-114 | `'Rider'` | `'Synchronizing Unity and Rider IDE solution files failed'` |
| 181-183 | `'EditMode'` | `'EditMode tests failed'` |
| 195-197 | `'PlayMode'` | `'PlayMode tests failed'` |
| 209-211 | `'Coverage'` | `'Code Coverage generation failed'` |
| 237-239 | `'Webgl'` | `'WebGL Build failed'` |

**Change Scenario**: If `unityHelper.groovy`'s Stage constant name changes from `'EditMode'` → `'Edit'`:
- Line 181 in Jenkinsfile needs modification
- Missing it causes failure due to wrong Stage name in `runUnityStage` call

**Severity Evidence**:
- **Impact Scope**: Medium - 5 locations within the single Jenkinsfile need modification
- **Bug Potential**: High - Missing even one of 5 locations causes Stage failure
- **Modification Cost**: Low - Simple fix by extracting Stage names as constants

</details>

### 1.2 Dispensables

<details markdown>
<summary>Duplicated Code (stageName/errorMassage pattern repeated 5 times)</summary>

**Definition**: The same code pattern is repeated in multiple places

**Repeated Pattern** (3 lines × 5 times = 15 lines duplicated):

```groovy
// Lines 112-114 (Rider)
String stageName = 'Rider'
String errorMassage = 'Synchronizing Unity and Rider IDE solution files failed'
unityUtil.runUnityStage(stageName, errorMassage)

// Lines 181-183 (EditMode)
String stageName = 'EditMode'
String errorMassage = 'EditMode tests failed'
unityUtil.runUnityStage(stageName, errorMassage)

// Lines 195-197 (PlayMode), 209-211 (Coverage), 237-239 (Webgl) same pattern
```

**Improvement Direction**: Extract Stage settings as Map

```groovy
// Before: Repeated 5 times
String stageName = 'EditMode'
String errorMassage = 'EditMode tests failed'
unityUtil.runUnityStage(stageName, errorMassage)

// After: Extract to data structure
def stageConfig = [
    EditMode: [name: 'EditMode', error: 'EditMode tests failed'],
    PlayMode: [name: 'PlayMode', error: 'PlayMode tests failed'],
    // ...
]
unityUtil.runUnityStage(stageConfig.EditMode.name, stageConfig.EditMode.error)
```

**Severity Evidence**:
- **Impact Scope**: Medium - Same pattern exists in 5 locations within the single Jenkinsfile
- **Bug Potential**: Medium - Changing error message format in only some locations breaks consistency
- **Modification Cost**: Low - Simple fix by extracting Stage settings as Map/constants

</details>

### 1.3 Bloaters

<details markdown>
<summary>Primitive Obsession</summary>

**Definition**: Using primitive types (strings) instead of objects/constants

| Case | Current State | Line Numbers | Problem |
|--------|----------|--------|-------|
| Stage names | `'Rider'`, `'EditMode'`, `'PlayMode'`, `'Coverage'`, `'Webgl'` strings | 112, 181, 195, 209, 237 | Duplicate definition with unityHelper constants |
| Report type | `'CodeCoverage'` string | 221 | Type errors only discovered at runtime |
| Directory names | `'linting_results'`, `'test_results'`, `'coverage_results'` strings | 123, 175-176 | Same names repeated across multiple Stages |
| Status values | `pass = 'Pass'`, `fail = 'Fail'` | 1-2 | Passed as Python script arguments |

**Severity Evidence**:
- **Impact Scope**: Low - Only affects functions within the single Jenkinsfile
- **Bug Potential**: Low - No current operational issues, maintenance inconvenience level
- **Modification Cost**: Low - Simple fix by extracting as constants

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

**Definition**: A single abstraction (class/file) expresses multiple concerns (SRP violation)

**6 Domains in DLXJenkins/Jenkinsfile**:
- Jenkins environment settings: Script loading, JSON parsing, env output
- Git/Bitbucket: Branch check, commit hash retrieval
- Unity settings: Unity version detection, Rider sync
- Code quality: Linting, editorconfig, exit code handling
- Unity build: EditMode/PlayMode/Coverage/WebGL Stage
- Report/deployment: Web server deployment, Bitbucket report

**Modules Needing Separation**:
- `PrepareStage.groovy`: Script loading, branch check, Unity settings
- `LintingStage.groovy`: Linting execution, report generation
- `UnityTestStage.groovy`: EditMode/PlayMode/Coverage Stage
- `BuildStage.groovy`: WebGL build, deployment

**→ Related Symptom**: Divergent Change (single file changed for 6 different reasons)

</details>

<details markdown>
<summary>Missing Abstraction</summary>

**Definition**: Concepts are implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Stage |
|-----------------|----------|--------|---------------|
| Unity Stage names | `'Rider'`, `'EditMode'`, `'PlayMode'`, `'Coverage'`, `'Webgl'` hardcoded | 112, 181, 195, 209, 237 | 5 Stages |
| Unity error messages | `'EditMode tests failed'`, etc. hardcoded | 114, 183, 197, 211, 239 | 5 Stages |
| Directory names | `'linting_results'`, `'test_results'`, `'coverage_results'` | 123, 175-176 | Linting, EditMode |
| Paths | `'Assets/Editor/'`, `'Builder.cs'` | 234-235 | Build Project |
| Report type | `'CodeCoverage'` | 221 | Code Coverage |

**→ Related Symptoms**:
- Primitive Obsession (concepts expressed with primitive type strings)
- Shotgun Surgery (5 locations need simultaneous modification when Stage name changes)

</details>

<details markdown>
<summary>Imperative Abstraction</summary>

**Definition**: Abstraction operations are written procedurally rather than object-oriented

**Evidence of Imperative Abstraction in DLXJenkins/Jenkinsfile**:

Due to the nature of Jenkins Pipeline DSL, procedural script structure:
- `stage()` blocks execute sequentially
- Connected to external scripts through implicit contracts
- Called via `sh` commands without explicit interfaces

| External Script | Call Method | Implicit Contract |
|--------------|----------|------------|
| `Bash/Linting.bash` | `sh script: "sh '${path}' ..."` | Argument order, exit code meaning |
| `python/linting_error_report.py` | `sh script: "python '${path}' ..."` | Argument order (4), pass/fail strings |
| `python/create_bitbucket_webgl_build_report.py` | `sh script: "python '${path}' ..."` | Argument order, --debug flag |

**→ Related Symptom**: Implicit Cross-module Dependency (implicit contracts with 7 external scripts)

</details>

#### Encapsulation Smells

<details markdown>
<summary>Missing Encapsulation</summary>

**Definition**: Variations are not encapsulated, causing logic to be scattered

**Unity Stage execution pattern repeated** (3 lines × 5 times = 15 lines):

| Location | Stage Name | Pattern |
|------|-----------|------|
| Lines 112-114 | Rider | `String stageName = 'Rider'; String errorMassage = '...'; unityUtil.runUnityStage(...)` |
| Lines 181-183 | EditMode | Same pattern |
| Lines 195-197 | PlayMode | Same pattern |
| Lines 209-211 | Coverage | Same pattern |
| Lines 237-239 | Webgl | Same pattern |

**Encapsulation Solution**: Extract Stage settings as Map/object

```groovy
// Before: Repeated 5 times
String stageName = 'EditMode'
String errorMassage = 'EditMode tests failed'
unityUtil.runUnityStage(stageName, errorMassage)

// After: Encapsulate in data structure
def UNITY_STAGES = [
    Rider:    [name: 'Rider',    error: 'Synchronizing Unity and Rider IDE solution files failed'],
    EditMode: [name: 'EditMode', error: 'EditMode tests failed'],
    PlayMode: [name: 'PlayMode', error: 'PlayMode tests failed'],
    Coverage: [name: 'Coverage', error: 'Code Coverage generation failed'],
    Webgl:    [name: 'Webgl',    error: 'WebGL Build failed']
]
unityUtil.runUnityStage(UNITY_STAGES.EditMode.name, UNITY_STAGES.EditMode.error)
```

**→ Related Symptoms**:
- Duplicated Code (same pattern repeated 5 times)
- Shotgun Surgery (5 locations need modification when error message format changes)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details markdown>
<summary>Implicit Cross-module Dependency</summary>

**Definition**: Hidden dependencies cause coupling to external systems without explicit interfaces

| External System | Line Numbers | Implicit Contract Content |
|-------------|--------|-----------------|
| `python/linting_error_report.py` | 143-146, 160-164 | Argument format (json path, commitHash, pass/fail, projectDir) + argument order |
| `python/create_bitbucket_webgl_build_report.py` | 251 | Argument format (commitHash, logPath) + `--debug` flag |
| `Bash/Linting.bash` | 129-130 | Argument format (projectDir, reportDir) + exit code meaning (0=success, 2=report generated) |
| `Bash/.editorconfig` | 127 | File existence and location |
| `Builder.cs` | 235 | File existence and location (`cp Builder.cs`) |
| `generalHelper.groovy` | 72 | `load()` success + function signatures (parseJson, isBranchUpToDateWithRemote, etc.) |
| `unityHelper.groovy` | 73 | `load()` success + function signatures (getUnityExecutable, runUnityStage, etc.) |
| Jenkins Pipeline DSL | Entire file | `env`, `sh()`, `dir()`, `echo()`, `error()`, `catchError()`, `currentBuild`, etc. |

**Severity Evidence**:
- **Impact Scope**: High - Affects Jenkinsfile + 7 external scripts/files
- **Bug Potential**: High - Runtime errors when external script interfaces change (not detectable at compile time)
- **Modification Cost**: Medium - Needs interface documentation per external script or Wrapper function addition

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)
