// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); 

// Require Dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// 1. Load .env early
require('dotenv').config(); 

// (Models and Logger removed for troubleshooting)
const User = require('./models/users'); // Import the Model

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

console.log('--- 🚀 Troubleshooting Startup ---');
console.log('PORT:', PORT);
console.log('DB_URL:', DB_URL ? 'Found' : '❌ NOT FOUND');

if (!DB_URL) {
    console.error('❌ FATAL ERROR: DB_URL is missing in your .env file!');
    process.exit(1);
}

// 2. Mongoose Connection
// Add the dbName option to your connection
mongoose.connect(process.env.DB_URL, {
    dbName: 'KTEM' 
})
.then(() => console.log('✅ Connected to KTEM Database'))
.catch(err => console.error(err));

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use('/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/projects', require('./routes/projectsroutes'));
// 3. Simple Test Route (Replaces external routes)
app.get('/', (req, res) => {
    res.json({ status: true, message: 'Server is running without routes/auth' });
});

// Error Handling
app.use(errorHandler());

app.use('*', (req, res) => {
    res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

app.listen(PORT, () => {
    console.info('✅ Express server is live on port', PORT);
});

