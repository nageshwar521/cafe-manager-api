require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const path = require("path");
const { noop } = require("lodash");
const {
  ROLES_TABLE,
  LOCATIONS_TABLE,
  CAFES_TABLE,
  EMPLOYEES_TABLE,
  SCHEMA_NAME,
} = require("../constants");
const { default: knex } = require("knex");
const environment = process.env.NODE_ENV;
const dbConfig = require("../knexfile")[environment];

const db = knex(dbConfig);

// console.log(db);

const migrations = {
  [ROLES_TABLE]: "20220306144632_roles.js",
  [LOCATIONS_TABLE]: "20220306144632_locations.js",
  [CAFES_TABLE]: "20220306144632_cafes.js",
  [EMPLOYEES_TABLE]: "20220306144632_employees.js",
};

const seeds = {
  [ROLES_TABLE]: "addRoles.js",
  [LOCATIONS_TABLE]: "addLocations.js",
  [CAFES_TABLE]: "addCafes.js",
  [EMPLOYEES_TABLE]: "addEmployees.js",
};

const logResult = (res, type) => {
  console.log(`${type} ${res} done`);
};

function processMigrations(callback = noop) {
  const promises = Object.values(migrations).map((migration) => {
    return [
      migration[0],
      db.migrate.up({
        tableName: migration[0],
        schemaName: SCHEMA_NAME,
      }),
    ];
  });
  return promises.reduce((p, migration, index) => {
    return p.then((name) => {
      logResult(name, "migrating");
      if (migrations.length === index + 1) callback();
      return migration[1];
    });
  }, Promise.resolve("init"));
}

function processSeeds(callback = noop) {
  const promises = Object.values(seeds).map((seed) => {
    return [
      seed[0],
      db.seed.run({
        seedSource: seed[1],
      }),
    ];
  });
  return promises.reduce((p, seed) => {
    return p.then((res) => {
      logResult(res, "seeding");
      if (migrations.length === index + 1) callback();
      return seed[1].apply(null, seed[0]);
    });
  }, Promise.resolve("processing seeds..."));
}

async function migrate() {
  console.log("migrate callled");
  try {
    console.log(`migrating...`);
    db.raw(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA_NAME}`)
      .then(() => {
        processMigrations(() => {
          console.log("migrations completed...");
          processSeeds(() => {
            console.log("seeds completed...");
            console.log("all done!");
          }).catch((err) => {
            console.log("seeds failed...", err);
          });
        }).catch((err) => {
          console.log("migrations failed...", err);
        });
      })
      .catch((err) => {
        console.log("Create schema failed...", err);
      })
      .finally(async () => {
        console.log("all done!");
        try {
          await db.destroy();
        } catch (error) {}
      });
  } catch (e) {
    console.log("Error: ", e);
    process.exit(1);
  }
}

migrate();

module.exports.migrate = migrate;
