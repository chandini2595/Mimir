'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { getFilePreviewUrl } from '../lib/utils'
import { useEffect, useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface Props {
  url: string | null
  fileName: string | null
  zoom?: number // optional zoom prop
}

const PDFViewer = ({ url, fileName, zoom = 100 }: Props) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [fitToWidth, setFitToWidth] = useState(true)
  useEffect(() => {
    setFitToWidth(zoom === 100)
  }, [zoom])

  return (
    <div className="flex-1 overflow-y-auto flex justify-center items-start">
      {url ? (
        <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
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

/**
 * Returns the preview URL for a file, using local or S3 path depending on environment.
 *
 * Example usage in a component:
 * const previewUrl = getFilePreviewUrl(s3Key);
 * <iframe src={previewUrl} ... />
 */

export default PDFViewer
