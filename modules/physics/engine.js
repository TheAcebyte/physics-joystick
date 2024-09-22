import { Ball } from './ball.js';

/**
 * Physics engine.
 * @module Engine
 */

class Engine {

    /**
     * Initialises the physics engine.
     * @param {HTMLElement} canvas 
     */
    
    constructor(canvas) {
        this.canvas = canvas;
        this.balls = [];

        /**
         * Canvas context.
         * @type {CanvasRenderingContext2D}
         */

        this.ctx = canvas.getContext('2d');

        /**
         * Engine states.
         * @type {Object}
         * @member {boolean} topWall - Top wall collision state.
         * @member {boolean} ballToWall - Ball-to-wall collision state.
         * @member {boolean} ballToBall - Ball-to-ball collision state.
         */

        this.states = {
            topWall: true,
            ballToWall: true,
            ballToBall: true,
        };

        /**
         * Engine configuration.
         * @type {Object}
         * @property {number[]} gravity - Gravity values.
         * @property {number} delta - Delta value.
         * @property {number} restitution - Damping factor for wall collisions.
         * @property {number} substeps - Number of substeps every frame.
         * @property {number[]} dimensions - Number of rows and cells of the fixed grid.
         */

        this.config = {
            gravity: 3217.4,
            delta: 1 / 60,
            restitution: 0.8,
            substeps: 8,
            dimensions: [16, 32],
        };

        this.gravity = [0, this.config.gravity];
    }

    /**
     * Adds a ball to the engine.
     * @param {Ball} ball
     */

    addBall(ball) {
        this.balls.push(ball);
    }

    /**
     * Shift gravity based on a unit vector.
     * @param {number} x
     * @param {number} y
     */

    shiftGravity(x, y) {
        this.gravity[0] = x * this.config.gravity;
        this.gravity[1] = y * this.config.gravity;
    }

    /**
     * Partitions the canvas into a fixed grid, and fills each cell with any intersecting ball.
     * @returns {number[][][]}
     */

    partitionGrid() {
        const [numRows, numCols] = this.config.dimensions;
        const height = this.canvas.height;
        const width = this.canvas.width;

        const grid = [];

        for (let row = 0; row < numRows; row++) {
            grid.push([]);

            for (let col = 0; col < numCols; col++) {
                grid[row].push([]);
            }
        }

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];

            const startRow = Math.max(
                Math.floor(numRows * (ball.y - ball.radius) / height), 0
            );

            const startCol = Math.max(
                Math.floor(numCols * (ball.x - ball.radius) / width), 0
            );

            const endRow = Math.min(
                Math.floor(numRows * (ball.y + ball.radius) / height), numRows - 1
            );

            const endCol = Math.min(
                Math.floor(numCols * (ball.x + ball.radius) / width), numCols - 1
            );
            
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    grid[row][col].push(i);
                }
            }
        }

        return grid;
    }

    /**
     * Checks and solves collision between balls within a cell.
     * @param {number[]} cell
     */

    solveCollision(cell) {
        for (let i = 0; i < cell.length; i++) {
            const ball = this.balls[cell[i]];

            for (let j = i + 1; j < cell.length; j++) {
                const other = this.balls[cell[j]];

                if (ball.flag != null && other.flag != null && ball.flag == other.flag) {
                    continue;
                }

                ball.ballCollision(other);
            }
        }
    }

    /**
     * Draws a ball on the canvas.
     * @param {Ball} ball
     */

    draw(ball) {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
    }

    /**
     * Clears the whole canvas.
     */

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Updates every ball's position.
     */

    update() {
        const subDelta = this.config.delta / this.config.substeps;
        
        for (let n = 0; n < this.config.substeps; n++) {
            if (this.states.ballToBall) {
                const [numRows, numCols] = this.config.dimensions;
                const grid = this.partitionGrid();
    
                for (let row = 0; row < numRows; row++) {
                    for (let col = 0; col < numCols; col++) {
                        this.solveCollision(grid[row][col]);
                    }
                }
            }

            for (const ball of this.balls) {
                if (this.states.ballToWall) {
                    ball.wallCollision(this.canvas.width, this.canvas.height, this.config.restitution, this.states.topWall);
                }
                
                if (!ball.static) {
                    ball.accelerate(...this.gravity);
                }

                ball.updatePosition(subDelta);
                
                if (!ball.hidden) {
                    this.draw(ball);
                }
            }
        } 
    }

    /**
     * Physics loop.
     */

    loop() {
        this.clear();
        this.update();
        this.frame = requestAnimationFrame(() => this.loop());
    }

    /**
     * Starts the engine.
     */

    start() {
        this.loop();
    }

    /**
     * Stops the engine.
     */

    stop() {
        cancelAnimationFrame(this.frame);
    }

    /**
     * Empties the engine from any ball.
     */

    empty() {
        this.balls = [];
    }

    /**
     * Resets the whole simulation.
     */

    reset() {
        this.stop();
        this.clear();
        this.empty();
    }
}

export { Engine };