const db = require('../db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Show all departments
const showDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.promise().query(sql)
        .then(([rows, fields ]) => {
            console.table(rows);
            return startPrompt();
        })
        .catch(console.log);
};

// Add a new department
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "Enter the name of the department you would like to add",
    })
    .then((answer) => {
      const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
      // const params = deptName.trim();
      db.query(sql, answer.deptName, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Added ${answer.deptName} to the database!`);
          showDepartments();
        }
      });
    });
};

module.exports = { showDepartments, addDepartment }