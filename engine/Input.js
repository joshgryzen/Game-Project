/**
 * Class that abstracts the input for the user
 */
class Input {
  /**
   * The x location of the mouse.
   */
  static mouseX = 0;

  /**
   * The y location of the mouse.
   */
  static mouseY = 0;

  /**
   * The x location of the mouse the previous time it moved.
   */
  static lastMouseX = 0;

  /**
   * The y location of the mouse the previous time it moved.
   */
  static lastMouseY = 0;

  /**
   * The wheel delta the previous time it was changed.
   */
  static lastWheel = 0;

  /**
   * True if the mouse button is down.
   */

  static mouseDown = false;

  static mouseUp = false;

  /**
   * Reset certain values when the frame ends.
   * 
   * <p>
   * Since there is not a wheelStart or wheelEnd event, we have to 
   * "fake" a wheel end by setting this to zero. If we don't, when the 
   * wheel rolls, it will appear to the code that it is still rolling
   * forever.
   * </p>
   */
  static finishFrame() {
    Input.lastWheel = 0;
    Input.lastMouseX = Input.mouseX;
    Input.lastMouseY = Input.mouseY;
    Input.tick = 0;
    Input.mouseUp = false;
  }

  /**
   * Boot the Input class.
   * <p>
   * This attached listeners to all the major UI events.
   * Do not call this multiple times. That would lead to multiple 
   * events being fired when there should only be one.
   * </p>
   */
  //TODO: Prevent the user from calling this multiple times

  static start() {
    //Grab a reference to our canvas
    let canvas = document.querySelector("#canv")

    //Add the mousemove event to the canvas. See https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
    canvas.addEventListener("mousemove", (e) => {
      // console.log(e.clientX + "," + e.clientY)

      // if (Input.mouseDown)
      //   console.log("  " + Input.lastMouseX + ", " + Input.lastMouseY + " " + Input.mouseX + ", " + Input.mouseY)

      // Input.lastMouseX = Input.mouseX;
      // Input.lastMouseY = Input.mouseY;

      Input.mouseX = e.clientX
      Input.mouseY = e.clientY

      // Input.mouseX = 1024
      // Input.mouseY = 541
      // console.log(Input.tick++);
      // if (Input.mouseDown)
      //   console.log("  " + Input.lastMouseX + ", " + Input.lastMouseY + " " + Input.mouseX + ", " + Input.mouseY)
    });

    //Add the mousedown event to the canvas. 
    //See https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event
    canvas.addEventListener("mousedown", (e) => {
      Input.lastMouseX = Input.mouseX;
      Input.lastMouseY = Input.mouseY;

      Input.mouseX = e.clientX
      Input.mouseY = e.clientY
      Input.mouseDown = true;
    });

    //Add the mouseup event to the canvas. 
    //See https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event
    canvas.addEventListener("mouseup", (e) => {
      Input.lastMouseX = Input.mouseX;
      Input.lastMouseY = Input.mouseY;
      Input.mouseX = e.clientX
      Input.mouseY = e.clientY
      Input.mouseDown = false;
      Input.mouseUp = true;
    });

    


    //Add the wheel event to the canvas. Notably, we do not listen for the deprecated mousewheel event.
    //See https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
    canvas.addEventListener("wheel", (e) => {
      Input.lastWheel = e.deltaY;
    });

    //Add the keyup event to the canvas. 
    //See https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
    document.addEventListener("keyup", (e) => { });

    //Add the keydown event to the canvas. 
    //Be careful with this event. Many operating system have a repeating key option 
    //that will call this event repeatedly, even if the user hasn't pushed the key down again.
    //See  https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event.
    document.addEventListener("keydown", (e) => { });

    //Add the keypress event to the canvas. 
    //See https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
    document.addEventListener("keypress", (e) => { });

    //Add the touchstart event to the canvas.
    //Note that this is called if the first touch happens or if an additional touch happens.
    //See  https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event
    canvas.addEventListener("touchstart", (e) => { })

    //Add the touchend event to the canvas.
    //See  https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event
    canvas.addEventListener("touchend", (e) => { })

    //Add the touchmove event to the canvas.
    //Note that all unlike the mousemove event, this call only be triggered
    //If there is already a touch event.
    //See  https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event
    canvas.addEventListener("touchmove", (e) => {
      for (let touchEvent of e.touches) {
        console.log(touchEvent.clientX + ", " + touchEvent.clientX);
      }
      e.preventDefault();
    })

  }
}

//Attach Input to the global window variable
window.Input = Input;
export default Input;