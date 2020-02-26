const defaultSizeAttr = '100.0';
const defaultBackgroundAttr = '#124589';
const defaultCoordinatesColorAttr = 'darkorange';

class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.size;
        this.backgroundColor;
        this.coordinatesColor;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || defaultSizeAttr);
       this.backgroundColor = this.getAttribute('background') || defaultBackgroundAttr;
       this.coordinatesColor = this.getAttribute('coordinatesColor') || defaultCoordinatesColorAttr;
       this._render();
    }

    static get observedAttributes() {
        return ['size', 'background', 'coordinatesColor'];
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
        const coordinatesCells = coordinates.map((letter, index) => {
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

    }

    _buildBottomCells() {

    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);