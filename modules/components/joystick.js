import { getLength } from '../utils.js';

/**
 * Joystick component.
 * @module Joystick
 */

class Joystick {
    /**
     * Initialises a joystick component.
     * @param {Element} parent
     * @param {function} callback
     * @param {number} defaultX
     * @param {number} defaultY
     */
    
    constructor(parent, callback, defaultX, defaultY) {
        this.parent = parent;
        this.callback = callback;
        
        this.joystickElement = document.createElement('div');
        this.circleElement = document.createElement('div');

        this.parent.appendChild(this.joystickElement);
        this.joystickElement.appendChild(this.circleElement);
        
        this.joystickElement.classList.add('joystick', 'enabled');
        this.circleElement.classList.add('circle');

        this.enabled = true;
        this.state = { x: defaultX, y: defaultY };
        this.updateJoystick();
        this.addListeners();
    }

    /**
     * Toggles the joystick on-off.
     */

    toggle() {
        this.enabled = !this.enabled;
        this.joystickElement.classList.toggle('enabled');
    }

    /**
     * Sets the joystick's state.
     * @param {number} x 
     * @param {number} y 
     */

    setState(x, y) {
        this.state.x = x;
        this.state.y = y;
    }

    /**
     * Updates the joystick's position.
     */

    updateJoystick() {
        const positionX = (this.state.x + 1) / 2 * 100;
        const positionY = (this.state.y + 1) / 2 * 100;

        this.circleElement.style.top = `${positionY}%`;
        this.circleElement.style.left = `${positionX}%`;
    }

    /**
     * Handles mouse/touch events.
     * @param {Event} event
     */

    handleClick(event) {
        const bounds = this.joystickElement.getBoundingClientRect()
        const radius = bounds.height >> 1;

        const centerX = bounds.x + radius;
        const centerY = bounds.y + radius;

        this.state.x = (event.x - centerX) / radius;
        this.state.y = (event.y - centerY) / radius;
        const distance = getLength(this.state.x, this.state.y);

        if (distance > 1) {
            this.state.x = this.state.x / distance;
            this.state.y = this.state.y / distance;
        }
        
        this.updateJoystick();
        this.callback.call(this);
    }

    /**
     * Adds all the event listeners.
     */

    addListeners() {
        let active = false;

        this.joystickElement.addEventListener('mousedown', (event) => {
            if (this.enabled) {
                active = true;
                document.body.style.cursor = 'pointer';
                this.handleClick(event);
            }
        });

        this.joystickElement.addEventListener('touchdown', (event) => {
            event.preventDefault();
            if (this.enabled) {
                active = true;
                document.body.style.cursor = 'pointer';
                this.handleClick(event);
            }
        });
        
        window.addEventListener('mouseup', () => {
            active = false;
            document.body.style.cursor = 'default';
        });
        
        window.addEventListener('touchup', (event) => {
            event.preventDefault();
            active = false;
            document.body.style.cursor = 'default';
        });
        
        window.addEventListener('mousemove', (event) => {
            if (active) {
                this.handleClick(event);
            }
        });

        window.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (active) {
                this.handleClick(event);
            }
        });
    }
}

export { Joystick };