INSERT INTO departments (dept_name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Sales'),
    ('Legal');

INSERT INTO roles (job_title, salary, department_id)
VALUES
    ('Software Engineer', 10000, 1),
    ('Lead Engineer', 70000, 1),
    ('Account Manager', 45000, 2),
    ('Accountant', 80000, 3),
    ('Salesperson', 54000, 4),
    ('Legal Team Manager', 80000, 3),
    ('Lawyer', 60000, 1);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Scott', 2, 2),
    ('Ashley', 'Rodriguez', 5, null),
    ('Kevin', 'Brown', 4, 2),
    ('Sarah', 'Lourd', 4, 5),
    ('Moby', 'Krista', 3, null),
    ('Abby', 'Williams', 2, 5),
    ('Tom', 'Allen', 1, 5);
