# JS CD Pipeline Sequence Diagrams

> **Analysis Target**: `JsJenkins/JenkinsfileDeployment` (JavaScript CD Pipeline)
>
> **Trigger**: Runs when PR is `MERGED`

---

## Domain Summary by Function

| Domain | Function | Used Stage | Helper Location |
|--------|----------|------------|-----------------|
| **Git Management** | clone, checkout, reset, pull | Prepare WORKSPACE, Post | generalHelper + Jenkinsfile direct |
| **Bitbucket API** | send build status, get commit hash | Prepare WORKSPACE, Post | generalHelper + Python |
| **Node.js (npm)** | version check, npm install, linting, tests, version compare | Install Dependencies, Linting, Unit Testing, Server/Client Deploy | jsHelper |
| **SonarQube** | static code analysis, Quality Gate check | Static Analysis | generalHelper + sonar-scanner |
| **Docker** | build container, push image, cleanup | Check Condition, Server/Client Deploy | Jenkinsfile direct |
| **Azure** | ACR login, update Container App, get version | Check Condition, Server/Client Deploy | Jenkinsfile direct (az CLI) |
| **Environment Setup** | parseJson, findTestingDirs, mainBranches check | Delete Merged Branch, Prepare WORKSPACE | generalHelper + jsHelper |
| **PR Cleanup** | find & rm -rf PR directories | Delete Merged Branch | Jenkinsfile direct |

### Domain Mapping by Stage

| Stage | Git | Bitbucket | Node.js | SonarQube | Docker | Azure | Environment Setup | PR Cleanup |
|-------|:---:|:---------:|:-------:|:---------:|:------:|:-----:|:-----------------:|:----------:|
| Delete Merged Branch | | | | | | | ✓ | ✓ |
| Prepare WORKSPACE | ✓ | ✓ | | | | | ✓ | |
| Install Dependencies | | | ✓ | | | | | |
| Linting | | | ✓ | | | | | |
| Unit Testing | | | ✓ | | | | | |
| Static Analysis | | | | ✓ | | | | |
| Check Build Condition | | | | | ✓ | ✓ | | |
| Server Build & Deploy | | | ✓ | | ✓ | ✓ | | |
| Client Build & Deploy | | | ✓ | | ✓ | ✓ | | |
| Post | ✓ | ✓ | | | | | | |

### JS CI vs JS CD Comparison

| Item | JS CI | JS CD |
|------|-------|-------|
| Trigger | `OPEN` (PR created) | `MERGED` (PR merged) |
| `CI_PIPELINE` | `true` | `false` |
| Coverage Report Send | Yes | No |
| Web Server Deploy | Yes (lcov-report) | No |
| Docker Build | No | Yes |
| Azure Deploy | No | Yes (Container App) |
| Delete Merged Branch | No | Yes |

### DLX CD vs JS CD Comparison

| Item | DLX CD | JS CD |
|------|--------|-------|
| Deploy Target | LTI Web Server, eConestoga | Azure Container App |
| Build Tool | Unity (WebGL) | Docker |
| Deploy Method | SSH/SCP | Docker push + az containerapp |
| Version Management | None | package.json version compare |
| Conditional Deploy | DLX_PROJECT_LIST | Version compare result |

---

## Overall Pipeline Overview

```mermaid
flowchart LR
    subgraph Stages
        S1[Delete Merged Branch]
        S2[Prepare WORKSPACE]
        S3[Install Dependencies]
        S4[Linting]
        S5[Unit Testing]
        S6[Static Analysis]
        S7[Check Build Condition]
        S8[Server Build & Deploy]
        S9[Client Build & Deploy]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9

    S9 --> Post[Post<br/>always/success/failure/aborted/unstable]
```

---

