"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollbackManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const entity_tracker_1 = require("./entity-tracker");
class RollbackManager {
    constructor(dryRun = false) {
        this.tracker = new entity_tracker_1.EntityTracker();
        this.dryRun = dryRun;
    }
    /**
     * Revierte la generación de una entidad
     */
    rollback(entityKebab) {
        const result = {
            success: false,
            filesDeleted: 0,
            directoriesDeleted: 0,
            errors: [],
        };
        // Verificar si existe el tracking
        if (!this.tracker.isTracked(entityKebab)) {
            result.errors.push(`Entity "${entityKebab}" not found in tracking. Cannot rollback.`);
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
    listRollbackable() {
        return this.tracker.listEntities();
    }
    deleteFiles(files, result) {
        for (const file of files) {
            try {
                if (fs_1.default.existsSync(file)) {
                    if (!this.dryRun) {
                        fs_1.default.unlinkSync(file);
                    }
                    result.filesDeleted++;
                    console.log(`  🗑️  Deleted file: ${file}`);
                }
            }
            catch (error) {
                const errorMsg = `Failed to delete file: ${file}`;
                result.errors.push(errorMsg);
                console.error(`  ❌ ${errorMsg}`);
            }
        }
    }
    deleteDirectories(directories, result) {
        for (const dir of directories) {
            try {
                if (fs_1.default.existsSync(dir)) {
                    // Solo eliminar si está vacío
                    const contents = fs_1.default.readdirSync(dir);
                    if (contents.length === 0) {
                        if (!this.dryRun) {
                            fs_1.default.rmdirSync(dir);
                        }
                        result.directoriesDeleted++;
                        console.log(`  🗑️  Deleted directory: ${dir}`);
                    }
                    else {
                        console.log(`  ⚠️  Skipped non-empty directory: ${dir}`);
                    }
                }
            }
            catch (error) {
                const errorMsg = `Failed to delete directory: ${dir}`;
                result.errors.push(errorMsg);
                console.error(`  ❌ ${errorMsg}`);
            }
        }
    }
    cleanAppContextModifications(entity, result) {
        const basePath = process.cwd();
        // Paths de AppContext
        const interfacePath = path_1.default.join(basePath, "src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts");
        const implementationPath = path_1.default.join(basePath, "src/entities/shared/infraestructure/config/app-context/app-repositories/app-repositories.ts");
        // Limpiar interface
        if (fs_1.default.existsSync(interfacePath)) {
            this.removeFromInterface(interfacePath, entity, result);
        }
        // Limpiar implementation
        if (fs_1.default.existsSync(implementationPath)) {
            this.removeFromImplementation(implementationPath, entity, result);
        }
    }
    removeFromInterface(filePath, entity, result) {
        try {
            let content = fs_1.default.readFileSync(filePath, "utf-8");
            // Patron para encontrar el import de la interfaz del repositorio
            const importPattern = new RegExp(`import \\{ I${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`, "g");
            // Patron para encontrar la propiedad en la interfaz
            const propertyPattern = new RegExp(`\\s+${entity.entityKebab.replace(/-/g, "")}Repository: I${entity.entityName}Repository;\\n`, "g");
            const originalContent = content;
            content = content.replace(importPattern, "");
            content = content.replace(propertyPattern, "");
            if (content !== originalContent && !this.dryRun) {
                fs_1.default.writeFileSync(filePath, content, "utf-8");
                console.log(`  ✅ Cleaned AppRepositories interface`);
            }
        }
        catch (error) {
            result.errors.push(`Failed to clean interface: ${error}`);
        }
    }
    removeFromImplementation(filePath, entity, result) {
        try {
            let content = fs_1.default.readFileSync(filePath, "utf-8");
            // Remover imports
            const interfaceImportPattern = new RegExp(`import \\{ I${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`, "g");
            const classImportPattern = new RegExp(`import \\{ ${entity.entityName}Repository \\} from ".*${entity.entityKebab}.*";\\n`, "g");
            // Remover propiedad
            const propertyPattern = new RegExp(`\\s+${entity.entityKebab.replace(/-/g, "")}Repository: I${entity.entityName}Repository;\\n`, "g");
            // Remover inicialización en constructor
            const constructorPattern = new RegExp(`\\s+this\\.${entity.entityKebab.replace(/-/g, "")}Repository = new ${entity.entityName}Repository\\([\\s\\S]*?\\);\\n`, "g");
            const originalContent = content;
            content = content.replace(interfaceImportPattern, "");
            content = content.replace(classImportPattern, "");
            content = content.replace(propertyPattern, "");
            content = content.replace(constructorPattern, "");
            if (content !== originalContent && !this.dryRun) {
                fs_1.default.writeFileSync(filePath, content, "utf-8");
                console.log(`  ✅ Cleaned AppRepositories implementation`);
            }
        }
        catch (error) {
            result.errors.push(`Failed to clean implementation: ${error}`);
        }
    }
}
exports.RollbackManager = RollbackManager;
