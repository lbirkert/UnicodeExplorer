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

const PAGE_SIZE = 9;
const PAGE_COUNT = 65535 / PAGE_SIZE;
const PAGE_WIDTH = 120;
const PAGE_HEIGHT = 120;

let contentHeight = 0,
    contentWidth = 0;
let width = 0,
    height = 0;
let pagesPerCol = 1,
    pagesPerRow = 1;
let offset = -1;

/** @type { HTMLLIElement[] } */
let pages = [];

onresize = reposition;

function reposition() {
    const rect = wrapper.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    let oldPagesPerRow = pagesPerRow,
        oldPagesPerCol = pagesPerCol;

    pagesPerRow = Math.max(1, Math.floor(width / PAGE_WIDTH));
    pagesPerCol = Math.min(Math.ceil(PAGE_COUNT / pagesPerRow),
            Math.max(1, Math.ceil(height / PAGE_HEIGHT))) + 1;
    
    contentHeight = (Math.ceil(PAGE_COUNT / pagesPerRow) + 1) * PAGE_HEIGHT;
    contentWidth = pagesPerRow * PAGE_WIDTH;

    
    if(oldPagesPerCol !== pagesPerCol || oldPagesPerRow !== pagesPerRow) {
        offset = -1;
        unicodes.innerText = "";
        pages = new Array(pagesPerRow * pagesPerCol).fill(0).map(() => unicodes.appendChild(document.createElement("li")));
    }

    update();
}

reposition();

function update() {
    if(offset !== (offset = Math.floor(wrapper.scrollTop / PAGE_HEIGHT))) {
        const offsetHeight = offset * PAGE_HEIGHT;
        const _contentHeight = contentHeight - pagesPerCol * PAGE_HEIGHT;
        unicodes.style.paddingTop = Math.min(_contentHeight, offsetHeight) + "px";
        unicodes.style.paddingBottom = Math.max(0, _contentHeight - offsetHeight) + "px";

        pages.forEach((pageEl, j) => {
            pageEl.innerText = "";
            const _offset = ((offset - (_contentHeight - offsetHeight < 0) - 1) * pagesPerRow + j) * PAGE_SIZE;
            for(let i = 0; i < PAGE_SIZE; i++) {
                const char = _offset + i;
                const unicode = pageEl.appendChild(document.createElement("p"));
                if(char <= 65535 && char >= 0) {
                    unicode.addEventListener("click", () => {
                        navigator.clipboard.writeText(String.fromCharCode(char));
                    });
                    unicode.innerText = String.fromCharCode(char);
                } else unicode.className = "hidden";
            }
        });
    }
}

wrapper.onscroll = update;