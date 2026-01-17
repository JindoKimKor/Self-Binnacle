[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)

# groovy/jsHelper.groovy - SRP Violation Analysis

> **JS Pipeline Dedicated File** - CI/CD dedicated functions mixed (100% cohesion 50%) (356 lines)

---

## 1. SRP Violation Analysis Criteria

- **jsHelper Design Intent**: A file that collects functions dedicated to JS pipelines (CI/CD)
- **Cohesion Analysis Criteria**: "Is it used in both JS CI and JS CD?" = Cohesion aligned with design intent

---

## 2. Cohesion and Change Reasons per Function

| # | Function Name | JS CI | JS CD | Change Reason |
|---|--------|:-----:|:-----:|----------|
| 1 | `logMessage` | | | When logging output method changes (internal use, **duplicate with generalHelper**) |
| 2 | `findTestingDirs` | ○ | ○ | When package.json based project structure changes |
| 3 | `getPackageJsonVersion` | ✗ | ○ | When package.json version field access method changes |
| 4 | `installNpmInTestingDirs` | ○ | ○ | **3 reasons**: npm install + npm audit + Python script |
| 5 | `runUnitTestsInTestingDirs` | ○ | ○ | When npm test command/Jest configuration changes |
| 6 | `checkNodeVersion` | ○ | ○ | When Node/npm version check command changes |
| 7 | `runCommandReturnStatus` | | | When OS-specific command execution method changes (internal use) |
| 8 | `executeLintingInTestingDirs` | ○ | ○ | When npm lint command/ESLint configuration changes |
| 9 | `versionCompare` | ✗ | ○ | When semantic version comparison logic changes |
| 10 | `retrieveReportSummaryDirs` | ○ | ✗ | When Jest report file path/naming convention changes |

---

## 3. Module Level SRP Violation Analysis - Cohesion Analysis Results

- **100% Usage (5)**: `findTestingDirs`, `installNpmInTestingDirs`, `runUnitTestsInTestingDirs`, `checkNodeVersion`, `executeLintingInTestingDirs`
- **50% Usage (3)**: CD-only (`getPackageJsonVersion`, `versionCompare`), CI-only (`retrieveReportSummaryDirs`)
- **Internal Use (2)**: `logMessage`, `runCommandReturnStatus`

> **SRP Violation**: Meets design intent of JS-dedicated file, but CI-only/CD-only functions are mixed (low cohesion)

---

## 4. Function Level SRP Violation Analysis - Functions with Multiple Change Reasons

<details>
<summary>Multi-responsibility Function: <code>installNpmInTestingDirs()</code> (3 change reasons)</summary>

```groovy
void installNpmInTestingDirs(String testingDirs) {
    if (testingDirs == null || testingDirs.isEmpty()) {
        echo "Testing directories don't exist."
        return
    }
    List<String> testDirs = testingDirs.split(',') as List<String>
    for (String dirPath : testDirs) {
        File dir = new File(dirPath)
        if (!dir.exists() || !dir.isDirectory()) {
            echo "Directory does not exist: ${dirPath}. Skipping..."
            continue
        }

        // Change reason 1: npm audit policy
        String npmAuditCommand = "cd '${dirPath}' && npm audit --json > audit-report.json"
        echo "Running command: ${npmAuditCommand}"
        int exitCode = runCommandReturnStatus(npmAuditCommand)
        if (exitCode != 0) {
            echo "npm audit failed in directory: ${dirPath} with exit code: ${exitCode}. Proceeding with caution."
        }

        // Change reason 2: Python script interface
        File reportFile = new File("${dirPath}/audit-report.json")
        if (reportFile.exists()) {
            String pythonCommand = """python '${WORKSPACE}/python/npm_audit.py'
            '${COMMIT_HASH}' '${dirPath}/audit-report.json'
            """
            exitCode = sh(script: pythonCommand, returnStatus: true)
            // ...
        }

        // Change reason 3: npm install command
        String npmCommand = "cd '${dirPath}' && npm install"
        exitCode = runCommandReturnStatus(npmCommand)
        // ...
    }
}
```

**Change Reason Analysis:**
1. **When npm audit policy changes** (lines 80-85): audit command, options, report format
2. **When Python script interface changes** (lines 93-102): `npm_audit.py` argument format
3. **When npm install command changes** (lines 107-113): install options, error handling

</details>

---

## Conclusion

> **SRP Violation**:
> - **Module Level**: JS-dedicated but CI/CD-specific functions mixed (100% usage 50%, 50% usage 30%)
> - **Function Level**: 1 function has multiple change reasons (`installNpmInTestingDirs`(3))
> - `logMessage()` is an **exact copy** of generalHelper (DRY violation)

---

[← Overview](../README.md) | [Software Smells →](./software-smells-analysis.md)
