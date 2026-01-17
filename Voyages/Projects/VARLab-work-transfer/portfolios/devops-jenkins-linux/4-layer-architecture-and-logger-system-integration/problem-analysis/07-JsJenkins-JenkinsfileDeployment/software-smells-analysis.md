[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../README.md)

# JsJenkins/JenkinsfileDeployment - Software Smells Analysis

> Level-based classification: Code Smell (function level) → Design Smell (module level) → Architecture Smell (system level)

---

## Summary

| Level | Category | Smell Type | Severity |
|-------|----------|------------|:------:|
| Code | Change Preventers | Divergent Change | High |
| Code | Change Preventers | Shotgun Surgery | High |
| Code | Dispensables | Duplicated Code | High |
| Code | Bloaters | Long Method | High |
| Code | Bloaters | Primitive Obsession | Low |
| Implementation | Logic/Flow | Magic String | Medium |
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

<details>
<summary>Divergent Change (5 change reasons)</summary>

**Definition**: A single class/file is frequently changed for multiple different reasons

| Change Reason | Affected Area | Line Numbers | Example Scenario |
|-----------|-------------|--------|----------|
| Jenkins environment config change | `Delete Merged Branch` | 55-59 | Script loading path, JSON parsing logic change |
| Git workflow change | `Prepare WORKSPACE` | 100-112 | clone/checkout/reset/pull policy change |
| npm/Node config change | `Prepare WORKSPACE`, `Linting`, `Unit Testing` | 118-125, 150-180, 182-209 | Node version check, npm install, test config change |
| Docker/Azure config change | `Check Build and Deploy`, `Server/Client Deploy` | 212-392 | Docker build options, Azure CLI command change |
| SonarQube config change | `Static Analysis` | 394-422 | Scanner options, Quality Gate condition change |

**Severity Evidence**:
- **Impact Range**: High - Single JenkinsfileDeployment handles entire JS CD pipeline logic
- **Bug Potential**: Medium - Modifying one domain may cause unexpected impact on other domains
- **Modification Cost**: Medium - Separating 5 domains requires shared library or separate script extraction

</details>

<details>
<summary>Shotgun Surgery (4 locations to modify when adding new deployment target)</summary>

**Definition**: A single change requires modification of multiple classes/functions

**Locations needing modification when adding new deployment target (e.g., 'admin')**:

| Line Number | Modification Content | Current Code |
|--------|----------|----------|
| 212-239 | Add admin check in `Check Build and Deploy Condition` | Server/Client version check |
| Parameter block | Add `params.ADMIN_IMAGE_NAME`, `params.ADMIN_SOURCE_FOLDER`, `params.ADMIN_CONTAINER_APP_NAME` | Server/Client params |
| After 319-392 | Add new `Admin-side Build and Deploy` stage (copy 75 lines) | Server/Client Deploy |
| Environment variables | Add `env.ADMIN_SKIP_BUILD` | `env.SERVER_SKIP_BUILD`, `env.CLIENT_SKIP_BUILD` |

**Change Scenario**: When adding new deployment target `'admin'`:
- Add 3 parameters
- Add 20+ lines to Check Build and Deploy Condition
- Copy 75 lines for Admin-side Build and Deploy stage
- Missing even one of 4 locations causes new target deployment failure

**Severity Evidence**:
- **Impact Range**: High - 4+ locations across entire pipeline (450 lines) need modification
- **Bug Potential**: High - Missing even one of 4 locations causes deployment omission or runtime error
- **Modification Cost**: Medium - Refactoring needed to extract deployment targets into data structure and process with loops

</details>

### 1.2 Dispensables

<details>
<summary>Duplicated Code (Server/Client deployment pattern 150 lines repeated)</summary>

**Definition**: Same code pattern repeated in multiple places

**Server vs Client Build and Deploy pattern repetition** (lines 242-317 vs 319-392):

```groovy
// Lines 242-317 (Server-side Build and Deploy)
stage('Server-side Build and Deploy') {
    when { expression { env.SERVER_SKIP_BUILD != 'true' } }
    steps {
        script {
            String serverImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.SERVER_IMAGE_NAME}"
            String serverVersion = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}")

            sh """
                docker build -t ${serverImageName}:${serverVersion} \\
                -f ${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}/Dockerfile \\
                ${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}
            """
            sh "docker push ${serverImageName}:${serverVersion}"
            sh """
                az containerapp update --name ${params.SERVER_CONTAINER_APP_NAME} \\
                --resource-group ${env.AZURE_RESOURCE_GROUP} \\
                --image ${serverImageName}:${serverVersion}
            """
            sh "docker rmi ${serverImageName}:${serverVersion}"
        }
    }
}

// Lines 319-392 (Client-side Build and Deploy) - Same pattern, only variable names differ
stage('Client-side Build and Deploy') {
    // ... same structure, uses CLIENT_* variables
}
```

