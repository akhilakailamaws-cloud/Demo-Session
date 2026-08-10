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
