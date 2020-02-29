import * as Chess from '../lib/chess';
import {
    WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing,
    BlackPawn, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing,
} from './PiecesImages';

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
        this._rootElement;
        this._dndStarted;
        this._draggedPiece;
        this._draggedPieceLocation;
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

    disconnectedCallback() {
        this._rootElement.removeEventListener('mousedown', this._handleMouseDown.bind(this));
        this._rootElement.removeEventListener('mousemove', this._handleMouseMove.bind(this));
        this._rootElement.removeEventListener('mouseup', this._handleMouseUp.bind(this));
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

    toggleSide() {
        this.reversed = ! this.reversed;
        this._render();
    }

    _render() {
        const cellsSize = this.size / 9.0;
        const halfCellSize = cellsSize * 0.5;
        const commonGridTemplate = `${halfCellSize}px repeat(8, ${cellsSize}px) ${halfCellSize}px`;

        this.shadowRoot.innerHTML = `
            <style>
                #root {
                    position: relative;
                    background-color: ${this.backgroundColor};
                    width: ${this.size}px;
                    height: ${this.size}px;
                }

                #cells_layer {
                    display: grid;
                    grid-template: ${commonGridTemplate} / ${commonGridTemplate};
                    width: ${this.size}px;
                    height: ${this.size}px;
                    left: 0;
                    top: 0;
                }

                #dnd_layer {
                    position: absolute;
                    width: ${this.size}px;
                    height: ${this.size}px;
                    left: 0;
                    top: 0;
                    z-index: 5;
                }

                .coordinate {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: ${cellsSize * 0.5}px;
                    color: ${this.coordinatesColor};
                }

                .cell {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .player_turn {
                    border-radius: 50%;
                }
            </style>

            <div id="root">
                <div id="cells_layer">
                    ${this._buildTopCells()}
                    ${this._buildMediumCells()}
                    ${this._buildBottomCells()}
                </div>
                <div id="dnd_layer">
                    ${this._buildDraggedPiece()}
                </div>
            </div>
        `;

        this._rootElement = this.shadowRoot.querySelector('#root');
        this._rootElement.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._rootElement.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._rootElement.addEventListener('mouseup', this._handleMouseUp.bind(this));
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
                    <div class="cell" style="background-color: ${background}">
                        ${pieceImage}
                    </div> 
                ` : 
                `
                <div class="cell" style="background-color: ${background}">
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

    _buildDraggedPiece() {
        if (!this._draggedPiece || !this._draggedPieceLocation) 
            return `
                <div></div>
            `;

        const cellsSize = this.size / 9.0;

        let styleStr = `left: ${this._draggedPieceLocation.localX}px; `;
        styleStr += `top: ${this._draggedPieceLocation.localY}px; `;
        styleStr += `width: ${cellsSize}px; `;
        styleStr += `height: ${cellsSize}px; `;
        styleStr += 'position: absolute; '

        return `
            <div style="${styleStr}" id="dragged_piece">
                ${this._draggedPiece}
            </div>
        `
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

    _handleMouseDown(event) {
        event.preventDefault();
        
        const cellsSize = this.size / 9.0;
        
        
        const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
        
        const localX = event.clientX - thisClientRect.left;
        const localY = event.clientY - thisClientRect.top;
        
        const cellColIndex = Math.floor((localX - cellsSize * 0.5) / cellsSize);
        const cellLineIndex = Math.floor((localY - cellsSize * 0.5) / cellsSize);
        
        const inCellsBounds = cellColIndex >= 0 && cellColIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
        if (!inCellsBounds) return;
            
        const pieceImageAtClickedSquare = this._logic ? this._pieceValueToPieceImage(this._logic.get(this._cellToAlgebraic({
            file: this.reversed ? 7 - cellColIndex : cellColIndex, 
            rank: this.reversed ? cellLineIndex : 7-cellLineIndex,
        }))) : undefined;
        if (!pieceImageAtClickedSquare) return;

        this._draggedPiece = pieceImageAtClickedSquare;
        this._draggedPieceLocation = {localX, localY};
        this._dndStarted = true;

        this._render();
    }

    _handleMouseMove(event) {
        event.preventDefault();

        if (this._dndStarted) {
            const cellsSize = this.size / 9.0;


            const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
            
            const localX = event.clientX - thisClientRect.left;
            const localY = event.clientY - thisClientRect.top;

            this._draggedPieceLocation = {localX, localY};
            this._updateDraggedPiece();
            
            const cellColIndex = Math.floor((localX - cellsSize * 0.5) / cellsSize);
            const cellLineIndex = Math.floor((localY - cellsSize * 0.5) / cellsSize);
            
            const inCellsBounds = cellColIndex >= 0 && cellColIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
            if (!inCellsBounds) return;
            
        }
    }

    _handleMouseUp(event) {
        event.preventDefault();

        this._draggedPiece = undefined;
        this._draggedPieceLocation = undefined;
        this._dndStarted = false;

        this._render();

        const cellsSize = this.size / 9.0;


        const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
        
        const localX = event.clientX - thisClientRect.left;
        const localY = event.clientY - thisClientRect.top;

        const cellColIndex = Math.floor((localX - cellsSize * 0.5) / cellsSize);
        const cellLineIndex = Math.floor((localY - cellsSize * 0.5) / cellsSize);

        const inCellsBounds = cellColIndex >= 0 && cellColIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
        if (!inCellsBounds) return;
    }

    _updateDraggedPiece() {
        const cellsSize = this.size / 9.0;
        const commonUpperBound = this.size - cellsSize;
        const draggedPieceElement = this.shadowRoot.querySelector('#dragged_piece');

        const localX = this._draggedPieceLocation.localX;
        let updatedX = this._draggedPieceLocation.localX + 'px';
        if (localX < 0) updatedX = '0';
        if (localX > commonUpperBound) updatedX = commonUpperBound + 'px';
        draggedPieceElement.style.left = updatedX;

        const localY = this._draggedPieceLocation.localY;
        let updatedY = this._draggedPieceLocation.localY + 'px';
        if (localY < 0) updatedY = '0';
        if (localY > commonUpperBound) updatedY = commonUpperBound + 'px';
        draggedPieceElement.style.top = updatedY;
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);