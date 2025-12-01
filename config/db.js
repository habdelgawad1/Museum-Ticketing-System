const sqlite = require('sqlite3');
const db = new sqlite.Database('museum.db');

const CreateUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL,
        Phone TEXT NOT NULL,
        Role TEXT NOT NULL CHECK (ROLE IN ('admin', 'guide', 'visitor')),
        Points INTEGER DEFAULT 0)`;

const CreateToursTable = `
    CREATE TABLE IF NOT EXISTS Tours (
        TourID INTEGER PRIMARY KEY AUTOINCREMENT,
        GuideID INTEGER NOT NULL,
        Title TEXT NOT NULL,
        Description TEXT,
        StartTime DATETIME NOT NULL,
        EndTime DATETIME NOT NULL,
        Date DATETIME NOT NULL, 
        MaxParticipants INTEGER NOT NULL,
        AvailableSpots INTEGER NOT NULL,
        Price REAL NOT NULL,
        Language TEXT NOT NULL,
        TourStatus TEXT NOT NULL CHECK (TourStatus IN ('scheduled', 'ongoing', 'completed', 'canceled')))`;

const CreateBookingsTable = `
    CREATE TABLE IF NOT EXISTS Bookings (
        BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        TourID INTEGER NOT NULL,
        NumberOfTickets INTEGER NOT NULL,
        BookingStatus TEXT NOT NULL CHECK (BookingStatus IN ('confirmed', 'canceled', 'completed')))`;

const CreateReviewsTable = `
    CREATE TABLE IF NOT EXISTS Reviews (
        ReviewID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INTEGER NOT NULL,
        TourID INTEGER NOT NULL,
        BookingID INTEGER NOT NULL,
        Rating INTEGER NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment TEXT)`;

module.exports = {
    db,
    CreateUsersTable,
    CreateToursTable,
    CreateBookingsTable,
    CreateReviewsTable
};


