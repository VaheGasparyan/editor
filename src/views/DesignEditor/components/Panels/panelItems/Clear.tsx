import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"

export default function Clear() {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const handleReset = () => {
    if (editor && editor.canvas) {
      editor.objects.clear()
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
        <Block>Clear</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
    </Block>
  )
}
