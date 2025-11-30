const {db} = require('../config/db');
const bcrypt = require('bcryptjs');

const updateProfile = (req, res) => {
    const userID = req.body.userID;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    if (!userID || !name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `SELECT * FROM Users WHERE UserID = ?`;

    db.get(query, [userID], (err,row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error Retrieving User"});
        }
        if (!row) {
            return res.status(400).json({ message: "User Not Found"});
        }

            if (password && password.trim() !== "") {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: "Error in Hashing Password"});
                }

                const Updatequery = `UPDATE Users SET Name = ?, Email = ?, Password = ?, Phone = ? WHERE UserID = ?`;
                const params = [name, email, hashedPassword, phone, userID];

                db.run(Updatequery, params, function(err) {
                    if (err) {
                        console.log(err);
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return res.status(400).json({error: 'Email already exists'});
                        }
                        return res.status(500).json({ error: "Error Updating User"});
                    }
                    return res.status(200).json({ message: "User Successfully Updated"});
            });
        });
    } else {
            const query = `UPDATE Users SET Name =?, Email = ?, Phone = ? WHERE UserID = ?`;
            const params = [name, email, phone, userID];

            db.run(query, params, function(err) {
                if (err) {
                    console.log(err);
                    if (err.message.includes('UNIQUE constraints failed')) {
                        return res.status(400).json({ error: 'Email Already Exists'});
                    }
                    return res.status(500).json({ error: "Error Updating User"});
                }
                return res.status(200).json({ message: "User Successfully Updated"});
            });
        }
    });
};

const deleteUser = (req, res) => {
    const userID = req.body.userID;

    if (!userID) {
        return res.status(400).json({ message: "UserID is required"});
    }

    const query = `SELECT * FROM Users WHERE UserID = ?`;

    db.get(query, [userID], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error Deleting User"});
        }
        if (!row) {
            return res.status(400).json({ message: "User Not Found"});
        }

        const deletequery = `DELETE FROM Users WHERE UserID = ?`;

        db.run(deletequery, [userID], function(err){
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Error Deleting User"});
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "User Not Found"});
            }
            return res.status(200).json({ message: "User Successfully Deleted"});
        });
    });
};

const getUserProfile = (req, res) => {
    const userID = req.body.userID;

    if (!userID) {
        return res.status(400).json({ message: "UserID is required"});
    }

    const query = `SELECT UserID, Name, Email, Phone FROM Users WHERE UserID = ?`;

    db.get(query, [userID], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error Retrieving User Profile"});
        }

        if (!row) {
            return res.status(404).json({ message: "User Not Found"});
        }

        return res.status(200).json({ message: "User Profile Retrieved Successfully", profile: row});

    });
}

module.exports ={
    updateProfile,
    deleteUser, 
    getUserProfile
}


        
    
    
    
