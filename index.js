const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const databaseConnection  = require('./db.js');
const userRoute = require('./router/userroute.js');
const dairyRoute = require('./router/dairyroute.js');
const isAuth = require('./middleware/auth.js');

dotenv.config();

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
databaseConnection();

// Routes
app.use('/', userRoute);
app.use('/dairy', isAuth, dairyRoute);

app.get('/', (req, res) => {
    res.send('Hello !!! This is success message from Dairy Management Server');
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});