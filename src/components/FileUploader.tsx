'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  onUpload: (localPreviewUrl: string, name: string, fullPath: string) => void
}

export default function FileUploader({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    const simulatedPath = `C:/Users/ramac/Documents/Bucket/Mimir/${file.name}`
    onUpload(previewUrl, file.name, simulatedPath)
  }

  const handleChange = () => {
    const file = inputRef.current?.files?.[0]
    if (file) handleFile(file)
  }

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setUploading(false)

      if (!res.ok) {
        console.error('❌ Upload failed:', data)
      } else {
        // If local, preview the first page or file
        if (process.env.NEXT_PUBLIC_LOCAL_DEV === 'true' && data.s3Keys?.length) {
          const previewUrl = `/local-files/${data.s3Keys[0]}`
          onUpload(previewUrl, file.name, data.s3Keys[0])
        } else {
          // fallback: use the uploaded file's S3 or remote URL
          onUpload('', file.name, data.s3Keys?.[0] || '')
        }
      }
    } catch (err) {
      setUploading(false)
      console.error('❌ Upload error:', err)
    }
  }

  // 🌐 GLOBAL DRAG-AND-DROP LISTENERS
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setDragging(true)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)

      const file = e.dataTransfer?.files?.[0]
      if (file) handleFile(file)
    }

    const handleDragLeave = () => {
      setDragging(false)
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)
    window.addEventListener('dragleave', handleDragLeave)

    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('dragleave', handleDragLeave)
    }
  }, [])

  return (
    <div
      className={`p-2 border-b flex items-center gap-2 transition-all ${
        dragging ? 'bg-blue-50 border-blue-400' : ''
      }`}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="border px-3 py-1 text-sm"
      >
        Select PDF
      </button>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="border px-3 py-1 text-sm"
      >
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>
      <div className="text-sm text-gray-500 ml-2">
        {dragging ? '📂 Drop your PDF anywhere' : 'or drag & drop a PDF anywhere'}
      </div>
    </div>
  )
}
