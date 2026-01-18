[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)

# DLXJenkins/JenkinsfileDeployment - Software Smells Analysis

> Level-based classification: Code Smell (function level) → Design Smell (module level) → Architecture Smell (system level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | Medium |
| Code | Dispensables | Duplicated Code | High |
| Code | Bloaters | Primitive Obsession | Low |
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
<summary>Divergent Change (7 change reasons)</summary>

**Definition**: A single class/file is frequently changed for multiple different reasons

| Change Reason | Affected Area | Line Numbers | Example Scenario |
|-----------|-------------|--------|----------|
| Jenkins environment config change | `Delete Merged Branch`, `Prepare WORKSPACE` | 57-62, 88-89 | Script loading path, JSON parsing logic change |
| Git workflow change | `Prepare WORKSPACE` | 92-106 | clone/checkout/reset/pull policy change |
| Bitbucket status API change | `Prepare WORKSPACE`, `post` | 110, 251, 256, 261 | sendBuildStatus argument format change |
| Unity config change | `Prepare WORKSPACE` | 113, 120-122 | Unity version detection, Rider sync policy change |
| Linting policy change | `Linting` | 128-153 | editorconfig path, exit code handling change |
| Unity build change | `EditMode Tests`, `PlayMode Tests`, `Build Project` | 156-198 | Test/Build Stage changes |
| Deployment server config change | `Deploy Build` | 200-237 | SSH/SCP commands, server URL, directory structure change |

**Severity Evidence**:
- **Impact Range**: High - Single Jenkinsfile handles entire CD pipeline logic
- **Bug Potential**: Medium - Modifying one domain may cause unexpected impact on other domains
- **Modification Cost**: Medium - Separating 7 domains requires shared library or separate script extraction

</details>

<details markdown>
<summary>Shotgun Surgery (4 locations to modify when changing Unity Stage names)</summary>

**Definition**: A single change requires modification of multiple classes/functions

**Unity Stage name hardcoded locations**:

| Line Number | Stage Name | Error Message |
|--------|-----------|------------|
| 120-122 | `'Rider'` | `'Synchronizing Unity and Rider IDE solution files failed'` |
| 164-166 | `'EditMode'` | `'EditMode tests failed'` |
| 178-180 | `'PlayMode'` | `'PlayMode tests failed'` |
| 193-195 | `'Webgl'` | `'WebGL Build failed'` |

**Change Scenario**: If `unityHelper.groovy` Stage constant name changes from `'Webgl'` → `'WebGL'`:
- JenkinsfileDeployment line 193 needs modification
- Missing this causes `runUnityStage` call to fail with incorrect Stage name

**Severity Evidence**:
- **Impact Range**: Medium - 4 locations within single JenkinsfileDeployment file need modification
- **Bug Potential**: High - Missing even one of 4 locations causes Stage failure
- **Modification Cost**: Low - Simple fix by extracting Stage names to constants

</details>

### 1.2 Dispensables

<details markdown>
<summary>Duplicated Code (deployment pattern repeated 2 times + stageName/errorMassage pattern repeated 4 times)</summary>

**Definition**: Same code pattern repeated in multiple places

**1. Deployment server pattern repetition** (LTI vs eConestoga):

```groovy
// Lines 205-209 (LTI server deployment)
sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} \"sudo mkdir -p /var/www/html/${FOLDER_NAME} \
&& sudo chown vconadmin:vconadmin /var/www/html/${FOLDER_NAME}\""
sh "scp -i ${env.SSH_KEY} -rp ${PROJECT_DIR}/Builds/* \"${env.DLX_WEB_HOST_URL}:/var/www/html/${FOLDER_NAME}\""
sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} 'bash ~/ShellScripts/UpdateBuildURL.sh /var/www/html/${FOLDER_NAME}'"

// Lines 218-233 (eConestoga server deployment) - Same pattern, only server URL differs
sh "ssh -i ${env.SSH_KEY} ${env.DLX_ECONESTOGA_URL} ..."
sh "scp -i ${env.SSH_KEY} -rp ... ${env.DLX_ECONESTOGA_URL}:..."
sh "ssh -i ${env.SSH_KEY} ${env.DLX_ECONESTOGA_URL} ..."
```

**→ When adding deployment server**: Copy-paste of same pattern required (15+ lines of duplication for 3rd server)

**2. stageName/errorMassage pattern repetition** (3 lines × 4 times = 12 lines of duplication):

```groovy
// Lines 120-122, 164-166, 178-180, 193-195 same pattern
String stageName = '...'
String errorMassage = '...'
unityUtil.runUnityStage(stageName, errorMassage)
```

**Severity Evidence**:
- **Impact Range**: High - Deployment pattern duplication requires full logic copy when adding new server
- **Bug Potential**: High - Inconsistency if only one of 2 locations modified when changing SSH options, paths, etc.
- **Modification Cost**: Medium - Refactoring needed to extract deployment logic into function

</details>

### 1.3 Bloaters

<details markdown>
<summary>Primitive Obsession</summary>

**Definition**: Primitive types (strings) used instead of objects/constants

| Case | Current State | Line Numbers | Problem |
|--------|----------|--------|-------|
| Stage names | `'Rider'`, `'EditMode'`, `'PlayMode'`, `'Webgl'` strings | 120, 164, 178, 193 | Duplicate definition with unityHelper constants |
| Directory names | `'linting_results'`, `'test_results'` strings | 133, 159 | Same names repeated across multiple Stages |
| Server paths | `'/var/www/html/${FOLDER_NAME}'` string | 205-206, 220, 226, 232 | Same path repeated in 4 locations |
| Main branch list | `['main', 'master']` array | 3 | Hardcoded branch names |

**Severity Evidence**:
- **Impact Range**: Low - Affects only functions within single JenkinsfileDeployment file
- **Bug Potential**: Low - No issues with current behavior, just maintenance inconvenience
- **Modification Cost**: Low - Simple fix by extracting to constants

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

**JenkinsfileDeployment's 4 domains**:
- Jenkins environment config: Script loading, JSON parsing, folder name extraction
- Git/Bitbucket: Branch cleanup, clone, checkout, reset, pull, status sending
- Unity build: Rider sync, Linting, EditMode/PlayMode tests, WebGL build
- Deployment: SSH directory creation, SCP file copy, UpdateBuildURL.sh call (2 servers)

**Modules needing separation**:
- `CleanupStage.groovy`: Branch cleanup, web server cleanup
- `PrepareStage.groovy`: Git workflow, Unity config
- `BuildStage.groovy`: Linting, tests, WebGL build
- `DeployStage.groovy`: SSH/SCP deployment logic (per-server abstraction)

**→ Related symptom**: Divergent Change (single file changes for 7 different reasons)

</details>

<details markdown>
<summary>Missing Abstraction</summary>

**Definition**: Concepts implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Area |
|-----------------|----------|--------|--------------|
| Deployment server config | `env.DLX_WEB_HOST_URL`, `env.DLX_ECONESTOGA_URL` scattered | 205-209, 218-233 | Deploy Build |
| Server path | `'/var/www/html/${FOLDER_NAME}'` repeated 4 times | 205-206, 220, 226, 232 | Deploy Build |
| Unity Stage names | `'Rider'`, `'EditMode'`, `'PlayMode'`, `'Webgl'` hardcoded | 120, 164, 178, 193 | 4 Stages |
| Directory names | `'linting_results'`, `'test_results'` | 133, 159 | Linting, EditMode |
| Main branch list | `['main', 'master']` hardcoded | 3 | Delete Merged Branch |

**Deployment server abstraction needed**:
```groovy
// Before: Hardcoded per server
sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} ..."
sh "ssh -i ${env.SSH_KEY} ${env.DLX_ECONESTOGA_URL} ..."

// After: Server config objectified
def DEPLOY_SERVERS = [
    lti:        [url: env.DLX_WEB_HOST_URL,    name: 'LTI'],
    econestoga: [url: env.DLX_ECONESTOGA_URL, name: 'eConestoga']
]
```

**→ Related symptoms**:
- Primitive Obsession (server config expressed as primitive type strings)
- Shotgun Surgery (4 locations need simultaneous modification when Stage names change)

</details>

<details markdown>
<summary>Imperative Abstraction</summary>

**Definition**: Abstraction operations written procedurally rather than object-oriented

**JenkinsfileDeployment's Imperative Abstraction evidence**:

Procedural script structure due to Jenkins Pipeline DSL characteristics:
- `stage()` blocks execute sequentially
- Connected to external scripts/servers via implicit contracts
- Called via `sh` commands without explicit interfaces

| External System | Call Method | Implicit Contract |
|------------|----------|------------|
| `Bash/Linting.bash` | `sh script: "sh '${path}' ..."` | Argument order, exit code meaning |
| `ShellScripts/UpdateBuildURL.sh` | `sh "ssh ... 'bash ~/ShellScripts/...'"` | Script exists on remote server + argument format |
| SSH/SCP commands | `sh "ssh -i ${env.SSH_KEY} ..."` | Environment variables exist, server accessible |
| `env.DLX_LIST` | `DLX_LIST.split(',')` | Environment variable exists, comma-separated format |

**→ Related symptom**: Implicit Cross-module Dependency (implicit contracts with 9 external systems)

</details>

#### Encapsulation Smells

<details markdown>
<summary>Missing Encapsulation</summary>

**Definition**: Variations not encapsulated, causing logic to be scattered

**1. Deployment pattern repetition** (LTI vs eConestoga):

| Location | Server | Pattern (3 lines) |
|------|------|-----------|
| Lines 205-209 | LTI | `ssh mkdir` + `scp` + `ssh UpdateBuildURL.sh` |
| Lines 218-233 | eConestoga | Same pattern, only URL differs |

**Encapsulation approach**: Extract to deployment function

```groovy
// Before: Repeated 2 times (copy-paste when adding server)
sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} \"sudo mkdir -p /var/www/html/${FOLDER_NAME}...\""
sh "scp -i ${env.SSH_KEY} -rp ${PROJECT_DIR}/Builds/* ..."
sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} 'bash ~/ShellScripts/UpdateBuildURL.sh ...'"

// After: Encapsulated in function
def deployToServer(serverUrl, folderName, sourcePath) {
    sh "ssh -i ${env.SSH_KEY} ${serverUrl} \"sudo mkdir -p /var/www/html/${folderName}...\""
    sh "scp -i ${env.SSH_KEY} -rp ${sourcePath}/* ${serverUrl}:/var/www/html/${folderName}"
    sh "ssh -i ${env.SSH_KEY} ${serverUrl} 'bash ~/ShellScripts/UpdateBuildURL.sh /var/www/html/${folderName}'"
}
deployToServer(env.DLX_WEB_HOST_URL, FOLDER_NAME, "${PROJECT_DIR}/Builds")
deployToServer(env.DLX_ECONESTOGA_URL, FOLDER_NAME, "${PROJECT_DIR}/Builds")
```

**2. Unity Stage execution pattern repetition** (3 lines × 4 times = 12 lines):

| Location | Stage Name | Pattern |
|------|-----------|------|
| Lines 120-122 | Rider | `String stageName = 'Rider'; String errorMassage = '...'; unityUtil.runUnityStage(...)` |
| Lines 164-166 | EditMode | Same pattern |
| Lines 178-180 | PlayMode | Same pattern |
| Lines 193-195 | Webgl | Same pattern |

**→ Related symptoms**:
- Duplicated Code (deployment pattern 2 times + Stage pattern 4 times repeated)
- Shotgun Surgery (2 locations for SSH option changes, 4 locations for error message format changes)

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
| `Bash/Linting.bash` | 139-141 | Argument format (projectDir, reportDir) + exit code meaning |
| `Bash/.editorconfig` | 137 | File existence and location |
| `Builder.cs` | 191 | File existence and location (`mv Builder.cs`) |
| `ShellScripts/UpdateBuildURL.sh` | 209, 232 | Script exists on remote server + argument format (buildPath) |
| `generalHelper.groovy` | 57 | `load()` success + function signatures (parseJson, getFullCommitHash, cleanUpPRBranch, sendBuildStatus, etc.) |
| `unityHelper.groovy` | 58 | `load()` success + function signatures (getUnityExecutable, runUnityStage) |
| SSH/SCP commands | 205-209, 218-233 | `env.SSH_KEY`, `env.DLX_WEB_HOST_URL`, `env.DLX_ECONESTOGA_URL` environment variables exist |
| `env.DLX_LIST` | 48 | Environment variable exists + comma-separated format |
| Jenkins Pipeline DSL | Entire file | `env`, `sh()`, `dir()`, `echo()`, `error()`, `fileExists()`, `currentBuild`, etc. |

**Severity Evidence**:
- **Impact Range**: High - Affects JenkinsfileDeployment + 9 external systems/scripts
- **Bug Potential**: High - Runtime errors occur when remote server scripts/environment variables change (not detectable at compile time)
- **Modification Cost**: Medium - Interface documentation or Wrapper functions needed per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)
