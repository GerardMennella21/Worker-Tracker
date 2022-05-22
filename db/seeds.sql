INSERT INTO department (name)
VALUES
('Management'),
('Engineers'),
('Sales'),
('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Manager', 100000, 1),
('Marketing Manager', 130000, 1),
('Junior Software Engineer', 80000, 2),
('Software Engineer', 130000, 2),
('Senior Software Engineer', 200000, 2),
('Sales Associate', 60000, 3),
('Marketing Analyst', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Smith', 1, null),
('Jane', 'Smith', 2, null),
('Jimmy', 'Neutron', 3, null),
('Walter', 'White', 4, null),
('Timmy', 'Turner', 5, null),
('Lucille', 'Bluth', 6, null),
('Sherlock', 'Holmes', 7, null);