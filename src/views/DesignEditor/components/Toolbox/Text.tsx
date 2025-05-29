// src/views/DesignEditor/components/Toolbox/Text.tsx
import React, { useState } from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { Popover, StatefulPopover, PLACEMENT } from "baseui/popover" // Corrected PLACEMENT import
import { Button, KIND, SIZE } from "baseui/button"
import { StatefulTooltip, PLACEMENT as TooltipPlacement } from "baseui/tooltip" // Aliased PLACEMENT
import { Input } from "baseui/input"
import { Select } from "baseui/select"
import { FONT_SIZES } from "~/constants/editor"
import { loadFonts } from "~/utils/fonts"
import { IStaticText } from "@layerhub-io/types"
import { FONT_FAMILIES } from "~/constants/fonts"
import Bold from "~/components/Icons/Bold"
import Italic from "~/components/Icons/Italic"
import Underline from "~/components/Icons/Underline"
import TextColor from "~/components/Icons/TextColor"
import AlignLeft from "~/components/Icons/TextAlignLeft"
import AlignCenter from "~/components/Icons/TextAlignCenter"
import AlignRight from "~/components/Icons/TextAlignRight"
import TextAlignJustify from "~/components/Icons/TextAlignJustify"
import LetterCase from "~/components/Icons/LetterCase"
import Spacing from "~/components/Icons/Spacing"
import Opacity from "./Shared/Opacity"
import { HexColorPicker } from "react-colorful"
import { Slider } from "baseui/slider"

