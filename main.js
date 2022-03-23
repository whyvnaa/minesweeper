const gameHTML = document.getElementById("game");

const size = 20;
const totalBombs = 40;
const cellSize = 40;
const cells = get2dArray(size, size);

var round = 0;

class Cell {
    bomb = false;
    marked = false;
    revealed = false;
    count = 0;

    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

function init() {
    for (var i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add('cell');
        gameHTML.appendChild(cell);
    }
}

function get2dArray(x, y) {
    var a = new Array(y);
    for (var i = 0; i < y; i++) {
        a[i] = new Array(x);
    }
    return a;
}

function drawCell(row, col) {
    const cellHTML = document.querySelector(`#game > div:nth-child(${row * size + col + 1})`);
    const cell = cells[row][col];

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

    cellHTML.style.backgroundColor = "#D5D5D5";
    cellHTML.innerHTML = cell.count;
    switch (cell.count) {
        case 0: cellHTML.innerHTML = ""; break;
        case 1: cellHTML.style.color = "blue"; break;
        case 2: cellHTML.style.color = "green"; break;
        case 3: cellHTML.style.color = "red"; break;
        case 4: cellHTML.style.color = "Indigo"; break;
        case 5: cellHTML.style.color = "brown"; break;
        case 6: cellHTML.style.color = "black"; break;
        case 7: cellHTML.style.color = "black"; break;
        case 8: cellHTML.style.color = "black"; break;
        default: break;
    }

    return;
}

function countBombs(row, col) {
    var count = 0;
    for (var i = row - 1; i < row + 2; i++) {
        for (var j = col - 1; j < col + 2; j++) {
            if (0 <= i && i < size && 0 <= j && j < size && cells[i][j].bomb) {
                count++;
            }
        }
    }
    return count;
}

function clicked(row, col) {
    if (round == 0) {
        createBoard(row, col);
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                cells[row][col].count = countBombs(row, col);
            }
        }
    }
    round++;

    cells[row][col].revealed = true;
    drawCell(row, col);
    if (cells[row][col].bomb) {
        showAll();
    }
    if (cells[row][col].count == 0) {
        drawObvious(row, col);
    }
}

function drawObvious(row, col) {
    for (var i = row - 1; i < row + 2; i++) {
        for (var j = col - 1; j < col + 2; j++) {
            if (0 <= i && i < size && 0 <= j && j < size) {
                const cell = cells[i][j];
                if (!cell.revealed) {
                    cell.revealed = true;
                    drawCell(i, j);

                    if (cell.count == 0) {
                        drawObvious(i, j);
                    }
                }
            }
        }
    }
}

function createBoard(row, col) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            cells[i][j] = new Cell();
        }
    }

    const options = new Array(size * size);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            options[i * size + j] = [i, j];
        }
    }
    options.splice(row * size + col, 1);

    for (var n = 0; n < totalBombs; n++) {
        var index = Math.floor(Math.random() * options.length);
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        options.splice(index, 1);
        cells[i][j].bomb = true;
    }

}

function showAll() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            cells[i][j].revealed = true;
            drawCell(i, j);
        }
    }
}

gameHTML.onclick = (e) => {
    const rect = gameHTML.getBoundingClientRect();
    const row = Math.floor((e.clientY - rect.top) / cellSize);
    const col = Math.floor((e.clientX - rect.left) / cellSize);

    clicked(row, col);
}

gameHTML.addEventListener('contextmenu', e => {
    e.preventDefault();

    const rect = gameHTML.getBoundingClientRect();
    const row = Math.floor((e.clientY - rect.top) / cellSize);
    const col = Math.floor((e.clientX - rect.left) / cellSize);

    if (round == 0) return;

    const cell = cells[row][col];
    if (!cell.revealed)
        cell.marked = !cell.marked;
    drawCell(row, col);
});




init();


