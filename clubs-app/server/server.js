if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.11:3000"]
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
    sql += 'notifications json not null, ';
    sql += 'socket_id varchar(256) );';

    database.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Table created!')
    });
});

let sql;

// Routes 

app.get("/", (req, res) => {
    res.send("Hello");
});

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
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const placeholders = ['users', req.body.email, req.body.username, req.body.firstName, req.body.lastName, hashPassword, null, JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), req.body.socket_id];
        sql = 'INSERT INTO ?? (email, username, first_name, last_name, password, profile_image, sports, friends, clubs, notifications, socket_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
        console.log('here');
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
            sport: req.body.sport,
            public: req.body.public
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
                    
                    sql = 'INSERT INTO ?? (email, username, socket_id, posts, sports) VALUES (?, ?, ?, ?, ?)';
                    const placeholders = [`${req.body.clubId}_users`, req.body.email, req.body.username, req.body.socketId, JSON.stringify([]), req.body.sport];
                    database.query(sql, placeholders, (err5, result) => {
                        console.log(req.body.public);
                        if (err5) throw err5;
                        
                        sql = "CREATE TABLE IF NOT EXISTS ?? (";
                        sql += "id int primary key auto_increment not null, ";
                        sql += "club_id varchar(128) not null, ";
                        sql += "club_name varchar(128) not null, ";
                        sql += "owner varchar(256) not null, ";
                        sql += "sport varchar(256) not null, ";
                        sql += "privacy int not null, ";
                        sql += "people int not null );";

                        database.query(sql, ["uniclubs"], (err6, result) => {
                            if (err6) throw err6;
                            console.log(req.body.public);
                            sql = "INSERT INTO ?? (club_id, club_name, owner, sport, privacy, people) VALUES (?, ?, ?, ?, ?, ?)";
                            database.query(sql, ["uniclubs", req.body.clubId, req.body.clubName, req.body.username, req.body.sport, req.body.public, 1], (err7, result) => {
                                if (err7) throw err7;
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
            
            sql = "INSERT INTO ?? (email, username, socket_id, posts) VALUES (?, ?, ?, ?); ";
            database.query(sql, [`${req.body.clubId}_users`, req.body.email, req.body.username, req.body.socketId, JSON.stringify([])], (err3, inserted) => {
               
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

app.post("remove-from-club", (req, res) => {
    const { id, clubId } = req.body;
    if (id === 1) return;
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", id], (err, rows) => {
        if (err) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        const username = rows[0]["username"];
        sql = "DELETE FROM ?? WHERE username = ?";

        database.query(sql, [`${clubId}_users`, username], (err, result) => {
            if (err) throw err;
            if (result) res.status(200).json({ result: true });
        });
    })
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

            console.log("Comment created!");
            res.json({ commented: true });
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

app.post("/get-admin", (req, res) => {
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, [`${req.body.clubId}_users`, 1], (err, rows) => {
        if (err) throw err;
        res.json({ admin: rows[0]["username"], socket: rows[0]["socket_id"] });
    });
}); 

app.post("/get-notifications", (req, res) => {
    const { id } = req.body; 
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", id], (err, rows) => {
        if (err) throw err;
        if (!rows) return;
        if (!rows[0]) return;
        const notifications = JSON.parse(rows[0]["notifications"]);
      

        res.status(200).json({ notifications: notifications });
    });
});

app.post("/remove-notification", (req, res) => {
    const { id, dbId } = req.body;
    sql = 'SELECT * FROM ?? WHERE id = ?';
    database.query(sql, ["users", id], (err, rows) => {
        if (err) throw err;
        if (!rows) return;
        if (!rows[0]) return;

        const notifications = JSON.parse(rows[0]["notifications"]);
        const newNotifications = notifications.filter((notification, idx) => idx !== dbId);

        sql = "UPDATE ?? SET notifications = ? WHERE id = ?";
        database.query(sql, ["users", JSON.stringify(newNotifications), id], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.status(200).json({ result: true })
        });
    });
});

app.post("/push-notification", (req, res) => {
    const { from, to, message, type } = req.body;
    sql = "SELECT * FROM ?? WHERE username = ?";
    database.query(sql, ["users", to], (err, rows) => {
        if (err) throw err;
        if (!rows || !rows[0]) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const adminNotifications = JSON.parse(rows[0]["notifications"]);
        adminNotifications.unshift({
            type: type,
            from: from,
            message: message
        });

        console.log(adminNotifications);

        sql = "UPDATE ?? SET notifications = ? WHERE username = ?";

        database.query(sql, ["users", JSON.stringify(adminNotifications), to], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.json({ result: true });
        }); 
        
    });
}); 

app.post("/get-club-data", (req, res) => {
    sql = "SELECT * FROM ??";
    
    database.query(sql, [`${req.body.clubId}_users`], (err, rows) => {
        if (err) throw err;
        const username = rows[0].username;

        sql = "SELECT * FROM ?? WHERE username = ?";
        database.query(sql, ["users", username], (err, rows) => {
            if (err) throw err;
            if (!rows || !rows[0]) return;
            const userClubs = JSON.parse(rows[0]["clubs"]);
            const initialClubData = userClubs.find(club => club.id === req.body.clubId);
            console.log("FOUND", initialClubData);
            res.status(200).json({ sport: initialClubData.sport, name: initialClubData.name, public: initialClubData.public });
        }); 
    });
});

app.post('/check-user-in-club', (req, res) => {
    sql = 'SELECT * FROM ?? WHERE id = ?';
    database.query(sql, ["users", req.body.id], (err, rows) => {
      
        if (err || !rows || rows.length === 0) {
            res.status(404).json({ result: false });
            return;
        }
      
        const activeClubs = JSON.parse(rows[0]["clubs"]);
        console.log(JSON.parse(rows[0]["clubs"]));
        const foundClub = activeClubs.some(club => club.id === req.body.clubId);
        console.log(foundClub)
        res.status(200).json({ result: foundClub });
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

app.post("/get-posts-limit", (req, res) => {
    sql = "SELECT * FROM ?? ORDER BY id DESC LIMIT ?";
    database.query(sql, [`${req.body.clubId}_posts`, req.body.limit], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.post("/search-club", (req, res) => {
    sql = "SELECT * FROM ?? WHERE club_name LIKE concat('%' , ?, '%') OR club_id LIKE concat('%', ?, '%')";
    database.query(sql, ["uniclubs", req.body.query, req.body.query], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.post("/search-people", (req, res) => {
    console.log("SEARCH PEOPLE", req.body);
    sql = "SELECT * FROM ?? WHERE username LIKE concat('%' , ?, '%') OR email LIKE concat('%', ?, '%')";
    database.query(sql, ["users", req.body.query, req.body.query], (err, rows) => {
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
        console.log("HERE HERE HWERE", newComments, req.body.commentIdx);
        sql = "UPDATE ?? SET comments = ? WHERE id = ?";
        database.query(sql, [`${req.body.clubId}_posts`, JSON.stringify(newComments), req.body.postIdx], (err2, result) => {
            if (err2) throw err2;
            res.json({deleted: true});
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

app.post('/change-privacy', (req, res) => {
    console.log(req.body.privacy);
    sql = "UPDATE ?? SET privacy = ? WHERE club_id = ?";
    database.query(sql, ["uniclubs", req.body.privacy, req.body.clubId], (err, result) => {
        if (err) throw err;
        console.log(result);
        sql = "SELECT * FROM ??";

        database.query(sql, ["uniclubs"], (err2, rows) => {
            if (err2) throw err2;
            sql = "SELECT * FROM ??";

            database.query(sql, [`${req.body.clubId}_users`], (err, rows) => {
                if (err) throw err;
                rows.forEach(row => {
                    sql = "SELECT * FROM ?? WHERE email = ?";
                    database.query(sql, ["users", row.email], (err2, userRows) => {
                        if (err2) throw err2;
                        if (userRows.length !== 1) return;
                        const userRow = userRows[0];
                        let idx;
                        JSON.parse(userRow.clubs).forEach((club, clubIdx) => {
                            if (club.id === req.body.clubId) idx = clubIdx;
                        });
                        const newClubs = JSON.parse(userRow.clubs);
                        
                        Object.assign(newClubs[idx], {public: req.body.privacy});
                        sql = "UPDATE ?? SET clubs = ? WHERE email = ?";
                        database.query(sql, ["users", JSON.stringify(newClubs), row.email], (err3, updateResult) => {
                            if (err3) throw err;
                            console.log("SIUU", updateResult);
                        });
                    })
                });
            });

        });
    });
});

app.post("/add-friend", (req, res) => {
    const { username, friendUsername } = req.body;
    sql = "SELECT * FROM ?? WHERE username = ?";
    database.query(sql, ["users", username], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) return;
        const newFriends = [...JSON.parse(rows[0]["friends"]), {
            username: friendUsername
        }];
        sql = "UPDATE ?? SET friends = ? WHERE username = ?";
        database.query(sql, ["users", JSON.stringify(newFriends), username], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.status(200).json({ result: true, friendSocketId: rows[0]["socket_id"]});
        });
    });
});

app.post("/remove-friend", (req, res) => {
    const { removeFriendUsername, username } = req.body;

    sql = "SELECT * FROM ?? WHERE username = ?";
    database.query(sql, ["users", username], (err, rows) => {
        if (err) throw err;
        if (rows.length !== 1) return;
        const newFriends = JSON.parse(rows[0]["friends"]);
        newFriends.forEach((currFriend, idx) => {
            if (currFriend.username === removeFriendUsername) newFriends.splice(idx, 1);
        });

        sql = "UPDATE ?? SET friends = ? WHERE username = ?";
        database.query(sql, ["users", JSON.stringify(newFriends), username], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.status(200).json({ result: true });

        });
    });
});

app.post("/check-friend", (req, res) => {
    const {username, friendUsername} = req.body;
    sql = "SELECT * FROM ?? WHERE username = ?";
    database.query(sql, ["users", username], (err, rows) => {
        if (err) console.log(err);
        if (!rows) return;
        if (!rows[0]) return;
        
        const friends = JSON.parse(rows[0]["friends"]);
        const result = friends.some(friend => friend.username === friendUsername);
        res.json( { result } );
    });
});

app.post("/add-sports", (req, res) => {
    const { id, sports } = req.body;

    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", id], (err, rows) => {
        if (err) throw err;
        if (!rows || !rows[0]) {
            res.status(404).json({ error: "User not found!" });
            return;
        }

        sql = "UPDATE ?? SET sports = ? WHERE id = ?";
        database.query(sql, ["users", JSON.stringify(sports), id], (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    });
});

app.post("/get-recommendations", (req, res) => {
    

});

app.post("/user-exists", (req, res) => {
    const { username } = req.body;
    console.log(username);
    sql = "SELECT * FROM ?? WHERE username = ?";
    database.query(sql, ["users", username], (err, rows) => {
        console.log("NEW ROWS", rows);
        if (err || !rows || !rows.length) {
            console.log("IN IT")
            res.json({ result: false });
            return;
        }

        res.status(200).json({ result: true });
    });
});

app.post("/user-data", (req, res) => {
    const { id } = req.body;
    sql = "SELECT * FROM ?? WHERE id = ?";
    database.query(sql, ["users", id], (err, rows) => {
        if (err) throw err;
        res.json(rows[0]);
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
                        sql = "UPDATE ?? SET socket_id = ? WHERE email = ?";
                        console.log(result);
                        database.query(sql, ["users", socket.id, email], (err, result) => {
                            if (err) throw err;
                            console.log(result);
                        });
                    });
                });
            });
        });
    });

    socket.on("request-add-friend", (username, friendUsername, message) => {
        sql = "SELECT * FROM ?? WHERE username = ?";
        database.query(sql, ["users", friendUsername], (err, rows) => {
            if (err) throw err;
            if (rows.length !== 1) return;
            const friendSocket = rows[0]["socket_id"];
            const friendNotifications = [...JSON.parse(rows[0]["notifications"]), {
                message: message,
                type: "friend-request"
            }];
            socket.to(friendSocket).emit("friend-request", username);            

            sql = "UPDATE ?? SET notifications = ? WHERE username = ?";
            database.query(sql, ["users", friendNotifications, friendUsername], (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        });
    });

    socket.on("request-response", (username, response, message) => {
        sql = "SELECT * FROM ?? WHERE username = ?";
        database.query(sql, ["users", username], (err, rows) => {
            if (err) throw err;
            if (rows.length !== 1) return;
            const friendSocket = rows[0]["socket_id"];
            const friendNotifications = [...JSON.parse(rows[0]["notifications"]), {
                message: message,
                type: "friend-response"
            }];
            
            sql = "UPDATE ?? SET notifications = ? WHERE username = ?";
            database.query(sql, ["users", friendNotifications, username], (err, result) => {
                if (err) throw err;
                console.log(result);
                socket.to(friendSocket).emit("friend-request-response", response);            
            });
        });
    });

    socket.on("push-notification", (from, socketAdmin, message, type) => {
        const notification = { from, message, type };
        console.log(socketAdmin);
        socket.to(socketAdmin).emit("pull-notification", notification);
    });

    // Invite friend to group

    socket.on("disconnect", () => console.log("Disconnect"));
});


server.listen(8080, () => console.log('Server listen on 8080!'));