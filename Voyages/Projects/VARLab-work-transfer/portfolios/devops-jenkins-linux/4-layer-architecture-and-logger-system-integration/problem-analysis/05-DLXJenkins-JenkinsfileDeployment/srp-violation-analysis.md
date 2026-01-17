[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)

# DLXJenkins/JenkinsfileDeployment (265 lines)

---

## 1. SRP Violation Analysis Criteria

- **Jenkinsfile Role**: Orchestration (pipeline sequence/flow control)
- **SRP Violation Condition**: If actual Logic exists in Jenkinsfile, Jenkinsfile modification is required when that domain changes
- **Analysis Method**: Using domain classification from [pipeline-sequence-diagrams/dlx-cd.md](../pipeline-sequence-diagrams/dlx-cd.md)

---

## 2. Functional Domains and Logic Presence

> Reference: [dlx-cd.md - Functional Domain Summary](../pipeline-sequence-diagrams/dlx-cd.md)

| Domain | Stage | Logic Exists in Jenkinsfile | Description |
|--------|-------|:------------------------:|------|
| Git Management | Prepare WORKSPACE, Post | ○ | Direct Git clone/checkout/reset/pull calls |
| Bitbucket API | Delete Merged Branch, Prepare WORKSPACE, Post | △ | `sendBuildStatus` arguments hardcoded |
| Unity CLI | Prepare WORKSPACE, EditMode, PlayMode, Build | △ | `stageName`/`errorMsg` hardcoded, Helper calls |
| Web Server (SSH/SCP) | Delete Merged Branch, Deploy Build | ○ | Direct SSH/SCP command calls, server paths hardcoded |
| Linting (Bash) | Linting | ○ | Direct Bash script calls, exitCode branching logic |
| Environment Config | Delete Merged Branch | △ | Script loading paths, `mainBranches` check |
| PR Cleanup | Delete Merged Branch | △ | Helper calls, folder name extraction rules |

(○: Logic exists, △: Partially exists (hardcoded/direct calls), ✗: Fully delegated to Helper)

---

## 3. Stage-by-Stage SRP Violation Analysis

### Change Reasons Summary by Stage

| Lines | Stage/Area | Change Reasons |
|-----|------|----------|
| 54-83 | `Delete Merged Branch` | **4 reasons**: Script loading paths + JSON parsing logic + main branch list + folder name extraction rules |
| 86-126 | `Prepare WORKSPACE` | **7 reasons**: Directory existence check + Git clone + Git checkout + Git reset + Git pull + Bitbucket status arguments + Unity stage name/error message |
| 128-153 | `Linting` stage | **4 reasons**: Lint result directory + editorconfig path + Linting.bash script + exit code handling |
| 156-170 | `EditMode Tests` stage | **2 reasons**: Test result directory + Unity stage name/error message |
| 173-184 | `PlayMode Tests` stage | Unity stage name/error message |
| 186-198 | `Build Project` stage | **3 reasons**: Assets/Editor path + Builder.cs location + Unity stage name/error message |
| 200-237 | `Deploy Build` | **5 reasons**: SSH directory creation + SCP copy options + UpdateBuildURL.sh script + DLX project list + eConestoga server config |

<details>
<summary>Multiple Responsibility Area: <code>Delete Merged Branch</code> (4 change reasons)</summary>

```groovy
stage('Delete Merged Branch') {
    steps {
        script {
            generalUtil = load("${env.WORKSPACE}/groovy/generalHelper.groovy")  // Change reason 1: Script loading path
            unityUtil = load("${env.WORKSPACE}/groovy/unityHelper.groovy")

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
            generalUtil.cleanMergedBranchFromWebServer(FOLDER_NAME, ticketNumber)  // Helper call (excluded)
        }
    }
}
```

**Change Reason Analysis:**
1. **When script loading path changes** (lines 57-58): Helper file location
2. **When JSON parsing logic changes** (lines 61-62): Constants structure
3. **When main branch list changes** (lines 65-68): Allowed branch conditions
4. **When folder name extraction rules change** (line 78): JOB_NAME parsing

