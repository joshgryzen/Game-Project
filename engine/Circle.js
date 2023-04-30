/**
 * A circle engine-level component
 */
class Circle extends Component {
  /** The name of the component */
  name = "Circle"

  /** The fill color of the component */
  fillStyle

  /** The stroke color of the component */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  /**
   * Create a circle component. 
   * Has an optional color for fillStyle
   * @param {Color} fillStyle The fill color of the circle. Defaults to white.
   * @param {Color} strokeStyle The outline color of the circle. Defaults to transparent.
   * @param {Number} lineWidth The thickness of the outline. Defaults to 1.
   */
  constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1) {
    super();
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth;
  }

  /**
   * Draw the circle to the given context.
   * @param {CanvasRenderingContext2D} ctx The context to draw to.
   */
  draw(ctx) {
    //Set the fill style
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth

    
    // Draw the circle
    ctx.beginPath()
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke();
  }
}

//Add circle to the global namespace.
window.Circle = Circle;