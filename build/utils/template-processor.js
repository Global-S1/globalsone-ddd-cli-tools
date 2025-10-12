"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
class TemplateProcessor {
    constructor(fileManager, templatesPath, layers) {
        this.fileManager = fileManager;
        this.templatesPath = templatesPath;
        this.layers = layers;
        this.handlebars = handlebars_1.default.create();
        this.registerHelpers();
    }
    registerHelpers() {
        // Register custom helpers for conditional logic
        this.handlebars.registerHelper("eq", (a, b) => a === b);
        this.handlebars.registerHelper("or", (...args) => {
            return args.slice(0, -1).some((arg) => !!arg);
        });
        this.handlebars.registerHelper("and", (...args) => {
            return args.slice(0, -1).every((arg) => !!arg);
        });
    }
    processTemplates(templateDir, outputPaths, replacements, entityKebab, database) {
        const entries = fs_1.default.readdirSync(templateDir, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path_1.default.join(templateDir, entry.name);
            if (entry.isDirectory()) {
                const isRepositoryFolder = entry.name.endsWith("-repository");
                if (isRepositoryFolder && entry.name !== `${database}-repository`) {
                    continue;
                }
                this.processTemplates(entryPath, outputPaths, replacements, entityKebab, database);
            }
            else {
                this.processTemplateFile(entryPath, outputPaths, replacements, entityKebab, database);
            }
        }
    }
    processTemplateFile(entryPath, outputPaths, replacements, entityKebab, database) {
        const relativePath = path_1.default.relative(this.templatesPath, entryPath);
        // Skip files based on layer selection
        if (!this.shouldProcessFile(relativePath)) {
            return;
        }
        const outputBase = this.determineOutputBase(relativePath, outputPaths, database);
        const subPath = this.determineSubPath(relativePath, database);
        const baseName = path_1.default.basename(entryPath, ".tpl");
        const fileName = baseName.replace(/entity/g, entityKebab) + ".ts";
        const finalOutputPath = path_1.default.join(outputBase, subPath, fileName);
        let content = fs_1.default.readFileSync(entryPath, "utf-8");
        content = this.replaceAll(content, replacements);
        this.fileManager.writeFile(finalOutputPath, content);
    }
    shouldProcessFile(relativePath) {
        // Skip test templates - they're handled separately
        if (relativePath.startsWith("test/")) {
            return false;
        }
        if (relativePath.startsWith("api/")) {
            return this.layers.api;
        }
        if (relativePath.startsWith("application/")) {
            return this.layers.application;
        }
        if (relativePath.startsWith("domain/")) {
            return this.layers.domain;
        }
        if (relativePath.includes("-repository/")) {
            return this.layers.infrastructure;
        }
        return true;
    }
    determineOutputBase(relativePath, outputPaths, database) {
        const isDbSpecificRepo = relativePath.startsWith(`${database}-repository`);
        if (isDbSpecificRepo) {
            return path_1.default.join(outputPaths.contextBasePath, "infrastructure/repository");
        }
        else if (relativePath.startsWith("api/controllers")) {
            return outputPaths.apiControllersPath;
        }
        else if (relativePath.startsWith("api/routes")) {
            return outputPaths.apiRoutesPath;
        }
        return outputPaths.contextBasePath;
    }
    determineSubPath(relativePath, database) {
        return path_1.default
            .dirname(relativePath)
            .replace(/^api\/controllers/, "")
            .replace(/^api\/routes/, "")
            .replace(new RegExp(`^${database}-repository`), "");
    }
    replaceAll(template, replacements) {
        // Check if template uses Handlebars syntax
        const isHandlebarsTemplate = template.includes("{{") || template.includes("{{{");
        if (isHandlebarsTemplate) {
            // Use Handlebars compilation
            const compiledTemplate = this.handlebars.compile(template);
            return compiledTemplate(replacements);
        }
        else {
            // Fall back to simple string replacement for backward compatibility
            const keys = [
                "ENTITYKEBAB",
                "ENTITIESCAPITALIZE",
                "ENTITYCAPITALIZE",
                "ENTITIES",
                "ENTITY",
            ];
            for (const key of keys) {
                const regex = new RegExp(key, "g");
                template = template.replace(regex, replacements[key]);
            }
            return template;
        }
    }
}
exports.TemplateProcessor = TemplateProcessor;
