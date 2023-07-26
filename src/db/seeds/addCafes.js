const cafesData = require("../data/cafes.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("cafes").del();
  await knex("cafes").insert(cafesData);
};
