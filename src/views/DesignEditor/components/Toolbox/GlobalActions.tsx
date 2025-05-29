import React from "react"
import { Button, SIZE, KIND } from "baseui/button"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import { useEditor } from "@layerhub-io/react"
import Icons from "~/components/Icons"
import { Block } from "baseui/block"

export default function GlobalActions() {
  const editor = useEditor()

  return (
    <Block display="flex" alignItems="center" gridGap="0.5rem">
      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Undo">
        <Button onClick={() => editor.history.undo()} size={SIZE.mini} kind={KIND.tertiary}>
          <Icons.Undo size={22} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Redo">
        <Button onClick={() => editor.history.redo()} size={SIZE.mini} kind={KIND.tertiary}>
          <Icons.Redo size={22} />
        </Button>
      </StatefulTooltip>

      {/* <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="History">
        <Button size={SIZE.mini} kind={KIND.tertiary}>
          <Icons.TimePast size={16} />
        </Button>
      </StatefulTooltip> */}
    </Block>
  )
}
