// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Text.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Text extends Component {
    /** The name of the component */
    name = 'Text'

    /** The fill color of the component */
    fillStyle

    /** The string to draw */
    string

    font
    /**
     * Create a text component.
     * Has an optional color for fillStyle
     * @param {Color} fillStyle
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
    draw(ctx) {
        //Set the fill style
        ctx.fillStyle = this.fillStyle
        ctx.font = this.font
        ctx.fillText(this.string, this.transform.x, this.transform.y)
    }
}

//Add text to the global namespace.
window.Text = Text
