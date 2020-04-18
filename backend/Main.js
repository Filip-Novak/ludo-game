const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Routes = require('./Routes');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

//Databaza
const db = mysql.createConnection({
	host: 'localhost',
	port: 3308,
	user: 'filip', 
	password: 'filip',
	database: 'tia-hra'
});

db.connect(function(err) {
	if(err){
		console.log('DB error');
		throw err;
		return false;
	}
});

const sessionStore = new MySQLStore({
	expiration: (864 * 100),		//den
	endConnectionOnClose: false,
}, db);

app.use(session({
	key: 'asdf45aa56s4f6ad5sf',
	secret: '54fasd54fas59f5asd4sd',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: (864 * 100),		//den
		httpOnly: false,
	}
}));

new Routes(app, db);

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(3000);






