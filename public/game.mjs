import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let mainPlayer = null;
let players = {};
let collectible = null;
let canvasWidth = 640;
let canvasHeight = 480;
let playerSize = 30;
let collectibleSize = 15;
const speed = 5;

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];

function getPlayerColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

socket.on('init', (data) => {
  canvasWidth = data.canvasWidth;
  canvasHeight = data.canvasHeight;
  playerSize = data.playerSize;
  collectibleSize = data.collectibleSize;
  
  mainPlayer = new Player(data.player);
  
  for (let id in data.players) {
    players[id] = new Player(data.players[id]);
  }
  
  collectible = new Collectible(data.collectible);
  
  draw();
});

socket.on('newPlayer', (playerData) => {
  players[playerData.id] = new Player(playerData);
  draw();
});

socket.on('playerMoved', (data) => {
  if (players[data.id]) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
  }
  draw();
});

socket.on('itemCollected', (data) => {
  if (players[data.playerId]) {
    players[data.playerId].score = data.newScore;
  }
  
  for (let id in data.players) {
    if (players[id]) {
      players[id].score = data.players[id].score;
    }
  }
  
  if (mainPlayer && mainPlayer.id === data.playerId) {
    mainPlayer.score = data.newScore;
  }
  
  collectible = new Collectible(data.newCollectible);
  draw();
});

socket.on('playerLeft', (id) => {
  delete players[id];
  draw();
});

function draw() {
  context.fillStyle = '#1a1a2e';
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  context.strokeStyle = '#16213e';
  context.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
    context.stroke();
  }
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
    context.stroke();
  }
  
  context.strokeStyle = '#0f3460';
  context.lineWidth = 3;
  context.strokeRect(0, 0, canvasWidth, canvasHeight);
  
  if (collectible) {
    const centerX = collectible.x + collectibleSize / 2;
    const centerY = collectible.y + collectibleSize / 2;
    
    context.beginPath();
    context.moveTo(centerX, collectible.y);
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 4 * Math.PI / 5) - Math.PI / 2;
      const innerAngle = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2;
      context.lineTo(centerX + collectibleSize * 0.6 * Math.cos(outerAngle), centerY + collectibleSize * 0.6 * Math.sin(outerAngle));
      context.lineTo(centerX + collectibleSize * 0.25 * Math.cos(innerAngle), centerY + collectibleSize * 0.25 * Math.sin(innerAngle));
    }
    context.closePath();
    context.fillStyle = '#ffd700';
    context.fill();
    context.strokeStyle = '#ffa500';
    context.lineWidth = 1;
    context.stroke();
    
    context.fillStyle = '#fff';
    context.font = 'bold 10px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(collectible.value, centerX, centerY);
  }
  
  for (let id in players) {
    const player = players[id];
    const isMainPlayer = mainPlayer && id === mainPlayer.id;
    const color = getPlayerColor(id);
    
    context.fillStyle = color;
    context.fillRect(player.x, player.y, playerSize, playerSize);
    
    if (isMainPlayer) {
      context.strokeStyle = '#fff';
      context.lineWidth = 3;
      context.strokeRect(player.x, player.y, playerSize, playerSize);
    }
    
    context.fillStyle = '#fff';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(`${player.score}`, player.x + playerSize / 2, player.y - 5);
  }
  
  if (mainPlayer) {
    const playersArray = Object.values(players);
    const rankText = mainPlayer.calculateRank(playersArray);
    
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(10, 10, 200, 60);
    
    context.fillStyle = '#fff';
    context.font = 'bold 16px Arial';
    context.textAlign = 'left';
    context.fillText(`Score: ${mainPlayer.score}`, 20, 35);
    context.fillText(rankText, 20, 55);
  }
  
  context.fillStyle = '#fff';
  context.font = '12px Arial';
  context.textAlign = 'right';
  context.fillText('Use WASD or Arrow keys to move', canvasWidth - 10, canvasHeight - 10);
}

function handleKeyDown(e) {
  if (!mainPlayer) return;
  
  let direction = null;
  
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      direction = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      direction = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      direction = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      direction = 'right';
      break;
  }
  
  if (direction) {
    e.preventDefault();
    
    mainPlayer.movePlayer(direction, speed);
    
    if (mainPlayer.x < 0) mainPlayer.x = 0;
    if (mainPlayer.x > canvasWidth - playerSize) mainPlayer.x = canvasWidth - playerSize;
    if (mainPlayer.y < 0) mainPlayer.y = 0;
    if (mainPlayer.y > canvasHeight - playerSize) mainPlayer.y = canvasHeight - playerSize;
    
    players[mainPlayer.id].x = mainPlayer.x;
    players[mainPlayer.id].y = mainPlayer.y;
    
    socket.emit('move', { x: mainPlayer.x, y: mainPlayer.y });
    
    if (collectible && mainPlayer.collision(collectible)) {
      socket.emit('collectItem');
    }
    
    draw();
  }
}

document.addEventListener('keydown', handleKeyDown);

draw();
