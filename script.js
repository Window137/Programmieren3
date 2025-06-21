/*
Instructions:
mouse click- Toggle cell
keyboard press - start simulation

*/

//start settings

class EmptyBeing {
    constructor() {
        this.color = '#505050'
    }

    nextStep(x, y, grid) {
        return grid
    }
}

class Grass {
    constructor(energy = Math.floor(Math.random() * 3)) {
        this.energy = energy    
        this.color = '#00FF00'
    }

    nextStep(x, y, grid) {
        this.energy += 1
        if (this.energy >= 7) {
            const emptyNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof EmptyBeing)
            const waterNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof Water)
            const wallNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof Wall)

            if (emptyNeighbours.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyNeighbours.length)
                const randomNeighbour = emptyNeighbours[randomIndex]
                const [neighbourY, neighbourX] = randomNeighbour.pos
                grid[neighbourY][neighbourX] = new Grass()
                this.energy = 0
            }

            if (waterNeighbours.length > 0) {
                const randomIndex = Math.floor(Math.random() * waterNeighbours.length)
                const randomNeighbour = waterNeighbours[randomIndex]
                const [neighbourY, neighbourX] = randomNeighbour.pos
                grid[neighbourY][neighbourX] = new Grass(this.energy = 7)
                this.energy += 3
            }

            if (wallNeighbours.length > 0 && this.energy >= 27) {
                const randomIndex = Math.floor(Math.random() * wallNeighbours.length)
                const randomNeighbour = wallNeighbours[randomIndex]
                const [neighbourY, neighbourX] = randomNeighbour.pos
                grid[neighbourY][neighbourX] = new Grass()
                this.energy = 0
            }

            
        }
        return grid
    }  
}

class GrassEater {
    constructor() {
        this.energy = 6  
        this.color = '#FFFF00'
    }

    nextStep(x, y, grid) {
        const grassNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof Grass)
        const emptyNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof EmptyBeing)

        if (this.energy <= -6) {
            grid[y][x] = new EmptyBeing()
        } else if (this.energy >= 10 && emptyNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyNeighbours.length)
            const randomNeighbour = emptyNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy -= 5
            grid[neighbourY][neighbourX] = new GrassEater()
        } else if (grassNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * grassNeighbours.length)
            const randomNeighbour = grassNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy += 1
            grid[neighbourY][neighbourX] = this
            grid[y][x] = new EmptyBeing()
        } else if (emptyNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyNeighbours.length)
            const randomNeighbour = emptyNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy -= 0.1
            grid[neighbourY][neighbourX] = this
            grid[y][x] = new EmptyBeing()
        } else {
            this.energy -= 0.1
        }

        return grid
    }
}

class Water {
    constructor(energy = 10) {
        this.energy = energy
        this.color = '#0000FF'
    }

    nextStep(x, y, grid) {
        const emptyNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof EmptyBeing)
        const carnivoreNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof Carnivore)

        if (this.energy >= 1 && emptyNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyNeighbours.length)
            const randomNeighbour = emptyNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy -= 1
            grid[neighbourY][neighbourX] = new Water(this.energy - 1)
        }

        if (this.energy >= 1 && carnivoreNeighbours.length > 0) {
            for (let i = 0; i < carnivoreNeighbours.length; i++) {
                const carnivoreNeighbour = carnivoreNeighbours[i]
                const [neighbourY, neighbourX] = carnivoreNeighbour.pos
                grid[neighbourY][neighbourX] = new Water(this.energy - 1)
            } 
        }

        return grid
    }
}

class Wall {
    constructor() {
        this.color = '#A56601'
    }

    nextStep(x, y, grid) {
        return grid
    }
}

class Carnivore {
    constructor() {
        this.energy = 100 
        this.color = '#FF0000'
    }

    nextStep(x, y, grid) {
        const grassEaterNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof GrassEater)
        const emptyNeighbours = getAllNeighbours(x, y, grid).filter(neighbour => neighbour.value instanceof EmptyBeing)

