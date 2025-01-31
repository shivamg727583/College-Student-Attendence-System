require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/mongoose-config');

const app = express();

// ✅ Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend (React) to make requests
  credentials: true, // Allow cookies & authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Session & Flash messages
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Routes
const adminRoute = require('./routes/adminRoutes');
const teacherRoute = require('./routes/teacherRoutes');
const subjectRoute = require('./routes/subjectRoutes');
const classRoute = require('./routes/classRoutes');
const studentRoute = require('./routes/Students');

app.use('/api/admin', adminRoute);
app.use('/api/teachers', teacherRoute);
app.use('/api/subjects', subjectRoute);
app.use('/api/class', classRoute);
app.use('/api/students', studentRoute);

// Default Route
app.get('/', (req, res) => {
  res.render('index');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
