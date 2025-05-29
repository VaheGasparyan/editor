import React, { useEffect, useState, useCallback } from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import { useStyletron } from "baseui"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { loadVideoEditorAssets } from "~/utils/video"
import { loadTemplateFonts } from "~/utils/fonts"
// import { loadGraphicTemplate, loadPresentationTemplate, loadVideoTemplate } from "@layerhub-io/react"

// import { importGraphicTemplate } from "@layerhub-io/react"

import { IDesign } from "~/interfaces/DesignEditor";
import { IScene } from "@layerhub-io/types";

interface TemplateItem {
  id: string
  title: string
  file: string
  file_path: string
}

const BASE_URL = "https://invalbum.com"

export default function TemplatesPanel() {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setScenes, setCurrentScene, setCurrentDesign, scenes } = useDesignEditorContext()
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [css] = useStyletron()
  // Fetch template previews from CI3
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${BASE_URL}/templates`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTemplates(data)
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err)
      }
    }

    fetchTemplates()
  }, []);

  const loadGraphicTemplate = async (payload: IDesign) => {
    const scenes = []
    const { scenes: scns, ...design } = payload

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
      }
      const loadedScene = await loadVideoEditorAssets(scene)
      await loadTemplateFonts(loadedScene)

      const preview = (await editor.renderer.render(loadedScene)) as string
      scenes.push({ ...loadedScene, preview })
    }

    return { scenes, design }
  }

  // Your working template importer
  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      try {
        let template
        if (data.type === "GRAPHIC") {
          template = await loadGraphicTemplate(data);
        } else if (data.type === "PRESENTATION") {
          template = await loadPresentationTemplate(data)
        } else if (data.type === "VIDEO") {
          template = await loadVideoTemplate(data)
        };

        //   @ts-ignore
        setScenes(template.scenes);
        setCurrentScene(template.scenes[0]);
        //   @ts-ignore
        setCurrentDesign(template.design)
      } catch(err) {
        console.log('Import template error ', err)
      }
    },
    [editor]
  )

  // On template click → fetch and import
  const handleTemplateClick = async (template: TemplateItem) => {
    try {
      const res = await fetch(`${BASE_URL}/template/${template.id}`);
      const json = await res.json();
      // if (!json) {
      //   console.error("No template data found")
      //   return
      // }
      // editor.objects.clear()
      // Assuming json is the template data in the expected format
      handleImportTemplate(json)
    } catch (err) {
      console.error("Failed to import template:", err)
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
        <Block>Templates</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>

      <Scrollable>
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
            {templates.map((item) => (
              <div
                key={item.id}
                className={css({
                  position: "relative",
                  background: "#f8f8fb",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                })}
                onClick={() => handleTemplateClick(item)}
              >
                <img
                  src={`${BASE_URL}/${item.file_path}${item.file}`}
                  alt={item.title}
                  className={css({
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    aspectRatio: "3/4",
                  })}
                />
                <Block
                  $style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </Block>
              </div>
            ))}
          </div>
        </div>
      </Scrollable>
    </Block>
  )
}
