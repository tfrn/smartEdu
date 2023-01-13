const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const registerRoute = require('./routes/registerRoute');

const app = express();
mongoose.set('strictQuery', true);
//template engine
app.set('view engine', 'ejs');

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/smartEdu')
  .then(() => console.log('Connected!'));

// GLOBAL VARIABLE
global.userIN = null;

//middleWares
app.use(express.static('public'));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// bu ikisi req.body için gerekli. (ekspressjs sitesinden req.body diye aranarak bakılabilir.) olmazsa, db'ye post gönderirken sıkıntı çıkar. 
app.use(session({
  secret: 'my_keyboard_keyboard',
  resave: false,
  saveUninitialized: true, // cookie parserına gerek yok.
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/smartEdu' })
}));

app.use(flash());
app.use((req, res, next)=> {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//routes
app.use('*', (req, res, next)=>{
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', registerRoute);

app.get('/contact', (req, res) => {
  res.status(200).render('contact');
});

// port
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
