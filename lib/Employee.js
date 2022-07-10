const db = require("../db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

const newEmployeePromptArr = [
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
  const sql = `SELECT employees.id,
                employees.first_name,
                employees.last_name,
                roles.job_title AS role,
                roles.salary,
                departments.dept_name AS department,
                CONCAT (manager.first_name, ' ', manager.last_name) AS manager
            FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments on roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id

                `;
  db.promise().query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      return startPrompt();
    })
    .catch(console.log);
};

// Get first name, last name, and role for new employee
const newEmployeePrompt = () => {
    inquirer.prompt(newEmployeePromptArr)
    .then((answers) => {
        const params = [answers.fn, answers.ln];
        const roleSql = `SELECT job_title, id FROM roles`;

        db.promise()
          .query(roleSql)
          .then(([rows, fields]) => {
            const roleArr = rows.map(({ job_title, id }) => ({
              name: job_title,
              value: id,
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
            newEmpManager(params);
            });
        });
    });
};

// Get the manager for the new employee
const newEmpManager = params => {
    const managerSql = `SELECT first_name, last_name, id FROM employees`;

    db.promise().query(managerSql)
    .then(([rows, fields]) => {
        const managerArr = rows.map(
            ({ first_name, last_name, id }) => ({
            name: first_name + " " + last_name,
            value: id,
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

// Add a new employee with the params provided
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

// Choose the employee to update their role
const chooseEmployee = () => {
    const employeeSql = `SELECT * FROM employees`;
    const params = [];
    db.promise().query(employeeSql)
    .then(( [ rows, fields ]) => {
        const employeeArr = rows.map(( { id, first_name, last_name  }) => ({
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

// Choose a new role for the employee
const chooseNewRole = params => {
    const roleSql = `SELECT * FROM roles`;
    db.promise().query(roleSql)
    .then(( [ rows, fields ]) => {
        const roles = rows.map(( { job_title, id }) => ({
            name: job_title,
            value: id
        }))
        console.log(roles);

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
            let employee = params[0];
            params[1] = employee;
            params[0] = newRole;

                        console.log(params);

            updateRole(params);
        })
    });
};

// Update the employee role with the params specified from above 
const updateRole = params => {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Updated the employee role!`);
            viewEmployees();
        }
    });
};

module.exports = { viewEmployees, newEmployeePrompt, chooseEmployee };
