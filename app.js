var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
require("dotenv").config();
var compression = require('compression')
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var cors = require("cors");
const httpServer = require("http").createServer(app);
const options = { cors: { origin: "*" } };
const io = require("socket.io")(httpServer, options);
const { Game, User, Player, Deck } = require("./models");



const routes = require("./controllers");
const sequelize = require("./config/connection");
const router = require('./controllers/api/user-routes');

var app = express();

// app.use(cors({
//   origin: ["http://localhost:3000/"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 3600000
  }
};

app.use(session(sess));

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
// app.use(express.static(path.join(__dirname, '/client')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(routes);
app.use(compression());
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

io.on("connection", socket => {
  const gameID = socket.handshake.query.gameID;
  socket.join(gameID)
  console.log("game ID: " + gameID)
  socket.on("welcome", () => {
    console.log("hello");
  });

  socket.on("round", async () => {
    const gameData = await Game.findOne({
      where: { id: gameID }
    })
    const formatData = await JSON.parse(JSON.stringify(gameData))
    const playerLobby = await Player.findAll({
      where: { game_id: gameID }
    })
    const lobby = await JSON.parse(JSON.stringify(playerLobby));
    const playerNames = []
    lobby.forEach(element => {
      playerNames.push(element.username)
    })
    socket.broadcast.emit('receive-round', {
      formatData, playerNames
    })
    socket.emit('receive-round', {
      formatData, playerNames
    })
  })

  socket.on("deck", async () => {
    const deckData = await Deck.findOne({
      where: { game_id: gameID }
    });
    const deck = await JSON.parse(JSON.stringify(deckData));
    socket.broadcast.emit('receive-deck', {
      deck
    })
    socket.emit('receive-deck', {
      deck
    })
  })
});
httpServer.listen(3002);
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('Oh no')) //handle error
  }
  next() //otherwise continue
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("running server");
  });
})

module.exports = app;
