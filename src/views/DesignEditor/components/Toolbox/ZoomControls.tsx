import React, { useState } from "react"
import Icons from "~/components/Icons"
import { Button, KIND, SIZE } from "baseui/button"
import { useZoomRatio, useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { Slider } from "baseui/slider"
import { Input } from "baseui/input"

interface Options {
  zoomRatio: number
}

export default function ZoomControls() {
  const [zoomInputValue, setZoomInputValue] = useState(100)
  const zoomMin = 100 // 100% minimum
  const zoomMax = 300 // 300% maximum - THIS WAS 150, NOW CHANGED TO 300
  const editor = useEditor()
  const [options, setOptions] = React.useState<Options>({
    zoomRatio: 100, // 100% default
  })
  const zoomRatio: number = useZoomRatio()

  // Initialize zoom to 100% when editor becomes available
  React.useEffect(() => {
    if (editor && (zoomRatio <= 0 || zoomRatio < 0.5)) {
      setTimeout(() => {
        editor.zoom.zoomToRatio(1) // Set to 100%
      }, 200)
    }
  }, [editor])

  const handleChange = (type: string, value: any) => {
    setZoomInputValue(value)
    
    let safeValue = Number(value) || zoomMin

    // Clamp value between min and max
    safeValue = Math.max(zoomMin, Math.min(zoomMax, safeValue))

    // Convert percentage to ratio (100% = 1.0, 300% = 3.0)
    const ratio = safeValue / 100

    console.log(ratio)

    if (editor) {
      editor.zoom.zoomToRatio(ratio)
    }
  }

  // Calculate fit-to-screen zoom
  const handleFitToScreen = () => {
    if (editor) {
      // Get the container element - we need to access it from the editor or a global way
      // For now, let's calculate based on window size with some padding
      const availableWidth = window.innerWidth * 0.7 // Assume canvas takes 70% of screen width
      const availableHeight = window.innerHeight * 0.8 // Assume canvas takes 80% of screen height

      const widthRatio = availableWidth / 360
      const heightRatio = availableHeight / 504

      const fitRatio = Math.min(widthRatio, heightRatio)
      const finalZoom = Math.max(100, Math.min(300, fitRatio * 100)) // Convert to percentage and clamp

      handleChange("zoomRatio", finalZoom)
    }
  }

  React.useEffect(() => {
    // Convert ratio back to percentage for display
    // Ensure we never show negative or invalid zoom values
    const percentage = Math.max(zoomMin, Math.round(Math.max(0, zoomRatio) * 100));
    setOptions({ ...options, zoomRatio: percentage })

    // If zoom ratio is invalid or too low, reset to 100%
    // CHANGED: zoomRatio > 2 to zoomRatio > 3.5 to allow 300% (3.0 ratio)
    if (zoomRatio < 0.5 || zoomRatio > 3.5) {
      setTimeout(() => {
        if (editor) {
          editor.zoom.zoomToRatio(1) // Reset to 100%
        }
      }, 100)
    }
  }, [zoomRatio])

  return (
    <Block
      $style={{
        height: "50px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <div>{/* Left side content if needed */}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {/* Zoom Out Button */}
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", Math.max(zoomMin, options.zoomRatio - 10))}
          disabled={options.zoomRatio <= zoomMin}
        >
          <Icons.RemoveCircleOutline size={24} />
        </Button>

        {/* Zoom Slider */}
        <Slider
          overrides={{
            InnerThumb: () => null,
            ThumbValue: () => null,
            TickBar: () => null,
            Root: {
              style: { width: "140px" },
            },
            Thumb: {
              style: {
                height: "12px",
                width: "12px",
                paddingLeft: 0,
              },
            },
            Track: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
          value={[options.zoomRatio]}
          onChange={({ value }) => {
            handleChange("zoomRatio", value[0])
          }}
          min={zoomMin}
          max={zoomMax}
          step={5} // 5% increments
        />

        {/* Zoom In Button */}
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={() => handleChange("zoomRatio", Math.min(zoomMax, options.zoomRatio + 10))}
          disabled={options.zoomRatio >= zoomMax}
        >
          <Icons.AddCircleOutline size={24} />
        </Button>

        {/* Zoom Input */}
        <Input
          type="number"
          value={zoomInputValue}
          endEnhancer="%"
          overrides={{
            Root: {
              style: {
                width: "96px",
              },
            },
            Input: {
              style: {
                textAlign: "center",
              },
            },
          }}
          size={SIZE.mini}
          max={zoomMax}
          min={zoomMin}
          // step={5}
          onChange={(e: any) => handleChange("zoomRatio", e.target.value)}
        />


        {/* Fit to Screen Button */}
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={handleFitToScreen}
          overrides={{
            BaseButton: {
              style: {
                fontSize: "12px",
                minWidth: "60px",
              },
            },
          }}
        >
          Fit
        </Button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
        {/* Right side content if needed */}
      </div>
    </Block>
  )
}
