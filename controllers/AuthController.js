const {db} = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger.js');

const signToken = (userID, role) => {
    return jwt.sign({ userID, role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

const signup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || 'visitor';
    const phone = req.body.phone;

    if (!name || !email || !password || !role || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    bcrypt.hash(password, 10, (err, hashedpassword) => {
        if (err) {
            logger.log("Error in Hashing Password: " + err.message);
            return res.status(500).json({ message: "Error in Hashing Password"});
        }

        const query = `INSERT INTO Users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, email, hashedpassword, role, phone];

        db.run(query, params, (err) =>{
            if (err) {
                console.log(err);
                if (err.message.includes('UNIQUE constraint failed')) {
                    logger.log("Signup Error: Email already exists - " + email);
                    return res.status(400).json({error: 'Email already exists'});
                }
                return res.status(500).json({ error: "Error Creating User"});
            }

            res.cookie('SignedUp', `User Email ${email}`, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15*60*1000
        });
            logger.log("User Successfully Created: " + email);
            return res.status(201).json({ message: "User Successfully Created"});
        });
    });
};

const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields"});
    }

    const query = `SELECT * FROM Users WHERE Email = ?`;
    const params = email;

    db.get(query, params, (err, row) => {
        if (err) {
            console.log(err);
            logger.log("Error retrieving User: " + err.message);
            return res.status(500).json({ error: "Error retrieving User"});
        }
        if (!row) {
            logger.log("Invalid login attempt: Email not found - " + email);
            return res.status(400).json({ error: "Invalid Email or Password"});
        }

        bcrypt.compare(password, row.Password, (err, result) => {
            if (err) {
                console.log(err);
                logger.log("Error comparing passwords: " + err.message);
                return res.status(500).json({ error: "Error comparing passwords"});
            }
            if (!result) {
                logger.log("Invalid login attempt: Incorrect password - " + email);
                return res.status(400).json({ error: "Invalid Email or Password"});
            }

            const token = signToken(row.UserID, row.Role);
            
            res.cookie("LoggedIn", `User Email ${email}`, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 15*60*1000
            });

            logger.log("User Logged In Successfully: " + email);
            return res.status(200).json({
                message: "Login Successful",
                data: {id: row.UserID, name: row.Name, email: row.Email, role: row.Role},
                token,
            });
        });
    });
};

module.exports = {
    signup,
    login
};
