// Demo games for first-time users

import { Game } from './types';
import { generateId } from './storage';

// Simple HTML5 game examples
const demoHTML1 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Clicker</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
            color: white;
        }
        .game-container {
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .score {
            font-size: 2rem;
            margin-bottom: 30px;
        }
        .click-box {
            width: 200px;
            height: 200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: transform 0.1s;
            font-size: 3rem;
        }
        .click-box:hover {
            transform: scale(1.05);
        }
        .click-box:active {
            transform: scale(0.95);
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Color Clicker</h1>
        <div class="score">Score: <span id="score">0</span></div>
        <div class="click-box" id="clickBox">🎨</div>
    </div>
    <script>
        let score = 0;
        const scoreElement = document.getElementById('score');
        const clickBox = document.getElementById('clickBox');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];
        
        clickBox.addEventListener('click', () => {
            score++;
            scoreElement.textContent = score;
            clickBox.style.background = colors[Math.floor(Math.random() * colors.length)];
        });
    </script>
</body>
</html>`;

const demoHTML2 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Match</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            font-family: Arial, sans-serif;
        }
        .game-container {
            text-align: center;
        }
        h1 {
            color: white;
            margin-bottom: 20px;
        }
        .stats {
            color: white;
            margin-bottom: 20px;
            font-size: 1.2rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(4, 100px);
            gap: 10px;
            margin: 0 auto;
        }
        .card {
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3rem;
            transition: transform 0.3s;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .card.flipped {
            background: white;
        }
        .card.matched {
            background: #4ade80;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>🧠 Memory Match</h1>
        <div class="stats">
            <span>Moves: <span id="moves">0</span></span> | 
            <span>Matches: <span id="matches">0</span></span>
        </div>
        <div class="grid" id="grid"></div>
    </div>
    <script>
        const emojis = ['🎮', '🎨', '🎭', '🎪', '🎬', '🎸', '🎯', '🎲'];
        const cards = [...emojis, ...emojis];
        let flipped = [];
        let moves = 0;
        let matches = 0;
        
        function shuffle(array) {
            return array.sort(() => Math.random() - 0.5);
        }
        
        function createBoard() {
            const grid = document.getElementById('grid');
            shuffle(cards).forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.emoji = emoji;
                card.dataset.index = index;
                card.addEventListener('click', flipCard);
                grid.appendChild(card);
            });
        }
        
        function flipCard() {
            if (flipped.length === 2) return;
            if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
            
            this.textContent = this.dataset.emoji;
            this.classList.add('flipped');
            flipped.push(this);
            
            if (flipped.length === 2) {
                moves++;
                document.getElementById('moves').textContent = moves;
                setTimeout(checkMatch, 500);
            }
        }
        
        function checkMatch() {
            const [card1, card2] = flipped;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matches++;
                document.getElementById('matches').textContent = matches;
                if (matches === emojis.length) {
                    setTimeout(() => alert(\`You won in \${moves} moves!\`), 300);
                }
            } else {
                card1.textContent = '';
                card2.textContent = '';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            flipped = [];
        }
        
        createBoard();
    </script>
</body>
</html>`;

const demoHTML3 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reaction Time</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
            font-family: Arial, sans-serif;
            color: white;
        }
        .game-container {
            text-align: center;
            padding: 40px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .instruction {
            font-size: 1.2rem;
            margin-bottom: 30px;
            color: #a8dadc;
        }
        .game-area {
            width: 400px;
            height: 400px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin: 0 auto 20px;
            transition: background 0.3s;
        }
        .game-area.ready {
            background: #e74c3c;
        }
        .game-area.go {
            background: #2ecc71;
        }
        .result {
            font-size: 1.5rem;
            min-height: 30px;
            color: #f1c40f;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>⚡ Reaction Time Test</h1>
        <div class="instruction">Click when the box turns GREEN!</div>
        <div class="game-area" id="gameArea">
            <span id="message">Click to Start</span>
        </div>
        <div class="result" id="result"></div>
    </div>
    <script>
        const gameArea = document.getElementById('gameArea');
        const message = document.getElementById('message');
        const result = document.getElementById('result');
        let startTime;
        let timeout;
        
        gameArea.addEventListener('click', function() {
            if (gameArea.classList.contains('go')) {
                const reactionTime = Date.now() - startTime;
                gameArea.classList.remove('go');
                message.textContent = 'Click to Start';
                result.textContent = \`Your reaction time: \${reactionTime}ms\`;
                clearTimeout(timeout);
            } else if (gameArea.classList.contains('ready')) {
                result.textContent = 'Too early! Wait for green.';
                gameArea.classList.remove('ready');
                message.textContent = 'Click to Start';
                clearTimeout(timeout);
            } else {
                startGame();
            }
        });
        
        function startGame() {
            result.textContent = '';
            message.textContent = 'Wait...';
            gameArea.classList.add('ready');
            
            const delay = Math.random() * 3000 + 2000;
            timeout = setTimeout(() => {
                gameArea.classList.remove('ready');
                gameArea.classList.add('go');
                message.textContent = 'CLICK NOW!';
                startTime = Date.now();
            }, delay);
        }
    </script>
</body>
</html>`;

export const demoGames: Game[] = [
  {
    id: generateId(),
    title: 'Color Clicker',
    description: 'A simple and satisfying color clicking game. Test your speed!',
    category: 'arcade',
    isFavorite: false,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    files: [
      {
        id: generateId(),
        name: 'color-clicker.html',
        type: 'html',
        content: demoHTML1,
        size: demoHTML1.length,
        uploadedAt: Date.now()
      }
    ]
  },
  {
    id: generateId(),
    title: 'Memory Match',
    description: 'Classic memory card matching game with emojis. Train your brain!',
    category: 'puzzle',
    isFavorite: false,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    files: [
      {
        id: generateId(),
        name: 'memory-match.html',
        type: 'html',
        content: demoHTML2,
        size: demoHTML2.length,
        uploadedAt: Date.now()
      }
    ]
  },
  {
    id: generateId(),
    title: 'Reaction Time Test',
    description: 'Test your reaction speed. How fast can you click when it turns green?',
    category: 'action',
    isFavorite: true,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    lastPlayed: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    files: [
      {
        id: generateId(),
        name: 'reaction-time.html',
        type: 'html',
        content: demoHTML3,
        size: demoHTML3.length,
        uploadedAt: Date.now()
      }
    ]
  }
];

// Initialize demo games if storage is empty
export function initializeDemoGames(): void {
  const stored = localStorage.getItem('game-library-data');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('game-library-data', JSON.stringify(demoGames));
  }
}
