## Git Versioning · Deployment Strategies · Production Tags · Clean Commit History · Squashing

###### Session Goal

This session is about more than Git commands.

We will follow one feature from development to production and see how:

```text
Branching
   ↓
Commits
   ↓
Clean History
   ↓
Pull Request
   ↓
Version
   ↓
Production Tag
   ↓
GitHub Release
   ↓
CI/CD
   ↓
Deployment
   ↓
Rollback
```

The goal is to understand **why** teams use these practices and how they work together.

---

## PART 1 — The Problem We Are Solving

Imagine a team with several developers working on the same application.

At the same time:

* Developers are working on different features.
* Production must remain stable.
* Changes need to be reviewed.
* We need to know exactly what was deployed.
* Production problems need to be traceable.
* We may need to roll back to a previous release.


> If production is broken right now, how would you identify exactly which code is running in production?

This leads into branching, commits, versioning, tags and deployment.

---

## PART 2 — Branching Strategy

A branching strategy defines how a team isolates work, reviews changes and protects production.

It covers:

* How developers isolate their work
* How branches are named
* How changes move between environments
* How production is protected
* How releases are identified

###### Example Branch Structure

```text
main
 │
 └── develop
       │
       ├── feature/A
       ├── feature/B
       └── bugfix/C
```

Long-lived branches

```text
develop → integration / upcoming changes
main    → production
```

Short-lived branches

```text
feature/*   → new functionality
bugfix/*    → normal bug fixes
hotfix/*    → urgent production fixes
```

> These branch types are a team convention. Git itself does not require this exact structure.

###### Branch Naming

Examples:

```text
feature/PCORA-101-priority-labels
bugfix/PCORA-202-fix-ui-layout
hotfix/fix-critical-login
```

The goal is that the branch name clearly communicates its purpose.


> Why shouldn't developers normally work directly on main?

---

## PART 3 — Promotion Flow

Example team workflow:

```text
feature/A ──┐
feature/B ──┼──► develop ──► INT ──► main ──► PROD
feature/C ──┘
```

A more controlled release flow may use an integration branch:

```text
feature/A ──┐
feature/B ──┼──► integrate/sprint-14 ──► testing
feature/C ──┘
                         │
                         ▼
                      develop
                         │
                         ▼
                        main
                         │
                         ▼
                     production
```

> Whether an integration branch is needed depends on the team's workflow. It is not a Git requirement.

---

## PART 4 — Clean Commit History

During development, commit history can become messy.

Example:

```text
ACTUAL final
final
now works
fix
done
```

This is normal during development, but it is not necessarily useful as shared project history.

A cleaner history might be:

```text
feat: add priority labels to tasks
fix: handle missing priority value
```

###### Commit Message Convention

```text
feat:     new feature
fix:      bug fix
refactor: code restructuring without behavior change
test:     test changes
docs:     documentation
chore:    maintenance
```


> If production breaks at 2 AM and you open git log, which history would you rather see?

---

## PART 5 — Squashing Commits

Squashing combines multiple commits into one logical commit.

Example:

```text
BEFORE

done
fix
now works
final
ACTUAL final

        ↓ squash

AFTER

feat: add priority labels to tasks
```

The purpose is to make shared history easier to understand.

> Squashing is a team/history strategy, not a requirement for every branch.

###### Interactive Rebase

```bash
git rebase -i HEAD~5
```

Example:

```text
pick    abc1234    done
squash  def5678    fix
squash  ghi9012    now works
squash  jkl3456    final
squash  mno7890    ACTUAL final
```

Result:

```text
feat: add priority labels to tasks
```

###### Important Rule

Rewriting history is safest on a private/local feature branch.

Be careful when rebasing or force-pushing a branch that other developers are already using.


> Would you rewrite history on a shared branch? Why or why not?

---

## PART 7 — Versioning

Once we have a release, we need a consistent way to identify it.

###### Semantic Versioning

```text
v1.2.3
 │ │ │
 │ │ └── PATCH
 │ └──── MINOR
 └────── MAJOR
```

######## MAJOR

Breaking change: existing users may need to change something.

```text
v1.0.0 → v2.0.0
```

######## MINOR

New backward-compatible features — existing functionality still works.

```text
v1.0.0 → v1.1.0
```

######## PATCH

Backward-compatible bug fix — fix something without changing existing usage.

```text
v1.0.0 → v1.0.1
```


> We add a new backward-compatible API endpoint. Major, minor or patch?

---

## PART 8 — Production Tags

A Git tag identifies a specific commit.

```text
A ── B ── C ── D ── E
         ↑         ↑
       v1.0.0    v1.1.0
```

A release tag is intended to identify the exact commit used for that release.

Teams should protect important release tags so they cannot accidentally be moved or deleted.

###### Tag Examples

```text
v1.0.0
v1.1.0
v2.0.0
```

Environment prefixes such as:

```text
dev-1.0.0-beta
int-1.0.0-beta
release-1.0.0
```

are **team conventions**, not Git requirements.

######## Useful commands

```bash
git tag
git show v1.1.0
```


> What is the difference between a branch and a tag?

Expected idea:

