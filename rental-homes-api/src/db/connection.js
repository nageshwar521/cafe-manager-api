const { default: knex } = require("knex");
const environment = process.env.NODE_ENV;
const dbConfig = require("../../knexfile")[environment];
console.log(environment, "db environment");

const knexInstance = knex(dbConfig);

module.exports = knexInstance;
