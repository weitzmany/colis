"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__private__ = void 0;
exports.installLandfall = installLandfall;
const file_utils_1 = require("../utils/file-utils");
function renderLandfallWorkflow(options) {
    return `name: landfall-deploy

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

env:
  AWS_REGION: ${options.awsRegion}
  ECS_CLUSTER: ${options.ecsCluster}
  ECS_SERVICE: ${options.ecsService}
  S3_BUCKET: ${options.s3Bucket}
  CLOUDFRONT_DISTRIBUTION_ID: ${options.cloudFrontDistributionId}

jobs:
  deploy_frontend:
    name: Deploy Angular to S3 + CloudFront
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install frontend deps
        run: |
          if [ -d "frontend" ]; then
            cd frontend
            npm ci
          else
            npm ci
          fi

      - name: Build frontend
        run: |
          if [ -d "frontend" ]; then
            cd frontend
            npm run build
          else
            npm run build
          fi

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: \${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Sync artifacts to S3
        run: |
          DIST_PATH="dist"
          if [ -d "frontend/dist" ]; then DIST_PATH="frontend/dist"; fi
          aws s3 sync "$DIST_PATH" "s3://\${S3_BUCKET}" --delete

      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id "\${CLOUDFRONT_DISTRIBUTION_ID}" --paths "/*"

  deploy_backend:
    name: Deploy Slim API to ECS
    runs-on: ubuntu-latest
    needs: deploy_frontend
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: \${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Build and push container image
        run: |
          echo "Build backend image and push to ECR."
          echo "Set ECR repo + task definition in project-specific extensions."
          echo "Tag: \${GITHUB_REF_NAME}"

      - name: Update ECS service
        run: |
          aws ecs update-service --cluster "\${ECS_CLUSTER}" --service "\${ECS_SERVICE}" --force-new-deployment

  migrate_db:
    name: Run MySQL migrations
    runs-on: ubuntu-latest
    needs: deploy_backend
    steps:
      - uses: actions/checkout@v4
      - name: Execute migration command
        run: |
          echo "Run your migration command here (for example: php backend/bin/migrate.php)."
`;
}
async function installLandfall(options) {
    const result = (0, file_utils_1.createApplyResult)();
    await (0, file_utils_1.writeFileIfAllowed)(options.projectRoot, '.github/workflows/landfall-deploy.yml', renderLandfallWorkflow(options), Boolean(options.force), result);
    return result;
}
exports.__private__ = {
    renderLandfallWorkflow
};
//# sourceMappingURL=landfall.js.map