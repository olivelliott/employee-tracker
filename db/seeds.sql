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
    ('Legal Team Manager', 80000, 6),
    ('Lawyer', 60000, 7);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Scott', 0034, 2),
    ('Ashley', 'Rodriguez', 46678, NULL),
    ('Kevin', 'Brown', 58880, 5),
    ('Sarah', 'Lourd', 43224, 5),
    ('Moby', 'Krista', 12964, NULL),
    ('Abby', 'Williams', 234432, 7),
    ('Tom', 'Allen', 999909, NULL);
