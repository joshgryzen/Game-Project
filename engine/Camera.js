
/**
 * A camera engine-level component
 * 
 * The camera is in charge of:
 * - setting the background color
 * - holding the position and zoom of the virtual camera
 * 
 * The position of the camera is specified in this.transform.x and this.transform.y
 * The scale of the camera is specified in this.transform.sx
 * 
 * This class also has static functions for moving between spaces
 */
class Camera extends Component {
  /** The name of the component */
  name = "Camera"

  /** The fill color of the component */
  fillStyle


  /**
   * Create a camera component. 
   * Has an optional color for the background of the game
   * @param {Color} fillStyle 
   */
  constructor(fillStyle = "white") {
    super();

    //Set the background to fillStyle
    this.fillStyle = fillStyle
  }

  /**
   * Determine how to scale the screen in order to live in a logical screen space
   * @param {CanvasDrawingContext2D} ctx 
   * @returns The scale required to get into logical space
   */
  static getLogicalScale(ctx) {
    let browserAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let browserWidth = ctx.canvas.width
    if (EngineGlobals.requestedAspectRatio <= browserAspectRatio)
      browserWidth -= (ctx.canvas.width - ctx.canvas.height * EngineGlobals.requestedAspectRatio)

    return browserWidth / EngineGlobals.logicalWidth
    // return 1;

  }

  /**
   * Get the scale that world objects use to compensate for
   * logical space *and* the camera zoom.
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @returns The scale that world objects use.
   */
  static getLogicalScaleZoomable(ctx) {
    let browserAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let browserWidth = ctx.canvas.width
    if (EngineGlobals.requestedAspectRatio <= browserAspectRatio)
      browserWidth -= (ctx.canvas.width - ctx.canvas.height * EngineGlobals.requestedAspectRatio)

    return browserWidth / EngineGlobals.logicalWidth * Camera.main.transform.sx;
  }

  /**
   * Figure out the offset in screen space that we need if we are going
   * to draw to the "screen" after considering the letterboxing.
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @returns The x and y in screen space that is 0,0 after letterboxing
   */
  static getZeros(ctx) {
    let browserAspectRatio = ctx.canvas.width / ctx.canvas.height;
    let zeroX = 0;
    let zeroY = 0;
    let browserWidth = ctx.canvas.width

    if (EngineGlobals.requestedAspectRatio > browserAspectRatio)
      zeroY = (ctx.canvas.height - ctx.canvas.width / EngineGlobals.requestedAspectRatio) / 2;
    else
      zeroX = (ctx.canvas.width - ctx.canvas.height * EngineGlobals.requestedAspectRatio) / 2;

    return { zeroX, zeroY };
  }


  /**
   * Transition to move a coordinate in screen space
   * to GUI space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in screen space
   * @param {*} y The y location in screen space
   * @returns An object with the coordinate in GUI space
   */
  static screenToGUI(ctx, x, y) {
    //Get the offset for any letter boxing
    let zeroes = Camera.getZeros(ctx)

    //Get the scale
    let sx = Camera.getLogicalScale(ctx);
    let sy = sx;

    //Compensate for the letter boxes
    x -= zeroes.zeroX;
    y -= zeroes.zeroY;

    //Componesate for the scale
    x /= sx;
    y /= sy;

    return { x, y }
  }

  /**
   * Transition to move a coordinate in screen space
   * to worrld space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in screen space
   * @param {*} y The y location in screen space
   * @returns An object with the coordinate in world space
   */
  static screenToWorld(ctx, x, y) {
    //Get the scale transition
    let sx = Camera.getLogicalScaleZoomable(ctx);
    let sy = sx;

    //Compensate for the origin in world space
    x -= ctx.canvas.width / 2;
    y -= ctx.canvas.height / 2

    //Compensate for the scale
    x /= sx;
    y /= sy;

    //Compensate for any camera offset
    x += Camera.main.transform.x;
    y += Camera.main.transform.y;

    return { x, y }
  }