        if (this.energy <= -100) {
            grid[y][x] = new EmptyBeing()
        } else if (this.energy >= 120 && emptyNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyNeighbours.length)
            const randomNeighbour = emptyNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy -= 100
            grid[neighbourY][neighbourX] = new Carnivore()
        } else if (grassEaterNeighbours.length > 0) {
            const randomIndex = Math.floor(Math.random() * grassEaterNeighbours.length)
            const randomNeighbour = grassEaterNeighbours[randomIndex]
            const [neighbourY, neighbourX] = randomNeighbour.pos
            this.energy += 10
            grid[neighbourY][neighbourX] = this
            grid[y][x] = new EmptyBeing()
        } else {
            this.energy -= 1
            console.log(this.energy)
        }
        
        return grid
    }
}

let ROWS = 50
let COLUMNS = 50
let SPACING = 10
let SIZE = 10

//initalises grid to an empty grid
let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(new EmptyBeing()))

let gameActive = false

function drawGrid(grid, spacing, size) {
    push()
    translate(spacing, spacing)

    for(let y = 0; y < grid[0].length; y++) {
        for(let x = 0; x < grid.length; x++){
            push()
            translate(spacing * x , spacing * y)
            drawButton(grid[y][x].color, size)
            pop()
        }
    }

    pop()
}

//draws a button which is either on or off
function drawButton(color, size) {
    push()
    fill(color)
    rect(0, 0, size, size, 3)
    pop()
}

function mouseClicked() {
    const entityClasses = [Grass, GrassEater, Carnivore, Water, Wall, EmptyBeing]

    const mousecellx = Math.floor(mouseX / SPACING) - 1
    const mousecelly = Math.floor(mouseY / SPACING) - 1
    
    if (mousecellx < COLUMNS && mousecelly < ROWS) {
        const currentCell = grid[mousecelly][mousecellx]

        const currentIndex = entityClasses.findIndex(cls => currentCell instanceof cls)

        const nextIndex = (currentIndex + 1) % entityClasses.length

        grid[mousecelly][mousecellx] = new entityClasses[nextIndex]()

        drawGrid(grid, SPACING, SIZE)
    }
}

function getAllNeighbours(x, y, grid) {
    function shuffle(array) {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      }

    // define relative offsets for each neighbour
    const neighbourOffsets = [
        [1, 1],   // bottom-right
        [1, 0],   // bottom
        [1, -1],  // bottom-left
        [0, 1],   // right
        [0, -1],  // left
        [-1, 1],  // top-right
        [-1, 0],  // top
        [-1, -1]  // top-left
    ]
  
    const neighbours = []

    for (const offset of neighbourOffsets) {
        const newRow = y + offset[0]
        const newCol = x + offset[1]

        if (newRow >= 0 && newRow < grid.length &&
            newCol >= 0 && newCol < grid[newRow].length) {

            neighbours.push({
                pos: [newRow, newCol],
                value: grid[newRow][newCol]
            })
        }
    }

    shuffle(neighbours)

    return neighbours
}


//actualises the board from old_grid to new_grid by the game of life rules
function actualiseBoard() {
    let newGrid = grid.map(row => row.slice())
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            // Call nextStep and update the specific cell in newGrid
            newGrid = grid[y][x].nextStep(x, y, grid)
        }
    }

    return newGrid
}


//setup function
function setup() {
    createCanvas(1600, 1600)
    frameRate(60)
    noStroke()
    background(51)

    //draw inital grid
    drawGrid(grid, SPACING, SIZE)
}

//resets, actualises and draws the board
function draw() {
    if (keyIsPressed) {
        gameActive = true
    }

    if (gameActive && frameCount % 5 == 0){
        grid = actualiseBoard()
        drawGrid(grid, SPACING, SIZE)
    }
}