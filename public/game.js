'use strict';

const statCanvas = document.getElementById('staticCanvas');
const statCtx    = statCanvas.getContext('2d');
const statWidth  = statCanvas.width;
const statHeight = statCanvas.height;
const dynCanvas  = document.getElementById('dynamicCanvas');
const dynCtx     = dynCanvas.getContext('2d');
const dynWidth   = dynCanvas.width;
const dynHeight  = dynCanvas.height;

// display alert if size of staticCanvas not equal to size of dynamicCanvas
if (statWidth != dynWidth || statHeight != dynHeight) alert(`Different width/height of canvases! statWidth = ${statWidth}, dynWidth = ${dynWidth}; statHeight = ${statHeight}, dynHeight = ${dynHeight}`);

const colors           = ['#a30404', '#63534b', '#1e4701'];
const starsSize        = 1;
const asteroidsSize    = 12;
const starsSpeed       = 2;
const asteroidsSpeed   = 3;
const projectilesSpeed = 10;

let numOfYellowStars = 20;
let starsYellow      = [];
let numOfWhiteStars  = 20;
let starsWhite       = [];
let numOfAsteroids1  = 5;
let asteroids1       = [];
let numOfAsteroids2  = 5;
let asteroids2       = [];
let numOfAsteroids3  = 5;
let asteroids3       = [];
let projectiles      = [];
let score            = 0;
let gameOver         = false;
let playerShip = {
  'size'                  : {'x' : 125, 'y' : 50},
  'weaponSize'            : {'x' : 25,  'y' : 50},
  'weaponXCenter'         : 12,
  'projectileSize'        : {'x' : 1,   'y' : 12},
  'projectileColor'       : '#60d60c',
  'platformSize'          : {'x' : 75,  'y' : 25},
  'platformCargoUnitSize' : {'x' : 25,  'y' : 25},
  'platformCargoSpace'    : [false, false, false],
  'platformColor'         : Math.floor(Math.random() * 3)
};

// set playerShip starting position
playerShip.currentPosition = {'x' : Math.floor(dynWidth * 0.5 - playerShip.size.x * 0.5), 'y' : dynHeight - playerShip.size.y};
playerShip.platformColor   = changePlayerShipPlatformColor(playerShip.platformColor);

// fill arrays of stars
for (let i = 0; i < numOfYellowStars; i++) {
  starsYellow.push({'x' : Math.floor(Math.random() * dynWidth), 'y' : Math.floor(Math.random() * dynHeight)});
};
for (let i = 0; i < numOfWhiteStars; i++) {
  starsWhite.push({'x' : Math.floor(Math.random() * dynWidth), 'y' : Math.floor(Math.random() * dynHeight)});
};

// fill arrays of asteroids
for (let i = 0; i < numOfAsteroids1; i++) {
  asteroids1.push({'x' : Math.floor(Math.random() * dynWidth), 'y' : Math.floor(Math.random() * (dynHeight * 0.5)), 'color' : colors[0]});
};
for (let i = 0; i < numOfAsteroids2; i++) {
  asteroids2.push({'x' : Math.floor(Math.random() * dynWidth), 'y' : Math.floor(Math.random() * (dynHeight * 0.5)), 'color' : colors[1]});
};
for (let i = 0; i < numOfAsteroids3; i++) {
  asteroids3.push({'x' : Math.floor(Math.random() * dynWidth), 'y' : Math.floor(Math.random() * (dynHeight * 0.5)), 'color' : colors[2]});
};

// draw staticCanvas background
statCtx.fillStyle = '#000d23';
statCtx.fillRect(0, 0, statWidth, statHeight);

animFrame()

function gameLoop() {
  dynCtx.clearRect(0, 0, dynWidth, dynHeight);
  moveStarsAndAsteroids(starsYellow, starsSpeed);
  moveStarsAndAsteroids(starsWhite, starsSpeed);
  drawStarsAndAsteroids(starsYellow, 'yellow', starsSize);
  drawStarsAndAsteroids(starsWhite, 'white', starsSize);
  moveProjectiles();
  asteroidsProjectilesCollisionDetection();
  drawProjectiles();
  moveStarsAndAsteroids(asteroids1, asteroidsSpeed);
  drawStarsAndAsteroids(asteroids1, asteroids1[0].color, asteroidsSize);
  moveStarsAndAsteroids(asteroids2, asteroidsSpeed);
  drawStarsAndAsteroids(asteroids2, asteroids2[0].color, asteroidsSize);
  moveStarsAndAsteroids(asteroids3, asteroidsSpeed);
  drawStarsAndAsteroids(asteroids3, asteroids3[0].color, asteroidsSize);
  asteroidsPlayerShipCollisionDetection();
  drawPlayerShip();
};

