const SCHEMA_NAME = process.env.DB_NAME;
const ACCESS_TOKEN_SECRET = process.env.SECRET_TOKEN;

const CAFES_TABLE = "cafes";
const EMPLOYEES_TABLE = "employees";
const LOCATIONS_TABLE = "locations";
const ROLES_TABLE = "roles";
const POSTS_TABLE = "posts";
const CATEGORIES_TABLE = "categories";
const CONDITIONS_TABLE = "conditions";
const AMENITIES_TABLE = "amenities";
const USERS_TABLE = "users";
const TOKEN_EXPIRE_TIME = 60 * 60 * 1000;

module.exports = {
  SCHEMA_NAME,
  CAFES_TABLE,
  LOCATIONS_TABLE,
  EMPLOYEES_TABLE,
  ROLES_TABLE,
  POSTS_TABLE,
  CATEGORIES_TABLE,
  CONDITIONS_TABLE,
  AMENITIES_TABLE,
  USERS_TABLE,
  TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
};
