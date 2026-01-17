[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../README.md)

# groovy/jsHelper.groovy - Software Smells Analysis

> Level-based Classification: Code Smell (Function Level) → Design Smell (Module Level) → Architecture Smell (System Level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | Medium |
| Code | Change Preventers | Shotgun Surgery | Medium |
| Code | Dispensables | Duplicated Code | Medium |
| Code | Bloaters | Primitive Obsession | Low |
| Code | Bloaters | Long Method | Low |
| Design | Abstraction | Multifaceted Abstraction | Medium |
| Design | Abstraction | Missing Abstraction | Medium |
| Design | Encapsulation | Missing Encapsulation | Medium |
| Design | Modularization | Insufficient Modularization | Medium |
| Architecture | Dependency Issues | Implicit Cross-module Dependency | Medium |

---

## 1. Code Smells (Method/Function Level)

> **Source**: Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*

### 1.1 Change Preventers

<details>
<summary>Divergent Change (5 change reasons)</summary>

**Definition**: A single class is frequently changed for several different reasons

| Change Reason | Affected Functions | Example Situation |
|-----------|-------------|----------|
| npm command change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` | npm → yarn change |
| Python script change | `installNpmInTestingDirs` | `npm_audit.py` argument format change |
| Jest configuration change | `runUnitTestsInTestingDirs`, `retrieveReportSummaryDirs` | Report filename change |
| Node version check change | `checkNodeVersion` | nvm introduction |
| Version comparison logic change | `versionCompare` | Prerelease version support |

**Severity Evidence**:
- **Impact Scope**: Medium - 2 pipeline files depend on this file (JsJenkins/Jenkinsfile, JsJenkins/JenkinsfileDeployment)
- **Bug Potential**: Medium - Unexpected behavior may occur when modifying npm-related functions
- **Modification Cost**: Medium - Refactoring needed to separate 5 domains

</details>

<details>
<summary>Shotgun Surgery (up to 3 functions require simultaneous modification)</summary>

**Definition**: A single change requires modifications to multiple classes/functions

| Change Trigger | Affected Functions | Locations Needing Modification |
|-------------|--------------|---------------|
| npm command structure change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` | 3 functions |
| testingDirs format change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` | 3 functions |
| Directory validation change | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs` | 2 functions |

**Severity Evidence**:
- **Impact Scope**: Low - 3 locations within the single jsHelper.groovy file need modification (lines 70, 138, 222)
- **Bug Potential**: High - Missing even one of 3 testingDirs parsing logic locations causes runtime error
- **Modification Cost**: Low - Simple fix by extracting testingDirs parsing to a separate function

</details>

### 1.2 Dispensables

<details>
<summary>Duplicated Code (external + internal duplication)</summary>

**External Duplication (with generalHelper.groovy)**:
- `logMessage()`: Identical code (lines 7-16) - duplicate with generalHelper.groovy lines 35-44

**Internal Duplication Patterns**:

| Duplicate Pattern | Line Numbers | Functions |
|----------|--------|------|
| testingDirs null/empty check | 65-68, 130-134, 214-218 | 3 functions |
| testingDirs parsing | 70, 138, 222 | 3 functions |
| Directory existence check | 73-76, 142-145 | 2 functions |

**Severity Evidence**:
- **Impact Scope**: Medium - Affects 2 files: jsHelper.groovy + generalHelper.groovy
- **Bug Potential**: Medium - Modifying logMessage() in only one place causes unexpected behavior
- **Modification Cost**: Low - Simple fix by extracting to shared module

</details>

### 1.3 Bloaters

<details>
<summary>Primitive Obsession</summary>

**Definition**: Using primitive types instead of objects

| Case | Current State | Problem | Improvement Direction |
|--------|----------|-------|----------|
| testingDirs parameter | `String` (comma-separated) | Parsing logic repeated 3 times | `List<String>` |
| Version string | `String` ("1.0.0") | Complex comparison logic | Version object |

**Severity Evidence**:
- **Impact Scope**: Low - Only affects functions within the single jsHelper.groovy file
- **Bug Potential**: Low - No current operational issues, maintenance inconvenience level
- **Modification Cost**: Low - Simple fix by type change

</details>

<details>
<summary>Long Method</summary>

| Function | Line Count | Responsibility Count | Needs Separation |
|------|------|----------|----------|
| `installNpmInTestingDirs()` | 52 lines (64-116) | 3 (audit, Python script, npm install) | O |
| `versionCompare()` | 44 lines (275-319) | 1 | X |

**Severity Evidence**:
- **Impact Scope**: Low - Only affects `installNpmInTestingDirs` function within the single jsHelper.groovy file
- **Bug Potential**: Medium - 3 responsibilities mixed in 52 lines may cause unexpected behavior
- **Modification Cost**: Low - Simple fix by separating audit, Python call, npm install into separate functions

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

**Definition**: A single abstraction (class/file) expresses multiple concerns (SRP violation)

**5 Domains in jsHelper.groovy**:
- npm/Node: `getPackageJsonVersion`, `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `checkNodeVersion`, `executeLintingInTestingDirs`
- File System: `findTestingDirs`, `retrieveReportSummaryDirs`
- Logging: `logMessage`
- OS/Shell: `runCommandReturnStatus`
- Utility: `versionCompare`

**→ Related Symptom**: Divergent Change (changed for multiple reasons due to multiple domains: npm/file system/version, etc.)

</details>

<details>
<summary>Missing Abstraction</summary>

**Definition**: Concepts are implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Functions |
|-----------------|----------|--------|--------------|
| npm commands | `"npm audit"`, `"npm install"`, `"npm run test"`, `"npm run lint"` hardcoded | 80, 108, 151, 232 | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` |
| Python script path | `"${WORKSPACE}/python/npm_audit.py"` hardcoded | 94 | `installNpmInTestingDirs` |
| Filename constants | `"package.json"`, `"audit-report.json"` hardcoded | 30, 80, 88 | `findTestingDirs`, `installNpmInTestingDirs` |

**→ Related Symptom**: Primitive Obsession (concepts expressed with primitive types/strings)

</details>

#### Encapsulation Smells

<details>
<summary>Missing Encapsulation</summary>

**Definition**: Variations are not encapsulated, causing logic to be scattered

| Variation Needing Encapsulation | Current State | Line Numbers | Affected Functions |
|-----------------|----------|--------|--------------|
| Directory existence check | `new File(dirPath); if (!dir.exists() \|\| !dir.isDirectory())` | 73-76, 142-145 | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs` |
| testingDirs parsing | `testingDirs.split(',') as List<String>` | 70, 138, 222 | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` |
| null/empty check | `if (testingDirs == null \|\| testingDirs.isEmpty())` | 65-68, 130-134, 214-218 | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` |

**→ Related Symptoms**:
- Shotgun Surgery (not encapsulated → variations scattered → simultaneous modification required)
- Duplicated Code (same patterns repeated without encapsulation)

</details>

#### Modularization Smells

<details>
<summary>Insufficient Modularization</summary>

**Definition**: A module (class/file) is too large or complex and should be further decomposed

**Evidence of Insufficient Modularization in jsHelper.groovy**:

| Metric | Value | Standard |
|------|-----|------|
| File size | 356 lines | Generally 200-300 lines recommended |
| Function count | 10 | 5-7 recommended based on single responsibility |
| Domain count | 5 | Single Responsibility Principle violation |
| Actor count | 3 | Multiple teams depend on it |

**Modules Needing Separation** (5 domains):
- NpmHelper (5): `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs`, `checkNodeVersion`, `getPackageJsonVersion`
- FileSystemHelper (2): `findTestingDirs`, `retrieveReportSummaryDirs`
- VersionHelper (1): `versionCompare`
- OsHelper (1): `runCommandReturnStatus`
- LoggingHelper: `logMessage` → duplicate with generalHelper, needs separation to shared module

**Severity**: Medium - Smaller scale than generalHelper but same pattern of insufficient modularization

**→ Related Symptom**: Long Method (lack of modularization causes `installNpmInTestingDirs` to be 52 lines)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details>
<summary>Implicit Cross-module Dependency</summary>

**Definition**: Hidden dependencies cause coupling to external systems without explicit interfaces

| External System | Calling Function | Line Numbers | Implicit Contract Content |
|-------------|----------|--------|-----------------|
| Python script | `installNpmInTestingDirs` | 94 | `npm_audit.py` path + argument format (COMMIT_HASH, audit-report.json) |
| Node.js CLI | `getPackageJsonVersion`, `checkNodeVersion` | 50, 174-176 | `node -p`, `node -v`, `npm -v` output format |
| npm CLI | `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `executeLintingInTestingDirs` | 80, 108, 151, 232 | Command options + exit code meaning |
| Linux find command | `retrieveReportSummaryDirs` | 339, 345 | `find -type f -name` output format |
| Jenkins Pipeline DSL | All functions | - | `WORKSPACE`, `COMMIT_HASH`, `sh()`, `echo()`, `isUnix()`, etc. |

**Severity Evidence**:
- **Impact Scope**: Medium - Affects jsHelper.groovy + 2 dependent pipeline files
- **Bug Potential**: High - Runtime errors when external systems (Python/Node/npm/Linux find) change
- **Modification Cost**: Medium - Refactoring needed such as adding Adapter/Wrapper per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../README.md)
