[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# JsJenkins/JenkinsfileDeployment - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Key Evidence |
|---------|:------:|----------|
| Rigidity | **High** | Shotgun Surgery (4 locations to modify when adding new deployment target) |
| Fragility | **High** | 5 domains mixed, 10 implicit dependencies |
| Immobility | **High** | 452 lines/8 Stages, entire JS CD orchestration |
| Viscosity | **High** | Missing Encapsulation → copying Server/Client deployment is easier |
| Needless Complexity | **Low** | Not applicable |
| Needless Repetition | **High** | DRY violation (Server/Client deployment pattern 150 lines repeated) |
| Opacity | **High** | Complex nesting (Server/Client Deploy), duplicate nested script |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 4 locations to modify when adding new deployment target | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 5 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 10 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) + [Insufficient Modularization](software-smells-analysis.md#23-modularization-smells) | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) Server/Client deployment pattern not encapsulated | Design Smells |
| Needless Complexity | Not applicable | - |
| Needless Repetition | [Duplicated Code](software-smells-analysis.md#12-dispensables) Server/Client pattern 2 times | Code Smells |
| Opacity | Direct code review | Code Review |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes in other places
>
> **Symptom**: "Thought it was a simple change but it was much more complex"

### Inference Evidence: Shotgun Surgery

**Locations needing modification when adding new deployment target (e.g., 'admin')**:

| Location | Modification Content |
|------|----------|
| Parameter block | Add `params.ADMIN_IMAGE_NAME`, `params.ADMIN_SOURCE_FOLDER`, `params.ADMIN_CONTAINER_APP_NAME` |
| Check Build and Deploy Condition | Add admin version check (20+ lines) |
| Environment variables | Add `env.ADMIN_SKIP_BUILD` |
| New Stage | Add `Admin-side Build and Deploy` stage (copy 75 lines) |

**Conclusion**: 4 locations to modify + 75 lines copy required when adding new deployment target → **High Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "Why did that break when I touched this?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**5 domains mixed in one file**:
- Jenkins environment config, Git/Bitbucket, npm/Node, Azure/Docker, SonarQube

**10 implicit dependencies**:
- `generalHelper.groovy`, `jsHelper.groovy`
- Docker CLI, Azure CLI (`az acr`, `az containerapp`)
- SonarQube Scanner, SonarQube API
- Jenkins params (multiple)
- `AZURE_CONTAINER_REGISTRY`, `AZURE_RESOURCE_GROUP` environment variables
- Jenkins Pipeline DSL

**Potential Fragility scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| Docker build option change | Server Deploy | Client Deploy also affected (2 locations) |
| Azure CLI command change | containerapp update | Both Server/Client need modification |
| Environment variable name change | Affected Stage | Reference failure in multiple locations |

**Conclusion**: 5 domains mixed + 10 implicit dependencies → **High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts and reuse in other systems/modules
>
> **Symptom**: "Too many dependencies come along when trying to separate"

### Inference Evidence: Multifaceted Abstraction + Insufficient Modularization

**Server/Client Build and Deploy stages' excessive size**:
- Server: 75 lines (lines 242-317)
- Client: 73 lines (lines 319-392)
- Both almost identical

**Problems when attempting separation**:

| Extraction Target | Dependencies That Follow |
|----------|----------------|
| CleanupStage | generalUtil, jsUtil, mainBranches |
| PrepareStage | Git commands, generalUtil, jsUtil, env variables |
| DeployStage | jsUtil, Docker CLI, Azure CLI, params, env variables |
| AnalysisStage | SonarQube Scanner, SonarQube API, generalUtil |

**Conclusion**: Entire JS CD in single file + Server/Client 150 lines duplicated → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right way (preserving design) is harder than the wrong way (hacking)
>
> **Symptom**: "It takes too long to do it properly, so let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current state (Missing Encapsulation)**:
- Server/Client deployment pattern repeated 2 times (75 lines each)
- Check Build and Deploy Condition version check repeated 2 times

**Right way vs Hacking**:

| Situation | Right Way | Hack | Tendency |
|------|------------|------|----------|
| Add new deployment target | Create deployment function and call | Copy-paste 75 lines | Copy (faster) |
| Change Docker options | Modify deployment function | Manually modify 2 places | Manual (faster) |

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

**Server/Client Build and Deploy pattern repeated 2 times** (150 lines duplicated):

| Target | Line Numbers | Pattern |
|------|--------|------|
| Server | 242-317 | `getPackageJsonVersion` + `docker build` + `docker push` + `az containerapp update` + `docker rmi` |
| Client | 319-392 | Same pattern, only variable names differ |

**Check Build and Deploy Condition also repeated 2 times** (lines 220-232 vs 234-246)

**Improvement direction**:
```groovy
def deployToAzure(targetConfig) {
    String imageName = "${env.AZURE_CONTAINER_REGISTRY}/${targetConfig.imageName}"
    String version = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${targetConfig.sourceFolder}")
    sh "docker build -t ${imageName}:${version} ..."
    sh "docker push ${imageName}:${version}"
    sh "az containerapp update --name ${targetConfig.containerApp} --image ${imageName}:${version}"
    sh "docker rmi ${imageName}:${version}"
}
```

**Conclusion**: Server/Client pattern 150 lines duplicated → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is hard to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Code Review Results

| Type | Location | Problem | Description |
|------|------|------|------|
| **Complex nesting** | Lines 242-317, 319-392 | Server/Client Deploy | 75 lines each of similar patterns |
| **Duplicate nested script** | Lines 96-100 | `script { script { ... } }` | Unnecessary double script block |

### Severity Classification

**Medium (maintenance difficulty)**:
- Complex nesting: Server/Client Deploy (lines 242-317, 319-392) - 75 lines each of similar patterns
- Duplicate nested script: `script { script { ... } }` (lines 96-100) - Unnecessary double block

**Conclusion**: Complex nesting + duplicate nested script → **High Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
