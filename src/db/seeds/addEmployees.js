const employeesData = require("../data/employees.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("employees").del();
  await knex("employees").insert(employeesData);
};
