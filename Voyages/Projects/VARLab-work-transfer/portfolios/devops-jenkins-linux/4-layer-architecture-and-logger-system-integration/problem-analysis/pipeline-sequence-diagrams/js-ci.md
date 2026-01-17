# JS CI Pipeline Sequence Diagrams

> **Analysis Target**: `JsJenkins/Jenkinsfile` (JavaScript CI Pipeline)
>
> **Trigger**: Runs when PR is `OPEN`

---

## Domain Summary by Function

| Domain | Function | Used Stage | Helper Location |
|--------|----------|------------|-----------------|
| **Git Management** | clone, fetch, checkout, reset, clean, merge | Prepare WORKSPACE, Post | generalHelper |
| **Bitbucket API** | send build status, get commit hash, send coverage report | Prepare WORKSPACE, Unit Testing, Post | generalHelper + Python |
| **Node.js (npm)** | version check, npm install, run tests, linting | Install Dependencies, Linting, Unit Testing | jsHelper |
| **Web Server (SSH/SCP)** | deploy coverage report HTML | Unit Testing | generalHelper |
| **SonarQube** | static code analysis, Quality Gate check | Static Analysis | generalHelper + sonar-scanner |
| **Environment Setup** | parseJson, parseTicketNumber, findTestingDirs | Prepare WORKSPACE | generalHelper + jsHelper |

### Domain Mapping by Stage

| Stage | Git | Bitbucket | Node.js | Web Server | SonarQube | Environment Setup |
|-------|:---:|:---------:|:-------:|:----------:|:---------:|:-----------------:|
| Prepare WORKSPACE | ✓ | ✓ | | | | ✓ |
| Install Dependencies | | | ✓ | | | |
| Linting | | | ✓ | | | |
| Unit Testing | | ✓ | ✓ | ✓ | | |
| Static Analysis | | | | | ✓ | |
| Post | ✓ | ✓ | | | | |

### DLX CI vs JS CI Comparison

| Item | DLX CI | JS CI |
|------|--------|-------|
| Tool | Unity CLI | Node.js (npm) |
| Helper | unityHelper | jsHelper |
| Install Dependencies | No | Yes (npm install) |
| Linting | Bash Script (C#) | jsHelper (ESLint) |
| Test Type | EditMode/PlayMode | Unit Testing (Jest) |
| Code Coverage | Unity Code Coverage | lcov-report |
| Static Analysis | No | Yes (SonarQube) |
| Build Project | Yes (WebGL) | No |

---

## Overall Pipeline Overview

```mermaid
flowchart LR
    subgraph Stages
        S1[Prepare WORKSPACE]
        S2[Install Dependencies]
        S3[Linting]
        S4[Unit Testing]
        S5[Static Analysis]
    end

    S1 --> S2 --> S3 --> S4 --> S5

    S5 --> Post[Post<br/>always/success/failure/aborted]
```

---

## Stage 1: Prepare WORKSPACE

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

    JF->>JF: sh 'env' (print environment variables)
    JF->>GH: load("generalHelper.groovy")
    JF->>JSH: load("jsHelper.groovy")

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

    JF->>JSH: findTestingDirs(PROJECT_DIR)
    JSH-->>JF: TEST_DIRECTORIES
```

---

## Stage 2: Install Dependencies

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant JSH as jsHelper
    participant NPM as npm CLI

    Note over JF: Stage: Install Dependencies

    JF->>JSH: checkNodeVersion()
    JSH->>NPM: node -v
    NPM-->>JSH: version
    JSH->>NPM: npm -v
    NPM-->>JSH: version

    JF->>JSH: installNpmInTestingDirs(TEST_DIRECTORIES)
    loop for each testDir
        JSH->>NPM: npm install
        NPM-->>JSH: OK
    end
    JSH-->>JF: OK
```

---

## Stage 3: Linting

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

## Stage 4: Unit Testing

```mermaid
sequenceDiagram
    autonumber

    participant JF as Jenkinsfile<br/>(Orchestrator)
    participant GH as generalHelper
    participant JSH as jsHelper
    participant NPM as npm CLI
    participant Python as Python Scripts
    participant BB as Bitbucket API
    participant WS as Web Server<br/>(SSH/SCP)

    Note over JF: Stage: Unit Testing

    JF->>JSH: runUnitTestsInTestingDirs(TEST_DIRECTORIES, false)
    loop for each testDir
        JSH->>NPM: npm test --coverage
        NPM-->>JSH: coverage-summary.json, test-results.json
    end
    JSH-->>JF: OK/FAIL

    Note over JF,WS: Publish coverage HTML to Web Server
    JF->>GH: publishTestResultsHtmlToWebServer(FOLDER_NAME, TICKET_NUMBER, lcov-report, 'server')
    GH->>WS: ssh mkdir -p /var/www/html/{folder}/{ticket}/server
    GH->>WS: scp -r lcov-report/*
    WS-->>GH: OK

    JF->>GH: publishTestResultsHtmlToWebServer(FOLDER_NAME, TICKET_NUMBER, lcov-report, 'client')
    GH->>WS: ssh mkdir -p /var/www/html/{folder}/{ticket}/client
    GH->>WS: scp -r lcov-report/*
    WS-->>GH: OK

    Note over JF,BB: Send coverage reports to Bitbucket
    alt params.SERVER_SOURCE_FOLDER exists
        JF->>JSH: retrieveReportSummaryDirs(serverDir)
        JSH-->>JF: coverageSummaryDir, testSummaryDir
        JF->>Python: create_bitbucket_coverage_report.py --server
        Python->>BB: POST /reports
        BB-->>Python: OK
    end

    alt params.CLIENT_SOURCE_FOLDER exists
        JF->>JSH: retrieveReportSummaryDirs(clientDir)
        JSH-->>JF: coverageSummaryDir, testSummaryDir
        JF->>Python: create_bitbucket_coverage_report.py --client
        Python->>BB: POST /reports
        BB-->>Python: OK
    end
```

---

## Stage 5: Static Analysis

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
