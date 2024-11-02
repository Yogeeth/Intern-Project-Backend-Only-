const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Formroutes = require('./routes/formroutes'); // Import the routes
const CLientroutes = require('./routes/clientRoute');
const formifyRoute = require('./routes/formifyRoute');
dotenv.config();
const SECRET_KEY = 'ASDYGK29';
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Replace with your React app URL
  methods: ["GET", "POST","DELETE"], // Allowed methods
  credentials: true // Allow cookies to be sent if needed
}));
app.use(express.json());
// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

  app.get('/check', (req, res) => {
    res.send('Hello, ANALA!');
});
// Use the routes


app.use(bodyParser.json());

// Hardcoded user credentials
const USERNAME = 'yogeeth';
const PASSWORD = 'yogeethgk123456789';

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username,password)
    // Validate credentials
    if (username === USERNAME && password === PASSWORD) {
        // Generate a JWT token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '30m' });
        return res.json({ token });
    }

    // Invalid credentials
    return res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Route
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.username}!` });
});


app.use('/formapi', Formroutes); // Routes will be available under /api/form
app.use('/clientapi', CLientroutes); 
app.use('/formifyapi', formifyRoute); 




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
