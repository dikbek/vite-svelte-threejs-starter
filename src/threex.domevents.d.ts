// Created by @ahilbig

import {Camera, Object3D} from 'three';

export class DomEvents {
  constructor(camera: Camera, domElement?: HTMLElement);

  object: Camera;
  domElement: HTMLElement | HTMLDocument;

  // add an event listener for this callback
  addEventListener(obect: Object3D, type: string, listener: (event: Event) => void, withBoundingBox: boolean ): void;
  // remove an event listener for this callback
  removeEventListener(obect: Object3D, type: string, listener: (event: Event) => void, withBoundingBox: boolean ): void;
}
declare module 'DomEvents' {
  const value: any
  
}
