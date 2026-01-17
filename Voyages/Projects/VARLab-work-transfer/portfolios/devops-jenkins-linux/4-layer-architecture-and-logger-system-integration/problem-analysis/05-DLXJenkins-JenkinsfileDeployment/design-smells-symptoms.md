[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# DLXJenkins/JenkinsfileDeployment - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Key Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (4 Unity Stages + 2 deployment servers) |
| Fragility | **High** | 7 domains mixed, 9 implicit dependencies |
| Immobility | **High** | 265 lines/7 Stages, entire CD pipeline orchestration |
| Viscosity | **High** | Missing Encapsulation → copying deployment pattern/stageName is easier |
| Needless Complexity | **Low** | Not applicable |
| Needless Repetition | **High** | DRY violation (deployment pattern 2 times + stageName 4 times repeated) |
| Opacity | **Medium** | Direct environment variable access |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 4 Unity Stages + 2 deployment servers | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 7 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 9 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) entire CD pipeline orchestration | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) deployment pattern + Unity Stage not encapsulated | Design Smells |
| Needless Complexity | Not applicable | - |
| Needless Repetition | [Duplicated Code](software-smells-analysis.md#12-dispensables) deployment pattern 2 times + stageName 4 times | Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes in other places
>
> **Symptom**: "Thought it was a simple change but it was much more complex"

### Inference Evidence: Shotgun Surgery

**Unity Stage name hardcoded locations** (4 places):

| Line Number | Stage Name | Error Message |
|--------|-----------|------------|
| 120-122 | `'Rider'` | `'Synchronizing Unity and Rider IDE solution files failed'` |
| 164-166 | `'EditMode'` | `'EditMode tests failed'` |
| 178-180 | `'PlayMode'` | `'PlayMode tests failed'` |
| 193-195 | `'Webgl'` | `'WebGL Build failed'` |

**Deployment server pattern repetition** (2 places):
- Lines 205-209: LTI server (SSH mkdir + SCP + SSH UpdateBuildURL.sh)
- Lines 218-233: eConestoga server (same pattern)

**Conclusion**: 4 places for Stage name changes + 2 places for deployment command changes required → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "Why did that break when I touched this?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**7 domains mixed in one file**:
- Jenkins environment config, Git workflow, Bitbucket status, Unity config, Linting, Unity build, Deployment (SSH/SCP)

**9 implicit dependencies**:
- `Bash/Linting.bash`, `Bash/.editorconfig`, `Builder.cs`
- `ShellScripts/UpdateBuildURL.sh` (remote server)
- `generalHelper.groovy`, `unityHelper.groovy`
- SSH/SCP commands, `env.DLX_LIST` environment variable
- Jenkins Pipeline DSL

**Potential Fragility scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| SSH key path change | Deploy Build | Both LTI + eConestoga affected |
| Remote server UpdateBuildURL.sh change | Deploy Build | Deployment failure (detected only at runtime) |
| Git checkout order change | Prepare WORKSPACE | Unity project state inconsistency |

**Conclusion**: 7 domains mixed + 9 implicit dependencies → **High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts and reuse in other systems/modules
>
> **Symptom**: "Too many dependencies come along when trying to separate"

### Inference Evidence: Multifaceted Abstraction

**Entire CD pipeline orchestration**:
- Single 265-line Jenkinsfile handles entire DLX CD flow
- Unlike CI, Git commands directly included (no Helper usage)

**Problems when attempting separation**:

| Extraction Target | Dependencies That Follow |
|----------|----------------|
| CleanupStage | generalUtil loading, branch check, web server cleanup |
| PrepareStage | Git commands (clone/checkout/reset/pull), Bitbucket status, Unity config |
| DeployStage | SSH/SCP pattern, server URL, UpdateBuildURL.sh path |

**Conclusion**: Entire CD pipeline in single file + Git commands directly included → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right way (preserving design) is harder than the wrong way (hacking)
>
> **Symptom**: "It takes too long to do it properly, so let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current state (Missing Encapsulation)**:
- stageName/errorMsg pattern repeated 4 times
- SSH/SCP deployment pattern repeated 2 times (LTI + eConestoga)

**Right way vs Hacking**:

| Situation | Right Way | Hack | Tendency |
|------|------------|------|----------|
| Add new deployment server | Create deployment function and call | Copy-paste existing SSH/SCP pattern | Copy (faster) |
| Change SSH options | Modify deployment function | Manually modify 2 places | Manual (faster) |

**Conclusion**: Lack of encapsulation makes "copying is easier" structure → **High Viscosity**

---

## 5. Needless Complexity

> **Definition**: Excessive design for features not currently needed
>
> **Symptom**: YAGNI violation, "might need it later"

### Inference Evidence

**Dead Code or excessive design**: Not applicable

**Conclusion**: **Low Needless Complexity**

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "similar code in multiple places"

### Inference Evidence: Duplicated Code

**1. Deployment server pattern repeated 2 times** (LTI vs eConestoga):

| Server | Line Numbers | Pattern |
|------|--------|------|
| LTI | 205-209 | `ssh mkdir` + `scp` + `ssh UpdateBuildURL.sh` |
| eConestoga | 218-233 | Same pattern, only URL differs |

**2. stageName/errorMassage pattern repeated 4 times** (3 lines × 4 = 12 lines duplicated)

**Improvement direction**:
```groovy
def deployToServer(serverUrl, folderName, sourcePath) {
    sh "ssh -i ${env.SSH_KEY} ${serverUrl} \"sudo mkdir -p /var/www/html/${folderName}...\""
    sh "scp -i ${env.SSH_KEY} -rp ${sourcePath}/* ${serverUrl}:/var/www/html/${folderName}"
    sh "ssh -i ${env.SSH_KEY} ${serverUrl} 'bash ~/ShellScripts/UpdateBuildURL.sh /var/www/html/${folderName}'"
}
```

**Conclusion**: Deployment pattern 2 times + stageName 4 times repeated → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is hard to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Direct environment variable access** | Lines 205-231 | `env.SSH_KEY`, `env.DLX_WEB_HOST_URL` | Environment variable names not documented |


### Severity Classification

**Medium (maintenance difficulty)**:
- Direct environment variable access: `env.SSH_KEY`, `env.DLX_WEB_HOST_URL` (lines 205-231) - Environment variable names not documented

**Conclusion**: Direct environment variable access → **Medium Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
