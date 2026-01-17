[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)

# DLXJenkins/Jenkinsfile (286 lines)

---

## 1. SRP Violation Analysis Criteria

- **Jenkinsfile Role**: Orchestration (pipeline sequence/flow control)
- **SRP Violation Condition**: If actual Logic exists in Jenkinsfile, Jenkinsfile also needs modification when that domain changes
- **Analysis Method**: Using domain classification from [pipeline-sequence-diagrams/dlx-ci.md](../pipeline-sequence-diagrams/dlx-ci.md)

---

## 2. Functional Domains and Logic Presence

> Reference: [dlx-ci.md - Functional Domain Summary](../pipeline-sequence-diagrams/dlx-ci.md)

| Domain | Stage | Logic Exists in Jenkinsfile | Description |
|--------|-------|:------------------------:|------|
| Git Management | Prepare WORKSPACE, Post | ✗ | Delegated to Helper (`cloneOrUpdateRepo`, `checkoutBranch`) |
| Bitbucket API | Prepare WORKSPACE, Linting, Code Coverage, Build, Post | △ | Python script direct call (path/args hardcoded) |
| Unity CLI | Prepare WORKSPACE, EditMode, PlayMode, Code Coverage, Build | △ | `stageName`/`errorMsg` hardcoded, Helper call |
| Web Server (SSH/SCP) | Code Coverage, Build | △ | Report path/type hardcoded |
| Linting (Bash) | Linting | ○ | Bash script direct call, exitCode branch logic |
| Environment Setup | Prepare WORKSPACE | △ | `sh 'env'`, script loading path, directory creation |

(○: Logic exists, △: Partial (hardcoding/direct calls), ✗: Fully delegated to Helper)

---

## 3. Stage-by-Stage SRP Violation Analysis

### Change Reasons Summary by Stage

| Lines | Stage/Area | Change Reasons |
|-----|------|----------|
| 64-118 | `Prepare WORKSPACE` stage | **5 reasons**: env output policy + script loading path + branch check policy + Unity version detection policy + Rider sync policy |
| 119-167 | `Linting` stage | **5 reasons**: Directory structure + editorconfig path + Linting.bash script + exit code handling + Python report script |
| 172-187 | `EditMode Tests` stage | **3 reasons**: Test results directory + coverage results directory + Unity stage name/error message |
| 190-201 | `PlayMode Tests` stage | Unity stage name/error message |
| 204-227 | `Code Coverage` stage | **3 reasons**: Unity stage name/error message + report path/type + test report args |
| 229-258 | `Build Project` stage | **6 reasons**: Assets/Editor path + Builder.cs location + Unity stage name/error message + DEBUG_MODE handling + Python report script + build results path |

<details>
<summary>Multi-responsibility Area: <code>Prepare WORKSPACE</code> stage (5 change reasons)</summary>

