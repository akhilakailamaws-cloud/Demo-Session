# Git Versioning, Deployment & Release — Quiz

## Instructions

Real scenarios. No obvious answers. Think before you pick.

---

## Question 1

You want to start working on a new feature called priority labels.
Your repo has `main` and `develop` branches.

**What is the correct first step?**

- A. Start coding directly on `main`
- B. Start coding directly on `develop`
- C. Create `feature/add-priority` from `develop`
- D. Create `feature/add-priority` from `main`

---

## Question 2

Your team just finished testing `v1.1.0` in INT.
You are ready to release it to production.

**Which command correctly creates and pushes a release tag?**

- A. `git branch v1.1.0 && git push origin v1.1.0`
- B. `git tag v1.1.0 && git push origin v1.1.0`
- C. `git commit -m "v1.1.0" && git push origin main`
- D. `git release v1.1.0`

---

## Question 3

You are working on `feature/add-priority`.
You made 6 commits over 2 days:

```
wip
trying something
broke it
fixed
almost
done finally
```

Your PR is ready. Your TL opens the PR and sees these 6 commits.

**What should you have done before raising the PR, and why does it matter?**

- A. Nothing — commits are just checkpoints, history does not matter
- B. Squash them into one or two meaningful commits so the reviewer understands what changed and the shared history stays clean
- C. Delete the branch and recreate it with one commit
- D. Add a comment in the PR explaining each commit

---

## Question 4 

You created `feature/add-priority` from `develop` on Monday.
It is now Thursday. Three other developers have merged their features into `develop` since then.

You raise a PR and it shows 14 conflicts.

**What should you have done before raising the PR to avoid this?**

- A. Merged `main` into your feature branch
- B. Raised the PR anyway and asked someone else to fix the conflicts
- C. Rebased your feature branch on top of the latest `develop` locally before raising the PR
- D. Created a new branch from `develop` and copied your changes manually

---

## Question 5

It is Friday evening. `v1.2.0` was deployed to production an hour ago.
Users are reporting that login is completely broken.
`develop` has 3 unfinished features from the current sprint.

**What is the correct next step?**

- A. Fix the bug on `develop` and deploy it directly to production
- B. Create a `hotfix/fix-login` branch from `main`, fix it, merge back to `main` and tag a new release, then merge the fix into `develop`
- C. Revert all commits on `main` to go back to `v1.1.0`
- D. Ask the team to finish their features quickly so everything can go together

---

## Question 6

Your team just merged the priority labels feature into `main`.
You run:

```bash
git tag v1.1.0
git push origin v1.1.0
```

GitHub Actions runs and prints:

```
Deployment Successful!
Version    : v1.1.0
Deployed by: akhila
```

Next sprint, a critical bug is found in `v1.1.0`.
The previous stable release was `v1.0.0`.

**How do you roll back production?**

- A. Run `git checkout v1.0.0` on the server
- B. Delete the `v1.1.0` tag and push again
- C. Re-trigger the pipeline using the `v1.0.0` tag so the previous known-good version is deployed
- D. Manually copy the old files to the server

---

## Question 7

Your team has this git log after the full release flow:

```
* e5f3a1c  release: v1.1.0 — priority labels         ← main
|\
| * 9d2b4f1  merge: add priority labels feature       ← develop
| |\
| | * f711fe5  feat: add priority labels to tasks     ← feature branch
|/
* a8dfad0  feat: initial TaskFlow app                 ← v1.0.0
```

A developer on your team suggests running this on `develop`
because the history looks messy:

```bash
git rebase -i HEAD~10
git push origin develop --force
```

**What is the impact of this and why is it dangerous?**

- A. No impact — rebase only affects local history
- B. It rewrites the commit hashes on `develop`. Every developer who has pulled from `develop` will have a diverged history and will face serious conflicts. It can corrupt the shared branch.
- C. It will automatically fix all conflicts for everyone
- D. It only affects the feature branches, not `develop`
