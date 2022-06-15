const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

   
        
// Database connections

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306
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
                sql += 'socket_id varchar(256) not null, ';
                sql += 'posts json not null, ';
                sql += 'sports varchar(128) );';

                database.query(sql, [`${req.body.clubId}_users`], (err4, result) => {
                    if (err4) throw err4;
                    
                    sql = 'INSERT INTO ?? (email, username, socket_id, posts, comments, sports) VALUES (?, ?, ?, ?, ?, ?)';
                    const placeholders = [`${req.body.clubId}_users`, req.body.email, req.body.username, req.body.socketId, JSON.stringify([]), JSON.stringify([]), req.body.sport];
                    database.query(sql, placeholders, (err5, result) => {
                        
                        if (err5) throw err5;
                        sql = "CREATE TABLE IF NOT EXISTS ?? (";
                        sql += "id int primary key auto_increment not null, ";
                        sql += "club_id varchar(128) not null, ";
                        sql += "club_name varchar(128) not null, ";
                        sql += "owner varchar(256) not null, ";
                        sql += "sport varchar(256) not null, ";
                        sql += "people int not null );";
                        database.query(sql, ["uniclubs"], (err6, result) => {
                            if (err6) throw err6;
                            
                            sql = "INSERT INTO ?? (club_id, club_name, owner, sport, people) VALUES (?, ?, ?, ?, ?)";
                            database.query(sql, ["uniclubs", req.body.clubId, req.body.clubName, req.body.username, req.body.sport, 1], (err7, result) => {
                                if (err7) throw err;
                                console.log("here 2 22");
                                res.json({ status: true });
                                console.log('New club');
                            })
                            
                        });
                       
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
            sport: req.body.sport
        }];

        sql = "UPDATE ?? SET clubs = ? WHERE id = ?";

        database.query(sql, ["users", JSON.stringify(newClubs), req.body.id], (err2, result) => {
            if (err2) throw err;
            
            sql = "INSERT INTO ?? (email, username, socket_id, posts, comments) VALUES (?, ?, ?, ?, ?); ";
            database.query(sql, [`${req.body.clubId}_users`, req.body.email, req.body.username, req.body.socketId, JSON.stringify([]), JSON.stringify([])], (err3, inserted) => {
               
                if (err3) throw err;
               
                sql = "SELECT * FROM ?? WHERE club_id = ?";
                database.query(sql, ["uniclubs", req.body.clubId], (err3, rows) => {
                    if (err3) throw err;
                    
                    if (rows.length !== 1) {
                        console.log('here');
                        res.json({error: "User not found"});
                        return;
                    }
                    const people = rows[0]["people"] + 1;
                    sql = "UPDATE ?? SET people = ? WHERE club_id = ?";
                    database.query(sql, ["uniclubs", people, req.body.clubId], (err4, newResult) => {
                        if (err4) throw err4;
                        console.log(newResult);
                        res.json({joined: true});
                    });
                })
            });
        });
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
            console.log(rows.length);
            res.json({error: "The post was not found"});
            return;
        }
        const newComments = [...JSON.parse(rows[0]["comments"]), {
            from: req.body.username,
            content: req.body.content,
            date: new Date()
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

app.post("/get-posts", (req, res) => {
    sql = "SELECT * FROM ?? ORDER BY id DESC";
    database.query(sql, [`${req.body.clubId}_posts`], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.post("/search-club", (req, res) => {
    sql = "SELECT * FROM ?? WHERE club_name LIKE concat('%' , ?, '%') OR club_id LIKE concat('%', ?, '%')";
    database.query(sql, ["uniclubs", req.body.name, req.body.name], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.post("/check-club", (req, res) => {
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", req.body.id], (err, rows) => {
        if (err) throw err;
        const data = JSON.parse(rows[0]["clubs"]).find(club => club.id === req.body.clubId);
        if (data) res.json({check: true});
        else res.json({check: false});
    });
});

app.post("/get-comments", (req, res) => {
    sql = "SELECT * FROM ?? ORDER BY id DESC;";
    database.query(sql, [`${req.body.clubId}_posts`], (err, rows) => {
        if (err) throw err;
        const comments = [];
        rows.forEach(row => {
            let postComments = [];
            JSON.parse(row.comments).forEach(comment => {
                postComments.push(comment)
            });
            comments.push(postComments);
        });

        res.json({comments: comments});
    });
});

app.post("/people-in-club", (req, res) => {
    sql = "SELECT * FROM ?? WHERE club_id = ?";
    database.query(sql, ["uniclubs", req.body.clubId], (err, rows) => {
        if (err) throw err;
        if (!rows) return;
        if (!rows[0]) return;
        res.json({people: rows[0]["people"], id: rows[0]["club_id"]});
    });
});

app.post("/update-account", (req, res) => {
    sql = "UPDATE ?? SET email = ?, username = ?, first_name = ?, last_name = ? WHERE id = ?";
    database.query(sql, ["users", req.body.email, req.body.username, req.body.first_name, req.body.last_name, req.body.id], (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});

app.post("/check-admin", (req, res) => {
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", req.body.id], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) res.json({error: "User not found!"});
        const clubs = JSON.parse(rows[0]["clubs"]);
        if (clubs.length === 0) res.json({ admin: false });
        const currClub = clubs.find(club => club.id === req.body.clubId);
        res.json({ admin: currClub.owner });
    });
});

app.post("/delete-club", (req, res) => {
    sql = "DROP TABLE ??";
    database.query(sql, [`${req.body.clubId}_posts`], (err, result) => {
        if (err) throw err;
        sql = "SELECT * FROM ??";
        database.query(sql, [`${req.body.clubId}_users`], (err2, rows) => {
            if (err2) throw err2;
            rows.forEach(row => {
                const email = row.email;
                sql = "SELECT * FROM ?? WHERE email = ?";
                database.query(sql, ["users", email], (err3, userRows) => {
                    if (err3) throw err3;
                    if (userRows.length !== 1) res.json({error: "User not found"});
                    const clubs = JSON.parse(userRows[0]["clubs"]);
                    const newClubs = clubs.filter(club => club.id !== req.body.clubId);
                    sql = "UPDATE ?? SET clubs = ? WHERE email = ?";
                    database.query(sql, ["users", newClubs, email], (err4, result) => {
                        if (err4) throw err4;
                    });
                });
            });

            sql = "DROP TABLE ??";
            database.query(sql, [`${req.body.clubId}_users`], (finErr) => {
                if (finErr) throw finErr;
                res.json({deleted: true});
            });
        });
    });
});

app.post("/delete-post", (req, res) => {
    sql = "DELETE FROM ?? WHERE id = ?";
    console.log(req.body.postIdx, req.body.clubId);
    database.query(sql, [`${req.body.clubId}_posts`, req.body.postIdx], (err, result) => {
        if (err) throw err;
        res.json({deleted: true});
    });
});

app.post("/delete-comment", (req, res) => {

    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, [`${req.body.clubId}_posts`, req.body.postIdx], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) res.json({error: "Post not found"});
        const comments = JSON.parse(rows[0]["comments"]);
        const newComments = comments.filter((comment, commentIdx) => commentIdx !== req.body.commentIdx);
        sql = "UPDATE ?? SET comments = ? WHERE id = ?";
        database.query(sql, [`${req.body.clubId}_posts`, JSON.stringify(newComments), req.body.postIdx], (err2, result) => {
            if (err2) throw err2;
        });
    });
});

app.post("/group-users", (req, res) => {
    sql = "SELECT * FROM ??;";
    database.query(sql, [`${req.body.clubId}_users`], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) res.json({error: "Group users not found!"});
        res.json({users: rows});
    });
});


io.on("connection", socket => {
    console.log("Connected!");

    socket.on("update_feed", (clubId, email) => {

        sql = "SELECT * FROM ?? WHERE email != ?";
        database.query(sql, [`${clubId}_users`, email], (err, rows) => {
            if (err) throw err;
            rows.forEach(row => {
                console.log(row);
                socket.to(row["socket_id"]).emit("new_feed");
            })
        });
    });

    socket.on("update_socket", (email) => {
        sql = "SELECT * FROM ?? WHERE email = ?";
        database.query(sql, ["users", email], (err, rows) => {
            if (err) throw err;
            if (rows.length !== 1) return;
            const row = rows[0];
            const clubs = JSON.parse(row["clubs"]);
            console.log(clubs);
            clubs && clubs.forEach(club => {
                console.log("here x", club);
                sql = "UPDATE ?? SET socket_id = ? WHERE email = ?";
                database.query(sql, [`${club.id}_users`, socket.id, email], (err2, result) => {
                    if (err2) throw err2;
                    sql = "UPDATE ?? SET socket_id = ? WHERE email = ?";
                    database.query(sql, [`${club.id}_users`, socket.id, email], (err3, result) => {
                        if (err3) throw err3;
                        console.log(result);
                    });
                    
                });
            });
        });
    });

    socket.on("disconnect", () => console.log("Disconnect"));

});


server.listen(8080, () => console.log('Server listen on 8080!'));