'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  onUpload: (localPreviewUrl: string, name: string, fullPath: string, s3Info?: { s3Key: string, s3Url: string }) => void
}

export default function FileUploader({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    console.log('🔄 Starting file upload process for:', file.name)
    
    // Show uploading state immediately
    setUploading(true)
    
    // First upload to S3, then preview from S3
    try {
      const s3Info = await uploadToS3First(file)
      if (s3Info) {
        // Use S3 URL for preview instead of local blob
        onUpload(s3Info.s3Url, file.name, s3Info.s3Key, s3Info)
        console.log('✅ File uploaded to S3 and preview updated:', s3Info)
      } else {
        // Fallback to local preview if S3 upload fails
        console.warn('⚠️ S3 upload failed, using local preview')
        const previewUrl = URL.createObjectURL(file)
        const simulatedPath = `C:/Users/ramac/Documents/Bucket/Mimir/${file.name}`
        onUpload(previewUrl, file.name, simulatedPath)
      }
    } catch (error) {
      console.error('❌ Failed to upload to S3:', error)
      // Fallback to local preview
      const previewUrl = URL.createObjectURL(file)
      const simulatedPath = `C:/Users/ramac/Documents/Bucket/Mimir/${file.name}`
      onUpload(previewUrl, file.name, simulatedPath)
    } finally {
      setUploading(false)
    }
  }
  const uploadToS3First = async (file: File): Promise<{ s3Key: string, s3Url: string } | null> => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No authentication token found, skipping S3 upload')
      return null
    }

    console.log('🔄 Uploading to S3:', { name: file.name, size: file.size, type: file.type })
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const data = await res.json()
      console.log('🔄 Upload response:', { status: res.status, data })

      if (res.ok && data.success) {
        console.log('✅ File uploaded to S3 with user metadata:', data)
        return {
          s3Key: data.s3Key,
          s3Url: data.s3Url
        }
      } else {
        console.error('❌ S3 upload failed:', { status: res.status, error: data.error || data })
        return null
      }
    } catch (err) {
      console.error('❌ S3 upload error:', err)
      return null
    }
  }

  const handleChange = () => {
    const file = inputRef.current?.files?.[0]
    if (file) handleFile(file)
  }
  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const data = await res.json()
      setUploading(false)

      if (!res.ok) {
        console.error('❌ Upload failed:', data)
      } else {
        console.log('✅ File processed and uploaded:', data)
        // If the upload includes processed pages, we might want to handle them
        if (data.pageUrls?.length) {
          const previewUrl = URL.createObjectURL(file)
          onUpload(previewUrl, file.name, data.s3Folder, {
            s3Key: data.s3Folder,
            s3Url: data.pageUrls[0]?.s3Key || ''
          })
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
      />      <button
        onClick={() => inputRef.current?.click()}
        className="border px-3 py-1 text-sm"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Select PDF'}
      </button>
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="border px-3 py-1 text-sm"
      >
        {uploading ? 'Processing...' : 'Upload & Process'}
      </button>
      <div className="text-sm text-gray-500 ml-2">
        {uploading ? '⏳ Uploading to S3...' : dragging ? '📂 Drop your PDF anywhere' : 'or drag & drop a PDF anywhere (auto-uploads to S3)'}
      </div>
    </div>
  )
}
