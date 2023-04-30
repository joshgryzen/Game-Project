/**
 * The transform component.
 * This stores the position of the game object in 2D (x,y),
 * the scale of the game object (sx,sy),
 * and the rotation of the component, r).
 * 
 * All game objects have a transform. If more than one transform 
 * are attached to a game object, only the one and index 0 will
 * be used. It is best practice not to have multiple Transform instances
 * on a game objects.
 */
class Transform extends Component{
  /** The name of the component. Defaults to "Transform" */
  name = "Transform"

  /** The x position of the transform. Defaults to 0. */
  x = 0

  /** The y position of the transform. Defaults to 0. */
  y = 0

  /** The scale in the x axis. Defaults to 1 */
  sx = 1

  /** The scale in the y axis. Defaults to 1. */
  sy = 1

  /** The rotation. Defaults to 0 */
  r = 0

  /**
   * Designed primarily for lines, the factory function 
   * Determins the x, y, scale, and rotation given a from and to point.
   * 
   * @param {Number} startX The start location x for the new transform.
   * @param {Number} startY The start location y for the new transform.
   * @param {Number} endX The end location x for the new transform.
   * @param {Number} endY The end location y for the new transform.
   */
  static fromTo(startX, startY, endX, endY){
    let t = new Transform();
    t.x = (startX + endX)/2
    t.y = (startY + endY)/2
    let length = Math.sqrt((startX - endX)**2+(startY - endY)**2)
    t.sx = length/2
    t.sy = 1
    t.r = Math.atan2((endY - startY), (endX - startX));

    return t;
  }
}

window.Transform = Transform;