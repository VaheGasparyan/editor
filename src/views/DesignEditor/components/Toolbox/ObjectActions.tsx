import React from "react"
import { Button, SIZE, KIND } from "baseui/button"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import DeleteIcon from "~/components/Icons/Delete"
import DuplicateIcon from "~/components/Icons/Duplicate"
import { Block } from "baseui/block"

export default function ObjectActions() {
  const editor = useEditor()
  const activeObject = useActiveObject()

  if (!activeObject || activeObject.type !== "text") return null

  return (
    <Block display="flex" alignItems="center" gridGap="0.5rem">
      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Duplicate">
        <Button onClick={() => editor.objects.clone()} size={SIZE.mini} kind={KIND.tertiary}>
          <DuplicateIcon size={22} />
        </Button>
      </StatefulTooltip>

      <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Delete">
        <Button onClick={() => editor.objects.remove()} size={SIZE.mini} kind={KIND.tertiary}>
          <DeleteIcon size={24} />
        </Button>
      </StatefulTooltip>
    </Block>
  )
}
