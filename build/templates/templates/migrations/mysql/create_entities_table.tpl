import type { Knex } from "knex";

/**
 * Migration: Create ENTITIES table
 * Generated: {{timestamp}}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ENTITIES", (table) => {
    // Primary key
    table.string("ENTITYId", 36).primary().notNullable().comment("ENTITYCAPITALIZE ID");

    // Add your custom fields here
    // Example:
    // table.string("name", 255).notNullable().comment("Name");
    // table.text("description").nullable().comment("Description");
    // table.decimal("price", 10, 2).nullable().comment("Price");
    // table.integer("stock").defaultTo(0).comment("Stock");

    // Timestamps (Common Schema)
    table.timestamp("insDatetime").defaultTo(knex.fn.now()).notNullable().comment("Insert datetime");
    table.timestamp("updDatetime").defaultTo(knex.fn.now()).notNullable().comment("Update datetime");
    table.timestamp("delDatetime").nullable().comment("Delete datetime (soft delete)");

    // Indexes
    table.index(["ENTITYId"], "idx_ENTITIES_id");
    table.index(["delDatetime"], "idx_ENTITIES_deleted");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("ENTITIES");
}
