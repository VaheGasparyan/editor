import React from "react"
import { Button, SIZE } from "baseui/button"
import { HexColorPicker } from "react-colorful"
import { Input } from "baseui/input"
import { useEditor, useFrame } from "@layerhub-io/react"
import { Modal, ROLE } from "baseui/modal"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { sampleFrames } from "~/constants/editor"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
import SwapHorizontal from "~/components/Icons/SwapHorizontal"
import { Tabs, Tab } from "baseui/tabs"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function CustomizePanel() {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [color, setColor] = React.useState("#000000")

  const applyColor = (value: string) => {
    setColor(value)

    const active = editor?.canvas?.getActiveObject?.()

    if (active && "fill" in active) {
      editor.objects.update({ id: active.id, fill: value })
    } else {
      editor?.frame?.setBackgroundColor?.(value)
    }
  }

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Background Color</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>

      <Scrollable>
        <Block padding={"0 1.5rem"}>
          {/* <Block>
            <ResizeTemplate />
            <Block $style={{ fontSize: "14px", textAlign: "center", paddingTop: "0.35rem" }}>1080 x 1920px</Block>
          </Block> */}

          <Block paddingTop={"1.5rem"}>
            <Block
              $style={{
                background: "#fafafa",
                borderRadius: "8px",
                border: "1px solid #ececf5",
                padding: "0.45rem 1rem",
                fontSize: "14px",
              }}
            >
              <div>Color</div>
              <Block paddingTop={"0.5rem"}>
                <HexColorPicker color={color} onChange={applyColor} />
                <Input
                  value={color}
                  onChange={(e) => applyColor((e.target as HTMLInputElement).value)}
                  placeholder="#000000"
                  clearOnEscape
                  size="compact"
                  overrides={{ Input: { style: { textAlign: "center", marginTop: "0.75rem" } } }}
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

function ResizeTemplate() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeKey, setActiveKey] = React.useState<string | number>("0")
  const { currentDesign, setCurrentDesign } = useDesignEditorContext()
  const editor = useEditor()
  const [desiredFrame, setDesiredFrame] = React.useState({ width: 0, height: 0 })
  const [selectedFrame, setSelectedFrame] = React.useState<any>({ id: 0, width: 0, height: 0 })
  const frame = useFrame()

  React.useEffect(() => {
    if (frame) {
      setDesiredFrame({
        width: frame.width,
        height: frame.height,
      })
    }
  }, [frame])

  const applyResize = () => {
    const size = activeKey === "0" ? selectedFrame : desiredFrame
    if (editor) {
      editor.frame.resize({
        width: parseInt(size.width),
        height: parseInt(size.height),
      })
      setCurrentDesign({
        ...currentDesign,
        frame: {
          width: parseInt(size.width),
          height: parseInt(size.height),
        },
      })
    }
    setIsOpen(false)
  }

  const isEnabled =
    (activeKey === "0" && selectedFrame.id !== 0) ||
    (activeKey === "1" && !!parseInt(desiredFrame.width) && !!parseInt(desiredFrame.height))

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size={SIZE.compact} overrides={{ Root: { style: { width: "100%" } } }}>
        Resize template
      </Button>

      <Modal
        onClose={() => setIsOpen(false)}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={"auto"}
        role={ROLE.dialog}
        overrides={{
          Dialog: {
            style: {
              borderRadius: "8px",
            },
          },
        }}
      >
        <Block $style={{ padding: "0 1.5rem", width: "640px" }}>
          <Block $style={{ padding: "2rem 1rem 1rem", textAlign: "center", fontWeight: 500 }}>
            Choose a format and resize your template.
          </Block>

          <Tabs
            activeKey={activeKey}
            onChange={({ activeKey }) => setActiveKey(activeKey)}
            overrides={{
              TabContent: { style: { paddingLeft: 0, paddingRight: 0 } },
              TabBar: {
                style: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                },
              },
            }}
          >
            {/* <Tab title="Preset size">
              <Block $style={{ width: "100%", height: "400px" }}>
                <Scrollbar>
                  <Block $style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {sampleFrames.map((sampleFrame, index) => (
                      <Block
                        key={index}
                        onClick={() => setSelectedFrame(sampleFrame)}
                        $style={{
                          padding: "0.5rem",
                          backgroundColor: selectedFrame.id === sampleFrame.id ? "rgb(243,244,245)" : "#ffffff",
                          ":hover": { backgroundColor: "rgb(246,247,248)", cursor: "pointer" },
                        }}
                      >
                        <Block
                          $style={{
                            height: "120px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src={sampleFrame.preview} />
                        </Block>
                        <Block $style={{ fontSize: "13px", textAlign: "center" }}>
                          <Block $style={{ fontWeight: 500 }}>{sampleFrame.name}</Block>
                          <Block $style={{ color: "rgb(119,119,119)" }}>
                            {sampleFrame.width} x {sampleFrame.height}px
                          </Block>
                        </Block>
                      </Block>
                    ))}
                  </Block>
                </Scrollbar>
              </Block>
            </Tab> */}

            <Tab title="Custom size">
              <Block $style={{ padding: "2rem 2rem" }}>
                <Block
                  $style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 50px 1fr",
                    alignItems: "end",
                    fontSize: "14px",
                  }}
                >
                  <Input
                    onChange={(e: any) => setDesiredFrame({ ...desiredFrame, width: e.target.value })}
                    value={desiredFrame.width}
                    startEnhancer="W"
                    size={SIZE.compact}
                  />
                  <Button overrides={{ Root: { style: { height: "32px" } } }} size={SIZE.compact} kind="tertiary">
                    <SwapHorizontal size={24} />
                  </Button>
                  <Input
                    onChange={(e: any) => setDesiredFrame({ ...desiredFrame, height: e.target.value })}
                    value={desiredFrame.height}
                    startEnhancer="H"
                    size={SIZE.compact}
                  />
                </Block>
              </Block>
            </Tab>
          </Tabs>
        </Block>

        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "2rem" }}>
          <Button disabled={!isEnabled} onClick={applyResize} style={{ width: "190px" }}>
            Resize template
          </Button>
        </Block>
      </Modal>
    </>
  )
}
