"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityValidator = void 0;
class EntityValidator {
    validateEntityName(name) {
        const errors = [];
        if (!name || name.trim().length === 0) {
            errors.push("Entity name cannot be empty");
        }
        if (name.length < 2) {
            errors.push("Entity name must be at least 2 characters long");
        }
        if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
            errors.push("Entity name must start with a letter and contain only letters, numbers, hyphens, and underscores");
        }
        if (/^\d/.test(name)) {
            errors.push("Entity name cannot start with a number");
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    validateDatabase(database) {
        const errors = [];
        const validDatabases = ["mysql", "mongo", "mongodb"];
        if (!validDatabases.includes(database.toLowerCase())) {
            errors.push(`Invalid database type: "${database}". Valid options: ${validDatabases.join(", ")}`);
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    validateOptions(options) {
        const errors = [];
        if (options.database) {
            const dbValidation = this.validateDatabase(options.database);
            errors.push(...dbValidation.errors);
        }
        if (options.pluralName && options.pluralName.trim().length === 0) {
            errors.push("Plural name cannot be empty if provided");
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.EntityValidator = EntityValidator;
