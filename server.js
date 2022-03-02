//--------------------
// NODE
//--------------------

const express = require('express');
const app = express();

// Middleware & Dependencies

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const compression = require('compression');
const ejs = require('ejs');
const crypto = require('crypto');


//--------------------
// LOGGING
//--------------------

const { getDate, logOutput, logError } = require('./logger');

//--------------------
// NETWORK
//--------------------

// Routing

const port = 2222; 												// Action required: input the desired port number
const secureport = 3333; 										// Action required: input the desired port number
const redisport = 4444; 										// Action required: select the correct port number on which Redis is listening
const router = require('./router');
const errorHandler = require('./errorhandler');

// SSL Certificates

const privateKey = fs.readFileSync('mypath/privkey.pem'); 		// Action required: replace "mypath" with a valid path
const certificate = fs.readFileSync('mypath/fullchain.pem'); 	// Action required: replace "mypath" with a valid path
const credentials = { key: privateKey, cert: certificate };

//--------------------
// SERVER-SIDE VARIABLES
//--------------------

// Locations

const publicRoot = path.join(__dirname, '/public/');

// Nonce

let nonce = crypto.randomBytes(myinteger).toString('base64'); 	// Action required: replace "myinteger" with a valid integer
let nonceString = "'nonce-" + nonce + "'";

// Cookie Secret

let cookieSecret = crypto.randomBytes(myinteger).toString('base64');	// Action required: replace "myinteger" with a valid integer 

// Caching

const cachelifespan = 1800;

const client = redis.createClient(redisport);

client.on('error', (err) => {
	console.log(err);
});


//--------------------
// CLIENT-SIDE VARIABLES
//--------------------

// Cookies

const cookieConfig = {
	httpOnly: true,
	secure: true,
	maxAge: 1800,
	signed: true
};


//--------------------
// EXPRESS
//--------------------

app.set('trust proxy', 'loopback');

// Template-rendering engine

app.set('views', path.join(__dirname + '/templates/'));
app.set('view engine', 'ejs');

// Security

app.use(function (req, res, next) {
	res.locals.cspNonce = nonce;
	next();
});

app.use(helmet());

// CSP

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", nonceString, "https://www.google-analytics.com", "https://ssl.google-analytics.com", "https://tagmanager.google.com"],
			styleSrc: ["'self'", "https://tagmanager.google.com", "https://fonts.googleapis.com"],
			fontSrc: ["'self'", "https://fonts.gstatic.com data:"],
			imgSrc: ["'self'", "https://www.google-analytics.com", "www.googletagmanager.com", "https://ssl.gstatic.com", "https://www.gstatic.com"],
			frameSrc: ["'self'"],
			childSrc: ["'self'"],
			objectSrc: ["'self'"],
			connectSrc: ["'self'", "https://www.google-analytics.com", "*.doubleclick.net"],
			upgradeInsecureRequests: [],
		}
	})
);

app.use(
	helmet.expectCt({
		maxAge: 1800,
		enforce: true
	})
);

// Compress requests

app.use(compression());

// HTTPS redirection

app.use(function (req, res, next) {
	if(!req.secure) {
		return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
	}
	next();
});

// Cookies

app.use(cookieParser( cookieSecret ));

app.use(function (req, res, next) {
	let cookie = req.cookies.cookieName;
	if (cookie === undefined) {
		let randomNumber=Math.random().toString();
		randomNumber=randomNumber.substring(2,randomNumber.length);
		res.cookie('session', randomNumber, cookieConfig);
	};
	next();
});

// Static resources

const options = {
	dotfiles: 'allow', // Enable dotfiles to 1) allow Let's Encrypt to place temporary dotfiles in .well-known folder and 2) have those dotflies publicly accessible for Let's Encrypt to authenticate your server and certificates
	etag: true,
	extensions: ['html', 'htm'],
	index: 'index.html',
	lastModified: true,
	maxAge: 0,
	redirect: true,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
};

app.use(express.static('public', options));

// Routing

app.use('/', function (req, res, next) {
	req.const = {
		nonce: nonce,
		publicRoot: publicRoot,
		client: client,
		cachelifespan: cachelifespan
	};
	next();
}, router);


// Error handling

app.use('/', function (req, res, next) {
	req.const = {
		nonce: nonce,
		publicRoot: publicRoot,
	};
	next();
}, errorHandler);


//--------------------
// SERVER
//--------------------

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(secureport);

logOutput("Node server started");