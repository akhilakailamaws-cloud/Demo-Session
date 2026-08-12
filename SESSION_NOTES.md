# Git Versioning · Deployment Strategies · Production Tags · Clean Commit History · Squashing

---

## PART 1 — What is a Branching Strategy?

A branching strategy is not just "this branch goes to this environment."
It is about how your team writes, reviews, and ships code — without
stepping on each other.

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

For projects with ticket numbers (backend, enterprise):
| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/TICKET-description` | `feature/PCORA-101-priority-labels` |
| Bugfix | `bugfix/TICKET-description` | `bugfix/PCORA-202-fix-ui-layout` |

For frontend or projects without ticket numbers:
| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/priority-labels` |
| Bugfix | `bugfix/short-description` | `bugfix/fix-ui-layout` |
| Hotfix | `hotfix/description` | `hotfix/fix-critical-login` |
| Integrate | `integrate/sprint-number` | `integrate/sprint-14` |

> The goal is the same — the branch name should tell you exactly
> what is inside it. Whether it has a ticket number or not,
> anyone reading it should understand the purpose immediately.

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

- feature branches are parallel — no one blocks anyone ✅
- integrate branch = all sprint features tested together before going to develop
- develop = INT validated, stable code
- main = production only, always tagged before deploying

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

Hotfix always branches from main — not develop. Because develop might
have unfinished features that are not ready for production.
After the fix, merge it back to develop as well — so develop stays in sync.

---

## PART 5 — Branch Protection Rules

This is how you enforce the strategy — not by telling people,
but by making GitHub enforce it automatically.

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

> Show this live on GitHub → repo Settings → Branches

**Ask the room:**
> Why does main need 2 approvals but develop only needs 1?

**Answer:**
> develop is your safety net — mistakes there are caught before production.
> main is production. The cost of a mistake there is 10x higher.
> Two approvals means two people verified this is safe to ship.

---

## PART 6 — Clean Commit History

Bad commit history looks like this:

```
ACTUAL final
final
now works
fix
done
feat: initial app
```

Good commit history looks like this:

```
feat: add priority labels (High / Medium / Low) to tasks
feat: initial TaskFlow app with core todo features
```

The difference — anyone reading the good history knows exactly
what changed, when, and why. No guessing.

### Commit Message Format

```
<type>: <short description>

Types:
  feat     → new feature
  fix      → bug fix
  chore    → maintenance, no logic change
  docs     → documentation only
  refactor → code restructure, no behavior change
  test     → adding or updating tests
```

**Ask the room:**
> If production broke at 2am and you opened git log —
> which history would you rather see?

**Answer:**
> The clean one. Because you can immediately spot which commit
> introduced the problem and revert it. With messy history,
> you are guessing in the dark at 2am.

---

## PART 7 — Squashing

When you are building a feature, you make many small commits.
That is fine — it is how development works.
But before those commits go into the shared history, you clean them up.
Squashing combines multiple commits into one meaningful commit.

```
BEFORE SQUASH                AFTER SQUASH
──────────────────────────── ────────────────────────────────────
ACTUAL final                 feat: add priority labels to tasks ✅
final
now works
fix
done
```

### How to Squash

```bash
git rebase -i HEAD~5
```

In the editor that opens:
```
pick  abc1234  done          ← keep this one
s     def5678  fix           ← fold into above
s     ghi9012  now works     ← fold into above
s     jkl3456  final         ← fold into above
s     mno7890  ACTUAL final  ← fold into above
```

Save → write one clean commit message → save again.

**Ask the room:**
> Has anyone used git rebase before? What was your experience?

**Answer to have ready:**
> Rebase gets a bad reputation because people use it wrong —
> usually rebasing shared branches. The rule is simple:
> never rebase a branch that others are working on.
> On your own feature branch, rebase is perfectly safe
> and gives you a clean history before merging.

---

## PART 8 — Versioning

### Semantic Versioning

