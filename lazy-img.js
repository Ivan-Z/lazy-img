
const tagName = 'lazy-img';
var template = document.createElement('template');
template.innerHTML = `<img id="image"/>`;


 
class LazyImage extends HTMLElement {

  constructor() {
    super();
  }

 connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
  }
  
  disconnectedCallback() {
  }

  
}

var component = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(component) : component();
