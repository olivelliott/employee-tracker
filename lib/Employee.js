const db = require("../db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

// View all employees
const viewEmployees = () => {
  const sql = `SELECT * FROM employees`;
  db.promise().query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      return startPrompt();
    })
    .catch(console.log);
};

module.exports = { viewEmployees };
