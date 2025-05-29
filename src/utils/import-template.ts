import { loadGraphicTemplate, loadPresentationTemplate, loadVideoTemplate } from "@layerhub-io/react"

export async function handleImportTemplate(data: any, editor: any) {
  let template
  if (data.type === "GRAPHIC") {
    template = await loadGraphicTemplate(data)
  } else if (data.type === "PRESENTATION") {
    template = await loadPresentationTemplate(data)
  } else if (data.type === "VIDEO") {
    template = await loadVideoTemplate(data)
  }

  if (template && editor) {
    editor.scene.set(template.scenes[0])
    editor.design.set(template.design)
  }
}