**→ When adding new deployment target**: Copy-paste of same pattern required (75+ lines of duplication)

**Check Build and Deploy Condition also repeated 2 times** (lines 220-232 vs 234-246)

**Severity Evidence**:
- **Impact Range**: High - 2 locations need simultaneous modification when changing deployment logic
- **Bug Potential**: High - Inconsistency if only one of 2 locations modified when Docker command options/Azure CLI options change
- **Modification Cost**: High - Major refactoring needed to extract deployment logic into function and parameterize

</details>

### 1.3 Bloaters

<details>
<summary>Long Method (Server/Client Deploy stages 75 lines each)</summary>

**Definition**: A single method/area has too many responsibilities

| Stage | Lines | Responsibility Count | Detailed Responsibilities |
|-------|------|----------|----------|
| `Server-side Build and Deploy` | 75 lines | 5 | Version lookup, Docker build, Docker push, Azure update, image cleanup |
| `Client-side Build and Deploy` | 73 lines | 5 | Same |
| `Check Build and Deploy Condition` | 27 lines | 2 (× 2 targets) | Version lookup, version comparison |

**Responsibilities needing separation**:
1. Version lookup: `jsUtil.getPackageJsonVersion()`
2. Docker build: `docker build`
3. Docker push: `docker push`
4. Azure update: `az containerapp update`
5. Image cleanup: `docker rmi`

**Severity Evidence**:
- **Impact Range**: High - Affects entire Server/Client Deploy stages
- **Bug Potential**: Medium - Unexpected behavior possible when modifying 75 lines with 5 mixed responsibilities
- **Modification Cost**: Medium - Refactoring needed to separate deployment logic into separate functions

</details>

<details>
<summary>Primitive Obsession</summary>

**Definition**: Primitive types (strings) used instead of objects/constants

| Case | Current State | Line Numbers | Problem |
|--------|----------|--------|-------|
| Deployment target config | `params.SERVER_*`, `params.CLIENT_*` scattered | Multiple | Deployment target info scattered across parameters |
| Azure resource group | `env.AZURE_RESOURCE_GROUP` string | 302, 377 | Hardcoded as environment variable |
| Directory name | `'linting_results'` string | 155 | Same name hardcoded across different Jenkinsfiles |
| SonarQube URL | `'http://localhost:9000/sonarqube'` string | 404 | Hardcoded URL |
| Main branch list | `['main', 'master']` array | 3 | Hardcoded branch names |

**Severity Evidence**:
- **Impact Range**: Low - Affects only functions within single JenkinsfileDeployment file
- **Bug Potential**: Low - No issues with current behavior, just maintenance inconvenience
- **Modification Cost**: Low - Simple fix by extracting to constants/objects

</details>

### 1.4 Implementation Smells

<details>
<summary>Magic String</summary>

**Definition**: Unexplained string literals hardcoded in code

| Line Numbers | Magic String | Problem |
|--------|-------------|-------|
| 287-291, 362-366 | `docker build -t ... -f ... Dockerfile` | Docker build options hardcoded |
| 295-298, 370-373 | `docker push` | Docker push command |
| 302-307, 377-382 | `az containerapp update --name ... --resource-group ... --image ...` | Azure CLI options hardcoded |
| 404 | `'http://localhost:9000/sonarqube'` | SonarQube URL hardcoded |

**Severity Evidence**:
- **Impact Range**: Medium - Affects Server/Client Deploy, Static Analysis stages
- **Bug Potential**: Medium - Need to find and modify hardcoded values when CLI options change
- **Modification Cost**: Low - Simple fix by extracting to constants or functions

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

**Definition**: A single abstraction (class/file) represents multiple concerns (SRP violation)

**JsJenkins/JenkinsfileDeployment's 5 domains**:
- Jenkins environment config: Script loading, JSON parsing, folder name extraction
- Git/Bitbucket: Branch cleanup, clone, checkout, reset, pull, status sending
- npm/Node: Node version check, npm install, Linting, Unit Testing
- Azure/Docker: Docker build/push, Azure Container Registry, Container Apps update
- SonarQube: Code analysis, Quality Gate check

**Modules needing separation**:
- `CleanupStage.groovy`: Branch cleanup, web server cleanup
- `PrepareStage.groovy`: Git workflow, npm config
- `TestStage.groovy`: Linting, Unit Testing
- `DeployStage.groovy`: Docker build/push, Azure Container Apps (remove Server/Client repetition)
- `AnalysisStage.groovy`: SonarQube scan, Quality Gate

