# Shipyard Quick Test Checklist

## 5-Minute Verification

- [ ] `npm install`
- [ ] `npm run build`
- [ ] `npm test`
- [ ] Create temp project with `package.json`
- [ ] Run `shipyard init --project-root <temp>`
- [ ] Confirm files:
  - [ ] `<temp>/package.json` has `dockside` and `ci:verify`
  - [ ] `<temp>/.githooks/pre-push`
  - [ ] `<temp>/.github/workflows/passage-ci.yml`
  - [ ] `<temp>/.github/workflows/landfall-deploy.yml`

## Fast Failure Signals

- Build fails -> TypeScript/API mismatch.
- Tests fail -> behavior regression.
- Missing generated files -> lifecycle wiring issue.
- Invalid workflow YAML -> template content issue.
