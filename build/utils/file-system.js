"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileSystemManager {
    constructor(dryRun = false) {
        this.operations = [];
        this.dryRun = dryRun;
    }
    createDirectory(dirPath) {
        this.operations.push({ type: "create", path: dirPath });
        if (!this.dryRun) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    }
    writeFile(filePath, content) {
        this.operations.push({ type: "write", path: filePath, content });
        if (!this.dryRun) {
            fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
            fs_1.default.writeFileSync(filePath, content);
        }
    }
    fileExists(filePath) {
        return fs_1.default.existsSync(filePath);
    }
    getOperations() {
        return this.operations;
    }
    printOperationsSummary() {
        const directories = this.operations.filter((op) => op.type === "create");
        const files = this.operations.filter((op) => op.type === "write");
        console.log("\n📋 Operations to be performed:");
        console.log(`\n📁 Directories (${directories.length}):`);
        directories.forEach((op) => console.log(`  - ${op.path}`));
        console.log(`\n📄 Files (${files.length}):`);
        files.forEach((op) => console.log(`  - ${op.path}`));
    }
}
exports.FileSystemManager = FileSystemManager;
