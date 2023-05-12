// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Transform.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Transform extends Component {
    name = 'Transform'

    x = 0
    y = 0
    sx = 1
    sy = 1
    r = 0

    static fromTo(startX, startY, endX, endY) {
        let t = new Transform()
        t.x = (startX + endX) / 2
        t.y = (startY + endY) / 2
        let length = Math.sqrt((startX - endX) ** 2 + (startY - endY) ** 2)
        t.sx = length / 2
        t.sy = 1
        t.r = Math.atan2(endY - startY, endX - startX)

        return t
    }
}

window.Transform = Transform
