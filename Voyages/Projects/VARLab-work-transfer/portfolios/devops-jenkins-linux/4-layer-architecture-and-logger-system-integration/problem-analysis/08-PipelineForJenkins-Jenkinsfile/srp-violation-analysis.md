[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)

# PipelineForJenkins/Jenkinsfile (315 lines)

---

## 1. SRP Violation Analysis Criteria

- **Jenkinsfile Role**: Orchestration (pipeline sequence/flow control)
- **SRP Violation Condition**: If actual Logic exists in Jenkinsfile, Jenkinsfile modification is required when that domain changes
- **Analysis Method**: Using domain classification from [pipeline-sequence-diagrams/jenkins-ci.md](../pipeline-sequence-diagrams/jenkins-ci.md)

---

## 2. Functional Domains and Logic Presence

> Reference: [jenkins-ci.md - Functional Domain Summary](../pipeline-sequence-diagrams/jenkins-ci.md)

| Domain | Stage | Logic Exists in Jenkinsfile | Description |
|--------|-------|:------------------------:|------|
| Git Management | Prepare WORKSPACE, Post | ✗ | Delegated to Helper (`cloneOrUpdateRepo`, `checkoutBranch`) |
| Bitbucket API | Prepare WORKSPACE, Post | △ | Direct Python script calls (path/arguments hardcoded) |
| Docker | Lint Groovy Code | ○ | Direct Docker container execution, npm-groovy-lint command direct call |
| Gradle | Run Unit Tests, Generate Groovydoc | ○ | Direct gradle test/groovydoc command calls |
| Groovydoc | Generate Groovydoc | ○ | find command + groovydoc options directly constructed |
| Web Server (SSH/SCP) | Generate Groovydoc | △ | `publishGroovyDocToWebServer` Helper call (path hardcoded) |
| SonarQube | Static Analysis | ○ | `sonar-scanner` config directly constructed, Quality Gate logic |
| Environment Config | Prepare WORKSPACE | △ | Script loading paths, JSON parsing, error handling policy |

(○: Logic exists, △: Partially exists (hardcoded/direct calls), ✗: Fully delegated to Helper)

---

## 3. Stage-by-Stage SRP Violation Analysis

### Change Reasons Summary by Stage

| Lines | Stage/Area | Change Reasons |
|-----|------|----------|
| 66-104 | `Prepare Workspace` | **4 reasons**: Script loading paths + JSON parsing logic + branch check policy + error handling policy |
| 93-95 | Duplicate checkout | **Logic error**: checkout already performed inside `cloneOrUpdateRepo` → unnecessary duplicate call |
| 105-193 | `Lint Groovy Code` | **5 reasons**: Docker info output + Groovy lint config + Groovy lint result handling + Jenkinsfile lint config + Jenkinsfile lint result handling |
| 115-145 vs 150-190 | Groovy vs Jenkinsfile lint | **Same pattern repeated** → code copy-paste required when adding new lint type |
| 194-225 | `Generate Groovydoc` | **2 reasons**: groovy file search method + groovydoc command options |
| 227-232 | `Run Unit Tests` stage | gradle test command |
| 234-240 | `Publish Test Results` stage | junit test result path |
| 242-286 | `Static Analysis` | **3 reasons**: catchError error handling policy + SonarQube scanner config + Quality Gate check logic |

<details>
<summary>Multiple Responsibility Area: <code>Prepare Workspace</code> (4 change reasons)</summary>

