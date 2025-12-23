//start server
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 3000;

// connectDB();

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running smoothly on port ${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed", err);
});