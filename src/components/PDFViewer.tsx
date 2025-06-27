
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import type { DocumentLoadEvent } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface Props {
  url: string | null
  fileName: string | null
  zoom?: number
  onWidthChange: (width: number) => void;
}

const PDFViewer = ({ url, zoom = 100, onWidthChange, fileName }: Props) => {
  // Create the default layout plugin with all features enabled
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Hide sidebar to save space in our UI
    toolbarPlugin: {
      // All toolbar features will be available by default
    },
  });

  const handleDocumentLoad = async (e: DocumentLoadEvent) => {
    const page = await e.doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    onWidthChange(viewport.width);
  };

  return (
    <>
      {url ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="flex-1 overflow-hidden" style={{ height: '100%' }}>
            <Viewer
              fileUrl={url}
              defaultScale={zoom / 100}
              onDocumentLoad={handleDocumentLoad}
              plugins={[defaultLayoutPluginInstance]}
              key={`${url}-${zoom}`}
            />
          </div>
        </Worker>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          (No document loaded)
        </div>
      )}
    </>
  )
}

export default PDFViewer
