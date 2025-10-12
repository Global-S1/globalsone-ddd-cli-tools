import path from "path";
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  pluralizeName,
} from "../utils/string-transformers";
import { FileSystemManager } from "../utils/file-system";
import {
  TemplateProcessor,
  TemplateReplacements,
} from "../utils/template-processor";
import { GeneratorOptions } from "../utils/cli-parser";
import { CodeInjector } from "../utils/code-injector";
import { EntityTracker, GeneratedEntity } from "../utils/entity-tracker";

export class EntityGenerator {
  private fileManager: FileSystemManager;
  private templateProcessor: TemplateProcessor;
  private codeInjector: CodeInjector;
  private tracker: EntityTracker;

  constructor(private options: GeneratorOptions) {
    this.fileManager = new FileSystemManager(options.dryRun);
    const templatesPath = path.join(__dirname, "../templates");
    this.templateProcessor = new TemplateProcessor(
      this.fileManager,
      templatesPath,
      options.layers
    );
    this.codeInjector = new CodeInjector(options.dryRun);
    this.tracker = new EntityTracker();
  }

  generate(): void {
    const { entityName, pluralName, database, layers, generateTests, generateMigrations } = this.options;

    const entity = toCamelCase(entityName);
    const entityCapitalized = toPascalCase(entityName);
    const entityKebab = toKebabCase(entityName);
    const entityPlural = pluralizeName(entity, pluralName);
    const entityPluralCapitalized = toPascalCase(entityPlural);

    const replacements: TemplateReplacements = {
      ENTITY: entity,
      ENTITYCAPITALIZE: entityCapitalized,
      ENTITIES: entityPlural,
      ENTITIESCAPITALIZE: entityPluralCapitalized,
      ENTITYKEBAB: entityKebab,
    };

    const basePath = process.cwd();
    const contextBasePath = path.join(basePath, "src", "entities", entityKebab);
    const apiControllersPath = path.join(basePath, "src", "api", "controllers");
    const apiRoutesPath = path.join(basePath, "src", "api", "routes");
    const testBasePath = path.join(basePath, "test");
    const migrationsBasePath = path.join(basePath, "migrations");

    this.createDirectoryStructure(
      contextBasePath,
      apiControllersPath,
      apiRoutesPath,
      testBasePath,
      migrationsBasePath,
      entityKebab,
      layers,
      generateTests,
      generateMigrations
    );

    this.templateProcessor.processTemplates(
      path.join(__dirname, "../templates"),
      {
        contextBasePath,
        apiControllersPath,
        apiRoutesPath,
      },
      replacements,
      entityKebab,
      database
    );

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

  private createDirectoryStructure(
    contextBasePath: string,
    apiControllersPath: string,
    apiRoutesPath: string,
    testBasePath: string,
    migrationsBasePath: string,
    entityKebab: string,
    layers: GeneratorOptions["layers"],
    generateTests: boolean,
    generateMigrations: boolean
  ): void {
    const foldersToCreate: string[] = [];

    if (layers.domain) {
      foldersToCreate.push(
        path.join(contextBasePath, "domain/interfaces"),
        path.join(contextBasePath, "domain/model"),
        path.join(contextBasePath, "domain/value-objects"),
        path.join(contextBasePath, "domain")
      );
    }

    if (layers.application) {
      foldersToCreate.push(
        path.join(contextBasePath, "application/use-cases"),
        path.join(contextBasePath, "application")
      );
    }

    if (layers.infrastructure) {
      foldersToCreate.push(
        path.join(contextBasePath, "infrastructure/repository")
      );
    }

    if (layers.api) {
      foldersToCreate.push(apiControllersPath, apiRoutesPath);
    }

    if (generateTests) {
      foldersToCreate.push(
        path.join(testBasePath, "helpers"),
        path.join(testBasePath, "unit", entityKebab, "domain", "model"),
        path.join(testBasePath, "unit", entityKebab, "application", "use-cases")
      );
    }

    if (generateMigrations) {
      foldersToCreate.push(migrationsBasePath);
    }

    foldersToCreate.forEach((folder) => this.fileManager.createDirectory(folder));
  }

  private generateTests(
    testBasePath: string,
    entityKebab: string,
    replacements: TemplateReplacements
  ): void {
    const templatesPath = path.join(__dirname, "../templates/test");

    // Generate fixtures
    this.generateTestFile(
      path.join(templatesPath, "helpers/entity-fixtures.tpl"),
      path.join(testBasePath, "helpers", `${entityKebab}-fixtures.ts`),
      replacements
    );

    // Generate domain model tests
    this.generateTestFile(
      path.join(templatesPath, "unit/domain/model/entity.test.tpl"),
      path.join(testBasePath, "unit", entityKebab, "domain", "model", `${entityKebab}.test.ts`),
      replacements
    );

    // Generate use case tests
    const useCases = ["create", "find", "update", "delete"];
    useCases.forEach((useCase) => {
      this.generateTestFile(
        path.join(templatesPath, `unit/application/use-cases/${useCase}-entity.test.tpl`),
        path.join(testBasePath, "unit", entityKebab, "application", "use-cases", `${useCase}-${entityKebab}.test.ts`),
        replacements
      );
    });
  }

  private generateTestFile(
    templatePath: string,
    outputPath: string,
    replacements: TemplateReplacements
  ): void {
    const fs = require("fs");

    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠️  Template not found: ${templatePath}`);
      return;
    }

    let content = fs.readFileSync(templatePath, "utf-8");

    // Apply replacements
    const keys: (keyof TemplateReplacements)[] = [
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

  private generateMigrations(
    migrationsBasePath: string,
    entityPlural: string,
    replacements: TemplateReplacements,
    database: string
  ): void {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").substring(0, 14);

    let templatePath: string;
    let fileName: string;

    // Determine template and file name based on database
    if (database === "mongo" || database === "mongodb") {
      templatePath = path.join(__dirname, "../templates/migrations/mongo/entities-collection-schema.tpl");
      fileName = `${entityPlural}-collection-schema.ts`;
    } else if (database === "postgres" || database === "postgresql") {
      templatePath = path.join(__dirname, "../templates/migrations/postgres/create_entities_table.tpl");
      fileName = `${timestamp}_create_${entityPlural}_table.ts`;
    } else {
      // Default to MySQL
      templatePath = path.join(__dirname, "../templates/migrations/mysql/create_entities_table.tpl");
      fileName = `${timestamp}_create_${entityPlural}_table.ts`;
    }

    const outputPath = path.join(migrationsBasePath, fileName);

    this.generateMigrationFile(templatePath, outputPath, replacements, timestamp);
  }

  private generateMigrationFile(
    templatePath: string,
    outputPath: string,
    replacements: TemplateReplacements,
    _timestamp: string
  ): void {
    const fs = require("fs");

    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠️  Migration template not found: ${templatePath}`);
      return;
    }

