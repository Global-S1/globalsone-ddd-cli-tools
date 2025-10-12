"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityTracker = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EntityTracker {
    constructor() {
        const basePath = process.cwd();
        this.trackingFile = path_1.default.join(basePath, ".generator-tracking.json");
    }
    /**
     * Guarda información de una entidad generada
     */
    track(entity) {
        const tracking = this.loadTracking();
        // Actualizar o agregar entidad
        const existingIndex = tracking.entities.findIndex((e) => e.entityKebab === entity.entityKebab);
        if (existingIndex >= 0) {
            tracking.entities[existingIndex] = entity;
        }
        else {
            tracking.entities.push(entity);
        }
        tracking.lastUpdate = new Date().toISOString();
        this.saveTracking(tracking);
    }
    /**
     * Obtiene información de una entidad rastreada
     */
    getEntity(entityKebab) {
        const tracking = this.loadTracking();
        return tracking.entities.find((e) => e.entityKebab === entityKebab);
    }
    /**
     * Lista todas las entidades generadas
     */
    listEntities() {
        const tracking = this.loadTracking();
        return tracking.entities;
    }
    /**
     * Elimina el tracking de una entidad
     */
    untrack(entityKebab) {
        const tracking = this.loadTracking();
        tracking.entities = tracking.entities.filter((e) => e.entityKebab !== entityKebab);
        tracking.lastUpdate = new Date().toISOString();
        this.saveTracking(tracking);
    }
    /**
     * Verifica si una entidad está rastreada
     */
    isTracked(entityKebab) {
        return this.getEntity(entityKebab) !== undefined;
    }
    loadTracking() {
        if (!fs_1.default.existsSync(this.trackingFile)) {
            return {
                entities: [],
                lastUpdate: new Date().toISOString(),
            };
        }
        try {
            const content = fs_1.default.readFileSync(this.trackingFile, "utf-8");
            return JSON.parse(content);
        }
        catch (error) {
            console.warn("⚠️  Error loading tracking file, creating new one");
            return {
                entities: [],
                lastUpdate: new Date().toISOString(),
            };
        }
    }
    saveTracking(tracking) {
        const content = JSON.stringify(tracking, null, 2);
        fs_1.default.writeFileSync(this.trackingFile, content, "utf-8");
    }
}
exports.EntityTracker = EntityTracker;
