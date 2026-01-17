# Jenkins CI Pipeline Sequence Diagrams

> **Analysis Target**: `PipelineForJenkins/Jenkinsfile` (Jenkins Groovy CI Pipeline)
>
> **Trigger**: Runs when PR is `OPEN` or `MERGED` (differs from other pipelines)

---

## Domain Summary by Function

| Domain | Function | Used Stage | Helper Location |
|--------|----------|------------|-----------------|
| **Git Management** | clone, fetch, checkout, reset, clean, merge | Prepare WORKSPACE, Post | generalHelper |
| **Bitbucket API** | send build status, get commit hash | Prepare WORKSPACE, Post | generalHelper + Python |
| **Docker** | run npm-groovy-lint container | Lint Groovy Code | Jenkinsfile direct |
| **Gradle** | run tests (gradle test) | Run Unit Tests | Jenkinsfile direct |
| **Groovydoc** | generate API documentation (gradle groovydoc) | Generate Groovydoc | Jenkinsfile direct |
| **Web Server (SSH/SCP)** | deploy Groovydoc HTML (MERGED only) | Generate Groovydoc | generalHelper |
| **SonarQube** | static code analysis, Quality Gate check | Static Analysis | generalHelper + sonar-scanner |
| **Environment Setup** | parseJson, parseTicketNumber | Prepare WORKSPACE | generalHelper |

### Domain Mapping by Stage

| Stage | Git | Bitbucket | Docker | Gradle | Groovydoc | Web Server | SonarQube | Environment Setup |
|-------|:---:|:---------:|:------:|:------:|:---------:|:----------:|:---------:|:-----------------:|
| Prepare WORKSPACE | ✓ | ✓ | | | | | | ✓ |
| Lint Groovy Code | | | ✓ | | | | | |
| Generate Groovydoc | | | | ✓ | ✓ | ✓* | | |
| Run Unit Tests | | | | ✓ | | | | |
| Publish Test Results | | ✓ | | | | | | |
| Static Analysis | | | | | | | ✓ | |
| Post | ✓ | ✓ | | | | | | |

> *Web Server: Groovydoc deployed only when MERGED

### CI Pipeline Comparison (DLX CI vs JS CI vs Jenkins CI)

