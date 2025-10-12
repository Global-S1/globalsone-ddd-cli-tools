import fs from "fs";
import path from "path";
import { EntityTracker, GeneratedEntity } from "./entity-tracker";

export interface RollbackResult {
  success: boolean;
  filesDeleted: number;
  directoriesDeleted: number;
  errors: string[];
}

export class RollbackManager {
  private tracker: EntityTracker;
  private dryRun: boolean;

  constructor(dryRun = false) {
    this.tracker = new EntityTracker();
    this.dryRun = dryRun;
  }

  /**
   * Revierte la generación de una entidad
   */
  rollback(entityKebab: string): RollbackResult {
    const result: RollbackResult = {
      success: false,
      filesDeleted: 0,
      directoriesDeleted: 0,
      errors: [],
    };

    // Verificar si existe el tracking
    if (!this.tracker.isTracked(entityKebab)) {
      result.errors.push(
        `Entity "${entityKebab}" not found in tracking. Cannot rollback.`
      );
      return result;
    }

    const entity = this.tracker.getEntity(entityKebab);
    if (!entity) {
      result.errors.push(`Failed to load entity data for "${entityKebab}"`);
      return result;
    }

    // Eliminar archivos
    this.deleteFiles(entity.files, result);

    // Eliminar directorios (en orden inverso para eliminar hijos primero)
    this.deleteDirectories(entity.directories.reverse(), result);

    // Limpiar modificaciones en AppContext si existen
    this.cleanAppContextModifications(entity, result);

    // Remover tracking si fue exitoso
    if (result.errors.length === 0) {
      if (!this.dryRun) {
        this.tracker.untrack(entityKebab);
      }
      result.success = true;
    }

    return result;
  }

  /**
   * Lista entidades que pueden ser revertidas
   */
  listRollbackable(): GeneratedEntity[] {
    return this.tracker.listEntities();
  }

  private deleteFiles(files: string[], result: RollbackResult): void {
    for (const file of files) {
      try {
        if (fs.existsSync(file)) {
          if (!this.dryRun) {
            fs.unlinkSync(file);
          }
          result.filesDeleted++;
          console.log(`  🗑️  Deleted file: ${file}`);
        }
      } catch (error) {
        const errorMsg = `Failed to delete file: ${file}`;
        result.errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}`);
      }
    }
  }

  private deleteDirectories(
    directories: string[],
    result: RollbackResult
  ): void {
    for (const dir of directories) {
      try {
        if (fs.existsSync(dir)) {
          // Solo eliminar si está vacío
          const contents = fs.readdirSync(dir);
          if (contents.length === 0) {
            if (!this.dryRun) {
              fs.rmdirSync(dir);
            }
            result.directoriesDeleted++;
            console.log(`  🗑️  Deleted directory: ${dir}`);
          } else {
            console.log(`  ⚠️  Skipped non-empty directory: ${dir}`);
          }
        }
      } catch (error) {
        const errorMsg = `Failed to delete directory: ${dir}`;
        result.errors.push(errorMsg);
        console.error(`  ❌ ${errorMsg}`);
      }
    }
  }

  private cleanAppContextModifications(
    entity: GeneratedEntity,
    result: RollbackResult
  ): void {
    const basePath = process.cwd();

    // Paths de AppContext
    const interfacePath = path.join(
      basePath,
      "src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts"
    );
    const implementationPath = path.join(
      basePath,
      "src/entities/shared/infraestructure/config/app-context/app-repositories/app-repositories.ts"
    );

    // Limpiar interface
    if (fs.existsSync(interfacePath)) {
      this.removeFromInterface(interfacePath, entity, result);
    }

    // Limpiar implementation
    if (fs.existsSync(implementationPath)) {
      this.removeFromImplementation(implementationPath, entity, result);
    }
  }

  private removeFromInterface(
    filePath: string,
    entity: GeneratedEntity,
    result: RollbackResult
  ): void {
    try {
      let content = fs.readFileSync(filePath, "utf-8");

      // Patron para encontrar el import de la interfaz del repositorio
      const importPattern = new RegExp(
        `import \\{ I${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`,
        "g"
      );

      // Patron para encontrar la propiedad en la interfaz
      const propertyPattern = new RegExp(
        `\\s+${entity.entityKebab.replace(/-/g, "")}Repository: I${entity.entityName}Repository;\\n`,
        "g"
      );

      const originalContent = content;
      content = content.replace(importPattern, "");
      content = content.replace(propertyPattern, "");

      if (content !== originalContent && !this.dryRun) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`  ✅ Cleaned AppRepositories interface`);
      }
    } catch (error) {
      result.errors.push(`Failed to clean interface: ${error}`);
    }
  }

  private removeFromImplementation(
    filePath: string,
    entity: GeneratedEntity,
    result: RollbackResult
  ): void {
    try {
      let content = fs.readFileSync(filePath, "utf-8");

      // Remover imports
      const interfaceImportPattern = new RegExp(
        `import \\{ I${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`,
        "g"
      );
      const classImportPattern = new RegExp(
        `import \\{ ${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`,
        "g"
      );

      // Remover propiedad
      const propertyPattern = new RegExp(
        `\\s+${entity.entityKebab.replace(/-/g, "")}Repository: I${entity.entityName}Repository;\\n`,
        "g"
      );

      // Remover inicialización en constructor
      const constructorPattern = new RegExp(
        `\\s+this\\.${entity.entityKebab.replace(/-/g, "")}Repository = new ${entity.entityName}Repository\\([\\s\\S]*?\\);\\n`,
        "g"
      );

      const originalContent = content;
      content = content.replace(interfaceImportPattern, "");
      content = content.replace(classImportPattern, "");
      content = content.replace(propertyPattern, "");
      content = content.replace(constructorPattern, "");

      if (content !== originalContent && !this.dryRun) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`  ✅ Cleaned AppRepositories implementation`);
      }
    } catch (error) {
      result.errors.push(`Failed to clean implementation: ${error}`);
    }
  }
}