```groovy
stage('Prepare Workspace') {
    steps {
        script {
            dir("${PROJECT_DIR}") {
                try {
                    echo 'Preparing the workspace...'
                    generalUtil = load("${env.WORKSPACE}/groovy/generalHelper.groovy")  // Change reason 1: Script loading path

                    buildResults = generalUtil.parseJson().buildResults  // Change reason 2: JSON parsing logic
                    stageResults = generalUtil.parseJson().stageResults

                    if (generalUtil.isBranchUpToDateWithRemote(PR_BRANCH) && !TEST_RUN.equals('Y')) {  // Change reason 3: Branch check policy
                        echo 'Local branch commit is up to date with remote branch, no changes. Aborting pipeline.'
                        currentBuild.result = buildResults.ABORTED
                        error('Branch is up to date, no changes.')
                    }

                    COMMIT_HASH = generalUtil.getFullCommitHash(env.WORKSPACE, PR_COMMIT)  // Helper call (excluded)

                    generalUtil.initializeEnvironment(env.WORKSPACE, COMMIT_HASH, PR_BRANCH)  // Helper call (excluded)

                    echo 'Cloning or updating repository...'
                    generalUtil.cloneOrUpdateRepo(PROJECT_TYPE, env.WORKSPACE, PROJECT_DIR, REPO_SSH, params.PR_BRANCH)  // Helper call (excluded)

                    echo "Checking out branch ${params.PR_BRANCH}..."
                    dir(PROJECT_DIR) {
                        generalUtil.checkoutBranch(PROJECT_DIR, params.PR_BRANCH)  // Helper call (excluded)
                    }
                } catch (Exception e) {  // Change reason 4: Error handling policy
                    echo "Error in Prepare Workspace stage: ${e.getMessage()}"
                    currentBuild.result = buildResults.FAILURE
                    error("Workspace preparation failed: ${e.getMessage()}")
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When script loading path changes** (line 72): Helper file location
2. **When JSON parsing logic changes** (lines 75-76): Constants structure
3. **When branch check policy changes** (lines 78-82): Duplicate build prevention condition
4. **When error handling policy changes** (lines 96-100): catch block handling method

> Helper function calls (`getFullCommitHash`, `initializeEnvironment`, `cloneOrUpdateRepo`, `checkoutBranch`) are generalHelper.groovy's responsibility, so excluded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Lint Groovy Code</code> (5 change reasons)</summary>

```groovy
stage('Lint Groovy Code') {
    steps {
        script {
            sh 'docker info'  // Change reason 1: Docker info output
            echo 'Running groovy lint using Docker image nvuillam/npm-groovy-lint with disabled entrypoint'
            def imageStr = 'nvuillam/npm-groovy-lint'
            def entrypointStr = '--entrypoint=""'

            // Change reason 2: Groovy lint config
            def exitCodeGroovy = docker.image(imageStr).inside(entrypointStr) {
                return sh(
                    returnStatus: true,
                    script: """
                        echo "Linting Groovy scripts in ${PROJECT_DIR}/groovy ..."
                        npm-groovy-lint \\
                            --failon error \\
                            --output groovy-lint-report.json \\
                            --config ${PROJECT_DIR}/.groovylintrc.groovy.json \\
                            ${PROJECT_DIR}/groovy
                    """
                )
            }

            // Change reason 3: Groovy lint result handling
            if (exitCodeGroovy != 0) {
                echo "Linting errors in Groovy scripts. Calling Python script with 'Fail'."
                sh script: """\\
                    python '${env.WORKSPACE}/python/Lint_groovy_report.py' \\
                    '${env.WORKSPACE}/groovy-lint-report.json' ...
                """.stripIndent()

                catchError(buildResult: buildResults.SUCCESS, stageResult: stageResults.FAILURE) {
                    error("Groovy linting failed (exit code ${exitCodeGroovy})")
                }
            }

            // Change reason 4: Jenkinsfile lint config (same pattern as Groovy repeated)
            def exitCodeJenkins = docker.image(imageStr).inside(entrypointStr) {
                return sh(
                    returnStatus: true,
                    script: """
                        echo "Linting Jenkinsfiles in DLXJenkins, JsJenkins, PipelineForJenkins ..."
                        npm-groovy-lint \\
                            --failon error \\
                            --output jenkins-lint-report.json \\
                            --config ${PROJECT_DIR}/.groovylintrc.jenkins.json \\
                            ${PROJECT_DIR}/DLXJenkins \\
                            ${PROJECT_DIR}/JsJenkins \\
                            ${PROJECT_DIR}/PipelineForJenkins
                    """
                )
            }

            // Change reason 5: Jenkinsfile lint result handling (same pattern as Groovy repeated)
            if (exitCodeJenkins != 0 || exitCodeGroovy != 0) {
                echo "Linting errors in Jenkinsfiles. Calling Python script with 'Fail'."
                sh script: """\\
                    python '${env.WORKSPACE}/python/Lint_groovy_report.py' ...
                """.stripIndent()
                // ...
            } else {
                echo "No Jenkinsfile lint errors. Calling Python script with 'Pass'."
                sh script: """\\
                    python '${env.WORKSPACE}/python/Lint_groovy_report.py' ...
                """.stripIndent()
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When Docker info output changes** (line 109): Debug output condition
2. **When Groovy lint config changes** (lines 115-127): Docker image, lint options, config file
3. **When Groovy lint result handling changes** (lines 131-145): Python script call, error handling
4. **When Jenkinsfile lint config changes** (lines 150-164): **Almost identical code repeated from Groovy**
5. **When Jenkinsfile lint result handling changes** (lines 168-190): **Almost identical code repeated from Groovy**

**Note:** Groovy lint and Jenkinsfile lint use **almost identical patterns** (lines 115-145 vs 150-190)

</details>

<details>
<summary>Multiple Responsibility Area: <code>Generate Groovydoc</code> (2 change reasons)</summary>

```groovy
stage('Generate Groovydoc') {
    steps {
        script {
            echo 'Generating Groovydoc...'
            dir(PROJECT_DIR) {
                // Change reason 1: groovy file search method
                def fileList = sh(
                    script: "find ${PROJECT_DIR}/groovy -type f -name '*.groovy'",
                    returnStdout: true).trim()

                if (!fileList) {
                    error "No .groovy files found in ${PROJECT_DIR}/groovy"
                }

                echo "Files found for Groovydoc: ${fileList}"

                // Change reason 2: groovydoc command options
                sh """
                mkdir -p ${REPORT_DIR}
                groovydoc -verbose -d ${REPORT_DIR} ${fileList.replaceAll('\\\\s+', ' ')}
                """

                echo "Documentation generated at ${REPORT_DIR}"

                // Helper call (excluded)
                if (params.PR_STATE == 'MERGED') {
                    generalUtil.publishGroovyDocToWebServer(REPORT_DIR)
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When groovy file search method changes** (lines 200-202): `find` command options
2. **When groovydoc command options change** (lines 212-214): Output options, file handling

> Helper function call (`publishGroovyDocToWebServer`) is generalHelper.groovy's responsibility, so excluded

</details>

<details>
<summary>Multiple Responsibility Area: <code>Static Analysis</code> (3 change reasons)</summary>

```groovy
stage('Static Analysis') {
    steps {
        dir("${PROJECT_DIR}") {
            script {
                sh 'pwd'
                // Change reason 1: catchError error handling policy (typo: buildResults → stageResults)
                catchError(buildResults: buildResults.SUCCESS, stageResults: stageResults.FAILURE) {
                    String scannerHome = tool SONARQUBE_SCANNER
                    echo "SonarQube scanner located at: ${scannerHome}"

                    // Change reason 2: SonarQube scanner config
                    withSonarQubeEnv(SONARQUBE_SERVER) {
                        String sonarCommand = "\"${scannerHome}/bin/sonar-scanner\" " +
                            "\"-Dsonar.projectKey=${env.SONAR_PROJECT_KEY}\" " +
                            '"-Dsonar.host.url=http://localhost:9000/sonarqube" ' +
                            '"-Dsonar.sources=." ' +
                            '"-Dsonar.log.level=DEBUG" ' +
                            '"-Dsonar.verbose=true" ' +
                            '"-Dsonar.lang.patterns.grvy="**/*.groovy,**/Jenkinsfile,**/JenkinsfileDeployment"" ' +
                            '"-Dsonar.exclusions=**/python/log-template/logs.html,**/Builder.cs,**/build.gradle,**/Bash/**" ' +
                            '"-Dsonar.python.version=3.10"'

                        echo "Executing SonarQube scanner with command: ${sonarCommand}"
                        sh sonarCommand
                    }
                }
            }
        }

        withCredentials([string(credentialsId: 'SonarQube', variable: 'SONAR_QUBE_AUTH_TOKEN')]) {
            script {
                // Change reason 3: Quality Gate check logic
                catchError(buildResults: buildResults.SUCCESS, stageResults: stageResults.FAILURE) {
                    Map status = generalUtil.checkQualityGateStatus(SONAR_PROJECT_KEY, env.SONAR_QUBE_AUTH_TOKEN)  // Helper call

                    final String STATUS_OK = 'OK'

                    if ((status.entireCodeStatus != STATUS_OK) || (status.newCodeStatus != STATUS_OK)) {
                        echo "Entire Code Status: ${status.entireCodeStatus}, New Code Status: ${status.newCodeStatus}"
                        error('Quality gate failed!')
                    } else {
                        echo 'Quality gate passed!'
                    }
                }
            }
        }
    }
}
```

**Change Reason Analysis:**
1. **When catchError error handling policy changes** (lines 247, 271): buildResult/stageResult settings (**typo present**)
2. **When SonarQube scanner config changes** (lines 252-260): Scanner options, paths, exclusion patterns
3. **When Quality Gate check logic changes** (lines 272-281): Status comparison conditions, error messages

**Note:** **Typo** present at line 247 - `buildResults` → `buildResult`, `stageResults` → `stageResult`

</details>

---

## Conclusion

> **SRP Violation**:
> - **Logic from 5 domains exists in Jenkinsfile** (Git management excluded)
> - **Docker domain**: Direct npm-groovy-lint container execution, lint command direct calls
> - **Lint Groovy Code Stage**: Groovy/Jenkinsfile lint same pattern repeated (code copy-paste required when adding new type)
> - **Static Analysis Stage**: SonarQube scanner config directly exists in Jenkinsfile
> - **Orchestration Role Violation**: Domain logic directly included in Jenkinsfile, requiring Jenkinsfile modification when that domain changes

---

[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)
