[← Overview](../detailed-analysis.md) | [Software Smells →](./software-smells-analysis.md)

# JsJenkins/Jenkinsfile (314 lines)

---

## 1. SRP Violation Analysis Criteria

- **Jenkinsfile Role**: Orchestration (pipeline sequence/flow control)
- **SRP Violation Condition**: If actual Logic exists in Jenkinsfile, Jenkinsfile modification is required when that domain changes
- **Analysis Method**: Using domain classification from [pipeline-sequence-diagrams/js-ci.md](../pipeline-sequence-diagrams/js-ci.md)

---

## 2. Functional Domains and Logic Presence

> Reference: [js-ci.md - Functional Domain Summary](../pipeline-sequence-diagrams/js-ci.md)

| Domain | Stage | Logic Exists in Jenkinsfile | Description |
|--------|-------|:------------------------:|------|
| Git Management | Prepare WORKSPACE, Post | ✗ | Delegated to Helper (`cloneOrUpdateRepo`, `checkoutBranch`) |
| Bitbucket API | Prepare WORKSPACE, Unit Testing, Post | △ | Direct Python script calls (path/arguments hardcoded) |
| Node.js (npm) | Install Dependencies, Linting, Unit Testing | △ | Helper calls, arguments hardcoded |
| Web Server (SSH/SCP) | Unit Testing | △ | Report path/type hardcoded |
| SonarQube | Static Analysis | ○ | `sonar-scanner` config directly constructed, Quality Gate logic |
| Environment Config | Prepare WORKSPACE | △ | `sh 'env'`, script loading paths, JSON parsing |

(○: Logic exists, △: Partially exists (hardcoded/direct calls), ✗: Fully delegated to Helper)

---

## 3. Stage-by-Stage SRP Violation Analysis

### Change Reasons Summary by Stage

| Lines | Stage/Area | Change Reasons |
|-----|------|----------|
| 65-103 | `Prepare WORKSPACE` | **4 reasons**: env output policy + script loading paths + branch check policy + JSON parsing logic |
| 104-120 | `Install Dependencies` stage | cd command workspace path |
| 121-131 | `Linting` stage | **2 reasons**: lint result directory + executeLintingInTestingDirs arguments |
| 134-246 | `Unit Testing` | **7 reasons**: test execution arguments + server report path/type + client report path/type + server/client branching logic + DEBUG_MODE handling + Python script interface + client DEBUG_MODE handling |
| 249-286 | `Static Analysis` | **2 reasons**: SonarQube scanner config + Quality Gate check logic |

<details markdown>
<summary>Multiple Responsibility Area: <code>Prepare WORKSPACE</code> (4 change reasons)</summary>

