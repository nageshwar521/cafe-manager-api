#!/usr/bin/env bash

roles_migrations_path="20220306144632_cafes.js"
locations_migrations_path="20220306144632_locations.js"
cafes_migrations_path="20220306144632_cafes.js"
employees_migrations_path="20220306144632_employees.js"

roles_seeds_path="db/seeds/addRoles.js"
locations_seeds_path="db/seeds/addLocations.js"
cafes_seeds_path="db/seeds/addCafes.js"
employees_seeds_path="db/seeds/addEmployees.js"

gap_lines() {
  echo
}

knex migrate:up "$roles_migrations_path"
knex migrate:up "$locations_migrations_path"
knex migrate:up "$cafes_migrations_path"
knex migrate:up "$employees_migrations_path"

echo 'completed'

gap_lines
