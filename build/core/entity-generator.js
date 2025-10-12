"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGenerator = void 0;
const path_1 = __importDefault(require("path"));
const string_transformers_1 = require("../utils/string-transformers");
const file_system_1 = require("../utils/file-system");
const template_processor_1 = require("../utils/template-processor");
const code_injector_1 = require("../utils/code-injector");
const entity_tracker_1 = require("../utils/entity-tracker");
class EntityGenerator {
    constructor(options) {
        this.options = options;
        this.fileManager = new file_system_1.FileSystemManager(options.dryRun);
        const templatesPath = path_1.default.join(__dirname, "../templates");
        this.templateProcessor = new template_processor_1.TemplateProcessor(this.fileManager, templatesPath, options.layers);
        this.codeInjector = new code_injector_1.CodeInjector(options.dryRun);
        this.tracker = new entity_tracker_1.EntityTracker();
    }
    generate() {
        const { entityName, pluralName, database, layers, generateTests, generateMigrations } = this.options;
        const entity = (0, string_transformers_1.toCamelCase)(entityName);
        const entityCapitalized = (0, string_transformers_1.toPascalCase)(entityName);
        const entityKebab = (0, string_transformers_1.toKebabCase)(entityName);
        const entityPlural = (0, string_transformers_1.pluralizeName)(entity, pluralName);
        const entityPluralCapitalized = (0, string_transformers_1.toPascalCase)(entityPlural);
        const replacements = {
            ENTITY: entity,
            ENTITYCAPITALIZE: entityCapitalized,
            ENTITIES: entityPlural,
            ENTITIESCAPITALIZE: entityPluralCapitalized,
            ENTITYKEBAB: entityKebab,
        };
        const basePath = process.cwd();
        const contextBasePath = path_1.default.join(basePath, "src", "entities", entityKebab);
        const apiControllersPath = path_1.default.join(basePath, "src", "api", "controllers");
        const apiRoutesPath = path_1.default.join(basePath, "src", "api", "routes");
        const testBasePath = path_1.default.join(basePath, "test");
        const migrationsBasePath = path_1.default.join(basePath, "migrations");
        this.createDirectoryStructure(contextBasePath, apiControllersPath, apiRoutesPath, testBasePath, migrationsBasePath, entityKebab, layers, generateTests, generateMigrations);
        this.templateProcessor.processTemplates(path_1.default.join(__dirname, "../templates"), {
            contextBasePath,
            apiControllersPath,
            apiRoutesPath,
        }, replacements, entityKebab, database);
        // Generate tests if enabled
        if (generateTests) {
            this.generateTests(testBasePath, entityKebab, replacements);
        }
        // Generate migrations if enabled
        if (generateMigrations) {
            this.generateMigrations(migrationsBasePath, entityPlural, replacements, database);
        }
        // Auto-register repository if infrastructure layer is enabled
        if (layers.infrastructure && !this.options.dryRun) {
            this.codeInjector.injectRepositoryRegistration({
                entityName,
                entityCamelCase: entity,
                entityPascalCase: entityCapitalized,
                entityKebabCase: entityKebab,
                database,
            });
        }
        // Track generated files for rollback
        if (!this.options.dryRun) {
            this.trackGeneratedEntity(entityCapitalized, entityKebab, database);
        }
        this.printSummary(entityName, entityKebab);
    }
    createDirectoryStructure(contextBasePath, apiControllersPath, apiRoutesPath, testBasePath, migrationsBasePath, entityKebab, layers, generateTests, generateMigrations) {
        const foldersToCreate = [];
        if (layers.domain) {
            foldersToCreate.push(path_1.default.join(contextBasePath, "domain/interfaces"), path_1.default.join(contextBasePath, "domain/model"), path_1.default.join(contextBasePath, "domain/value-objects"), path_1.default.join(contextBasePath, "domain"));
        }
        if (layers.application) {
            foldersToCreate.push(path_1.default.join(contextBasePath, "application/use-cases"), path_1.default.join(contextBasePath, "application"));
        }
        if (layers.infrastructure) {
            foldersToCreate.push(path_1.default.join(contextBasePath, "infrastructure/repository"));
        }
        if (layers.api) {
            foldersToCreate.push(apiControllersPath, apiRoutesPath);
        }
        if (generateTests) {
            foldersToCreate.push(path_1.default.join(testBasePath, "helpers"), path_1.default.join(testBasePath, "unit", entityKebab, "domain", "model"), path_1.default.join(testBasePath, "unit", entityKebab, "application", "use-cases"));
        }
        if (generateMigrations) {
            foldersToCreate.push(migrationsBasePath);
        }
        foldersToCreate.forEach((folder) => this.fileManager.createDirectory(folder));
    }
    generateTests(testBasePath, entityKebab, replacements) {
        const templatesPath = path_1.default.join(__dirname, "../templates/test");
        // Generate fixtures
        this.generateTestFile(path_1.default.join(templatesPath, "helpers/entity-fixtures.tpl"), path_1.default.join(testBasePath, "helpers", `${entityKebab}-fixtures.ts`), replacements);
        // Generate domain model tests
        this.generateTestFile(path_1.default.join(templatesPath, "unit/domain/model/entity.test.tpl"), path_1.default.join(testBasePath, "unit", entityKebab, "domain", "model", `${entityKebab}.test.ts`), replacements);
        // Generate use case tests
        const useCases = ["create", "find", "update", "delete"];
        useCases.forEach((useCase) => {
            this.generateTestFile(path_1.default.join(templatesPath, `unit/application/use-cases/${useCase}-entity.test.tpl`), path_1.default.join(testBasePath, "unit", entityKebab, "application", "use-cases", `${useCase}-${entityKebab}.test.ts`), replacements);
        });
    }
    generateTestFile(templatePath, outputPath, replacements) {
        const fs = require("fs");
        if (!fs.existsSync(templatePath)) {
            console.warn(`⚠️  Template not found: ${templatePath}`);
            return;
        }
        let content = fs.readFileSync(templatePath, "utf-8");
        // Apply replacements
        const keys = [
            "ENTITYKEBAB",
            "ENTITIESCAPITALIZE",
            "ENTITYCAPITALIZE",
            "ENTITIES",
            "ENTITY",
        ];
        for (const key of keys) {
            const regex = new RegExp(key, "g");
            content = content.replace(regex, replacements[key]);
        }
        this.fileManager.writeFile(outputPath, content);
    }
    generateMigrations(migrationsBasePath, entityPlural, replacements, database) {
        const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").substring(0, 14);
        let templatePath;
        let fileName;
        // Determine template and file name based on database
        if (database === "mongo" || database === "mongodb") {
            templatePath = path_1.default.join(__dirname, "../templates/migrations/mongo/entities-collection-schema.tpl");
            fileName = `${entityPlural}-collection-schema.ts`;
        }
        else if (database === "postgres" || database === "postgresql") {
            templatePath = path_1.default.join(__dirname, "../templates/migrations/postgres/create_entities_table.tpl");
            fileName = `${timestamp}_create_${entityPlural}_table.ts`;
        }
        else {
            // Default to MySQL
            templatePath = path_1.default.join(__dirname, "../templates/migrations/mysql/create_entities_table.tpl");
            fileName = `${timestamp}_create_${entityPlural}_table.ts`;
        }
        const outputPath = path_1.default.join(migrationsBasePath, fileName);
        this.generateMigrationFile(templatePath, outputPath, replacements, timestamp);
    }
    generateMigrationFile(templatePath, outputPath, replacements, _timestamp) {
        const fs = require("fs");
        if (!fs.existsSync(templatePath)) {
            console.warn(`⚠️  Migration template not found: ${templatePath}`);
            return;
        }
        let content = fs.readFileSync(templatePath, "utf-8");
        // Apply replacements
        const keys = [
            "ENTITYKEBAB",
            "ENTITIESCAPITALIZE",
            "ENTITYCAPITALIZE",
            "ENTITIES",
            "ENTITY",
        ];
        for (const key of keys) {
            const regex = new RegExp(key, "g");
            content = content.replace(regex, replacements[key]);
        }
        // Replace timestamp placeholder
        content = content.replace(/\{\{timestamp\}\}/g, new Date().toISOString());
        this.fileManager.writeFile(outputPath, content);
    }
    printSummary(entityName, entityKebab) {
        if (this.options.dryRun) {
            console.log(`\n🔍 DRY RUN - No files were created\n`);
            this.fileManager.printOperationsSummary();
            console.log(`\n💡 Run without --dry-run to create these files\n`);
        }
        else {
            console.log(`\n✅ Entity "${entityName}" generated successfully in src/entities/${entityKebab}\n`);
            const operations = this.fileManager.getOperations();
            const fileCount = operations.filter((op) => op.type === "write").length;
            const dirCount = operations.filter((op) => op.type === "create").length;
            console.log(`📊 Summary:`);
            console.log(`   - ${dirCount} directories created`);
            console.log(`   - ${fileCount} files generated`);
            console.log(`   - Database: ${this.options.database}`);
            const enabledLayers = Object.entries(this.options.layers)
                .filter(([, enabled]) => enabled)
                .map(([layer]) => layer);
            console.log(`   - Layers: ${enabledLayers.join(", ")}`);
            console.log(`   - Tests: ${this.options.generateTests ? "✅ Generated" : "❌ Skipped"}`);
            console.log(`   - Migrations: ${this.options.generateMigrations ? "✅ Generated" : "❌ Skipped"}\n`);
        }
    }
    trackGeneratedEntity(entityName, entityKebab, database) {
        const operations = this.fileManager.getOperations();
        const files = operations
            .filter((op) => op.type === "write")
            .map((op) => op.path);
        const directories = operations
            .filter((op) => op.type === "create")
            .map((op) => op.path);
        const generatedEntity = {
            entityName,
            entityKebab,
            timestamp: new Date().toISOString(),
            database,
            files,
            directories,
        };
        this.tracker.track(generatedEntity);
        console.log(`   - Tracking: Enabled (use 'npm run generate:rollback ${entityKebab}' to undo)\n`);
    }
}
exports.EntityGenerator = EntityGenerator;
