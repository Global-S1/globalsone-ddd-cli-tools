import { CliParser } from "../../src/utils/cli-parser";

describe("CliParser", () => {
  let parser: CliParser;

  beforeEach(() => {
    parser = new CliParser();
  });

  describe("parse", () => {
    it("should parse entity name", () => {
      const result = parser.parse(["Product"]);
      expect(result.entityName).toBe("Product");
    });

    it("should use mysql as default database", () => {
      const result = parser.parse(["Product"]);
      expect(result.database).toBe("mysql");
    });

    it("should parse --db option", () => {
      const result = parser.parse(["Product", "--db=mongo"]);
      expect(result.database).toBe("mongo");
    });

    it("should normalize mongodb to mongo", () => {
      const result = parser.parse(["Product", "--db=mongodb"]);
      expect(result.database).toBe("mongo");
    });

    it("should parse --pluralName option", () => {
      const result = parser.parse(["Product", "--pluralName=Products"]);
      expect(result.pluralName).toBe("Products");
    });

    it("should parse --dry-run flag", () => {
      const result = parser.parse(["Product", "--dry-run"]);
      expect(result.dryRun).toBe(true);
    });

    it("should parse --dryRun flag", () => {
      const result = parser.parse(["Product", "--dryRun=true"]);
      expect(result.dryRun).toBe(true);
    });

    it("should default dryRun to false", () => {
      const result = parser.parse(["Product"]);
      expect(result.dryRun).toBe(false);
    });

    it("should generate tests by default", () => {
      const result = parser.parse(["Product"]);
      expect(result.generateTests).toBe(true);
    });

    it("should skip tests with --skip-tests", () => {
      const result = parser.parse(["Product", "--skip-tests"]);
      expect(result.generateTests).toBe(false);
    });

    it("should skip tests with --tests=false", () => {
      const result = parser.parse(["Product", "--tests=false"]);
      expect(result.generateTests).toBe(false);
    });

    it("should not generate migrations by default", () => {
      const result = parser.parse(["Product"]);
      expect(result.generateMigrations).toBe(false);
    });

    it("should generate migrations with --with-migrations", () => {
      const result = parser.parse(["Product", "--with-migrations"]);
      expect(result.generateMigrations).toBe(true);
    });

    it("should generate migrations with --migrations=true", () => {
      const result = parser.parse(["Product", "--migrations=true"]);
      expect(result.generateMigrations).toBe(true);
    });

    it("should generate all layers by default", () => {
      const result = parser.parse(["Product"]);
      expect(result.layers).toEqual({
        domain: true,
        application: true,
        infrastructure: true,
        api: true,
      });
    });

    it("should parse specific layers", () => {
      const result = parser.parse(["Product", "--layers=domain,application"]);
      expect(result.layers).toEqual({
        domain: true,
        application: true,
        infrastructure: false,
        api: false,
      });
    });

    it("should parse single layer", () => {
      const result = parser.parse(["Product", "--layers=domain"]);
      expect(result.layers).toEqual({
        domain: true,
        application: false,
        infrastructure: false,
        api: false,
      });
    });

    it("should handle empty entity name", () => {
      const result = parser.parse(["--db=mysql"]);
      expect(result.entityName).toBe("");
    });

    it("should parse multiple options together", () => {
      const result = parser.parse([
        "Product",
        "--db=postgres",
        "--pluralName=Products",
        "--dry-run",
        "--skip-tests",
        "--with-migrations",
        "--layers=domain,infrastructure",
      ]);

      expect(result.entityName).toBe("Product");
      expect(result.database).toBe("postgres");
      expect(result.pluralName).toBe("Products");
      expect(result.dryRun).toBe(true);
      expect(result.generateTests).toBe(false);
      expect(result.generateMigrations).toBe(true);
      expect(result.layers).toEqual({
        domain: true,
        application: false,
        infrastructure: true,
        api: false,
      });
    });

    it("should ignore unknown options", () => {
      const result = parser.parse(["Product", "--unknown=value"]);
      expect(result.entityName).toBe("Product");
      expect(result.database).toBe("mysql");
    });

    it("should handle case-insensitive database", () => {
      const result = parser.parse(["Product", "--db=MYSQL"]);
      expect(result.database).toBe("mysql");
    });

    it("should handle layers with spaces", () => {
      const result = parser.parse(["Product", "--layers=domain, application, api"]);
      expect(result.layers.domain).toBe(true);
      expect(result.layers.application).toBe(true);
      expect(result.layers.api).toBe(true);
      expect(result.layers.infrastructure).toBe(false);
    });
  });
});
