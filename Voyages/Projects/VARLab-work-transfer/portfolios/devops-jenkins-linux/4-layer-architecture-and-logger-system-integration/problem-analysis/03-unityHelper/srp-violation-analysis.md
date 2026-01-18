[← Overview](../detailed-analysis.md) | [Software Smells →](./software-smells-analysis.md)

# groovy/unityHelper.groovy - SRP Violation Analysis

> **DLX Pipeline Dedicated File** - CI-only functions mixed (100% cohesion 50%) (357 lines)

---

## 1. SRP Violation Analysis Criteria

- **unityHelper Design Intent**: A file that collects functions dedicated to DLX (Unity) pipelines (CI/CD)
- **Cohesion Analysis Criteria**: "Is it used in both DLX CI and DLX CD?" = Cohesion aligned with design intent

---

## 2. Cohesion and Change Reasons per Function

| # | Function Name | DLX CI | DLX CD | Change Reason |
|---|--------|:------:|:------:|----------|
| 1 | `sendTestReport` | ○ | ○ | When Bitbucket test report Python script interface changes |
| 2 | `getUnityExecutable` | ○ | ○ | **2 reasons**: Unity version Python + Unity Hub CLI installation |
| 3 | `runUnityStage` | ○ | ○ | When Unity batch mode error handling policy changes |
| 4 | `runUnityBatchMode` | ○ | ○ | **7+ reasons**: Log path + Test platform + Coverage + Stage-specific args + Unity CLI + xvfb-run + New Stage |
| 5 | `getCodeCoverageArguments` | ○ | ✗ | When Unity Code Coverage package options change |
| 6 | `fetCoverageOptionsKeyAndValue` | ○ | ✗ | When Stage-specific coverage option rules change |
| 7 | `loadPathsToExclude` | ○ | ✗ | When Unity Code Coverage Settings.json structure changes |
| 8 | `buildCoverageOptions` | ○ | ✗ | When coverage options string format changes |

---

## 3. Module Level SRP Violation Analysis - Cohesion Analysis Results

- **100% Usage (4)**: `sendTestReport`, `getUnityExecutable`, `runUnityStage`, `runUnityBatchMode`
- **50% Usage (4)**: CI-only coverage functions

> **SRP Violation**: DLX-dedicated but CI-only functions (4 Code Coverage related) are mixed without separate separation

---

## 4. Function Level SRP Violation Analysis - Functions with Multiple Change Reasons

<details markdown>
<summary>Multi-responsibility Function: <code>getUnityExecutable()</code> (2 change reasons)</summary>

```groovy
String getUnityExecutable(workspace, projectDir) {
    try {
        // Change reason 1: Unity version Python script
        def unityExecutable = sh(script: "python '${workspace}/python/get_unity_version.py' '${projectDir}' executable-path",
        returnStdout: true).trim()

        if (!fileExists(unityExecutable)) {
            def version = sh(script: "python '${workspace}/python/get_unity_version.py' '${projectDir}' version",
             returnStdout: true).trim()
            def revision = sh(script: "python '${workspace}/python/get_unity_version.py' '${projectDir}' revision",
             returnStdout: true).trim()

            // Change reason 2: Unity Hub CLI installation command
            echo "Unity Editor version ${version} not found. Attempting installation..."
            def installCommand = """\"C:\\Program Files\\Unity Hub\\Unity Hub.exe\" \\
            -- --headless install \\
            --version ${version} \\
            --changeset ${revision}"""
            def exitCode = sh(script: installCommand, returnStatus: true)
            // ...

            echo 'Installing WebGL Build Support...'
            def webglInstallCommand = """\"C:\\Program Files\\Unity Hub\\Unity Hub.exe\" \\
            -- --headless install-modules \\
            --version ${version} \\
            -m webgl"""
            // ...
        }
        return unityExecutable
    } catch (Exception e) {
        error("An error occurred while retrieving or installing Unity executable: ${e.getMessage()}")
    }
}
```

**Change Reason Analysis:**
1. **When Unity version Python script changes** (lines 37-45): `get_unity_version.py` arguments/output format
2. **When Unity Hub CLI installation command changes** (lines 48-65): Unity Hub path, CLI options, module installation

</details>

