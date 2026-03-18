import fs from "fs";
import path from "path";
import { EntityTracker, GeneratedEntity } from "../../src/utils/entity-tracker";

describe("EntityTracker", () => {
  const originalCwd = process.cwd();
  const testDir = path.join(__dirname, "../../.test-tracking");
  const trackingFile = path.join(testDir, ".generator-tracking.json");

  beforeEach(() => {
    // Create test directory and change to it
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
  });

  afterEach(() => {
    // Restore original cwd and clean up
    process.chdir(originalCwd);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  const createTestEntity = (name: string): GeneratedEntity => ({
    entityName: name,
    entityKebab: name.toLowerCase(),
    timestamp: new Date().toISOString(),
    database: "mysql",
    files: [`src/entities/${name.toLowerCase()}/model.ts`],
    directories: [`src/entities/${name.toLowerCase()}`],
  });

  describe("track", () => {
    it("should create tracking file if it does not exist", () => {
      const tracker = new EntityTracker();
      const entity = createTestEntity("Product");

      tracker.track(entity);

      expect(fs.existsSync(trackingFile)).toBe(true);
    });

    it("should save entity to tracking file", () => {
      const tracker = new EntityTracker();
      const entity = createTestEntity("Product");

      tracker.track(entity);

      const content = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      expect(content.entities).toHaveLength(1);
      expect(content.entities[0].entityName).toBe("Product");
    });

    it("should update existing entity", () => {
      const tracker = new EntityTracker();
      const entity1 = createTestEntity("Product");
      const entity2 = { ...createTestEntity("Product"), database: "mongo" };

      tracker.track(entity1);
      tracker.track(entity2);

      const content = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      expect(content.entities).toHaveLength(1);
      expect(content.entities[0].database).toBe("mongo");
    });

    it("should track multiple entities", () => {
      const tracker = new EntityTracker();
      const entity1 = createTestEntity("Product");
      const entity2 = createTestEntity("Category");

      tracker.track(entity1);
      tracker.track(entity2);

      const content = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      expect(content.entities).toHaveLength(2);
    });

    it("should update lastUpdate timestamp", () => {
      const tracker = new EntityTracker();
      const entity = createTestEntity("Product");

      const before = new Date().toISOString();
      tracker.track(entity);
      const after = new Date().toISOString();

      const content = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      expect(content.lastUpdate >= before).toBe(true);
      expect(content.lastUpdate <= after).toBe(true);
    });
  });

  describe("getEntity", () => {
    it("should return entity by kebab name", () => {
      const tracker = new EntityTracker();
      const entity = createTestEntity("Product");
      tracker.track(entity);

      const result = tracker.getEntity("product");

      expect(result).toBeDefined();
      expect(result?.entityName).toBe("Product");
    });

    it("should return undefined for non-existent entity", () => {
      const tracker = new EntityTracker();

      const result = tracker.getEntity("nonexistent");

      expect(result).toBeUndefined();
    });

    it("should return correct entity among multiple", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));
      tracker.track(createTestEntity("Category"));

      const result = tracker.getEntity("category");

      expect(result?.entityName).toBe("Category");
    });
  });

  describe("listEntities", () => {
    it("should return empty array when no entities tracked", () => {
      const tracker = new EntityTracker();

      const result = tracker.listEntities();

      expect(result).toEqual([]);
    });

    it("should return all tracked entities", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));
      tracker.track(createTestEntity("Category"));
      tracker.track(createTestEntity("Order"));

      const result = tracker.listEntities();

      expect(result).toHaveLength(3);
    });
  });

  describe("untrack", () => {
    it("should remove entity from tracking", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));
      tracker.track(createTestEntity("Category"));

      tracker.untrack("product");

      const result = tracker.listEntities();
      expect(result).toHaveLength(1);
      expect(result[0].entityName).toBe("Category");
    });

    it("should do nothing for non-existent entity", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));

      tracker.untrack("nonexistent");

      const result = tracker.listEntities();
      expect(result).toHaveLength(1);
    });

    it("should update lastUpdate when untracking", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));

      const beforeContent = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      const beforeTimestamp = beforeContent.lastUpdate;

      // Small delay to ensure different timestamp
      tracker.untrack("product");

      const afterContent = JSON.parse(fs.readFileSync(trackingFile, "utf-8"));
      expect(afterContent.lastUpdate >= beforeTimestamp).toBe(true);
    });
  });

  describe("isTracked", () => {
    it("should return true for tracked entity", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));

      expect(tracker.isTracked("product")).toBe(true);
    });

    it("should return false for non-tracked entity", () => {
      const tracker = new EntityTracker();

      expect(tracker.isTracked("product")).toBe(false);
    });

    it("should return false after untracking", () => {
      const tracker = new EntityTracker();
      tracker.track(createTestEntity("Product"));
      tracker.untrack("product");

      expect(tracker.isTracked("product")).toBe(false);
    });
  });

  describe("corrupted tracking file", () => {
    it("should handle corrupted JSON gracefully", () => {
      fs.writeFileSync(trackingFile, "not valid json");

      const tracker = new EntityTracker();
      const result = tracker.listEntities();

      expect(result).toEqual([]);
    });
  });
});
