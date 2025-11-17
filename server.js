const app = require('./index.js');
const PORT = process.env.PORT
const db_access = require('./config/db.js');
const db = db_access.db;

db.serialize(() => {
    db.run(db_access.CreateUsersTable, (err) => {
        if (err) console.log("Users table creation error: ", err.message);
    });
    db.run(db_access.CreateToursTable, (err) => {
        if (err) console.log("Bookings table creation error: ", err.message);
    });
    db.run(db_access.CreateBookingsTable, (err) => {
        if (err) console.log("Tours table creation error: ", err.message);
    });
    db.run(db_access.CreateReviewsTable, (err) => {
        if (err) console.log("Reviews table creation error: ", err.message);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});