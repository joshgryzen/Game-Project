/**
 * A rectangle engine-level component
 */
class ScreenRectangle extends Component {
  /** The name of the component */
  name = "ScreenRectangle"

  /** The fill color. Defaults to white. */
  fillStyle

  /** The color of the stroke. Defaults to transparent. */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  /**
   * 
   * @param {Color} fillStyle The fill color of the object. Defaults to "white." Set to "transparent" if no fill is desired.
   * @param {Color} strokeStyle The stroke color of the object. Defaults to "transparent."
   * @param {Number} lineWidth The width of the stroke.
   */
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
  drawScreen(ctx) {
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
window.ScreenRectangle = ScreenRectangle;
export default ScreenRectangle;