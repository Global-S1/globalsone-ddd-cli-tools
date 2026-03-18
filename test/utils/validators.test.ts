import { EntityValidator } from "../../src/utils/validators";

describe("EntityValidator", () => {
  let validator: EntityValidator;

  beforeEach(() => {
    validator = new EntityValidator();
  });

  describe("validateEntityName", () => {
    it("should accept valid PascalCase names", () => {
      const result = validator.validateEntityName("Product");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept valid camelCase names", () => {
      const result = validator.validateEntityName("productCategory");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept names with numbers", () => {
      const result = validator.validateEntityName("Product2");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept names with hyphens", () => {
      const result = validator.validateEntityName("product-category");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept names with underscores", () => {
      const result = validator.validateEntityName("product_category");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject empty names", () => {
      const result = validator.validateEntityName("");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Entity name cannot be empty");
    });

    it("should reject whitespace-only names", () => {
      const result = validator.validateEntityName("   ");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject names shorter than 2 characters", () => {
      const result = validator.validateEntityName("P");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Entity name must be at least 2 characters long");
    });

    it("should reject names starting with a number", () => {
      const result = validator.validateEntityName("2Product");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("start with a letter"))).toBe(true);
    });

    it("should reject names with special characters", () => {
      const result = validator.validateEntityName("Product@Category");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("letters, numbers, hyphens"))).toBe(true);
    });

    it("should reject names with spaces", () => {
      const result = validator.validateEntityName("Product Category");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateDatabase", () => {
    it("should accept mysql", () => {
      const result = validator.validateDatabase("mysql");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept mongo", () => {
      const result = validator.validateDatabase("mongo");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept mongodb", () => {
      const result = validator.validateDatabase("mongodb");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept uppercase database names", () => {
      const result = validator.validateDatabase("MYSQL");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid database types", () => {
      const result = validator.validateDatabase("sqlite");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid database type: "sqlite"');
    });

    it("should reject empty database", () => {
      const result = validator.validateDatabase("");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("validateOptions", () => {
    it("should accept valid options", () => {
      const result = validator.validateOptions({
        database: "mysql",
        pluralName: "Products",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept empty options", () => {
      const result = validator.validateOptions({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid database in options", () => {
      const result = validator.validateOptions({
        database: "invalid",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject empty pluralName when provided", () => {
      const result = validator.validateOptions({
        pluralName: "   ",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Plural name cannot be empty if provided");
    });

    it("should accept undefined pluralName", () => {
      const result = validator.validateOptions({
        pluralName: undefined,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
