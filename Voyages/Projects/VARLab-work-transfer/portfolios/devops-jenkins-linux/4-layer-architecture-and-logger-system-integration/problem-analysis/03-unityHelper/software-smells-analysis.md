[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)

# groovy/unityHelper.groovy - Software Smells Analysis

> Level-based Classification: Code Smell (Function Level) → Design Smell (Module Level) → Architecture Smell (System Level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | Medium |
| Code | Change Preventers | Shotgun Surgery | High |
| Code | Bloaters | Long Method | High |
| Code | Bloaters | Switch Statements | Medium |
| Design | Abstraction | Multifaceted Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | High |
| Design | Hierarchy | Missing Hierarchy | Medium |
| Architecture | Dependency Issues | Implicit Cross-module Dependency | Medium |

---

## 1. Code Smells (Method/Function Level)

> **Source**: Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*

### 1.1 Change Preventers

<details markdown>
<summary>Divergent Change (4 change reasons)</summary>

**Definition**: A single class is frequently changed for several different reasons

| Change Reason | Affected Functions | Example Situation |
|-----------|-------------|----------|
| Unity batch mode CLI change | `runUnityBatchMode`, `getCodeCoverageArguments`, `fetCoverageOptionsKeyAndValue`, `buildCoverageOptions` | CLI options change due to Unity version upgrade |
| Python script interface change | `sendTestReport`, `getUnityExecutable` | `get_unity_version.py` argument format change |
| Bitbucket report format change | `sendTestReport` | Bitbucket API change |
| Unity Code Coverage settings change | `loadPathsToExclude`, `getCodeCoverageArguments` | Settings.json structure change |

**Severity Evidence**:
- **Impact Scope**: Medium - Called 11 times total from 2 pipelines (Jenkinsfile 7 times, JenkinsfileDeployment 4 times)
- **Bug Potential**: Medium - Unexpected behavior may occur when modifying Unity CLI/Python/Coverage related functions
- **Modification Cost**: Medium - Refactoring needed to separate 4 domains

</details>

<details markdown>
<summary>Shotgun Surgery (7 locations when adding Stage)</summary>

**Definition**: A single change requires modifications to multiple classes/functions

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

**Severity Evidence**:
- **Impact Scope**: High - 7 locations within the single unityHelper.groovy file need modification
- **Bug Potential**: High - Missing even one of 7 locations causes runtime error or Stage failure
- **Modification Cost**: High - Architecture change required to objectify Stage

</details>

### 1.2 Bloaters

<details markdown>
<summary>Long Method - runUnityBatchMode() 126 lines</summary>

| Function | Line Count | Responsibility Count | Detailed Responsibilities |
|------|------|----------|----------|
| `runUnityBatchMode()` | 126 lines (118-243) | 7 | Log path setup, test args, additional args, base command, coverage args, graphics options, execution |

**Responsibilities Needing Separation**:
1. Log path setup (setLogFilePathAndUrl closure → separate function)
2. Test argument generation (getTestRunArgs closure → separate function)
3. Additional argument generation (getAdditionalArgs closure → separate function)
4. Command assembly logic (current branches)
5. Graphics option decision (current branches)
6. Command execution (sh call)

**Severity Evidence**:
- **Impact Scope**: High - Affects runUnityBatchMode function in unityHelper.groovy + all dependent Stages
- **Bug Potential**: High - 7 responsibilities mixed in 126 lines may cause unexpected behavior when modified
- **Modification Cost**: Medium - Refactoring needed to separate 4 closures into separate functions

</details>

<details markdown>
<summary>Switch Statements (Stage-specific repeated branches)</summary>

**Definition**: The same switch/if-else branches are repeated in multiple places

| Branch Type | Repetition Count | Location |
|----------|----------|------|
| `[EDIT_MODE, PLAY_MODE].contains(stageName)` | 3 times | lines 209, 220, 303 |
| `stageName == COVERAGE` | 2 times | lines 222, 307 |
| `[WEBGL, RIDER].contains(stageName)` | 2 times | lines 216, 224 |
| `stageName != WEBGL && stageName != PLAY_MODE` | 1 time | line 229 |
| `stageName != PLAY_MODE && stageName != EDIT_MODE` | 1 time | line 233 |

**Solution**: Objectify Stage pattern (Strategy pattern or extract to data structure)

**Severity Evidence**:
- **Impact Scope**: Medium - Same branch pattern exists in 7 locations within the single unityHelper.groovy file
- **Bug Potential**: Medium - Modifying only some branches when adding new Stage causes unexpected behavior
- **Modification Cost**: Medium - Refactoring needed to extract Stage pattern as Strategy objects

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

**4 Domains in unityHelper.groovy**:
- Unity: `getUnityExecutable`, `runUnityStage`, `runUnityBatchMode`, `getCodeCoverageArguments`, `fetCoverageOptionsKeyAndValue`, `buildCoverageOptions`
- Python scripts: `sendTestReport`, `getUnityExecutable`
- Bitbucket: `sendTestReport`
- File System: `loadPathsToExclude`

**Modules Needing Separation**:
- UnityBatchModeHelper (6): `runUnityStage`, `runUnityBatchMode`, `getCodeCoverageArguments`, `fetCoverageOptionsKeyAndValue`, `buildCoverageOptions`, `loadPathsToExclude`
- UnityInstallHelper (1): `getUnityExecutable`
- BitbucketReportHelper (1): `sendTestReport` → consider integration with generalHelper

**→ Related Symptom**: Divergent Change (changed for multiple reasons due to multiple domains: Unity CLI/Python/Bitbucket/Coverage, etc.)

</details>

#### Encapsulation Smells

<details markdown>
<summary>Missing Encapsulation</summary>

**Definition**: Variations are not encapsulated, causing logic to be scattered

**Stage-specific Conditional Branch Scattered Pattern**:

| Branch Location | Stage Branch Logic | Line Numbers | Function/Closure |
|----------|----------------|--------|------------|
| Log path mapping | `Map logConfig = [(EDIT_MODE): [...], ...]` | 139-160 | `setLogFilePathAndUrl` |
| Test arguments | `[EDIT_MODE, PLAY_MODE].contains(stageName)` | 209 | `runUnityBatchMode` |
| Coverage arguments | `[EDIT_MODE, PLAY_MODE, COVERAGE].contains(stageName)` | 212 | `runUnityBatchMode` |
| Additional arguments | `[WEBGL, RIDER].contains(stageName)` | 216 | `runUnityBatchMode` |
| Command assembly | `if ([EDIT_MODE, PLAY_MODE].contains(stageName)) {...}` | 220-226 | `runUnityBatchMode` |
| Graphics options | `(stageName != WEBGL && stageName != PLAY_MODE)` | 229-233 | `runUnityBatchMode` |
| Coverage options | `if ([EDIT_MODE, PLAY_MODE].contains(stageName)) {...}` | 303-310 | `fetCoverageOptionsKeyAndValue` |

**When adding new Stage "Android"**: All 7 locations need modification

**→ Related Symptoms**: Shotgun Surgery (7 simultaneous modifications when Stage added/changed), Switch Statements (same branch pattern repeated)

</details>

#### Hierarchy Smells

<details markdown>
<summary>Missing Hierarchy</summary>

**Definition**: Should use inheritance/polymorphism instead of conditional branches (if/else)

**Evidence of Missing Hierarchy in unityHelper.groovy**:

Stage-specific branches can be replaced with polymorphism (Strategy pattern):

| Current Branch Pattern | Polymorphism Replacement |
|---------------|-----------------|
| `[EDIT_MODE, PLAY_MODE].contains(stageName)` | `stage.requiresTestRun()` |
| `[EDIT_MODE, PLAY_MODE, COVERAGE].contains(stageName)` | `stage.requiresCoverage()` |
| `[WEBGL, RIDER].contains(stageName)` | `stage.getAdditionalArgs()` |
| `stageName != WEBGL && stageName != PLAY_MODE` | `stage.requiresNographics()` |
| `stageName != PLAY_MODE && stageName != EDIT_MODE` | `stage.requiresQuit()` |

**Improvement Direction**: Abstract each Stage as an object to remove branch logic

```groovy
// Before: Conditional branches
if ([EDIT_MODE, PLAY_MODE].contains(stageName)) { ... }

// After: Polymorphism
stage.getTestRunArgs()  // Each Stage object encapsulates its own logic
```

**→ Related Symptom**: Switch Statements (same branch pattern repeated in 7 locations)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details markdown>
<summary>Implicit Cross-module Dependency</summary>

**Definition**: Hidden dependencies cause coupling to external systems without explicit interfaces

| External System | Calling Function | Line Numbers | Implicit Contract Content |
|-------------|----------|--------|-----------------|
| Python script (`create_bitbucket_test_report.py`) | `sendTestReport` | 22 | Argument format (commitHash, reportDir) |
| Python script (`get_unity_version.py`) | `getUnityExecutable` | 37, 41, 44 | 3 commands (executable-path, version, revision) |
| Unity Hub CLI | `getUnityExecutable` | 48-65 | `--headless install`, `install-modules` options |
| Unity batch mode CLI | `runUnityBatchMode` | 203-236 | `-batchmode`, `-projectPath`, `-logFile`, `-testPlatform`, etc. |
| Unity Code Coverage JSON | `loadPathsToExclude` | 321-339 | Settings.json structure (`m_Dictionary.m_DictionaryValues`) |
| Jenkins Pipeline DSL | All functions | - | `env`, `sh()`, `echo()`, `error()`, `fileExists()`, etc. |

**Severity Evidence**:
- **Impact Scope**: Medium - Affects unityHelper.groovy + 2 dependent pipeline files
- **Bug Potential**: High - Runtime errors when external systems (Python/Unity Hub/Unity CLI/JSON structure) change (not detectable at compile time)
- **Modification Cost**: Medium - Refactoring needed such as adding Adapter/Wrapper per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../detailed-analysis.md)
