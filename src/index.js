import Chess from 'chess.js';
import {
    WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing,
    BlackPawn, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing,
} from './PiecesImages';

const defaultSizeAttr = '100.0';
const defaultBackgroundAttr = '#124589';
const defaultCoordinatesColorAttr = 'DarkOrange';
const defaultWhiteCellsColorAttr = 'GoldenRod';
const defaultBlackCellsColorAttr = 'brown';
const defaultStartPositionAttr = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const defaultReversedAttr = 'false';
const defaultOriginCellColorAttr = 'crimson';
const defaultTargetCellColorAttr = 'ForestGreen';
const defaultDndCrossColorAttr = 'DimGrey';

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
        this.originCellColor;
        this.targetCellColor;
        this.dndCrossColor;
        
        this._cellsSize;
        this._logic;
        this._rootElement;
        this._dndStarted;
        this._draggedPiece;
        this._draggedPieceLocation;
        this._draggedPieceOriginCell;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || defaultSizeAttr);
       this._cellsSize = this.size / 9.0;
       this.backgroundColor = this.getAttribute('background') || defaultBackgroundAttr;
       this.coordinatesColor = this.getAttribute('coordinates_color') || defaultCoordinatesColorAttr;
       this.whiteCellColor = this.getAttribute('white_cell_color') || defaultWhiteCellsColorAttr;
       this.blackCellColor = this.getAttribute('black_cell_color') || defaultBlackCellsColorAttr;
       this.startPosition = this.getAttribute('start_position') || defaultStartPositionAttr;
       this.reversed = (this.getAttribute('reversed') || defaultReversedAttr) === 'true';
       this.originCellColor = this.getAttribute('origin_cell_color') || defaultOriginCellColorAttr;
       this.targetCellColor = this.getAttribute('target_cell_color') || defaultTargetCellColorAttr;
       this.dndCrossColor = this.getAttribute('dnd_cross_color') ||  defaultDndCrossColorAttr;
       this._logic = new Chess(this.startPosition);
       this._render();
    }

    static get observedAttributes() {
        return [
            'size', 'background', 'coordinates_color',
            'white_cell_color', 'black_cell_color', 'start_position',
            'reversed',
            'origin_cell_color', 'target_cell_color', 'dnd_cross_color',
        ];
    }

    disconnectedCallback() {
        this._rootElement.removeEventListener('mousedown', this._handleMouseDown.bind(this));
        this._rootElement.removeEventListener('mousemove', this._handleMouseMove.bind(this));
        this._rootElement.removeEventListener('mouseup', this._handleMouseUp.bind(this));
        this._rootElement.removeEventListener('mouseleave', this._handleMouseLeave.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (name === 'size') {
            this.size = parseFloat(newValue || defaultSizeAttr);
            this._cellsSize = this.size / 9.0;
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
        else if (name === 'origin_cell_color') {
            this.originCellColor = newValue || defaultOriginCellColorAttr;
            this._render();
        }
        else if (name === 'target_cell_color') {
            this.targetCellColor = newValue || defaultTargetCellColorAttr;
            this._render();
        }
        else if (name === 'dnd_cross_color') {
            this.dndCrossColor = newValue || defaultDndCrossColorAttr;
            this._render();
        }
    }

    toggleSide() {
        this.reversed = ! this.reversed;
        this._render();
    }

    _render() {
        const halfCellSize = this._cellsSize * 0.5;
        const commonGridTemplate = `${halfCellSize}px repeat(8, ${this._cellsSize}px) ${halfCellSize}px`;

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

                #dnd_highlight_layer {
                    position: absolute;
                    width: ${this.size}px;
                    height: ${this.size}px;
                    left: 0;
                    top: 0;
                    z-index: 3;
                    opacity: 0.8;
                }

                #dnd_layer {
                    position: absolute;
                    width: ${this.size}px;
                    height: ${this.size}px;
                    left: 0;
                    top: 0;
                    z-index: 6;
                }

                .coordinate {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: ${halfCellSize}px;
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
                <div id="dnd_highlight_layer"></div>
                <div id="dnd_layer">
                    ${this._buildDraggedPiece()}
                </div>
            </div>
        `;

        this._rootElement = this.shadowRoot.querySelector('#root');
        this._rootElement.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._rootElement.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._rootElement.addEventListener('mouseup', this._handleMouseUp.bind(this));
        this._rootElement.addEventListener('mouseleave', this._handleMouseLeave.bind(this));
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
        const [originCellColIndex, originCellLineIndex] = this._getDraggedPieceOriginCellCoordinates();

        const cells = [0,1,2,3,4,5,6,7].map(lineIndex => {
            const asciiDigit1 = 49;
            const letter = String.fromCharCode(asciiDigit1 + (this.reversed ? lineIndex : 7 - lineIndex) );

            const coordinateCell = `
                <div class="coordinate">
                    ${letter}
                </div>
            `;
            const mediumCells = [0,1,2,3,4,5,6,7].map(colIndex => {
                const file = this.reversed ? 7 - colIndex : colIndex;
                const rank = this.reversed ? lineIndex : 7-lineIndex;
                
                const background = this._getBackgroundForCell({
                    cellColumnIndex: colIndex, 
                    cellLineIndex: lineIndex,
                });

                let pieceImage = this._logic ? this._pieceValueToPieceImage(this._logic.get(this._cellCoordinatesToAlgebraic({
                    file, rank,
                }))) : undefined;

                const isMovedPieceOriginCell = colIndex === originCellColIndex &&
                    lineIndex === originCellLineIndex;

                if (isMovedPieceOriginCell) pieceImage = undefined;

                const cellId = `cell_${file}${rank}`;

                return pieceImage ? 
                `
                    <div id=${cellId} class="cell" style="background-color: ${background}">
                        ${pieceImage}
                    </div> 
                ` : 
                `
                <div  id=${cellId} class="cell" style="background-color: ${background}">
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

        let styleStr = `left: ${this._draggedPieceLocation.localX}px; `;
        styleStr += `top: ${this._draggedPieceLocation.localY}px; `;
        styleStr += `width: ${this._cellsSize}px; `;
        styleStr += `height: ${this._cellsSize}px; `;
        styleStr += 'position: absolute; '

        return `
            <div style="${styleStr}" id="dragged_piece">
                ${this._draggedPiece}
            </div>
        `
    }

    _cellCoordinatesToAlgebraic({file, rank}) {
        const asciiDigit1 = 49;
        const asciiLowerA = 97;

        const letter = String.fromCharCode(asciiLowerA + file);
        const digit = String.fromCharCode(asciiDigit1 + rank);

        return `${letter}${digit}`;
    }

    _pieceValueToPieceImage(value) {
        if (!value) return undefined;
        const {type, color} = value;

        switch(type) {
            case 'p': return color === 'w' ? WhitePawn(this._cellsSize) : BlackPawn(this._cellsSize);
            case 'n': return color === 'w' ? WhiteKnight(this._cellsSize) : BlackKnight(this._cellsSize);
            case 'b': return color === 'w' ? WhiteBishop(this._cellsSize) : BlackBishop(this._cellsSize);
            case 'r': return color === 'w' ? WhiteRook(this._cellsSize) : BlackRook(this._cellsSize);
            case 'q': return color === 'w' ? WhiteQueen(this._cellsSize) : BlackQueen(this._cellsSize);
            case 'k': return color === 'w' ? WhiteKing(this._cellsSize) : BlackKing(this._cellsSize);
        }
    }

    _handleMouseDown(event) {
        event.preventDefault();     
        
        const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
        
        const localX = event.clientX - thisClientRect.left;
        const localY = event.clientY - thisClientRect.top;
        
        const {cellColumnIndex, cellLineIndex} = this._localCoordinatesToCellCoordinates({localX, localY});
        
        const inCellsBounds = cellColumnIndex >= 0 && cellColumnIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
        if (!inCellsBounds) return;
            
        const pieceImageAtClickedSquare = this._logic ? this._pieceValueToPieceImage(this._logic.get(this._cellCoordinatesToAlgebraic({
            file: this.reversed ? 7 - cellColumnIndex : cellColumnIndex, 
            rank: this.reversed ? cellLineIndex : 7-cellLineIndex,
        }))) : undefined;
        if (!pieceImageAtClickedSquare) return;

        this._draggedPiece = pieceImageAtClickedSquare;
        this._draggedPieceOriginCell = {localX, localY};
        this._draggedPieceLocation = {localX, localY};
        this._dndStarted = true;

        this._render();
    }

    _handleMouseMove(event) {
        event.preventDefault();

        if (this._dndStarted) {

            const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
            
            const localX = event.clientX - thisClientRect.left;
            const localY = event.clientY - thisClientRect.top;

            this._draggedPieceLocation = {localX, localY};
            this._updateDraggedPiece();
            this._updateDragAndDropIndicators();
            
            const {cellColumnIndex, cellLineIndex} = this._localCoordinatesToCellCoordinates({localX, localY});
            
            const inCellsBounds = cellColumnIndex >= 0 && cellColumnIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
            if (!inCellsBounds) return;
            
        }
    }

    _handleMouseUp(event) {
        event.preventDefault();

        const dndAlreadyCancelled = ! this._draggedPiece;
        if (dndAlreadyCancelled) return;

        const thisClientRect = this.shadowRoot.querySelector('#root').getBoundingClientRect();
        
        const localX = event.clientX - thisClientRect.left;
        const localY = event.clientY - thisClientRect.top;

        const {cellColumnIndex, cellLineIndex} = this._localCoordinatesToCellCoordinates({localX, localY});

        const inCellsBounds = cellColumnIndex >= 0 && cellColumnIndex <= 7 && cellLineIndex >= 0 && cellLineIndex <= 7;
        if (!inCellsBounds) {
            this._cancelDragAndDrop();
            return;
        };

        const startCellCoordinates = this._localCoordinatesToCellCoordinates({
            localX: this._draggedPieceOriginCell.localX,
            localY: this._draggedPieceOriginCell.localY,
        });
        const startCellColumnIndex = startCellCoordinates.cellColumnIndex;
        const startCellLineIndex = startCellCoordinates.cellLineIndex;

        const startCellFile = this.reversed ? 7-startCellColumnIndex : startCellColumnIndex;
        const startCellRank =  this.reversed ? startCellLineIndex : 7-startCellLineIndex;
        const endCellFile = this.reversed ? 7-cellColumnIndex : cellColumnIndex;
        const endCellRank = this.reversed ? cellLineIndex : 7-cellLineIndex;

        const validMove = this._isValidMove({
            startCellFile, startCellRank,
            endCellFile, endCellRank,
        });

        if (validMove){
            const moveParams = this._convertMoveToObject({
                startCellFile, startCellRank,
                endCellFile, endCellRank
            });
            this._logic.move(moveParams);
            this._render();
        }
        this._cancelDragAndDrop();
    }

    _handleMouseLeave(event) {
        event.preventDefault();
        this._cancelDragAndDrop();
    }

    _updateDraggedPiece() {
        const commonUpperBound = this.size - this._cellsSize;
        const draggedPieceElement = this.shadowRoot.querySelector('#dragged_piece');

        const localX = this._draggedPieceLocation.localX;
        let updatedX = this._draggedPieceLocation.localX + 'px';
        if (localX < 0) { 
            this._cancelDragAndDrop();
            return; 
        }
        if (localX > commonUpperBound) { 
            this._cancelDragAndDrop();
            return; 
        }
        draggedPieceElement.style.left = updatedX;

        const localY = this._draggedPieceLocation.localY;
        let updatedY = this._draggedPieceLocation.localY + 'px';
        if (localY < 0) { 
            this._cancelDragAndDrop();
            return; 
        }
        if (localY > commonUpperBound) { 
            this._cancelDragAndDrop();
            return; 
        }
        draggedPieceElement.style.top = updatedY;
    }

    _getDraggedPieceOriginCellCoordinates() {
        let originCellColIndex;
        let originCellLineIndex;

        if (this._draggedPieceOriginCell) {
            const cellCoordinates = 
                this._localCoordinatesToCellCoordinates(this._draggedPieceOriginCell);
            originCellColIndex = cellCoordinates.cellColumnIndex;
            originCellLineIndex = cellCoordinates.cellLineIndex;
        }
        else {
            originCellColIndex = undefined;
            originCellLineIndex = undefined;
        }

        return [originCellColIndex, originCellLineIndex];
    }

    _getDraggedPieceTargetCellCoordinates() {
        let draggedPieceCellColIndex;
        let draggedPieceCellLineIndex;

        if (this._draggedPieceLocation) {
            const cellCoordinates =
                this._localCoordinatesToCellCoordinates(this._draggedPieceLocation);
            draggedPieceCellColIndex = cellCoordinates.cellColumnIndex;
            draggedPieceCellLineIndex = cellCoordinates.cellLineIndex;
        }

        return [draggedPieceCellColIndex, draggedPieceCellLineIndex];
    }

    _getBackgroundForCell({cellColumnIndex, cellLineIndex}) {
        const isWhiteCell = (cellColumnIndex + cellLineIndex) % 2 === 0;
        const background = isWhiteCell ? this.whiteCellColor : this.blackCellColor;

        return background;
    }

    _updateDragAndDropIndicators() {
        const dndHighlightLayer = this.shadowRoot.querySelector('#dnd_highlight_layer');

        // Remove all children
        let child = dndHighlightLayer.lastElementChild;
        while(child) {
            dndHighlightLayer.removeChild(child);
            child = dndHighlightLayer.lastElementChild;
        }

        const [originCellColIndex, originCellLineIndex] = this._getDraggedPieceOriginCellCoordinates();
        const [draggedPieceCellColIndex, draggedPieceCellLineIndex] = this._getDraggedPieceTargetCellCoordinates();

        const originCellDiv = document.createElement('div');
        originCellDiv.style.position = 'absolute';
        originCellDiv.style.width = this._cellsSize + 'px';
        originCellDiv.style.height = this._cellsSize + 'px';
        originCellDiv.style.left = this._cellsSize * (0.5 + originCellColIndex) + 'px';
        originCellDiv.style.top = this._cellsSize * (0.5 + originCellLineIndex) + 'px';
        originCellDiv.style.backgroundColor = this.originCellColor;
        dndHighlightLayer.appendChild(originCellDiv);

        const dndCrossHorizPart = document.createElement('div');
        dndCrossHorizPart.style.position = 'absolute';
        dndCrossHorizPart.style.width = this._cellsSize * 8 + 'px';
        dndCrossHorizPart.style.height = this._cellsSize + 'px';
        dndCrossHorizPart.style.left = this._cellsSize * 0.5 + 'px';
        dndCrossHorizPart.style.top = this._cellsSize * (0.5 + draggedPieceCellLineIndex) + 'px';
        dndCrossHorizPart.style.backgroundColor = this.dndCrossColor;
        dndHighlightLayer.appendChild(dndCrossHorizPart);

        const dndCrossVerticPart = document.createElement('div');
        dndCrossVerticPart.style.position = 'absolute';
        dndCrossVerticPart.style.width = this._cellsSize + 'px';
        dndCrossVerticPart.style.height = this._cellsSize * 8 + 'px';
        dndCrossVerticPart.style.left = this._cellsSize * (0.5 + draggedPieceCellColIndex) + 'px';
        dndCrossVerticPart.style.top = this._cellsSize * 0.5 + 'px';
        dndCrossVerticPart.style.backgroundColor = this.dndCrossColor;
        dndHighlightLayer.appendChild(dndCrossVerticPart);

        const targetCellDiv = document.createElement('div');
        targetCellDiv.style.position = 'absolute';
        targetCellDiv.style.width = this._cellsSize + 'px';
        targetCellDiv.style.height = this._cellsSize + 'px';
        targetCellDiv.style.left = this._cellsSize * (0.5 + draggedPieceCellColIndex) + 'px';
        targetCellDiv.style.top = this._cellsSize * (0.5 + draggedPieceCellLineIndex) + 'px';
        targetCellDiv.style.backgroundColor = this.targetCellColor;
        dndHighlightLayer.appendChild(targetCellDiv);
    }

    _cancelDragAndDrop() {
        const dndHighlightLayer = this.shadowRoot.querySelector('#dnd_highlight_layer');
        // Remove all children from Drag and drop highlight layer
        let child = dndHighlightLayer.lastElementChild;
        while(child) {
            dndHighlightLayer.removeChild(child);
            child = dndHighlightLayer.lastElementChild;
        }

        this._draggedPiece = undefined;
        this._draggedPieceLocation = undefined;
        this._draggedPieceOriginCell = undefined;
        this._dndStarted = false;
        this._render();
    }

    _localCoordinatesToCellCoordinates(localCoordinates) {
        if (! localCoordinates) return undefined;

        const {localX, localY} = localCoordinates;
        const cellColumnIndex = Math.floor((localX - this._cellsSize * 0.5) / this._cellsSize);
        const cellLineIndex = Math.floor((localY - this._cellsSize * 0.5) / this._cellsSize);

        return {cellColumnIndex, cellLineIndex};
    }

    _isValidMove({
        startCellFile, startCellRank,
        endCellFile, endCellRank,
    }) {
        const moveParams = this._convertMoveToObject({
            startCellFile, startCellRank,
            endCellFile, endCellRank
        });
        
        const logicClone = new Chess(this._logic.fen());
        return logicClone.move(moveParams) !== null;
    }

    _convertMoveToObject({
        startCellFile, startCellRank,
        endCellFile, endCellRank,
        promotion = 'q',
    }) {
        const startCellAlgebraic = this._cellCoordinatesToAlgebraic({
            file: startCellFile,
            rank: startCellRank
        });
        const endCellAlgebraic = this._cellCoordinatesToAlgebraic({
            file: endCellFile,
            rank: endCellRank
        });
        const moveParams = {
            from: startCellAlgebraic,
            to: endCellAlgebraic,
            promotion,
        };

        return moveParams;
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);