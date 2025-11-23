const {db} = require('../config/db.js');
const bcrypt = require('bcrypt.js');
const jwt = require('jsonwebtoken');

const signToken = (userID, role) => {
    return jwt.sign({ userID, role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

const signup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    bcrypt.hash(password, 20, (err, hashedpassword) => {
        if (err) {
            return res.status(500).json({ message: "Error in Hashing Password"});
        }

        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        const params = [name, email, hashedpassword, role];

        res.cookie('SignedUp', `User ID ${id}`, {
            httpOnly: true,
            maxAge: 15*60*1000
        });
    });

    db.run(query, params, (err) =>{
        if (err) {
            console.log(err);
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({error: 'Email already exists'});
            }
            return res.status(500).json({ error: "Error Creating User"});
        }
        return res.status(201).json({ message: "User Successfully Created"});
    });
};

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields"});
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    const params = email;

    res.cookie("LoggedIn", `User Email ${email}`, {
        httpOnly: true,
        maxAge: 15*60*1000
    });

    db.get(query, params, (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error retrieving User"});
        }
        if (!row) {
            return res.status(400).json({ error: "Invalid Email or Password"});
        }

        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Error comparing passwords"});
            }
            if (!result) {
                return res.status(400).json({ error: "Invalid Email or Password"});
            }

            const token = signToken(row.id, row.role);

            return res.status(200).json({
                message: "Login Successful",
                data: {id: row.id, name: row.name, email: row.email, role: row.role},
                token,
            });
        });
    });
};