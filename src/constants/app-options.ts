export const BASE_ITEMS = [
  {
    id: "templates",
    name: "Templates",
  },
  {
    id: "uploads",
    name: "Uploads",
  },
  {
    id: "text",
    name: "Text",
  },
  {
    id: "graphics",
    name: "Graphics",
  },
  {
    id: "elements",
    name: "Elements",
  },
  // {
  //   id: "dividers",
  //   name: "Dividers",
  // },
  {
    id: "customize",
    name: "Customize",
  },
  {
    id: "layers",
    name: "Layers",
  },
  {
    id: "clear",
    name: "Clear",
  },
]

export const VIDEO_PANEL_ITEMS = [
  {
    id: "templates",
    name: "Templates",
  },
  {
    id: "customize",
    name: "Customize",
  },
  {
    id: "elements",
    name: "Elements",
  },
  {
    id: "images",
    name: "Images",
  },
  {
    id: "videos",
    name: "Videos",
  },
  {
    id: "uploads",
    name: "Uploads",
  },
  {
    id: "text",
    name: "Text",
  },
  {
    id: "graphics",
    name: "Graphics",
  },

  {
    id: "pixabay",
    name: "Pixabay",
  },
]

// Expanded PanelType enum to include all possible panel names
export enum PanelType {
  TEMPLATES = "Templates",
  TEXT = "Text",
  GRAPHICS = "Graphics",
  UPLOADS = "Uploads",
  CUSTOMIZE = "Customize",
  LAYERS = "Layers",
  ELEMENTS = "Elements",
  IMAGES = "Images",
  VIDEOS = "Videos",
  PIXABAY = "Pixabay",
  CLEAR = "CLEAR",
  TEXT_TEMPLATES = "TextTemplates", // Added for consistency with text panel behavior
}
