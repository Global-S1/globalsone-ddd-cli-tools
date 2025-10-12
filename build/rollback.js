"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rollback_manager_1 = require("./utils/rollback-manager");
const entity_tracker_1 = require("./utils/entity-tracker");
function main() {
    const args = process.argv.slice(2);
    // Handle help
    if (args.includes("--help") || args.includes("-h") || args.length === 0) {
        printHelp();
        process.exit(0);
    }
    // Handle list command
    if (args.includes("--list") || args.includes("-l")) {
        listEntities();
        process.exit(0);
    }
    // Handle dry-run
    const dryRun = args.includes("--dry-run");
    // Get entity name
    const entityKebab = args.find((arg) => !arg.startsWith("--"));
    if (!entityKebab) {
        console.error("❌ Please provide an entity name to rollback\n");
        console.log("💡 Use --list to see available entities\n");
        process.exit(1);
    }
    // Execute rollback
    const manager = new rollback_manager_1.RollbackManager(dryRun);
    if (dryRun) {
        console.log(`\n🔍 DRY RUN - Preview rollback for entity: ${entityKebab}\n`);
    }
    else {
        console.log(`\n🗑️  Rolling back entity: ${entityKebab}\n`);
    }
    const result = manager.rollback(entityKebab);
    // Print results
    if (result.success) {
        console.log(`\n✅ Rollback completed successfully!`);
        console.log(`   - Files deleted: ${result.filesDeleted}`);
        console.log(`   - Directories deleted: ${result.directoriesDeleted}\n`);
        if (dryRun) {
            console.log(`💡 Run without --dry-run to actually delete these files\n`);
        }
    }
    else {
        console.error(`\n❌ Rollback failed with ${result.errors.length} error(s):`);
        result.errors.forEach((error) => console.error(`   - ${error}`));
        console.log();
        process.exit(1);
    }
}
function listEntities() {
    const tracker = new entity_tracker_1.EntityTracker();
    const entities = tracker.listEntities();
    if (entities.length === 0) {
        console.log("\n📭 No tracked entities found\n");
        console.log("Generate an entity first with: npm run generate -- EntityName\n");
        return;
    }
    console.log(`\n📋 Tracked Entities (${entities.length}):\n`);
    entities.forEach((entity, index) => {
        console.log(`${index + 1}. ${entity.entityKebab}`);
        console.log(`   Name: ${entity.entityName}`);
        console.log(`   Database: ${entity.database}`);
        console.log(`   Generated: ${new Date(entity.timestamp).toLocaleString()}`);
        console.log(`   Files: ${entity.files.length}`);
        console.log(`   Directories: ${entity.directories.length}`);
        console.log();
    });
    console.log(`💡 To rollback an entity: npm run generate:rollback <entity-kebab>\n`);
}
function printHelp() {
    console.log(`
🗑️  Entity Rollback Tool

Usage:
  npm run generate:rollback -- <entity-kebab> [options]

Options:
  --dry-run                 Preview rollback without deleting files
  --list, -l                List all tracked entities
  --help, -h                Show this help message

Examples:
  # List tracked entities
  npm run generate:rollback -- --list

  # Preview rollback
  npm run generate:rollback -- product --dry-run

  # Rollback an entity
  npm run generate:rollback -- product

  # Rollback multiple entities
  npm run generate:rollback -- user
  npm run generate:rollback -- product
  npm run generate:rollback -- order

What gets rolled back:
  ✓ All generated files (domain, application, infrastructure, api)
  ✓ Test files and fixtures
  ✓ Migration files
  ✓ Empty directories
  ✓ AppContext registrations (imports and properties)
  ✓ Tracking metadata

Notes:
  - Rollback is tracked automatically when you generate an entity
  - Only empty directories are deleted (safety measure)
  - AppContext modifications are automatically cleaned
  - Use --dry-run to preview before actual rollback
`);
}
main();
