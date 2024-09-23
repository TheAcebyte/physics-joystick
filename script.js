import { Ball } from './modules/physics/ball.js';
import { Engine } from './modules/physics/engine.js';
import { Joystick } from './modules/components/joystick.js';
import { animateOverlay } from './modules/animation.js';
import { randomInt, generateColor } from './modules/utils.js';
import { toggleSidebar, requestState } from './modules/settings.js';

const resetButton = document.querySelector('#reset');
const wrapper = document.querySelector('.joystick-wrapper');
const canvas = document.querySelector('#canvas');
const cog = document.querySelector('#cog');

const engine = new Engine(canvas);

let cancelSpawn = false;

/**
 * Main function.
 */

function main() {
    const duration = animateOverlay();

    setTimeout(() => {
        const icons = document.querySelectorAll('.icon');

        for (const icon of icons) {
            icon.style.display = 'block';
            icon.style.animation = 'appear 0.5s forwards';
        }

        startSimulation();
    }, duration * 1000);
}

/**
 * Start simulation
*/

function startSimulation() {
    const maxCount = requestState('numBalls');
    const substeps = requestState('numSubsteps');
    const collision = requestState('collision');
    const cannon = requestState('cannon');

    const mass = [5, 10];
    const radius = [10, 15];
    const baseColor = { r: 75, g: 160, b: 235 };
    const ratioColor = 0.8;
    
    joystick.setState(0, 1);
    joystick.updateJoystick();
    callback.call(joystick);
    
    engine.states.ballToBall = collision;
    engine.config.substeps = substeps;
    engine.start();
    
    let i = 0;
    let spawnBalls;
    cancelSpawn = false;
    
    if (cannon) {
        const increment = Math.PI / 20;
        const force = 3;
        const topOffset = 50;
        const spawnDelay = 50;
        
        let direction = 1;
        let angle = Math.PI / 2;
        
        spawnBalls = () => {
            if (i >= maxCount || cancelSpawn) {
                joystick.toggle();
                return;
            }
            
            const color = generateColor(baseColor, ratioColor);
            const ball = new Ball(mass[i % 2], radius[i % 2], color);
            ball.setPosition(canvas.width >> 1, topOffset);
            
            ball.applyForce(force, angle);
            engine.addBall(ball);
            
            angle += direction == 1 ? increment : -increment;
            if (angle <= 0 || angle >= Math.PI) {
                direction *= -1;
            }
            
            i++;
            setTimeout(spawnBalls, spawnDelay);
        }

        spawnBalls();
    } 
    else {
        const topOffset = -50;
        const spawnDelay = 5;
        engine.states.topWall = false;

        spawnBalls = () => {
            if (i >= maxCount || cancelSpawn) {
                engine.states.topWall = true;
                joystick.toggle();
                return;
            }
            
            const color = generateColor(baseColor, ratioColor);
            const ball = new Ball(mass[i % 2], radius[i % 2], color);
            const x = randomInt(0, canvas.width);
            const y = topOffset;
        
            ball.setPosition(x, y);
            engine.addBall(ball);
    
            i++;
            setTimeout(spawnBalls, spawnDelay);
        }

        spawnBalls();
    }
}

/**
 * Reset simulation.
 */

function resetSimulation() {
    const resetDelay = 50;
    cancelSpawn = true;

    engine.reset();
    joystick.toggle();
    setTimeout(startSimulation, resetDelay);
}

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

window.addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
});

/**
 * Gravity shift callback.
 * @param {Engine} engine
 */

function callback() {
    engine.shiftGravity(this.state.x, this.state.y);
}

const joystick = new Joystick(wrapper, callback, 0, 1);
joystick.toggle();

resetButton.addEventListener('click', () => {
    resetSimulation();
    toggleSidebar();
});

cog.addEventListener('click', toggleSidebar);

main();