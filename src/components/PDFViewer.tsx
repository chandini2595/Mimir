'use client'

import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { getFilePreviewUrl } from '../lib/utils'
import { useEffect, useState } from 'react'

interface Props {
  url: string | null
  fileName: string | null
  zoom?: number 
}

const PDFViewer = ({ url, fileName, zoom = 100 }: Props) => {
  const [fitToWidth, setFitToWidth] = useState(true)
  useEffect(() => {
    setFitToWidth(zoom === 100)
  }, [zoom])

  return (
    <>
      {url ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="flex-1 overflow-y-auto flex justify-center items-start">
            <Viewer
              fileUrl={url}
              defaultScale={fitToWidth ? 1 : zoom / 100}
              key={zoom + '-' + url}
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
