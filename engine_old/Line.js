/**
 * A circle engine-level component
 */
class Line extends Component {
  /** The name of the component */
  name = "Line"

  /** The color of the stroke. Defaults to transparent. */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  constructor(strokeStyle = "transparent", lineWidth = 1){
    super()
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth
  }

  /**
   * Draw the rectangle to the given context.
   * @param {2DContext} ctx The context to draw to.
   */
  draw(ctx) {
    //Set the line style
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth


    let startX = -Math.cos(this.transform.r)*this.transform.sx+this.transform.x
    let startY = -Math.sin(this.transform.r)*this.transform.sx+this.transform.y

    let endX = Math.cos(this.transform.r)*this.transform.sx+this.transform.x
    let endY = Math.sin(this.transform.r)*this.transform.sx+this.transform.y
    
    // Draw the line
    ctx.beginPath()
    ctx.moveTo(endX, endY);
    ctx.lineTo(startX, startY);
    ctx.stroke()
  }
}

//Add rectangle to the global namespace.
window.Line = Line;