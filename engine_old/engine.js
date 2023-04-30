import './SceneManager.js'
import './Component.js'
import './Scene.js'
import './GameObject.js'
import './Transform.js'
import './Circle.js'
import './Camera.js'
import './Vector2.js'
import './Rectangle.js'
import './Time.js'
import './Line.js'

//True if the gamee is paused, false otherwise
let pause = false

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

document.addEventListener('mousedown', mouseDown)
document.addEventListener('mouseup', mouseUp)
document.addEventListener('mousemove', mouseMove)

//Mouse event handlers
function mouseDown(e) {
    //console.log("mouseDown: " + e.clientX + " " + e.clientY)
}
function mouseUp(e) {
    //console.log("mouseUp: " + e.clientX + " " + e.clientY)
}
function mouseMove(e) {
    //console.log("mouseMove: " + e.clientX + " " + e.clientY)
}

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

//Update the engine
function engineUpdate() {
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
        scene.start()
        SceneManager.changedSceneFlag = false
    }

    //Start any game objects that can be started
    //but have not.
    for (let gameObject of scene.gameObjects) {
        if (gameObject.start && !gameObject.started) {
            gameObject.start()
            gameObject.started = true
        }
    }

    //Start any components that can be started
    //but have not.
    for (let gameObject of scene.gameObjects) {
        for (let component of gameObject.components) {
            if (component.start && !component.started) {
                component.start()
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
                component.update()
            }
        }
    }
}

let requestedAspectRatio = 16 / 9
let logicalWidth = 1
let letterboxColor = 'gray'

//Draw all the objects in the scene
function engineDraw() {
    //Adjust for the camera
    ctx.fillStyle = Camera.main.fillStyle
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let browserAspectRatio = canvas.width / canvas.height
    let offsetX = 0
    let offsetY = 0
    let browserWidth = canvas.width
    if (requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        offsetY = amount
    } else {
        let desiredWidth = canvas.height * requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        offsetX = amount
        browserWidth -= 2 * amount
    }

    let scene = SceneManager.getActiveScene()

    ctx.save()
    let logicalScaling = browserWidth / logicalWidth
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.scale(logicalScaling, logicalScaling)

    ctx.translate(-Camera.main.transform.x, -Camera.main.transform.y)

    //Calculate the min and max layer
    //Map/Reduce
    let min = scene.gameObjects
        .map((go) => go.layer)
        .reduce((previous, current) => Math.min(previous, current))

    let max = scene.gameObjects
        .map((go) => go.layer)
        .reduce((previous, current) => Math.max(previous, current))

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

    if (requestedAspectRatio > browserAspectRatio) {
        let desiredHeight = canvas.width / requestedAspectRatio
        let amount = (canvas.height - desiredHeight) / 2
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, canvas.width, amount)
        ctx.fillRect(0, canvas.height - amount, canvas.width, amount)
    } else {
        let desiredWidth = canvas.height * requestedAspectRatio
        let amount = (canvas.width - desiredWidth) / 2
        ctx.fillStyle = letterboxColor
        ctx.fillRect(0, 0, amount, canvas.height)
        ctx.fillRect(canvas.width - amount, 0, amount, canvas.height)
    }

    //Check if it's too wide
    //Calculate the letter boxing amount
    //Fill the letter boxes

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
            ctx.fillText(string, 50, y)
            y += 20
        }
    }
}

/**
 * Start the game and set the browser tabe title
 * @param {string} title The title of teh browser window
 */
function start(title) {
    document.title = title
    function gameLoop() {
        engineUpdate()

        engineDraw()
    }

    //Run the game loop 25 times a second
    // setInterval(gameLoop, 1000 / 60)
    setInterval(gameLoop, 1000 * Time.deltaTime)
}

/**
 * Test the game.
 * Runs a series of test on the game.
 * @param {string} title The title of the game. See start(title) for more details
 * @param {object} options The options object.
 *
 * The options are as follows:
 * maxFrames: The number of frames to run in the test.
 * Note that teh default is 100 frames if maxFrames is not defined.
 */
function test(title, options = {}) {
    //Surround with a try so that if there is an error,
    //We can display it in the browser
    try {
        //Set the title
        document.title = title

        //Set maxFrames to either the parameter passed in
        //or the default value otherwise.
        let maxFrames = options.maxFrames ? options.maxFrames : 100

        //Emulate the game loop by running for a set number of iterations
        for (let i = 0; i < maxFrames; i++) {
            engineUpdate()
            engineDraw()
        }

        //Call the done function if provided
        if (options.done) {
            options.done(ctx)
        }
    } catch (exception) {
        //Update the browser window to show that there is an error.
        failTest()

        //Rethrow the exception so the user can know what line the error
        //is on, etc.
        throw exception
    }
}

//Called when tests fail.
function failTest() {
    //Draw a red x if a test failed.
    ctx.font = '20px Courier'
    ctx.fillText('❌', 9, 20)
    console.log('An exception was thrown')
}

//Set to truthy if we want to see the name of each test that was passed
//If false, only the final result (passed or failed) is displayed
//without poluting the console.
let verboseDebug = true

//Called when a test is passed
function passTest(description) {
    //Output the result to the console
    //if verbose debugging is on.
    if (verboseDebug) {
        console.log('Passed test: ' + description)
    }
}

//Called when all tests are passed.
//Draw a green checkmark in the browser
//if all tests were passed
function passTests() {
    ctx.font = '20px Courier'
    ctx.fillText('✅', 9, 20)
    console.log('Called passTests')
}

/**
 * Simple unit test function.
 * If the first parameter evaluates to true,
 * the test passes.
 * Otherwise, the test fails.
 * @param {boolean} boolean
 * @param {string} description
 */
function assert(boolean, description = '') {
    //Handle the failed test case
    if (!boolean) {
        failTest(description)
    }
    //Handle the passed test case
    else {
        if (description) passTest(description)
    }
}

//Add certain functions to the global namespace
//This allows us to call these functions without
//a prefix, which better matches Unity

/** Start the game in 'play mode1 */
window.start = start

/** Start the test.*/
window.test = test

/** A reference to our unit test function */
window.assert = assert

/** A reference to the pass tests function.
 * Called by test code when all tests have passed
 * */
window.passTests = passTests

/** The state of the keyboard.. */
window.keysDown = keysDown
