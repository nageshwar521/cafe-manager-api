/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("employees").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("employees", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.increments("employeeId");
        table.string("first_name").notNullable();
        table.string("middle_name").nullable();
        table.string("last_name").notNullable();
        table
          .string("phone_number")
          .unique()
          .checkRegex("[0-9]{8}")
          .notNullable();
        table.string("gender").notNullable();
        table.string("address").notNullable();
        table.string("dob").nullable();
        table.string("start_date").notNullable();
        table.string("end_date").nullable();
        table.uuid("role").nullable();
        table.uuid("cafe").notNullable();
        table.string("email_address").unique().notNullable();
        table.string("username").unique().nullable();
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
  return knex.schema.dropTable("employees");
};
