[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)

# PipelineForJenkins/Jenkinsfile - Design Smells Symptoms Analysis

> **Source**: Martin, R.C. (2000). *Design Principles and Design Patterns*
>
> Symptoms analysis based on static analysis results (SRP, Software Smells, DRY) + code review

---

## Summary

| Symptom | Severity | Key Evidence |
|---------|:------:|----------|
| Rigidity | **Medium** | Shotgun Surgery (4 locations to modify when adding lint type) |
| Fragility | **High** | 5 domains mixed, 9 implicit dependencies |
| Immobility | **High** | 315 lines/6 Stages, entire pipeline library CI orchestration |
| Viscosity | **Medium** | Missing Encapsulation → copying Groovy/Jenkinsfile lint is easier |
| Needless Complexity | **Low** | Not applicable |
| Needless Repetition | **High** | DRY violation (Groovy/Jenkinsfile lint pattern 60 lines repeated) |
| Opacity | **Low** | Not applicable |

---

## Inference Evidence

| Symptom | Evidence | Source |
|---------|------|------|
| Rigidity | [Shotgun Surgery](software-smells-analysis.md#11-change-preventers) 4 locations to modify when adding lint type | Code Smells |
| Fragility | [Divergent Change](software-smells-analysis.md#11-change-preventers) 5 domains + [Implicit Dependency](software-smells-analysis.md#31-dependency-issues) 9 | Code Smells + Arch Smells |
| Immobility | [Multifaceted Abstraction](software-smells-analysis.md#21-abstraction-smells) pipeline library CI orchestration | Design Smells |
| Viscosity | [Missing Encapsulation](software-smells-analysis.md#22-encapsulation-smells) lint execution pattern not encapsulated | Design Smells |
| Needless Complexity | Not applicable | - |
| Needless Repetition | [Duplicated Code](software-smells-analysis.md#12-dispensables) Groovy/Jenkinsfile pattern 2 times | Code Smells |
| Opacity | Not applicable | - |

---

## 1. Rigidity

> **Definition**: Changing one place requires cascading changes in other places
>
> **Symptom**: "Thought it was a simple change but it was much more complex"

### Inference Evidence: Shotgun Surgery

**Locations needing modification when adding new lint type (e.g., 'Python')**:

| Location | Modification Content |
|------|----------|
| Docker image variable | Add `def pythonImageStr = '...'` |
| Lint execution block | Add new `exitCodePython` variable and execution block (30+ lines) |
| Result handling condition | Add `|| exitCodePython != 0` |
| Python report script | Add new argument/call |

**Conclusion**: 4 locations need modification when adding new lint type → **Medium Rigidity**

---

## 2. Fragility

> **Definition**: Modifying one place breaks conceptually unrelated places
>
> **Symptom**: "Why did that break when I touched this?"

### Inference Evidence: Divergent Change + Implicit Cross-module Dependency

**5 domains mixed in one file**:
- Jenkins environment config, Git/Bitbucket, Code quality (Groovy lint), Documentation (Groovydoc), SonarQube

**9 implicit dependencies**:
- `generalHelper.groovy`
- `python/Lint_groovy_report.py`
- Docker image (`nvuillam/npm-groovy-lint`)
- `.groovylintrc.groovy.json`, `.groovylintrc.jenkins.json`
- SonarQube Scanner, SonarQube API
- Jenkins Tools (`groovy 'Groovy'`, `jdk 'JDK 17'`)
- Jenkins Pipeline DSL

**Potential Fragility scenarios**:

| Change | Expected Impact | Actual Impact (Inferred) |
|------|----------|-----------------|
| npm-groovy-lint Docker image update | Lint Groovy Code | Both Groovy/Jenkinsfile affected |
| Lint config file format change | Lint Groovy Code | Affected lint type failure |
| Python script argument change | Lint Groovy Code | Report generation failure |

**Conclusion**: 5 domains mixed + 9 implicit dependencies → **High Fragility**

---

## 3. Immobility

> **Definition**: Difficult to extract useful parts and reuse in other systems/modules
>
> **Symptom**: "Too many dependencies come along when trying to separate"

### Inference Evidence: Multifaceted Abstraction

**Entire pipeline library CI orchestration**:
- Single 315-line Jenkinsfile handles entire Helper file CI flow
- Groovy/Jenkinsfile lint mixed in single Stage

**Problems when attempting separation**:

| Extraction Target | Dependencies That Follow |
|----------|----------------|
| PrepareStage | generalUtil loading, branch check, Git workflow |
| LintStage | Docker image, lint config files, Python report script |
| DocStage | groovydoc command, web server deployment |
| AnalysisStage | SonarQube Scanner, SonarQube API, generalUtil |

**Conclusion**: Entire pipeline library CI in single file → **High Immobility**

---

## 4. Viscosity

> **Definition**: The right way (preserving design) is harder than the wrong way (hacking)
>
> **Symptom**: "It takes too long to do it properly, so let's just do it this way for now"

### Inference Evidence: Missing Encapsulation → DRY Violation Induced

**Current state (Missing Encapsulation)**:
- Groovy/Jenkinsfile lint execution pattern repeated 2 times (30 lines each)
- Result handling pattern repeated 2 times

**Right way vs Hacking**:

| Situation | Right Way | Hack | Tendency |
|------|------------|------|----------|
| Add new lint type | Create lint function and call | Copy-paste existing 30 lines | Copy (faster) |
| Change lint options | Modify function | Manually modify 2 places | Manual (faster) |

**Conclusion**: Lack of encapsulation makes "copying is easier" structure → **Medium Viscosity**

---

## 5. Needless Complexity

> **Definition**: Excessive design for features not currently needed
>
> **Symptom**: YAGNI violation, "might need it later"

### Inference Evidence

**Dead Code or excessive design**: Not applicable

**Conclusion**: **Low Needless Complexity**

---

## 6. Needless Repetition

> **Definition**: Code that could be unified through abstraction is duplicated in multiple places
>
> **Symptom**: DRY violation, "similar code in multiple places"

### Inference Evidence: Duplicated Code

**Groovy/Jenkinsfile lint pattern repeated 2 times** (60 lines duplicated):

| Type | Line Numbers | Pattern |
|------|--------|------|
| Groovy | 115-145 | `docker.image().inside()` + `sh npm-groovy-lint` + `if (exitCode != 0) { Python + catchError }` |
| Jenkinsfile | 150-190 | Same pattern, only config file/target paths differ |

**Improvement direction**:
```groovy
def runLint(configFile, targetPaths, reportFile, lintType) {
    def exitCode = docker.image(LINT_IMAGE).inside(ENTRYPOINT) {
        return sh(returnStatus: true, script: """
            npm-groovy-lint --failon error --output ${reportFile} \\
                --config ${PROJECT_DIR}/${configFile} ${targetPaths.join(' ')}
        """)
    }
    processLintResult(exitCode, reportFile, lintType)
    return exitCode
}
```

**Conclusion**: Groovy/Jenkinsfile pattern 60 lines duplicated → **High Needless Repetition**

---

## 7. Opacity

> **Definition**: Code is hard to understand and intent is unclear
>
> **Symptom**: "What does this code do?"

### Inference Evidence

**Code review result**: Not applicable

**Conclusion**: **Low Opacity**

---

[← SRP Analysis](srp-violation-analysis.md) | [Software Smells →](software-smells-analysis.md)
