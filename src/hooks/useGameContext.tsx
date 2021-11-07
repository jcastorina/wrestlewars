import React, { createContext, useContext, useState } from "react";
import { WebGLRenderer, PerspectiveCamera, Scene, Object3D } from "three";

const ASPECT_RATIO = 16 / 9;
const NEAR_CLIP = 0.1;
const FAR_CLIP = 1000;
const WIDTH = 1200;
const HEIGHT = Math.floor(WIDTH / ASPECT_RATIO);
const vmouse = { x: 0, y: 0 };
const scene = new Scene();
const camera = new PerspectiveCamera(75, ASPECT_RATIO, NEAR_CLIP, FAR_CLIP);
const renderer = new WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

export type GameObject = Object3D & {
  update: () => void;
};

export type Me = {
  mouse: {
    current: {
      x: number;
      y: number;
    };
  };
};

const initialState = {
  ASPECT_RATIO,
  NEAR_CLIP,
  FAR_CLIP,
  WIDTH,
  HEIGHT,
  scene,
  camera,
  renderer,
  handleSetReady: async (ready: boolean): Promise<void> => undefined,
  handleSetRegistry: async (registry: any[]): Promise<void> => undefined,
  handleSetMe: async (me: Me): Promise<void> => undefined,
  vmouse,
  handleSetVmouse: async (vmouse: { x: number; y: number }): Promise<void> =>
    undefined,
  handleSetLockedMouse: async (lockedMouse: boolean): Promise<void> =>
    undefined,
  me: {} as Me,
  isReady: false,
  registry: [] as any[],
  lockedMouse: false,
  atiles: [],
  handleSetAtiles: async (tiles: []): Promise<void> => undefined
};

const Context = createContext({ ...initialState });

export const ContextProvider = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [registry, setRegistry] = useState<any[]>([]);
  const [atiles, setAtiles] = useState([]);
  const [_vmouse, setVmouse] = useState(vmouse);
  const [lockedMouse, setLockedMouse] = useState(false);
  const [me, setMe] = useState<Me>({
    mouse: {
      current: {
        x: 0,
        y: 0,
      },
    },
  });

  const handleSetReady = async (ready: boolean) => {
    setIsReady(ready);
  };

  const handleSetRegistry = async (registry: any[]) => {
    setRegistry((r) => [...r, ...registry]);
  };

  const handleSetMe = async (event: Partial<Me>) => {
    setMe((me) => ({ ...me, event }));
  };

  const handleSetVmouse = async (vmouse: { x: number; y: number }) => {
    setVmouse(vmouse);
  };

  const handleSetLockedMouse = async (lockedMouse: boolean) => {
    setLockedMouse(lockedMouse);
  };

  const handleSetAtiles = async (tiles: []) => {
    setAtiles(tiles);
  }

  const gameContextReturn = {
    ...initialState,
    isReady,
    handleSetReady,
    registry,
    handleSetRegistry,
    handleSetMe,
    me,
    vmouse: _vmouse,
    handleSetVmouse,
    lockedMouse,
    handleSetLockedMouse,
    handleSetAtiles,
    atiles
  };

  return (
    <Context.Provider value={gameContextReturn} {...rest}>
      {children}
    </Context.Provider>
  );
};

export const useGameContext = () => useContext(Context);
