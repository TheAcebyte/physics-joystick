import { mapRange } from '../utils.js';

/**
 * Slider component.
 * @module Slider
 */

class Slider {
    /**
     * Initialises a slider component.
     * @param {Element} parent
     * @param {Element} display
     * @param {number} min 
     * @param {number} max 
     * @param {number} step
     * @param {number} defaultState
     */

    constructor(parent, display, min, max, step, defaultState) {
        this.parent = parent;
        this.display = display;

        this.min = min;
        this.max = max;
        this.step = step;

        this.sliderElement = document.createElement('div');
        this.fillElement = document.createElement('div');
        this.circleElement = document.createElement('div');

        parent.appendChild(this.sliderElement);
        this.sliderElement.appendChild(this.fillElement);
        this.sliderElement.appendChild(this.circleElement);

        this.sliderElement.classList.add('slider');
        this.fillElement.classList.add('fill');
        this.circleElement.classList.add('circle');

        this.state = defaultState;
        this.updateSlider();
        this.addListeners();
    }

    /**
     * Handles mouse/touch events.
     * @param {Event} event
     */

    handleClick(event) {
        const bounds = this.sliderElement.getBoundingClientRect();
        const x = event.x - bounds.x;

        if (x < 0 || x > bounds.width) {
            return;
        }

        this.state = mapRange(x, 0, bounds.width, this.min, this.max, this.step);
        this.updateSlider();
    }

    /**
     * Updates the slider.
     */

    updateSlider() {
        const percentage = mapRange(this.state, this.min, this.max, 0, 100, 1);
        
        this.display.textContent = `${this.state}`;
        this.fillElement.style.width = `${percentage}%`;
        this.circleElement.style.left = `${percentage}%`;
    }

    /**
     * Adds the event listeners.
     */

    addListeners() {
        let active = false;

        this.parent.addEventListener('mousedown', (event) => {
            active = true;
            document.body.style.cursor = 'pointer';
            this.handleClick(event);
        });

        this.parent.addEventListener('touchdown', (event) => {
            active = true;
            this.handleClick(event);
        });

        window.addEventListener('mouseup', () => {
            active = false;
            document.body.style.cursor = 'default';
        });

        window.addEventListener('touchup', () => {
            active = false;
        });

        window.addEventListener('mousemove', (event) => {
            if (active) {
                this.handleClick(event);
            }
        });

        window.addEventListener('touchmove', (event) => {
            if (active) {
                this.handleClick(event);
            }
        });
    }
}

export { Slider };