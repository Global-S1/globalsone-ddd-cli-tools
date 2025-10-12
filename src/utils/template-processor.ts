import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { FileSystemManager } from "./file-system";
import { GeneratorOptions } from "./cli-parser";

export interface TemplateReplacements {
  ENTITY: string;
  ENTITYCAPITALIZE: string;
  ENTITIES: string;
  ENTITIESCAPITALIZE: string;
  ENTITYKEBAB: string;
}

export class TemplateProcessor {
  private handlebars: typeof Handlebars;

  constructor(
    private fileManager: FileSystemManager,
    private templatesPath: string,
    private layers: GeneratorOptions["layers"]
  ) {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  private registerHelpers(): void {
    // Register custom helpers for conditional logic
    this.handlebars.registerHelper("eq", (a, b) => a === b);
    this.handlebars.registerHelper("or", (...args) => {
      return args.slice(0, -1).some((arg) => !!arg);
    });
    this.handlebars.registerHelper("and", (...args) => {
      return args.slice(0, -1).every((arg) => !!arg);
    });
  }

  processTemplates(
    templateDir: string,
    outputPaths: {
      contextBasePath: string;
      apiControllersPath: string;
      apiRoutesPath: string;
    },
    replacements: TemplateReplacements,
    entityKebab: string,
    database: string
  ): void {
    const entries = fs.readdirSync(templateDir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(templateDir, entry.name);

      if (entry.isDirectory()) {
        const isRepositoryFolder = entry.name.endsWith("-repository");

        if (isRepositoryFolder && entry.name !== `${database}-repository`) {
          continue;
        }

        this.processTemplates(
          entryPath,
          outputPaths,
          replacements,
          entityKebab,
          database
        );
      } else {
        this.processTemplateFile(
          entryPath,
          outputPaths,
          replacements,
          entityKebab,
          database
        );
      }
    }
  }

  private processTemplateFile(
    entryPath: string,
    outputPaths: {
      contextBasePath: string;
      apiControllersPath: string;
      apiRoutesPath: string;
    },
    replacements: TemplateReplacements,
    entityKebab: string,
    database: string
  ): void {
    const relativePath = path.relative(this.templatesPath, entryPath);

    // Skip files based on layer selection
    if (!this.shouldProcessFile(relativePath)) {
      return;
    }

    const outputBase = this.determineOutputBase(
      relativePath,
      outputPaths,
      database
    );

    const subPath = this.determineSubPath(relativePath, database);
    const baseName = path.basename(entryPath, ".tpl");
    const fileName = baseName.replace(/entity/g, entityKebab) + ".ts";
    const finalOutputPath = path.join(outputBase, subPath, fileName);

    let content = fs.readFileSync(entryPath, "utf-8");
    content = this.replaceAll(content, replacements);

    this.fileManager.writeFile(finalOutputPath, content);
  }

  private shouldProcessFile(relativePath: string): boolean {
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

  private determineOutputBase(
    relativePath: string,
    outputPaths: {
      contextBasePath: string;
      apiControllersPath: string;
      apiRoutesPath: string;
    },
    database: string
  ): string {
    const isDbSpecificRepo = relativePath.startsWith(`${database}-repository`);

    if (isDbSpecificRepo) {
      return path.join(outputPaths.contextBasePath, "infrastructure/repository");
    } else if (relativePath.startsWith("api/controllers")) {
      return outputPaths.apiControllersPath;
    } else if (relativePath.startsWith("api/routes")) {
      return outputPaths.apiRoutesPath;
    }
    return outputPaths.contextBasePath;
  }

  private determineSubPath(relativePath: string, database: string): string {
    return path
      .dirname(relativePath)
      .replace(/^api\/controllers/, "")
      .replace(/^api\/routes/, "")
      .replace(new RegExp(`^${database}-repository`), "");
  }

  private replaceAll(
    template: string,
    replacements: TemplateReplacements
  ): string {
    // Check if template uses Handlebars syntax
    const isHandlebarsTemplate =
      template.includes("{{") || template.includes("{{{");

    if (isHandlebarsTemplate) {
      // Use Handlebars compilation
      const compiledTemplate = this.handlebars.compile(template);
      return compiledTemplate(replacements);
    } else {
      // Fall back to simple string replacement for backward compatibility
      const keys: (keyof TemplateReplacements)[] = [
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