```text
Branch → moves as new commits are added
Tag    → identifies a specific commit/release
```

---

## PART 9 — Deployment Strategies

There are different ways to trigger and control deployments.

###### Branch-based deployment

```text
develop → INT
main    → PROD
```

A change merged into a branch triggers deployment.

###### Tag-based deployment

```text
git push origin v1.1.0
             ↓
       CI/CD pipeline
             ↓
        Production
```

Only identified release versions trigger production deployment.

###### Manual deployment

```text
Pipeline
   ↓
Select version
   ↓
Deploy
```

Useful when production releases require an explicit approval/action.

###### Environment Promotion

The same built artifact is promoted:

```text
BUILD ONCE
   ↓
 DEV
   ↓
 INT
   ↓
 PROD
```

This avoids rebuilding different code for different environments.

###### Other deployment strategies

```text
Rolling
Blue-Green
Canary
```

---

## PART 10 — Branch Protection

Production branches should be protected through GitHub rules.

Example:

```text
main

✓ Pull Request required
✓ Required approvals
✓ CI checks required
✓ No direct push
✓ No force push
```

For example:

```text
develop → 1 approval
main    → 2 approvals + CI/security checks
```

> The exact number of approvals is a team policy, not a GitHub requirement.

######## Demo

GitHub:

```text
Repository
 → Settings
 → Rules / Branch protection
```


> Why might main require more approvals than develop?

---

## PART 11 — Hotfix Flow

Production is broken.

Develop contains unfinished features.

Where should the hotfix start?

```text
main
 │
 └── hotfix/fix-critical-login
             │
             ▼
          fix + test
             │
             ▼
           main
```

After the production fix, merge the fix back into the development line:

```text
hotfix
  │
  ├──► main
  │
  └──► develop
```

This keeps future development aware of the production fix.

---

## PART 12 — LIVE DEMO — TaskFlow

###### Scenario

TaskFlow is a simple todo application.

Current production:

```text
main
v1.0.0
```

We are going to release:

```text
v1.1.0
```

Feature:

```text
Priority labels
High / Medium / Low
```

---

###### Step 1 — Show Current State

```bash
git log --oneline
git branch
git tag
```

Say:

> This is our baseline. v1.0.0 identifies the current production release.

Show the application.

---

###### Step 2 — Create Feature Branch

```bash
git checkout -b feature/add-priority
```

Say:

> We isolate the feature from the production branch.

---

###### Step 3 — Create Development Commits

Create several small commits:

```text
done
fix
now works
final
ACTUAL final
```

Show:

```bash
git log --oneline
```

Ask:

> Would we want these messages in our long-term shared history?

---

###### Step 4 — Squash

```bash
git rebase -i HEAD~5
```

Use:

```text
pick    commit 1
squash  commit 2
squash  commit 3
squash  commit 4
squash  commit 5
```

Use final message:

```text
feat: add priority labels to tasks
```

Then:

```bash
git log --oneline
```

Show the clean result.

---

###### Step 5 — Merge to Develop

```bash
git checkout develop
git merge feature/add-priority
```

If the team intentionally wants merge commits visible:

```bash
git merge feature/add-priority --no-ff
```

Explain:

> `--no-ff` is a deliberate history choice. It preserves a visible merge commit even when Git could perform a fast-forward merge.

---

###### Step 6 — Release

After testing:

```bash
git checkout main
git merge develop
```

Then create the release tag.

Prefer an annotated release tag:

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```

---

###### Step 7 — Deployment

The tag triggers the pipeline:

```text
v1.1.0
   ↓
GitHub Actions
   ↓
Build
   ↓
Test
   ↓
Deploy
```

Show the GitHub Actions run.

Explain:

> The important point is that the deployment is associated with an identifiable release version.

---

###### Step 8 — Show GitHub Tags

Show:

```text
v1.0.0
v1.1.0
```

Click the tags/releases.

Explain:

> Each release points us to the exact commit associated with that version.

---

###### Step 9 — Rollback

Suppose:

```text
v1.1.0 → production problem
```

The previous known-good release is:

```text
v1.0.0
```

In a real pipeline:

```text
Deploy v1.0.0
```

For local demonstration only:

```bash
git checkout v1.0.0
```

Explain:

> Checking out the tag locally demonstrates the old code. In production, we would normally redeploy the previously known-good build/artifact.

---

## PART 13 — Closing Discussion


> If a new developer joined this project tomorrow, could they look at our Git history and understand what happened?

The goal is not simply:

> "The code works."

The goal is:

> **The code works, the history is understandable, the release is identifiable, the deployment is traceable, and the previous version can be restored.**

###### Key Takeaways

1. Use branches to isolate work.
2. Protect production branches.
3. Use meaningful commit messages.
4. Clean up development history when appropriate.
5. Understand when squashing/rebasing is safe.
6. Use semantic versioning consistently.
7. Use release tags to identify production versions.
8. Choose a deployment strategy deliberately.
9. Automate deployments through CI/CD.
10. Keep a known-good release available for rollback.
11. Create production hotfixes from the production line.
12. Keep the development line synchronized with production fixes.