**→ Related symptom**: Divergent Change (single file changes for 5 different reasons)

</details>

<details>
<summary>Missing Abstraction</summary>

**Definition**: Concepts implemented with primitive types or strings instead of dedicated classes/constants

| Concept Needing Abstraction | Current State | Line Numbers | Affected Area |
|-----------------|----------|--------|--------------|
| Azure Container Registry | `env.AZURE_CONTAINER_REGISTRY`, `env.AZURE_CONTAINER_REGISTRY_NAME` scattered | 221, 223 | Check Build, Deploy |
| Docker image name | `params.SERVER_IMAGE_NAME`, `params.CLIENT_IMAGE_NAME` hardcoded | 268, 343 | Server/Client Deploy |
| Container App name | `params.SERVER_CONTAINER_APP_NAME`, `params.CLIENT_CONTAINER_APP_NAME` | 302, 377 | Server/Client Deploy |
| Main branch list | `['main', 'master']` hardcoded | 3 | Delete Merged Branch |
| SonarQube URL | `'http://localhost:9000/sonarqube'` hardcoded | 404 | Static Analysis |
| Directory name | `'linting_results'` | 155 | Linting |

**Deployment target abstraction needed**:
```groovy
// Before: Hardcoded per target
String serverImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.SERVER_IMAGE_NAME}"
String clientImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.CLIENT_IMAGE_NAME}"

// After: Deployment target objectified
def DEPLOY_TARGETS = [
    server: [
        imageName: params.SERVER_IMAGE_NAME,
        sourceFolder: params.SERVER_SOURCE_FOLDER,
        containerApp: params.SERVER_CONTAINER_APP_NAME
    ],
    client: [
        imageName: params.CLIENT_IMAGE_NAME,
        sourceFolder: params.CLIENT_SOURCE_FOLDER,
        containerApp: params.CLIENT_CONTAINER_APP_NAME
    ]
]
```

**→ Related symptoms**:
- Primitive Obsession (deployment target config expressed as primitive type strings)
- Shotgun Surgery (4 locations need modification when adding deployment target)

</details>

<details>
<summary>Imperative Abstraction</summary>

**Definition**: Abstraction operations written procedurally rather than object-oriented

**JsJenkins/JenkinsfileDeployment's Imperative Abstraction evidence**:

Procedural script structure due to Jenkins Pipeline DSL characteristics:
- `stage()` blocks execute sequentially
- Connected to external CLI tools via implicit contracts
- Called via `sh` commands without explicit interfaces

| External System | Call Method | Implicit Contract |
|------------|----------|------------|
| Docker CLI | `sh "docker build ..."` | Dockerfile path, tag format |
| Azure CLI | `sh "az acr repository show-tags ..."` | ACR name, repository name |
| Azure CLI | `sh "az containerapp update ..."` | Container App name, resource group, image format |
| `generalHelper.groovy` | `load()` + function call | 7+ function signatures |
| `jsHelper.groovy` | `load()` + function call | 8 function signatures |
| SonarQube Scanner | `sh "${scannerHome}/bin/sonar-scanner ..."` | CLI option format |

**→ Related symptom**: Implicit Cross-module Dependency (implicit contracts with 10 external systems)

</details>

#### Encapsulation Smells

<details>
<summary>Missing Encapsulation</summary>

**Definition**: Variations not encapsulated, causing logic to be scattered

**Server/Client deployment pattern repetition** (lines 242-317 vs 319-392):

| Location | Target | Pattern (75 lines) |
|------|------|------------|
| Lines 242-317 | Server | `getPackageJsonVersion` + `docker build` + `docker push` + `az containerapp update` + `docker rmi` |
| Lines 319-392 | Client | Same pattern, only variable names differ |

**Encapsulation approach**: Extract to deployment function

```groovy
// Before: Repeated 2 times (75 lines × 2 = 150 lines)
stage('Server-side Build and Deploy') {
    String serverImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.SERVER_IMAGE_NAME}"
    String serverVersion = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}")
    sh "docker build -t ${serverImageName}:${serverVersion} ..."
    sh "docker push ${serverImageName}:${serverVersion}"
    sh "az containerapp update --name ${params.SERVER_CONTAINER_APP_NAME} --image ${serverImageName}:${serverVersion}"
    sh "docker rmi ${serverImageName}:${serverVersion}"
}
// Client also repeats same pattern...

// After: Encapsulated in function
def deployToAzure(targetConfig) {
    String imageName = "${env.AZURE_CONTAINER_REGISTRY}/${targetConfig.imageName}"
    String version = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${targetConfig.sourceFolder}")
    sh "docker build -t ${imageName}:${version} -f ${PROJECT_DIR}/${targetConfig.sourceFolder}/Dockerfile ${PROJECT_DIR}/${targetConfig.sourceFolder}"
    sh "docker push ${imageName}:${version}"
    sh "az containerapp update --name ${targetConfig.containerApp} --resource-group ${env.AZURE_RESOURCE_GROUP} --image ${imageName}:${version}"
    sh "docker rmi ${imageName}:${version}"
}
deployToAzure(DEPLOY_TARGETS.server)
deployToAzure(DEPLOY_TARGETS.client)
```

