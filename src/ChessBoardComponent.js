const defaultSizeAttr = '100.0';
const defaultBackgroundAttr = '#124589';

class ChessBoardComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        this.size;
        this.backgroundColor;
    }

    connectedCallback() {
       this.size = parseFloat(this.getAttribute('size') || defaultSizeAttr);
       this.backgroundColor = this.getAttribute('background') || defaultBackgroundAttr;
       this.render();
    }

    static get observedAttributes() {
        return ['size', 'background'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (name === 'size') {
            this.size = parseFloat(newValue || defaultSizeAttr);
            this.render();
        }
        else if (name === 'background') {
            this.backgroundColor = newValue || defaultBackgroundAttr;
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .root {
                    width: ${this.size}px;
                    height: ${this.size}px;
                    background-color: ${this.backgroundColor};
                }
            </style>

            <div class="root">
                
            </div>
        `;
    }
}

customElements.define('loloof64-chessboard', ChessBoardComponent);