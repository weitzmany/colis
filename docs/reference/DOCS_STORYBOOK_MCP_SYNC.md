# Docs + Storybook + MCP Sync Reference

## Purpose

This document defines the validation gates and checklists that enforce synchronization between:
- Package source code (`packages/*/`)
- Documentation portal (`packages/chartroom/`)
- Storybook (`packages/keel-storybook/`)
- MCP server data (`packages/keel-mcp/src/data/`)

**Rule source**: `.cursor/rules/package_docs_sync.mdc`

---

## Gate Definitions

### Gate 1: Package Change → Docs

Triggers when any file under `packages/<pkg>/src/` changes.

| File Changed | Required Docs Update |
|-------------|---------------------|
| Any `packages/keel/src/**` | `docs/features/keel/PRD.md`, `packages/keel/README.md`, chartroom keel pages |
| Any `packages/hull/src/**` | `docs/features/hull/PRD.md`, `packages/hull/README.md`, chartroom hull pages |
| Any new `packages/<pkg>/` | New `docs/features/<pkg>/PRD.md` and `TASKS.md` required |
| `packages/keel/src/tokens/defaults.css` | `docs/reference/KEEL_HULL_TOKEN_CONTRACT.md`, `packages/keel-mcp/src/data/tokens.ts` |

### Gate 2: Keel/Hull Change → Storybook

Triggers when any file under `packages/keel/src/` or `packages/hull/src/` changes.

| Change Type | Required Storybook Update |
|------------|--------------------------|
| New component added | New story file in `packages/keel-storybook/stories/components/` |
| Component API changed | Update `argTypes` in existing story file |
| Hull token value changed | Update `stories/themes/` stories and `preview-head.html` |
| New hull theme | New theme story + update `ThemeMatrix.stories.ts` |

### Gate 3: Keel/Hull/Storybook/Docs Change → MCP

Triggers when any component API, token, example, story, or docs page changes.

| Change Type | Required MCP Update |
|------------|---------------------|
| New component | `packages/keel-mcp/src/data/components.ts` — add entry |
| Component API change | `packages/keel-mcp/src/data/components.ts` — update inputs/outputs |
| New usage example | `packages/keel-mcp/src/data/examples.ts` — add example |
| Token contract change | `packages/keel-mcp/src/data/tokens.ts` — update token list |
| New story added | `packages/keel-mcp/src/data/story-links.ts` — add story link |
| New chartroom page | `packages/keel-mcp/src/data/docs-links.ts` — add docs link |

---

## Task Completion Checklist

Copy this checklist into any task/subtask that involves package changes.

### For Any Package Change

```markdown
- [ ] `docs/features/<pkg>/PRD.md` updated or created
- [ ] `docs/features/<pkg>/TASKS.md` updated or created
- [ ] `packages/<pkg>/README.md` updated
- [ ] `docs/reference/PROJECTS_LIST.md` entry current
```

### Additionally for Keel/Hull Changes

```markdown
- [ ] Storybook: story file exists/updated in `packages/keel-storybook/stories/`
- [ ] Storybook: `ThemeMatrix.stories.ts` updated if needed
- [ ] MCP: `packages/keel-mcp/src/data/components.ts` current
- [ ] MCP: `packages/keel-mcp/src/data/tokens.ts` current
- [ ] MCP: `packages/keel-mcp/src/data/examples.ts` current
- [ ] MCP: `packages/keel-mcp/src/data/story-links.ts` current
- [ ] MCP: `packages/keel-mcp/src/data/docs-links.ts` current
- [ ] MCP: rebuild `packages/keel-mcp` → `npm run build`
- [ ] Chartroom: relevant docs page updated
- [ ] Chartroom: rebuild `packages/chartroom` → `npm run build`
```

---

## CI Integration (Future)

The following CI checks should be added to enforce these gates automatically.

### Check: Docs Completeness

```yaml
# .github/workflows/docs-sync.yml (future)
name: Docs Sync Check
on: [pull_request]
jobs:
  check-docs:
    steps:
      - name: Verify keel docs updated when keel source changes
        run: |
          KEEL_CHANGED=$(git diff --name-only origin/main... | grep "^packages/keel/src/")
          if [ -n "$KEEL_CHANGED" ]; then
            DOCS_CHANGED=$(git diff --name-only origin/main... | grep "docs/features/keel/")
            if [ -z "$DOCS_CHANGED" ]; then
              echo "ERROR: packages/keel/src changed but docs/features/keel/ was not updated"
              exit 1
            fi
          fi
```

### Check: Storybook Sync

```yaml
      - name: Verify storybook updated when keel/hull changes
        run: |
          KEEL_HULL_CHANGED=$(git diff --name-only origin/main... | grep -E "^packages/(keel|hull)/src/")
          if [ -n "$KEEL_HULL_CHANGED" ]; then
            STORYBOOK_CHANGED=$(git diff --name-only origin/main... | grep "^packages/keel-storybook/")
            if [ -z "$STORYBOOK_CHANGED" ]; then
              echo "ERROR: keel/hull changed but keel-storybook was not updated"
              exit 1
            fi
          fi
```

### Check: MCP Data Sync

```yaml
      - name: Verify MCP data updated when components/tokens change
        run: |
          COMPONENT_CHANGED=$(git diff --name-only origin/main... | grep -E "^packages/(keel|hull)/src/")
          if [ -n "$COMPONENT_CHANGED" ]; then
            MCP_CHANGED=$(git diff --name-only origin/main... | grep "^packages/keel-mcp/src/data/")
            if [ -z "$MCP_CHANGED" ]; then
              echo "ERROR: keel/hull source changed but keel-mcp data was not updated"
              exit 1
            fi
          fi
```

### Check: MCP Build Valid

```yaml
      - name: Verify keel-mcp builds after data changes
        run: |
          cd packages/keel-mcp
          npm run build
```

### Check: Chartroom Build Valid

```yaml
      - name: Verify chartroom builds after docs changes
        run: |
          cd packages/chartroom
          npm run build
```

---

## Validation Script

A local validation script can be run before marking tasks done:

```bash
#!/bin/bash
# scripts/validate-sync.sh

echo "=== Colis Sync Validation ==="

# Check keel-mcp builds
echo "\n→ Building keel-mcp..."
cd packages/keel-mcp && npm run build && echo "✅ keel-mcp builds" || echo "❌ keel-mcp build failed"
cd ../..

# Check chartroom builds
echo "\n→ Building chartroom..."
cd packages/chartroom && npm run build && echo "✅ chartroom builds" || echo "❌ chartroom build failed"
cd ../..

echo "\n=== Done ==="
```

---

## Linked Rules and References

- **Enforcement Rule**: `.cursor/rules/package_docs_sync.mdc`
- **Token Contract**: `docs/reference/KEEL_HULL_TOKEN_CONTRACT.md`
- **Projects List**: `docs/reference/PROJECTS_LIST.md`
- **Verdaccio Order**: `VERDACCIO_SETUP.md`

---

**Created**: 2026-02-21  
**Purpose**: Validation gate definitions, checklists, and future CI specs for docs/storybook/MCP sync enforcement.
