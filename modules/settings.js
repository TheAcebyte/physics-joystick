import { Slider } from './components/slider.js';
import { Button } from './components/button.js';

const sidebar = document.querySelector('.sidebar');
const wrapper = document.querySelector('.settings');
const cog = document.querySelector('#cog');

let activeSidebar = false;

/**
 * Toggles the sidebar on-off.
 */

function toggleSidebar() {
    activeSidebar = !activeSidebar;
    
    if (activeSidebar) {
        cog.style.rotate = '-360deg';
        sidebar.style.translate = '0';
    } 
    else {
        cog.style.rotate = '0deg';
        sidebar.style.translate = '100%';
    }
}

/**
 * Configuration of settings. Either a slider or a button.
 * @type {Object}
 */

const settingsConfig = {
    numBalls: {
        description: 'Balls',
        type: 'slider',
        min: 100,
        max: 1000,
        step: 50,
        default: 100
    },

    numSubsteps: {
        description: 'Substeps',
        type: 'slider',
        min: 1,
        max: 12,
        step: 1,
        default: 8
    },

    collision: {
        description: 'Collisions',
        type: 'button',
        default: true
    },

    cannon: {
        description: 'Cannon',
        type: 'button',
        default: false
    }
}

const width = document.body.clientWidth;

if (width >= 1400) {
    settingsConfig.numBalls.default = 400;
}
else if (width >= 1000) {
    settingsConfig.numBalls.default = 300;
}
else if (width >= 600) {
    settingsConfig.numBalls.default = 200;
}
else {
    settingsConfig.numBalls.default = 100;
}

for (const setting in settingsConfig) {
    const props = settingsConfig[setting];
    const settingElement = document.createElement('div');
    wrapper.appendChild(settingElement);

    if (props.type == 'slider') {
        settingElement.classList.add('setting-slider');

        const headerElement = document.createElement('div');
        headerElement.classList.add('header');
        settingElement.appendChild(headerElement);

        const descriptionElement = document.createElement('h2');
        descriptionElement.textContent = props.description;
        headerElement.appendChild(descriptionElement);

        const displayElement = document.createElement('p');
        headerElement.appendChild(displayElement);
        
        props.component = new Slider(
            settingElement, displayElement, props.min, props.max, props.step, props.default
        );
    }
    else if (props.type == 'button') {
        settingElement.classList.add('setting-button');

        const descriptionElement = document.createElement('h2');
        descriptionElement.textContent = props.description;
        settingElement.appendChild(descriptionElement);

        props.component = new Button(
            settingElement, props.default
        );
    }
}

/**
 * Returns the state of a given setting.
 * @param {string} setting 
 * @returns 
 */

function requestState(setting) {
    return settingsConfig[setting].component.state;
}

export { toggleSidebar, requestState };