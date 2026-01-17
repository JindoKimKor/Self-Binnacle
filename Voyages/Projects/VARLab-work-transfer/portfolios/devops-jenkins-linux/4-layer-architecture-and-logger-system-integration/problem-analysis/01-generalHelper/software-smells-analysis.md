[← SRP Analysis](srp-violation-analysis.md) | [Next: jsHelper →](../02-jsHelper/)

# groovy/generalHelper.groovy - Software Smells Analysis

> Level-based Classification: Code Smell (Function Level) → Design Smell (Module Level) → Architecture Smell (System Level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | High |
| Design | Abstraction | Multifaceted Abstraction | High |
| Design | Abstraction | Missing Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | Medium |
| Design | Modularization | Insufficient Modularization | High |
| Design | Modularization | Hub-like Modularization | Medium |
| Architecture | Dependency Issues | Hub-like Dependency | High |
| Architecture | Dependency Issues | Implicit Cross-module Dependency | High |

---

## 1. Code Smells (Method/Function Level)

> **Source**: Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*

### 1.1 Change Preventers

<details>
<summary>Divergent Change</summary>

**Definition**: A single class/file is frequently changed for several different reasons

**Divergent Change Cases in generalHelper.groovy**:

| Change Reason | Affected Functions | Example Situation |
|-----------|-------------|----------|
| Git policy change | `cloneOrUpdateRepo`, `checkoutBranch`, `getDefaultBranch`, etc. (8) | Branch strategy change, fetch policy change |
| Bitbucket API change | `getFullCommitHash`, `sendBuildStatus` | API version upgrade, authentication method change |
| SonarQube settings change | `checkQualityGateStatus` | Quality Gate condition change, API path change |
| Web server structure change | `publishTestResultsHtmlToWebServer`, etc. (4) | Directory structure change, permission system change |
| Jenkins environment change | All functions | Environment variable name change, plugin update |
| Logging policy change | `closeLogfiles`, logging-related functions | Log format change, retention policy change |

**Severity Evidence**:
- **Impact Scope**: High - 5 pipeline files depend on this file
- **Bug Potential**: Medium - Unexpected behavior may occur when modifying Git/Bitbucket/web server functions
- **Modification Cost**: High - Architecture change required to separate 8 domains

</details>

<details>
<summary>Shotgun Surgery (Major Change Triggers)</summary>

**Definition**: A single external change requires modifications to multiple functions

**Severity Evidence**:
- **Impact Scope**: Low - 10 locations within the single generalHelper.groovy file need modification
- **Bug Potential**: High - Missing even one location causes runtime error or pipeline failure
- **Modification Cost**: Medium - Refactoring needed to extract Git commands as constants/configuration

| Change Trigger | Affected Functions | Example |
|-------------|--------------|------|
| Git CLI change | `cloneOrUpdateRepo`, `checkoutBranch`, `getDefaultBranch`, `mergeBranchIfNeeded`, `isBranchUpToDateWithRemote`, `isBranchUpToDateWithMain`, `tryMerge`, `getCurrentCommitHash` (8) | When `git fetch` -> `git fetch --all` changes, 2 locations need modification: `cloneOrUpdateRepo`(line 85), `mergeBranchIfNeeded`(line 177) |
| Web server path change | `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `cleanMergedBranchFromWebServer`, `publishGroovyDocToWebServer` (4) | When `/var/www/html` -> `/srv/www` changes, 8 total locations across 4 functions need modification |
| Python script interface change | `getFullCommitHash`, `sendBuildStatus` (2) | When `get_bitbucket_commit_hash.py` argument order changes, `getFullCommitHash`(line 251) needs modification |
| SonarQube API change | `checkQualityGateStatus` (1) | When API path `/api/ce/component` -> `/api/v2/ce/component` changes, lines 529, 530 need modification |
| SSH/SCP command structure change | `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `cleanMergedBranchFromWebServer`, `publishGroovyDocToWebServer` (4) | When `-i` option -> `--identity` changes, 10 total locations across 4 functions need modification |
| Environment variable name change | `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `cleanMergedBranchFromWebServer`, `publishGroovyDocToWebServer` (4) | When `env.SSH_KEY` -> `env.SSH_PRIVATE_KEY` changes, 10 total locations across 4 functions need modification |
| User account change | `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `publishGroovyDocToWebServer` (3) | When `vconadmin:vconadmin` -> `deployer:deployer` changes, 3 locations need modification |

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

<details>
<summary>Multifaceted Abstraction</summary>

**Definition**: A single abstraction (class/file) expresses multiple concerns

**8 Domains in generalHelper.groovy**:
- Git, Bitbucket, Deployment, SonarQube, File System, Logging, Jenkins Configuration, Parsing

**Related Symptom**: Divergent Change (changed for multiple reasons due to multiple domains: Git/Bitbucket/SonarQube, etc.)

</details>

<details>
<summary>Missing Abstraction</summary>

**Definition**: Concepts are implemented with primitive types or strings instead of dedicated classes/constants

**Missing Abstraction Cases in generalHelper.groovy**:

| Concept Needing Abstraction | Current State | Affected Functions |
|-----------------|----------|--------------|
| Web server path | `"/var/www/html"` string repeated | 4 publish/clean functions |
| SSH connection info | `env.SSH_KEY`, `env.DLX_WEB_HOST_URL` scattered | 4 publish/clean functions |
| User account | `"vconadmin:vconadmin"` hardcoded | 3 publish functions |
| SonarQube URL | `"localhost:9000/sonarqube"` hardcoded | `checkQualityGateStatus` |
| Git command options | `"--hard"`, `"-fd"`, etc. scattered | 8 Git functions |

</details>

#### Encapsulation Smells

<details>
<summary>Missing Encapsulation</summary>

**Definition**: Variations are not encapsulated, causing logic to be scattered

**Missing Encapsulation Cases in generalHelper.groovy**:

| Variation Needing Encapsulation | Current State | Affected Functions |
|-----------------|----------|--------------|
| Git fetch execution | `sh 'git fetch origin'` repeated in 2 places | `cloneOrUpdateRepo`, `mergeBranchIfNeeded` |
| SSH command execution | `sh "ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} ..."` repeated in 4 places | 4 publish/clean functions |
| SCP file transfer | `sh "scp -i ${env.SSH_KEY} ..."` repeated in 4 places | 4 publish functions |
| Directory permission setting | `chmod 755`, `chown vconadmin:vconadmin` scattered | 4 publish functions |

**Related Symptom**: Shotgun Surgery (not encapsulated -> variations scattered -> simultaneous modification required)

</details>

#### Modularization Smells

<details>
<summary>Insufficient Modularization</summary>

**Definition**: A module (class/file) is too large or complex and should be further decomposed (God Class)

**Evidence of Insufficient Modularization in generalHelper.groovy**:

| Metric | Value | Standard |
|------|-----|------|
| File size | 656 lines | Generally 200-300 lines recommended |
| Function count | 21 | 5-7 recommended based on single responsibility |
| Domain count | 8 | Single Responsibility Principle violation |
| Actor count | 6 | All teams depend on it |

**Modules Needing Separation** (8 domains):
- GitHelper (8): `cloneOrUpdateRepo`, `getDefaultBranch`, `checkoutBranch`, `mergeBranchIfNeeded`, `isBranchUpToDateWithRemote`, `isBranchUpToDateWithMain`, `tryMerge`, `getCurrentCommitHash`
- BitbucketHelper (2): `getFullCommitHash`, `sendBuildStatus`
- WebServerHelper (4): `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `cleanMergedBranchFromWebServer`, `publishGroovyDocToWebServer`
- SonarQubeHelper (1): `checkQualityGateStatus`
- FileSystemHelper (2): `cleanUpPRBranch`, `closeLogfiles`
- LoggingHelper (1): `logMessage`
- JenkinsHelper (1): `initializeEnvironment`
- ParsingHelper (2): `parseJson`, `parseTicketNumber`

</details>

<details>
<summary>Hub-like Modularization</summary>

**Definition**: A single abstraction (class/file) has too many dependencies with other abstractions

**Evidence of Hub-like Modularization in generalHelper.groovy**:
- 5 pipeline files `load()` this file
- Many of the 21 functions are called from external sources

**Related Symptom**: Hub-like Dependency (many places depend on it -> central hub role)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details>
<summary>Hub-like Dependency</summary>

**Definition**: Too many dependencies are concentrated on a single component

**Severity Evidence**:
- **Impact Scope**: High - 5 pipeline files directly load this file
- **Bug Potential**: Medium - Unexpected behavior when multiple teams modify simultaneously (merge conflicts, regression bugs)
- **Modification Cost**: High - Architecture change required for domain-specific Helper separation

</details>

<details>
<summary>Implicit Cross-module Dependency (Major External Dependencies)</summary>

**Definition**: Hidden dependencies cause coupling to external systems without explicit interfaces

**Severity Evidence**:
- **Impact Scope**: High - Affects generalHelper.groovy + 5 dependent pipeline files
- **Bug Potential**: High - Runtime errors when external systems (Python/SonarQube/SSH/Git) change (not detectable at compile time)
- **Modification Cost**: Medium - Refactoring needed such as adding Adapter/Wrapper per external system

| External System | Calling Function | Implicit Contract Content |
|-------------|----------|-----------------|
| Python scripts | `getFullCommitHash`, `sendBuildStatus` | Script path + argument format + return value format |
| SonarQube REST API | `checkQualityGateStatus` | API URL + response JSON structure |
| Web server file system | `publishTestResultsHtmlToWebServer`, `publishBuildResultsToWebServer`, `cleanMergedBranchFromWebServer`, `publishGroovyDocToWebServer` | Remote directory structure + permission system |
| Git CLI output | `getDefaultBranch`, `checkoutBranch`, `isBranchUpToDateWithRemote`, etc. | Command output format parsing (e.g., `git remote show origin`) |
| Linux command output | `closeLogfiles`, `cleanUpPRBranch` | `lsof`, `ps`, `find` output format parsing |
| Jenkins Pipeline DSL | All functions | Implicit dependency on `env.*`, `sh()`, `dir()`, `fileExists()`, etc. |

</details>

---

[← SRP Analysis](srp-violation-analysis.md) | [Next: jsHelper →](../02-jsHelper/)
