const db = require('./db/connection');
const inquirer = require('inquirer')
const cTable = require('console.table')

// Connect to Database
db.connect(err => {
    if (err) throw err;    
})

// Welcome Log
console.log(`
=================================
    Welcome to Worker-Tracker
=================================
    `)

// App Function
const app = () => {

    // Main Menu Prompt & Corresponding Functions
    inquirer.prompt({
        name: 'Menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit'
        ]
    }).then(choice => {
        switch (choice.Menu) {
            case 'View all departments':
                allDepartments()
                break;
            case 'View all roles':
                allRoles()
                break;
            case 'View all employees':
                allEmployees()
                break;
            case 'Add a department':
                addDepartment()
                break;
            case 'Add a role':
                addRole()
                break;
            case 'Add an employee':
                addEmployee()
                break;
            case 'Update an employee role':
                roleUpdate()
                break;
            case 'Quit':
                db.end()
                break;
        };
    });
};

// View Departments
const allDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// View Roles 
const allRoles = () => {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// View Employees
const allEmployees = () => {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// Add Departments
const addDepartment = () => {
    inquirer.prompt({
        type: "input",
        message: "Enter the name of the department you would like to create.",
        name: "addDept",
        validate: input => {
            if (input) {
                return true
            } else {
                console.log('Please enter department name!')
                return false
            }
        }
    }).then(response => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, response.addDept, (err, response) => {
            if (err) throw err;
        });
        console.log(`${response.addDept} successfully added to departments.`);
        app();
    })
}

// Add Departments
const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the role you would like to add.",
            name: "roleName",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter role!')
                    return false
                }
            }
        },
        {
            type: "input",
            message: "Enter the salary for this role.",
            name: "roleSalary",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter salary!')
                    return false
                }
            }
        },
        {
            type: "input",
            message: "Enter id of the department this role belongs to.",
            name: "roleDept",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter department id!')
                    return false
                }
            }
        }
    ]).then(response => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`
        const params = [response.roleName, response.roleSalary, response.roleDept]
        db.query(sql, params, (err, response) => {
            if (err) throw err;
        })
        console.log(`${response.roleName} role has been succesfully added to department ${response.roleDept}.`)
        app()
    })
}

// Add Employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the new employee's first name",
            name: "firstName",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter a first name!')
                    return false
                }
            }
        },
        {
            type: "input",
            message: "Enter the new employee's last name",
            name: "lastName",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter a last name!')
                    return false
                }
            }
        },
        {
            type: "input",
            message: "Enter the id of the new employee's role",
            name: "empRole",
            validate: input => {
                if (input) {
                    return true
                } else {
                    console.log('Please enter role id!')
                    return false
                }
            }
        },
        {
            type: "input",
            message: "Enter the new employee's manager id(if applicable)",
            name: "mgrId"
        }
    ]).then(response => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`
        let params
        if (!response.mgrId) {
            params = [response.firstName, response.lastName, response.empRole, null]
        } else {
            params = [response.firstName, response.lastName, response.empRole, response.mgrId]
        }
        db.query(sql, params, (err, response) => {
            if (err) throw err;
        })
        console.log(`${response.firstName} ${response.lastName} successfully added to employees.`);
        app()
    })
}

// Update Role
roleUpdate = () => {
        inquirer.prompt([
            {
            type: "input",
            message: "Enter the id of the employee who's role you would like to change.",
            name: "empUpdate"
            },
            {
                type: "input",
                message: "Enter the id of the employee's new role.",
                name: "newRole"
            }
        ]).then(result => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
        const params = [result.newRole, result.empUpdate]
        db.query(sql, params, (err, result) => {
            if (err) throw err;
        })
        console.log('Employee role updated.')
        app()
    })
}

app();