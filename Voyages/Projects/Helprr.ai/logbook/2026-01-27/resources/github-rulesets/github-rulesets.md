# GitHub Rulesets Setup Guide

## What is Branch Protection Ruleset?

Rulesets prevent collaborators from deleting or force pushing to branches, and set requirements like passing status checks or linear commit history.

**Note**: Free plan cannot apply rulesets to private repos. Requires Organization account or Pro plan.

## How to Access

Repository > Settings > Rules > Rulesets

![Ruleset config screen](01-ruleset-config.png)

## Setup Methods

### Method 1: Manual Creation

1. Click "New ruleset"
2. Select "New branch ruleset" or "New tag ruleset"

![New ruleset menu](04-new-ruleset-menu.png)

### Method 2: JSON Import (Recommended)

Useful for reusing existing ruleset across repos.

1. Select "New ruleset" > "Import a ruleset"
2. Choose JSON file

![JSON file selection](05-json-file-select.png)

3. Review and save imported settings

![Imported ruleset config](06-imported-ruleset.png)

## main-protection Example

![Ruleset list](03-ruleset-list.png)

### Basic Settings

| Field | Value |
|-------|-------|
| Ruleset Name | main-protection |
| Enforcement status | Active |
| Target branches | main |

### Bypass List

- Repository admin: Always allow

### Branch Rules (3 rules)

Typical main branch protection:
- Require pull request before merging
- Require status checks to pass
- Block force pushes

## Test Repository

Tested settings on separate repo: `GitHub-ruleset-test`

![Ruleset config in test repo](02-ruleset-test-repo.png)
