const db = require('./db/connection');
const inquirer = require('inquirer')
const cTable = require('console.table')

db.connect(err => {
    if (err) throw err;    
})

console.log(`
=================================
    Welcome to Worker-Tracker
=================================
    `)

const app = () => {

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
                console.log('now adding a department')
                app()
                break;
            case 'Add a role':
                console.log('now adding a role')
                app()
                break;
            case 'Add an employee':
                console.log('now adding employee')
                app()
                break;
            case 'Update an employee role':
                console.log('now updating an employee role')
                app()
                break;
            case 'Quit':
                db.end()
                break;
        }
    })
}

const allDepartments = () => {
    const sql = `SELECT * FROM department`
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app()
    })
}

const allRoles = () => {
    const sql = `SELECT * FROM role`
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app()
    })
}

const allEmployees = () => {
    const sql = `SELECT * FROM employee`
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        app()
    })
}

app()