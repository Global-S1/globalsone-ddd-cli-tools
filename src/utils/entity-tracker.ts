import fs from "fs";
import path from "path";

export interface GeneratedEntity {
  entityName: string;
  entityKebab: string;
  timestamp: string;
  database: string;
  files: string[];
  directories: string[];
}

export class EntityTracker {
  private trackingFile: string;

  constructor() {
    const basePath = process.cwd();
    this.trackingFile = path.join(basePath, ".generator-tracking.json");
  }

  /**
   * Guarda información de una entidad generada
   */
  track(entity: GeneratedEntity): void {
    const tracking = this.loadTracking();

    // Actualizar o agregar entidad
    const existingIndex = tracking.entities.findIndex(
      (e) => e.entityKebab === entity.entityKebab
    );

    if (existingIndex >= 0) {
      tracking.entities[existingIndex] = entity;
    } else {
      tracking.entities.push(entity);
    }

    tracking.lastUpdate = new Date().toISOString();
    this.saveTracking(tracking);
  }

  /**
   * Obtiene información de una entidad rastreada
   */
  getEntity(entityKebab: string): GeneratedEntity | undefined {
    const tracking = this.loadTracking();
    return tracking.entities.find((e) => e.entityKebab === entityKebab);
  }

  /**
   * Lista todas las entidades generadas
   */
  listEntities(): GeneratedEntity[] {
    const tracking = this.loadTracking();
    return tracking.entities;
  }

  /**
   * Elimina el tracking de una entidad
   */
  untrack(entityKebab: string): void {
    const tracking = this.loadTracking();
    tracking.entities = tracking.entities.filter(
      (e) => e.entityKebab !== entityKebab
    );
    tracking.lastUpdate = new Date().toISOString();
    this.saveTracking(tracking);
  }

  /**
   * Verifica si una entidad está rastreada
   */
  isTracked(entityKebab: string): boolean {
    return this.getEntity(entityKebab) !== undefined;
  }

  private loadTracking(): {
    entities: GeneratedEntity[];
    lastUpdate: string;
  } {
    if (!fs.existsSync(this.trackingFile)) {
      return {
        entities: [],
        lastUpdate: new Date().toISOString(),
      };
    }

    try {
      const content = fs.readFileSync(this.trackingFile, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.warn("⚠️  Error loading tracking file, creating new one");
      return {
        entities: [],
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  private saveTracking(tracking: {
    entities: GeneratedEntity[];
    lastUpdate: string;
  }): void {
    const content = JSON.stringify(tracking, null, 2);
    fs.writeFileSync(this.trackingFile, content, "utf-8");
  }
}
