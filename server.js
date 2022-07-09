// const express = require("express");
const nodemon = require("nodemon");
const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// db.connect(err => {
//     if (err) throw err;
//     console.log('Connected here');
//     startPrompt();
// })

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database ⭐");
  startPrompt();
});


const promptArr = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Im done!'
]

startPrompt = function () {
    inquirer.prompt({
        type: 'list',
        name: 'chosenAction',
        message: 'What would you like to do?',
        choices: promptArr
    })
    .then (({ chosenAction }) => {
        switch (chosenAction) {
            case 'View all departments':
                showDepartments();
                break;
            
            case 'View all roles':
                viewRoles();
                break;

            case 'View all employees':
                viewEmployees();
                break;

            case 'Add a department':
                break;

            case 'Add a role':
                break;

            case 'Add a employee':
                break;

            case 'Update an employee role':
                break;

            case 'Im done!':
                console.log('Bye!');
                process.exit();
        }
    });
}

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

// View all roles
const viewRoles = () => {
    const sql = `SELECT * FROM roles`;
    db.promise().query(sql)
      .then(([rows, fields]) => {
        console.table(rows);
        return startPrompt();
      })
      .catch(console.log);
};

// View all employees
const viewEmployees = () => {
    const sql = `SELECT * FROM employees`;
    db.promise()
      .query(sql)
      .then(([rows, fields]) => {
        console.table(rows);
        return startPrompt();
      })
      .catch(console.log);
};

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

                // db.promise().query(`INSERT INTO employees (name, department) VALUES (?, ?)`)