function animFrame(){
  if (gameOver == false) {
    requestAnimationFrame(animFrame, dynCanvas);
    gameLoop();
  } else {
    dynCtx.font = '120px Comic Sans MS';
    dynCtx.fillStyle = 'red';
    dynCtx.fillText('Game Over', Math.floor(dynWidth * 0.5), Math.floor(dynHeight * 0.5));
  };
};

function moveStarsAndAsteroids(starsOrAsteroids, speed) {
  for(let i = 0; i < starsOrAsteroids.length; i++) {
    starsOrAsteroids[i].y += speed;
    if (starsOrAsteroids[i].y > dynHeight) {
      starsOrAsteroids[i].y = 0;
      starsOrAsteroids[i].x = Math.floor(Math.random() * dynWidth);
    };
  };
};

function drawStarsAndAsteroids(starsOrAsteroids, color, size) {
  dynCtx.fillStyle = color;
  for(let i = 0; i < starsOrAsteroids.length; i++) {
    dynCtx.beginPath();
    dynCtx.arc(starsOrAsteroids[i].x, starsOrAsteroids[i].y, size, 0, Math.PI*2, true);
    dynCtx.fill();
  };
};

function drawPlayerShip() {
  dynCtx.fillStyle = '#a8a8a8';
  dynCtx.fillRect(playerShip.currentPosition.x, playerShip.currentPosition.y, playerShip.weaponSize.x, playerShip.weaponSize.y);
  dynCtx.fillRect(playerShip.currentPosition.x + playerShip.size.x - playerShip.weaponSize.x, playerShip.currentPosition.y, playerShip.weaponSize.x, playerShip.weaponSize.y);
  dynCtx.fillStyle = playerShip.platformColor;
  dynCtx.fillRect(playerShip.currentPosition.x + playerShip.weaponSize.x, playerShip.currentPosition.y + playerShip.platformSize.y, playerShip.platformSize.x, playerShip.platformSize.y);
  dynCtx.font = '15px Comic Sans MS';
  dynCtx.fillStyle = 'white';
  dynCtx.textAlign = 'center';
  dynCtx.fillText(score, playerShip.currentPosition.x + Math.floor(playerShip.size.x * 0.5), playerShip.currentPosition.y + playerShip.size.y - 10);
  dynCtx.fillStyle = playerShip.platformColor;
  for(let i = 0; i < playerShip.platformCargoSpace.length; i++) {
    if (playerShip.platformCargoSpace[i]) {
      dynCtx.fillRect(playerShip.currentPosition.x + playerShip.weaponSize.x + playerShip.platformCargoUnitSize.x * i, playerShip.currentPosition.y, playerShip.platformCargoUnitSize.x, playerShip.platformCargoUnitSize.y);
    } else {
      break;
    };
  };
};

function mouseMoved(event) {
  playerShip.currentPosition.x = Math.floor(event.clientX - playerShip.size.x * 0.5);
};

function mouseDown(event) {
    if (event.button == 0) {
    fireLeftWeapon();
  } else if (event.button == 2) {
    fireRightWeapon();
  };
};

function fireLeftWeapon() {
  projectiles.push({'x' : playerShip.currentPosition.x + playerShip.weaponXCenter, 'y' : playerShip.currentPosition.y});
};

function fireRightWeapon() {
  projectiles.push({'x' : playerShip.currentPosition.x + playerShip.size.x - playerShip.weaponXCenter, 'y' : playerShip.currentPosition.y});
};

function moveProjectiles() {
  for(let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].y -= projectilesSpeed;
    if (projectiles[i].y < 0) {
      projectiles.splice(i, 1);
    };
  };
};

function drawProjectiles() {
  dynCtx.fillStyle = playerShip.projectileColor;
  for(let i = 0; i < projectiles.length; i++) {
    dynCtx.fillRect(projectiles[i].x, projectiles[i].y, playerShip.projectileSize.x, playerShip.projectileSize.y);
  };
};

