## Git Branching Strategy & Versioning

## PART 1 — What is a Branching Strategy?

> "A branching strategy is not just — this branch goes to this environment.
> It's about how your team writes, reviews, and ships code — without
> stepping on each other."

It covers:
- How you isolate your work
- How you name your branches
- How you protect production
- How you trace what went live and when

---

## PART 2 — Branch Types

```
┌──────────────────────────────────────────────────────┐
│                   BRANCH TYPES                       │
│                                                      │
│  LONG-LIVED (always exist)                           │
│                                                      │
│  ┌─────────┐        ┌──────┐                         │
│  │ develop │        │ main │ ← production only        │
│  └─────────┘        └──────┘                         │
│                                                      │
│  SHORT-LIVED (create → use → delete)                 │
│                                                      │
│  feature/*    → new features                         │
│  bugfix/*     → bugs found during dev/testing        │
│  hotfix/*     → critical production bugs             │
│  integrate/*  → combine sprint features for testing  │
└──────────────────────────────────────────────────────┘
```

### Branch Naming Rules

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/TICKET-description` | `feature/PCORA-101-priority-labels` |
| Bugfix | `bugfix/TICKET-description` | `bugfix/PCORA-202-fix-ui-layout` |
| Hotfix | `hotfix/description` | `hotfix/fix-critical-login` |
| Integrate | `integrate/sprint-number` | `integrate/sprint-14` |

> "The ticket number in the branch name means you can trace any branch
> back to a task instantly. No guessing what 'kai-branch' was for."

**Engaging question:**
> "What do you name your branches right now?"

---

## PART 3 — The Promotion Flow

```
┌────────────────────────────────────────────────────────────┐
│                    PROMOTION FLOW                          │
│                                                            │
│   feature/A ──┐                                            │
│   feature/B ──┼──► integrate/sprint-14 ──► DEV testing    │
│   feature/C ──┘         │                                  │
│                         │ PR → develop (1 approval)        │
│                         ▼                                  │
│                      develop ──────────────► INT testing   │
│                         │                                  │
│                         │ PR → main (2 approvals + CI)     │
│                         ▼                                  │
│                        main ──────────────► PRODUCTION     │
│                         │                                  │
│                      tag: release-1.0.0                    │
└────────────────────────────────────────────────────────────┘
```

Key points:
- feature branches are **parallel** — no one blocks anyone ✅
- integrate branch = "let's see if everything works together"
- develop = INT validated code
- main = production only, always tagged

---

## PART 4 — Hotfix Flow

```
┌──────────────────────────────────────────────┐
│               HOTFIX FLOW                    │
│                                              │
│         main (production is broken!) 🔴      │
│           │                                  │
│           ├──► hotfix/fix-critical-login     │
│           │         │                        │
│           │      fix applied & tested        │
│           │         │                        │
│           │◄────────┘ merge → new tag        │
│           │                                  │
│           └──────────────────────────────►   │
│              also merge back to develop      │
│              (keep branches in sync!)        │
└──────────────────────────────────────────────┘
```

> "Hotfix always branches from main — not develop. Because develop might
> have unfinished features you don't want in production."

---

## PART 5 — Versioning & Tagging

### Semantic Versioning

```
     v  1  .  2  .  3
        │     │     │
        │     │     └── PATCH → bug fix
        │     └──────── MINOR → new feature
        └────────────── MAJOR → breaking change
```

### Tag Rules Per Environment

| Environment | Tag Pattern | Example |
|---|---|---|
| Dev | `dev-1.0.0-beta` | `dev-1.2.0-beta` |
| INT | `int-1.0.0-beta` | `int-1.2.0-beta` |
| Production | `release-1.0.0` | `release-1.2.0` |

> "A tag is frozen. A branch moves forward with every commit.
> release-1.0.0 will always point to that exact code — forever.
> That's your audit trail. That's your rollback point."

**Engaging question:**
> "What's the difference between a branch and a tag?"

---

## PART 6 — Branch Protection Rules

> "This is how you enforce the strategy — not by telling people,
> but by making GitHub enforce it automatically."

```
┌──────────────────────────────────────────┐
│        develop — Protection              │
│                                          │
│  ✅ PR required before merge             │
│  ✅ Minimum 1 approval                   │
│  ✅ CI must pass (build, tests, lint)    │
│  🚫 No direct push                       │
│  🚫 No force push                        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│          main — Protection               │
│                                          │
│  ✅ PR required before merge             │
│  ✅ Minimum 2 approvals                  │
│  ✅ Full CI + security checks must pass  │
│  ✅ Deployment gate (staging must pass)  │
│  🚫 No direct push                       │
│  🚫 No force push                        │
│  🚫 No deletions                         │
└──────────────────────────────────────────┘
```

**Engaging question:**
> "Why does main need 2 approvals but develop only needs 1?"

> "Because the cost of a mistake on main is 10x higher."

---

## PART 7 — LIVE DEMO (TaskFlow App)

> "Now let's see all of this in action."

### Demo Flow

```
main (v1.0.0) ─────────────────────────────► main (v1.1.0)
                                                   ▲
develop ───────────────────────────────────► develop
                                                   ▲
              feature/add-priority ───────────────┘
                    │
               5 messy commits
                    │
               git rebase -i HEAD~5
                    │
               1 clean commit ✅
```

### Commands

**Show current state**
```bash
git log --oneline
git branch
```

**Create branches**
```bash
git checkout -b develop
git checkout -b feature/add-priority
```

**5 messy commits**
```bash
git add . && git commit -m "done"
git add . && git commit -m "fix"
git add . && git commit -m "now works"
git add . && git commit -m "final"
git add . && git commit -m "ACTUAL final"
git log --oneline
```

**Squash into 1 clean commit**
```bash
git rebase -i HEAD~5
# lines 2-5: change pick → s
# message: feat: add priority labels (High / Medium / Low) to tasks
git log --oneline
```

**Merge feature → develop → main**
```bash
git checkout develop
git merge feature/add-priority --no-ff -m "merge: add priority labels feature"

git checkout main
git merge develop --no-ff -m "release: v1.1.0 — priority labels"
git push origin main
```

**Tag and deploy**
```bash
git tag v1.1.0
git push origin v1.1.0
# open GitHub Actions → show pipeline running
```

**Show rollback**
```bash
git tag
git checkout v1.0.0
git checkout main
```

---

## CLOSING — Key Takeaways

| # | Rule |
|---|---|
| 1 | Never push directly to main |
| 2 | Name branches with ticket numbers |
| 3 | Squash before merging |
| 4 | Tag every release |
| 5 | Let CI/CD enforce quality |
| 6 | Hotfix always from main |

**Final question:**
> "If your project got handed to a new developer today — could they open
> git log and understand what happened in the last 3 months?"

> "That's the goal. Not just code that works — code that communicates."
