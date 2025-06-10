'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import ChatInput from '@/components/ChatInput'
import FileUploader from '@/components/FileUploader'
import PDFViewer from '@/components/PDFViewer'

export default function ChatPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([])
  const [showPreview, setShowPreview] = useState(true)
  const [previewWidth, setPreviewWidth] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [pdfFiles, setPdfFiles] = useState<Array<{ url: string, name: string, fullPath: string }>>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [deckOpen, setDeckOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined)
  const [deckVisible, setDeckVisible] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleResponse = async (userMessage: string) => {
    setMessages((prev) => [...prev, { user: userMessage, ai: '...' }])

    const lowerMsg = userMessage.toLowerCase()
    const isFilePathQuery =
      lowerMsg.includes('file path') ||
      lowerMsg.includes('file location') ||
      lowerMsg.includes('where is the file') ||
      lowerMsg.includes('document location')

    if (isFilePathQuery && filePath) {
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].ai = `📁 File is located at:\n\`${filePath}\``
        return newMessages
      })
      return
    }

    try {
      const formData = new FormData()
      if (fileName && pdfUrl) {
        const blob = await fetch(pdfUrl).then((r) => r.blob())
        formData.append('file', new File([blob], fileName))
      }
      formData.append('message', userMessage)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
        body: JSON.stringify({ query: userMessage, s3Keys: [] }), // TODO: pass s3Keys for context
      })

      const data = await res.json()
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].ai = data.response
        return newMessages
      })
    } catch {
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].ai = '⚠️ Failed to get response.'
        return newMessages
      })
    }
  }

  const handleUpload = (url: string, name: string, fullPath: string) => {
    setPdfFiles((prev) => {
      if (prev.length >= 3) return prev // max 3
      return [...prev, { url, name, fullPath }]
    })
    setSelectedIndex(pdfFiles.length) // select the newly added file
    setMessages((prev) => [...prev, { user: '', ai: `📄 Previewing "${name}"` }])
  }

  // Select file from deck
  const handleSelectFile = (idx: number) => setSelectedIndex(idx)

  // Open all in new tab (side by side)
  const handleOpenAll = () => {
    const html = `<!DOCTYPE html><html><head><title>Document Preview</title>
      <style>
        body { margin: 0; padding: 0; background: linear-gradient(120deg, #0f172a 0%, #1e293b 100%); min-height: 100vh; display: flex; align-items: stretch; gap: 24px; justify-content: center; }
        .doc-preview {
          flex: 1 1 0;
          min-width: 0;
          max-width: 33vw;
          height: 96vh;
          margin: 2vh 0;
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.10);
          box-shadow: 0 8px 40px 0 rgba(80,120,255,0.13), 0 2px 12px 0 rgba(0,0,0,0.10);
          border: 2.5px solid rgba(120,180,255,0.18);
          backdrop-filter: blur(18px) saturate(1.5);
          -webkit-backdrop-filter: blur(18px) saturate(1.5);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .doc-title {
          font-family: 'Fira Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          color: #60a5fa;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          background: rgba(30,41,59,0.85);
          padding: 0.5rem 1rem;
          border-bottom: 1.5px solid #a5b4fc33;
          text-align: center;
        }
        iframe {
          flex: 1 1 0;
          width: 100%;
          height: 100%;
          border: none;
          background: #fff;
        }
      </style>
    </head><body>` +
      pdfFiles.slice(0, 3).map(function(f) {
        return '<div class="doc-preview"><div class="doc-title">' + f.name + '</div><iframe src="' + f.url + '"></iframe></div>';
      }).join('') +
    `</body></html>`;
    const win = window.open()
    if (win) win.document.write(html)
  }

  // Dragging logic for resizing preview
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 250 && newWidth <= 900) {
        setPreviewWidth(newWidth)
      }
    }
  }
  const handleMouseUp = () => setIsDragging(false)

  // Attach/detach mousemove/mouseup listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Handle ctrl+scroll for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showPreview && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setZoom((prev) => {
          let next = prev - Math.sign(e.deltaY) * 10
          if (next < 25) next = 25
          if (next > 300) next = 300
          return next
        })
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [showPreview])

  return (
    <main className="flex h-screen overflow-hidden" style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: '14px' }}>
      {/* Sidebar with collapsible button */}
      <div className="relative h-full" style={{ width: sidebarOpen ? 256 : 0, minWidth: 0, transition: 'width 0.5s cubic-bezier(.4,2,.6,1)' }}>
        {/* Sidebar itself with slide-in/out animation */}
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(.4,2,.6,1)] h-full absolute left-0 top-0 ${sidebarOpen ? 'translate-x-0 opacity-100 shadow-2xl' : '-translate-x-full opacity-0 pointer-events-none'} w-64 bg-white/80 border-r border-blue-100`}
          style={{
            boxShadow: sidebarOpen ? '0 12px 48px 0 rgba(80,120,255,0.18), 0 2px 12px 0 rgba(0,0,0,0.10)' : 'none',
            transitionProperty: 'transform, opacity, box-shadow',
            zIndex: 20,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {sidebarOpen && <Sidebar fileName={pdfFiles[selectedIndex]?.name} />}
        </div>
      </div>
      {/* Main chat area */}
      <div className="flex flex-col flex-1 relative">
        {/* Nav bar with sidebar toggle, FileUploader, and (optionally) upload to S3 */}
        <div className="flex items-center gap-4 px-6 py-4 bg-white/80 shadow-sm relative z-30" style={{ borderBottom: 'none', boxShadow: 'none', background: 'rgba(255,255,255,0.85)' }}>
          {/* Sidebar toggle button, now merged into nav bar as first option */}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border shadow hover:bg-blue-100 transition-all duration-300 group mr-2 ${sidebarOpen ? '' : ''}`}
            style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', border: 'none' }}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <span className="relative w-6 h-6 flex items-center justify-center">
              {/* Hamburger to X animation, always horizontal lines */}
              <span
                className={`absolute left-0 w-6 h-0.5 bg-blue-500 rounded transition-all duration-300 ${sidebarOpen ? 'rotate-45 top-3' : 'top-1'}`}
              />
              <span
                className={`absolute left-0 w-6 h-0.5 bg-blue-500 rounded transition-all duration-300 ${sidebarOpen ? 'opacity-0 top-3' : 'top-3'}`}
              />
              <span
                className={`absolute left-0 w-6 h-0.5 bg-blue-500 rounded transition-all duration-300 ${sidebarOpen ? '-rotate-45 top-3' : 'top-5'}`}
              />
            </span>
          </button>
          {/* FileUploader and (optionally) upload to S3 button go here */}
          <FileUploader onUpload={handleUpload} />
          {/* Show/Hide Deck button, next to FileUploader, with fluid hover effect */}
          {pdfFiles.length > 1 && (
            <button
              className="ml-2 px-4 py-2 rounded-lg border-0 bg-white/80 shadow hover:bg-blue-100 transition-all duration-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2"
              style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', border: 'none', background: 'rgba(255,255,255,0.85)' }}
              onClick={() => setDeckVisible((v) => !v)}
              aria-label={deckVisible ? 'Hide Deck' : 'Show Deck'}
            >
              <span className="transition-all duration-300">{deckVisible ? 'Hide Deck' : 'Show Deck'}</span>
            </button>
          )}
          {/* Show Preview/Hide Preview and Preview All (floating) */}
          <div className="flex gap-2 ml-auto" style={{ position: 'relative', zIndex: 50 }}>
            <button
              className={`bg-white/80 border-0 rounded px-3 py-2 shadow text-xs backdrop-blur-md transition-all duration-300 active:scale-95 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 animate-in`}
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', border: 'none', background: 'rgba(255,255,255,0.85)' }}
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            {!showPreview && pdfFiles.length > 1 && (
              <button
                className="px-3 py-2 rounded-xl border-0 bg-white/80 text-xs font-semibold shadow-[0_2px_12px_0_rgba(120,180,255,0.13),0_1px_4px_0_rgba(0,0,0,0.08)] hover:bg-white/90 backdrop-blur-lg transition-all duration-400 ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-200 flex items-center gap-1"
                style={{
                  boxShadow: '0 4px 16px 0 rgba(120,180,255,0.13), 0 1px 4px 0 rgba(0,0,0,0.08)',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  background: 'rgba(255,255,255,0.85)',
                }}
                onClick={handleOpenAll}
              >
                Preview All
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ transform: 'rotate(-45deg)' }}><path stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-4-4 4 4-4 4"/></svg>
              </button>
            )}
          </div>
        </div>
        {/* Stacked Deck of cards for multiple files */}
        {pdfFiles.length > 1 && deckVisible && (
          <>
            {/* Fullscreen translucent/blurred overlay when deck is open */}
            {deckOpen && (
              <div
                className="fixed inset-0 z-40 transition-all duration-400"
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(10px) saturate(1.2)',
                  WebkitBackdropFilter: 'blur(10px) saturate(1.2)',
                  transition: 'all 0.4s cubic-bezier(.4,2,.6,1)',
                  pointerEvents: 'auto',
                }}
                onClick={() => setDeckOpen(false)}
                aria-hidden={!deckOpen}
              />
            )}
            <div className="absolute left-[calc(50%+60px)] top-[68px] flex items-center gap-3 z-50" style={{ pointerEvents: 'none', transform: 'translateX(-50%)', minWidth: 0 }}>
              {/* Deck container, floating, pointer events only on children */}
              <div
                className={`relative flex items-center h-[44px] w-[240px] transition-all duration-400 ${deckOpen ? 'z-50' : ''}`}
                style={{ background: deckOpen ? 'rgba(255,255,255,0.95)' : 'none', border: deckOpen ? '1.5px solid #bcd0ff' : 'none', boxShadow: deckOpen ? '0 8px 32px 0 rgba(80,120,255,0.13), 0 2px 12px 0 rgba(0,0,0,0.10)' : 'none', borderRadius: deckOpen ? 18 : 12, pointerEvents: 'auto', backdropFilter: deckOpen ? 'blur(8px) saturate(1.2)' : 'none', transition: 'all 0.4s cubic-bezier(.4,2,.6,1)' }}
                onMouseLeave={() => setDeckOpen(false)}
                onMouseEnter={() => setDeckOpen(true)}
              >
                {/* Deck open: show vertical list inside boundary */}
                {deckOpen ? (
                  <div className="flex flex-col w-full p-2 z-50">
                    {pdfFiles.map((f, i) => (
                      <button
                        key={f.fullPath}
                        className={`w-full mb-1 last:mb-0 h-auto rounded-lg border text-[13px] font-semibold flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-blue-50 transition-all duration-300 ${i === selectedIndex ? 'ring-2 ring-blue-300 border-blue-400 bg-blue-100/80' : 'border-gray-300'}`}
                        style={{
                          wordBreak: 'break-all',
                          whiteSpace: 'pre-line',
                          textAlign: 'left',
                          fontWeight: i === selectedIndex ? 700 : 500,
                          color: i === selectedIndex ? '#2563eb' : undefined,
                          boxShadow: i === selectedIndex ? '0 2px 8px 0 rgba(80,120,255,0.10)' : undefined,
                          backdropFilter: 'blur(2px)',
                        }}
                        onClick={() => {
                          setSelectedIndex(i)
                          setDeckOpen(false)
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(undefined)}
                        aria-label={f.name}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Deck closed: show only stacked deck, hide list
                  pdfFiles.map((f, i) => {
                    // Deck logic for stacked/tilted view
                    const isTop = i === selectedIndex;
                    const cardSeparation = pdfFiles.length === 2 ? 54 : 22;
                    let z = 50 - i;
                    let scale = 1 - 0.04 * Math.abs(i - selectedIndex);
                    let tilt = (i - selectedIndex) * 8;
                    let translateX = i * cardSeparation;
                    let blur = 'none';
                    let opacity = 1;
                    const width = 100;
                    const shadow = '0 1px 4px 0 rgba(0,0,0,0.08)';
                    return (
                      <button
                        key={f.fullPath + '-deck'}
                        className={`absolute left-0 top-0 h-11 rounded-lg border text-[11px] font-semibold transition-all duration-500 ${isTop ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300 hover:bg-gray-100'} cursor-default`}
                        style={{
                          width,
                          transform: `translateX(${translateX}px) rotate(${tilt}deg) scale(${scale})`,
                          zIndex: z,
                          filter: blur,
                          boxShadow: shadow,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          padding: '0 6px',
                          opacity,
                        }}
                        tabIndex={-1}
                        aria-hidden={deckOpen}
                      >
                        <span className="block w-full text-center transition-all duration-500" style={{ fontSize: 10 }}>
                          {f.name}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}
        <ChatWindow messages={messages} />
        <ChatInput onResponse={handleResponse} />
      </div>
      {/* Collapsible Preview Window with glassy animation */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(.4,2,.6,1)] h-screen hidden md:flex flex-col border-l bg-white/60 shadow-2xl backdrop-blur-lg ${showPreview ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        style={{ width: showPreview ? previewWidth : 0, minWidth: showPreview ? 250 : 0, maxWidth: 900, position: 'relative', zIndex: 30, overflow: 'hidden' }}
      >
        {/* Draggable resize handle, always present when preview is open */}
        {showPreview && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute left-0 top-0 h-full w-[6px] cursor-col-resize bg-gray-300 hover:bg-gray-400 z-40"
            style={{ userSelect: 'none' }}
          />
        )}
        <div className="p-2 font-semibold border-b flex items-center justify-between relative" style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: '0.01em', fontSize: '1.1rem', color: '#1e293b' }}>
          <span>
            Previewing <strong style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', color: '#2563eb', fontWeight: 700 }}>{pdfFiles[selectedIndex]?.name || '...'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 px-2 py-2 border-b bg-gray-50/80" style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: '0.95rem', color: '#334155' }}>
          <label className="text-xs" style={{ color: '#64748b' }}>Zoom:</label>
          <input
            type="number"
            className="w-[60px] px-2 py-1 text-sm border rounded"
            value={zoom}
            min={25}
            max={300}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ fontFamily: 'inherit', fontSize: '1rem', color: '#2563eb', fontWeight: 600 }}
          />
          <span className="text-xs" style={{ color: '#64748b' }}>%</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {pdfFiles[selectedIndex]?.url ? (
            <PDFViewer url={pdfFiles[selectedIndex].url} fileName={pdfFiles[selectedIndex].name} zoom={zoom} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm" style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', color: '#64748b', opacity: 0.8 }}>
              (No document loaded)
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
