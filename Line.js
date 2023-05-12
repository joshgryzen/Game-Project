// Transcribed and modified from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Line.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Line extends Component {
    name = 'Line'

    strokeStyle

    lineWidth

    // Overloaded constructor allowing start and end positions to be passed as parameters
    constructor(
        strokeStyle = 'transparent',
        lineWidth = 1,
        startX,
        startY,
        endX,
        endY
    ) {
        super()
        this.strokeStyle = strokeStyle
        this.lineWidth = lineWidth
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
    }

    draw(ctx) {
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
        ctx.moveTo(endX, endY)
        ctx.lineTo(startX, startY)
        ctx.stroke()
    }
}

window.Line = Line
