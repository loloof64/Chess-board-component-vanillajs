class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .root {
                    width: 300px;
                    height: 300px;
                    background-color: #124589;
                }
            </style>

            <div class="root">
                
            </div>
        `;
    }

    connectedCallback() {

    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);