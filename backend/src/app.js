//create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://feast-feed.vercel.app/'] // Replace with your actual Vercel URL
      : 'http://localhost:5173',         // Local Vite dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foodpartner', foodPartnerRoutes);

module.exports = app;
