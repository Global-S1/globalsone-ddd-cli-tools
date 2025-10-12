import fs from "fs";
import path from "path";

export interface FileOperation {
  type: "create" | "write";
  path: string;
  content?: string;
}

export class FileSystemManager {
  private operations: FileOperation[] = [];
  private dryRun: boolean;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
  }

  createDirectory(dirPath: string): void {
    this.operations.push({ type: "create", path: dirPath });

    if (!this.dryRun) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  writeFile(filePath: string, content: string): void {
    this.operations.push({ type: "write", path: filePath, content });

    if (!this.dryRun) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
    }
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  getOperations(): FileOperation[] {
    return this.operations;
  }

  printOperationsSummary(): void {
    const directories = this.operations.filter((op) => op.type === "create");
    const files = this.operations.filter((op) => op.type === "write");

    console.log("\n📋 Operations to be performed:");
    console.log(`\n📁 Directories (${directories.length}):`);
    directories.forEach((op) => console.log(`  - ${op.path}`));

    console.log(`\n📄 Files (${files.length}):`);
    files.forEach((op) => console.log(`  - ${op.path}`));
  }
}
