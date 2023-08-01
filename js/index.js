/**
* █░█ █▄░█ █ █▀▀ █▀█ █▀▄ █▀▀ █▀▀ ▀▄▀ █▀█ █░░ █▀█ █▀█ █▀▀ █▀█
* █▄█ █░▀█ █ █▄▄ █▄█ █▄▀ ██▄ ██▄ █░█ █▀▀ █▄▄ █▄█ █▀▄ ██▄ █▀▄
*
* https://github.com/KekOnTheWorld/UnicodeExplorer/blob/master/LICENSE
*
* (c) 2022 KekOnTheWorld
*/

/** @type { HTMLDivElement } */
const wrapper = document.getElementById("wrapper");
/** @type { HTMLUListElement } */
const unicodes = document.getElementById("unicodes");

const CELL_WIDTH = 35;
const CELL_HEIGHT = 35;
const CHARS = 65536;

// The amount of rows that will be padded to the start/end
const START_PADDING = 5;
const END_PADDING = 5;

let cellsPerRow,
    rowsPerView,
    rows,
    row = 0,
    scrollTop = wrapper.scrollTop;

function reconstruct() {
    // Clear container
    unicodes.innerHTML = "";

    cellsPerRow = Math.floor(document.body.clientWidth / CELL_WIDTH);
    rowsPerView = Math.ceil(document.body.clientHeight / CELL_HEIGHT) + START_PADDING + END_PADDING;
    rows = Math.ceil(CHARS / cellsPerRow) - 1;
    row = Math.min(row, rows - rowsPerView);

    for (let i = 0; i < rowsPerView; i++) {
        unicodes.appendChild(createRow(i + row));
    }

    update();
}

function createRow(pos) {
    const rowEl = document.createElement("li");
    for (let i = 0; i < cellsPerRow; i++) {
        rowEl.appendChild(createCell(pos * cellsPerRow + i));
    }
    return rowEl;
}

function createCell(pos) {
    const cellEl = document.createElement("p");
    if (pos >= 0 && pos < CHARS) {
        const char = String.fromCharCode(pos);
        cellEl.innerText = char;
        cellEl.onclick = () => window.navigator.clipboard.writeText(char);
    } else {
        cellEl.className = "empty";
    }
    return cellEl;
}

let isUpdating = false;

window.onresize = reconstruct;
reconstruct();
wrapper.onscroll = () => {
    scrollTop = wrapper.scrollTop;
    if (!isUpdating) update();
}

function update() {
    isUpdating = true;
    const scrollRow = Math.floor(scrollTop / CELL_HEIGHT);

    if (Math.abs(scrollRow - row) > rowsPerView) {
        row = scrollRow - START_PADDING;
        reconstruct();
        isUpdating = false;
        return;
    }

    for (let i = 0; i < 5; i++) {
        if (scrollRow - row > START_PADDING && row < rows - rowsPerView) {
            row += 1;
            unicodes.children[0].remove();
            unicodes.append(createRow(row + rowsPerView));
        }

        if (scrollRow - row < START_PADDING && row > 0) {
            row -= 1;
            unicodes.children[rowsPerView - 1].remove();
            unicodes.prepend(createRow(row));
        }
    }

    updatePadding();

    if (scrollRow - row != START_PADDING && row > 0 && row < rows - rowsPerView) {
        requestAnimationFrame(update);
    } else {
        isUpdating = false;
    }
}

function updatePadding() {
    unicodes.style.paddingTop = (row) * CELL_HEIGHT + "px";
    unicodes.style.paddingBottom = (rows - rowsPerView - row) * CELL_HEIGHT + "px";
}
