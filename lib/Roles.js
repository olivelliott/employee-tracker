const db = require("../db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

const rolePromptArr = [
  {
    type: "input",
    name: "roleName",
    message: "What is the name of the role you would like to add?",
  },
  {
    type: "number",
    name: "salary",
    message: "Please enter the salary of the role you are adding.",
  },
];

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

// Specify role parameters and connect to department id value
const roleParams = () => {
  inquirer.prompt(rolePromptArr)
  .then((answers) => {
    const params = [answers.roleName, answers.salary];

    // get the department id from the department table
    const deptSql = `SELECT id, dept_name FROM departments`;

    db.query(deptSql, (err, deptData) => {
      if (err) {
        console.log(err);
      } else {
        const deptArr = deptData.map(({ id, dept_name }) => ({
          name: dept_name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "department",
              message: "What department is this role in?",
              choices: deptArr,
            },
          ])
          .then((deptChoice) => {
            const newRoleDept = deptChoice.department;
            params.push(newRoleDept);

            addNewRole(params);
          });
      }
    });
  });
};

// Add a new role with the params provided
const addNewRole = (params) => {
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
};


module.exports = { viewRoles, roleParams, addNewRole }