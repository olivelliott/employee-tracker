// const express = require("express");
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
    newEmployeePrompt,
    chooseEmployee
} = require('./lib/Employee');


db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the employee database ⭐");
    console.log("***********************************");
    console.log("*                                 *");
    console.log("*        EMPLOYEE TRACKER         *");
    console.log("*                                 *");
    console.log("***********************************");
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
                newEmployeePrompt();
                break;

            case 'Update an employee role':
                chooseEmployee();
                break;

            case 'Im done!':
                console.log('Bye!');
                process.exit();
        }
    });
};





