# Secure Real Time Multiplayer Game

## Overview
This is a FreeCodeCamp Information Security project - a secure real-time multiplayer game built with Node.js, Express, and Socket.IO. The game uses HTML5 Canvas for rendering and allows multiple players to connect and play simultaneously. Players move their avatars to collect items and compete for the highest score.

## Project Structure
```
├── public/              # Client-side game files
│   ├── game.mjs        # Main game logic with canvas rendering
│   ├── Player.mjs      # Player class with movement, collision, and ranking
│   ├── Collectible.mjs # Collectible items class
│   └── style.css       # Game styling
├── routes/             # Express routes
│   └── fcctesting.js   # FreeCodeCamp testing routes
├── tests/              # Test files
│   ├── 1_unit-tests.js # Unit tests for Player and Collectible classes
│   └── 2_functional-tests.js # Functional tests for security headers
├── views/              # HTML templates
│   └── index.html      # Main game page with canvas
├── server.js           # Express server with Socket.IO and security middleware
└── package.json        # Project dependencies
```

## Technology Stack
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5 Canvas, JavaScript (ES6 modules)
- **Security**: Helmet.js v3.21.3
- **Testing**: Mocha, Chai

## Security Features
The game implements the following security measures using Helmet.js:
- **MIME Type Sniffing Prevention**: `X-Content-Type-Options: nosniff`
- **XSS Protection**: `X-Xss-Protection: 1; mode=block`
- **No Caching**: Surrogate-Control, Cache-Control, Pragma, Expires headers
- **Custom X-Powered-By**: Set to `PHP 7.4.3` to obfuscate server technology
- **Server-side Collision Validation**: Prevents cheating by validating all game actions on the server

## Game Features
- **Multiplayer**: Multiple players can connect and play simultaneously
- **Player Movement**: Use WASD or Arrow keys to move your avatar
- **Collectible Items**: Star-shaped items with random values (1-3 points)
- **Score Tracking**: Each player's score is displayed above their avatar
- **Player Ranking**: Real-time ranking system (Rank: X/Y format)
- **Collision Detection**: Server-side validation to prevent cheating
- **Visual Feedback**: Players have different colors, your player has a white border

## Environment Setup
The application is configured to run on Replit with:
- **Port**: 5000 (set via environment variable)
- **Host**: 0.0.0.0 (required for Replit)

## Recent Changes (November 25, 2025)
- Implemented all security headers with Helmet.js v3.21.3
- Created Player class with movePlayer, collision, and calculateRank methods
- Created Collectible class with x, y, value, and id properties
- Implemented complete game canvas rendering with grid background
- Added Socket.IO multiplayer synchronization
- Implemented server-side collision validation to prevent cheating
- Added bounds validation for player movement
- All 11 tests passing (7 unit tests + 4 functional tests)

## Development
To run the application locally:
```bash
npm install
npm start
```

The application will be available at http://localhost:5000

## Testing
Run tests with:
```bash
npm test
```

All tests should pass:
- 7 Unit Tests (Collectible and Player classes)
- 4 Functional Tests (Security headers)

## Deployment
The application is configured for autoscale deployment on Replit.

## User Preferences
No specific preferences recorded yet.

## Architecture Notes
- The game uses Socket.IO for real-time bidirectional communication
- ES6 modules are used on the client side for better code organization
- CORS is enabled to allow connections from the Replit hosting platform
- Server-side validation ensures game integrity and prevents cheating
- All player positions and scores are managed authoritatively on the server
