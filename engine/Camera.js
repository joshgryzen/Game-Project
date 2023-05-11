// Transcribed from https://github.com/CS2510/Spring2023.Day15Starter/blob/main/engine/Camera.js
//
// Ricks, B (2023) CS2510 Game Engine (Spring2023.Day15Starter) [Source code]. https://github.com/CS2510/Spring2023.Day15Starter

class Camera extends Component {
    name = 'Camera'
    fillStyle

    constructor(fillStyle = 'white') {
        super()

        // Set the background to fillStyle
        this.fillStyle = fillStyle
    }

    static getLogicalScale(ctx) {
        let browserAspectRatio = ctx.canvas.width / ctx.canvas.height
        let browserWidth = ctx.canvas.width
        if (EngineGlobals.requestedAspectRatio <= browserAspectRatio)
            browserWidth -=
                ctx.canvas.width -
                ctx.canvas.height * EngineGlobals.requestedAspectRatio

        return browserWidth / EngineGlobals.logicalWidth
    }

    static getLogicalScaleZoomable(ctx) {
        let browserAspectRatio = ctx.canvas.width / ctx.canvas.height
        let browserWidth = ctx.canvas.width
        if (EngineGlobals.requestedAspectRatio <= browserAspectRatio)
            browserWidth -=
                ctx.canvas.width -
                ctx.canvas.height * EngineGlobals.requestedAspectRatio

        return (
            (browserWidth / EngineGlobals.logicalWidth) *
            Camera.main.transform.sx
        )
    }

    static getZeros(ctx) {
        let browserAspectRatio = ctx.canvas.width / ctx.canvas.height
        let zeroX = 0
        let zeroY = 0
        let browserWidth = ctx.canvas.width

        if (EngineGlobals.requestedAspectRatio > browserAspectRatio)
            zeroY =
                (ctx.canvas.height -
                    ctx.canvas.width / EngineGlobals.requestedAspectRatio) /
                2
        else
            zeroX =
                (ctx.canvas.width -
                    ctx.canvas.height * EngineGlobals.requestedAspectRatio) /
                2

        return { zeroX, zeroY }
    }

    static screenToGUI(ctx, x, y) {
        // Get the offset for letter boxing
        let zeroes = Camera.getZeros(ctx)

        // Get the scale
        let sx = Camera.getLogicalScale(ctx)
        let sy = sx

        // Compensate for letter boxes
        x -= zeroes.zeroX
        y -= zeroes.zeroY

        // Componesate for scale
        x /= sx
        y /= sy

        return { x, y }
    }

    static screenToWorld(ctx, x, y) {
        // Get scale transition
        let sx = Camera.getLogicalScaleZoomable(ctx)
        let sy = sx

        // Compensate for the origin in world space
        x -= ctx.canvas.width / 2
        y -= ctx.canvas.height / 2

        // Compensate for scale
        x /= sx
        y /= sy

        // Compensate for camera offset
        x += Camera.main.transform.x
        y += Camera.main.transform.y

        return { x, y }
    }

    static GUIToScreen(ctx, x, y) {
        // Get the scale
        let logicalScale = Camera.getLogicalScale(ctx)

        // Get the offset of letter boxing
        let zeroes = Camera.getZeros(ctx, x, y)

        // Compensate for scale
        x *= logicalScale
        y *= logicalScale

        // Compensate for letter boxing
        x += zeroes.zeroX
        y += zeroes.zeroY

        return { x, y }
    }

    static GUIToWorld(ctx, x, y) {
        // Get the scale
        let logicalScale = Camera.getLogicalScale(ctx)

        // Get the scale transition (including any camera zoom)
        let sx = Camera.getLogicalScaleZoomable(ctx)
        let sy = sx

        // Get the offset of any letter boxing
        let zeroes = Camera.getZeros(ctx, x, y)

        // Compensate for the scale
        x *= logicalScale
        y *= logicalScale

        // Compensate for the letter boxing
        x += zeroes.zeroX
        y += zeroes.zeroY

        // Compensate for the origin in world space
        x -= ctx.canvas.width / 2
        y -= ctx.canvas.height / 2

        // Compensate for the scale
        x /= sx
        y /= sy

        // Compensate for any camera offset
        x += Camera.main.transform.x
        y += Camera.main.transform.y

        return { x, y }
    }

    static worldToScreen(ctx, x, y) {
        // Get any scaling
        let sx = Camera.getLogicalScaleZoomable(ctx)
        let sy = sx

        // Compensate for the camera's location
        x -= Camera.main.transform.x
        y -= Camera.main.transform.y

        // Compensate for the scaling
        x *= sx
        y *= sy

        // Compensate for the centering of world space
        x += ctx.canvas.width / 2
        y += ctx.canvas.height / 2

        return { x, y }
    }

    static worldToGUI(ctx, x, y) {
        // Get any scaling (including the camera zoom)
        let sxz = Camera.getLogicalScaleZoomable(ctx)
        let syz = sxz

        // Get the scale
        let sx = Camera.getLogicalScale(ctx)
        let sy = sx

        // Get any letter boxing
        let zeroes = Camera.getZeros(ctx)

        // Compensate for the camera's location
        x -= Camera.main.transform.x
        y -= Camera.main.transform.y

        // Compensate for the scaling
        x *= sxz
        y *= syz

        // Compensate for the centering of world space
        x += ctx.canvas.width / 2
        y += ctx.canvas.height / 2

        // Compensate for the letter boxes
        x -= zeroes.zeroX
        y -= zeroes.zeroY

        // Componesate for the scale
        x /= sx
        y /= sy

        return { x, y }
    }

    static get main() {
        let scene = SceneManager.getActiveScene()

        // The camera is the first game object's second component
        // (The first component is a transform.)
        return scene.gameObjects[0].components[1]
    }
}

window.Camera = Camera
