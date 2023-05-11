// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/GUITextCentered.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class GUITextCentered extends Component {
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
        let measurements = ctx.measureText(this.string)

        ctx.fillText(
            this.string,
            this.transform.x - measurements.width / 2,
            this.transform.y + measurements.actualBoundingBoxAscent / 2
        )
    }
}

//Add text to the global window object.
window.GUITextCentered = GUITextCentered
