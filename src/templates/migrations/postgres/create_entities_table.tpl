import type { Knex } from "knex";

/**
 * Migration: Create ENTITIES table (PostgreSQL)
 * Generated: {{timestamp}}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ENTITIES", (table) => {
    // Primary key (UUID)
    table.uuid("ENTITYUuid").primary().defaultTo(knex.raw("gen_random_uuid()")).notNullable().comment("ENTITYCAPITALIZE UUID");

    // Add your custom fields here
    // Example:
    // table.string("name", 255).notNullable().comment("Name");
    // table.text("description").nullable().comment("Description");
    // table.decimal("price", 10, 2).nullable().comment("Price");
    // table.integer("stock").defaultTo(0).comment("Stock");

    // Timestamps (Common Schema)
    table.timestamp("insDatetime", { useTz: true }).defaultTo(knex.fn.now()).notNullable().comment("Insert datetime");
    table.timestamp("updDatetime", { useTz: true }).defaultTo(knex.fn.now()).notNullable().comment("Update datetime");
    table.timestamp("delDatetime", { useTz: true }).nullable().comment("Delete datetime (soft delete)");

    // Indexes
    table.index(["ENTITYUuid"], "idx_ENTITIES_uuid");
    table.index(["delDatetime"], "idx_ENTITIES_deleted");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("ENTITIES");
}
