require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({origin: '*'})); 

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

fccTestingRoutes(app);
    
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

const server = app.listen(portNum, '0.0.0.0', () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket(server);

const canvasWidth = 640;
const canvasHeight = 480;
const playerSize = 30;
const collectibleSize = 15;

let players = {};
let collectible = null;

function generateCollectible() {
  const margin = 20;
  return {
    x: Math.floor(Math.random() * (canvasWidth - 2 * margin - collectibleSize)) + margin,
    y: Math.floor(Math.random() * (canvasHeight - 2 * margin - collectibleSize)) + margin,
    value: Math.floor(Math.random() * 3) + 1,
    id: Date.now()
  };
}

function checkCollision(player, item) {
  if (!player || !item) return false;
  return (
    player.x < item.x + collectibleSize &&
    player.x + playerSize > item.x &&
    player.y < item.y + collectibleSize &&
    player.y + playerSize > item.y
  );
}

collectible = generateCollectible();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  const margin = 20;
  players[socket.id] = {
    x: Math.floor(Math.random() * (canvasWidth - 2 * margin - playerSize)) + margin,
    y: Math.floor(Math.random() * (canvasHeight - 2 * margin - playerSize)) + margin,
    score: 0,
    id: socket.id
  };
  
  socket.emit('init', {
    player: players[socket.id],
    players: players,
    collectible: collectible,
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    playerSize: playerSize,
    collectibleSize: collectibleSize
  });
  
  socket.broadcast.emit('newPlayer', players[socket.id]);
  
  socket.on('move', (data) => {
    if (players[socket.id] && typeof data.x === 'number' && typeof data.y === 'number') {
      let x = Math.max(0, Math.min(canvasWidth - playerSize, data.x));
      let y = Math.max(0, Math.min(canvasHeight - playerSize, data.y));
      
      players[socket.id].x = x;
      players[socket.id].y = y;
      
      io.emit('playerMoved', {
        id: socket.id,
        x: x,
        y: y
      });
      
      if (collectible && checkCollision(players[socket.id], collectible)) {
        players[socket.id].score += collectible.value;
        collectible = generateCollectible();
        
        io.emit('itemCollected', {
          playerId: socket.id,
          newScore: players[socket.id].score,
          newCollectible: collectible,
          players: players
        });
      }
    }
  });
  
  socket.on('collectItem', () => {
    const player = players[socket.id];
    if (player && collectible && checkCollision(player, collectible)) {
      player.score += collectible.value;
      
      collectible = generateCollectible();
      
      io.emit('itemCollected', {
        playerId: socket.id,
        newScore: player.score,
        newCollectible: collectible,
        players: players
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playerLeft', socket.id);
  });
});

module.exports = app;
