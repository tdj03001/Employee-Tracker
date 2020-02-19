const mysql = require("mysql");
const inquirer = require("inquirer");


// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yourRootPassword",
  database: "staffCMS_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "whatToDo",
      type: "list",
      message: "What would you like to do",
      choices: ["Add a department", "Add a role", "Add an employee", "View departments", "View roles", "View employees", "Update employee role", "Remove an employee", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, call the function they've selected
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
      message: "What is the salary for this role (number characters only)?"
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





// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function (answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function (err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function (err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function () {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function (answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function (error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
