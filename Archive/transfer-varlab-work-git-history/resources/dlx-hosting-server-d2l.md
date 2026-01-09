# dlx-hosting-server-d2l

## Basic Info
- **Original**: `git@bitbucket.org:VARLab/brightspace-dlx.git`
- **New Location**: https://github.com/JindoKimKor/dlx-hosting-server-d2l
- **Total Commits (mine)**: 4
- **Branches**: 2 (main, feature/initial-manual-registration)

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
git remote add origin https://github.com/JindoKimKor/dlx-hosting-server-d2l.git
```
- **Purpose**: Connect to new GitHub repository
- **Related Concept**:
  - `origin` is conventional name for primary remote
  - HTTPS URL allows push with GitHub credentials/token
- **Why in this task**: Set up destination for pushing rewritten history

---

### 7. Push all branches to GitHub
```bash
git push -u origin --all
```
- **Purpose**: Upload all branches to GitHub
- **Related Concept**:
  - `-u` (--set-upstream): Sets tracking relationship between local and remote branches
  - `--all`: Push all local branches, not just current one
- **Why in this task**: Transfer complete repository with all branches to GitHub

---

## Problem Solving

### Problem: GitHub 100MB file size limit
- **Error**: `remote: error: File public/powerline/Build/ConestogaModule2.data.unityweb is 256.35 MB; this exceeds GitHub's file size limit of 100.00 MB`
- **Cause**: Large Unity WebGL build file exists in git history
- **Note**: Even if file is deleted in latest commit, it still exists in history

### Solution: Remove large file from entire history
```bash
git filter-branch -f --index-filter 'git rm --cached --ignore-unmatch public/powerline/Build/ConestogaModule2.data.unityweb' --prune-empty -- --all
```
- **Related Concept**:
  - `-f`: Force - required when running filter-branch again (refs/original already exists)
  - `--index-filter`: Faster than `--tree-filter`, operates on index without checking out files
  - `git rm --cached`: Remove from index (staging area) only
  - `--ignore-unmatch`: Don't fail if file doesn't exist in some commits
  - `--prune-empty`: Remove commits that become empty after filtering
  - `-- --all`: Apply to all refs (branches + tags)
- **Why this approach**: Removes file from ALL commits in history, not just current state

---

## Result Verification

### Command to verify
```bash
git log main --author="jindokim.kor@gmail.com" --format="%ad" --date=short | sort | uniq
```

### Commit dates on main branch
- 2024-09-11 (4 commits)

### All commits with branch info
| Date | Branch(es) | Commit Message |
|------|------------|----------------|
| 2024-09-11 | feature/initial-manual-registration<br>main | Extracted the ltijs package from the node_modules directory and moved it to the project level and delete ltijs package in the node-modules directory |
| 2024-09-11 | feature/initial-manual-registration<br>main | Merging LTIjs Server into new Brightspace-dlx repo |
| 2024-09-11 | feature/initial-manual-registration<br>main | Merge branch 'main' of bitbucket.org:VARLab/brightspace-dlx |
| 2024-09-11 | feature/initial-manual-registration<br>main | Initial commit |

### GitHub contribution graph
- Verified: Green squares appear on 2024-09-11
