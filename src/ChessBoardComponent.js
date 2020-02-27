const defaultSizeAttr = '100.0';
const defaultBackgroundAttr = '#124589';
const defaultCoordinatesColorAttr = 'darkorange';
const defaultWhiteCellsColorAttr = 'goldenrod';
const defaultBlackCellsColorAttr = 'brown';
const defaultStartPositionAttr = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const defaultReversedAttr = 'false';

class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.size;
        this.backgroundColor;
        this.coordinatesColor;
        this.whiteCellColor;
        this.blackCellColor;
        this.reversed;
        this._logic;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || defaultSizeAttr);
       this.backgroundColor = this.getAttribute('background') || defaultBackgroundAttr;
       this.coordinatesColor = this.getAttribute('coordinates_color') || defaultCoordinatesColorAttr;
       this.whiteCellColor = this.getAttribute('white_cell_color') || defaultWhiteCellsColorAttr;
       this.blackCellColor = this.getAttribute('black_cell_color') || defaultBlackCellsColorAttr;
       this.startPosition = this.getAttribute('start_position') || defaultStartPositionAttr;
       this.reversed = (this.getAttribute('reversed') || defaultReversedAttr) === 'true';
       this._logic = new Chess(this.startPosition);
       this._render();
    }

    static get observedAttributes() {
        return [
            'size', 'background', 'coordinates_color',
            'white_cell_color', 'black_cell_color', 'start_position',
            'reversed',
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
        else if (name === 'coordinates_color') {
            this.coordinatesColor = newValue || defaultCoordinatesColorAttr;
            this._render();
        }
        else if (name === 'white_cell_color') {
            this.whiteCellColor = newValue || defaultWhiteCellsColorAttr;
            this._render();
        }
        else if (name === 'black_cell_color') {
            this.blackCellColor = newValue || defaultBlackCellsColorAttr;
            this._render();
        }
        else if (name === 'start_position') {
            this.startPosition = newValue || defaultStartPositionAttr;
            this._logic = new Chess(this.startPosition);
            this._render();
        }
        else if (name === 'reversed') {
            this.reversed = (newValue || defaultReversedAttr) === 'true';
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

                .player_turn {
                    border-radius: 50%;
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
        let coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        if (this.reversed) coordinates.reverse();

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
            const letter = String.fromCharCode(asciiDigit1 + (this.reversed ? lineIndex : 7 - lineIndex) );

            const coordinateCell = `
                <div class="coordinate">
                    ${letter}
                </div>
            `;
            const mediumCells = [0,1,2,3,4,5,6,7].map(colIndex => {
                const isWhiteCell = (colIndex + lineIndex) % 2 === 0;
                const background = isWhiteCell ? this.whiteCellColor : this.blackCellColor;

                const pieceImage = this._logic ? this._pieceValueToPieceImage(this._logic.get(this._cellToAlgebraic({
                    file: this.reversed ? 7 - colIndex : colIndex, 
                    rank: this.reversed ? lineIndex : 7-lineIndex,
                }))) : undefined;

                return pieceImage ? 
                `
                    <div style="background-color: ${background}">
                        ${pieceImage}
                    </div> 
                ` : 
                `
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
        let coordinates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        if (this.reversed) coordinates.reverse();

        const coordinatesCells = coordinates.map(letter => {
            return `
                <div class="coordinate">
                    ${letter}
                </div>
            `
        });

        const playerTurnColor = this._logic ? (this._logic.turn() === 'w' ? 'white' : 'black') : '#00000000';
        const playerTurn = `
            <div class="player_turn" style="background-color: ${playerTurnColor}">
            </div>
        `;

        return [
            "<div></div>",
            ...coordinatesCells.join(''),
            playerTurn
        ].join('');
    }

    _cellToAlgebraic({file, rank}) {
        const asciiDigit1 = 49;
        const asciiLowerA = 97;

        const letter = String.fromCharCode(asciiLowerA + file);
        const digit = String.fromCharCode(asciiDigit1 + rank);

        return `${letter}${digit}`;
    }

    _pieceValueToPieceImage(value) {
        if (!value) return undefined;
        const {type, color} = value;

        const cellsSize = this.size / 9.0;

        switch(type) {
            case 'p': return color === 'w' ? WhitePawn(cellsSize) : BlackPawn(cellsSize);
            case 'n': return color === 'w' ? WhiteKnight(cellsSize) : BlackKnight(cellsSize);
            case 'b': return color === 'w' ? WhiteBishop(cellsSize) : BlackBishop(cellsSize);
            case 'r': return color === 'w' ? WhiteRook(cellsSize) : BlackRook(cellsSize);
            case 'q': return color === 'w' ? WhiteQueen(cellsSize) : BlackQueen(cellsSize);
            case 'k': return color === 'w' ? WhiteKing(cellsSize) : BlackKing(cellsSize);
        }
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);