<details markdown>
<summary>Multi-responsibility Function: <code>runUnityBatchMode()</code> (7+ change reasons)</summary>

```groovy
int runUnityBatchMode(String unityExecutable, String projectDirectory, String reportDirectory, String stageName) {
    String batchModeBaseCommand = ''
    String logFilePath = ''
    String logFileUrl = ''
    String testRunArgs = ''
    String codeCoverageArgs = ''
    String additionalArgs = ''
    String finalCommand = ''

    // Change reason 1: Log path rules
    Closure setLogFilePathAndUrl = { String prBranch, String reportDir, String stage ->
        String jobName = CI_PIPELINE ? 'PRJob' : 'DeploymentJob'
        Map logConfig = [
            (EDIT_MODE): [
                path: "${reportDir}/test_results/${stage}-tests.log",
                url: "${env.BUILD_URL}execution/node/3/ws/${jobName}/${prBranch}/test_results/${stage}-tests.log"
            ],
            // ... Stage-specific settings
        ]
        logFilePath = logConfig[stage].path
        logFileUrl = logConfig[stage].url
    }

    // Change reason 2: Test platform arguments
    Closure<String> getTestRunArgs = { String reportDir, String stage ->
        return "-testPlatform ${stage} -runTests -testResults ${reportDir}/test_results/${stage}-results.xml"
    }

    // Change reason 3: Stage-specific additional arguments (Webgl, Rider)
    Closure<String> getAdditionalArgs = { String stage ->
        Map argsMap = [
            Webgl: '-buildTarget WebGL -executeMethod Builder.BuildWebGL',
            Rider: '-executeMethod Packages.Rider.Editor.RiderScriptEditor.SyncSolution'
        ]
        return argsMap[stage] ?: ''
    }

    setLogFilePathAndUrl(PR_BRANCH, reportDirectory, stageName)

    // Change reason 4: Unity CLI base arguments
    batchModeBaseCommand = "${unityExecutable} -projectPath ${projectDirectory} -batchmode -logFile ${logFilePath}"

    // Change reason 5: Coverage arguments
    testRunArgs = [EDIT_MODE, PLAY_MODE].contains(stageName) ? getTestRunArgs(reportDirectory, stageName) : ''
    codeCoverageArgs = [EDIT_MODE, PLAY_MODE, COVERAGE].contains(stageName) ?
        getCodeCoverageArguments(projectDirectory, reportDirectory, stageName) : ''
    additionalArgs = [WEBGL, RIDER].contains(stageName) ? getAdditionalArgs(stageName) : ''

    // Change reason 6: Graphics options (-nographics, xvfb-run)
    finalCommand = (stageName != WEBGL && stageName != PLAY_MODE)
        ? (finalCommand + ' -nographics')
        : ('/usr/bin/xvfb-run -a ' + finalCommand)

    // Change reason 7: When adding new Stage type (all branches)
    finalCommand += (stageName != PLAY_MODE && stageName != EDIT_MODE) ? ' -quit' : ''

    int exitCode = sh(script: "${finalCommand}", returnStatus: true)
    return exitCode
}
```

**Change Reason Analysis:**
1. **When log path rules change** (lines 135-170): Stage-specific log path/URL mapping
2. **When test platform arguments change** (lines 179-183): `-testPlatform`, `-runTests` options
3. **When Stage-specific additional arguments change** (lines 191-197): Webgl/Rider dedicated options
4. **When Unity CLI base arguments change** (lines 203-206): `-batchmode`, `-logFile`
5. **When coverage arguments change** (lines 209-213): `getCodeCoverageArguments()` call
6. **When xvfb-run options change** (lines 229-231): Graphics environment settings
7. **When adding new Stage type** (entire function): New type must be added to all conditions/mappings

</details>

---

## Conclusion

> **SRP Violation**:
> - **Module Level**: DLX-dedicated but CI-only functions (4 Code Coverage) mixed without separation (100% usage 50%)
> - **Function Level**: 2 functions have multiple change reasons (`getUnityExecutable`(2), `runUnityBatchMode`(7))
> - `runUnityBatchMode` has **Long Method** smell + **7+ locations need modification when adding new Stage** (Shotgun Surgery risk)

---

[← Overview](../detailed-analysis.md) | [Software Smells →](./software-smells-analysis.md)
