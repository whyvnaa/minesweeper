const gameHTML = document.getElementById("game");

var round = 0;
const cellSize = 40;
const gameSize = 20;
var cells = []; // -1 = bomb

class Cell {
    constructor(isBomb) {
        this.bomb = isBomb;
        this.revealed = false;
        this.count = 0;
        this.marked = false;
    }
}

init();
function init() {
    for (var i = 0; i < gameSize * gameSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add('cell');
        gameHTML.appendChild(cell);
    }
}

function count(row, col) {
    const cell = cells[row][col];
    var count = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (0 <= row + i && row + i < gameSize && 0 <= col + j && col + j < gameSize && cells[row + i][col + j].bomb) {
                count++;
            }
        }
    }
    return count;
}

function draw() {
    for (var row = 0; row < gameSize; row++) {
        for (var col = 0; col < gameSize; col++) {

        }
    }
}

function drawOne(row, col) {
    const cell = cells[row][col];
    const cellHTML = document.querySelector(`#game > div:nth-child(${row * gameSize + col + 1})`);

    if (cell.marked) {
        cellHTML.style.backgroundColor = "yellow";
        return;
    }

    if (!cell.revealed) {
        cellHTML.style.backgroundColor = "gray";
        return;
    }

    if (cell.bomb) {
        cellHTML.style.backgroundColor = "red";
        return;
    }

    cellHTML.style.backgroundColor = "blue";
    cellHTML.innerHTML = cell.count;

}

function createBoard(row, col) {
    for (var j = 0; j < gameSize; j++) {
        var tmp = [];
        for (var i = 0; i < gameSize; i++) {
            if (row == j && col == i) {
                tmp.push(new Cell(false));
            } else {
                tmp.push(new Cell(Math.random() < 0.1));
            }
        }
        cells.push(tmp);
    }
}

function reveal(row, col) {
    const cell = cells[row][col];
    const cellHTML = document.querySelector(`#game > div:nth-child(${row * gameSize + col + 1})`);

    cell.revealed = true;

    if (cell.count > 0) {
        cellHTML.style.backgroundColor = "blue";
        cellHTML.innerHTML = cell.count;
    } else {
        cellHTML.style.backgroundColor = "green";

        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (0 <= row + i && row + i < gameSize && 0 <= col + j && col + j < gameSize) {
                    if (cells[row + i][col + j].count == 0 && !cells[row + i][col + j].revealed)
                        reveal(row + i, col + j)
                }
            }
        }
        revealNullNeighbours();
    }
}

function revealNullNeighbours() {
    for (var row = 0; row < gameSize; row++) {
        for (var col = 0; col < gameSize; col++) {
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (0 <= row + i && row + i < gameSize && 0 <= col + j && col + j < gameSize) {
                        if (cells[row + i][col + j].count == 0 && cells[row + i][col + j].revealed && !cells[row][col].revealed) {
                            reveal(row, col);
                        }
                    }
                }
            }
        }
    }
}

function clicked(row, col) {
    if (round == 0) {
        createBoard(row, col);
        for (let row = 0; row < gameSize; row++) {
            for (let col = 0; col < gameSize; col++) {
                cells[row][col].count = count(row, col);
            }
        }
    }
    round++;

    const cell = cells[row][col];
    const cellHTML = document.querySelector(`#game > div:nth-child(${row * gameSize + col + 1})`);

    if (cell.bomb) {
        cellHTML.style.backgroundColor = "red";

    } else {
        reveal(row, col);
    }
}

gameHTML.onclick = (e) => {
    const rect = gameHTML.getBoundingClientRect();
    const row = Math.floor((e.clientY - rect.top) / 40);
    const col = Math.floor((e.clientX - rect.left) / 40);

    clicked(row, col);
}

gameHTML.addEventListener('contextmenu', e => {
    e.preventDefault();

    const rect = gameHTML.getBoundingClientRect();
    const row = Math.floor((e.clientY - rect.top) / 40);
    const col = Math.floor((e.clientX - rect.left) / 40);

    if (round == 0) return;

    const cell = cells[row][col];
    if (cell.marked) {
        cell.marked = false;
    } else {
        cell.marked = true;
    }
    drawOne(row, col);
});