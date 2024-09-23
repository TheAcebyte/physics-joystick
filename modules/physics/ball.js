import { getLength } from '../utils.js';

/**
 * Ball object.
 * @module Ball
 */

class Ball {
    /**
     * Initialises a Ball object.
     * @param {number} mass 
     * @param {number} radius 
     * @param {string} color
     */
    
    constructor(mass, radius, color) {
        this.mass = mass;
        this.radius = radius;
        this.color = color;

        this.flag = null;
        this.hidden = false;
        this.static = false;

        this.x = 0;
        this.y = 0;

        this.px = 0;
        this.py = 0;

        this.ax = 0;
        this.ay = 0;
    }

    /**
     * Set the ball's position.
     * @param {number} x
     * @param {number} y
     */

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.px = x;
        this.py = y;
    }

    /**
     * Sets the ball's flag. Two balls with the same flag won't collide.
     * @param {string} flag 
     */
 
    setFlag(flag) {
        this.flag = flag;
    }
    
    /**
     * Sets the ball's hidden state.
     * @param {boolean} hidden
    */
   
   setHidden(hidden) {
       this.hidden = hidden;
    }

    /**
     * Sets the ball's static state. Unaffected by gravity until it collides with a ball.
     * @param {boolean} static
     */
 
    setStatic(isStatic) {
        this.static = isStatic;
    }

    /**
     * Applies the Verlet integration equation to compute the new position.
     * @param {number} dt - Delta.
     */

    updatePosition(dt) {
        const tempX = this.x;
        const tempY = this.y;
        
        this.x = 2 * this.x - this.px + this.ax * dt * dt;
        this.y = 2 * this.y - this.py + this.ay * dt * dt;

        this.px = tempX;
        this.py = tempY;

        this.ax = 0;
        this.ay = 0;
    }

    /**
     * Accelerates the ball with a given vector.
     * @param {number} ax
     * @param {number} ay
     */

    accelerate(ax, ay) {
        this.ax += ax;
        this.ay += ay;
    }

    /**
     * Applies a force given its direction and intensity.
     * @param {number} value 
     * @param {number} angle 
     */

    applyForce(value, angle) {
        this.x += Math.cos(angle) * value;
        this.y += Math.sin(angle) * value;
    }

    /**
     * Checks and solves ball-to-wall collisions.
     * @param {number} width - Container's width.
     * @param {number} height - Container's height.
     * @param {number} restitution - Damping factor.
     * @param {boolean} topWall - Apply collision to top wall.
     */

    wallCollision(width, height, restitution, topWall) {
        if (this.x < this.radius) {
            const vx = this.x - this.px;

            this.x = this.radius;
            this.px = this.x + vx * restitution;
        }
        
        if (this.x > width - this.radius) {
            const vx = this.x - this.px;
    
            this.x = width - this.radius;
            this.px = this.x + vx * restitution;
        }

        if (topWall & this.y < this.radius) {
            const vy = this.y - this.py;

            this.y = this.radius;
            this.py = this.y + vy * restitution;
        }
        
        if (this.y > height - this.radius) {
            const vy = this.y - this.py;
    
            this.y = height - this.radius;
            this.py = this.y + vy * restitution;
        }
    }

    /**
     * Checks and solves ball-to-ball collision.
     * @param {Ball} other - Other ball.
     */

    ballCollision(other) {
        const collisionX = this.x - other.x;
        const collisionY = this.y - other.y;
    
        const distance = getLength(collisionX, collisionY);
        const threshold = this.radius + other.radius;
        const overlap = threshold - distance;
    
        if (overlap > 0) {
            this.static = false;
            other.static = false;

            // Normalize collision-axis vector
            const nx = collisionX / distance;
            const ny = collisionY / distance;
    
            // Proportional mass distribution
            const m1 = this.mass / (this.mass + other.mass);
            const m2 = other.mass / (this.mass + other.mass);
    
            this.x += m2 * overlap * nx;
            this.y += m2 * overlap * ny;
            
            other.x -= m1 * overlap * nx;
            other.y -= m1 * overlap * ny;
        }
    }
}

export { Ball };