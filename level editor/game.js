endlessCanvas = true;

const GRID_SIZE = {
    x: 10,
    y: 10
};

const GRID_DELIMITER_SIZE = 5;

const CELL_TYPE = {
    PATH: "PATH",
    WALL: "WALL",
    DOOR: "DOOR",
    BUTTON: "BUTTON"
};

let grid = [];
let cellSize = -1;

let currentSelected = CELL_TYPE.WALL;
let selectedButton = 0;

let player = {
    x: 0, 
    y: 0
};

let target = {
    x: GRID_SIZE.x - 1,
    y: GRID_SIZE.y - 1
};

class Cell {
    constructor(type, gridX, gridY) {
        this.type = type;
        this.gridX = gridX;
        this.gridY = gridY;
    }
}

class Path extends Cell {
    constructor(gridX, gridY) {
        super(CELL_TYPE.PATH, gridX, gridY);
    }

    draw() {
        drawImage(
            powerupGreen,
            this.gridX * cellSize + GRID_DELIMITER_SIZE / 2,
            this.gridY * cellSize + GRID_DELIMITER_SIZE / 2,
            cellSize - GRID_DELIMITER_SIZE,
            cellSize - GRID_DELIMITER_SIZE
        );
    }
}

class Wall extends Cell {
    constructor(gridX, gridY) {
        super(CELL_TYPE.WALL, gridX, gridY);
    }

    draw() {
        drawImage(
            powerupRed,
            this.gridX * cellSize + GRID_DELIMITER_SIZE / 2,
            this.gridY * cellSize + GRID_DELIMITER_SIZE / 2,
            cellSize - GRID_DELIMITER_SIZE,
            cellSize - GRID_DELIMITER_SIZE
        );
    }
}

class Door extends Cell {
    constructor(gridX, gridY, expression) {
        super(CELL_TYPE.DOOR, gridX, gridY);

        this.expression = expression;
    }

    draw() {
        drawImage(
            powerupYellow,
            this.gridX * cellSize + GRID_DELIMITER_SIZE / 2,
            this.gridY * cellSize + GRID_DELIMITER_SIZE / 2,
            cellSize - GRID_DELIMITER_SIZE,
            cellSize - GRID_DELIMITER_SIZE
        );
    }
}

class Button extends Cell {
    constructor(gridX, gridY, id, isOn = false) {
        super(CELL_TYPE.BUTTON, gridX, gridY);

        this.isOn = isOn;
        this.id = id;
    }

    draw() {
        drawImage(
            jelly[this.id],
            this.gridX * cellSize + GRID_DELIMITER_SIZE / 2,
            this.gridY * cellSize + GRID_DELIMITER_SIZE / 2,
            cellSize - GRID_DELIMITER_SIZE,
            cellSize - GRID_DELIMITER_SIZE
        );

        drawImage(
            this.isOn ? lampYellow : lampGray,
            this.gridX * cellSize + GRID_DELIMITER_SIZE / 2 + cellSize / 4,
            this.gridY * cellSize + GRID_DELIMITER_SIZE / 2 + cellSize / 4,
            cellSize / 2 - GRID_DELIMITER_SIZE,
            cellSize / 2 - GRID_DELIMITER_SIZE
        );
    }
}

function init() {
    for (let i = 0; i < GRID_SIZE.x; i++) {
        grid[i] = [];
        for (let j = 0; j < GRID_SIZE.y; j++) {
            grid[i][j] = new Path(i, j);
        }
    }
}

function update() {
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);


    cellSize = Math.min(
        canvas.width / GRID_SIZE.x,
        canvas.height / GRID_SIZE.y
    );

    context.strokeStyle = "#000000";
    context.lineWidth = GRID_DELIMITER_SIZE;
    for (let i = 0; i < GRID_SIZE.x; i++) {
        for (let j = 0; j < GRID_SIZE.y; j++) {
            context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);

            grid[i][j].draw();
        }
    }

    drawImage(
        flyMan,
        player.x * cellSize + GRID_DELIMITER_SIZE / 2,
        player.y * cellSize + GRID_DELIMITER_SIZE / 2,
        cellSize - GRID_DELIMITER_SIZE,
        cellSize - GRID_DELIMITER_SIZE
    );

    drawImage(
        ballOrTarget,
        target.x * cellSize + GRID_DELIMITER_SIZE / 2,
        target.y * cellSize + GRID_DELIMITER_SIZE / 2,
        cellSize - GRID_DELIMITER_SIZE,
        cellSize - GRID_DELIMITER_SIZE
    );
}
function mouseup() {
    let gridX = Math.floor(mouseX / cellSize);
    let gridY = Math.floor(mouseY / cellSize);

    switch (currentSelected) {
        case CELL_TYPE.PATH: {
            grid[gridX][gridY] = new Path(gridX, gridY);
            break;
        }

        case CELL_TYPE.WALL: {
            grid[gridX][gridY] = new Wall(gridX, gridY);
            break;
        }

        case CELL_TYPE.DOOR: {
            let expression = prompt("Въведи булев израз за тази врата", grid[gridX][gridY].expression);
            grid[gridX][gridY] = new Door(gridX, gridY, expression);
            break;
        }

        case CELL_TYPE.BUTTON: {
            if (grid[gridX][gridY].type == CELL_TYPE.BUTTON &&
                grid[gridX][gridY].id == selectedButton) {
                grid[gridX][gridY].isOn ^= true;
            } else {
                grid[gridX][gridY] = new Button(gridX, gridY, selectedButton);
            }
            break;
        }

        case "PLAYER": {
            player.x = gridX;
            player.y = gridY;

            break;
        }

        case "TARGET": {
            target.x = gridX;
            target.y = gridY;

            break;
        }

        default: {
            console.log("Ne bachka");
            break;
        }
    }
}

function keyup(key) {
    console.log("Natisnato: " + key);

    if (key == 49) { // Натиснато 1
        currentSelected = CELL_TYPE.PATH;
    } else if (key == 50) { // Натиснато 2 
        currentSelected = CELL_TYPE.WALL;
    } else if (key == 51) { // Натиснато 3 
        currentSelected = CELL_TYPE.DOOR;
    } else if (key >= 52 && key <= 57) { // Натиснато 4 - 9
        currentSelected = CELL_TYPE.BUTTON;
        selectedButton = key - 52;
    } else if (key == 80) { // Натиснато 'P'
        currentSelected = "PLAYER";
    } else if (key == 84) { // Натиснато 'T'
        currentSelected = "TARGET";
    }
}

function serialize() {
    let obj = [];
    for (let i = 0; i < GRID_SIZE.x; i++) {
        obj[i] = [];
        for (let j = 0; j < GRID_SIZE.y; j++) {
            if (grid[i][j].type == CELL_TYPE.PATH) {
                obj[i][j] = { type: CELL_TYPE.PATH };
            } else if (grid[i][j].type == CELL_TYPE.WALL) {
                obj[i][j] = { type: CELL_TYPE.WALL };
            } else if (grid[i][j].type == CELL_TYPE.DOOR) {
                obj[i][j] = {
                    type: CELL_TYPE.PATH,
                    expression: grid[i][j].expression
                };
            } else if (grid[i][j].type == CELL_TYPE.BUTTON) {
                obj[i][j] = {
                    type: CELL_TYPE.BUTTON,
                    id: grid[i][j].id,
                    isOn: grid[i][j].isOn
                };
            }
        }
    }
    
    return "?grid=" + encodeURIComponent(JSON.stringify(grid)) +
           "&player=" + encodeURIComponent(JSON.stringify(player)) + 
           "&target=" + encodeURIComponent(JSON.stringify(target));
}