```
     v  1  .  2  .  3
        │     │     │
        │     │     └── PATCH → bug fix, nothing new
        │     └──────── MINOR → new feature, backward compatible
        └────────────── MAJOR → breaking change
```

### Real Examples

| Change | Version bump | Before → After |
|---|---|---|
| Fixed a UI bug | PATCH | v1.0.0 → v1.0.1 |
| Added priority labels | MINOR | v1.0.0 → v1.1.0 |
| Redesigned entire API | MAJOR | v1.0.0 → v2.0.0 |

**Ask the room:**
> If you added a new button to the UI — is that a major, minor, or patch?

**Answer:**
> Minor — it is a new feature, nothing existing is broken.
> If you removed a button that other systems depended on, that is major.
> If you just fixed a broken button, that is a patch.

---

## PART 9 — Production Tags

A branch moves forward with every new commit.
A tag is frozen — it points to one specific commit forever.
That is why we tag every release.

```
┌─────────────────────────────────────────────────────┐
│              TAGS vs BRANCHES                       │
│                                                     │
│  branch: main                                       │
│  ──●──────●──────●──────●──────►  (keeps moving)   │
│                                                     │
│  tag: v1.0.0          tag: v1.1.0                   │
│  ──●──────────────────●            (frozen forever) │
└─────────────────────────────────────────────────────┘
```

### Tag Naming Convention

Tags follow the same semantic versioning but are prefixed
to show which environment they belong to:

| Environment | Format | What it means |
|---|---|---|
| Dev | `dev-1.0.0-beta` | Work in progress, deployed to dev for testing |
| INT | `int-1.0.0-beta` | Validated in dev, now testing in INT |
| Production | `release-1.0.0` | Fully tested, this is what goes live |

> The prefix tells you instantly where this tag was used.
> If you see `int-1.2.0-beta` you know it was tested in INT
> but never made it to production.
> If you see `release-1.2.0` you know this is what is live right now.

> Show on GitHub → Tags section → point out the tag names and what they mean

**Ask the room:**
> What is the difference between a branch and a tag?

**Answer:**
> A branch is a pointer that moves — every commit pushes it forward.
> A tag is a pointer that never moves — it is locked to one commit forever.
> release-1.0.0 will always mean exactly that code, nothing more, nothing less.
> That is your audit trail. That is your rollback point.

---

## PART 10 — Deployment Strategy

You do not deploy by running a script manually.
You push a tag. The pipeline does the rest.

```
┌─────────────────────────────────────────────────────┐
│           TAG PUSH → PIPELINE TRIGGERS              │
│                                                     │
│   git tag v1.1.0                                    │
│   git push origin v1.1.0                            │
│          │                                          │
│          ▼                                          │
│   GitHub Actions pipeline runs automatically        │
│          │                                          │
│          ├── checkout code                          │
│          ├── validate files                         │
│          └── deployment success message             │
│                                                     │
│   In real projects this step would:                 │
│   → deploy to AWS S3                                │
│   → trigger a Kubernetes rollout                    │
│   → publish to npm                                  │
│   Same pattern — bigger pipeline                    │
└─────────────────────────────────────────────────────┘
```

> Show on GitHub → Actions tab → click the pipeline run →
> show the steps and the deployment success message printed with
> the version and the person who triggered it

Humans make mistakes — pipelines do not.
Every deployment is traceable — you know exactly what version,
who triggered it, and when.

---

## PART 11 — LIVE DEMO (TaskFlow App)

### What we have

- A simple todo app called TaskFlow
- v1.0.0 is already on main — add and complete tasks
- We are going to ship v1.1.0 — priority labels feature
- We will follow the exact branching and tagging strategy we just discussed

### Step 1 — Show the current state

```bash
git log --oneline
git branch
```

Say: "This is our baseline. One commit, one branch — main.
v1.0.0 is tagged and live. This is production."

Open the browser and show the app running.

### Step 2 — Create branches

```bash
git checkout -b develop
git push -u origin develop

git checkout -b feature/add-priority
```