**Check Build and Deploy Condition also repeated 2 times** (lines 220-232 vs 234-246)

**→ Related symptoms**:
- Duplicated Code (Server/Client deployment pattern 150 lines duplicated)
- Shotgun Surgery (2 locations need simultaneous modification when Docker command options change)

</details>

#### Modularization Smells

<details>
<summary>Insufficient Modularization</summary>

**Definition**: Abstraction is too large or complex (God Class/Method)

**Server/Client Build and Deploy stages' excessive duplication**:

| Stage | Lines | Responsibility Count | Detailed Responsibilities |
|-------|------|----------|----------|
| `Server-side Build and Deploy` | 75 lines (242-317) | 5 | Version lookup, Docker build, Docker push, Azure update, image cleanup |
| `Client-side Build and Deploy` | 73 lines (319-392) | 5 | Same |

**Separation approach**:
```groovy
// Before: 150 lines duplicated
stage('Server-side Build and Deploy') { /* 75 lines */ }
stage('Client-side Build and Deploy') { /* 73 lines, same pattern */ }

// After: Common function + parameterization
def deployTarget(targetName, imageName, sourceFolder, containerApp) { /* common logic */ }

stage('Build and Deploy') {
    parallel {
        stage('Server') { deployTarget('server', params.SERVER_IMAGE_NAME, params.SERVER_SOURCE_FOLDER, params.SERVER_CONTAINER_APP_NAME) }
        stage('Client') { deployTarget('client', params.CLIENT_IMAGE_NAME, params.CLIENT_SOURCE_FOLDER, params.CLIENT_CONTAINER_APP_NAME) }
    }
}
```

**→ Related symptoms**:
- Duplicated Code (150 lines duplicated)
- Long Method (each stage is 75 lines)

</details>

---

## 3. Architecture Smells (System Level)

> **Source**: Garcia et al. (2009), Lippert & Roock (2006), Sharma & Spinellis (2018)

### 3.1 Dependency Issues

<details>
<summary>Implicit Cross-module Dependency</summary>

**Definition**: Hidden dependencies causing coupling to external systems without explicit interfaces

| External System | Line Numbers | Implicit Contract Content |
|-------------|--------|-----------------|
| `generalHelper.groovy` | 55 | `load()` success + function signatures (parseJson, getFullCommitHash, cleanUpPRBranch, sendBuildStatus, cleanMergedBranchFromWebServer, etc.) |
| `jsHelper.groovy` | 56 | `load()` success + function signatures (checkNodeVersion, findTestingDirs, installNpmInTestingDirs, executeLintingInTestingDirs, runUnitTestsInTestingDirs, getPackageJsonVersion, versionCompare) |
| Docker CLI | 287-298, 311, 362-373, 386 | `docker build`, `docker push`, `docker rmi` command format + Dockerfile location |
| Azure CLI | 222-225, 302-307, 377-382 | `az acr repository show-tags`, `az containerapp update` command format + environment variable existence (`AZURE_CONTAINER_REGISTRY`, `AZURE_RESOURCE_GROUP`) |
| SonarQube Scanner | 399-410 | Scanner path, CLI option format |
| SonarQube API | 414 | `checkQualityGateStatus` return value structure |
| Jenkins Pipeline Params | Multiple | `params.SERVER_*`, `params.CLIENT_*` existence |
| Jenkins Pipeline DSL | Entire file | `env`, `sh()`, `dir()`, `echo()`, `error()`, `fileExists()`, `tool()`, `withSonarQubeEnv()`, `withCredentials()`, `parallel()`, `when()`, etc. |

**Severity Evidence**:
- **Impact Range**: High - JenkinsfileDeployment coupled to 10 external systems/tools
- **Bug Potential**: High - Runtime errors occur when Docker/Azure CLI options change, environment variables missing (not detectable at compile time)
- **Modification Cost**: Medium - Wrapper functions or interface documentation needed per external system

</details>

---

[← SRP Analysis](./srp-violation-analysis.md) | [← Overview](../README.md)