    let content = fs.readFileSync(templatePath, "utf-8");

    // Apply replacements
    const keys: (keyof TemplateReplacements)[] = [
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

  private printSummary(entityName: string, entityKebab: string): void {
    if (this.options.dryRun) {
      console.log(`\n🔍 DRY RUN - No files were created\n`);
      this.fileManager.printOperationsSummary();
      console.log(
        `\n💡 Run without --dry-run to create these files\n`
      );
    } else {
      console.log(
        `\n✅ Entity "${entityName}" generated successfully in src/entities/${entityKebab}\n`
      );

      const operations = this.fileManager.getOperations();
      const fileCount = operations.filter((op) => op.type === "write").length;
      const dirCount = operations.filter((op) => op.type === "create").length;

      console.log(`📊 Summary:`);
      console.log(`   - ${dirCount} directories created`);
      console.log(`   - ${fileCount} files generated`);
      console.log(
        `   - Database: ${this.options.database}`
      );

      const enabledLayers = Object.entries(this.options.layers)
        .filter(([, enabled]) => enabled)
        .map(([layer]) => layer);

      console.log(`   - Layers: ${enabledLayers.join(", ")}`);
      console.log(`   - Tests: ${this.options.generateTests ? "✅ Generated" : "❌ Skipped"}`);
      console.log(`   - Migrations: ${this.options.generateMigrations ? "✅ Generated" : "❌ Skipped"}\n`);
    }
  }

  private trackGeneratedEntity(
    entityName: string,
    entityKebab: string,
    database: string
  ): void {
    const operations = this.fileManager.getOperations();
    const files = operations
      .filter((op) => op.type === "write")
      .map((op) => op.path);
    const directories = operations
      .filter((op) => op.type === "create")
      .map((op) => op.path);

    const generatedEntity: GeneratedEntity = {
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