Say: "We never work on main directly. Feature branch off develop.
Notice the branch name — feature/add-priority.
Anyone reading this knows exactly what is being built here."

### Step 3 — Make 5 messy commits

The priority labels feature is already built in the code.
Now simulate how development actually happens:

```bash
git add . && git commit -m "done"
git add . && git commit -m "fix"
git add . && git commit -m "now works"
git add . && git commit -m "final"
git add . && git commit -m "ACTUAL final"
```

Show the log:
```bash
git log --oneline
```

Say: "We have all done this. 5 commits, zero information.
If I asked you which commit added the priority dropdown —
could you tell me? This is what reviewers and future-you hate."

### Step 4 — Squash into 1 clean commit

```bash
git rebase -i HEAD~5
```

In the editor — change lines 2 to 5 from pick to s:
```
pick  done
s     fix
s     now works
s     final
s     ACTUAL final
```

Save → replace all commit messages with:
```
feat: add priority labels (High / Medium / Low) to tasks
```

Save again. Then show the log:
```bash
git log --oneline
```

Say: "One commit. One clear message. This is what goes into
code review and stays in history forever."

### Step 5 — Merge feature → develop → main

```bash
git checkout develop
git merge feature/add-priority --no-ff -m "merge: add priority labels feature"
git push origin develop
```

Say: "Feature lands in develop first. This is our integration point.
The --no-ff flag keeps the merge commit visible —
you can always see this came from a feature branch."

```bash
git checkout main
git merge develop --no-ff -m "release: v1.1.0 — priority labels"
git push origin main
```

Say: "Now it is on main. But we do not deploy yet.
We tag it first."

### Step 6 — Tag and deploy

```bash
git tag v1.1.0
git push origin v1.1.0
```

Say: "That push just triggered our GitHub Actions pipeline.
Let us open the Actions tab and watch it run."

Open GitHub → Actions tab → show the pipeline running → show the output:
```
==========================================
 Deployment Successful!
 Version    : v1.1.0
 Deployed by: <your-username>
==========================================
```

Say: "Version, who deployed it, automated. No manual steps.
In a real project this would deploy to AWS, Kubernetes, or npm.
Same pattern — bigger pipeline."

### Step 7 — Show tags on GitHub

Open GitHub → Tags section

Say: "Look at this. v1.0.0 and v1.1.0. Two tags.
That is your entire release history.
Click on v1.0.0 — it shows you the exact commit,
the exact code that was in production on day one.
This is your audit trail."

### Step 8 — Rollback

In a real project, rollback means deploying the previous tag again.
You go to your pipeline, trigger a deployment with v1.0.0 tag,
and production goes back to that version.

To show it locally:
```bash
git checkout v1.0.0
```

Open the browser — priority labels are gone, badge shows v1.0.0.

```bash
git checkout main
```

Say: "This is what rollback looks like. No drama, no guessing.
You know exactly what v1.0.0 contains because you tagged it.
In production, you would re-trigger the pipeline with the old tag
and it deploys that version automatically."

---

## CLOSING — Key Takeaways

| # | Rule |
|---|---|
| 1 | Never push directly to main |
| 2 | Name branches clearly — with or without ticket numbers |
| 3 | Write meaningful commit messages |
| 4 | Squash before merging |
| 5 | Tag every release using semantic versioning |
| 6 | Let the pipeline deploy — not humans |
| 7 | Hotfix always from main |

**Final question to the room:**
> If your project got handed to a new developer today —
> could they open git log and understand what happened
> in the last 3 months?

> That is the goal. Not just code that works — code that communicates.

---

## Questions to Ask the Room

- Why do we not work directly on main?
- Why does main need 2 approvals but develop only needs 1?
- What is the difference between a branch and a tag?
- Why squash? Why not just merge all 5 commits as they are?
- What if we need to go back to v1.0.0 in production?
- What is the difference between a minor and a patch version?
- Can a developer push directly to main if there is no branch protection?
