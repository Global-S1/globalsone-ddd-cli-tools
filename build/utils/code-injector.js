"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeInjector = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CodeInjector {
    constructor(dryRun = false) {
        this.dryRun = dryRun;
    }
    injectRepositoryRegistration(config) {
        const basePath = process.cwd();
        // Inject into app-repositories.interface.ts
        const interfacePath = path_1.default.join(basePath, "src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts");
        // Inject into app-repositories.ts
        const implementationPath = path_1.default.join(basePath, "src/entities/shared/infraestructure/config/app-context/app-repositories/app-repositories.ts");
        if (fs_1.default.existsSync(interfacePath)) {
            this.injectIntoInterface(interfacePath, config);
        }
        else {
            console.warn(`⚠️  Could not find app-repositories.interface.ts - skipping auto-registration`);
        }
        if (fs_1.default.existsSync(implementationPath)) {
            this.injectIntoImplementation(implementationPath, config);
        }
        else {
            console.warn(`⚠️  Could not find app-repositories.ts - skipping auto-registration`);
        }
    }
    injectIntoInterface(filePath, config) {
        let content = fs_1.default.readFileSync(filePath, "utf-8");
        // Add import at the top
        const importStatement = `import { I${config.entityPascalCase}Repository } from "../../../../${config.entityKebabCase}/domain/${config.entityKebabCase}.repository";\n`;
        // Find where to insert the import
        const lastImportMatch = content.match(/import.*;\n(?!import)/);
        if (lastImportMatch) {
            const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
            content =
                content.slice(0, insertPosition) +
                    importStatement +
                    content.slice(insertPosition);
        }
        // Add property to interface
        const propertyStatement = `  ${config.entityCamelCase}Repository: I${config.entityPascalCase}Repository;\n`;
        // Find the closing brace of the interface
        const interfaceMatch = content.match(/export interface IAppRepositories \{[^}]*\}/s);
        if (interfaceMatch) {
            const closingBraceIndex = interfaceMatch[0].lastIndexOf("}");
            const beforeClosing = interfaceMatch[0].slice(0, closingBraceIndex);
            const afterClosing = interfaceMatch[0].slice(closingBraceIndex);
            const newInterface = beforeClosing + propertyStatement + afterClosing;
            content = content.replace(interfaceMatch[0], newInterface);
        }
        if (!this.dryRun) {
            fs_1.default.writeFileSync(filePath, content);
            console.log(`✅ Updated ${path_1.default.basename(filePath)}`);
        }
    }
    injectIntoImplementation(filePath, config) {
        let content = fs_1.default.readFileSync(filePath, "utf-8");
        // Determine database connection based on database type
        const dbConnection = this.getDatabaseConnection(config.database);
        // Add imports
        const interfaceImport = `import { I${config.entityPascalCase}Repository } from "../../../../../${config.entityKebabCase}/domain/${config.entityKebabCase}.repository";\n`;
        const implementationImport = `import { ${config.entityPascalCase}Repository } from "../../../../../${config.entityKebabCase}/infrastructure/repository/${config.entityKebabCase}.repository";\n`;
        // Find where to insert imports
        const lastImportMatch = content.match(/import.*;\n(?!import)/);
        if (lastImportMatch) {
            const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
            content =
                content.slice(0, insertPosition) +
                    interfaceImport +
                    implementationImport +
                    content.slice(insertPosition);
        }
        // Add property declaration before constructor
        const propertyDeclaration = `  ${config.entityCamelCase}Repository: I${config.entityPascalCase}Repository;\n`;
        // Find the class and add property before constructor
        const classMatch = content.match(/(export class AppRepositories implements IAppRepositories \{[\s\S]*?)(\n\n  constructor\(\) \{)/);
        if (classMatch) {
            const beforeConstructor = classMatch[1];
            const constructorPart = classMatch[2];
            // Add property right before the blank line and constructor
            const newContent = beforeConstructor + "\n  " + propertyDeclaration.trim() + constructorPart;
            content = content.replace(classMatch[0], newContent);
        }
        // Add initialization in constructor
        const constructorInit = `    this.${config.entityCamelCase}Repository = new ${config.entityPascalCase}Repository(\n      ${dbConnection.read},\n      ${dbConnection.write}\n    );\n`;
        // Find constructor and add initialization at the end
        const constructorMatch = content.match(/(constructor\(\) \{[\s\S]*?)(  \})/);
        if (constructorMatch) {
            const constructorBody = constructorMatch[1];
            const closingBrace = constructorMatch[2];
            const newConstructor = constructorBody + constructorInit + closingBrace;
            content = content.replace(constructorMatch[0], newConstructor);
        }
        if (!this.dryRun) {
            fs_1.default.writeFileSync(filePath, content);
            console.log(`✅ Updated ${path_1.default.basename(filePath)}`);
        }
    }
    getDatabaseConnection(database) {
        switch (database.toLowerCase()) {
            case "mongo":
            case "mongodb":
                return {
                    read: "mongoDBRead.connection",
                    write: "mongoDBWrite.connection",
                };
            case "postgres":
            case "postgresql":
                return {
                    read: "postgresRead",
                    write: "postgresWrite",
                };
            case "mysql":
            default:
                return {
                    read: "databaseRead",
                    write: "databaseWrite",
                };
        }
    }
}
exports.CodeInjector = CodeInjector;
