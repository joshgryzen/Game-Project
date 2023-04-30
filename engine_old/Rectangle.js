/**
 * A circle engine-level component
 */
class Rectangle extends Component {
  /** The name of the component */
  name = "Rectangle"

  /** The fill color. Defaults to white. */
  fillStyle

  /** The color of the stroke. Defaults to transparent. */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1){
    super()
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth
  }

  /**
   * Draw the rectangle to the given context.
   * @param {2DContext} ctx The context to draw to.
   */
  draw(ctx) {
    //Set the fill style
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth

    // Draw the rectangle
    ctx.beginPath()
    ctx.rect(-this.transform.sx/2 + this.transform.x, -this.transform.sy/2 + this.transform.y,this.transform.sx, this.transform.sy);
    ctx.fill()
    ctx.stroke()
  }
}

//Add rectangle to the global namespace.
window.Rectangle = Rectangle;