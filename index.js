const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const Formroutes = require('./routes/formroutes'); 
const CLientroutes = require('./routes/clientRoute');
const formifyRoute = require('./routes/formifyRoute');

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'ASDYGK29'; // Use environment variable for secret key

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's URL in production
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(compression());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Failed to connect to MongoDB:", process.env.MONGODB_URI,process.env.PORT,err));

  app.get('/check', (req, res) => {
    res.send('Hello, ANALA!');
});

const USERNAME = 'yogeeth';
const PASSWORD = 'yogeethgk123456789';

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '30m' });
    return res.json({ token });
  }
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

// Use routes for different APIs
app.use('/formapi', Formroutes); 
app.use('/clientapi', CLientroutes); 
app.use('/formifyapi', formifyRoute);

// Export the app for serverless deployment
module.exports = app;
