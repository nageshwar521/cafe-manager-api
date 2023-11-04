/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("users", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("first_name").nullable();
        table.string("middle_name").nullable();
        table.string("last_name").nullable();
        table.string("phone_number").unique().checkRegex("[0-9]{8}").nullable();
        table.string("gender").nullable();
        table.string("address").nullable();
        table.string("dob").nullable();
        table.string("start_date").nullable();
        table.string("end_date").nullable();
        table.string("email_address").unique().notNullable();
        table.string("username").unique().notNullable();
        table.text("password").notNullable();
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
  return knex.schema.dropTable("users");
};
