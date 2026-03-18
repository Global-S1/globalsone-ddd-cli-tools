import {
  normalizeName,
  toCamelCase,
  toPascalCase,
  toKebabCase,
  capitalize,
  pluralizeName,
} from "../../src/utils/string-transformers";

describe("string-transformers", () => {
  describe("normalizeName", () => {
    it("should split PascalCase into parts", () => {
      expect(normalizeName("ProductCategory")).toEqual(["product", "category"]);
    });

    it("should split camelCase into parts", () => {
      expect(normalizeName("productCategory")).toEqual(["product", "category"]);
    });

    it("should split kebab-case into parts", () => {
      expect(normalizeName("product-category")).toEqual(["product", "category"]);
    });

    it("should split snake_case into parts", () => {
      expect(normalizeName("product_category")).toEqual(["product", "category"]);
    });

    it("should handle single word", () => {
      expect(normalizeName("Product")).toEqual(["product"]);
    });

    it("should handle multiple consecutive uppercase letters", () => {
      // The regex only splits on lowercase-to-uppercase transitions
      // "APIResponse" has no such transition, so it becomes a single word
      expect(normalizeName("APIResponse")).toEqual(["apiresponse"]);
    });

    it("should handle mixed case with proper transitions", () => {
      expect(normalizeName("getAPIResponse")).toEqual(["get", "apiresponse"]);
    });
  });

  describe("toCamelCase", () => {
    it("should convert PascalCase to camelCase", () => {
      expect(toCamelCase("ProductCategory")).toBe("productCategory");
    });

    it("should convert kebab-case to camelCase", () => {
      expect(toCamelCase("product-category")).toBe("productCategory");
    });

    it("should convert snake_case to camelCase", () => {
      expect(toCamelCase("product_category")).toBe("productCategory");
    });

    it("should handle single word", () => {
      expect(toCamelCase("Product")).toBe("product");
    });

    it("should handle already camelCase", () => {
      expect(toCamelCase("productCategory")).toBe("productCategory");
    });
  });

  describe("toPascalCase", () => {
    it("should convert camelCase to PascalCase", () => {
      expect(toPascalCase("productCategory")).toBe("ProductCategory");
    });

    it("should convert kebab-case to PascalCase", () => {
      expect(toPascalCase("product-category")).toBe("ProductCategory");
    });

    it("should convert snake_case to PascalCase", () => {
      expect(toPascalCase("product_category")).toBe("ProductCategory");
    });

    it("should handle single word", () => {
      expect(toPascalCase("product")).toBe("Product");
    });

    it("should handle already PascalCase", () => {
      expect(toPascalCase("ProductCategory")).toBe("ProductCategory");
    });
  });

  describe("toKebabCase", () => {
    it("should convert PascalCase to kebab-case", () => {
      expect(toKebabCase("ProductCategory")).toBe("product-category");
    });

    it("should convert camelCase to kebab-case", () => {
      expect(toKebabCase("productCategory")).toBe("product-category");
    });

    it("should convert snake_case to kebab-case", () => {
      expect(toKebabCase("product_category")).toBe("product-category");
    });

    it("should handle single word", () => {
      expect(toKebabCase("Product")).toBe("product");
    });

    it("should handle already kebab-case", () => {
      expect(toKebabCase("product-category")).toBe("product-category");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("product")).toBe("Product");
    });

    it("should handle already capitalized", () => {
      expect(capitalize("Product")).toBe("Product");
    });

    it("should handle single character", () => {
      expect(capitalize("p")).toBe("P");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("pluralizeName", () => {
    it("should pluralize regular words", () => {
      expect(pluralizeName("product")).toBe("products");
    });

    it("should pluralize irregular words", () => {
      expect(pluralizeName("person")).toBe("people");
    });

    it("should pluralize words ending in y", () => {
      expect(pluralizeName("category")).toBe("categories");
    });

    it("should use override when provided", () => {
      expect(pluralizeName("person", "persons")).toBe("persons");
    });

    it("should handle already plural words", () => {
      expect(pluralizeName("products")).toBe("products");
    });
  });
});
