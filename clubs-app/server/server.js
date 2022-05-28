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
        console.log('Used!');
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
        console.log('Table created!')
    });
});

let sql;

// Routes 


// User sign up
app.post('/signup', (req, res) => {
    console.log(req.body);
    sql = 'SELECT * FROM ?? WHERE email = ? OR username = ?';
    database.query(sql, ['users', req.body.email, req.body.username], async (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json({error: 'Email or username have already been used!'});
            return;
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const placeholders = ['users', req.body.email, req.body.username, req.body.firstName, req.body.lastName, hashPassword, null, JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), req.body.socket_id];
        sql = 'INSERT INTO ?? (email, username, first_name, last_name, password, profile_image, sports, friends, clubs, socket_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        database.query(sql, placeholders, (err, result) => {
            if (err) throw err;
            console.log('User inserted!');
            console.log(result);
            res.json({signed: true, id: result?.insertId});
        });
    });
});

// User login
app.post('/login', (req, res) => {
    sql = 'SELECT * FROM ?? WHERE email = ?';
    database.query(sql, ['users', req.body.email], async (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: 'Email or password is incorrect!'});
            return;
        }
        const row = rows[0];
        const samePassword = await bcrypt.compare(req.body.password, row.password);
        if (!samePassword) {
            res.json({error: 'Email or password is incorrect!'});
            return;
        }
        console.log('Logged!');
        res.json({...row, logged: true});
    });
});

app.post('/create-club', (req, res) => {
    // owner: true, date, users, -> owner column 
    sql = 'SELECT * FROM ?? WHERE id = ?';
    database.query(sql, ['users', req.body.id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: 'User doesn\'t exist'});
            return;
        }
        const row = rows[0];
        const newClubs = [...JSON.parse(row['clubs']), {
            id: req.body.clubId,
            name: req.body.clubName,
            owner: true,
            date: new Date(),
            sport: req.body.sport
        }];

        sql = 'UPDATE ?? SET clubs = ? WHERE id = ?';
        database.query(sql, ['users', JSON.stringify(newClubs), req.body.id], (err2, result) => {
            if (err2) throw err2;

            // create table for the new club
            sql = 'CREATE TABLE IF NOT EXISTS ?? (';
            sql += 'id int(11) auto_increment primary key not null, ';
            sql += 'creator varchar(256) not null, ';
            sql += 'content text not null, ';
            sql += 'title varchar(128) not null, ';
            sql += 'comments json not null );';

            database.query(sql, [`${req.body.clubId}_posts`], (err3, result) => {
                if (err3) throw err3;
                // Table for each user of a club with unique id

                sql = 'CREATE TABLE IF NOT EXISTS ?? (';
                sql += 'id int(11) auto_increment primary key not null, ';
                sql += 'email varchar(256) not null, ';
                sql += 'username varchar(256) not null, ';
                sql += 'posts json not null, ';
                sql += 'comments json not null, ';
                sql += 'sports varchar(128) );';

                database.query(sql, [`${req.body.clubId}_users`], (err4, result) => {
                    if (err4) throw err4;

                    sql = 'INSERT INTO ?? (email, username, posts, comments, sports) VALUES (?, ?, ?, ?, ?)';
                    const placeholders = [`${req.body.clubId}_users`, req.body.email, req.body.username, JSON.stringify([]), JSON.stringify([]), req.body.sport];
                    database.query(sql, placeholders, (err5, result) => {
                        if (err5) throw err;
                        res.json({ status: true });
                        console.log('New club');
                    });

                });
            });
        });
    });
}); 

app.post('/join-club', (req, res) => {
    
    sql = 'SELECT * FROM ?? WHERE id = ?';
    database.query(sql, ['users', req.body.id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: 'User doesn\'t exist'});
            return;
        }
        const row = rows[0];
        const newClubs = [...JSON.parse(row['clubs']), {
            id: req.body.clubId,
            name: req.body.clubName,
            owner: false,
            date: new Date(),
            
        }];

        sql = "UPDATE ?? SET clubs = ? WHERE id = ?";

        database.query(sql, ["users", JSON.stringify(newClubs), req.body.id], (err2, result) => {
            if (err2) throw err;

            sql = "INSERT INTO ?? (email, username, posts, comments) VALUES (?, ?, ?, ?) ";
            database.query(sql, [`${req.body.clubId}_users`, req.body.email, req.body.useranme, JSON.stringify([]), JSON.stringify([])], (err3, inserted) => {
                if (err3) throw err;
                
                // Join club users
            });
        });
    });
});

app.post('/update-account', (req, res) => {
    sql = "UPDATE ?? SET email = ?, username = ?, first_name = ?, last_name = ?, profile_image = ?, sports = ? WHERE id = ?";
    database.query(sql, ["users", req.body.email, req.body.username, req.body.firstName, req.body.lastName, req.body.profileImage, req.body.sports, req.body.id], (err, result) => {
        if (err) throw err;
        
    });
});

app.post('/create-post', (req, res) => {
    sql = "INSERT INTO ?? (creator, content, title, comments) VALUES (?, ?, ?, ?)";
    database.query(sql, [`${req.body.clubId}_posts`, req.body.username, req.body.content, req.body.title, JSON.stringify([])], (err, result) => {
        if (err) throw err;
        res.json({ posted: true });
    });
});

app.post('/create-comment', (req, res) => {
    sql = "SELECT comments from ?? WHERE id = ?";
    database.query(sql, [`${req.body.clubId}_posts`, req.body.postId], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: "The post was not found"});
            return;
        }
        const newComments = [...JSON.parse(rows[0]["comments"]), {
            from: req.body.username,
            content: req.body.content
        }];

        sql = "UPDATE ?? SET comments = ? WHERE id = ?";
        database.query(sql, [`${req.body.clubId}_posts`, JSON.stringify(newComments), req.body.postId], (err2, result) => {
            if (err2) throw err2;
            sql = "SELECT * FROM ?? WHERE email = ?";
            database.query(sql, [`${req.body.clubId}_users`, req.body.email], (err3, clubUsers) => {
                if (err3) throw err3;
                if (clubUsers.length !== 1) {
                    res.json({error: "User not found"});
                    return;
                }

                const newComments = [...JSON.parse(clubUsers[0]["comments"]), {
                    from: req.body.username,
                    content: req.body.content
                }];

                sql = "UPDATE ?? SET comments = ? WHERE email = ?";

                database.query(sql, [`${req.body.clubId}_users`, JSON.stringify(newComments), req.body.email], (err4, result) => {
                    if (err4) throw err4;
                    console.log("Comment created!");
                    res.json({ commented: true });
                });
            });
        });
    });
});

app.post('/get-clubs', (req, res) => {
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", req.body.id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) {
            res.json({error: "User not found"});
            return;
        }

        const row = rows[0];
        res.json({clubs: JSON.parse(row.clubs)});
        console.log("here", JSON.parse(row.clubs));
    });
});

app.post("/get-members", (req, res) => {
    sql = "SELECT * FROM ?? WHERE email = ?";
    database.query(sql, [`${req.body.clubId}_users`, req.body.email], (err, rows) => {
        if (err) throw err;
        res.json({ members: rows.length });
    });
});

app.post("/get-posts", (req,res) => {
    sql = "SELECT * FROM ?? ORDER BY id DESC";
    database.query(sql, [`${req.body.clubId}_posts`], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});


app.listen(8080, () => console.log('Server listen on 8080!'));