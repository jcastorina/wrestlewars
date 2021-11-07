import { createRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useGameContext } from "../hooks/useGameContext";
import { run } from "../run";
import { build } from "../build";
import { listenerContext } from "../behavior";

const S = {
  Surface: styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background: linear-gradient(#989898, #343434);
  `,
};

const Surface = () => {
  const {
    renderer,
    scene,
    camera,
    handleSetReady,
    handleSetRegistry,
    registry,
  } = useGameContext();
  const displayElement = createRef<HTMLDivElement>();
  const [removeListeners] = useState(() =>
    listenerContext()(renderer.domElement)
  );
  const [runMode, setRunMode] = useState(0);

  // build UI
  useEffect(() => {
    const display = displayElement.current;
    if (display && runMode === 0) {
      display.appendChild(renderer.domElement);
      setRunMode(1);
    }
    return () => display?.removeChild(renderer.domElement) as void;
    // eslint-disable-next-line
  }, [displayElement.current]);

  useEffect(() => {
    switch (runMode) {
      case 1:
        build({ scene, camera, handleSetReady, handleSetRegistry });
        console.log(renderer.domElement, "renderer");

        setRunMode(2);
        break;
      case 2:
        run({ scene, camera, renderer, registry });
        setRunMode(3);
        break;
      default:
        break;
    }
    return () => {
      void removeListeners();
      setRunMode(0);
    };
    // eslint-disable-next-line
  }, [runMode]);

  return <S.Surface ref={displayElement} />;
};

export default Surface;
