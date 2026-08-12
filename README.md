# TaskFlow

A minimal todo app built for demonstrating Git versioning, deployment strategies, production tags, clean commit history, and squashing.

---

## Features

| Version | Feature         | Description                              |
|---------|-----------------|------------------------------------------|
| v1.0.0  | Core Todo       | Add, complete, and delete tasks          |
| v1.1.0  | Priority Labels | Tag tasks as 🔴 High / 🟡 Medium / 🟢 Low |

---

## Versioning Strategy

| Version | Branch | Tag    | Description                           |
|---------|--------|--------|---------------------------------------|
| 1.0.0   | main   | v1.0.0 | Initial release — core todo features  |
| 1.1.0   | main   | v1.1.0 | Added priority labels (feature merge) |

---

## Branch Strategy

```
main        ← production-ready, tagged releases
develop     ← integration branch
feature/*   ← individual feature branches 
```

---

## Run

Just open `index.html` in your browser. No setup needed.

---

## Deployment

Automated via **GitHub Actions** — triggers on any `v*` tag.

```bash
git tag v1.1.0
git push origin v1.1.0
```

---

## Rebase — When & How

### Use Case 1 — Squash messy commits before merging

You made 5 commits while building a feature. Before raising a PR,
squash them into one clean commit.

```bash
git rebase -i HEAD~5
# change lines 2-5 from pick → s
# write one clean commit message
```

### Use Case 2 — Sync your feature branch with latest develop

You created your feature branch 3 days ago. Other developers have
merged their work into develop since then. Your branch is behind.
Instead of dealing with conflicts in the PR, rebase locally first.

```
BEFORE REBASE
─────────────────────────────────────────
develop:  ──●──●──●──●  (others merged here)
                  \
feature:           ●──●──●  (your work, behind)


AFTER REBASE
─────────────────────────────────────────
develop:  ──●──●──●──●
                      \
feature:               ●──●──●  (your work, on top of latest)
```

```bash
git checkout feature/add-priority
git rebase develop
```

Your commits are replayed on top of the latest develop.
Clean history, no conflicts in PR.

### Rebase Rules

| Rule | Reason |
|---|---|
| Only rebase your own feature branch | Never rebase shared branches |
| Never rebase develop or main | Others are working on those |
| Always rebase before raising a PR | Keeps history clean and conflict free |

### Common Rebase Issues

**Empty commit message**
```
Aborting commit due to empty commit message
```
You closed the second editor without writing a message.
Run `git rebase --abort` and try again — write the message before saving.

**Conflict during rebase**
```
CONFLICT (content): Merge conflict in app.js
```
Fix the conflict in the file, then:
```bash
git add .
git rebase --continue
```

**Stuck rebase — rebase-merge directory exists**
```
fatal: It seems that there is already a rebase-merge directory
```
Clean it up and start over:
```bash
# Git Bash
rm -fr ".git/rebase-merge"

# PowerShell
Remove-Item -Recurse -Force ".git/rebase-merge"
```

**Abort anytime**
```bash
git rebase --abort
```

---

## Merge — When & How

### Use Case — Merge feature into develop or develop into main

Always use `--no-ff` to keep the merge commit visible in history.
This shows exactly where the feature branched off and where it landed.

```bash
# feature → develop
git checkout develop
git merge feature/add-priority --no-ff -m "merge: add priority labels feature"

# develop → main
git checkout main
git merge develop --no-ff -m "release: v1.1.0 — priority labels"
```

### Merge vs Rebase

| | Merge | Rebase |
|---|---|---|
| Use on shared branches | ✅ Yes | 🚫 No |
| Use on your feature branch | ✅ Yes | ✅ Yes |
| Creates merge commit | ✅ Yes | 🚫 No |
| Rewrites commit history | 🚫 No | ✅ Yes |
| When to use | Merging into develop or main | Cleaning up before PR |

### Common Merge Issues

**Conflict during merge**
```
CONFLICT (content): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```
Open the file — you will see:
```
<<<<<<< HEAD
existing code on develop
=======
incoming code from feature branch
>>>>>>> feature/add-priority
```
Fix it manually, then:
```bash
git add .
git merge --continue
```

**Abort anytime**
```bash
git merge --abort
```
