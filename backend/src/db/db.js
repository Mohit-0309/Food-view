const mongoose = require('mongoose');

function connectDB() {
    // Add 'return' right here
    return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err.message);
        process.exit(1); // Exit if DB connection fails
    });
}

module.exports = connectDB;