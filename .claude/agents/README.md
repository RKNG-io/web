# Agent Context Folder

Shared context for Claude agents working on the Reckoning project in parallel.

---

## Purpose

When multiple agents work on this codebase, they need shared awareness of:
- What's already been done
- What's currently in progress
- Architectural decisions to follow
- Tech stack constraints

This folder provides that context.

---

## Files

| File | Read | Update | Purpose |
|------|------|--------|---------|
| `README.md` | Always | Rarely | How to use this folder |
| `SESSION-LOG.md` | Before starting | After completing work | History of completed features |
| `CURRENT-TASKS.md` | Before starting | When starting/finishing tasks | Avoid conflicts |
| `DECISIONS.md` | Before coding | When making new decisions | Architectural consistency |
| `TECH-STACK.md` | Before adding deps | When adding/removing packages | Prevent bloat |
| `ENVIRONMENT.md` | When debugging | When adding env vars | Required configuration |
| `FILE-MAP.md` | When exploring | When adding key files | Navigate codebase |

---

## Workflow

### Starting a Session

1. **Read `CURRENT-TASKS.md`**  -  Check what's in progress to avoid duplicating work
2. **Read `SESSION-LOG.md`**  -  Understand recent context and patterns
3. **Read `DECISIONS.md`**  -  Know the architectural constraints
4. **Claim your task**  -  Move it to "In Progress" in `CURRENT-TASKS.md`

### During Work

- Follow patterns in `DECISIONS.md`
- Check `TECH-STACK.md` before adding dependencies
- Reference `FILE-MAP.md` to find related code
- Check `ENVIRONMENT.md` if something isn't working

### Ending a Session

1. **Update `SESSION-LOG.md`**  -  Add what you completed with file paths
2. **Update `CURRENT-TASKS.md`**  -  Move completed tasks, add discovered tasks
3. **Update other files**  -  If you made new decisions, added deps, or created key files

---

## Rules

1. **Don't duplicate work**  -  Always check `CURRENT-TASKS.md` first
2. **Document decisions**  -  Future agents need to know why
3. **Keep it current**  -  Stale docs are worse than no docs
4. **Be specific**  -  Include file paths, not just descriptions

---

## Quick Reference

**Brand rules:**
- Outfit font only
- Colours from `tailwind.config.ts` only
- No gradient backgrounds
- No generic shadows

**Code patterns:**
- Tokens in URLs, not IDs
- Lazy client initialization
- Dev-friendly fallbacks
- Server-side price validation

**Database:**
- PostgreSQL at `postgresql://liz:localdev@localhost:5432/dev`
- Migrations in `database/` folder
- Direct queries (no ORM)
