import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { Input } from "baseui/input"
import { Block } from "baseui/block"
import { ChevronDown } from "baseui/icon"
import { Button, SIZE, KIND } from "baseui/button"
import { StatefulPopover } from "baseui/popover"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
import Bold from "~/components/Icons/Bold"
import Italic from "~/components/Icons/Italic"
import Underline from "~/components/Icons/Underline"
import LetterCase from "~/components/Icons/LetterCase"
import TextColor from "~/components/Icons/TextColor"
import TextAlignLeft from "~/components/Icons/TextAlignLeft"
import TextAlignCenter from "~/components/Icons/TextAlignCenter"
import TextAlignRight from "~/components/Icons/TextAlignRight"
import TextAlignJustify from "~/components/Icons/TextAlignJustify"
import { FONT_SIZES, SAMPLE_FONTS } from "~/constants/editor"
import useAppContext from "~/hooks/useAppContext"

const InlineToolbar = () => {
  const editor = useEditor()
  const activeObject = useActiveObject()
  const { setActiveSubMenu } = useAppContext()
  const [fontSize, setFontSize] = React.useState(12)
  const [fontFamily, setFontFamily] = React.useState("Open Sans")
  const [isBold, setBold] = React.useState(false)
  const [isItalic, setItalic] = React.useState(false)
  const [isUnderline, setUnderline] = React.useState(false)
  const [isUppercase, setUppercase] = React.useState(false)
  const [align, setAlign] = React.useState("left")
  const [textColor, setTextColor] = React.useState("#000000")

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticText") {
      // @ts-ignore
      setFontSize(activeObject.fontSize || 12)
      // @ts-ignore
      setFontFamily(activeObject.fontFamily || "Open Sans")
      // @ts-ignore
      setBold(!!activeObject.fontWeight?.toLowerCase().includes("bold"))
      // @ts-ignore
      setItalic(!!activeObject.fontStyle?.toLowerCase().includes("italic"))
      // @ts-ignore
      setUnderline(!!activeObject.underline)
      // @ts-ignore
      setAlign(activeObject.textAlign || "left")
      // @ts-ignore
      setTextColor(activeObject.fill || "#000000")
    }
  }, [activeObject])

  const updateText = (props: any) => {
    if (editor) {
      editor.objects.update(props)
    }
  }

  const toggleUppercase = () => {
    if (!isUppercase) {
      setUppercase(true)
      editor.objects.toUppercase()
    } else {
      setUppercase(false)
      editor.objects.toLowerCase()
    }
  }

  // return (
  //   <Block
  //     $style={{
  //       position: "absolute",
  //       bottom: "0",
  //       left: "50%",
  //       transform: "translateX(-50%)",
  //       background: "#f9f9f9",
  //       padding: "8px 16px",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "space-between",
  //       zIndex: 99,
  //       width: "100%",
  //       maxWidth: "680px",
  //       borderRadius: "50px",
  //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  //     }}
  //   >
  //     <Block display="flex" alignItems="center" gridGap="8px">
  //       {/* Font Family */}
  //       <StatefulPopover
  //         content={({ close }) => (
  //           <Scrollbar style={{ height: "200px", width: "150px" }}>
  //             <Block backgroundColor="#fff" padding="10px 0">
  //               {SAMPLE_FONTS.map((font, index) => (
  //                 <Block
  //                   onClick={() => {
  //                     updateText({ fontFamily: font.postscript_name, fontURL: font.url })
  //                     setFontFamily(font.family)
  //                     close()
  //                   }}
  //                   $style={{
  //                     height: "32px",
  //                     fontSize: "14px",
  //                     cursor: "pointer",
  //                     padding: "0 20px",
  //                     display: "flex",
  //                     alignItems: "center",
  //                     fontFamily: font.postscript_name,
  //                     ":hover": { background: "#f3f3f3" },
  //                   }}
  //                   key={index}
  //                 >
  //                   {font.family}
  //                 </Block>
  //               ))}
  //             </Block>
  //           </Scrollbar>
  //         )}
  //       >
  //         <Block
  //           $style={{
  //             border: "1px solid #ccc",
  //             padding: "4px 10px",
  //             borderRadius: "6px",
  //             display: "flex",
  //             alignItems: "center",
  //             cursor: "pointer",
  //             minWidth: "120px",
  //             fontFamily,
  //             fontSize: "14px",
  //           }}
  //         >
  //           {fontFamily}
  //           <ChevronDown size={22} />
  //         </Block>
  //       </StatefulPopover>

  //       {/* Font Size */}
  //       <StatefulPopover
  //         content={({ close }) => (
  //           <Scrollbar style={{ height: "200px", width: "90px" }}>
  //             <Block backgroundColor="#fff" padding="10px 0">
  //               {FONT_SIZES.map((size, index) => (
  //                 <Block
  //                   onClick={() => {
  //                     updateText({ fontSize: size })
  //                     setFontSize(size)
  //                     close()
  //                   }}
  //                   $style={{
  //                     height: "32px",
  //                     fontSize: "14px",
  //                     cursor: "pointer",
  //                     padding: "0 20px",
  //                     display: "flex",
  //                     alignItems: "center",
  //                     ":hover": { background: "#f3f3f3" },
  //                   }}
  //                   key={index}
  //                 >
  //                   {size}
  //                 </Block>
  //               ))}
  //             </Block>
  //           </Scrollbar>
  //         )}
  //       >
  //         <Block width="80px">
  //           <Input
  //             value={fontSize}
  //             onChange={(e: any) => updateText({ fontSize: parseInt(e.target.value) })}
  //             endEnhancer={<ChevronDown size={22} />}
  //             type="number"
  //             size={SIZE.mini}
  //           />
  //         </Block>
  //       </StatefulPopover>

  //       {/* Format Buttons */}
  //       <Block display="flex" alignItems="center" gridGap="8px">
  //         <Button onClick={() => setActiveSubMenu("TextFill")} size={SIZE.mini} kind={KIND.tertiary}>
  //           <TextColor color={textColor} size={22} />
  //         </Button>
  //         <Button
  //           onClick={() => updateText({ fontWeight: isBold ? "normal" : "bold" })}
  //           size={SIZE.mini}
  //           kind={KIND.tertiary}
  //         >
  //           <Bold size={20} />
  //         </Button>
  //         <Button
  //           onClick={() => updateText({ fontStyle: isItalic ? "normal" : "italic" })}
  //           size={SIZE.mini}
  //           kind={KIND.tertiary}
  //         >
  //           <Italic size={20} />
  //         </Button>
  //         <Button onClick={() => updateText({ underline: !isUnderline })} size={SIZE.mini} kind={KIND.tertiary}>
  //           <Underline size={20} />
  //         </Button>
  //         <Button onClick={toggleUppercase} size={SIZE.mini} kind={KIND.tertiary}>
  //           <LetterCase size={20} />
  //         </Button>
  //       </Block>

  //       {/* Alignment */}
  //       <Block display="flex" alignItems="center" gridGap="8px">
  //         <Button onClick={() => updateText({ textAlign: "left" })} size={SIZE.mini} kind={KIND.tertiary}>
  //           <TextAlignLeft size={20} />
  //         </Button>
  //         <Button onClick={() => updateText({ textAlign: "center" })} size={SIZE.mini} kind={KIND.tertiary}>
  //           <TextAlignCenter size={20} />
  //         </Button>
  //         <Button onClick={() => updateText({ textAlign: "right" })} size={SIZE.mini} kind={KIND.tertiary}>
  //           <TextAlignRight size={20} />
  //         </Button>
  //         <Button onClick={() => updateText({ textAlign: "justify" })} size={SIZE.mini} kind={KIND.tertiary}>
  //           <TextAlignJustify size={20} />
  //         </Button>
  //       </Block>
  //     </Block>
  //   </Block>
  // )
}

export default InlineToolbar
