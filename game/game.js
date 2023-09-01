endlessCanvas = true;

let GRID_SIZE = {
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
let isOpen = false;
let selectedDoor = null;

// Променливи, които ще ползваме във вратите
let black = false;
let yellow = false;
let green = false;
let red = false;
let blue = false;
let pink = false;

let player = {
    x: 0,
    y: 0
};

let target = {
    x: 0,
    y: 0
};

let win = false;

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
            (this.gridX + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
            (this.gridY + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
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
            (this.gridX + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
            (this.gridY + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
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

    isOpen() {
        return eval(this.expression);
    }

    draw() {
        drawImage(
            this.isOpen() ? powerupYellow : powerupYellowShield,
            (this.gridX + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
            (this.gridY + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
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
            (this.gridX + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
            (this.gridY + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
            cellSize - GRID_DELIMITER_SIZE,
            cellSize - GRID_DELIMITER_SIZE
        );

        drawImage(
            this.isOn ? lampYellow : lampGray,
            (this.gridX + 1) * cellSize + GRID_DELIMITER_SIZE / 2 + cellSize / 4,
            (this.gridY + 1) * cellSize + GRID_DELIMITER_SIZE / 2 + cellSize / 4,
            cellSize / 2 - GRID_DELIMITER_SIZE,
            cellSize / 2 - GRID_DELIMITER_SIZE
        );
    }
}

function init() {
    const queryParams = new URLSearchParams(window.location.search);
    grid = JSON.parse(queryParams.get("grid"));
    player = JSON.parse(queryParams.get("player"));
    target = JSON.parse(queryParams.get("target"));

    GRID_SIZE.x = grid.length;
    GRID_SIZE.y = grid[0].length;

    for (let i = 0; i < GRID_SIZE.x; i++) {
        for (let j = 0; j < GRID_SIZE.y; j++) {
            if (grid[i][j].type == CELL_TYPE.PATH) {
                grid[i][j] = new Path(i, j);
            } else if (grid[i][j].type == CELL_TYPE.WALL) {
                grid[i][j] = new Wall(i, j);
            } else if (grid[i][j].type == CELL_TYPE.DOOR) {
                grid[i][j] = new Door(i, j, grid[i][j].expression);
            } else if (grid[i][j].type == CELL_TYPE.BUTTON) {
                grid[i][j] = new Button(i, j, grid[i][j].id, grid[i][j].isOn);
            }
        }
    }

    updateDoors();
}

function update() {
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    cellSize = Math.min(
        canvas.width / (GRID_SIZE.x + 2),
        canvas.height / (GRID_SIZE.y + 2)
    );

    context.strokeStyle = "#000000";
    context.lineWidth = GRID_DELIMITER_SIZE;
    for (let i = 0; i < GRID_SIZE.x; i++) {
        for (let j = 0; j < GRID_SIZE.y; j++) {
            context.strokeRect((i + 1) * cellSize, (j + 1) * cellSize, cellSize, cellSize);

            grid[i][j].draw();
        }
    }

    drawImage(
        ballOrTarget,
        (target.x + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
        (target.y + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
        cellSize - GRID_DELIMITER_SIZE,
        cellSize - GRID_DELIMITER_SIZE
    );

    drawImage(
        flyMan,
        (player.x + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
        (player.y + 1) * cellSize + GRID_DELIMITER_SIZE / 2,
        cellSize - GRID_DELIMITER_SIZE,
        cellSize - GRID_DELIMITER_SIZE
    );

    if (selectedDoor != null) {
        context.fillStyle = "#ffffffaa";
        context.fillRect(
            (selectedDoor.x + 1) * cellSize,
            (selectedDoor.y + 2) * cellSize,
            grid[selectedDoor.x][selectedDoor.y].expression.length * cellSize * 0.3,
            cellSize / 2
        );

        context.fillStyle = "black";
        context.font = cellSize / 2 + "px monospace";

        context.fillText(
            grid[selectedDoor.x][selectedDoor.y].expression,
            (selectedDoor.x + 1) * cellSize,
            (selectedDoor.y + 2) * cellSize
        );
    }
}

function mousemove() {
    let gridX = Math.floor(mouseX / cellSize) - 1;
    let gridY = Math.floor(mouseY / cellSize) - 1;

    if (gridX < 0 || gridX >= GRID_SIZE.x ||
        gridY < 0 || gridY >= GRID_SIZE.y ||
        grid[gridX][gridY].type != CELL_TYPE.DOOR) {
        selectedDoor = null;
        return;
    }

    selectedDoor = {
        x: gridX,
        y: gridY
    };
}

function updateDoors() {
    for (let i = 0; i < GRID_SIZE.x; i++) {
        for (let j = 0; j < GRID_SIZE.y; j++) {
            if (grid[i][j].type == CELL_TYPE.BUTTON) {
                switch (grid[i][j].id) {
                    case 0:
                        black = grid[i][j].isOn;
                        break;

                    case 1:
                        yellow = grid[i][j].isOn;
                        break;

                    case 2:
                        green = grid[i][j].isOn;
                        break;

                    case 3:
                        red = grid[i][j].isOn;
                        break;

                    case 4:
                        blue = grid[i][j].isOn;
                        break;

                    case 5:
                        pink = grid[i][j].isOn;
                        break;
                }
            }
        }
    }
}

function keyup(key) {
    let moved = false;

    if (win)
        return;

    if (key == 37) { // Натиснато наляво
        if (player.x > 0 &&
            (
                grid[player.x - 1][player.y].type == CELL_TYPE.PATH ||
                grid[player.x - 1][player.y].type == CELL_TYPE.BUTTON ||
                (
                    grid[player.x - 1][player.y].type == CELL_TYPE.DOOR &&
                    eval(grid[player.x - 1][player.y].expression)
                )
            )
        ) {
            player.x--;
            moved = true;
        }
    } else if (key == 38) { // Натиснато нагоре
        if (player.y > 0 &&
            (
                grid[player.x][player.y - 1].type == CELL_TYPE.PATH ||
                grid[player.x][player.y - 1].type == CELL_TYPE.BUTTON ||
                (
                    grid[player.x][player.y - 1].type == CELL_TYPE.DOOR &&
                    eval(grid[player.x][player.y - 1].expression)
                )
            )
        ) {
            player.y--;
            moved = true;
        }
    } else if (key == 39) { // Натиснато надясно
        if (player.x < GRID_SIZE.x - 1 &&
            (
                grid[player.x + 1][player.y].type == CELL_TYPE.PATH ||
                grid[player.x + 1][player.y].type == CELL_TYPE.BUTTON ||
                (
                    grid[player.x + 1][player.y].type == CELL_TYPE.DOOR &&
                    eval(grid[player.x + 1][player.y].expression)
                )
            )
        ) {
            player.x++;
            moved = true;
        }
    } else if (key == 40) { // Натиснато надолу
        if (player.y < GRID_SIZE.y - 1 &&
            (
                grid[player.x][player.y + 1].type == CELL_TYPE.PATH ||
                grid[player.x][player.y + 1].type == CELL_TYPE.BUTTON ||
                (
                    grid[player.x][player.y + 1].type == CELL_TYPE.DOOR &&
                    eval(grid[player.x][player.y + 1].expression)
                )
            )
        ) {
            player.y++;
            moved = true;
        }
    }

    if (moved) {
        if (grid[player.x][player.y].type == CELL_TYPE.BUTTON) {
            grid[player.x][player.y].isOn ^= true;
        }

        if (player.x == target.x && player.y == target.y) {
            alert("Браво, печелиш!");
            win = true;
        }

        updateDoors();
    }
}