```groovy
stage('Prepare WORKSPACE') {
    steps {
        dir("${PROJECT_DIR}") {
            script {
                sh 'env'                                              // Change reason 1: env output policy
                try {
                    generalUtil = load("${env.WORKSPACE}/groovy/generalHelper.groovy")  // Change reason 2: script loading path
                    unityUtil = load("${env.WORKSPACE}/groovy/unityHelper.groovy")
                    // ...
                } catch (Exception e) { ... }

                if (generalUtil.isBranchUpToDateWithRemote(PR_BRANCH) && !TEST_RUN.equals('Y')) {  // Change reason 3: branch check policy
                    // ...
                }
                // Helper function calls (excluded)
            }
        }

        // Unity Setup
        script {
            env.UNITY_EXECUTABLE = unityUtil.getUnityExecutable(env.WORKSPACE, PROJECT_DIR)  // Change reason 4: Unity version detection policy
        }

        // Initial running the project on Unity Editor
        dir("${PROJECT_DIR}") {
            script {
                env.UNITY_EXECUTABLE = unityUtil.getUnityExecutable(env.WORKSPACE, PROJECT_DIR)  // (duplicate call)
            }
            script {
                String stageName = 'Rider'
                String errorMassage = 'Synchronizing Unity and Rider IDE solution files failed'
                unityUtil.runUnityStage(stageName, errorMassage)  // Change reason 5: Rider sync policy
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When env output policy changes** (line 70): Debug output conditions
2. **When script loading path changes** (lines 72-73): Helper file location
3. **When branch check policy changes** (lines 82-86): Duplicate build prevention conditions
4. **When Unity version detection policy changes** (lines 101, 108): getUnityExecutable call method
5. **When Rider sync policy changes** (lines 112-114): runUnityStage('Rider') call

> Helper function calls (getFullCommitHash, initializeEnvironment, cloneOrUpdateRepo, mergeBranchIfNeeded) are generalHelper.groovy's responsibility, so excluded

</details>

<details>
<summary>Multi-responsibility Area: <code>Linting</code> stage (5 change reasons)</summary>

```groovy
stage('Linting') {
    steps {
        dir("${REPORT_DIR}") {
            sh 'mkdir -p linting_results'   // Change reason 1: lint results directory structure
        }
        echo 'running lint script'
        script {
            sh "cp -f '${env.WORKSPACE}/Bash/.editorconfig' '${PROJECT_DIR}' 2>/dev/null"  // Change reason 2: editorconfig path
            def exitCode = sh script: """sh '${env.WORKSPACE}/Bash/Linting.bash' \\
                '${PROJECT_DIR}' '${REPORT_DIR}/linting_results'""", returnStatus: true  // Change reason 3: Linting.bash script

            if (exitCode != 0) {
                if (exitCode == 2) {  // Change reason 4: exit code handling policy
                    sh script: """python '${env.WORKSPACE}/python/linting_error_report.py' \\
                        '${REPORT_DIR}/linting_results/format-report.json' \\
                        ${COMMIT_HASH} ${fail} '${PROJECT_DIR}'"""  // Change reason 5: Python report script
                }
                catchError(buildResult: buildResults.SUCCESS, stageResult: stageResults.FAILURE) {
                    error("Linting failed with exit code: ${exitCode}")
                }
            } else {
                sh script: """python '${env.WORKSPACE}/python/linting_error_report.py' ...
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When lint results directory structure changes** (line 123): Folder structure
2. **When editorconfig path changes** (line 127): Config file location
3. **When Linting.bash script changes** (lines 129-131): Bash script interface
4. **When exit code handling policy changes** (lines 133, 141): exit code branch
5. **When Python report script changes** (lines 143-146): Report generation args

</details>

<details>
<summary>Multi-responsibility Area: <code>EditMode Tests</code> stage (3 change reasons)</summary>

```groovy
stage('EditMode Tests') {
    steps {
        dir("${REPORT_DIR}") {
            sh 'mkdir -p test_results'      // Change reason 1: test results directory structure
            sh 'mkdir -p coverage_results'  // Change reason 2: coverage results directory structure
        }
        echo 'Running EditMode tests...'
        dir("${PROJECT_DIR}") {
            script {
                String stageName = 'EditMode'  // Change reason 3: Unity stage name/error message hardcoded
                String errorMassage = 'EditMode tests failed'
                unityUtil.runUnityStage(stageName, errorMassage)  // Helper call (excluded)
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When test results directory structure changes** (line 175): `test_results` folder structure
2. **When coverage results directory structure changes** (line 176): `coverage_results` folder structure
3. **When Unity stage name/error message changes** (lines 181-182): `stageName`, `errorMassage` hardcoded

</details>

<details>
<summary>Multi-responsibility Area: <code>Code Coverage</code> stage (3 change reasons)</summary>

```groovy
stage('Code Coverage\nSend Reports') {
    steps {
        dir("${PROJECT_DIR}") {
            echo 'Generating code coverage report...'
            script {
                String stageName = 'Coverage'  // Change reason 1: Unity stage name/error message
                String errorMassage = 'Code Coverage generation failed'
                unityUtil.runUnityStage(stageName, errorMassage)  // Helper call
            }

            echo 'Sending test report to Bitbucket.'
            script {
                generalUtil.publishTestResultsHtmlToWebServer(  // Change reason 2: report path/type hardcoded
                    FOLDER_NAME, TICKET_NUMBER,
                    "${REPORT_DIR}/coverage_results/Report", 'CodeCoverage'
                )
                unityUtil.sendTestReport(env.WORKSPACE, REPORT_DIR, COMMIT_HASH)  // Change reason 3: test report args
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When Unity stage name/error message changes** (lines 210-211): `stageName`, `errorMassage` hardcoded
2. **When report path/type changes** (lines 217-219): `coverage_results/Report`, `'CodeCoverage'` hardcoded
3. **When test report args change** (line 221): `sendTestReport` call args

</details>

<details>
<summary>Multi-responsibility Area: <code>Build Project</code> stage (6 change reasons)</summary>

```groovy
stage('Build Project') {
    steps {
        script {
            echo 'Building Unity project...'
            sh "mkdir -p \"${PROJECT_DIR}/Assets/Editor/\""  // Change reason 1: Assets/Editor path
            sh "cp Builder.cs \"${PROJECT_DIR}/Assets/Editor/\""  // Change reason 2: Builder.cs location

            String stageName = 'Webgl'  // Change reason 3: Unity stage name/error message
            String errorMassage = 'WebGL Build failed'
            unityUtil.runUnityStage(stageName, errorMassage)  // Helper call

            echo 'Sending Bitbucket WebGL build report'
            String pythonArgs = " ${COMMIT_HASH} ${REPORT_DIR}/build_project_results/*.log"

            if ((params.DEBUG_MODE ?: '').toUpperCase() == 'Y') {  // Change reason 4: DEBUG_MODE handling
                pythonArgs += ' --debug'
            }
            sh " python ${env.WORKSPACE}/python/create_bitbucket_webgl_build_report.py ${pythonArgs}"  // Change reason 5: Python report script

            generalUtil.publishBuildResultsToWebServer(FOLDER_NAME, TICKET_NUMBER,  // Change reason 6: build results path hardcoded
                "${PROJECT_DIR}/Builds", "${REPORT_DIR}/build_project_results")
        }
    }
}
```

**Change Reason Analysis:**
1. **When Assets/Editor path changes** (line 234): Directory structure
2. **When Builder.cs location changes** (line 235): Build script path
3. **When Unity stage name/error message changes** (lines 237-238): `stageName`, `errorMassage` hardcoded
4. **When DEBUG_MODE handling changes** (lines 247-249): Debug flag handling
5. **When Python report script changes** (line 251): Report generation
6. **When build results path changes** (lines 253-254): `${PROJECT_DIR}/Builds`, `build_project_results` hardcoded

</details>

---

## Conclusion

> **SRP Violation**:
> - **Logic from 5 domains exists in Jenkinsfile** (except Git Management)
> - **Linting Stage**: Bash script direct call + exitCode branch logic exists in Jenkinsfile
> - **Hardcoding in many Stages**: `stageName`/`errorMsg`, paths, Python script args, etc.
> - **Orchestration Role Violation**: Domain logic directly included in Jenkinsfile requires Jenkinsfile modification when that domain changes

---

[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)
