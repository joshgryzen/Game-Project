// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Vector2.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Vector2 {
    x = 0
    y = 0

    static zero = new Vector2()
    static one = new Vector2(1, 1)
    static right = new Vector2(1, 0)
    static left = new Vector2(-1, 0)
    static up = new Vector2(0, 1)
    static down = new Vector2(0, -1)
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
}

window.Vector2 = Vector2
