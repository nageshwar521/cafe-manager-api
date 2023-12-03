const { default: knex } = require("knex");
const environment = process.env.NODE_ENV;
const dbConfig = require("../../knexfile")[environment];
console.log(process.env, "db environment");

const knexInstance = knex(dbConfig);

module.exports = knexInstance;
