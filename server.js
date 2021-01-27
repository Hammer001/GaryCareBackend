// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var https = require('https');
var fs = require('fs')
const helmet = require("helmet");

let options = {
    cert: fs.readFileSync('./app/ssl/1_www.garycaremini.xyz_bundle.crt'),
    key: fs.readFileSync('./app/ssl/2_www.garycaremini.xyz.key')
}

// configuration ===============================================================
mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(helmet());

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
var httpsServer = https.createServer(options,app);
app.listen(port);
console.log("App listening on port " + port);
