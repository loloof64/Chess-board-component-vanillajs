const defaultSizeAttr = '100.0';
const defaultBackgroundAttr = '#124589';
const defaultCoordinatesColorAttr = 'darkorange';
const defaultWhiteCellsColorAttr = 'goldenrod';
const defaultBlackCellsColorAttr = 'brown';

class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.size;
        this.backgroundColor;
        this.coordinatesColor;
        this.whiteCellColor;
        this.blackCellColor;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || defaultSizeAttr);
       this.backgroundColor = this.getAttribute('background') || defaultBackgroundAttr;
       this.coordinatesColor = this.getAttribute('coordinatesColor') || defaultCoordinatesColorAttr;
       this.whiteCellColor = this.getAttribute('whiteCellColor') || defaultWhiteCellsColorAttr;
       this.blackCellColor = this.getAttribute('blackCellColor') || defaultBlackCellsColorAttr;
       this._render();
    }

    static get observedAttributes() {
        return [
            'size', 'background', 'coordinatesColor',
            'whiteCellColor', 'blackCellColor',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (name === 'size') {
            this.size = parseFloat(newValue || defaultSizeAttr);
            this._render();
        }
        else if (name === 'background') {
            this.backgroundColor = newValue || defaultBackgroundAttr;
            this._render();
        }
        else if (name === 'coordinatesColor') {
            this.coordinatesColor = newValue || defaultCoordinatesColorAttr;
            this._render();
        }
        else if (name === 'whiteCellColor') {
            this.whiteCellColor = newValue || defaultWhiteCellsColorAttr;
            this._render();
        }
        else if (name === 'blackCellColor') {
            this.blackCellColor = newValue || defaultBlackCellsColorAttr;
            this._render();
        }
    }

    _render() {
        const cellsSize = this.size / 9.0;
        const halfCellSize = cellsSize * 0.5;
        const commonGridTemplate = `${halfCellSize}px repeat(8, ${cellsSize}px) ${halfCellSize}px`;

        this.shadowRoot.innerHTML = `
            <style>
                .root {
                    display: grid;
                    grid-template: ${commonGridTemplate} / ${commonGridTemplate};
                    width: ${this.size}px;
                    height: ${this.size}px;
                    background-color: ${this.backgroundColor};
                }

                .coordinate {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: ${cellsSize * 0.5}px;
                    color: ${this.coordinatesColor};
                }
            </style>

            <div class="root">
                ${this._buildTopCells()}
                ${this._buildMediumCells()}
                ${this._buildBottomCells()}
            </div>
        `;
    }

    _buildTopCells() {
        const coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const coordinatesCells = coordinates.map(letter => {
            return `
                <div class="coordinate">
                    ${letter}
                </div>
            `
        });

        return [
            "<div></div>",
            ...coordinatesCells.join(''),
            "<div></div>"
        ].join('');
    }

    _buildMediumCells() {
        const cells = [0,1,2,3,4,5,6,7].map(lineIndex => {
            const asciiDigit1 = 49;
            const letter = String.fromCharCode(asciiDigit1 + 7 - lineIndex);

            const coordinateCell = `
                <div class="coordinate">
                    ${letter}
                </div>
            `;
            const mediumCells = [0,1,2,3,4,5,6,7].map(colIndex => {
                const isWhiteCell = (colIndex + lineIndex) % 2 === 0;
                const background = isWhiteCell ? this.whiteCellColor : this.blackCellColor;

                return `
                    <div style="background-color: ${background}">
                    </div> 
                `
            });

            return [
                coordinateCell,
                mediumCells.join(''),
                coordinateCell,
            ].join('');
        }).join('');

        return cells;
    }

    _buildBottomCells() {
        const coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const coordinatesCells = coordinates.map(letter => {
            return `
                <div class="coordinate">
                    ${letter}
                </div>
            `
        });

        return [
            "<div></div>",
            ...coordinatesCells.join(''),
            "<div></div>"
        ].join('');
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);