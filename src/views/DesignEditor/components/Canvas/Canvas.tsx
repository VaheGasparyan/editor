import React, { useEffect, useState, useRef } from "react"
import { Canvas, useActiveObject, useEditor, useZoomRatio } from "@layerhub-io/react"
import Playback from "../Playback"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import InlineToolbar from "~/views/DesignEditor/components/Toolbox/InlineToolbar"
import { IStaticText } from "@layerhub-io/types"
import { Block } from "baseui/block"

export default function CanvasComponent() {
  const { displayPlayback, setContextMenuTimelineRequest, setContextMenuRequest } = useDesignEditorContext()
  const [showToolbar, setShowToolbar] = useState(false)
  const activeObject = useActiveObject()
  const editor = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRatio: number = useZoomRatio()

  // State for panning
  const [isPanning, setIsPanning] = useState(false)
  const [lastPosX, setLastPosX] = useState(0)
  const [lastPosY, setLastPosY] = useState(0)
  const [spacebarPressed, setSpacebarPressed] = useState(false)

  // Set initial zoom to 100% when editor is available
  useEffect(() => {
    if (editor) {
      const timer = setTimeout(() => {
        editor.zoom.zoomToRatio(1) // Set canvas to 100%
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return

    const updateToolbarVisibility = () => {
      const isTextSelected = activeObject && (activeObject as IStaticText).type === "StaticText"
      setShowToolbar(isTextSelected)
    }

    updateToolbarVisibility()

    editor.on("history:changed", updateToolbarVisibility)
    editor.on("selection:updated", updateToolbarVisibility)
    editor.on("object:removed", updateToolbarVisibility)
    editor.on("object:added", updateToolbarVisibility)

    return () => {
      editor.off("history:changed", updateToolbarVisibility)
      editor.off("selection:updated", updateToolbarVisibility)
      editor.off("object:removed", updateToolbarVisibility)
      editor.off("object:added", updateToolbarVisibility)
    }
  }, [editor, activeObject])

  // Handle pan and zoom functionality
  useEffect(() => {
    const container = containerRef.current
    if (!editor || !container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !spacebarPressed) {
        const activeObject = editor?.getActiveObject() // fabric.js way to get active object

        // Check if the active object is a text type and currently in editing mode
        // fabric.js text objects have an 'isEditing' property when they are active for text input.
        if (
          activeObject &&
          (activeObject.type === "StaticText" || activeObject.type === "Textbox" || activeObject.type === "IText") &&
          activeObject.isEditing
        ) {
          // If a text object is being edited, do NOT prevent default for the spacebar.
          // Allow the space to be typed.
          return
        }

        // If not editing text, or no text object is active, proceed with panning logic.
        e.preventDefault()
        setSpacebarPressed(true)
        if (container) {
          // Ensure container is not null
          container.style.cursor = "grab"
        }

        if (editor.canvas) {
          editor.canvas.selection = false // Disable object selection during pan
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpacebarPressed(false)
        setIsPanning(false) // Ensure panning stops
        if (container) {
          // Ensure container is not null
          container.style.cursor = "default"
        }

        if (editor.canvas) {
          editor.canvas.selection = true // Re-enable object selection
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (spacebarPressed && e.button === 0) {
        e.preventDefault()
        setIsPanning(true)
        setLastPosX(e.clientX)
        setLastPosY(e.clientY)
        container.style.cursor = "grabbing"
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && editor && editor.canvas) {
        const deltaX = e.clientX - lastPosX
        const deltaY = e.clientY - lastPosY

        const viewportTransform = editor.canvas.viewportTransform
        if (viewportTransform) {
          viewportTransform[4] += deltaX
          viewportTransform[5] += deltaY
          editor.canvas.setViewportTransform(viewportTransform)
          editor.canvas.requestRenderAll()
        }

        setLastPosX(e.clientX)
        setLastPosY(e.clientY)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (isPanning) {
        e.preventDefault()
        setIsPanning(false)
        container.style.cursor = spacebarPressed ? "grab" : "default"
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (!editor) return
      e.preventDefault()

      const zoomStep = 0.05 // Or whatever your preferred step is
      let newZoom = zoomRatio

      // This part needs to change for Ctrl + Wheel zoom
      if (e.deltaY < 0) {
        newZoom = Math.min(3.0, zoomRatio + zoomStep) // Max zoom 300%
      } else {
        newZoom = Math.max(1.0, zoomRatio - zoomStep) // Min zoom 100% (or your preferred min)
      }

      if (newZoom !== zoomRatio) {
        editor.zoom.zoomToRatio(newZoom)
      }
    }

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("wheel", handleWheel, { passive: false })

    container.style.cursor = "default"

    editor.on("contextMenu", (options: any) => {
      setContextMenuRequest({ ...options, visible: true })
    })

    editor.on("contextMenuTimeline", (options: any) => {
      setContextMenuTimelineRequest({ ...options, visible: true })
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)

      if (container) {
        container.removeEventListener("mousedown", handleMouseDown)
        container.removeEventListener("wheel", handleWheel)
      }

      editor.off("contextMenu")
      editor.off("contextMenuTimeline")

      if (editor.canvas) {
        editor.canvas.selection = true
      }
    }
  }, [
    editor,
    zoomRatio,
    isPanning,
    lastPosX,
    lastPosY,
    spacebarPressed,
    setContextMenuRequest,
    setContextMenuTimelineRequest,
  ])

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        position: "relative",
      }}
      ref={containerRef}
    >
      {displayPlayback && <Playback />}

      <Canvas
        config={{
          width: 360,
          height: 504,
          background: "#f1f2f6",
          controlsPosition: { rotation: "BOTTOM" },
          shadow: {
            blur: 4,
            color: "#fcfcfc",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />

      {showToolbar && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            width: "100%",
          }}
        >
          {/* <InlineToolbar /> */}
        </div>
      )}
    </div>
  )
}
