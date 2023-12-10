const { default: knex } = require("knex");
const dbConfig = require('../../knexfile');

const knexInstance = knex(dbConfig);

module.exports = knexInstance;
