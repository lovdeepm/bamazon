var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // PORT
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mander8385",
  database: "bamazon"
});

console.log('before connect', connection.threadId);

connection.connect(function(err) {
    if (err) throw err;

    console.log('after connect',connection.threadId);

    // run the start function after the connection is made to prompt the user
    start();
  });


  function start() {
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
      }
      console.log("-----------------------------------");
    });

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Find songs by artist",
        "Find all artists who appear more than once",
        "Find data within a specific range",
        "Search for a specific song",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Find songs by artist":
        artistSearch();
        break;

      case "Find all artists who appear more than once":
        multiSearch();
        break;

      case "Find data within a specific range":
        rangeSearch();
        break;

      case "Search for a specific song":
        songSearch();
        break;
          
      case "exit":
        connection.end();
        break;
      }
    });
}



