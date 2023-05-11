// Transcribed and modified from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Rectangle.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Rectangle extends Component {
    name = 'Rectangle'

    fillStyle

    strokeStyle

    lineWidth

    // Overloaded constructor allowing start and end positions to be passed as parameters
    constructor(
        fillStyle = 'white',
        strokeStyle = 'transparent',
        lineWidth = 1,
        startX,
        startY,
        endX,
        endY
    ) {
        super()
        this.fillStyle = fillStyle
        this.strokeStyle = strokeStyle
        this.lineWidth = lineWidth
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
    }

    draw(ctx) {
        ctx.fillStyle = this.fillStyle
        ctx.strokeStyle = this.strokeStyle
        ctx.lineWidth = this.lineWidth

        let startX
        let startY

        let endX
        let endY

        this.startX ? (startX = this.startX) : (startX = this.transform.x)
        this.startY ? (startY = this.startY) : (startY = this.transform.y)

        this.endX ? (endX = this.endX) : (endX = this.transform.sx)
        this.endY ? (endY = this.endY) : (endY = this.transform.sy)

        ctx.beginPath()
        ctx.rect(startX, startY, endX, endY)
        ctx.fill()
        ctx.stroke()
    }
}

window.Rectangle = Rectangle
