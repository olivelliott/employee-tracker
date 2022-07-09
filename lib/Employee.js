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

const employeePrompt = () => {
    inquirer.prompt(employeePromptArr)
    .then((answers) => {
        const params = [answers.fn, answers.ln];
        const roleSql = `SELECT job_title, department_id FROM roles`;

        db.promise()
          .query(roleSql)
          .then(([rows, fields]) => {
            const roleArr = rows.map(({ job_title, department_id }) => ({
              name: job_title,
              value: department_id,
            }));
            inquirer.prompt([
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
        });
    });
};

const employeeManagerPrompt = params => {
    const managerSql = `SELECT first_name, last_name, manager_id FROM employees`;

    db.promise().query(managerSql)
    .then(([rows, fields]) => {
        const managerArr = rows.map(
            ({ first_name, last_name, manager_id }) => ({
            name: first_name + " " + last_name,
            value: manager_id,
            })
        );
        inquirer.prompt([
            {
                type: "list",
                name: "manager",
                choices: managerArr,
            },
            ])
        .then((managerChoice) => {
            const newEmployeeManager = managerChoice.manager;
            params.push(newEmployeeManager);
            addNewEmployee(params);
        });
    });
};

const addNewEmployee = params => {

      const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Added new employee to the database!`);
          viewEmployees();
        }
      });
}

module.exports = { viewEmployees, employeePrompt };
