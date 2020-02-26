class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.size;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || '100.0');
       this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .root {
                    width: ${this.size}px;
                    height: ${this.size}px;
                    background-color: #124589;
                }
            </style>

            <div class="root">
                
            </div>
        `;
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);