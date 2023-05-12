// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/GUITextCentered.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class GUITextCentered extends Component {
    name = 'GUIText'

    fillStyle

    string

    font

    constructor(string, fillStyle = 'white', font = '20px Arial') {
        super()
        this.fillStyle = fillStyle
        this.string = string
        this.font = font
    }

    drawGUI(ctx) {
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

window.GUITextCentered = GUITextCentered
