var express = require('express');
var bodyParser = require('body-parser');

var ref = new Firebase('https://boozebot.firebaseio.com');
var recipesRef = ref.child("Recipes");

const conversionRation = 29.5735;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function generateTimestamp() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var minmin = today.getMinutes();
  var ss = today.getSeconds();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }
  if (hh < 10) { hh = '0' + hh; }
  if (minmin < 10) { minmin = '0' + minmin; }
  if (ss < 10) { ss = '0' + ss; }

  return dd + "-" + mm + "-" + yyyy + " " + hh + ":" + minmin + ":" + ss;
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.post('/queue_drink', function(req, res) {
  const userName = req.body.user;
  const drinkName = req.body.drink;

  if (!userName || !drinkName) {
    return res.status(400).jsonp({"error":"Missing user or drink name!"});
  }
  console.log("Pouring " + drinkName + " for " + user);

  // Get recipe
  const recipe = recipesRef.child(drinkName).once("value", recipeSnapshot => {
    if (recipeSnapshot == null) return res.status(400).jsonp({"error":"Drink does not exist!"}); 

    // Get transaction and store recipe used in transaction
    let curTransaction = {
      recipeUsed: drinkName,
      totalCost: 0, 
      numStandardDrins: 0
    };

    // Get list of ingredients from recipe
    let ingredients = [];
    recipeSnapshot.forEach(ingredientSnapshot => {
      const ingredient = ingredientSnapshot.val();
      const amount = parseFloat(ingredient.amount);

      ingredients.push(ingredient); 

      // Get price for ingredient from bottle.
      bottlesRef.child(ingredient.type).once("value", bottleSnapshot => {
        const bottle = bottleSnapshot.val();
        const costPerFlOz = parseFloat(bottle.costPerFlOz);

        if (bottle == null) return res.status(400).jsonp({"error":"No more ${ingredient}!"}); 

        // If there's not enough liquid in the bottle:
        if (parseFloat(bottle.amountRemaining) < amount * converstionRatio) {
              return res.status(400).jsonp({"error":"Not enough ${ingredient} remaining"});
        }

        // Add line item to transaction
        curTransaction["ingredient" + ingredientCounter] = {
          "amountUsed": amount,
          "lineItemPrice": costPerFlOz * amount,
          "liquorName": bottle.name,
          "liquorBottleNum": bottle.bottleLoc
        };

        // *****DECREMENT AMOUNT LEFT IN BOTTLE***** 

        // Increment standard drink count, ingredient count, and total cost
        curTransation.numStandardDrinks += (2 * amount * parseFloat(bottle.proof)) / 200;
        curTransaction.totalCost += costPerFlOz * amount;
        ingredientCounter += 1;
      });
    });

    usersRef.child(userName).once("value", userSnapshot => {
      const user = userSnapshot.val();
      // Check if username exists
      if (user === null) return res.status(400).jsonp({"error": "Invalid User ${userName}"});

      curTransaction.ingredientCount = ingredientCounter;
      curTransaction.timestamp = generateTimestamp(); // do this

      // Add transaction to user's transaction list
      usersRef.chlid(userName).child("Transactions").push(curTransaction);
      // Add drink transaction to queue
      queueRef.push(curTransaction);
    });
  });

  res.status(200).send("success!");
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});
