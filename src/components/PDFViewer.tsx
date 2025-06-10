'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useEffect, useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface Props {
  url: string | null
  zoom?: number // optional zoom prop
}

const PDFViewer = ({ url, zoom = 100 }: Props) => {
  const [fitToWidth, setFitToWidth] = useState(true)
  useEffect(() => {
    setFitToWidth(zoom === 100)
  }, [zoom])

  return (
    <div className="flex-1 overflow-y-auto flex justify-center items-start">
      {url ? (
        <Document file={url}>
          <Page pageNumber={1} scale={fitToWidth ? 1 : zoom / 100} />
        </Document>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          (No document loaded)
        </div>
      )}
    </div>
  )
}

export default PDFViewer
