import { IStaticText } from "@layerhub-io/types"
import { groupBy } from "lodash"

export const getTextProperties = (object: Required<IStaticText>, fonts: any[]) => {
  const color = object.fill
  const family = object.fontFamily

  const selectedFont = fonts.find((sampleFont) => sampleFont.postscript_name === family)

  if (!selectedFont) {
    console.warn("Font not found for:", family)
    return {
      color,
      family,
      bold: family.toLowerCase().includes("bold"),
      italic: family.toLowerCase().includes("italic"),
      underline: object.underline,
      styleOptions: {
        hasBold: false,
        hasItalic: false,
        options: [],
      },
    }
  }

  const groupedFonts = groupBy(fonts, "family")
  const selectedFamily = groupedFonts[selectedFont.family] || []

  const hasBold = selectedFamily.find((font) => font.postscript_name.includes("-Bold"))
  const hasItalic = selectedFamily.find((font) => font.postscript_name.includes("-Italic"))

  const styleOptions = {
    hasBold: !!hasBold,
    hasItalic: !!hasItalic,
    options: selectedFamily,
  }

  return {
    color,
    family: selectedFont.family,
    bold: family.toLowerCase().includes("bold"),
    italic: family.toLowerCase().includes("italic"),
    underline: object.underline,
    styleOptions,
  }
}
