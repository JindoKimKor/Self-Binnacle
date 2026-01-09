# devops-jenkins-windows

## Basic Info
- **Original**: `git@bitbucket.org:VARLab/pipelineforjenkins.git`
- **New Location**: https://github.com/JindoKimKor/devops-jenkins-windows

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
- **Result**: 77 commits found

---

### 3. Checkout main branch
```bash
git checkout main
```
- **Purpose**: Switch to main branch before filter-branch
- **Related Concept**:
  - HEAD was in detached state (pointing to specific commit, not a branch)
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
- **Note**: Some branches showed "unchanged" warning - those branches had no commits with old email

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

### 6. Add new GitHub remote and force push
```bash
git remote add origin https://github.com/JindoKimKor/devops-jenkins-windows.git
git fetch origin
git push -u origin --all --force
```
- **Purpose**: Connect to GitHub and upload all branches
- **Related Concept**:
  - `git fetch origin`: Download remote refs to see what exists
  - `--force`: Required because GitHub had existing commit (LICENSE file)
  - Force push overwrites remote history with local history
- **Why in this task**: GitHub repo already had a LICENSE commit, needed to replace it with our rewritten history

---

## Problem Solving

### Problem: GitHub repo already had LICENSE commit
- **Situation**: Created GitHub repo with MIT LICENSE before pushing
- **Cause**: GitHub's initial LICENSE commit would conflict with our history
- **Solution**: Used `--force` flag to overwrite GitHub's history
- **Note**: LICENSE file was overwritten; can be re-added later

---

## Result Verification

### Command to verify
```bash
git log main --author="jindokim.kor@gmail.com" --format="%ad" --date=short | sort | uniq
```

### Commit dates on main branch
- 2024-06-05, 06, 07, 10, 11, 12, 13, 17, 19, 20, 24, 25, 26
- 2024-07-08, 17
- 2024-11-15, 25

### GitHub contribution graph
- Verified: Green squares appear on above dates
