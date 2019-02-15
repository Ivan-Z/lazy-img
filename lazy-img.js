const tagName = 'lazy-img';
var template = document.createElement('template');
template.innerHTML = `<img id="image"/>`;


class LazyImage extends HTMLElement {
  constructor() {
    super();

    // Element Properties
    this.src = '';
    this.alt = '';

    //Set up observer for lazy loading
    this.observerCallback = this.observerCallback.bind(this);
    this.visible = false;

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

    if ('IntersectionObserver' in window){
    	this.initIntersectionObserver();
    } else {
    	this.visible = true;
    } 

  }

	observerCallback(entries) {
	  if (entries.some(visisble)) this.visible = true
	}

	initIntersectionObserver() {
	  if (this.observer) return;	
	  this.observer =
	    new IntersectionObserver(this.observerCallback);
	  this.observer.observe(this);
	}


	//Called each time the element is disconnected from the DOM
	disconnectedCallback() {
  	}

}
 

var component = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(component) : component();
