import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Button, KIND, SIZE } from "baseui/button"
import Icons from "~/components/Icons"
import { Block } from "baseui/block"

export default function ToolbarHistory() {
  const editor = useEditor()

  return (
    <Block display="flex" alignItems="center" gridGap="0.5rem">
      <Button kind={KIND.tertiary} size={SIZE.compact} onClick={() => editor.history.undo()}>
        <Icons.Undo size={20} />
      </Button>
      <Button kind={KIND.tertiary} size={SIZE.compact} onClick={() => editor.history.redo()}>
        <Icons.Redo size={20} />
      </Button>
      <Button kind={KIND.tertiary} size={SIZE.compact} onClick={() => editor.history.reset()}>
        <Icons.Refresh size={20} />
      </Button>
      {/* <Button kind={KIND.tertiary} size={SIZE.compact}>
        <Icons.TimePast size={20} />
      </Button> */}
    </Block>
  )
}
