const db = require("../db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

const employeePromptArr = [
  {
    type: "input",
    name: "fn",
    message: "What is the first name of your employee?",
  },
  {
    type: "input",
    name: "ln",
    message: "What is the last name of your employee?",
  },
];

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


// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database -->
// Add an employee
const employeeParams = () => {
    console.log('I AM HERE');
    inquirer.prompt(employeePromptArr).then((answers) => {
        const params = [answers.fn, answers.ln];
        const roleSql = `SELECT job_title, department_id FROM roles`;

        db.promise()
          .query(roleSql)
          .then(([rows, fields]) => {
            const roleArr = rows.map(({ job_title, department_id }) => ({
              name: job_title,
              value: department_id,
            }));
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "role",
                  choices: roleArr,
                },
              ])
              .then((roleChoice) => {
                const newEmployeeRole = roleChoice.role;
                params.push(newEmployeeRole);
                employeeManagerPrompt(params);
              });
        })
    })
};

const employeeManagerPrompt = (params) => {
    const managerSql = `SELECT first_name, last_name, manager_id FROM employees`;

    db.promise().query(managerSql)
        .then(([rows, fields]) => {
        const managerArr = rows.map(
            ({ first_name, last_name, manager_id }) => ({
            name: first_name + " " + last_name,
            value: manager_id,
            })
        );
        inquirer
            .prompt([
            {
                type: "list",
                name: "manager",
                choices: managerArr,
            },
            ])
            .then((managerChoice) => {
                const newEmployeeManager = managerChoice.manager;
                params.push(newEmployeeManager);
                console.log("new employee added");
            });
        })
}

module.exports = { viewEmployees, employeeParams };