> Helper function calls (getFullCommitHash, cleanUpPRBranch, cleanMergedBranchFromWebServer) are generalHelper.groovy's responsibility, so excluded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Prepare WORKSPACE</code> (7 change reasons)</summary>

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
            sh "git checkout ${DESTINATION_BRANCH}"  // Change reason 3: Git checkout workflow
            echo 'Cleaning project...'
            sh 'git reset --hard HEAD'  // Change reason 4: Git reset policy
            echo 'Pulling latest version of default branch...'
            sh 'git pull'  // Change reason 5: Git pull method
        }

        script {
            echo "Sending 'In Progress' status to Bitbucket..."
            generalUtil.sendBuildStatus(env.WORKSPACE, 'INPROGRESS', COMMIT_HASH, true)  // Change reason 6: Bitbucket status arguments hardcoded

            echo 'Identifying Unity version...'
            env.UNITY_EXECUTABLE = unityUtil.getUnityExecutable(env.WORKSPACE, PROJECT_DIR)  // Helper call
        }

        echo 'Running Unity in batch mode to setup initial files...'
        dir("${PROJECT_DIR}") {
            script {
                String stageName = 'Rider'  // Change reason 7: Unity stage name/error message
                String errorMassage = 'Synchronizing Unity and Rider IDE solution files failed'
                unityUtil.runUnityStage(stageName, errorMassage)  // Helper call
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When directory existence check method changes** (line 92): `fileExists()` condition
2. **When Git clone command changes** (line 94): clone options
3. **When Git checkout workflow changes** (line 101): checkout sequence
4. **When Git reset policy changes** (line 103): reset options
5. **When Git pull method changes** (line 105): pull options
6. **When Bitbucket status arguments change** (line 110): `'INPROGRESS'`, `true` hardcoded
7. **When Unity stage name/error message changes** (lines 118-119): `stageName`, `errorMassage` hardcoded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Linting</code> stage (4 change reasons)</summary>

```groovy
stage('Linting') {
    steps {
        dir("${REPORT_DIR}") {
            sh 'mkdir -p linting_results'  // Change reason 1: Lint result directory structure
        }
        echo 'running lint script'
        script {
            sh "cp -f '${env.WORKSPACE}/Bash/.editorconfig' '${PROJECT_DIR}' 2>/dev/null"  // Change reason 2: editorconfig path
            def exitCode = sh script: """sh '${env.WORKSPACE}/Bash/Linting.bash' \\
                '${PROJECT_DIR}' \\
                '${REPORT_DIR}/linting_results'""", returnStatus: true  // Change reason 3: Linting.bash script

            if (exitCode != 0) {  // Change reason 4: Exit code handling policy
                catchError(buildResult: buildResults.SUCCESS, stageResult: stageResults.FAILURE) {
                    error("Linting failed with exit code: ${exitCode}")
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When lint result directory structure changes** (line 133): Folder structure
2. **When editorconfig path changes** (line 137): Config file location
3. **When Linting.bash script changes** (lines 139-141): Bash script interface
4. **When exit code handling policy changes** (lines 145-148): Exit code branching

</details>

<details>
<summary>Multiple Responsibility Area: <code>EditMode Tests</code> stage (2 change reasons)</summary>

```groovy
stage('EditMode Tests') {
    steps {
        dir("${REPORT_DIR}") {
            sh 'mkdir -p test_results'  // Change reason 1: Test result directory structure
        }
        echo 'Running EditMode tests...'
        dir("${PROJECT_DIR}") {
            script {
                String stageName = 'EditMode'  // Change reason 2: Unity stage name/error message hardcoded
                String errorMassage = 'EditMode tests failed'
                unityUtil.runUnityStage(stageName, errorMassage)  // Helper call (excluded)
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When test result directory structure changes** (line 159): Folder structure
2. **When Unity stage name/error message changes** (lines 164-165): `stageName`, `errorMassage` hardcoded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Build Project</code> stage (3 change reasons)</summary>

```groovy
stage('Build Project') {
    steps {
        echo 'Building Unity project for WebGL...'
        sh "mkdir -p \"${PROJECT_DIR}/Assets/Editor/\""  // Change reason 1: Assets/Editor path
        sh "mv Builder.cs \"${PROJECT_DIR}/Assets/Editor/\""  // Change reason 2: Builder.cs location (mv command)
        script {
            String stageName = 'Webgl'  // Change reason 3: Unity stage name/error message hardcoded
            String errorMassage = 'WebGL Build failed'
            unityUtil.runUnityStage(stageName, errorMassage)  // Helper call (excluded)
        }
    }
}
```

**Change Reason Analysis:**
1. **When Assets/Editor path changes** (line 190): Directory structure
2. **When Builder.cs location changes** (line 191): File move with `mv` command
3. **When Unity stage name/error message changes** (lines 193-194): `stageName`, `errorMassage` hardcoded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Deploy Build</code> (5 change reasons)</summary>

```groovy
stage('Deploy Build') {
    steps {
        echo 'Deploying build to LTI web server...'

        script {
            // Change reasons 1-2: SSH directory creation + SCP copy (LTI server)
            sh """ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} \"sudo mkdir -p /var/www/html/${FOLDER_NAME} \\
            && sudo chown vconadmin:vconadmin /var/www/html/${FOLDER_NAME}\""""
            sh """scp -i ${env.SSH_KEY} -rp ${PROJECT_DIR}/Builds/* \"${env.DLX_WEB_HOST_URL}:/var/www/html/${FOLDER_NAME}\""""
            sh """ssh -i ${env.SSH_KEY} ${env.DLX_WEB_HOST_URL} 'bash ~/ShellScripts/UpdateBuildURL.sh /var/www/html/${FOLDER_NAME}'"""  // Change reason 3: UpdateBuildURL.sh script
        }

        script {
            if (DLX_PROJECT_LIST.contains(PR_REPO_NAME)) {  // Change reason 4: DLX project list
                echo 'Deploying build to eConestoga dlx web server...'

                // Change reason 5: eConestoga server config (same pattern as LTI repeated)
                sh script: """
                    ssh -i ${env.SSH_KEY} ${env.DLX_ECONESTOGA_URL} \\
                    \"sudo mkdir -p /var/www/html/${FOLDER_NAME} && sudo chown vconadmin:vconadmin /var/www/html/${FOLDER_NAME}\"
                """
                sh script: """
                    scp -i ${env.SSH_KEY} -rp ${PROJECT_DIR}/Builds/* \\
                    ${env.DLX_ECONESTOGA_URL}:/var/www/html/${FOLDER_NAME}
                """
                sh script: """
                    ssh -i ${env.SSH_KEY} ${env.DLX_ECONESTOGA_URL} \\
                    'bash ~/ShellScripts/UpdateBuildURL.sh /var/www/html/${FOLDER_NAME}'
                """
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When SSH directory creation command changes** (lines 205-206): mkdir + chown options
2. **When SCP copy options change** (line 207): scp arguments
3. **When UpdateBuildURL.sh script changes** (line 209): Script path/arguments
4. **When DLX project list changes** (line 213): Condition list
5. **When eConestoga server config changes** (lines 218-232): Same as LTI → code copy-paste

</details>

---

## Conclusion

> **SRP Violation**:
> - **Logic from 6 domains exists in Jenkinsfile** (PR cleanup partially delegated)
> - **Git Management**: Unlike CI, Git commands exist directly in Jenkinsfile (no Helper usage)
> - **Deploy Build Stage**: Direct SSH/SCP command calls + LTI/eConestoga same pattern repeated
> - **Orchestration Role Violation**: Domain logic directly included in Jenkinsfile, requiring Jenkinsfile modification when that domain changes

---

[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)
