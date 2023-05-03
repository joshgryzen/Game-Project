import './SceneManager.js'
import './Component.js'
import './Scene.js'
import './GameObject.js'
import './Transform.js'
import './Circle.js'
import './Camera.js'
import './Rectangle.js'
import './GUIRectangle.js'
import './GUIText.js'
import './GUITextCentered.js'
import './ScreenRectangle.js'
import './Line.js'
import './Text.js'
import './Vector2.js'
import './Time.js'
import './Input.js'
import './CameraMover.js'

class EngineGlobals {
    static requestedAspectRatio = 16 / 9
    static logicalWidth = 1
}

window.EngineGlobals = EngineGlobals

//True if the gamee is paused, false otherwise
let pause = false

//Add an aspect ratio
//Add logical coordinates

//Handle favicon
const link = document.createElement('link')
link.href =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%3E%3Ctext%20x='0'%20y='14'%3E🎮%3C/text%3E%3C/svg%3E"
link.rel = 'icon'
document.getElementsByTagName('head')[0].appendChild(link) // for IE6

//-----------------------------------------------------------
//Input Event handling
//-----------------------------------------------------------

//Get references to the canvas element and
//the 2d context
let canvas = document.querySelector('#canv')
let ctx = canvas.getContext('2d')

//Store the state of the user input
//This will be in its own file eventually
let keysDown = []
let mouseX
let mouseY

//Add event handlers so we capture user input
//Note the strings has to be all lowercase, e.g. keydown not keyDown or KeyDown
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

//Key up event handlers
function keyUp(e) {
    keysDown[e.key] = false

    //Pause functionality
    if (e.key == 'p') {
        pause = !pause
    }
}

//Key down event handlers.
//Remember that key down can be triggered
//Multiple times without a keyup event
//If the user hold the key down ("repated keys")
function keyDown(e) {
    keysDown[e.key] = true

    //To prevent scrolling (if needed)
    //This has to be in keyDown, not keyup
    if (e.key == ' ') {
        e.preventDefault()
    }
}

//-----------------------------------------------------------
//Game Loop
//-----------------------------------------------------------

/**
 * The engine's game loop.
 * This should never be called by game code.
 * Internally, this is called every Time.deltaTime seconds.
 *
 * The game loop updates the game and then draws the game
 */
function gameLoop() {
    update()
    draw()
}

/**
 * The update part of the game loop.
 *
 * This function should never by called by game code.
 */
function update() {
    //Match the size of the canvas to the browser's size
    //This allows us to respond to browser size changes
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    //Handle the case when there is a system level pause.
    if (pause) return

    Time.update()

    //Get a reference to the active scene.
    let scene = SceneManager.getActiveScene()
    if (SceneManager.changedSceneFlag && scene.start) {
        let camera = scene.gameObjects[0]
        scene.gameObjects = []
        scene.gameObjects.push(camera)

        //Loop through the objects from the previous scene
        //so can preserve some
        let previousScene = SceneManager.getPreviousScene()
        if (previousScene) {
            for (let gameObject of previousScene.gameObjects) {
                if (gameObject.markedDoNotDestroyOnLoad) {
                    scene.gameObjects.push(gameObject)
                }
            }
        }

        scene.start(ctx)
        SceneManager.changedSceneFlag = false
    }

    //Start any game objects that can be started
    //but have not.
    for (let gameObject of scene.gameObjects) {
        if (gameObject.start && !gameObject.started) {
            gameObject.start(ctx)
            gameObject.started = true
        }
    }

    //Start any components that can be started
    //but have not.
    for (let gameObject of scene.gameObjects) {
        for (let component of gameObject.components) {
            if (component.start && !component.started) {
                component.start(ctx)
                component.started = true
            }
        }
    }

    //Handle destroy here
    let keptGameObjects = []
    for (let gameObject of scene.gameObjects) {
        if (!gameObject.markedForDestroy) {
            keptGameObjects.push(gameObject)
        }
    }
    scene.gameObjects = keptGameObjects

    //Call update on all components with an update function
    for (let gameObject of scene.gameObjects) {
        for (let component of gameObject.components) {
            if (component.update) {
                component.update(ctx)
            }
        }
    }
    Input.finishFrame()
}

let letterboxColor = 'gray'

/**
 * The draw part of the game loop.
 *
 * This should never be called directly from game code.
 */
