import { nanoid } from "nanoid"
import { IFrame, IScene } from "@layerhub-io/types"

export const defaultTemplate: IScene = {
  id: nanoid(),
  frame: {
    width: 360,
    height: 504,
  },
  layers: [
    {
      id: "background",
      name: "Initial Frame",
      left: 0,
      top: 0,
      width: 360,
      height: 504,
      type: "Background",
      fill: "#ffffff",
      metadata: {},
    },
  ],
  metadata: {},
}

export const getDefaultTemplate = ({ width, height }: IFrame) => {
  return {
    id: nanoid(),
    frame: {
      width,
      height,
    },
    layers: [
      {
        id: "background",
        name: "Initial Frame",
        left: 0,
        top: 0,
        width,
        height,
        type: "Background",
        fill: "#ffffff",
        metadata: {},
      },
    ],
    metadata: {},
  }
}