export default function TextComponent() {
  const editor = useEditor()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const activeObject = useActiveObject() as IStaticText

  const [value, setValue] = React.useState({
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    textAlign: "left",
    fontStyle: "normal",
    fontWeight: "normal",
    fill: "#000000",
    charSpacing: 0,
    lineHeight: 1.2,
    uppercase: false,
    underline: false,
  })

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticText") {
      const textContent = activeObject.text || ""
      let displayFill = "#000000" // Default color

      if (typeof activeObject.fill === "string") {
        displayFill = activeObject.fill
      } else if (activeObject.fill && typeof activeObject.fill === "object") {
        // @ts-ignore
        const fillObject = activeObject.fill
        if (
          (fillObject.type === "linear" || fillObject.type === "radial") &&
          fillObject.colorStops &&
          fillObject.colorStops.length > 0
        ) {
          // @ts-ignore
          displayFill = fillObject.colorStops[0].color || "#000000"
        }
      }

      setValue({
        fontFamily: activeObject.fontFamily || "OpenSans-Regular",
        fontSize: activeObject.fontSize || 14,
        textAlign: activeObject.textAlign || "left",
        fontStyle: activeObject.fontStyle || "normal",
        fontWeight: activeObject.fontWeight || "normal",
        fill: displayFill,
        charSpacing: activeObject.charSpacing || 0,
        lineHeight: activeObject.lineHeight || 1.2,
        uppercase: textContent === textContent.toUpperCase() && textContent !== "",
        underline: !!activeObject.underline,
      })
    }
  }, [activeObject])

  const handleChange = async (key: string, newValue: any) => {
    if (editor && activeObject) {
      let updateProps: Partial<IStaticText> = {}
      if (key === "fontFamily") {
        const selectedFont = FONT_FAMILIES.find((f) => f.name === newValue)
        if (selectedFont) {
          await loadFonts([selectedFont])
          updateProps = { fontFamily: selectedFont.name, fontURL: selectedFont.url }
        }
      } else if (key === "uppercase") {
        const currentText = activeObject.text || ""
        updateProps = { text: newValue ? currentText.toUpperCase() : currentText.toLowerCase() }
      } else if (key === "underline") {
        updateProps = { underline: newValue }
      } else {
        updateProps = { [key]: newValue }
      }

      editor.objects.update(updateProps)
      // Update local state: if updateProps has all state changes, use that. Otherwise, use key/newValue for direct changes.
      if (Object.keys(updateProps).length > 1 && updateProps[key as keyof Partial<IStaticText>] === newValue) {
        // Handles cases like fontFamily where updateProps contains more than just { [key]: newValue }
        setValue((prevValue) => ({ ...prevValue, ...updateProps }))
      } else {
        setValue((prevValue) => ({ ...prevValue, [key]: newValue }))
      }
    }
  }

  if (!activeObject || activeObject.type !== "StaticText") {
    return null
  }

  return (
    <Block display="flex" alignItems="center" gridGap="0.5rem">
      <Select
        options={FONT_FAMILIES}
        labelKey="name"
        valueKey="name"
        value={[{ name: value.fontFamily }]}
        placeholder="Select font"
        onChange={({ option }) => handleChange("fontFamily", option?.name)}
        clearable={false}
        searchable={true}
        overrides={{
          Root: { style: { width: "140px" } },
          Dropdown: { style: { zIndex: 1000 } },
        }}
      />

      <Select
        options={FONT_SIZES}
        labelKey="value"
        valueKey="value"
        value={[{ value: value.fontSize }]}
        placeholder="Size"
        onChange={({ option }) => handleChange("fontSize", option?.value)}
        clearable={false}
        searchable={false}
        overrides={{
          Root: { style: { width: "80px" } },
          Dropdown: { style: { zIndex: 1000 } },
        }}
      />

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Bold"
      >
        <Button
          onClick={() => handleChange("fontWeight", value.fontWeight === "bold" ? "normal" : "bold")}
          size={SIZE.mini}
          kind={value.fontWeight === "bold" ? KIND.primary : KIND.tertiary}
        >
          <Bold size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Italic"
      >
        <Button
          onClick={() => handleChange("fontStyle", value.fontStyle === "italic" ? "normal" : "italic")}
          size={SIZE.mini}
          kind={value.fontStyle === "italic" ? KIND.primary : KIND.tertiary}
        >
          <Italic size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Underline"
      >
        <Button
          onClick={() => handleChange("underline", !value.underline)}
          size={SIZE.mini}
          kind={value.underline ? KIND.primary : KIND.tertiary}
        >
          <Underline size={24} />
        </Button>
      </StatefulTooltip>
      <div style={{ position: "relative" }}>
        <Button size={SIZE.mini} kind={KIND.tertiary} onClick={() => setShowColorPicker(!showColorPicker)}>
          <TextColor color={value.fill} size={22} />
        </Button>

        {showColorPicker && (
          <Block
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              backgroundColor: "#fff",
              zIndex: 9999,
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
            }}
          >
            <HexColorPicker
              color={value.fill}
              onChange={(color) => {
                handleChange("fill", color)
              }}
            />
            <Button
              kind={KIND.primary}
              size={SIZE.mini}
              style={{ marginTop: "10px", width: "100%" }}
              onClick={() => setShowColorPicker(false)}
            >
              Done
            </Button>
          </Block>
        )}
      </div>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Align Left"
      >
        <Button
          onClick={() => handleChange("textAlign", "left")}
          size={SIZE.mini}
          kind={value.textAlign === "left" ? KIND.primary : KIND.tertiary}
        >
          <AlignLeft size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Align Center"
      >
        <Button
          onClick={() => handleChange("textAlign", "center")}
          size={SIZE.mini}
          kind={value.textAlign === "center" ? KIND.primary : KIND.tertiary}
        >
          <AlignCenter size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Align Right"
      >
        <Button
          onClick={() => handleChange("textAlign", "right")}
          size={SIZE.mini}
          kind={value.textAlign === "right" ? KIND.primary : KIND.tertiary}
        >
          <AlignRight size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Justify"
      >
        <Button
          onClick={() => handleChange("textAlign", "justify")}
          size={SIZE.mini}
          kind={value.textAlign === "justify" ? KIND.primary : KIND.tertiary}
        >
          <TextAlignJustify size={24} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip
        placement={TooltipPlacement.bottom}
        showArrow={true}
        accessibilityType={"tooltip"}
        content="Uppercase"
      >
        <Button
          onClick={() => handleChange("uppercase", !value.uppercase)}
          size={SIZE.mini}
          kind={value.uppercase ? KIND.primary : KIND.tertiary}
        >
          <LetterCase size={24} />
        </Button>
      </StatefulTooltip>

      <TextSpacing />
      <Opacity />
    </Block>
  )
}