| Item | DLX CI | JS CI | Jenkins CI |
|------|--------|-------|------------|
| Tool | Unity CLI | Node.js (npm) | Gradle + Docker |
| Helper | unityHelper | jsHelper | (none - direct calls) |
| Trigger | OPEN | OPEN | **OPEN + MERGED** |
| Install Dependencies | No | Yes (npm install) | No |
| Linting | Bash Script (C#) | jsHelper (ESLint) | Docker (npm-groovy-lint) |
| Test Type | EditMode/PlayMode | Unit Testing (Jest) | Gradle Test (Spock) |
| Code Coverage | Unity Code Coverage | lcov-report | JaCoCo |
| Static Analysis | No | Yes (SonarQube) | Yes (SonarQube) |
| Build Project | Yes (WebGL) | No | No |
| Documentation | No | No | Yes (Groovydoc) |

---

## Overall Pipeline Overview

```mermaid
flowchart LR
    subgraph Stages
        S1[Prepare WORKSPACE]
        S2[Lint Groovy Code]
        S3[Generate Groovydoc]
        S4[Run Unit Tests]
        S5[Publish Test Results]
        S6[Static Analysis]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6

    S6 --> Post[Post<br/>always/success/failure/aborted]
```

---

## Stage 1: Prepare WORKSPACE

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant Git as Git CLI
    participant Python as Python Scripts
    participant BB as Bitbucket API

    Note over JF: Stage: Prepare WORKSPACE

    JF->>JF: sh 'env' (print environment variables)
    JF->>GH: load("generalHelper.groovy")

    JF->>GH: parseJson()
    GH-->>JF: buildResults, stageResults

    JF->>GH: isBranchUpToDateWithRemote(PR_BRANCH)
    GH->>Git: git fetch origin
    GH->>Git: git rev-parse HEAD
    GH->>Git: git rev-parse origin/{branch}
    Git-->>GH: commit hashes
    GH-->>JF: true/false

    JF->>GH: getFullCommitHash(workspace, PR_COMMIT)
    GH->>Python: get_bitbucket_commit_hash.py
    Python->>BB: GET /commits
    BB-->>Python: commit hash
    Python-->>GH: full commit hash
    GH-->>JF: COMMIT_HASH

    JF->>GH: initializeEnvironment(workspace, commitHash, prBranch)
    GH->>GH: sendBuildStatus('INPROGRESS')
    GH->>Python: send_bitbucket_build_status.py
    Python->>BB: POST /statuses/build
    GH->>GH: parseTicketNumber(prBranch)
    GH-->>JF: TICKET_NUMBER, FOLDER_NAME

    JF->>GH: cloneOrUpdateRepo(workspace, projectDir, prBranch)
    GH->>Git: git clone / git fetch
    GH->>Git: git checkout
    GH->>Git: git reset --hard
    GH->>Git: git clean -fd
    Git-->>GH: OK
    GH-->>JF: OK

    JF->>GH: mergeBranchIfNeeded(prBranch)
    GH->>GH: getDefaultBranch()
    GH->>Git: git remote show origin
    Git-->>GH: default branch
    GH->>GH: isBranchUpToDateWithMain()
    GH->>Git: git merge-base --is-ancestor
    GH->>GH: tryMerge(defaultBranch)
    GH->>Git: git merge origin/{default}
    Git-->>GH: OK
    GH-->>JF: OK
```

---

## Stage 2: Lint Groovy Code

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant Docker as Docker Container<br/>(npm-groovy-lint)
    participant FS as File System

    Note over JF: Stage: Lint Groovy Code

    JF->>FS: mkdir -p linting_results

    JF->>Docker: docker run nvuillam/npm-groovy-lint
    Note over Docker: -v ${WORKSPACE}:/workspace<br/>-w /workspace
    Docker->>Docker: npm-groovy-lint --path ./groovy --output json
    Docker-->>FS: linting_results/groovy-lint-report.json
    Docker-->>JF: exitCode

    alt exitCode != 0
        Note over JF: catchError - stage FAILURE
    end
```

---

## Stage 3: Generate Groovydoc

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant Gradle as Gradle CLI
    participant WS as Web Server<br/>(SSH/SCP)

    Note over JF: Stage: Generate Groovydoc

    JF->>Gradle: gradle groovydoc
    Gradle-->>JF: build/docs/groovydoc/

    alt PR_STATE == 'MERGED'
        JF->>GH: publishTestResultsHtmlToWebServer(FOLDER_NAME, TICKET_NUMBER, groovydoc, 'groovydoc')
        GH->>WS: ssh mkdir -p /var/www/html/{folder}/{ticket}/groovydoc
        GH->>WS: scp -r groovydoc/*
        WS-->>GH: OK
    end
```

---

## Stage 4: Run Unit Tests

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant Gradle as Gradle CLI
    participant FS as File System

    Note over JF: Stage: Run Unit Tests

    JF->>Gradle: gradle test
    Gradle->>Gradle: Spock Framework test execution
    Gradle-->>FS: build/test-results/test/*.xml
    Gradle-->>FS: build/reports/tests/test/index.html
    Gradle-->>FS: build/reports/jacoco/test/jacocoTestReport.xml
    Gradle-->>JF: exitCode

    alt exitCode != 0
        Note over JF: catchError - stage FAILURE
    end
```

---

## Stage 5: Publish Test Results

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant Python as Python Scripts
    participant BB as Bitbucket API

    Note over JF: Stage: Publish Test Results

    JF->>JF: junit 'build/test-results/test/*.xml'
    Note over JF: Jenkins JUnit Plugin

    JF->>Python: create_bitbucket_test_report.py
    Python->>BB: POST /reports (test results)
    BB-->>Python: OK

    JF->>Python: create_bitbucket_coverage_report.py
    Python->>BB: POST /reports (coverage results)
    BB-->>Python: OK
```

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

## Post: always/success/failure/aborted

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant Git as Git CLI
    participant Python as Python Scripts
    participant BB as Bitbucket API

    Note over JF: Post: always/success/failure/aborted

    Note over JF,GH: always block
    JF->>JF: currentBuild.description = PR_BRANCH
    JF->>GH: checkoutBranch(PROJECT_DIR, DESTINATION_BRANCH)
    GH->>Git: git reset --hard
    GH->>Git: git clean -fd
    GH->>Git: git checkout {destination}
    GH->>Git: git reset --hard origin/{destination}
    Git-->>GH: OK
    GH-->>JF: OK

    Note over JF,GH: success/failure/aborted
    alt success
        JF->>GH: sendBuildStatus(workspace, 'SUCCESSFUL', commitHash, false)
    else failure
        JF->>GH: sendBuildStatus(workspace, 'FAILED', commitHash, false)
    else aborted
        JF->>GH: sendBuildStatus(workspace, 'STOPPED', commitHash, false)
    end
    GH->>Python: send_bitbucket_build_status.py
    Python->>BB: POST /statuses/build
    BB-->>Python: OK
    GH-->>JF: OK
```
