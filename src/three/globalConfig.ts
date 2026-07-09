import * as THREE from "three";
import { TimeTracker } from "./utils/timeTracker";

export const globalConfig = {
  timeTracker: new TimeTracker(),
  threeJsBackgroundColor: 0x243447,
  mainCameraSettings: {
    renderDistanceMin: 0.1,
    renderDistanceMax: 135,
    initialCameraPosition: {
      x: 0,
      y: 80,
      z: 58,
    },
  },
  frontPageRendererSettings: {
    rendererPixelRatio: 0.65,
  },
  ufoSceneSettings: {
    ufoCount: 3,
  },
  waveSceneSettings: {
    lightColors: [
      0x0e09dc, // Blue
      0x8c2700, // Cyan
      0x00786e, // Red
      0xee3bcf, // Purple
    ],
    waveHeight: {
      xCoef: 50,
      yCoef: 50,
      zCoef: 8,
    },
  },
  dotSceneSettings: {
    pixelsPerDot: 17500,
    maxLineCount: 150,
    dotCellSize: 25,
    dotCountMax: 65,
  },
  dotSettings: {
    dotRadius: 0.35,
    dotCameraDistanceSettings: {
      maxZCameraDistance: 130,
      minZCameraDistance: 30,
    },
    dotColorGradient: {
      near: new THREE.Color(0xbdbdbd),
      far: new THREE.Color(0x084eff),
    },
  },
};
