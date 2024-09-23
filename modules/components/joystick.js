import { trunc, getLength } from '../utils.js';

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
     * @param {number} x
     * @param {number} y
     */

    handleClick(x, y) {
        const bounds = this.joystickElement.getBoundingClientRect()
        const radius = bounds.height >> 1;

        const centerX = bounds.x + radius;
        const centerY = bounds.y + radius;

        this.state.x = (x - centerX) / radius;
        this.state.y = (y - centerY) / radius;
        const distance = getLength(this.state.x, this.state.y);

        if (distance > 1) {
            this.state.x = this.state.x / distance;
            this.state.y = this.state.y / distance;
        }
        
        this.state.x = trunc(this.state.x, 2);
        this.state.y = trunc(this.state.y, 2);

        if (this.state.x == 0 && this.state.y == 0) {
            const confirmationDelay = 50;

            setTimeout(() => {
                if (this.state.x == 0 && this.state.y == 0) {
                    this.joystickElement.classList.add('golden');
                }
            }, confirmationDelay);
        } 
        else {
            this.joystickElement.classList.remove('golden');
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
                this.handleClick(event.x, event.y);
            }
        });

        this.joystickElement.addEventListener('touchstart', (event) => {
            if (this.enabled) {
                active = true;
                this.handleClick(event.touches[0].clientX, event.touches[0].clientY);
            }
        });
        
        window.addEventListener('mouseup', () => {
            active = false;
            document.body.style.cursor = 'default';
        });
        
        window.addEventListener('touchend', () => {
            active = false;
        });

        window.addEventListener('mousemove', (event) => {
            if (active) {
                this.handleClick(event.x, event.y);
            }
        });

        window.addEventListener('touchmove', (event) => {
            if (active) {
                this.handleClick(event.touches[0].clientX, event.touches[0].clientY);
            }
        });
    }
}

export { Joystick };