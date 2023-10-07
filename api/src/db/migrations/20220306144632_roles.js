/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("roles").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("roles", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("role_name").unique().notNullable();
        table.string("role_id").unique().notNullable();
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
  return knex.schema.dropTable("roles");
};
