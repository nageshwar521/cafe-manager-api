/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("cafes").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("cafes", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("name").notNullable();
        table.string("logoUrl").nullable();
        table.string("description").nullable();
        table
          .string("phone_number")
          .unique()
          .checkRegex("[0-9]{8}")
          .notNullable();
        table.text("address").notNullable();
        table.uuid("location").notNullable();
        table.string("pincode").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("cafes");
};
