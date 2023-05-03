/**
 * A rectangle component that draws on the GUI engine-level component
 */
class GUIRectangle extends Component {
  /** The name of the component */
  name = "GUIRectangle"

  /** The fill color. Defaults to white. */
  fillStyle

  /** The color of the stroke. Defaults to transparent. */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  /**
   * Creates a new instance of the class
   * 
   * @param {Color} fillStyle The fill color of object. Use "transparent" if no fill is desired. Defaults to "white."
   * @param {Color} strokeStyle The stroke color of the object. Defaults to "transparent."
   * @param {Number} lineWidth The width of the stroke. Defaults to 1.
   */
  constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1){
    super()
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth
  }

  /**
   * Draw the object to the given context.
   * @param {2DContext} ctx The context to draw to
   */
  drawGUI(ctx) {
    //Set the fill style
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth

    // Draw the object
    ctx.beginPath()
    ctx.rect(-this.transform.sx/2 + this.transform.x, -this.transform.sy/2 + this.transform.y,this.transform.sx, this.transform.sy);
    ctx.fill()
    ctx.stroke()
  }
}

//Add object to the global namespace.
window.GUIRectangle = GUIRectangle;