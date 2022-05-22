const mysql = require('mysql2')

module.exports = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Password123',
        database: 'employees'
    },
    console.log('Connected to the employees database.')
)