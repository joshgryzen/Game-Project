// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Time.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Time {
    static deltaTime = 1 / 60

    static time = 0

    static frameCount = 0

    static update() {
        Time.time += Time.deltaTime
        Time.frameCount++
    }
}

window.Time = Time
export default Time