function draw() {
    //Adjust for the camera
    ctx.fillStyle = Camera.main.fillStyle
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let browserAspectRatio = canvas.width / canvas.height
    let offsetX = 0
    let offsetY = 0
    let browserWidth = canvas.width
    if (EngineGlobals.requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / EngineGlobals.requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        offsetY = amount
    } else {
        let desiredWidth = canvas.height * EngineGlobals.requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        offsetX = amount
        browserWidth -= 2 * amount
    }

    let scene = SceneManager.getActiveScene()

    ctx.save()
    // let logicalScaling = browserWidth / EngineGlobals.logicalWidth * Camera.main.transform.sx;
    let logicalScaling = Camera.getLogicalScaleZoomable(ctx)
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.scale(logicalScaling, logicalScaling)

    //ctx.scale(Camera.main.transform.sx, Camera.main.transform.sy);
    ctx.translate(-Camera.main.transform.x, -Camera.main.transform.y)

    //Calculate the min and max layer
    //Map/Reduce
    let min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.draw))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    let max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.draw))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    //Loop through the components and draw them.
    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.draw) {
                    component.draw(ctx)
                }
            }
        }
    }

    ctx.restore()

    //Now draw the letterboxes
    let zeroX = 0
    let zeroY = 0
    if (EngineGlobals.requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / EngineGlobals.requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        zeroY = amount
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, canvas.width, amount)
        ctx.fillRect(0, canvas.height - amount, canvas.width, amount)
    } else {
        let desiredWidth = canvas.height * EngineGlobals.requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        zeroX = amount
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, amount, canvas.height)
        ctx.fillRect(canvas.width - amount, 0, amount, canvas.height)
    }

    //Now draw any UI. Note we do this after we draw the letterboxes.
    logicalScaling = Camera.getLogicalScale(ctx)
    min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawGUI))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawGUI))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    //Loop through the components and draw them.
    ctx.save()
    ctx.translate(zeroX, zeroY)
    ctx.scale(logicalScaling, logicalScaling)
    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.drawGUI) {
                    component.drawGUI(ctx)
                }
            }
        }
    }
    ctx.restore()

    //Now draw directly on the screen
    ctx.save()
    min = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawScreen))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current), 0)

    max = scene.gameObjects
        .filter((go) => go.components.some((c) => c.drawScreen))
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current), 0)

    //Loop through the components and draw them.
    ctx.save()
    for (let i = min; i <= max; i++) {
        let gameObjects = scene.gameObjects.filter((go) => go.layer == i)

        for (let gameObject of gameObjects) {
            for (let component of gameObject.components) {
                if (component.drawScreen) {
                    component.drawScreen(ctx)
                }
            }
        }
    }
    ctx.restore()

    //Draw debugging information
    let debug = false
    if (debug) {
        let y = 50
        for (let gameObject of scene.gameObjects) {
            ctx.fillStyle = 'white'
            ctx.font = '20px Courier'
            let string =
                gameObject.name +
                ' (' +
                gameObject.transform.x +
                ',' +
                gameObject.transform.y +
                ')'
            ctx.fillText(string, 0, y)
            y += 20
        }
    }
}

/**
 * Set the browser tab title, parse any settings, and start the game loop.
 * @param {string} title The title of the browser window
 * @param {Object} settings The settings for the engine to parse. Defaults to an empty object.
 *
 * The engine accepts the following settings. Any other keys on the settings object are ignored.
 * - aspectRatio. The aspect ratio requested by the game. Defaults to 16/9
 * - letterboxColor. The color of the letterboxing bars. To remove letterboxing, use "transparent". Defaults to black.
 * - logicalWidth. The logical width of the game. The engine will scale the drawing area to support this logical width. Defaults to 100.
 */
function start(title, settings = {}) {
    //Boot the input event handlers
    Input.start()

    //Match the size of the canvas to the browser's size
    //This allows us to respond to browser size changes
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    document.title = title
    if (settings) {
        EngineGlobals.requestedAspectRatio = settings.aspectRatio
            ? settings.aspectRatio
            : 16 / 9
        letterboxColor = settings.letterboxColor
            ? settings.letterboxColor
            : 'black'
        EngineGlobals.logicalWidth = settings.logicalWidth
            ? settings.logicalWidth
            : 100
    }

    //Run the game loop 25 times a second
    setInterval(gameLoop, 1000 * Time.deltaTime)
}

//Add certain functions to the global namespace
//This allows us to call these functions without
//a prefix, which better matches Unity

/** Start the game in 'play mode1 */
window.start = start

/** Expose the update calls for the testing routines */
window.engineUpdate = update
window.engineDraw = draw

/** The state of the keyboard.. */
window.keysDown = keysDown
