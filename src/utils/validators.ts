export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class EntityValidator {
  validateEntityName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push("Entity name cannot be empty");
    }

    if (name.length < 2) {
      errors.push("Entity name must be at least 2 characters long");
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
      errors.push(
        "Entity name must start with a letter and contain only letters, numbers, hyphens, and underscores"
      );
    }

    if (/^\d/.test(name)) {
      errors.push("Entity name cannot start with a number");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateDatabase(database: string): ValidationResult {
    const errors: string[] = [];
    const validDatabases = ["mysql", "mongo", "mongodb"];

    if (!validDatabases.includes(database.toLowerCase())) {
      errors.push(
        `Invalid database type: "${database}". Valid options: ${validDatabases.join(", ")}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateOptions(options: {
    database?: string;
    pluralName?: string;
  }): ValidationResult {
    const errors: string[] = [];

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
