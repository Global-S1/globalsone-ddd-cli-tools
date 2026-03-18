import fs from "fs";
import path from "path";
import { FileSystemManager } from "../../src/utils/file-system";

describe("FileSystemManager", () => {
  const testDir = path.join(__dirname, "../../.test-output");

  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up after all tests
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("constructor", () => {
    it("should create instance with dryRun false by default", () => {
      const fsm = new FileSystemManager();
      expect(fsm.getOperations()).toHaveLength(0);
    });

    it("should create instance with dryRun option", () => {
      const fsm = new FileSystemManager(true);
      expect(fsm.getOperations()).toHaveLength(0);
    });
  });

  describe("createDirectory", () => {
    it("should record directory creation operation", () => {
      const fsm = new FileSystemManager(true);
      fsm.createDirectory(path.join(testDir, "test-dir"));

      const operations = fsm.getOperations();
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe("create");
      expect(operations[0].path).toContain("test-dir");
    });

    it("should not create directory in dry run mode", () => {
      const fsm = new FileSystemManager(true);
      const dirPath = path.join(testDir, "dry-run-dir");
      fsm.createDirectory(dirPath);

      expect(fs.existsSync(dirPath)).toBe(false);
    });

    it("should create directory in normal mode", () => {
      const fsm = new FileSystemManager(false);
      const dirPath = path.join(testDir, "real-dir");
      fsm.createDirectory(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it("should create nested directories", () => {
      const fsm = new FileSystemManager(false);
      const dirPath = path.join(testDir, "nested/deep/directory");
      fsm.createDirectory(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  describe("writeFile", () => {
    it("should record file write operation", () => {
      const fsm = new FileSystemManager(true);
      fsm.writeFile(path.join(testDir, "test.txt"), "content");

      const operations = fsm.getOperations();
      expect(operations).toHaveLength(1);
      expect(operations[0].type).toBe("write");
      expect(operations[0].content).toBe("content");
    });

    it("should not write file in dry run mode", () => {
      const fsm = new FileSystemManager(true);
      const filePath = path.join(testDir, "dry-run.txt");
      fsm.writeFile(filePath, "content");

      expect(fs.existsSync(filePath)).toBe(false);
    });

    it("should write file in normal mode", () => {
      const fsm = new FileSystemManager(false);
      const filePath = path.join(testDir, "real-file.txt");
      const content = "test content";
      fsm.writeFile(filePath, content);

      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, "utf-8")).toBe(content);
    });

    it("should create parent directories when writing file", () => {
      const fsm = new FileSystemManager(false);
      const filePath = path.join(testDir, "nested/dir/file.txt");
      fsm.writeFile(filePath, "content");

      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe("fileExists", () => {
    it("should return true for existing file", () => {
      const fsm = new FileSystemManager(false);
      const filePath = path.join(testDir, "exists.txt");
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(filePath, "content");

      expect(fsm.fileExists(filePath)).toBe(true);
    });

    it("should return false for non-existing file", () => {
      const fsm = new FileSystemManager(false);
      expect(fsm.fileExists(path.join(testDir, "non-existent.txt"))).toBe(false);
    });
  });

  describe("copyFile", () => {
    it("should copy file content", () => {
      const fsm = new FileSystemManager(false);
      const sourceDir = path.join(testDir, "source");
      const sourcePath = path.join(sourceDir, "original.txt");
      const destPath = path.join(testDir, "dest/copied.txt");
      const content = "original content";

      fs.mkdirSync(sourceDir, { recursive: true });
      fs.writeFileSync(sourcePath, content);

      fsm.copyFile(sourcePath, destPath);

      expect(fs.existsSync(destPath)).toBe(true);
      expect(fs.readFileSync(destPath, "utf-8")).toBe(content);
    });
  });

  describe("getOperations", () => {
    it("should return all operations", () => {
      const fsm = new FileSystemManager(true);

      fsm.createDirectory(path.join(testDir, "dir1"));
      fsm.createDirectory(path.join(testDir, "dir2"));
      fsm.writeFile(path.join(testDir, "file1.txt"), "content1");
      fsm.writeFile(path.join(testDir, "file2.txt"), "content2");

      const operations = fsm.getOperations();
      expect(operations).toHaveLength(4);
      expect(operations.filter((op) => op.type === "create")).toHaveLength(2);
      expect(operations.filter((op) => op.type === "write")).toHaveLength(2);
    });
  });

  describe("printOperationsSummary", () => {
    it("should not throw when printing summary", () => {
      const fsm = new FileSystemManager(true);
      fsm.createDirectory(path.join(testDir, "dir"));
      fsm.writeFile(path.join(testDir, "file.txt"), "content");

      expect(() => fsm.printOperationsSummary()).not.toThrow();
    });
  });
});
