
let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 4, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 9, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 9, 1],
  [1, 0, 9, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const image = new Image()
image.src = './texturpack3.png'

const heightView = window.innerHeight
const widthView = window.innerWidth

const viewCanvas = document.getElementById('canvas')
viewCanvas.width = widthView
viewCanvas.height = heightView

const viewCtx = viewCanvas.getContext('2d')

function calculateBonuses(array) {
  let cnt = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] == 9) {
        ++cnt;
      }
    }
  }
  return cnt;
}

const coins = calculateBonuses(map)

function drawBlock(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 32, 0, 32, 32, x, y, size, size)
}

function drawEmpty(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 0, 0, 32, 32, x, y, size, size)
}

function drawDoor(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 0, 4 * 32, 32, 32, x, y, size, size)
}

function drawPlayer(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 0, 2 * 32, 32, 32, x, y, size, size)
}

function drawBonus(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 0, 3 * 32, 32, 32, x, y, size, size)
}

function drawMonster(textures, ctx, x, y, size) {
  ctx.drawImage(textures, 0, 6 * 32, 32, 32, x, y, size, size)
}

const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 500

const ctx = canvas.getContext('2d')
const blockSize = 50

let playerX = 3
let playerY = 1
let coinsFound = 0

let keyCode = 0

function findPath(map, fromX, fromY, toX, toY) {
  let helpArray = [];
  for (let i = 0; i < map.length; i++) {
    helpArray.push([])
    for (let j = 0; j < map[i].length; j++) {
      helpArray[i].push(-1)
    }
  }
  let phase = 0
  helpArray[fromX][fromY] = phase
  while (helpArray[toX][toY] == -1) {
    for (let i = 1; i < map.length - 1; i++) {
      for (let j = 1; j < map[i].length - 1; j++) {
        if (helpArray[i][j] == phase) {
          if (map[i + 1][j] != 1 && helpArray[i + 1][j] == -1) {
            helpArray[i + 1][j] = phase + 1
          }
          if (map[i - 1][j] != 1 && helpArray[i - 1][j] == -1) {
            helpArray[i - 1][j] = phase + 1
          }
          if (map[i][j + 1] != 1 && helpArray[i][j + 1] == -1) {
            helpArray[i][j + 1] = phase + 1
          }
          if (map[i][j - 1] != 1 && helpArray[i][j - 1] == -1) {
            helpArray[i][j - 1] = phase + 1
          }
        }
      }
    }
    //alert(helpArray)
    phase += 1
  }
  let way = []
  let x = toX
  let y = toY
  
  way.push({x: toX, y: toY})
  for (let i = 0; i < helpArray[toX][toY]; ++i) {
    if (helpArray[x + 1][y] == helpArray[toX][toY] - i - 1) {
      x++
      way.push({x: x, y: y})
    }
    else if (helpArray[x - 1][y] == helpArray[toX][toY] - i - 1) {
      x--
      way.push({x: x, y: y})
    }
    else if (helpArray[x][y - 1] == helpArray[toX][toY] - i - 1) {
      y--
      way.push({x: x, y: y})
    }
    else if (helpArray[x][y + 1] == helpArray[toX][toY] - i - 1) {
      y++
      way.push({x: x, y: y})
    }
  }

  return way
}

let monsters = [
{
  x: 1,
  y: 7,
  vx: 1,
  vy: 0
},
/*
{
  x: 3,
  y: 4,
  vx: 0,
  vy: 1
} */
]

function checkWinLose() {
  if (map[playerX][playerY] == 9) {
    ++coinsFound;
    map[playerX][playerY] = 0
  }
  if (map[playerX][playerY] == 4 && coinsFound == coins) {
    alert("You win batya!")
    window.location.reload()
  }

  for (let i = 0; i < monsters.length; ++i) {
    if (playerX == monsters[i].x && playerY == monsters[i].y) {
      alert("You lose, you not batya!")
      window.location.reload()
    }
  }
}

checkWinLose()

function draw() {
  for (let i = 0; i < map.length; ++i) {
    for (let j = 0; j < map[i].length; ++j) {
      if (map[i][j] == 1) {
        drawBlock(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
      }
      if (map[i][j] == 0) {
        drawEmpty(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
      }
      if (map[i][j] == 4 && coinsFound == coins) {
        drawDoor(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
      }
      if (map[i][j] == 4 && coinsFound != coins) {
        drawEmpty(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
      }
      if (map[i][j] == 9) {
        drawEmpty(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
        drawBonus(image, ctx, i * blockSize, j * blockSize, blockSize, blockSize)
      }
    }
  }

  drawPlayer(image, ctx, playerX * blockSize, playerY * blockSize, blockSize, blockSize)
  for (let monster of monsters) {
    let way = findPath(map, monster.x, monster.y, playerX, playerY)
    ctx.fillStyle = "red"
    for (dot of way) {
      ctx.fillRect(dot.x * blockSize, dot.y * blockSize, 10, 10)
    }
    drawMonster(image, ctx, monster.x * blockSize, monster.y * blockSize, blockSize, blockSize)
  }

  const newSize = Math.min(viewCanvas.height, viewCanvas.width)
  let x = 0
  if (newSize < viewCanvas.width) {
    x = (viewCanvas.width - newSize) / 2
  }
  viewCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, 0, newSize, newSize)
  requestAnimationFrame(draw)
}

window.addEventListener('keydown', (evt) => {
  keyCode = evt.keyCode
})

function stepMonster(monster) {
  let way = findPath(map, monster.x, monster.y, playerX, playerY)
  monster.x = way[way.length - 2].x
  monster.y = way[way.length - 2].y 
  /*
  if (map[monster.x + monster.vx][monster.y + monster.vy] == 1) {
    monster.vx = -monster.vx
    monster.vy = -monster.vy
  }
  monster.x += monster.vx
  monster.y += monster.vy */
}

function stepPlayerIfNeed() {
  let prevPosX = playerX
  let prevPosY = playerY

  switch (keyCode) {
    case 87: // up
      --playerY
      break;
    case 83: // down
      ++playerY
      break;
    case 68: // right
      ++playerX
      break;
    case 65: // left
      --playerX
      break;
    default:
  }
  keyCode = 0
  if (map[playerX][playerY] == 1) {
    playerX = prevPosX
    playerY = prevPosY
  }
}


let c = 0
setInterval(() => {
  stepPlayerIfNeed()
  c++
  if (c == 12) {
    for (let monster of monsters) {
      stepMonster(monster)
    }
    c = 0
  }

  checkWinLose() // проверка коллизий
}, 1000/24)

image.onload = () => {
  draw()
}