const express = require('express');
const ejs = require("ejs")

const app = express();

//template engine
app.set("view engine", "ejs");

//middleWares

app.use(express.static("public"))

//routes
app.get('/', (req, res) => {
  res.status(200).render('index', {
    page_name : "index" // navigasyondaki aktif sayfa için  
  });
});

app.get('/about', (req, res) => {
  res.status(200).render('about', {
    page_name : "about" // navigasyondaki aktif sayfa için  
  });
});
app.get('/contact', (req, res) => {
  res.status(200).render('contact');
});


const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
