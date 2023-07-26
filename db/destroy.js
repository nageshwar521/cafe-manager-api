const { default: knex } = require("knex");
const db = require("./connection");

async function destroy() {
  console.log(db, "db");
  await db.destroy();
}

module.export = { destroy };
