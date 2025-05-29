import { useStyletron } from "baseui"
import { BASE_ITEMS, VIDEO_PANEL_ITEMS, PanelType } from "~/constants/app-options" // Import PanelType enum
import useAppContext from "~/hooks/useAppContext"
import { styled } from "baseui"
import Icons from "~/components/Icons"
import { useTranslation } from "react-i18next"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useEditorType from "~/hooks/useEditorType"
import Scrollable from "~/components/Scrollable"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"
import { loadFonts } from "~/utils/fonts"
import { nanoid } from "nanoid"
import { FontItem } from "~/interfaces/common"
import { IStaticText } from "@layerhub-io/types"
import React, { useRef } from "react"

const Container = styled("div", (props) => ({
  width: "80px",
  minWidth: "80px",
  backgroundColor: props.$theme.colors.primary100,
  display: "flex",
}))

function PanelsList() {
  const { activePanel, setActivePanel } = useAppContext()
  const { t } = useTranslation("editor")
  const editorType = useEditorType()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const editor = useEditor()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const PANEL_ITEMS = BASE_ITEMS

  const handleAddTextToCanvas = async () => {
    if (editor) {
      const font: FontItem = {
        name: "OpenSans-Regular",
        url: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf",
      }
      const canvasHeight = 504
      const fontSize = Math.round(canvasHeight * 0.035)

      await loadFonts([font])
      const options = {
        id: nanoid(),
        type: "StaticText",
        text: "Add some text",
        fontSize: 18,
        fontFamily: font.name,
        textAlign: "center",
        fontStyle: "normal",
        fontURL: font.url,
        fill: "#333333",
        metadata: {},
      }
      editor.objects.add<IStaticText>(options)
      setIsSidebarOpen(false)
      // setActivePanel(PanelType.TEXT_TEMPLATES) // Use enum member
    }
  }

  const handleImagePanelClick = () => {
    fileInputRef.current?.click()
    // No need to open sidebar or set active panel here, as per user's request for direct upload
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editor && editor.canvas) {
      // Ensure editor.canvas is available
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const wRatio = 360 / img.width
          const hRatio = 504 / img.height
          const scale = Math.min(wRatio, hRatio)

          const newWidth = img.width * scale
          const newHeight = img.height * scale

          const scaleX = roundToTwo(newWidth / img.width)
          const scaleY = roundToTwo(newHeight / img.height)

          editor.objects.add({
            id: nanoid(),
            type: "StaticImage",
            src: e.target?.result as string,
            x: 0,
            y: 0,
            scaleX: scaleX,
            scaleY: scaleY,
          })
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
    event.target.value = ""
  }

  return (
    <Container>
      <Scrollable autoHide={true}>
        {PANEL_ITEMS.map((panelListItem) => (
          <PanelListItem
            label={t(`panels.panelsList.${panelListItem.id}`)}
            // Cast panelListItem.name to PanelType for PanelListItemProps
            // This cast is now safe because PanelType is imported from app-options.ts
            name={panelListItem.name as PanelType}
            key={panelListItem.name}
            icon={panelListItem.name}
            activePanel={activePanel}
            onClick={() => {
              if (panelListItem.name === "Text") {
                handleAddTextToCanvas()
              } else if (panelListItem.name === "Uploads") {
                handleImagePanelClick()
              } else if (panelListItem.name === "Grpaphics") {
                setIsSidebarOpen(true)
                setActivePanel(panelListItem.name as PanelType)
              } else if (panelListItem.name === "Clear") {
                if (confirm("Are you sure you want to reset the canvas? This will clear all content.")) {
                  // editor.objects.clear()
                  location.reload() // Reload the page to reset the canvas
                }
              } else {
                setActivePanel(panelListItem.name as PanelType)
                setIsSidebarOpen(true)
              }
            }}
          />
        ))}
      </Scrollable>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
    </Container>
  )
}

interface PanelListItemProps {
  label: string
  icon: string
  activePanel: PanelType // Use PanelType enum here
  name: PanelType // Use PanelType enum here
  onClick: () => void
}

// Round 2 decimals
function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function PanelListItem({ label, icon, activePanel, name, onClick }: PanelListItemProps) {
  const [css, theme] = useStyletron()
  // @ts-ignore
  const Icon = Icons[icon]
  return (
    <Block
      id={"EditorPanelList"}
      onClick={onClick}
      $style={{
        width: "80px",
        height: "80px",
        backgroundColor: name === activePanel ? theme.colors.white : theme.colors.primary100,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "Uber Move Text",
        fontWeight: 500,
        fontSize: "0.785rem",
        userSelect: "none",
        transition: "all 0.5s",
        gap: "0.1rem",
        cursor: "pointer", // Explicitly set cursor to pointer
        ":hover": {
          backgroundColor: theme.colors.white,
          transition: "all 1s",
        },
      }}
    >
      <Icon size={22} />
      <div>{label === "Graphics" ? "Symbols" : label === "Elements" ? "Borders" : label}</div>
    </Block>
  )
}

export default PanelsList
