const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');


const postsRoutes = require('./routes/posts');
const app = express();


// below is the connection initiation to the mongodb cloud server.
// need to get the string from cloud and update password and database name such as node-express.
mongoose.connect("mongodb+srv://express:9KxIrGLzSLURDvrb@cluster0.2co9a.mongodb.net/node-angular?retryWrites=true&w=majority").then( () => {
  console.log('Connected to the database!');
}).catch( () => {
  console.log('Connected Error');
});


app.use(bodyParser.json()); //parse incoming data into json object
app.use(bodyParser.urlencoded({extended: false}));

app.use("/images", express.static(path.join("backend/images")));


app.use( (req, res, next) => {
  console.log("first middleare");
  next(); // to pass down to the next middleware
});

app.use(  (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT,PATCH, DELETE, OPTIONS");
  res.setHeader('Access-Control-Allow-headers', 'Content-Type');

  next();
});
// 9KxIrGLzSLURDvrb

app.use("/api/posts"  , postsRoutes); //urls starts with /api/posts will be forwareded to the postsRoute file.


module.exports = app;
