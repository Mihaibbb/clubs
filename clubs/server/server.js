const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const io = require('socket.io');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database connections

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password1'
});

database.connect(err => {
    if (err) throw err;

    // Create database

    console.log('Datbase connected!');
    database.query('CREATE DATABASE IF NOT EXISTS ??', ['clubs'], (err, result) => {
        if (err) throw err;
    });

    database.query('USE ??', ['clubs'], (err, result) => {
        if (err) throw err;
        console.log("Used!");
    });

    // Create table

    let sql = 'CREATE TABLE IF NOT EXISTS users (';
    sql += 'id int(11) auto_increment primary key not null, ';
    sql += 'email varchar(256) not null, ';
    sql += 'username varchar(256) not null, ';
    sql += 'first_name varchar(256) not null, ';
    sql += 'last_name varchar(256) not null, ';
    sql += 'password varchar(256) not null, ';
    sql += 'profile_image BLOB, ';
    sql += 'sports json not null, ';
    sql += 'friends json not null, ';
    sql += 'clubs json not null, ';
    sql += 'socket_id varchar(256) );';

    database.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Table created!")
    });
});

let sql;

// Routes 


// User sign up
app.post('/signup', (req, res) => {
    sql = "SELECT * FROM ?? WHERE email = ? OR username = ?";
    database.query(sql, ["users", req.body.email, req.body.username], async (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json({error: "Email or username have already been used!"});
            return;
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const placeholders = ["users", req.body.email, req.body.username, req.body.first_name, req.body.last_name, hashPassword, null, JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), req.body.socket_id];
        sql = "INSERT INTO ?? (email, username, first_name, last_name, password, profile_image, sports, friends, clubs, socket_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        database.query(sql, placeholders, (err, result) => {
            console.log("User inserted!");
            res.json({signed: true, id: result.insertedId});
        });
    });
});

// User login
app.post('/login', (req, res) => {
    sql = "SELECT * FROM ?? WHERE email = ?";
    database.query(sql, ["users", req.body.email], async (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: "Email or password is incorrect!"});
            return;
        }
        const row = rows[0];
        const samePassword = await bcrypt.compare(req.body.password, row.password);
        if (!samePassword) {
            res.json({error: "Email or password is incorrect!"});
            return;
        }
        res.json({...row, logged: true});
    });
});

app.listen(8080, () => console.log('Server listen on 8080!'));