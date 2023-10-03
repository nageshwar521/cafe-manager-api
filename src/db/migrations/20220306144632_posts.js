/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("posts").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("posts", function (table) {
        table.uuid("id").defaultTo(knex.raw("(UUID())"));
        table.string("title").notNullable();
        table.json("photos").nullable();
        table.json("videos").nullable();
        table.string("description").nullable();
        table.string("phone_number").unique().checkRegex("[0-9]{8}").nullable();
        table.text("address").notNullable();
        table.string("pincode").notNullable();
        table.string("rent").notNullable();
        table.string("status").notNullable();
        table.date("avail_from").notNullable();
        table.string("room_type").notNullable();
        table.uuid("user_id").notNullable();
        table.json("amenities").nullable();
        table.json("conditions").nullable();
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
  return knex.schema.dropTable("posts");
};
