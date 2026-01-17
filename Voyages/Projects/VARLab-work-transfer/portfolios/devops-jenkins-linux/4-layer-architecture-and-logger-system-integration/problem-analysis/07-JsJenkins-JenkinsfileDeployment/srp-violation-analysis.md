[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)

# JsJenkins/JenkinsfileDeployment (452 lines)

---

## 1. SRP Violation Analysis Criteria

- **Jenkinsfile Role**: Orchestration (pipeline sequence/flow control)
- **SRP Violation Condition**: If actual Logic exists in Jenkinsfile, Jenkinsfile modification is required when that domain changes
- **Analysis Method**: Using domain classification from [pipeline-sequence-diagrams/js-cd.md](../pipeline-sequence-diagrams/js-cd.md)

---

## 2. Functional Domains and Logic Presence

> Reference: [js-cd.md - Functional Domain Summary](../pipeline-sequence-diagrams/js-cd.md)

| Domain | Stage | Logic Exists in Jenkinsfile | Description |
|--------|-------|:------------------------:|------|
| Git Management | Prepare WORKSPACE, Post | ○ | Direct Git clone/checkout/reset/pull calls |
| Bitbucket API | Prepare WORKSPACE, Post | △ | `sendBuildStatus` arguments hardcoded |
| Node.js (npm) | Install Dependencies, Linting, Unit Testing, Server/Client Deploy | △ | Helper calls, arguments hardcoded |
| SonarQube | Static Analysis | ○ | `sonar-scanner` config directly constructed, Quality Gate logic |
| Docker | Check Condition, Server/Client Deploy | ○ | Direct Docker build/push/rmi command calls |
| Azure | Check Condition, Server/Client Deploy | ○ | Direct az CLI command calls (ACR, Container Apps) |
| Environment Config | Delete Merged Branch | △ | Script loading paths, `mainBranches` check |
| PR Cleanup | Delete Merged Branch | ○ | Direct find/rm command calls, folder name extraction rules |

(○: Logic exists, △: Partially exists (hardcoded/direct calls), ✗: Fully delegated to Helper)

---

## 3. Stage-by-Stage SRP Violation Analysis

### Change Reasons Summary by Stage

| Lines | Stage/Area | Change Reasons |
|-----|------|----------|
| 52-90 | `Delete Merged Branch` | **5 reasons**: Script loading paths + JSON parsing logic + main branch list + folder name extraction rules + web server cleanup logic |
| 92-148 | `Prepare WORKSPACE` | **6 reasons**: Directory existence check + Git clone + Git checkout/reset/pull + Bitbucket status arguments + Node version check + npm install logic |
| 150-180 | `Linting` stage | **2 reasons**: Lint result directory + executeLintingInTestingDirs arguments |
| 182-209 | `Unit Testing` stage | **2 reasons**: Test execution arguments + cd command path |
| 212-239 | `Check Build and Deploy Condition` stage | **3 reasons**: Environment variable setup logic + version check logic + Docker image tag lookup |
| 242-317 | `Server-side Build and Deploy` stage | **6 reasons**: Docker build + Docker push + Azure Container Apps config + Docker image cleanup + version comparison logic + ACR tag lookup |
| 319-392 | `Client-side Build and Deploy` stage | Same **6 reasons** as Server (code copy-paste) |
| 394-422 | `Static Analysis` stage | **2 reasons**: SonarQube scanner config + Quality Gate check logic |

<details>
<summary>Multiple Responsibility Area: <code>Delete Merged Branch</code> (5 change reasons)</summary>

```groovy
stage('Delete Merged Branch') {
    steps {
        script {
            generalUtil = load("${env.WORKSPACE}/groovy/generalHelper.groovy")  // Change reason 1: Script loading path
            jsUtil = load("${env.WORKSPACE}/groovy/jsHelper.groovy")

            buildResults = generalUtil.parseJson().buildResults  // Change reason 2: JSON parsing logic
            stageResults = generalUtil.parseJson().stageResults

            if (!mainBranches.contains(DESTINATION_BRANCH)) {  // Change reason 3: Main branch list
                env.FAILURE_REASON = 'Not merging to the main branch. Exiting the pipeline...'
                currentBuild.result = buildResults.ABORTED
                error(env.FAILURE_REASON)
            }

            COMMIT_HASH = generalUtil.getFullCommitHash(env.WORKSPACE, PR_COMMIT)  // Helper call (excluded)

            generalUtil.cleanUpPRBranch(PR_BRANCH)  // Helper call (excluded)

            env.FOLDER_NAME = "${JOB_NAME}".split('/').first()  // Change reason 4: Folder name extraction rules
            def ticketNumber = generalUtil.parseTicketNumber(PR_BRANCH)
            generalUtil.cleanMergedBranchFromWebServer(FOLDER_NAME, ticketNumber)  // Change reason 5: Web server cleanup logic
        }
    }
}
```

**Change Reason Analysis:**
1. **When script loading path changes** (lines 55-56): Helper file location
2. **When JSON parsing logic changes** (lines 58-59): Constants structure
3. **When main branch list changes** (lines 61-65): Allowed branch conditions
4. **When folder name extraction rules change** (line 72): JOB_NAME parsing
5. **When web server cleanup logic changes** (line 74): cleanMergedBranchFromWebServer call

</details>

<details>
<summary>Multiple Responsibility Area: <code>Prepare WORKSPACE</code> (6 change reasons)</summary>

