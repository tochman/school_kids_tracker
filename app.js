const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "schoolkidsdb",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/students", async (req, res) => {
  try {
    const { rows } = await pool.query("select * from students;");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students..." });
  }
});

app.post("/students", async (req, res) => {
  const { name, studentClass, age, nextOfKin, nextOfKinContact } = req.body;
  try {
    const query =
      "insert into students ( name, class, age, next_of_kin, next_of_kin_contact ) values ($1, $2, $3, $4, $5);";
    const values = [name, studentClass, age, nextOfKin, nextOfKinContact];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(422).json({ error: "Error creating student..." });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