  /**
   * Transition to move a coordinate in GUI space
   * to screen space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in GUI space
   * @param {*} y The y location in GUI space
   * @returns An object with the coordinate in screen space
   */
  static GUIToScreen(ctx, x, y) {

    //Get the scale
    let logicalScale = Camera.getLogicalScale(ctx);

    //Get the offset of any letter boxing
    let zeroes = Camera.getZeros(ctx, x, y)

    //Compensate for the scale
    x *= logicalScale;
    y *= logicalScale;

    //Compensate for the letter boxing
    x += zeroes.zeroX
    y += zeroes.zeroY;

    return { x, y }
  }

  /**
   * Transition to move a coordinate in GUI space
   * to world space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in GUI space
   * @param {*} y The y location in GUI space
   * @returns An object with the coordinate in world space
   */
  static GUIToWorld(ctx, x, y) {
    
    //Get the scale
    let logicalScale = Camera.getLogicalScale(ctx);

    //Get the scale transition (including any camera zoom)
    let sx = Camera.getLogicalScaleZoomable(ctx);
    let sy = sx;

    //Get the offset of any letter boxing
    let zeroes = Camera.getZeros(ctx, x, y)

    //Compensate for the scale
    x *= logicalScale;
    y *= logicalScale;

    //Compensate for the letter boxing
    x += zeroes.zeroX
    y += zeroes.zeroY;//The move into world space
    
    //Compensate for the origin in world space
    x -= ctx.canvas.width / 2;
    y -= ctx.canvas.height / 2

    //Compensate for the scale
    x /= sx;
    y /= sy;

    //Compensate for any camera offset
    x += Camera.main.transform.x;
    y += Camera.main.transform.y;

    return { x,y}
  }

  /**
   * Transition to move a coordinate in world space
   * to screen space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in world space
   * @param {*} y The y location in world space
   * @returns An object with the coordinate in screen space
   */
  static worldToScreen(ctx, x, y) {
    //Get any scaling
    let sx = Camera.getLogicalScaleZoomable(ctx);
    let sy = sx;

    //Compensate for the camera's location
    x -= Camera.main.transform.x;
    y -= Camera.main.transform.y;

    //Compensate for the scaling
    x *= sx;
    y *= sy;

    //Compensate for the centering of world space
    x += ctx.canvas.width / 2;
    y += ctx.canvas.height / 2;

    return { x, y };
  }

  /**
   * Transition to move a coordinate in world space
   * to GUI space
   * 
   * @param {CanvasDrawingContext2D} ctx The drawing context
   * @param {*} x The x location in world space
   * @param {*} y The y location in world space
   * @returns An object with the coordinate in GUI space
   */
  static worldToGUI(ctx, x, y) {
    //Get any scaling (including the camera zoom)
    let sxz = Camera.getLogicalScaleZoomable(ctx);
    let syz = sxz;

    //Get the scale
    let sx = Camera.getLogicalScale(ctx);
    let sy = sx;

    //Get any letter boxing
    let zeroes = Camera.getZeros(ctx)


    //Compensate for the camera's location
    x -= Camera.main.transform.x;
    y -= Camera.main.transform.y;

    //Compensate for the scaling
    x *= sxz;
    y *= syz;

    //Compensate for the centering of world space
    x += ctx.canvas.width / 2;
    y += ctx.canvas.height / 2;

    //Compensate for the letter boxes
    x -= zeroes.zeroX;
    y -= zeroes.zeroY;

    //Componesate for the scale
    x /= sx;
    y /= sy;

    return {x,y};
  }

  /**
   * Return a reference to the camera component
   * @returns A reference to the camera component
   */
  static get main() {
    let scene = SceneManager.getActiveScene();

    //The camera is the first game object's second component
    //(The first component is a transform.)
    return scene.gameObjects[0].components[1]
  }
}

//Add circle to the global namespace.
window.Camera = Camera;