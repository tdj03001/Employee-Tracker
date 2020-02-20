const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


//connection for sql db
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "yourRootPassword",
  database: "staffCMS_db"
});

// connect mysql server to db
connection.connect(function (err) {
  if (err) throw err;
  start();
});

// function to prompt user to choose an action
function start() {
  inquirer
    .prompt({
      name: "whatToDo",
      type: "list",
      message: "What would you like to do",
      choices: ["Add a department", "Add a role", "Add an employee", "View departments", "View roles", "View employees", "Update employee role", "Remove an employee", "EXIT"]
    })
    .then(function (answer) {
      if (answer.whatToDo === "Add a department") {
        addDept();
      }
      else if (answer.whatToDo === "Add a role") {
        addRole();
      }
      else if (answer.whatToDo === "Add an employee") {
        addEmployee();
      }
      else if (answer.whatToDo === "View departments") {
        viewDept();
      }
      else if (answer.whatToDo === "View roles") {
        viewRoles();
      }
      else if (answer.whatToDo === "View employees") {
        viewEmployee();
      }
      else if (answer.whatToDo === "Update employee role") {
        updateEmployeeRole();
      }
      else if (answer.whatToDo === "Remove an employee") {
        removeEmployee();
      } else {
        connection.end();
      }
    });
}

function addDept() {
  inquirer.prompt([
    {
      name: "dept",
      type: "input",
      message: "What is the name of the department you want to create?"
    }
  ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function (err) {
          if (err) throw err;
          console.log("Department created successfully!");
          start();
        }
      )
    })

}

function addRole() {
  inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "What is the name of the role you want to create?"
    },
    {
      name: "salary",
      type: "number",
      message: "What is the salary for this role (numeric characters only)?"
    },
    {
      name: "dept",
      type: "input",
      message: "What is the department ID for this role?"
    }
  ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.dept
        },
        function (err) {
          if (err) throw err;
          console.log("Role created successfully!");
          start();
        }
      )
    })
}

function addEmployee() {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the employee you want to create?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the employee you want to create?"
    },
    {
      name: "role",
      type: "input",
      message: "What is the role ID for this employee?"
    }
  ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role
        },
        function (err) {
          if (err) throw err;
          console.log("Employee created successfully!");
          start();
        }
      )
    })
}

//building this so it shows all depts. Could have built to show all depts with all roles and all employees. Enhancement?
function viewDept() {
  const query = "SELECT name FROM department";
  console.log("Here are all current departments");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].name);
    }
    start();
  })
}

function viewRoles() {
  const query = "SELECT title FROM role";
  console.log("Here are all current roles");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].title);
    }
    start();
  }
  )
}

function viewEmployee() {
  const query = ("SELECT * FROM employee");
  console.log("Here are all current employees");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(
        {
          "last name": res[i].last_name,
          "first name": res[i].first_name
        })
    }
    start();
  })
}

