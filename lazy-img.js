const tagName = 'lazy-img';
var template = document.createElement('template');

const isIntersecting = ({
	isIntersecting
}) => isIntersecting


class LazyImage extends HTMLElement {
	constructor() {
		super();

		// Element Properties
		this.src = '';
		this.alt = '';
		this.fadein = '';

		//Set up observer for lazy loading
		this.observerCallback = this.observerCallback.bind(this);
		this.visible = false;

	}

	initElement(time) {
		template.innerHTML = `
		<style>
			.fadeImage {
			    -webkit-animation: fadein ` + time + `ms; /* Safari, Chrome and Opera > 12.1 */
			       -moz-animation: fadein ` + time + `ms; /* Firefox < 16 */
			        -ms-animation: fadein ` + time + `ms; /* Internet Explorer */
			         -o-animation: fadein ` + time + `ms; /* Opera < 12.1 */
			            animation: fadein ` + time + `ms;
			    display: block;
			    margin: 25px auto;
			}

			@keyframes fadein {
			    from { opacity: 0; }
			    to   { opacity: 1; }
			}

			/* Firefox < 16 */
			@-moz-keyframes fadein {
			    from { opacity: 0; }
			    to   { opacity: 1; }
			}

			/* Safari, Chrome and Opera > 12.1 */
			@-webkit-keyframes fadein {
			    from { opacity: 0; }
			    to   { opacity: 1; }
			}

			/* Internet Explorer */
			@-ms-keyframes fadein {
			    from { opacity: 0; }
			    to   { opacity: 1; }
			}

			/* Opera < 12.1 */
			@-o-keyframes fadein {
			    from { opacity: 0; }
			    to   { opacity: 1; }
			}
		</style>`;
		template.innerHTML += `<img style="width: 100%;" class="fadeImage" id="image"/>`;
	}

	//Setters and Getters for image tag attributes

	//Prevents attribute double setting
	safeSetAttribute(attribute, value) {
		if (this.getAttribute(attribute) !== value) this.setAttribute(attribute, value);
	}

	set src(value) {
		this.safeSetAttribute('src', value);
		if (this.visible) {
			if (this.shadowImage) this.shadowImage.src = value;
		}
	}

	get src() {
		return this.getAttribute('src')
	}

	set alt(value) {
		this.safeSetAttribute('alt', value);
		// Set image alt
		if (this.shadowImage) this.shadowImage.alt = value;
	}

	get alt() {
		return this.getAttribute('alt')
	}


	//Called everytime the element is connected to the DOM
	connectedCallback() {
		// Set the element properties from the DOM 
		this.src = this.getAttribute('src') || this.src;
		this.alt = this.getAttribute('alt') || this.alt;
		this.fadein = this.getAttribute('fadein') || this.fadein;
		this.initElement(this.fadein);

		// Create Shadow Root if it does not exist
		if (!this.shadowRoot) {
			this.attachShadow({
				mode: 'open'
			});
			this.shadowRoot.appendChild(template.content.cloneNode(true));
			this.shadowImage = this.shadowRoot.getElementById('image')
		}

		if ('IntersectionObserver' in window) {
			this.initIntersectionObserver();
		} else {
			this.visible = true;
		}

	}

	static get observedAttributes() {
		return ['src', 'alt'];
	}

	attributeChangedCallback(name, oldVal, newVal) {
		this[name] = newVal;
	}

	observerCallback(entries) {
		if (entries.some(isIntersecting)) this.visible = true
	}

	initIntersectionObserver() {
		if (this.observer) return;
		this.observer =
			new IntersectionObserver(this.observerCallback);
		this.observer.observe(this);
	}

	set visible(value) {
		if (value) {
			this.shadowImage.src = this.src;
			this.setAttribute('visible', '');
			this.disconnectObserver();
		} else {
			this.removeAttribute('visible')
		}
	}

	get visisble() {
		return this.hasAttribute('visible')
	}

	disconnectObserver() {
		this.observer.disconnect();
		this.observer = null;
		delete this.observer;
	}

}


var component = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(component) : component();