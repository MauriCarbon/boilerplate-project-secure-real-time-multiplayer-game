# Secure Real Time Multiplayer Game

## Overview
This is a FreeCodeCamp Information Security project - a real-time multiplayer game built with Node.js, Express, and Socket.IO. The game uses HTML5 Canvas for rendering and allows multiple players to connect and play simultaneously.

## Project Structure
```
├── public/              # Client-side game files
│   ├── game.mjs        # Main game logic
│   ├── Player.mjs      # Player class definition
│   ├── Collectible.mjs # Collectible items class
│   └── style.css       # Game styling
├── routes/             # Express routes
│   └── fcctesting.js   # FreeCodeCamp testing routes
├── tests/              # Test files
│   ├── 1_unit-tests.js
│   └── 2_functional-tests.js
├── views/              # HTML templates
│   └── index.html      # Main game page
├── server.js           # Express server and Socket.IO setup
└── package.json        # Project dependencies
```

## Technology Stack
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5 Canvas, JavaScript (ES6 modules)
- **Security**: Helmet.js, CORS
- **Testing**: Mocha, Chai

## Environment Setup
The application is configured to run on Replit with:
- **Port**: 5000 (set via environment variable)
- **Host**: 0.0.0.0 (required for Replit)

## Recent Changes (November 25, 2025)
- Configured server to bind to 0.0.0.0:5000 for Replit compatibility
- Set up PORT environment variable (5000)
- Initialized Socket.IO server for real-time multiplayer functionality
- Configured workflow to run the application
- Set up deployment configuration for production (autoscale)

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

## Deployment
The application is configured for autoscale deployment on Replit, which is ideal for this real-time multiplayer game that needs to handle multiple concurrent connections.

## Game Features
This is a boilerplate project where you need to implement:
- Player movement and controls
- Collision detection
- Collectible items
- Player ranking system
- Real-time multiplayer synchronization

## User Preferences
No specific preferences recorded yet.

## Architecture Notes
- The game uses Socket.IO for real-time bidirectional communication between clients and server
- ES6 modules are used on the client side for better code organization
- CORS is enabled to allow connections from the Replit hosting platform
- The server includes FreeCodeCamp testing routes for automated testing
