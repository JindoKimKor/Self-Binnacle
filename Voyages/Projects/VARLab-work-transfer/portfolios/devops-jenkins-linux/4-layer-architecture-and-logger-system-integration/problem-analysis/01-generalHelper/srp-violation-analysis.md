[← Overview](../README.md) | [Software Smells →](software-smells-analysis.md)

# groovy/generalHelper.groovy - SRP Violation Analysis

> **"Kitchen Sink" File** - Actual cohesion only 19% compared to design intent (common function collection) (656 lines)

---

## 1. SRP Violation Analysis Criteria

- **generalHelper Design Intent**: Since Unity Helper and JS Helper exist separately, generalHelper is designed to "collect only functions commonly used across all pipelines"
- **Cohesion Analysis Criteria**: "Is it actually used in all pipelines?" = Cohesion aligned with design intent

---

## 2. Cohesion and Change Reasons per Function

| # | Function Name | DLX CI | DLX CD | JS CI | JS CD | Pipeline | Change Reason |
|---|--------|:------:|:------:|:-----:|:-----:|:--------:|----------|
| 1 | `parseJson` | ○ | ○ | ○ | ○ | ○ | When Jenkins build/stage result constants are added/changed |
| 2 | `logMessage` | | | | | | When logging output format/style changes (internal use) |
| 3 | `cloneOrUpdateRepo` | ○ | ✗ | ○ | ✗ | ○ | When Git CLI commands, repository cleanup policies change |
| 4 | `getDefaultBranch` | ○ | ✗ | ○ | ✗ | ○ | When Git remote command output format changes |
| 5 | `initializeEnvironment` | ○ | ✗ | ○ | ✗ | ✗ | **2 reasons**: Environment variable setup + Bitbucket status API |
| 6 | `checkoutBranch` | ○ | ○ | ○ | ○ | ○ | When Git checkout/reset/clean workflow changes |
| 7 | `mergeBranchIfNeeded` | ○ | ✗ | ○ | ✗ | ✗ | When Git merge strategy/workflow changes |
| 8 | `isBranchUpToDateWithRemote` | | | | | | When Git fetch/rev-parse commands change (internal use) |
| 9 | `isBranchUpToDateWithMain` | | | | | | When Git merge-base command changes (internal use) |
| 10 | `tryMerge` | ○ | ✗ | ○ | ✗ | ✗ | When Git merge command/options change |
| 11 | `getFullCommitHash` | ○ | ○ | ○ | ○ | ○ | When Bitbucket API (Python script) interface changes |
| 12 | `getCurrentCommitHash` | | | | | | When Git rev-parse command changes (**Dead Code**) |
| 13 | `sendBuildStatus` | ○ | ○ | ○ | ○ | ○ | When Bitbucket build status API spec changes |
| 14 | `parseTicketNumber` | ○ | ✗ | ○ | ✗ | ✗ | When branch naming convention (ticket pattern) changes |
| 15 | `publishTestResultsHtmlToWebServer` | ○ | ✗ | ○ | ✗ | ✗ | When web server path/permission policy, SSH settings change |
| 16 | `publishBuildResultsToWebServer` | ○ | ✗ | ○ | ✗ | ✗ | When web server deployment path structure changes |
| 17 | `cleanMergedBranchFromWebServer` | ✗ | ○ | ✗ | ○ | ✗ | When web server cleanup path policy changes |
| 18 | `cleanUpPRBranch` | ✗ | ○ | ✗ | ○ | ✗ | **2 reasons**: Directory cleanup + Linux package management |
| 19 | `closeLogfiles` | | | | | | When lsof output format, process termination method changes (**Dead Code**) |
| 20 | `checkQualityGateStatus` | ○ | ✗ | ○ | ✗ | ✗ | **5 reasons**: SonarQube API + Retry + HTTP + JSON + Logging |
| 21 | `publishGroovyDocToWebServer` | ✗ | ✗ | ✗ | ✗ | ○ | When GroovyDoc deployment path/permission policy changes |

---

## 3. Module Level SRP Violation Analysis - Cohesion Analysis Results

- **100% Usage (4)**: `parseJson`, `checkoutBranch`, `getFullCommitHash`, `sendBuildStatus`
- **60% Usage (2)**: `cloneOrUpdateRepo`, `getDefaultBranch`
- **40% Usage (10)**: CI-only or CD-only functions
- **20% Usage (1)**: `publishGroovyDocToWebServer` (Pipeline only)
- **Dead Code (2)**: `getCurrentCommitHash`, `closeLogfiles`
- **Internal Use (3)**: `logMessage`, `isBranchUpToDateWithRemote`, `isBranchUpToDateWithMain`

