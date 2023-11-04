
# Cafe Manager Api

REST Api for managing cafes and employees

# Setup

MYSQL Database Setup

https://gist.github.com/joeyklee/5ada6a254804c33dbebbca4161277836



Create .env.development in the root folder and add the following information
```bash

DB_HOST=XXXXXXXXX
DB_PORT=XXXX
DB_NAME=XXXXXXXXX
DB_USER=XXXXXXXXX
DB_PASSWORD=XXXXXXXX
NODE_SERVER_HOST=localhost
NODE_SERVER_PORT=4000

```


## Installation

Install cafe-manager-api project

```bash
  git clone https://github.com/nageshwar521/cafe-manager-api.git
  cd cafe-manager-api
  npm install
  npm run migrate
  npm run seed
  npm start
```
    