function TextSpacing() {
  const editor = useEditor()
  const activeObject = useActiveObject() as IStaticText | undefined
  const [state, setState] = React.useState<{
    charSpacing: number
    lineHeight: number
  }>({ charSpacing: 0, lineHeight: 1.2 })

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticText") {
      const { charSpacing, lineHeight } = activeObject
      setState({
        charSpacing: charSpacing || 0,
        lineHeight: lineHeight || 1.2,
      })
    }
  }, [activeObject])

  const handleSpacingChange = (type: string, value: number[]) => {
    if (editor && activeObject) {
      editor.objects.update({ [type]: value[0] })
      setState((prev) => ({ ...prev, [type]: value[0] }))
    }
  }

  return (
    <StatefulPopover
      showArrow={true}
      placement={PLACEMENT.bottom} // Uses PLACEMENT from baseui/popover
      content={(
        { close, isOpen }: { close: () => void; isOpen: boolean } // Corrected content prop signature
      ) => (
        <Block
          padding={"12px"}
          width={"200px"}
          backgroundColor={"#ffffff"}
          display={"grid"}
          gridGap={"8px"}
          overrides={{ Block: { style: { boxShadow: "0 0 8px rgba(0,0,0,0.2)" } } }}
        >
          <Block>
            <Block $style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Block $style={{ fontSize: "14px" }}>Line height</Block>
              <Block width={"52px"}>
                <Input
                  overrides={{
                    Input: { style: { backgroundColor: "#ffffff", textAlign: "center" } },
                    Root: {
                      style: {
                        border: "1px solid rgba(0,0,0,0.15)",
                        height: "26px",
                      },
                    },
                  }}
                  size={SIZE.mini}
                  type="number"
                  value={state.lineHeight.toFixed(1)}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value) || 0
                    handleSpacingChange("lineHeight", [newValue])
                  }}
                  step={0.1}
                />
              </Block>
            </Block>

            <Block>
              <Slider
                overrides={{
                  InnerThumb: () => null,
                  ThumbValue: () => null,
                  TickBar: () => null,
                  Track: { style: { paddingRight: 0, paddingLeft: 0 } },
                  Thumb: { style: { height: "12px", width: "12px" } },
                }}
                min={0.1}
                max={3}
                step={0.1}
                value={[state.lineHeight]}
                onChange={({ value }) => handleSpacingChange("lineHeight", value)}
              />
            </Block>
          </Block>

          <Block>
            <Block $style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Block $style={{ fontSize: "14px" }}>Char spacing</Block>
              <Block width={"52px"}>
                <Input
                  overrides={{
                    Input: { style: { backgroundColor: "#ffffff", textAlign: "center" } },
                    Root: {
                      style: {
                        border: "1px solid rgba(0,0,0,0.15)",
                        height: "26px",
                      },
                    },
                  }}
                  size={SIZE.mini}
                  type="number"
                  value={Math.round(state.charSpacing)}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10) || 0
                    handleSpacingChange("charSpacing", [newValue])
                  }}
                />
              </Block>
            </Block>

            <Block>
              <Slider
                overrides={{
                  InnerThumb: () => null,
                  ThumbValue: () => null,
                  TickBar: () => null,
                  Track: { style: { paddingRight: 0, paddingLeft: 0 } },
                  Thumb: { style: { height: "12px", width: "12px" } },
                }}
                min={-100}
                max={500}
                value={[state.charSpacing]}
                onChange={({ value }) => handleSpacingChange("charSpacing", value)}
              />
            </Block>
          </Block>
        </Block>
      )}
    >
      <Block>
        <StatefulTooltip
          placement={TooltipPlacement.bottom} // Uses TooltipPlacement
          showArrow={true}
          accessibilityType={"tooltip"}
          content="Spacing"
        >
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <Spacing size={24} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}