> **SRP Violation**: Contrary to the design intent of "common function collection", only **4 out of 21 functions (19%) are 100% reused**. The remaining 81% are used only in specific pipelines.

---

## 4. Function Level SRP Violation Analysis - Functions with Multiple Change Reasons

<details>
<summary>Multi-responsibility Function: <code>initializeEnvironment()</code> (2 change reasons)</summary>

```groovy
void initializeEnvironment(String workspace, String commitHash, String prBranch) {
    echo "Sending 'In Progress' status to Bitbucket..."
    sendBuildStatus(workspace, 'INPROGRESS', commitHash)  // Change reason 1: Bitbucket status API
    env.TICKET_NUMBER = parseTicketNumber(prBranch)       // Change reason 2: Environment variable setup
    env.FOLDER_NAME = "${JOB_NAME}".split('/').first()
}
```

**Change Reason Analysis:**
1. **When Bitbucket status API changes** (line 137): `sendBuildStatus()` call method
2. **When environment variable setup method changes** (lines 138-139): `TICKET_NUMBER`, `FOLDER_NAME` setup

</details>

<details>
<summary>Multi-responsibility Function: <code>cleanUpPRBranch()</code> (2 change reasons)</summary>

```groovy
void cleanUpPRBranch(String prBranch) {
    // Change reason 1: find tool installation (Linux package management)
    def findPath = sh(script: 'command -v find', returnStdout: true).trim()
    if (!findPath) {
        echo "'find' directory searching tool is not found..."
        echo "Installing 'find' directory searching tool..."
        int installStatus = sh(script: 'sudo apt-get update && sudo apt-get install -y findutils', returnStatus: true)
        if (installStatus == 0 ) {
            echo "The 'findutils' package was installed successfully."
        } else {
            echo "Failed to install 'findutils'. Exit code: ${installStatus}"
            error "Installation failed with exit code: ${installStatus}"
        }
    }

    // Change reason 2: Directory cleanup policy
    def branchPaths = sh(script: "${findPath} ../ -type d -name \"${prBranch}\"", returnStdout: true).trim()
    if (!branchPaths.isEmpty()) {
        def paths = branchPaths.split('\n')
        paths.each { branchPath ->
            echo "Deleting Branch Path: ${branchPath}"
            sh(script: "rm -r -f \"${branchPath}\"", returnStatus: true)
            // ...
        }
    }
}
```

**Change Reason Analysis:**
1. **When Linux package management method changes** (lines 403-414): `apt-get` -> other package manager
2. **When directory cleanup policy changes** (lines 417-442): Search path, deletion conditions

</details>

<details>
<summary>Multi-responsibility Function: <code>checkQualityGateStatus()</code> (5 change reasons)</summary>

```groovy
Map checkQualityGateStatus(String projectKey, String adminToken) {
    // Change reason 1: SonarQube API URL
    String buildStatusURL = "http://localhost:9000/sonarqube/api/ce/component?component=${projectKey}"
    String qualityGateResultURL = "http://localhost:9000/sonarqube/api/qualitygates/project_status?projectKey=${projectKey}"

    // Change reason 2: Retry policy
    int maxRetries = 5

    for (int retryCount = 1; retryCount <= maxRetries; retryCount++) {
        // Change reason 3: HTTP client (using curl)
        def process = buildStatusAPIcall.execute()
        process.waitFor()

        // Change reason 4: JSON parsing + business logic
        def buildStatus = new JsonSlurperClassic().parseText(buildStatusResponse)
        if (buildStatus?.queue?.size() > 0) {
            sleep(10)  // Change reason 2: Wait time
            continue
        }

        // Change reason 5: Logging (10+ locations)
        logMessage("Send an HTTP GET request to SonarQube Server...")
    }
}
```

**Change Reason Analysis:**
1. **When SonarQube API URL changes** (lines 529-530): API path, port, host
2. **When retry policy changes** (lines 533, 568): Retry count, wait time
3. **When HTTP client changes** (lines 534, 542, 581, 586): curl -> HttpClient, etc.
4. **When JSON response structure changes** (lines 553, 560, 577, 597, 604): Parsing logic
5. **When logging format changes** (10+ locations): Log message format

**Additional Code Smell**: Long Method (94 lines)

</details>

---

## Conclusion

> **SRP Violation**:
> - **Module Level**: Only 19% of functions are 100% reused compared to "common function collection" design intent
> - **Function Level**: 3 functions have multiple change reasons (`initializeEnvironment`(2), `cleanUpPRBranch`(2), `checkQualityGateStatus`(5))
> - 2 Dead Code functions found
> - **"Kitchen Sink" Anti-pattern**

---

[← Overview](../README.md) | [Software Smells →](software-smells-analysis.md)