## Stage 1: Delete Merged Branch

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant JSH as jsHelper
    participant Shell as Shell (find/rm)

    Note over JF: Stage: Delete Merged Branch

    JF->>JF: mainBranches.contains(DESTINATION_BRANCH)
    Note over JF: Abort if not merging to main

    JF->>GH: load("generalHelper.groovy")
    JF->>JSH: load("jsHelper.groovy")

    JF->>GH: parseJson()
    GH-->>JF: buildResults, stageResults

    JF->>Shell: find ../ -type d -name "{PR_BRANCH}"
    Shell-->>JF: branch_path

    alt branch_path exists
        JF->>Shell: rm -rf {branch_path}
        JF->>Shell: rm -rf {branch_path}@tmp
    end

    JF->>JF: FOLDER_NAME = JOB_NAME.split('/').first()
```

---

## Stage 2: Prepare WORKSPACE

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant JSH as jsHelper
    participant Git as Git CLI
    participant Python as Python Scripts
    participant BB as Bitbucket API

    Note over JF: Stage: Prepare WORKSPACE

    JF->>GH: getFullCommitHash(workspace, PR_COMMIT)
    GH->>Python: get_bitbucket_commit_hash.py
    Python->>BB: GET /commits
    BB-->>Python: commit hash
    Python-->>GH: full commit hash
    GH-->>JF: COMMIT_HASH

    alt !fileExists(PROJECT_DIR)
        JF->>Git: git clone {REPO_SSH} {PROJECT_DIR}
    end

    JF->>Git: git checkout {DESTINATION_BRANCH}
    JF->>Git: git reset --hard HEAD
    JF->>Git: git pull

    JF->>GH: sendBuildStatus(workspace, 'INPROGRESS', commitHash, true)
    GH->>Python: send_bitbucket_build_status.py -d
    Python->>BB: POST /statuses/build
    BB-->>Python: OK

    JF->>JSH: findTestingDirs(PROJECT_DIR)
    JSH-->>JF: TEST_DIRECTORIES
```

---

## Stage 3: Install Dependencies

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant NPM as npm CLI

    Note over JF: Stage: Install Dependencies

    JF->>NPM: node -v
    JF->>NPM: npm -v
    JF->>NPM: npm config ls

    JF->>JSH: installNpmInTestingDirs(TEST_DIRECTORIES)
    loop for each testDir
        JSH->>NPM: npm install
        NPM-->>JSH: OK
    end
    JSH-->>JF: OK
```

---

## Stage 4: Linting

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant NPM as npm CLI

    Note over JF: Stage: Linting

    JF->>JF: mkdir -p linting_results

    JF->>JSH: executeLintingInTestingDirs(TEST_DIRECTORIES, false)
    loop for each testDir
        JSH->>NPM: npm run lint
        NPM-->>JSH: exitCode
    end
    JSH-->>JF: OK/FAIL
```

---

## Stage 5: Unit Testing

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant NPM as npm CLI

    Note over JF: Stage: Unit Testing

    JF->>JSH: runUnitTestsInTestingDirs(TEST_DIRECTORIES, false)
    loop for each testDir
        JSH->>NPM: npm test
        NPM-->>JSH: exitCode
    end
    JSH-->>JF: OK/FAIL
```

> **Note**: In JS CD, Coverage Report is not sent to Bitbucket (differs from CI)

---

## Stage 6: Static Analysis

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant SQ as SonarQube

    Note over JF: Stage: Static Analysis

    JF->>SQ: sonar-scanner -Dsonar.projectKey={key} -Dsonar.sources=.
    SQ-->>JF: analysis queued

    JF->>GH: checkQualityGateStatus(SONAR_PROJECT_KEY, token)
    loop retry (max 5)
        GH->>SQ: GET /api/ce/component
        SQ-->>GH: queue status
        alt queue not empty
            GH->>GH: sleep(10)
        else queue empty
            GH->>SQ: GET /api/qualitygates/project_status
            SQ-->>GH: entireCodeStatus, newCodeStatus
        end
    end
    GH-->>JF: PASSED/FAILED

    alt status != OK
        Note over JF: catchError - stage FAILURE
    end
```

---

## Stage 7: Check Build and Deploy Condition

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant Docker as Docker CLI
    participant AZ as Azure CLI

    Note over JF: Stage: Check Build and Deploy Condition

    JF->>Docker: docker info
    Docker-->>JF: OK/FAIL
    Note over JF: Error if Docker not running

    JF->>AZ: az login --identity
    AZ-->>JF: OK

    JF->>AZ: az acr login --name webbuilds
    AZ-->>JF: OK/FAIL
    Note over JF: Error if ACR login failed
