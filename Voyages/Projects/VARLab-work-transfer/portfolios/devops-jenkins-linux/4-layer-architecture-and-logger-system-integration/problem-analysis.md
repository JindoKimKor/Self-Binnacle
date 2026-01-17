# Problem Analysis: Baseline Code Analysis

> **Analysis Target**: Commit [`74fc356`](https://github.com/JindoKimKor/devops-jenkins-linux/tree/74fc3563713df593f070f1c418ef9ee68f2682ed) (2025-03-20) @ [repos/devops-jenkins-linux](../../repos/devops-jenkins-linux)
> **Total Code**: 2,975 lines across 8 files

---

## Overview

Technical debt analysis of 5 pipelines (DLX CI/CD, JS CI/CD, PipelineForJenkins) that grew over **14 months** with focus on feature additions.

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Lines of Code | 2,975 lines |
| Helper Files | 1,369 lines (46%) |
| Jenkinsfile | 1,606 lines (54%) |
| Identified Issues | **51** (High 20, Medium 23, Low 8) |

### Project Structure

```
devops-jenkins-linux/
├── groovy/                              # Helper files (1,369 lines, 46%)
│   ├── generalHelper.groovy      656 lines    ← Kitchen Sink (19% cohesion)
│   ├── unityHelper.groovy        357 lines    ← Unity specific
│   └── jsHelper.groovy           356 lines    ← JS Web specific
├── DLXJenkins/                          # Unity pipeline (551 lines)
│   ├── Jenkinsfile               286 lines    ← CI
│   └── JenkinsfileDeployment     265 lines    ← CD
├── JsJenkins/                           # JS Web pipeline (740 lines)
│   ├── Jenkinsfile               314 lines    ← CI
│   └── JenkinsfileDeployment     426 lines    ← CD
└── PipelineForJenkins/                  # Jenkins self pipeline (315 lines)
    └── Jenkinsfile               315 lines    ← CI only
```

---

## Detailed Analysis Documents

👉 **[Problem Analysis Summary (README)](problem-analysis/README.md)** - Complete list of 51 issues with severity classification

### Per-File Analysis

| # | File | SRP Analysis | Software Smells | Design Symptoms |
|---|------|--------------|-----------------|-----------------|
| 01 | generalHelper.groovy | [srp-violation-analysis.md](problem-analysis/01-generalHelper/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/01-generalHelper/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/01-generalHelper/design-smells-symptoms.md) |
| 02 | jsHelper.groovy | [srp-violation-analysis.md](problem-analysis/02-jsHelper/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/02-jsHelper/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/02-jsHelper/design-smells-symptoms.md) |
| 03 | unityHelper.groovy | [srp-violation-analysis.md](problem-analysis/03-unityHelper/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/03-unityHelper/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/03-unityHelper/design-smells-symptoms.md) |
| 04 | DLXJenkins/Jenkinsfile | [srp-violation-analysis.md](problem-analysis/04-DLXJenkins-Jenkinsfile/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/04-DLXJenkins-Jenkinsfile/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/04-DLXJenkins-Jenkinsfile/design-smells-symptoms.md) |
| 05 | DLXJenkins/JenkinsfileDeployment | [srp-violation-analysis.md](problem-analysis/05-DLXJenkins-JenkinsfileDeployment/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/05-DLXJenkins-JenkinsfileDeployment/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/05-DLXJenkins-JenkinsfileDeployment/design-smells-symptoms.md) |
| 06 | JsJenkins/Jenkinsfile | [srp-violation-analysis.md](problem-analysis/06-JsJenkins-Jenkinsfile/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/06-JsJenkins-Jenkinsfile/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/06-JsJenkins-Jenkinsfile/design-smells-symptoms.md) |
| 07 | JsJenkins/JenkinsfileDeployment | [srp-violation-analysis.md](problem-analysis/07-JsJenkins-JenkinsfileDeployment/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/07-JsJenkins-JenkinsfileDeployment/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/07-JsJenkins-JenkinsfileDeployment/design-smells-symptoms.md) |
| 08 | PipelineForJenkins/Jenkinsfile | [srp-violation-analysis.md](problem-analysis/08-PipelineForJenkins-Jenkinsfile/srp-violation-analysis.md) | [software-smells-analysis.md](problem-analysis/08-PipelineForJenkins-Jenkinsfile/software-smells-analysis.md) | [design-smells-symptoms.md](problem-analysis/08-PipelineForJenkins-Jenkinsfile/design-smells-symptoms.md) |

### System-Level Analysis

- [DRY Violation Analysis](problem-analysis/DRY-violation-analysis.md) - Duplication patterns across pipelines/helpers
- [Pipeline Sequence Diagrams](problem-analysis/pipeline-sequence-diagrams/) - Call flow visualization by pipeline
- [Software Smells Taxonomy](problem-analysis/reference/) - Theoretical classification framework used in analysis

---

## Analysis Results Summary

### Baseline Analysis Conclusions

- Jenkinsfile INLINE duplication: 29-31% (not abstracted to helpers)
- Change reasons per Helper file: 8-17 (God Object)
- generalHelper: Kitchen Sink class (no classification criteria, 19% cohesion)

### Key Symptoms

- **Untestable Structure**: Helper functions strongly coupled to Jenkins environment, making unit testing impossible
- **Shotgun Surgery**: One line of code change → Must check all 5 pipelines
- **Technical Debt Vicious Cycle**: Code no one dares touch → New features copy-pasted INLINE → Duplication increases

---

## Real-World Experience

### Human Error Prone Structure

- Modified INLINE code in CI Jenkinsfile, tested only CI pipeline
- Forgot about identical INLINE code in CD Jenkinsfile, deployed → CD pipeline not applied
- Modified Helper function + CI Jenkinsfile, missed CD Jenkinsfile update → CD pipeline broken

### Risk of Needing to Consider Everything for One Feature

- When changing common functionality like "Add Warning status to build results":
  - Must find and modify all 5 pipelines individually
  - Context switching when interrupted by other ticket work
  - Need to notify team members before every change

### Workflow and Teamwork Threatened by Strong Coupling

- Multiple responsibilities concentrated in single file + strong coupling
- One person's code changes affect other team members' work
- Psychologically reluctant to modify/add features → Teamwork degradation

### ROI Degradation

- Even simple modifications can't focus on just that feature
- Must consider 5 pipelines + Jenkins UI settings + Webhook/Third-party APIs
- 10-20 minute tasks extend to hours or days

---

<details>
<summary>Case Study: cloneOrUpdateRepo() function unable to handle project structure changes</summary>

The `cloneOrUpdateRepo()` function was designed with **the assumption that there's only one project in the root folder**.

- Unity: Single project folder at root (`Unity_Project/`)
- JS Web: `frontend/`, `backend/` subfolders at root, each with independent `package.json`

When the web development team used a different folder structure, this function threw errors:

1. **Debugging difficulty**: Error handling and logging were inadequate, couldn't determine what values were being passed
2. **Root cause identification**: Contacted dev team → Checked project structure → Discovered different folder structure than Unity
3. **Code modification attempt**: Tried modifying helper function internals → Caused issues in other pipeline (Unity)
4. **Jenkinsfile modification attempt**: Couldn't bring myself to touch it (affects 5 pipelines)
5. **Final workaround**: Temporarily handled by modifying environment variables in pipeline webhook settings via Jenkins web UI

Eventually gave up on helper for CD pipeline and implemented INLINE directly:

```groovy
// JenkinsfileDeployment - INLINE implementation instead of helper
dir("${PROJECT_DIR}") {
    sh "git checkout ${DESTINATION_BRANCH}"
    sh 'git reset --hard HEAD'
    sh 'git pull'
}
```

</details>

---

## Reference

- [Jenkins Shared Libraries Documentation](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- [Pipeline: Groovy Plugin - load step](https://www.jenkins.io/doc/pipeline/steps/workflow-cps/)
