import { useEffect } from "react"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { DesignType } from "~/interfaces/DesignEditor"

export default function () {
  const { setEditorType } = useDesignEditorContext()

  useEffect(() => {
    setEditorType("GRAPHIC")
  }, [setEditorType])

  return null
}