```

---

## Stage 8: Server Build and Deploy

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant AZ as Azure CLI
    participant Docker as Docker CLI
    participant ACR as Azure Container Registry

    Note over JF: Stage: Server Build and Deploy
    Note over JF: when: params.SERVER_SOURCE_FOLDER exists

    JF->>AZ: az acr repository show-tags --name webbuilds --repository {SERVER_CONTAINER_NAME}
    AZ-->>JF: server_latest_version

    JF->>JSH: getPackageJsonVersion()
    JSH-->>JF: project_server_version

    JF->>JSH: versionCompare(server_latest_version, project_server_version)
    JSH-->>JF: true/false

    alt version is up-to-date
        JF->>Docker: docker build -t {ACR}/{SERVER_CONTAINER_NAME}:{version}
        Docker-->>JF: image built

        JF->>Docker: docker push {ACR}/{SERVER_CONTAINER_NAME}:{version}
        Docker->>ACR: push image
        ACR-->>Docker: OK

        JF->>AZ: az containerapp update --name {SERVER_CONTAINER_NAME} --image {version}
        AZ-->>JF: OK

        JF->>Docker: docker rmi {image}
        Docker-->>JF: image removed
    else version not up-to-date
        Note over JF: UNSTABLE - Skip deployment
    end
```

---

## Stage 9: Client Build and Deploy

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant AZ as Azure CLI
    participant Docker as Docker CLI
    participant ACR as Azure Container Registry

    Note over JF: Stage: Client Build and Deploy
    Note over JF: when: params.CLIENT_SOURCE_FOLDER exists

    JF->>AZ: az acr repository show-tags --name webbuilds --repository {CLIENT_CONTAINER_NAME}
    AZ-->>JF: client_latest_version

    JF->>JSH: getPackageJsonVersion()
    JSH-->>JF: project_client_version

    JF->>JSH: versionCompare(client_latest_version, project_client_version)
    JSH-->>JF: true/false

    alt version is up-to-date
        JF->>Docker: docker build -t {ACR}/{CLIENT_CONTAINER_NAME}:{version}
        Docker-->>JF: image built

        JF->>Docker: docker push {ACR}/{CLIENT_CONTAINER_NAME}:{version}
        Docker->>ACR: push image
        ACR-->>Docker: OK

        JF->>AZ: az containerapp update --name {CLIENT_CONTAINER_NAME} --image {version}
        AZ-->>JF: OK

        JF->>Docker: docker rmi {image}
        Docker-->>JF: image removed
    else version not up-to-date
        Note over JF: UNSTABLE - Skip deployment
    end
```

---

## Post: always/success/failure/aborted/unstable

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant Git as Git CLI
    participant Python as Python Scripts
    participant BB as Bitbucket API

    Note over JF: Post: always/success/failure/aborted/unstable

    Note over JF,GH: always block
    JF->>JF: currentBuild.description = PR_BRANCH
    JF->>GH: checkoutBranch(PROJECT_DIR, DESTINATION_BRANCH)
    GH->>Git: git reset --hard
    GH->>Git: git clean -fd
    GH->>Git: git checkout {destination}
    GH->>Git: git reset --hard origin/{destination}
    Git-->>GH: OK
    GH-->>JF: OK

    Note over JF,GH: success/failure/aborted/unstable
    alt success
        JF->>GH: sendBuildStatus(workspace, 'SUCCESSFUL', commitHash, true)
    else failure
        JF->>GH: sendBuildStatus(workspace, 'FAILED', commitHash, true)
    else aborted
        JF->>GH: sendBuildStatus(workspace, 'STOPPED', commitHash, true)
    else unstable
        JF->>GH: sendBuildStatus(workspace, 'SUCCESSFUL', commitHash, true)
    end
    GH->>Python: send_bitbucket_build_status.py -d
    Python->>BB: POST /statuses/build
    BB-->>Python: OK
    GH-->>JF: OK
```