function asteroidsProjectilesCollisionDetection() {
  for (let i = 0; i < asteroids1.length; i++) {
    for (let j = projectiles.length - 1; j >= 0; j--) {
      if (asteroidColidingProjectile(asteroids1[i], projectiles[j])) {
        asteroids1[i].x = Math.floor(Math.random() * dynWidth);
        asteroids1[i].y = 0 - asteroids1[i].y;
        projectiles.splice(j, 1);
      };
    };
  };
  for (let i = 0; i < asteroids2.length; i++) {
    for (let j = projectiles.length - 1; j >= 0; j--) {
      if (asteroidColidingProjectile(asteroids2[i], projectiles[j])) {
        asteroids2[i].x = Math.floor(Math.random() * dynWidth);
        asteroids2[i].y = 0 - asteroids2[i].y;
        projectiles.splice(j, 1);
      };
    };
  };
  for (let i = 0; i < asteroids3.length; i++) {
    for (let j = projectiles.length - 1; j >= 0; j--) {
      if (asteroidColidingProjectile(asteroids3[i], projectiles[j])) {
        asteroids3[i].x = Math.floor(Math.random() * dynWidth);
        asteroids3[i].y = 0 - asteroids3[i].y;
        projectiles.splice(j, 1);
      };
    };
  };
};

function asteroidColidingProjectile(asteroid, projectile) {
  if (
    (asteroid.y + asteroidsSize) >= projectile.y
    && (asteroid.y - asteroidsSize) <= projectile.y
    && (asteroid.x + asteroidsSize) >= projectile.x
    && (asteroid.x - asteroidsSize) <= projectile.x
  ) {
    return true;
  } else {
    return false;
  };
};

function asteroidsPlayerShipCollisionDetection() {
  for (let i = 0; i < asteroids1.length; i++) {
    if (asteroidColidingPlayerShip(asteroids1[i])) {
      if (asteroids1[i].color == playerShip.platformColor) {
        asteroids1[i].x = Math.floor(Math.random() * dynWidth);
        asteroids1[i].y = 0;
        asteroidPlayerShipPlatformSameColor(asteroids1[i])
      } else {
        gameOver = true;
      };
    };
  };
  for (let i = 0; i < asteroids2.length; i++) {
    if (asteroidColidingPlayerShip(asteroids2[i])) {
      if (asteroids2[i].color == playerShip.platformColor) {
        asteroids2[i].x = Math.floor(Math.random() * dynWidth);
        asteroids2[i].y = 0;
        asteroidPlayerShipPlatformSameColor(asteroids2[i])
      } else {
        gameOver = true;
      };
    };
  };
  for (let i = 0; i < asteroids3.length; i++) {
    if (asteroidColidingPlayerShip(asteroids3[i])) {
      if (asteroids3[i].color == playerShip.platformColor) {
        asteroids3[i].x = Math.floor(Math.random() * dynWidth);
        asteroids3[i].y = 0;
        asteroidPlayerShipPlatformSameColor(asteroids3[i])
      } else {
        gameOver = true;
      };
    };
  };
};

function asteroidColidingPlayerShip (asteroid) {
  if (
    asteroid.y >= playerShip.currentPosition.y
    && asteroid.y <= playerShip.currentPosition.y + playerShip.size.y
    && asteroid.x >= playerShip.currentPosition.x
    && asteroid.x <= playerShip.currentPosition.x + playerShip.size.x
  ) {
    return true;
  } else {
    return false;
  };
};

function asteroidPlayerShipPlatformSameColor(asteroid) {
  let j = 0;
  while (playerShip.platformCargoSpace[j]) {
    j++;
  };
  playerShip.platformCargoSpace[j] = true;
  if (playerShip.platformCargoSpace[playerShip.platformCargoSpace.length - 1]) {
    score++;
    for (let m = 0; m < playerShip.platformCargoSpace.length; m++) {
      playerShip.platformCargoSpace[m] = false;
    };
    do {
      playerShip.platformColor = changePlayerShipPlatformColor(Math.floor(Math.random() * 3));
    } while (playerShip.platformColor == asteroid.color);
  };
};

function changePlayerShipPlatformColor(number) {
  switch (number) {
    case 0 : return playerShip.platformColor = colors[0];
    case 1 : return playerShip.platformColor = colors[1];
    case 2 : return playerShip.platformColor = colors[2];
  };
};
