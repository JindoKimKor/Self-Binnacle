# devops-jenkins-linux

## Basic Info
- **Original**: `git@bitbucket.org:VARLab/pipelineforjenkinslinux.git`
- **New Location**: https://github.com/JindoKimKor/devops-jenkins-linux
- **Total Commits (mine)**: 610
- **Branches**: 29
  - main
  - AI_Integration
  - Bug/Correct-Sending-Linting-Result-Status
  - CORE-1423-Refactor-runUnityTests-Function-for-PlayMode-Testing-with-xvfb-run
  - CORE-1424-Enabling-JavaScript-Project-PR-pipeline
  - CORE-1438-Enabling-the-JavaScript-Deployment-Pipline-functional
  - CORE-1444-LongCommitHash
  - CORE-1449-Ensure-Code-Coverage-Setting-to-Generate-report
  - CORE-1449-can't-publish-test-result-to-web-server
  - CORE-1457-JenkinsPipeline
  - CORE-1503-remove-testcategory-for-batchmode
  - CORE-1511-New-Batch-Mode-Command
  - CORE-1525-Update-the-existing-Build-Result-link-on-the-Bitbucket-PR-page-to-show-the-progress-of-the-Jenkins-pipeline
  - CORE-1526-Add-Conditional-Retry-Logic-for-Batch-Mode-Failures-in-DLX-Pipeline
  - CORE-1526-Conditional-Retry-Logic-For-Batch-Mode-Failures-In-DLX-Pipeline
  - CORE-1531-Fixed-Unit-Stage-execution-failed
  - CORE-1542-MethodSignatures
  - CORE-1543-Integrate-SonarQube-into-PipelineForJenkins
  - CORE-1545-Fix-WebGL-Lighting-Issue
  - CORE-1547-Asset-Not-Importing-Git-Large-File-Storage_Issue
  - CORE-1547-Git-Large-File-Storage-Issue-To-Fix-Some-Asset-Not-Importing
  - CORE-1549-Check-for-the-Existence-of-WebGL-Build-Lighting-Related-Files
  - Fix-WebGL-Lighting-Issue
  - Fix/update-batchmode-error-handling
  - Hot-fix-TPI-PlayMode-failing
  - Hot-fix-update-pipeline-error-handling-logic
  - Implement-Global-Trusted-Shared-Library
  - Refactor-with-TDD
  - Temporary-Branch

---

## Commands Executed

### 1. Check all branches
```bash
git branch -a
```
- **Purpose**: List all local and remote branches
- **Related Concept**:
  - `git branch` shows local branches only
  - `-a` flag includes remote tracking branches (`remotes/origin/...`)
  - Remote tracking branches are local references to the state of branches on remote repositories
- **Why in this task**: Need to know all branches before running filter-branch, since we want to change email across ALL branches

---

### 2. Count commits with old email
```bash
git log --all --oneline --author="jkim8@conestogac.on.ca"
```
- **Purpose**: Find all commits by specific author
- **Related Concept**:
  - `--all`: Search across all branches, not just current branch
  - `--oneline`: Compact format (one commit per line)
  - `--author`: Filter by author field in commit metadata
  - Git commits have two identities: **author** (who wrote the code) and **committer** (who applied the commit)
- **Why in this task**: Count how many commits need email change before running filter-branch
- **Result**: 610 commits found

---

### 3. Checkout main branch
```bash
git checkout main
```
- **Purpose**: Switch to main branch before filter-branch
- **Related Concept**:
  - HEAD was in detached state or on different branch
  - filter-branch works better when on a proper branch
- **Why in this task**: Ensure clean state before rewriting history

---

