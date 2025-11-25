class Player {
  constructor({x, y, score = 0, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch(dir) {
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
      case 'left':
        this.x -= speed;
        break;
      case 'right':
        this.x += speed;
        break;
    }
  }

  collision(item) {
    const playerWidth = 30;
    const playerHeight = 30;
    const itemWidth = 15;
    const itemHeight = 15;
    
    return (
      this.x < item.x + itemWidth &&
      this.x + playerWidth > item.x &&
      this.y < item.y + itemHeight &&
      this.y + playerHeight > item.y
    );
  }

  calculateRank(arr) {
    const sorted = [...arr].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex(p => p.id === this.id) + 1;
    return `Rank: ${rank}/${arr.length}`;
  }
}

try {
  module.exports = Player;
} catch(e) {}

export default Player;
