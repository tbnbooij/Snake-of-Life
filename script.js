let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

const gridColor = "black"
const snakeColor = "#00c645"
const dotColor = "white"
const border = 2
let dead = false

let init = true

const size = 31
const side = canvas.width / size

let dir = "s"

let grid = []
let snake = []

const rel = [[0,1], [1,0], [1,1], [0,-1], [-1,0], [-1,1], [1,-1], [-1,-1]]


for (let i = 0; i < size; i++) {
  let row = []
  for (let j = 0; j < size; j++) {
    row.push(false)
  }
  grid.push(row)
}

let center = Math.round(size / 2 - 1)
let dot = [-1, -1]
for (let i = 0; i < Math.round(size / 3); i++) {
  grid[center - i][center] = true;
  snake.push([center - i, center])
}



function drawGrid() {
  ctx.fillStyle = gridColor
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      ctx.fillRect(side * j + border, side * i + border, side - border, side - border)
    }
  }
  drawSnake()
}

function drawSnake() {
  ctx.fillStyle = snakeColor
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(side * snake[i][1], side * snake[i][0], side - border, side - border)
  }
  setTimeout(nextStep, 1000 / 10);
}


function nextStep() {
  if (init) {
    genDot();
    init = false;
  };
  let head = snake[0]

  let x = head[0]
  let y = head[1]

  ctx.fillStyle = gridColor
  let tail = snake[snake.length - 1]
  ctx.fillRect(side * tail[1] - border, side * tail[0] - border, side + border, side + border)
  snake.pop()
  switch (dir) {
    case "s":
      snake.unshift([x + 1, y])
      break;
    case "n":
      snake.unshift([x - 1, y])
      break;
    case "e":
      snake.unshift([x, y + 1])
      break;
    case "w":
      snake.unshift([x, y - 1])
      break;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0][0] === snake[i][0]) {
      if (snake[0][1] === snake[i][1]) {
        dead = true
      }
    }
    if ((snake[0][0] > size - 1) || (snake[0][1] > size - 1) || (snake[0][0] < 0) || (snake[0][1] < 0)) {
      dead = true
    }
    if (snake[0][0] === dot[0] && snake[0][1] === dot[1]) {
      switch (dir) {
        case "s":
          snake.unshift([x + 1, y])
          break;
        case "n":
          snake.unshift([x - 1, y])
          break;
        case "e":
          snake.unshift([x, y + 1])
          break;
        case "w":
          snake.unshift([x, y - 1])
          break;
      }
      genDot()
    }

  }
  if (!dead) {
    drawSnake();
  }
  else {
    copyToGrid();
  }
}

function copyToGrid() {
  for(let i = 1; i < snake.length; i++) {
    grid[snake[i][1]][snake[i][0]] = true;
  }
  ctx.fillRect(side * dot[1] - border, side * dot[0] - border, side + border, side + border)
  nextGen();
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function nextGen() {
  let newGrid = []
  last_grid = []
  for(var i = 0; i < size; i++) {
    let a_row = []
    for(var j = 0; j < size; j++) {
      a_row.push(grid[i][j])
    }
    last_grid.push(a_row)
  }
  for(var i = 0; i < size; i++) {
    let newRow = []
    for(var j = 0; j < size; j++) {
      let z = 0
      for(var k = 0; k < rel.length; k++) {
        if(grid[mod(i+rel[k][0], size)][mod(j+rel[k][1], size)]) {
          z++
        }
      }
      if(grid[i][j]) {
        if(z === 3 || z === 2) {
          newRow.push(true)
        }
        else {
          newRow.push(false)
        }
      }
      else {
        if(z === 3) {
          newRow.push(true)
        }
        else {
          newRow.push(false)
        }
      }
    }
    newGrid.push(newRow)
  }
  for(var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      grid[i][j] = newGrid[i][j]
    }
  }
  printGrid(last_grid)
}

function paintCell(i, j) {
  let x = i * side, y = j * side
  if(grid[i][j]) {
    ctx.fillStyle = snakeColor
    ctx.fillRect(x, y, side - border, side - border)
  }
  else {
    ctx.fillStyle = gridColor
    ctx.fillRect(x - border, y - border, side + border, side + border)
  }

}

function printGrid(last_grid) {
  for(var i = 0; i < size; i++) {
    for(var j = 0; j < size; j++) {
      if(last_grid.length !== 0) {
        if(last_grid[i][j] !== grid[i][j]) {
          paintCell(i,j)
        }
      }
      else {
        paintCell(i,j)
      }
    }
  }
  setTimeout(nextGen, 1000/15)
}

function genDot() {
  let sat = false

  while (!sat) {
    var x = Math.floor(Math.random() * size)-1;
    var y = Math.floor(Math.random() * size)-1;

    for (let i = 0; i < snake.length; i++) {
      let cell = snake[i];
      if (cell[0] !== x && cell[1] !== y) {
        dot[0] = x
        dot[1] = y
        sat = true
      }
    }
  }

  ctx.fillStyle = dotColor
  ctx.fillRect(side * dot[1] + border * 1.25, side * dot[0] + border * 1.25, side * 0.75, side * 0.75)

}

drawGrid()

window.addEventListener("keydown", (e) => {
	let head = snake[0]
  let neck = snake[1]
  switch (e.keyCode) {
    case 39:
    case 68:
    	if(head[1] + 1 !== neck[1]) {
      	dir = "e"
      }
      break
    case 38:
    case 87:
    	if(head[0] - 1 !== neck[0]) {
      	dir = "n"
      }
      break
    case 37:
    case 65:
      if(head[1] - 1 !== neck[1]) {
      	dir = "w"
      }
      break
    case 40:
    case 83:
      if(head[0] + 1 !== neck[0]) {
      	dir = "s"
      }
      break
  }
})
