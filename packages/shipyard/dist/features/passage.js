"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPassage = installPassage;
const file_utils_1 = require("../utils/file-utils");
const PASSAGE_WORKFLOW = `name: passage-ci

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  dockside_parity:
    name: Dockside parity checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Dockside verify
        run: npm run ci:verify
`;
async function installPassage(options) {
    const result = (0, file_utils_1.createApplyResult)();
    await (0, file_utils_1.writeFileIfAllowed)(options.projectRoot, '.github/workflows/passage-ci.yml', PASSAGE_WORKFLOW, Boolean(options.force), result);
    return result;
}
//# sourceMappingURL=passage.js.map