/**
 * Returns the length of a vector.
 * @param {number} x
 * @param {number} y
 * @return {number}
 */

function getLength(x, y) {
    return Math.sqrt(x * x + y * y);
}

/**
 * Returns a random integer between a given min-max. Max Excluded.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Swaps two elements in an array.
 * @param {array<T>} array 
 * @param {number} i 
 * @param {number} j
 * @template T
 */

function swapArray(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

/**
 * Fisher-Yates shuffling algorithm.
 * @param {Array<T>} array
 * @template T
 */

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const roll = randomInt(0, i + 1);
        swapArray(array, i, roll);
    }
}

/**
 * Maps a range onto another.
 * @param {number} x
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @param {number} step
 * @returns {number}
 */

function mapRange(x, inMin, inMax, outMin, outMax, step=1) {
    const mappedValue = (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    return Math.round(mappedValue / step) * step;
}

/**
 * Generate a random color mixed with a given base color.
 * @param {?Object} mix
 * @param {number} mix.r
 * @param {number} mix.g
 * @param {number} mix.b
 * @param {number} ratio - How much to take from the base color.
 * @returns {string}
 */

function generateColor(mix, ratio) {
    let red = randomInt(0, 256);
    let green = randomInt(0, 256);
    let blue = randomInt(0, 256);

    if (mix != null) {
        red = (1 - ratio) * red + ratio * mix.r;
        green = (1 - ratio) * green + ratio * mix.g;
        blue = (1 - ratio) * blue + ratio * mix.b;
    }

    return `rgb(${red}, ${green}, ${blue})`;
}

export { randomInt, swapArray, shuffleArray, getLength, mapRange, generateColor };