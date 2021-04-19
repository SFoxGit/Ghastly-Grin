var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
require("dotenv").config();
var compression = require('compression')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const httpServer = require("http").createServer(app);
const options = { cors: { origin: "*" } };
const io = require("socket.io")(httpServer, options);


const routes = require("./controllers");
const sequelize = require("./config/connection");

var app = express();

const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sess));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use(compression());
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err});
});

io.on("connection", socket => {
  console.log(socket.id);
  socket.on("welcome", () => {
    console.log("hello");
  })
});

sequelize.sync({ force: false }).then(() => {
  httpServer.listen(PORT);
})

module.exports = app;
