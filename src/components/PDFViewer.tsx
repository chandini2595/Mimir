'use client'

import { Worker, Viewer } from '@react-pdf-viewer/core'
import type { DocumentLoadEvent } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'

interface Props {
  url: string | null
  fileName: string | null
  zoom?: number
  onWidthChange: (width: number) => void;
}

const PDFViewer = ({ url, zoom = 100, onWidthChange }: Props) => {

  const handleDocumentLoad = async (e: DocumentLoadEvent) => {
    const page = await e.doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    onWidthChange(viewport.width);
  };

  return (
    <>
      {url ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="flex-1 overflow-y-auto flex justify-center items-start">
            <Viewer
              fileUrl={url}
              defaultScale={zoom / 100}
              onDocumentLoad={handleDocumentLoad}
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