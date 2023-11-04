/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("categories").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("categories", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("category_name").unique().notNullable();
        table.string("category_description").nullable();
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
  return knex.schema.dropTable("categories");
};
