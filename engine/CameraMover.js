/**
 * Move the camera with the left mouse button and scroll wheel.
 * 
 * <p>
 * If the author wants the camera to be moved with the left mouse button and the 
 * scroll wheel, the the author needs to attach this to one game object in the scene 
 * in which this is desired.
 * </p>
 */
class CameraMover extends Component {
  /**
   * Update the location and scale of the camera based on the state of the input.
   * 
   * @param {CanvasRenderingContext2D} ctx The drawing context.
   */
  first = true
  update(ctx) {
    //Get a reference to the main camera component
    let camera = Camera.main;
    // console.log(camera.transform.x + ", " + camera.transform.y)

    if (!this.first) {
      this.first = true;
      // camera.transform.sx = 1.5;
      // camera.transform.sy = 1.5;

      console.log(camera.transform.y)

      let offsetX = 0;
      let offsetY = 100;
      // console.log(`${offsetX}, ${offsetY}`)
      let scale = Camera.getLogicalScaleZoomable(ctx);
      // camera.transform.x += offsetX / scale;
      // camera.transform.y += offsetY / scale;
      // camera.transform.x += offsetX / scale;
      // camera.transform.y += offsetY / scale;
      // console.log(camera.transform.y)

      camera.transform.x = 20;
      camera.transform.y = 0;



      return
    }
    // console.log(Input.mouseX + ", " + Input.mouseY + " " + ctx.canvas.height);


    //Update based on whether the mouse button is down
    if (Input.mouseDown) {
      let offsetX = Input.lastMouseX - Input.mouseX;
      let offsetY = Input.lastMouseY - Input.mouseY;
      if (Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1)

        if (offsetX || offsetY) {
          console.log(`${offsetX}, ${offsetY}, ${camera.transform.x}, ${camera.transform.y}`)
          let scale = Camera.getLogicalScaleZoomable(ctx);

          //let done = Camera.screenToWorld(ctx, offsetX, offsetY)
          let start = Camera.screenToWorld(ctx, Input.mouseX, Input.mouseY);
          let end = Camera.screenToWorld(ctx,Input.lastMouseX, Input.lastMouseY);
          
          camera.transform.x += end.x-start.x;
          camera.transform.y += end.y -start.y;
        }

      // console.log(Input.lastMouseX + ", " + Input.lastMouseY + " " + Input.mouseX + ", " + Input.mouseY + " " + offsetX + ", " + offsetY)
    }

    //Update based on whether the wheel has been rolled.
    if (Input.lastWheel) {
      // console.log(Input.lastWheel);
      //If the author wants the effect reversed, 
      //simple reverse this if conditional
      if (Input.lastWheel > 0 /* Input.lastWheel <= 0 */) {
        camera.transform.sx *= 1.1;
        camera.transform.sy *= 1.1;
      }
      else {
        camera.transform.sx /= 1.1;
        camera.transform.sy /= 1.1;
      }
    }

  }
}

//Attach this class to the global window object.
window.CameraMover = CameraMover;
export default CameraMover;