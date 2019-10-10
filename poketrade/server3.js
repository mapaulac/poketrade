var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

var https = require('https');
var fs = require('fs');

var express = require('express')
var app = express()

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);
app.set('view engine', 'ejs');
app.use(express.static('public'));

var credentials = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

console.log("Listening");

app.get('/search', function(req, res) {
  db.find({"username":req.query.usersearch}, function(err, docs) {
    let passedindata = new Object();
    passedindata.alldata = docs;
    res.render("output.ejs", passedindata);

  });
});

//app.post
//db.update
// let order = 0;
app.post('/datasub', function(req, res) {
  console.log("They submitted: " + req.body.thetext + " " + req.body.thetext2);
  console.log(req.body.lat);
  console.log(req.body.lon);
  let data = new Object();
  data.username= req.body.thetext;
  data.password= req.body.thetext2;
  data.contact= req.body.thetext3;
  data.pokemon1= req.body.pokename1;
  data.pokemon2= req.body.pokename2;
  data.pokemon3= req.body.pokename3;
  data.pokemon4= req.body.pokename4;
  data.pokemon5= req.body.pokename5;
  data.pokemon6= req.body.pokename6;
  data.lat = req.body.lat;
  data.lon = req.body.lon;
  // data._id = order;
  // order++;

  // Insert the data into the database
  db.insert(data, function (err, newDocs) {
  	console.log("err: " + err);
  	console.log("newDocs: " + newDocs);

    //Search/Returning data
    db.find({}, function(err, docs) {
      for (var i = 0; i < docs.length; i++) {
    		console.log(docs[i]);
    	}
      // Package array into object for passing into EJS
      let passedindata = new Object();
      passedindata.alldata = docs; // from the database
      passedindata.mydata = data; // from the form
      // res.render("profile.ejs", passedindata);
      res.render("show_locations3.ejs", passedindata);
    });
  });
});

app.get('/profile', function(req, res) {
	// Find all of the existing docs in the database
	db.find({}, function(err, docs) {
		// res.send(docs);
    let passedindata = new Object();
    passedindata.alldata = docs;
    res.render("profile.ejs", passedindata);
	});
});

app.get('/datasub', function(req, res) {
	// Find all of the existing docs in the database
	db.find({}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      console.log(docs[i]);
    }
    let passedindata = new Object();
    passedindata.alldata = docs;
    res.render("show_locations3.ejs", passedindata);
	});
});

app.get('/map', function(req, res) {
	res.redirect('map.html');
});

app.get('/getlocations', function(req, res) {
	// Find all of the existing docs in the database
	db.find({}, function(err, docs) {
		res.send(docs);
	});
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443);
