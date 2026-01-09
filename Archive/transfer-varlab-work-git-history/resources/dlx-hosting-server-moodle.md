# dlx-hosting-server-moodle

## Basic Info
- **Original**: `git@bitbucket.org:VARLab/devopsdlxserver.git`
- **New Location**: https://github.com/JindoKimKor/dlx-hosting-server-moodle
- **Total Commits (mine)**: 9 (across all branches), 2 (on main)
- **Branches**: 7
  - main
  - feature/CORE-961-PM2-log
  - feature/CORE-993-automate-vm-update
  - feature/add-log-where-to-retrieve-ltik
  - feature/adding-log-where-redirect-to-Auth-Endpoint-at-the-end-of-login-middleware-route
  - feature/analysis
  - feature/improve-redirection-log

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
- **Result**: 11 commits found

---

### 3. Change author email across all branches
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

---

### 4. Remove origin remote
```bash
git remote remove origin
```
- **Purpose**: Disconnect from Bitbucket remote
- **Related Concept**:
  - Remote is a named reference to another repository
  - After filter-branch, local history diverges from remote (all commit hashes changed)
  - Old remote references can cause confusion with `git log --all`
- **Why in this task**: Prepare to add new GitHub remote; also removes remote tracking branches that still have old email

---

### 5. Clean up old references
```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```
- **Purpose**: Remove backup refs and unreachable objects created by filter-branch
- **Related Concept**:
  - `refs/original/`: filter-branch backs up original refs here
  - **Reflog**: Git's safety net - records all ref changes (branch moves, resets, etc.)
  - **Git objects**: Commits, trees, blobs stored in `.git/objects/`
  - **Unreachable objects**: Objects not referenced by any branch/tag
  - `git gc`: Garbage collection - removes unreachable objects
  - `--aggressive`: More thorough compression and cleanup
- **Why in this task**: Ensure old commits with old email are completely removed, reduce repo size before push

---

### 6. Add new GitHub remote
```bash
git remote add origin https://github.com/JindoKimKor/dlx-hosting-server-moodle.git
```
- **Purpose**: Connect to new GitHub repository
- **Related Concept**:
  - `origin` is conventional name for primary remote
  - HTTPS URL allows push with GitHub credentials/token
- **Why in this task**: Set up destination for pushing rewritten history

---

### 7. Push all branches to GitHub (first attempt - failed)
```bash
git push -u origin --all
```
- **Purpose**: Upload all branches to GitHub
- **Result**: Failed - 100MB file limit exceeded

---

## Problem Solving

### Problem: GitHub 100MB file size limit
- **Error**: `remote: error: File public/powerline/Build/ConestogaModule2.data.unityweb is 256.35 MB; this exceeds GitHub's file size limit of 100.00 MB`
- **Cause**: Same large Unity WebGL build file as dlx-hosting-server-d2l exists in git history
- **Note**: Even if file is deleted in latest commit, it still exists in history

### Solution: Remove large file from entire history
```bash
git filter-branch -f --index-filter 'git rm --cached --ignore-unmatch public/powerline/Build/ConestogaModule2.data.unityweb' --prune-empty -- --branches --tags
```
- **Related Concept**:
  - `-f`: Force - required when running filter-branch again (refs/original already exists)
  - `--index-filter`: Faster than `--tree-filter`, operates on index without checking out files
  - `git rm --cached`: Remove from index (staging area) only
  - `--ignore-unmatch`: Don't fail if file doesn't exist in some commits
  - `--prune-empty`: Remove commits that become empty after filtering
  - `-- --branches --tags`: Apply to all branches and tags (different from `-- --all` used in d2l)
- **Why this approach**: Removes file from ALL commits in history, not just current state

### After fix: Clean up and push again
```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push -u origin --all
```
- **Result**: Success - all 7 branches pushed

---

## Result Verification

### Command to verify
```bash
git log main --author="jindokim.kor@gmail.com" --format="%ad" --date=short | sort | uniq
```

### Commit dates on main branch
- 2024-09-24 (2 commits - PR merges)

### All commits with branch info
| Date | Branch(es) | Commit Message |
|------|------------|----------------|
| 2024-09-24 | main | Merged in feature/improve-redirection-log (pull request #13) |
| 2024-09-24 | feature/add-log-where-to-retrieve-ltik<br>feature/improve-redirection-log | improve-redirection-log |
| 2024-09-24 | feature/add-log-where-to-retrieve-ltik<br>feature/improve-redirection-log | Merge branch 'main' into feature/improve-redirection-log |
| 2024-09-24 | feature/add-log-where-to-retrieve-ltik<br>feature/improve-redirection-log<br>main | Merged in feature/adding-log-where-redirect-to-Auth-Endpoint... (PR #11) |
| 2024-09-24 | feature/add-log-where-to-retrieve-ltik<br>feature/adding-log-where-redirect-to-Auth-Endpoint...<br>feature/improve-redirection-log | Add a log where redirect to Auth Endpoint |
| 2024-08-29 | feature/analysis | Adding http log printing on Terminal feature |
| 2024-08-29 | feature/analysis | update LTIjs npm package version and comment out manual registration process |
| 2024-07-30 | feature/CORE-993-automate-vm-update | Test automating Server for LTI js Server on Merge trigger |
| 2024-07-24 | feature/CORE-961-PM2-log | Change environment variable setting command from `set` to `export` |

### GitHub contribution graph
- Only main branch commits count: 2024-09-24
- Feature branch commits (07-24, 07-30, 08-29) do NOT appear on contribution graph
