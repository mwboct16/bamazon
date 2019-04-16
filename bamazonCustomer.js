var mysql = require('mysql');

var dontenv = require('dotenv').config();

var inquirer = require("inquirer");

var divider = ("\n -------------------------------- \n");


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    displayProduct();
});

function userPurchase(){
  inquirer
  .prompt([{
    name: "id",
    type: "input",
    message: "What is the ID of the item you would like to purchase?",
    filter: Number
  },
  {
    name: "quantity",
    type: "input",
    message: "How much would you like to purchase?",
    filter: Number
  }]).then(function(answer) {

    var query = "SELECT * FROM products WHERE item_id=?";

    var itemId = answer.id;
    var quantity = answer.quantity;

    connection.query(query, itemId, function(err,res) {
      
      if (err) throw err;
      for (var i = 0; i < res.length; i++){

        var res = res[i];

        var total = res.price * quantity;
        
        console.log("You have selected: " + res.product_name);

        if (quantity <= res.stock_quanity) {
          var newQuantity = res.stock_quanity - quantity;
          console.log(newQuantity + " " + res.product_name + "'s remaining!");
          console.log("Thank you for your purchase. Your total is: $" + total);
        } 
        else {

          console.log("Wait! There is only " + res.stock_quanity + itemId + " 's available!");

        }

      }      

      connection.end();
    })
  })
}

function displayProduct () {
  console.log("\n List of Available inventory... \n" + divider);
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);
    for (i = 0; i < res.length; i++){
      console.log(
        "ID: " + res[i].item_id + "\n" +
        "Product: " + res[i].product_name  + "\n" +
        "Department: " + res[i].department_name  + "\n" +
        "Price: " + res[i].price + "\n" +
        "Quanity: " + res[i].stock_quanity  + "\n" +
        divider)
    }

    console.log(divider);

    userPurchase();
  })
}


