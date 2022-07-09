// const express = require("express");
const nodemon = require("nodemon");
const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");


db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database ⭐");
  startPrompt();
});

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added 
// to the database



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

const rolePromptArr = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the department you would like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Please enter the salary of the role you are adding.'
    },
];

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
                addDepartment();
                break;

            case 'Add a role':
                roleParams();
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


// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added 
// to the database

// Add new role
const roleParams = () => {
    inquirer.prompt(rolePromptArr)
    .then((answers) => {
        const params = [answers.roleName, answers.salary];

        //* get the department id from the department table
        const deptSql = `SELECT id, dept_name FROM departments`;

        db.query(deptSql, (err, deptData) => {
            if (err) {
                console.log(err);
            }
            else {
                const deptArr = deptData.map(({ id, dept_name }) => ({ name: dept_name, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'What department is this role in?',
                        choices: deptArr
                    }
                ])
                .then(deptChoice => {
                    const newRoleDept = deptChoice.department;
                    params.push(newRoleDept);

                    addNewRole(params);
                })
            };
        });
    });
};

const addNewRole = params => {
    const sql = `INSERT INTO roles (job_title, salary, department_id)
                VALUES (?, ?, ?)`;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Added to roles`);
            viewRoles();
        }
    });

}

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



