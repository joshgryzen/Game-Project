/**
 * A text engine-level component
 */
class GUIText extends Component {
    /** The name of the component */
    name = 'GUIText'

    /** The fill color of the component */
    fillStyle

    /** The string to draw */
    string

    font
    /**
     * Create a text component.
     * Has an optional color for fillStyle
     * @param {Color} fillStyle The fill style of the text. Defaults to "white".
     * @param {Font} font The font to use. Defaults to "20px Arial".
     */
    constructor(string, fillStyle = 'white', font = '20px Arial') {
        super()
        this.fillStyle = fillStyle
        this.string = string
        this.font = font
    }

    /**
     * Draw the text to the given context.
     * @param {2DContext} ctx The context to draw to.
     */
    drawGUI(ctx) {
        //Set the fill style
        ctx.fillStyle = this.fillStyle
        ctx.font = this.font
        ctx.fillText(this.string, this.transform.x, this.transform.y)
    }
}

//Add text to the global window object.
window.GUIText = GUIText