### 4. Change author email across all branches
```bash
git filter-branch --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "jkim8@conestogac.on.ca" ]; then
    export GIT_AUTHOR_EMAIL="jindokim.kor@gmail.com"
    export GIT_AUTHOR_NAME="Jindo Kim"
fi
if [ "$GIT_COMMITTER_EMAIL" = "jkim8@conestogac.on.ca" ]; then
    export GIT_COMMITTER_EMAIL="jindokim.kor@gmail.com"
    export GIT_COMMITTER_NAME="Jindo Kim"
fi
' --tag-name-filter cat -- --branches --tags
```
- **Purpose**: Rewrite commit history to change author/committer email
- **Related Concept**:
  - **Git history is immutable**: You can't modify existing commits. filter-branch creates NEW commits with new metadata
  - **Commit hash changes**: Since commit hash includes author info, all affected commits get new hashes
  - `--env-filter`: Runs shell script to modify environment variables before each commit is rewritten
  - `GIT_AUTHOR_EMAIL` vs `GIT_COMMITTER_EMAIL`: Both need to be changed
  - `--tag-name-filter cat`: Preserve tags, pointing to new commits
  - `-- --branches --tags`: Apply to all branches and tags
- **Why in this task**: Change school email to personal email so GitHub contribution graph attributes commits to my account
- **Note**: This took ~15 minutes due to 785 total commits across all branches

---

### 5. Remove origin remote and clean up
```bash
git remote remove origin
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```
- **Purpose**: Disconnect from Bitbucket and clean up old references
- **Related Concept**:
  - Remote is a named reference to another repository
  - `refs/original/`: filter-branch backs up original refs here
  - **Reflog**: Git's safety net - records all ref changes
  - `git gc`: Garbage collection - removes unreachable objects
- **Why in this task**: Prepare for new GitHub remote; remove old commit objects

---

### 6. Add new GitHub remote and push
```bash
git remote add origin https://github.com/JindoKimKor/devops-jenkins-linux.git
git push -u origin --all
```
- **Purpose**: Connect to GitHub and upload all branches
- **Related Concept**:
  - `-u` (--set-upstream): Sets tracking relationship between local and remote branches
  - `--all`: Push all local branches
- **Why in this task**: Transfer complete repository with all 29 branches to GitHub

---

## Problem Solving

No special problems encountered for this repo. The process was straightforward:
1. filter-branch completed successfully (took longer due to 610 commits)
2. GitHub push completed without file size issues

---

## Result Verification

### Command to verify
```bash
git log main --author="jindokim.kor@gmail.com" --format="%ad" --date=short | sort | uniq
```

### Commit dates on main branch
- 2025-01-09, 14, 15, 16
- 2025-02-05, 21, 27, 28
- 2025-03-11, 12, 24
- 2025-04-03
- 2025-05-12

### GitHub contribution graph
- Verified: Green squares appear on above dates

---

## Commits by Branch Summary

| Branch | Commits |
|--------|---------|
| Refactor-with-TDD | 277 |
| CORE-1543-Integrate-SonarQube-into-PipelineForJenkins | 110 |
| CORE-1511-New-Batch-Mode-Command | 71 |
| CORE-1547-Git-Large-File-Storage-Issue-To-Fix-Some-Asset-Not-Importing | 55 |
| Implement-Global-Trusted-Shared-Library | 37 |
| CORE-1424-Enabling-JavaScript-Project-PR-pipeline | 33 |
| AI_Integration | 25 |
| CORE-1526-Conditional-Retry-Logic-For-Batch-Mode-Failures-In-DLX-Pipeline | 25 |
| Temporary-Branch | 24 |
| CORE-1542-MethodSignatures | 23 |
| CORE-1547-Asset-Not-Importing-Git-Large-File-Storage_Issue | 22 |
| CORE-1525-Update-the-existing-Build-Result-link... | 19 |
| CORE-1526-Add-Conditional-Retry-Logic... | 19 |
| main | 17 |
| CORE-1444-LongCommitHash | 17 |
| Bug/Correct-Sending-Linting-Result-Status | 16 |
| CORE-1531-Fixed-Unit-Stage-execution-failed | 16 |
| Hot-fix-TPI-PlayMode-failing | 14 |
| Hot-fix-update-pipeline-error-handling-logic | 14 |
| CORE-1549-Check-for-the-Existence-of-WebGL-Build-Lighting-Related-Files | 13 |
| Fix/update-batchmode-error-handling | 13 |
| CORE-1449-Ensure-Code-Coverage-Setting-to-Generate-report | 12 |
| CORE-1545-Fix-WebGL-Lighting-Issue | 11 |
| Fix-WebGL-Lighting-Issue | 10 |
| CORE-1438-Enabling-the-JavaScript-Deployment-Pipline-functional | 9 |
| CORE-1423-Refactor-runUnityTests-Function... | 8 |
| CORE-1503-remove-testcategory-for-batchmode | 8 |
| CORE-1449-can't-publish-test-result-to-web-server | 6 |
| CORE-1457-JenkinsPipeline | 5 |

