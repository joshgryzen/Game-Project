/**
 * The time class
 * Make static calls to this class to get timing information
 * 
 * Notable differences from Unity:
 * - We do not allow for time to be scaled (sped up or slowed down)
 * - We only update at a fixed rate, so deltaTime maps to fixedDeltaTime in Unity
 * - We don't store time values in different formats because js is dynamically typed
 */
class Time{
  /** The time in seconds between frames */
  static deltaTime = 1/60

  /** The time in seconds since the first frame */
  static time = 0

  /** The number of frames since the game started */
  static frameCount = 0

  /**
   * Update the dynamic time values
   */
  static update(){
    Time.time += Time.deltaTime
    Time.frameCount++;
  }
}

window.Time = Time
export default Time;