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
};

const chooseEmployee = () => {
    const employeeSql = `SELECT * FROM employees`;
    const params = [];
    db.promise().query(employeeSql)
    .then(( [ rows, fields ]) => {
        const employeeArr = rows.map(( { id, first_name, last_name,  }) => ({
            name: first_name + ' ' + last_name,
            value: id
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                choices: employeeArr
            }
        ])
        .then((employeeChoice) => {
            const chosenEmployee = employeeChoice.employee;
            params.push(chosenEmployee);
            chooseNewRole(params);
        })

    })
};

const chooseNewRole = params => {
    const roleSql = `SELECT * FROM roles`;
    db.promise().query(roleSql)
    .then(( [ rows, fields ]) => {
        const roles = rows.map(( { job_title, department_id }) => ({
            name: job_title,
            value: department_id
        }))

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What is the employees new role?',
                choices: roles
            }
        ])
        .then(roleChoice => {
            const newRole = roleChoice.role;
            params.push(newRole);
            updateRole(params);
        })
    });
}

const updateRole = params => {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Updated employee role`);
            viewEmployees();
        }
    })
}
module.exports = { viewEmployees, employeePrompt, chooseEmployee };