```groovy
stage('Prepare WORKSPACE') {
    steps {
        dir("${PROJECT_DIR}") {
            script {
                sh 'env'  // Change reason 1: env output policy
                generalUtil = load("${env.WORKSPACE}/groovy/generalHelper.groovy")  // Change reason 2: script loading path
                jsUtil = load("${env.WORKSPACE}/groovy/jsHelper.groovy")

                buildResults = generalUtil.parseJson().buildResults  // Change reason 3: JSON parsing logic
                stageResults = generalUtil.parseJson().stageResults

                if (generalUtil.isBranchUpToDateWithRemote(PR_BRANCH)) {  // Change reason 4: branch check policy
                    echo "Current branch is up-to-date with origin/${destinationBranch}. Aborting pipeline."
                    currentBuild.result = buildResults.ABORTED
                    error('Branch is up to date, no changes.')
                }

                COMMIT_HASH = generalUtil.getFullCommitHash(env.WORKSPACE, PR_COMMIT)  // Helper call (excluded)

                echo 'initialize environment'
                generalUtil.initializeEnvironment(env.WORKSPACE, COMMIT_HASH, PR_BRANCH)  // Helper call (excluded)

                echo 'clone Or Update Repo'
                generalUtil.cloneOrUpdateRepo(PROJECT_TYPE, env.WORKSPACE, PROJECT_DIR, REPO_SSH, PR_BRANCH)  // Helper call (excluded)

                echo 'merge Branch If Needed'
                generalUtil.mergeBranchIfNeeded()  // Helper call (excluded)

                // Save directories pipeline is going to test. unique to JS pipeline
                echo 'find Testing Dirs'
                env.TEST_DIRECTORIES = jsUtil.findTestingDirs(PROJECT_DIR)  // Helper call (excluded)
                echo "Testing directories: ${env.TEST_DIRECTORIES}"
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When env output policy changes** (line 71): Debug output condition
2. **When script loading path changes** (lines 72-73): Helper file location
3. **When JSON parsing logic changes** (lines 75-76): Constants structure
4. **When branch check policy changes** (lines 79-83): Duplicate build prevention condition

> Helper function calls (getFullCommitHash, initializeEnvironment, cloneOrUpdateRepo, mergeBranchIfNeeded, findTestingDirs) are Helper file's responsibility, so excluded

</details>

<details markdown>
<summary>Multiple Responsibility Area: <code>Linting</code> stage (2 change reasons)</summary>

```groovy
stage('Linting') {
    steps {
        dir("${REPORT_DIR}") {
            sh 'mkdir -p linting_results'  // Change reason 1: lint result directory structure
        }
        script {
            echo 'Linting step'
            jsUtil.executeLintingInTestingDirs(env.TEST_DIRECTORIES, false)  // Change reason 2: executeLintingInTestingDirs argument hardcoded
        }
    }
}
```

**Change Reason Analysis:**
1. **When lint result directory structure changes** (line 124): `linting_results` folder structure
2. **When executeLintingInTestingDirs argument hardcoding changes** (line 128): `false` hardcoded (deploymentBuild argument)

</details>

<details markdown>
<summary>Multiple Responsibility Area: <code>Unit Testing</code> (7 change reasons)</summary>

```groovy
stage('Unit Testing') {
    steps {
        script {
            jsUtil.runUnitTestsInTestingDirs(env.TEST_DIRECTORIES, false)  // Change reason 1: test execution argument hardcoded
            sh(script: 'cd "' + env.WORKSPACE + '"')
        }

        script {
            skipMessage = 'Skip report sending process...'
            echo 'Publish test results html to dlx-webhost server...'
            generalUtil.publishTestResultsHtmlToWebServer(  // Change reason 2: server report path/type hardcoded
                FOLDER_NAME, TICKET_NUMBER,
                "${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}/coverage/...", 'server')
            generalUtil.publishTestResultsHtmlToWebServer(  // Change reason 3: client report path/type hardcoded
                FOLDER_NAME, TICKET_NUMBER,
                "${PROJECT_DIR}/${params.CLIENT_SOURCE_FOLDER}/coverage/...", 'client')

            final String COVERAGE_SUMMARY_FILE_NAME = 'coverage-summary.json'
            final String TEST_SUMMARY_FILE_NAME = 'test-results.json'

            // Server-side report
            if (params.SERVER_SOURCE_FOLDER?.trim()) {  // Change reason 4: server/client branching logic
                Map serverTestSummaryDirs = jsUtil.retrieveReportSummaryDirs(...)  // Helper call
                if (!serverTestSummaryDirs.isEmpty()) {
                    String cmdArgs = " ${COMMIT_HASH} ${serverTestSummaryDirs['coverageSummaryDir']} ..."
                    if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') {  // Change reason 5: DEBUG_MODE handling
                        cmdArgs += ' --debug'
                    }
                    sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"  // Change reason 6: Python script interface
                }
            }

            // Client-side report (almost identical code copy-pasted from server)
            if (params.CLIENT_SOURCE_FOLDER?.trim()) {
                Map clientTestSummaryDirs = jsUtil.retrieveReportSummaryDirs(...)  // Helper call
                if (!clientTestSummaryDirs.isEmpty()) {
                    String cmdArgs = "..."
                    if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') {  // Change reason 7: DEBUG_MODE handling (repeated)
                        cmdArgs += ' --debug'
                    }
                    sh " python python/create_bitbucket_coverage_report.py ${cmdArgs}"  // Python script (repeated)
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When test execution argument changes** (line 143): `false` hardcoded
2. **When server report path/type changes** (lines 149-151): `coverage/...`, `'server'` hardcoded
3. **When client report path/type changes** (lines 152-154): `coverage/...`, `'client'` hardcoded
4. **When server/client branching logic changes** (lines 166, 205): Conditional structure
5. **When DEBUG_MODE handling changes** (lines 187-190): Debug flag handling
6. **When Python script interface changes** (line 192): Report generation
7. **When client DEBUG_MODE handling changes** (lines 226-229): Debug flag handling (same code as server)

**Note:** server/client handling code is **almost identically copy-pasted** (lines 164-203 vs 205-244)

</details>

<details markdown>
<summary>Multiple Responsibility Area: <code>Static Analysis</code> (2 change reasons)</summary>

```groovy
stage('Static Analysis') {
    steps {
        dir("${PROJECT_DIR}") {
            script {
                // Change reason 1: SonarQube scanner config
                String scannerHome = tool SONARQUBE_SCANNER
                withSonarQubeEnv(SONARQUBE_SERVER) {
                    sh """
                        ${scannerHome}/bin/sonar-scanner \\
                        -Dsonar.projectKey=${env.SONAR_PROJECT_KEY} \\
                        -Dsonar.host.url=http://localhost:9000/sonarqube \\
                        -Dsonar.sources=. \\
                        -Dsonar.exclusions=**/node_modules/**,**/coverage/**
                    """
                }
            }
        }

        withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_QUBE_AUTH_TOKEN')]) {
            script {
                // Change reason 2: Quality Gate check logic
                catchError(buildResult: buildResults.SUCCESS, stageResult: stageResults.FAILURE) {
                    Map status = generalUtil.checkQualityGateStatus(SONAR_PROJECT_KEY, env.SONAR_QUBE_AUTH_TOKEN)  // Helper call

                    final String STATUS_OK = 'OK'

                    if ((status.entireCodeStatus != STATUS_OK) || (status.newCodeStatus != STATUS_OK)) {
                        echo "Entire Code Status: ${status.entireCodeStatus}, New Code Status: ${status.newCodeStatus}"
                        error('Quality gate failed!')
                    }
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When SonarQube scanner config changes** (lines 255-265): Scanner options, host URL, exclusion patterns
2. **When Quality Gate check logic changes** (lines 271-281): Status comparison conditions, error handling

</details>

---

## Conclusion

> **SRP Violation**:
> - **Logic from 5 domains exists in Jenkinsfile** (Git management excluded)
> - **Unit Testing Stage**: server/client report code copy-pasted + Python script arguments hardcoded
> - **Static Analysis Stage**: SonarQube scanner config directly exists in Jenkinsfile
> - **Orchestration Role Violation**: Domain logic directly included in Jenkinsfile, requiring Jenkinsfile modification when that domain changes

---

[← Overview](../detailed-analysis.md) | [Software Smells →](./software-smells-analysis.md)
