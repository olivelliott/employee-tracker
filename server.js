// const express = require("express");
const nodemon = require("nodemon");
const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

const {
    showDepartments,
    addDepartment
} = require('./lib/Departments');

const {
    viewRoles,
    roleParams,
} = require('./lib/Roles');


const { 
    viewEmployees, 
    employeeParams 
} = require('./lib/Employee');


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
        name: 'action',
        message: 'What would you like to do?',
        choices: promptArr
    })
    .then (({ action }) => {
        switch (action) {
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

            case 'Add an employee':
                employeeParams();
                break;

            case 'Update an employee role':
                break;

            case 'Im done!':
                console.log('Bye!');
                process.exit();
        }
    });
};





