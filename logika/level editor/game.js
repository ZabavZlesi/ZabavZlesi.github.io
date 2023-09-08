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

const HELP_MESSAGE =
    `С цъкане се поставя избраното в цъкнатата клетка. Избраното се сменя с:
(натисни ОК)
`;

const HELP_MESSAGE_KEYS =
    `* 1 - път
* 2 - стена
* 3 - врата
* 4, 5, 6, 7, 8, 9 - различни цветове копчета
* P - играча
* T - целта
* E - копира линк за нивото
(натисни ОК)
`;

const HELP_MESSAGE_DOORS =
    `Когато се поставя врата се появява прозорец за въвеждане на булев израз за отваряне.
В него се използват английските думи за цветовете на бутоните и логическите оператори.
Например ако искам вратата да се отвори, когато е натиснат зеления бутон и не е натиснат
червения, булевият израз е следният:
green && !red
`;

const HELP_MESSAGE_DOOR_DIAL =
    `Въведи булев израз за тази врата.
Използват се цветовете на бутоните: black, yellow, red, green, red, blue, pink. Може да се използват и кръгли скоби и булевите оператори: 
* && - И (AND)
* || - ИЛИ (OR)
* ^ - ИЗКЛЮЧВАЩО ИЛИ (XOR)
* ! - ОТРИЦАНИЕ (NOT)`;

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
        canvas.height / (GRID_SIZE.y + 1)
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

    context.fillStyle = "black";
    context.font = cellSize / 2 + "px monospace";
    context.fillText("Натисни \"H\" за помощ", cellSize / 4, canvas.height - cellSize / 1.5);
}

function mouseup() {
    let gridX = Math.floor(mouseX / cellSize);
    let gridY = Math.floor(mouseY / cellSize);

    if (gridX < 0 || gridX >= GRID_SIZE.x ||
        gridY < 0 || gridY >= GRID_SIZE.y) {
        return;
    }

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
            let expression = prompt(HELP_MESSAGE_DOOR_DIAL, grid[gridX][gridY].expression);
            grid[gridX][gridY] = new Door(gridX, gridY, expression);
            break;
        }

        case CELL_TYPE.BUTTON: {
            if (grid[gridX][gridY].type == CELL_TYPE.BUTTON &&
                grid[gridX][gridY].id == selectedButton) {
                grid[gridX][gridY].isOn ^= true;
            } else {
                let samePos = {
                    x: -1,
                    y: -1
                };

                for (let i = 0; i < GRID_SIZE.x; i++) {
                    for (let j = 0; j < GRID_SIZE.y; j++) {
                        if (grid[i][j].id == selectedButton) {
                            samePos.x = i;
                            samePos.y = j;
                            break;
                        }
                    }
                }

                if (samePos.x != -1) {
                    grid[samePos.x][samePos.y] = new Path(samePos.x, samePos.y);
                }

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
    } else if (key == 69) { // Натиснато 'E'
        navigator.clipboard.writeText(serialize());
        alert("Линкът за нивото е копиран. Изплозвай Ctrl+V за да го поставиш някъде");
    } else if (key == 72) { // Натиснато 'H'
        alert(HELP_MESSAGE);
        alert(HELP_MESSAGE_KEYS);
        alert(HELP_MESSAGE_DOORS);
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

    return "http://zabavzlesi.github.io/logika/game/start.html" +
        "?grid=" + encodeURIComponent(JSON.stringify(grid)) +
        "&player=" + encodeURIComponent(JSON.stringify(player)) +
        "&target=" + encodeURIComponent(JSON.stringify(target));
}
