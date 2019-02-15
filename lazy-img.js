const tagName = 'lazy-img';
var template = document.createElement('template');
template.innerHTML = `<img id="image"/>`;

class LazyImage extends HTMLElement {
  constructor() {
    super();

    // Element Properties
    this.src = '';
    this.alt = '';
  }

  //Called everytime the element is connected to the DOM
  connectedCallback() {
    // Set the element properties from the DOM 
    this.src = this.getAttribute('src') || this.src;
    this.alt = this.getAttribute('alt') || this.alt;

    // Create Shadow Root if it does not exist
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.shadowImage = this.shadowRoot.getElementById('image')
    }

    // Set the attributes of the shadow image
    this.shadowImage.src = this.src;
    this.shadowImage.alt = this.alt;
  }

  //Called when one of the element's attributes is added, removed, or changed.
  attributeChangedCallback(name, oldVal, newVal) {
  	}
  
  //Called each time the element is disconnected from the DOM
  disconnectedCallback() {
  }

}
 

var component = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(component) : component();
