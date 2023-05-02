/**
 * A circle engine-level component
 */
class Line extends Component {
    /** The name of the component */
    name = 'Line'

    /** The color of the stroke. Defaults to transparent. */
    strokeStyle

    /** The width of the stroke */
    lineWidth

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

    /**
     * Draw the rectangle to the given context.
     * @param {2DContext} ctx The context to draw to.
     */
    draw(ctx) {
        //Set the line style
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

        // Draw the line
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(startX, startY)
        ctx.stroke()
    }
}

//Add rectangle to the global namespace.
window.Line = Line
