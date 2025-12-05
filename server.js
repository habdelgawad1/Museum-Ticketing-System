const app = require('./index.js');
const PORT = process.env.PORT
const db_access = require('./config/db.js');
const db = db_access.db;
const logger = require('./utils/logger.js');

db.serialize(() => {
    db.run(db_access.CreateUsersTable, (err) => {
        if (err) logger.log("Users table creation error: " + err.message);
    });
    db.run(db_access.CreateToursTable, (err) => {
        if (err) logger.log("Tours table creation error: " + err.message);
    });
    db.run(db_access.CreateBookingsTable, (err) => {
        if (err) logger.log("Bookings table creation error: " + err.message);
    });
    db.run(db_access.CreateReviewsTable, (err) => {
        if (err) logger.log("Reviews table creation error: " + err.message);
    });
});

app.listen(PORT, () => {
    logger.log(`Server is running on port ${PORT}`);
});