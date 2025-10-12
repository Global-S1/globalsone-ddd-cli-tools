#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_parser_1 = require("./utils/cli-parser");
const validators_1 = require("./utils/validators");
const entity_generator_1 = require("./core/entity-generator");
function main() {
    const parser = new cli_parser_1.CliParser();
    const validator = new validators_1.EntityValidator();
    const args = process.argv.slice(2);
    // Handle help flag
    if (args.includes("--help") || args.includes("-h")) {
        parser.printHelp();
        process.exit(0);
    }
    // Parse CLI arguments
    const options = parser.parse(args);
    // Validate entity name
    const nameValidation = validator.validateEntityName(options.entityName);
    if (!nameValidation.valid) {
        console.error("❌ Entity name validation failed:\n");
        nameValidation.errors.forEach((error) => console.error(`   - ${error}`));
        console.error("\n💡 Run with --help for usage information\n");
        process.exit(1);
    }
    // Validate options
    const optionsValidation = validator.validateOptions({
        database: options.database,
        pluralName: options.pluralName,
    });
    if (!optionsValidation.valid) {
        console.error("❌ Options validation failed:\n");
        optionsValidation.errors.forEach((error) => console.error(`   - ${error}`));
        console.error("\n💡 Run with --help for usage information\n");
        process.exit(1);
    }
    // Generate entity
    try {
        const generator = new entity_generator_1.EntityGenerator(options);
        generator.generate();
    }
    catch (error) {
        console.error("❌ Error generating entity:");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
main();
