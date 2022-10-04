// init project
var express = require("express");
var fs = require("fs");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
var db;
var app = express();
var TestText;

// Add MONGODB_URL and DB_NAME environment variables
// In MongoDB Atlas (https://cloud.mongodb.com/), from Clusters > Connect > Connect Your Application, copy the URL in 'Connection String Only'
// Add it and the database name to the environment variables under "Secret Keys' from the server control panel to the left of the editor.
const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true
});

// Using `public` for static files: http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// Initial set of users to populate the database with
let reqPath = path.join(__dirname, "./data.json");

// Use bodyParser to parse application/x-www-form-urlencoded form data
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Connect to database and insert default users into users collection
client.connect(err => {
  console.log("Connected successfully to database");
  TestText = "Bd Connected";
  db = client.db(process.env.DB_NAME);
});

app.get("/difuse", function(request, response) {
  let DifusePath = path.join(__dirname, "../public/difuse.html");
  db.collection("TheData")
    .find()
    .toArray(function(err, users) {
      response.setHeader("Content-Type", "application/json");
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      response.header("Access-Control-Allow-Origin", DifusePath, "always");
      response.send(users); // sends users back to the page
    });
});
//app.use("/api", jsonServer.router(clone(db.collection("TheData").find()), { _isFake: true }));

// Send user data - used by client.js
app.get("/users", function(request, response) {
  db.collection("TheData")
    .find()
    .toArray(function(err, users) {
      // finds all entries in the users collection
      response.send(users); // sends users back to the page
      //const Ledata = users;
      //console.log(users);
      //console.log("Output Content : \n"+ reqPath);
    });
});

//Save Data
app.get("/insert", function(request, response) {
  fs.readFile(reqPath, "utf8", function(err, data) {
    //Handle Error
    if (!err) {
      //Handle Success
      data = JSON.parse(data);
      console.log(data);
      db.collection("TheData").insertMany(data, function(err, r) {
        console.error(err);
      });
      //console.log("after" +defaultUsers);
    } else {
      //Handle Error
      console.error(err);
    }
  });
});

// Removes users from users collection and re-populates with the default users
app.get("/reset", function(request, response) {
  db.collection("TheData").deleteMany(function(err, r) {});
});

// Serve the root url: http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  let IndexPath = path.join(__dirname, "../public/index.html");

  response.sendFile(IndexPath);
});

app.get("/testing", function(request, response) {
  let TestingPaht = path.join(__dirname, "../public/testing.html");
  response.setHeader("Content-Type", "text/html");
  response.header("Access-Control-Allow-Origin", TestingPaht, "always");
  response.write('<html><body>');
  response.write('<p>TheDB: ' + process.env.DB_NAME + '</p>');
  response.write('<p>Alors: ' + TestText + '</p>');
  response.write('</body></html>');
  response.end();
});

// Listen on port 8080
var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
  console.log(__dirname);
});

