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
            'View employees by department',
            'View employees by manager',
            "View budget by department",
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update an employee manager',
            "Delete an employee",
            "Delete a department",
            "Delete a role",
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
            case 'View employees by department':
                viewByDept()
                break;
            case 'View employees by manager':
                viewByMgr()
                break;
            case 'View budget by department':
                viewBudget()
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
            case 'Update an employee manager':
                managerUpdate()
                break;
            case 'Delete an employee':
                employeeDelete()
                break;
            case 'Delete a department':
                departmentDelete()
                break;
            case 'Delete a role':
                roleDelete()
                break;
            case 'Quit':
                db.end()
                break;
        };
    });
};

// View Departments
const allDepartments = () => {
    const sql = `
    SELECT department.id, department.name
    AS department
    FROM department
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// View Roles 
const allRoles = () => {
    const sql = `
    SELECT role.id, role.title AS role, role.salary,
    department.name AS department
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// View Employees
const allEmployees = () => {
    const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title AS role
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app();
    });
};

// View Employees by Department
viewByDept = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const departments = result.map(({ id, name }) => ({ name: name, value: id}))
        inquirer.prompt({
            type: 'list',
            name: 'dept',
            message: "Select department you would like to view.",
            choices: departments
        }).then(choice => {
            const sql = `SELECT * FROM role WHERE department_id = ?`
            db.query(sql, choice.dept, (err, result) => {
                if (err) throw err;
                const roles = result.map(({ title, id }) => ({ name: title, value: id }))
                inquirer.prompt({
                    type: 'list',
                    name: 'role',
                    message: 'Select the role you would like to view',
                    choices: roles
                }).then(choice => {
                    const sql = `SELECT * FROM employee WHERE role_id = ?`
                    db.query(sql, choice.role, (err, result) => {
                        if (err) throw err;
                        console.table(result)
                        app()
                    })                    
                })
            })
        })
    })
}

// View by Manager
viewByMgr = () => {
    inquirer.prompt({
        type: 'input',
        name: 'mgr',
        message: "Enter id of the manager who's employees you wish to view",
        validate: input => {
            if (input) {
                return true
            } else {
                console.log('Please enter manager id!')
                return false
            }
        }
    }).then(id => {
        const sql = `SELECT * FROM employee WHERE manager_id = ?`
        db.query(sql, id.mgr, (err, result) => {
            if (err) throw err
            console.table(result)
            app()
        })
    })
}

// View Budget
viewBudget = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const departments = result.map(({ id, name }) => ({ name: name, value: id}))
        inquirer.prompt({
            type: 'list',
            name: 'dept',
            message: "Select department who's budget you would like to view.",
            choices: departments
        }).then(choice => {
            const sql = `SELECT SUM(salary) AS budget FROM role WHERE department_id = ?`;
            db.query(sql, choice.dept, (err, rows) => {
                if (err) throw err;
                console.table(rows)
                app()
            })
        })
    })
}

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

// Update Manager
managerUpdate = () => {
    const sql = `SELECT * FROM employee`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const employees = result.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}))
        inquirer.prompt([
            {
                type: 'list',
                name: 'emp',
                message: "Which employee's manager would you like to update?",
                choices: employees
            },
            {
                type: 'input',
                name: 'mgr',
                message: "Enter the id of the employee's manager."            
            }
        ]).then(choice => {
            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`
            let params
            if (!choice.mgr) {
                params = [null, choice.emp]            
            } else {
                params = [choice.mgr, choice.emp]    
            }

            db.query(sql, params, (err, result) => {
                if (err) throw err
                console.log("Employee's manager updated successfully.")
                app()
            })
        })
    })
}

// Delete Employee
employeeDelete = () => {
    const sql = `SELECT * FROM employee`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const employees = result.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}))
        inquirer.prompt({
            type: 'list',
            name: 'name',
            message: 'Select the employee you would like to delete',
            choices: employees
        }).then(choice => {
            const employee = choice.name;
            const sql = `DELETE FROM employee WHERE id = ?`;
            db.query(sql, employee, (err, result) => {
                if (err) throw err;
            })
            console.log(`Successfully deleted employeee.`)
            app()
        })
    })
}

// Delete Department
departmentDelete = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const department = result.map(({name, id}) => ({name: name, value: id}))
        inquirer.prompt({
            type: 'list',
            name: 'name',
            message: 'Select the department you would like to delete',
            choices: department
        }).then(choice => {
            const department = choice.name;
            const sql = `DELETE FROM department WHERE id = ?`;
            db.query(sql, department, (err, result) => {
                if (err) throw err;
            })
            console.log(`Successfully deleted department.`)
            app()
        })
    })
}

// Delete Role
roleDelete = () => {
    const sql = `SELECT * FROM role`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const role = result.map(({title, id}) => ({name: title, value: id}))
        inquirer.prompt({
            type: 'list',
            name: 'name',
            message: 'Select the role you would like to delete',
            choices: role
        }).then(choice => {
            const role = choice.name;
            const sql = `DELETE FROM role WHERE id = ?`;
            db.query(sql, role, (err, result) => {
                if (err) throw err;
            })
            console.log(`Successfully deleted role.`)
            app()
        })
    })
}



// App Call
app();