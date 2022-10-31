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

const PAGE_SIZE = 16;
const PAGE_COUNT = 65535 / PAGE_SIZE;
const PAGE_WIDTH = 300;
const PAGE_HEIGHT = 300;

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

    pagesPerCol = Math.max(1, Math.ceil(height / PAGE_HEIGHT)) + 1;
    pagesPerRow = Math.max(1, Math.floor(width / PAGE_WIDTH));

    
    contentHeight = (PAGE_COUNT * PAGE_HEIGHT) / pagesPerRow;
    console.log(contentHeight);
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
        console.log(contentHeight, offsetHeight);
        unicodes.style.paddingTop = Math.min(contentHeight, offsetHeight) + "px";
        unicodes.style.paddingBottom = Math.max(0, contentHeight - offsetHeight) + "px";

        pages.forEach((pageEl, j) => {
            pageEl.innerText = "";
            const _offset = (offset * pagesPerRow + j) * PAGE_SIZE;
            for(let i = 0; i < PAGE_SIZE; i++) {
                const char = _offset + i;
                if(char <= 65535) {
                    const unicode = pageEl.appendChild(document.createElement("p"));
                    unicode.addEventListener("click", () => {
                        navigator.clipboard.writeText(String.fromCharCode(char));
                    });
                    unicode.innerText = String.fromCharCode(char);
                }
            }
        });
    }
}

wrapper.onscroll = update;