"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const chalk_1 = __importDefault(require("chalk"));
const dockside_1 = require("../features/dockside");
const passage_1 = require("../features/passage");
const landfall_1 = require("../features/landfall");
function mergeResults(target, source) {
    target.updatedFiles.push(...source.updatedFiles);
    target.skippedFiles.push(...source.skippedFiles);
    target.warnings.push(...source.warnings);
}
async function init(options) {
    const result = {
        updatedFiles: [],
        skippedFiles: [],
        warnings: []
    };
    console.log(chalk_1.default.blue('\n⚓ Shipyard init'));
    console.log(chalk_1.default.gray(`Target: ${options.projectRoot}`));
    const docksideResult = await (0, dockside_1.installDockside)({
        projectRoot: options.projectRoot,
        force: options.force
    });
    mergeResults(result, docksideResult);
    const passageResult = await (0, passage_1.installPassage)({
        projectRoot: options.projectRoot,
        force: options.force
    });
    mergeResults(result, passageResult);
    const landfallOptions = {
        projectRoot: options.projectRoot,
        force: options.force,
        awsRegion: options.landfall?.awsRegion || 'us-east-1',
        ecsCluster: options.landfall?.ecsCluster || 'your-ecs-cluster',
        ecsService: options.landfall?.ecsService || 'your-ecs-service',
        s3Bucket: options.landfall?.s3Bucket || 'your-frontend-bucket',
        cloudFrontDistributionId: options.landfall?.cloudFrontDistributionId || 'YOUR_DISTRIBUTION_ID'
    };
    const landfallResult = await (0, landfall_1.installLandfall)(landfallOptions);
    mergeResults(result, landfallResult);
    if (result.updatedFiles.length > 0) {
        console.log(chalk_1.default.green(`\n✓ Updated ${result.updatedFiles.length} file(s)`));
    }
    if (result.skippedFiles.length > 0) {
        console.log(chalk_1.default.yellow(`⚠ Skipped ${result.skippedFiles.length} file(s) (use --force to overwrite)`));
    }
    if (result.warnings.length > 0) {
        console.log(chalk_1.default.yellow('\nWarnings:'));
        for (const warning of result.warnings) {
            console.log(chalk_1.default.yellow(`- ${warning}`));
        }
    }
    return result;
}
//# sourceMappingURL=init.js.map