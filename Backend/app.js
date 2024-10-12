require('dotenv').config();
const express = require('express');
const app = express();
const path=require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose-config');
const flash = require('connect-flash');
const session = require('express-session');

const adminRoute = require('./routes/adminRoutes');
const teacherRoute = require('./routes/teacherRoutes')
const subjectRoute = require('./routes/subjectRoutes')
const classRoute = require('./routes/classRoutes');
const studentRoute = require('./routes/StudentRoutes')


app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set('view engine','ejs');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());


app.use('/api/admin',adminRoute);
app.use('/api/teachers',teacherRoute)
app.use('/api/subjects',subjectRoute)
app.use('/api/class',classRoute)
app.use('/api/students',studentRoute)


app.get('/', function (req, res) {
  res.render('index');
});


app.listen(3000,function(){
console.log('server is running on port 3000');
});






