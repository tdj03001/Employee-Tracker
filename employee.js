const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const util = require('util');


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

connection.query = util.promisify(connection.query);

// function to prompt user to choose an action
async function start() {
  await inquirer
    .prompt({
      name: "whatToDo",
      type: "list",
      message: "What would you like to do",
      choices: ["Add a department", "Add a role", "Add an employee", "View departments", "View roles", "View employees", "Update employee role", "View entire organization", "EXIT"]
    })
    .then(async answer => {
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
        await getDepts();
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
      else if (answer.whatToDo === "View entire organization") {
        viewOrg();
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

let choices = [];

async function getDepts() {
  const query = "SELECT name FROM department";
  await connection.query(query).then(res => {
    res.forEach(data => {
      choices.push(data.name);
    });
  })
}


function viewDept() {
  inquirer.prompt([
    {
      name: "chooseDept",
      type: "list",
      message: "Which department would you like to view?",
      choices: choices
    }
  ])
    .then(function (answer) {
      const query2 = "SELECT * FROM department LEFT JOIN role on department.id = role.department_id JOIN employee on employee.role_id = role.id WHERE department.name ='" + answer.chooseDept + "'";
      console.log("Here is the department you requested");
      // const dummyArr = [];
      connection.query(query2, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
          // console.log(res[i].name)    try loop into an array, console.table outside loop
          // dummyArr.push(res[i]).name;
          console.table([
            {
              "Dept Name": res[i].name,
              "Staff first name": res[i].first_name,
              "Staff last name": res[i].last_name,
              "Role": res[i].title
            }]);
        }

        start();

      })
    })
}




function viewRoles() {
  const query = "SELECT * FROM role";
  console.log("Here are all current roles");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.table([
        {
          "Role": res[i].title,
          "Salary": res[i].salary
        }
      ]);
    }
    start();
  }
  )
}

function viewEmployee() {
  const query = ("SELECT * FROM employee LEFT JOIN role ON employee.role_id=role.id;");
  console.log("Here are all current employees");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.table([
        {
          "First Name": res[i].first_name,
          "Last Name": res[i].last_name,
          "Role": res[i].title,
          "Salary": res[i].salary
        }
      ]);
    }
    start();
  })
}

function viewOrg() {
  const query = ("SELECT * FROM department LEFT JOIN role on department.id = role.department_id JOIN employee on employee.role_id = role.id;");
  console.log("Here is the whole company");
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.table([
        {
          "Department": res[i].name,
          "Title": res[i].title,
          "Salary": res[i].salary,
          "First Name": res[i].first_name,
          "Last Name": res[i].last_name
        }
      ])
    }
    start();
  })
}

/*=================DEV NOTES=====================================================================================

- getDepts/viewDept: getDepts is pushing results to choices array, but choices is undefined when referenced in viewDept function. Why?

================================================================================================================*/