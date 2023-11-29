### Step 1: Prerequisites

Ensure you have Node.js and PostgreSQL installed on your system.

### Step 2: Create a New Project Directory

Create a new directory for your project and navigate to it in the terminal.


```
mkdir school-kids-tracker
cd school-kids-tracker
```

### Step 3: Initialize a Node.js Project

Initialize a new Node.js project using Yarn. Follow the prompts to set up your project. This will create a package.json file.

```
yarn init
```

### Step 4: Install Dependencies

Install the necessary dependencies:

```
yarn add express pg pg-pool body-parser nodemon
```


- express for creating the web application.
- pg for PostgreSQL database connectivity.
- pg-pool for managing database connections.
- body-parser for parsing HTTP request bodies.
- nodemon for automatic server restarts during development.


### Step 5: Create a PostgreSQL Database
Create a PostgreSQL database for your project. You can do this using a tool like `psql` or a graphical interface like pgAdmin.

```
create database schoolkidsdb
```

Next, create a table within the database to store student information. You can use the following SQL commands:

```
\c schoolkidsdb
```
Once you are in the PostgreSQL shell for your schoolkidsdb, run the following SQL commands to create the students table:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  next_of_kin VARCHAR(255) NOT NULL,
  next_of_kin_contact VARCHAR(255) NOT NULL
);
```
This SQL command creates a table named students with columns for id (auto-incrementing primary key), name, class, age, next_of_kin, and next_of_kin_contact.

After creating the table, you can exit the PostgreSQL shell by typing:

```
\q
```

### Step 6: Create an Express Application

Create an `app.js` file in your project directory and set up the Express application. Here's a basic example:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const nodemon = require('nodemon');

const app = express();

// Create a PostgreSQL database connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'schoolkidsdb',
  password: 'your_password', // if needed
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API routes
app.get('/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

app.post('/students', async (req, res) => {
  const { name, class: studentClass, age, nextOfKin, nextOfKinContact } = req.body;
  try {
    const query =
      'INSERT INTO students (name, class, age, next_of_kin, next_of_kin_contact) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, studentClass, age, nextOfKin, nextOfKinContact];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating student' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
``````

Make sure to replace 'your_username' and 'your_password' with your PostgreSQL database credentials.

### Step 7: Run Your Express Application

You can now run your Express.js application using Yarn and Nodemon:

```
yarn start
```
Your Express.js application is set up with PostgreSQL as the database backend, and it will automatically restart with Nodemon during development. You can use routes like `/students` to manage student data.