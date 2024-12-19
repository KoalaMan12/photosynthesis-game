// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// Game variables
let playerX = canvas.width / 2 - 25;
const playerY = canvas.height - 50;
const playerWidth = 50;
const playerHeight = 50;

let score = 0;
let sunlight = [];
let clouds = [];
let gameSpeed = 2;

// Load player image (tree.png)
const playerImage = new Image();
playerImage.src = "tree.png"; // Path to your image file

// Key controls
let keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Generate sunlight and clouds
function createObject(type) {
  const x = Math.random() * (canvas.width - 30);
  const size = 30;
  return { x, y: -size, size, type };
}

// Draw the player (using image)
function drawPlayer() {
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

// Draw sunlight or clouds
function drawObject(obj) {
  if (obj.type === "sunlight") {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "gray";
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
  }
}

// Collision detection
function checkCollision(obj) {
  return (
    playerX < obj.x + obj.size &&
    playerX + playerWidth > obj.x &&
    playerY < obj.y + obj.size &&
    playerY + playerHeight > obj.y
  );
}

// Update game objects
function updateObjects() {
  if (Math.random() < 0.02) sunlight.push(createObject("sunlight"));
  if (Math.random() < 0.01) clouds.push(createObject("cloud"));

  // Move and check sunlight
  sunlight = sunlight.filter((s) => {
    s.y += gameSpeed;
    if (checkCollision(s)) {
      score += 10;
      document.getElementById("score").innerText = score;
      return false;
    }
    return s.y < canvas.height;
  });

  // Move and check clouds
  clouds = clouds.filter((c) => {
    c.y += gameSpeed;
    if (checkCollision(c)) {
      score -= 10;
      document.getElementById("score").innerText = score;
      return false;
    }
    return c.y < canvas.height;
  });
}

// Player movement
function movePlayer() {
  if (keys["ArrowLeft"] && playerX > 0) playerX -= 5;
  if (keys["ArrowRight"] && playerX < canvas.width - playerWidth) playerX += 5;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  updateObjects();

  sunlight.forEach(drawObject);
  clouds.forEach(drawObject);

  movePlayer();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
