import { shuffleArray } from './utils.js';

/**
 * Animation configuration.
 * @type {Object}
 * @member {string} word - Word to animate.
 * @member {number} delay - Delay between each letter animation.
 * @member {number} duration - Animation duration for each letter.
 */

const animationConfig = {
    word: 'physics',
    fadeInDelay: 0.1,
    fadeInDuration: 1,
    fadeOutDelay: 0.15,
    fadeOutDuration: 0.3,
    offset: 0.25
}

/**
 * Animates the overlay and returns its total duration in seconds.
 * @return {number}
 */

function animateOverlay() {
    const container = document.querySelector('.word-overlay');
    const config = animationConfig;

    const fadeInDuration = config.fadeInDuration + config.word.length * config.fadeInDelay + config.offset;
    const fadeOutDuration = config.fadeOutDuration + config.word.length * config.fadeOutDelay + config.offset;

    for (let i = 0; i < config.word.length; i++) {
        const letterSpan = document.createElement('span');
        container.appendChild(letterSpan);

        letterSpan.textContent = config.word[i];
        letterSpan.style.animation = `fade-in ${config.fadeInDuration}s forwards`
        letterSpan.style.animationDelay = `${config.fadeInDelay * i}s`;
    }

    const letterSpans = document.querySelectorAll('.word-overlay span');

    setTimeout(() => {
        const letterIndices = [];
        for (let i = 0; i < config.word.length; i++) {
            letterIndices.push(i);
        }

        shuffleArray(letterIndices);
        for (let i = 0; i < config.word.length; i++) {
            const index = letterIndices[i];
            const letterSpan = letterSpans[index];

            letterSpan.style.opacity = `1`;
            letterSpan.style.translate = `0 0`;
            letterSpan.style.animation = `fade-out ${config.fadeOutDuration}s forwards ease-out`;
            letterSpan.style.animationDelay = `${config.fadeOutDelay * i}s`;
        }
    }, (fadeInDuration * 1000));

    return fadeInDuration + fadeOutDuration;
}

export { animateOverlay };