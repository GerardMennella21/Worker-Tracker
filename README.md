Worker-Tracker by Gerard Mennella

# Summary
This application is designed to view and manage a database of employees for a company. It is a command line application using sql to store and display data, as well as inquirer for menu navigation and input.

# Code Breakdown

## DB
### connection
This file exports the function for connection to the employees database
### db
This file deletes the employees database if it exists then creates a new employees database and selects it for use.
### schema
This file deletes all tables if they exist then creates them again. The department table automatically sets the id and requires input for the department name. The role table automatically sets the id as well. It then requires a role title, a salary formatted as a decimal, and the id of the department associated with the role. Finally the employee table auto increments the id, requires a first and last name and the id of the role assigned to the employee. The manager id is optional if the emplyee has a manager.
### seeds
This file populates the created tables with sample data. You can also add to the tables using the application

## App
This file requires inquirer, console.table, and the db connection function's file. First the connection to the database is established. The app function is then created containing an inquirer prompt functioning as the main menu and a response to the prompt containing a switch statement executing a corresponding function for each choice in the prompt. The rest of the file contains functions to view, add, and delete data using inquirer prompts and sequel queries. the initial app function call is at the bottom of the file.

# Video Walkthrough
https://drive.google.com/file/d/1qiPBLpnE015MvOpSCOuTQXyrM9w5t1fa/view