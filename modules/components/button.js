/**
 * Button component.
 * @module Button
 */

class Button {
    /**
     * Initialises a button component.
     * @param {Element} parent
     * @param {boolean} defaultState
     */

    constructor(parent, defaultState) {
        this.parent = parent;

        this.buttonElement = document.createElement('div');
        this.circleElement = document.createElement('div');

        this.parent.appendChild(this.buttonElement);
        this.buttonElement.appendChild(this.circleElement);

        this.buttonElement.classList.add('button');
        this.circleElement.classList.add('circle');

        this.state = defaultState;
        this.updateButton();
        this.addListener();
    }

    /**
     * Updates the button appearance.
     */

    updateButton() {
        if (this.state) {
            this.buttonElement.style.backgroundColor = 'var(--button-enabled-color)';
            this.circleElement.style.left = `75%`;
        }
        else {
            this.buttonElement.style.backgroundColor = 'var(--button-disabled-color)';
            this.circleElement.style.left = '25%';
        }
    }

    /**
     * Adds the event listener.
     */

    addListener() {
        this.buttonElement.addEventListener('click', () => {
            this.state = !this.state;
            this.updateButton();
        });
    }
}

export { Button };