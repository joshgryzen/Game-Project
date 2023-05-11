// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Time.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Time {
    /** The time in seconds between frames */
    static deltaTime = 1 / 60

    /** The time in seconds since the first frame */
    static time = 0

    /** The number of frames since the game started */
    static frameCount = 0

    /**
     * Update the dynamic time values
     */
    static update() {
        Time.time += Time.deltaTime
        Time.frameCount++
    }
}

window.Time = Time
export default Time
