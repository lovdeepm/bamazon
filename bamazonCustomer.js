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
// function to start by asking a question about viewing the inventory//
  function start() {
    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function(answer) {
        if (answer.confirm === true) {
            displayInventory();
        } else {
            console.log("Thank you! Come back soon!");
            connection.end();
        }
    });
}

// function to display inventory
function displayInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
    startQuestions();
  });
  
}
  


  function startQuestions() {
    inquirer
    .prompt([
      {
      name: "product",
      type: "input",
      message: "What is the ID of the product you would like to Purchase?",
    },
    {
    name: "amount",
      type: "input",
      message: "How Many would you like to Purchase?",
    }
  ])
    .then(function(answer) {
      var item = answer.product;
      var quantity = answer.amount;

      // Check if item is instock

      var checkItem = 'SELECT * FROM products WHERE ?';

      connection.query(checkItem, {item_id: item}, function(err, data) {
        if(err)
        throw err;
        if (data.length === 0) 
        { console.log('Error: Invaled item ID, please select a valid ID')
          startQuestions();

        } else {
          var productData = data[0];


          if( quantity <= productData.stock_quantity) {

            console.log('Congratulations, We have the item in Stock');


            var update= 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

            connection.query(update, function(err, data) {

              if (err)
              throw err;
              console.log('Your order has been placed! Your total is $' + productData.price * quantity);
              connection.end();
            })
           } else{ 
            console.log('Sorry, there is not enough product in stock, your order can not be placed as is. Please change the quantity');
            displayInventory();
            }
          }
        
        })
})}



