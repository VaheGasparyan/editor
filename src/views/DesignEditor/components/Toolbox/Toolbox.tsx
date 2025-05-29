import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import getSelectionType from "~/utils/get-selection-type"
import { styled } from "baseui"
import Items from "./Items"
import useAppContext from "~/hooks/useAppContext"
import { ILayer } from "@layerhub-io/types"
import GlobalActions from "./GlobalActions"
import ObjectActions from "./ObjectActions"
import Common from "./Common"
import { Block } from "baseui/block"
import ZoomControls from "./ZoomControls"

const DEFAULT_TOOLBOX = "NONE"

interface ToolboxState {
  toolbox: string
}

const Container = styled("div", (props) => ({
  boxShadow: "rgb(0 0 0 / 15%) 0px 1px 1px",
  height: "50px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 12px",
  backgroundColor: "#ffffff",
}))

const Toolbox = () => {
  const [state, setState] = React.useState<ToolboxState>({ toolbox: DEFAULT_TOOLBOX })
  const { setActiveSubMenu } = useAppContext()
  const activeObject = useActiveObject() as ILayer
  const editor = useEditor()

  React.useEffect(() => {
    const selectionType = getSelectionType(activeObject)
    if (selectionType && selectionType.length > 0) {
      if (selectionType.length > 1) {
        setState({ toolbox: "Multiple" })
      } else {
        setState({ toolbox: selectionType[0] })
      }
    } else {
      setState({ toolbox: DEFAULT_TOOLBOX })
      setActiveSubMenu("")
    }
  }, [activeObject, setActiveSubMenu])

  React.useEffect(() => {
    const watcher = () => {
      if (activeObject) {
        const selectionType = getSelectionType(activeObject)
        if (selectionType && selectionType.length > 0) {
          if (selectionType.length > 1) {
            setState({ toolbox: "Multiple" })
          } else {
            setState({ toolbox: selectionType[0] })
          }
        }
      } else {
        setState({ toolbox: DEFAULT_TOOLBOX })
      }
    }

    if (editor) {
      editor.on("history:changed", watcher)
      editor.on("selection:updated", watcher)
      editor.on("object:added", watcher)
      editor.on("object:removed", watcher)
    }

    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
        editor.off("selection:updated", watcher)
        editor.off("object:added", watcher)
        editor.off("object:removed", watcher)
      }
    }
  }, [editor, activeObject])

  // Get the specific toolbox component for the current selection
  const SpecificToolboxComponent = Items[state.toolbox]
  const showObjectActions = activeObject && state.toolbox !== DEFAULT_TOOLBOX
  const showCommonActions = state.toolbox !== DEFAULT_TOOLBOX

  return (
    <Container>
      {/* Left side: Context-specific tools */}
      <Block display="flex" alignItems="center" gridGap="0.5rem">
        <GlobalActions />
        {showCommonActions && <Common />}
        {showObjectActions && <ObjectActions />}
        {SpecificToolboxComponent && state.toolbox !== DEFAULT_TOOLBOX && <SpecificToolboxComponent />}
      </Block>

      {/* Center: Empty space for layout */}
      <Block display="flex" alignItems="center" gridGap="0.5rem">
        {/* This space can be used for additional tools if needed */}
      </Block>

      {/* Right side: Zoom and Navigation */}
      <Block display="flex" alignItems="center" gridGap="1rem">
        <ZoomControls />
        <Block display="flex" alignItems="center" gridGap="1rem">
          <a
            href="#"
            style={{
              textDecoration: "none",
              color: "#666",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Back
          </a>
          <a
            href="#"
            style={{
              textDecoration: "none",
              color: "#666",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Skip
          </a>
          <a
            href="#"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Next
          </a>
        </Block>
      </Block>
    </Container>
  )
}

export default Toolbox
