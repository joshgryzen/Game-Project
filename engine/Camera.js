
/**
 * A camera engine-level component
 * 
 * The camera is in charge of:
 * - setting the background color
 * - holding the position and zoom of the virtual camera
 * 
 * The position of the camera is specified in this.transform.x and this.transform.y
 * The scale of the camera is specified in this.transform.sx
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
     * Return a reference to the camera component
     */
    static get main(){
      let scene = SceneManager.getActiveScene();

      //The camera is the first game object's second component
      //(The first component is a transform.)
      return scene.gameObjects[0].components[1]
    }
  }
  
  //Add circle to the global namespace.
  window.Camera = Camera;