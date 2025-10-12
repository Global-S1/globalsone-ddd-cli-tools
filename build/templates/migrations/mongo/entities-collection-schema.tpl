/**
 * MongoDB Collection Schema: ENTITIES
 * Generated: {{timestamp}}
 *
 * Note: MongoDB doesn't require migrations like SQL databases.
 * This file documents the expected schema for the collection.
 */

export const ENTITIESCollectionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ENTITYId", "insDatetime", "updDatetime"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "MongoDB document ID",
        },
        ENTITYId: {
          bsonType: "string",
          description: "ENTITYCAPITALIZE ID",
        },
        // Add your custom fields here
        // Example:
        // name: {
        //   bsonType: "string",
        //   description: "Name"
        // },
        // description: {
        //   bsonType: "string",
        //   description: "Description"
        // },
        // price: {
        //   bsonType: "decimal",
        //   description: "Price"
        // },
        // stock: {
        //   bsonType: "int",
        //   description: "Stock quantity"
        // },
        insDatetime: {
          bsonType: "date",
          description: "Insert datetime",
        },
        updDatetime: {
          bsonType: "date",
          description: "Update datetime",
        },
        delDatetime: {
          bsonType: ["date", "null"],
          description: "Delete datetime (soft delete)",
        },
      },
    },
  },
};

/**
 * Indexes for ENTITIES collection
 */
export const ENTITIESIndexes = [
  {
    key: { ENTITYId: 1 },
    name: "idx_ENTITYId",
    unique: true,
  },
  {
    key: { delDatetime: 1 },
    name: "idx_delDatetime",
  },
];

/**
 * Instructions to create collection with schema validation:
 *
 * db.createCollection("ENTITIES", {
 *   validator: ENTITIESCollectionSchema.validator
 * });
 *
 * db.ENTITIES.createIndexes(ENTITIESIndexes);
 */
