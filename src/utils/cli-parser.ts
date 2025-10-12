export interface GeneratorOptions {
  entityName: string;
  database: string;
  pluralName?: string;
  dryRun: boolean;
  generateTests: boolean;
  generateMigrations: boolean;
  layers: {
    domain: boolean;
    application: boolean;
    infrastructure: boolean;
    api: boolean;
  };
}

export class CliParser {
  parse(args: string[]): GeneratorOptions {
    const [entityName] = args.filter((arg) => !arg.startsWith("--"));
    const options = this.parseOptions(args.filter((arg) => arg.startsWith("--")));

    return {
      entityName: entityName || "",
      database: this.normalizeDatabase(options.db || "mysql"),
      pluralName: options.pluralName,
      dryRun: options.dryRun === "true" || options["dry-run"] === "true",
      generateTests: options.tests !== "false" && options["skip-tests"] !== "true",
      generateMigrations: options.migrations === "true" || options["with-migrations"] === "true",
      layers: this.parseLayers(options.layers),
    };
  }

  private parseOptions(args: string[]): Record<string, string> {
    return args.reduce((acc, arg) => {
      const match = arg.match(/^--([^=]+)(?:=(.+))?$/);
      if (match) {
        const [, key, value] = match;
        acc[key] = value || "true";
      }
      return acc;
    }, {} as Record<string, string>);
  }

  private normalizeDatabase(db: string): string {
    const normalized = db.toLowerCase();
    return normalized === "mongodb" ? "mongo" : normalized;
  }

  private parseLayers(layersOption?: string): GeneratorOptions["layers"] {
    const defaultLayers = {
      domain: true,
      application: true,
      infrastructure: true,
      api: true,
    };

    if (!layersOption) {
      return defaultLayers;
    }

    const selectedLayers = layersOption.split(",").map((l) => l.trim().toLowerCase());

    return {
      domain: selectedLayers.includes("domain"),
      application: selectedLayers.includes("application"),
      infrastructure: selectedLayers.includes("infrastructure"),
      api: selectedLayers.includes("api"),
    };
  }

  printHelp(): void {
    console.log(`
📦 Entity Generator CLI

Usage:
  npm run generate -- <EntityName> [options]

Options:
  --db=<database>           Database type (mysql, mongo/mongodb, postgres) [default: mysql]
  --pluralName=<name>       Override plural form of entity name
  --dry-run                 Preview changes without creating files
  --skip-tests              Skip test generation [default: false]
  --with-migrations         Generate database migration files
  --layers=<layers>         Comma-separated list of layers to generate
                           (domain,application,infrastructure,api) [default: all]
  --help                    Show this help message

Examples:
  npm run generate -- User
  npm run generate -- Product --db=mongo
  npm run generate -- Category --pluralName=Categories
  npm run generate -- Order --dry-run
  npm run generate -- Customer --layers=domain,application
  npm run generate -- Post --db=mysql --pluralName=Posts --dry-run
  npm run generate -- Invoice --skip-tests
  npm run generate -- Payment --with-migrations --db=postgres

Supported databases:
  - mysql (default)
  - mongo / mongodb
  - postgres / postgresql

Available layers:
  - domain:         Entity models, interfaces, value objects, repositories
  - application:    Use cases and business logic
  - infrastructure: Database-specific repository implementations
  - api:            Controllers and routes

Test generation:
  - By default, generates unit tests for all layers
  - Use --skip-tests to disable test generation
  - Tests include: domain models, use cases, fixtures

Migration generation:
  - Use --with-migrations to generate database migration files
  - MySQL/PostgreSQL: Generates Knex migration files
  - MongoDB: Generates collection schema documentation
  - Migrations are timestamped and ready to run
`);
  }
}
