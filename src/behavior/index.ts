let vmouse = {x: 0, y: 0};
let lockedMouse = false;
const me = {
    mouse: {
        current: {
            x: 0,
            y: 0
        }
    }
}

export const listenerContext = () => {
  const MOUSE_SENSITIVITY = 200;

  return (element: HTMLElement) => {
    const handleClick = (e: MouseEvent) => {
      element.requestPointerLock();
      lockedMouse = true;
  
    };

    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape") {
        lockedMouse = false;
      }
      
    };

    const handleKeyUp = (event: KeyboardEvent) => {};

    const handleMouseMove = (event: MouseEvent) => {
      if (lockedMouse) {
        vmouse.x = (event.clientX / element.clientWidth) * 2 - 1;
        vmouse.y = -(event.clientY / element.clientHeight) * 2 + 1;

        me.mouse.current.x += event.movementX / MOUSE_SENSITIVITY;
        me.mouse.current.y += event.movementY / MOUSE_SENSITIVITY;
        console.log(event)
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
    };
  };
};