```groovy
stage('Prepare WORKSPACE') {
    environment {
        REPO_SSH = "git@bitbucket.org:${PR_PROJECT}.git"
    }
    steps {
        script {
            if (!fileExists("${PROJECT_DIR}")) {  // Change reason 1: Directory existence check method
                echo 'First time running pipeline. Cloning main branch...'
                sh "git clone ${REPO_SSH} \"${PROJECT_DIR}\""  // Change reason 2: Git clone command
            }
        }

        dir("${PROJECT_DIR}") {
            echo 'Checkout to the main branch...'
            sh "git checkout ${DESTINATION_BRANCH}"  // Change reason 3: Git checkout/reset/pull workflow
            echo 'Cleaning project...'
            sh 'git reset --hard HEAD'
            echo 'Pulling latest version of default branch...'
            sh 'git pull'
        }

        script {
            echo "Sending 'In Progress' status to Bitbucket..."
            generalUtil.sendBuildStatus(env.WORKSPACE, 'INPROGRESS', COMMIT_HASH, true)  // Change reason 4: Bitbucket status arguments

            jsUtil.checkNodeVersion()  // Change reason 5: Node version check

            echo 'find Testing Dirs'
            env.TEST_DIRECTORIES = jsUtil.findTestingDirs(PROJECT_DIR)  // Helper call (excluded)
            echo "Testing directories: ${env.TEST_DIRECTORIES}"

            jsUtil.installNpmInTestingDirs(env.TEST_DIRECTORIES)  // Change reason 6: npm install logic
        }
    }
}
```

**Change Reason Analysis:**
1. **When directory existence check method changes** (line 100): `fileExists()` condition
2. **When Git clone command changes** (line 102): clone options
3. **When Git checkout/reset/pull workflow changes** (lines 107-112): Git command sequence/options
4. **When Bitbucket status arguments change** (line 116): `'INPROGRESS'`, `true` hardcoded
5. **When Node version check changes** (line 118): checkNodeVersion call method
6. **When npm install logic changes** (line 125): installNpmInTestingDirs call

</details>

<details>
<summary>Multiple Responsibility Area: <code>Check Build and Deploy Condition</code> (3 change reasons)</summary>

```groovy
stage('Check Build and Deploy Condition') {
    steps {
        script {
            // Change reason 1: Environment variable setup logic
            env.SERVER_SKIP_BUILD = 'false'
            env.CLIENT_SKIP_BUILD = 'false'

            // Server version check
            String serverImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.SERVER_IMAGE_NAME}"
            // Change reason 2: Docker image tag lookup
            String latestServerTag = sh(script: """
                az acr repository show-tags --name ${env.AZURE_CONTAINER_REGISTRY_NAME} \\
                --repository ${params.SERVER_IMAGE_NAME} --orderby time_desc --top 1 -o tsv
            """, returnStdout: true).trim()

            String packageJsonServerVersion = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}")

            // Change reason 3: Version comparison logic
            if (latestServerTag && jsUtil.versionCompare(packageJsonServerVersion, latestServerTag) <= 0) {
                echo "Server version ${packageJsonServerVersion} already exists. Skipping build..."
                env.SERVER_SKIP_BUILD = 'true'
            }

            // Client repeats same pattern...
        }
    }
}
```

**Change Reason Analysis:**
1. **When environment variable setup logic changes** (lines 217-218): SKIP_BUILD flag initialization
2. **When Docker image tag lookup changes** (lines 222-225): az acr command options
3. **When version comparison logic changes** (lines 229-232): versionCompare condition

</details>

<details>
<summary>Multiple Responsibility Area: Server vs Client Build and Deploy (same pattern repeated)</summary>

**Server-side Build and Deploy** (lines 242-317):

```groovy
stage('Server-side Build and Deploy') {
    when { expression { env.SERVER_SKIP_BUILD != 'true' } }
    steps {
        script {
            String serverImageName = "${env.AZURE_CONTAINER_REGISTRY}/${params.SERVER_IMAGE_NAME}"
            String serverVersion = jsUtil.getPackageJsonVersion("${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}")

            // Docker build
            sh """
                docker build -t ${serverImageName}:${serverVersion} \\
                -f ${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}/Dockerfile \\
                ${PROJECT_DIR}/${params.SERVER_SOURCE_FOLDER}
            """

            // Docker push
            sh "docker push ${serverImageName}:${serverVersion}"

            // Azure Container Apps update
            sh """
                az containerapp update --name ${params.SERVER_CONTAINER_APP_NAME} \\
                --resource-group ${env.AZURE_RESOURCE_GROUP} \\
                --image ${serverImageName}:${serverVersion}
            """

            // Docker image cleanup
            sh "docker rmi ${serverImageName}:${serverVersion}"
        }
    }
}
```

**Client-side Build and Deploy** (lines 319-392): **Almost identical code to Server**, only variable names differ

**→ When adding new deployment target (e.g., 'admin')**: 75 lines copy-paste required

</details>

<details>
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
                    Map status = generalUtil.checkQualityGateStatus(SONAR_PROJECT_KEY, env.SONAR_QUBE_AUTH_TOKEN)

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
1. **When SonarQube scanner config changes** (lines 399-409): Scanner options, host URL, exclusion patterns
2. **When Quality Gate check logic changes** (lines 413-421): Status comparison conditions, error handling

</details>

---

## Conclusion

> **SRP Violation**:
> - **Logic from 7 domains exists in Jenkinsfile**
> - **Git Management**: Unlike CI, Git commands exist directly in Jenkinsfile (no Helper usage)
> - **Docker/Azure Stage**: Direct Docker build/push + az containerapp command calls
> - **Server/Client Deploy**: Almost identical code copy-pasted (75 lines copy required when adding new deployment target)
> - **Orchestration Role Violation**: Domain logic directly included in Jenkinsfile, requiring Jenkinsfile modification when that domain changes

---

[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)