---

## All Commits by Branch

<details>
<summary><strong>main (17 commits)</strong></summary>

| Date | Commit Message |
|------|----------------|
| 2025-05-12 | Switch Global Shared Library Branch Refactor-with-TDD to main, regarding Refactor-with-TDD branch got merged |
| 2025-05-12 | Merged in Refactor-with-TDD (pull request #59) |
| 2025-04-03 | Merged in CORE-1547-Git-Large-File-Storage-Issue-To-Fix-Some-Asset-Not-Importing (pull request #41) |
| 2025-03-24 | Merged in CORE-1543-Integrate-SonarQube-into-PipelineForJenkins (pull request #34) |
| 2025-03-12 | Merged in Fix/update-batchmode-error-handling (pull request #31) |
| 2025-03-12 | Merged in Hot-fix-TPI-PlayMode-failing (pull request #30) |
| 2025-03-11 | Merged in CORE-1545-Fix-WebGL-Lighting-Issue (pull request #28) |
| 2025-02-28 | Merged in CORE-1531-Fixed-Unit-Stage-execution-failed (pull request #23) |
| 2025-02-27 | Merged in CORE-1525-Update-the-existing-Build-Result-link-on-the-Bitbucket-PR-page-to-show-the-progress-of-the-Jenkins-pipeline (pull request #22) |
| 2025-02-21 | emergency fixed |
| 2025-02-21 | Merged in CORE-1511-New-Batch-Mode-Command (pull request #18) |
| 2025-02-05 | Merged in CORE-1503-remove-testcategory-for-batchmode (pull request #14) |
| 2025-01-16 | quick-fix-changing-wait-SonarQube-Gate-Quaility-from-1-Hours-to-5-Minutes |
| 2025-01-16 | quick-fix-changing-wait-SonarQube-Gate-Quaility-from-1-Hours-to-5-Minutes |
| 2025-01-15 | Merged in CORE-1438-Enabling-the-JavaScript-Deployment-Pipline-functional (pull request #7) |
| 2025-01-14 | Merged in CORE-1424-Enabling-JavaScript-Project-PR-pipeline (pull request #5) |
| 2025-01-09 | Merged in CORE-1423-Refactor-runUnityTests-Function-for-PlayMode-Testing-with-xvfb-run (pull request #2) |

</details>

<details>
<summary><strong>Refactor-with-TDD (277 commits - largest branch)</strong></summary>

Major refactoring effort with Test-Driven Development approach. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-05-12 | Revert "Temparory test" |
| 2025-05-09 | Added Error handling for bitbucket api communication |
| 2025-05-09 | Delete artifact(dump file) of running test locally |
| 2025-05-09 | Added missing package in Gladle test configuration |
| 2025-05-08 | Fixed typo |
| 2025-05-08 | Fixed one git library |
| 2025-05-08 | Added stripIdent() and trim() for every shellscript |
| 2025-05-08 | logging improved |
| 2025-05-08 | Improved logging |
| 2025-05-08 | Added stripIndent for every ssh shellscript |
| 2025-05-08 | Added stripIndent for ssh |
| 2025-05-08 | Added ConnectionAttempts for CheckSSHConnectivity |
| 2025-05-08 | EconestogaDLX connection check |
| 2025-05-08 | Added Network Connection Check |
| 2025-05-08 | Check SSH Connectivity Modulurized |
| 2025-05-07 | Initial Refactor completed |
| 2025-05-07 | Modulurized ssh shell scripting for Deploying WebGL to dlx-web hosting server |
| ... | (+ 260 more commits) |

</details>

<details>
<summary><strong>CORE-1543-Integrate-SonarQube-into-PipelineForJenkins (110 commits)</strong></summary>

SonarQube integration for code quality analysis. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-03-24 | No parse argument for lint |
| 2025-03-24 | Groovy Lint disable test |
| 2025-03-23 | Fixed Linting errors |
| 2025-03-23 | Deleted unused function |
| 2025-03-23 | Fixed linting errors |
| 2025-03-23 | Replace sh 'pwd' with pwd() |
| 2025-03-23 | Added test case for ResultStatus package |
| 2025-03-23 | Apply shared library for DLX Deployment pipeline |
| 2025-03-21 | Implement shared library for PipelineForJenkins |
| ... | (+ 100 more commits) |

</details>

<details>
<summary><strong>CORE-1511-New-Batch-Mode-Command (71 commits)</strong></summary>

Unity batch mode command improvements. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-02-21 | Fixed Error handling |
| 2025-02-21 | Error handling for batchmode |
| 2025-02-20 | Fixed bat command |
| 2025-02-20 | Added conditional retry logic |
| ... | (+ 67 more commits) |

</details>

<details>
<summary><strong>CORE-1547-Git-Large-File-Storage-Issue-To-Fix-Some-Asset-Not-Importing (55 commits)</strong></summary>

Git LFS integration to handle large Unity assets. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-04-03 | Fixed git lfs issue |
| 2025-04-02 | Added git lfs pull |
| 2025-04-01 | Implement git lfs for large files |
| ... | (+ 52 more commits) |

</details>

<details>
<summary><strong>Implement-Global-Trusted-Shared-Library (37 commits)</strong></summary>

Jenkins shared library implementation for code reuse. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-03-20 | Implement shared library structure |
| 2025-03-19 | Added helper functions |
| 2025-03-18 | Initial shared library setup |
| ... | (+ 34 more commits) |

</details>

<details>
<summary><strong>CORE-1424-Enabling-JavaScript-Project-PR-pipeline (33 commits)</strong></summary>

JavaScript project CI/CD pipeline setup. Key commits include:

| Date | Commit Message |
|------|----------------|
| 2025-01-14 | Fixed JS pipeline |
| 2025-01-13 | Added ESLint integration |
| 2025-01-12 | Initial JS pipeline setup |
| ... | (+ 30 more commits) |

</details>

<details>
<summary><strong>Other branches</strong></summary>

The following branches contain additional feature work and bug fixes:
- AI_Integration (25 commits)
- CORE-1526-Conditional-Retry-Logic-For-Batch-Mode-Failures-In-DLX-Pipeline (25 commits)
- Temporary-Branch (24 commits)
- CORE-1542-MethodSignatures (23 commits)
- CORE-1547-Asset-Not-Importing-Git-Large-File-Storage_Issue (22 commits)
- CORE-1525-Update-the-existing-Build-Result-link... (19 commits)
- CORE-1526-Add-Conditional-Retry-Logic... (19 commits)
- CORE-1444-LongCommitHash (17 commits)
- Bug/Correct-Sending-Linting-Result-Status (16 commits)
- CORE-1531-Fixed-Unit-Stage-execution-failed (16 commits)
- Hot-fix-TPI-PlayMode-failing (14 commits)
- Hot-fix-update-pipeline-error-handling-logic (14 commits)
- CORE-1549-Check-for-the-Existence-of-WebGL-Build-Lighting-Related-Files (13 commits)
- Fix/update-batchmode-error-handling (13 commits)
- CORE-1449-Ensure-Code-Coverage-Setting-to-Generate-report (12 commits)
- CORE-1545-Fix-WebGL-Lighting-Issue (11 commits)
- Fix-WebGL-Lighting-Issue (10 commits)
- CORE-1438-Enabling-the-JavaScript-Deployment-Pipline-functional (9 commits)
- CORE-1423-Refactor-runUnityTests-Function... (8 commits)
- CORE-1503-remove-testcategory-for-batchmode (8 commits)
- CORE-1449-can't-publish-test-result-to-web-server (6 commits)
- CORE-1457-JenkinsPipeline (5 commits)

</details>
