// src/app/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import ChatWindow from '@/components/ChatWindow'
import ChatInput from '@/components/ChatInput'
import PreviewDropdown from '@/components/PreviewDropdown'
import MultiSelectDropdown from '@/components/MultiSelectDropdown'
import { openPreviewTab } from '@/lib/utils'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), { ssr: false });

export default function ChatPage() {
  // State
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewWidth, setPreviewWidth] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [pdfFiles, setPdfFiles] = useState<Array<{ url: string, name: string, fullPath: string }>>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showMultiSelectDropdown, setShowMultiSelectDropdown] = useState(false);
  const [activePreviewFile, setActivePreviewFile] = useState<{ url: string, name: string } | null>(null);
  const [showFileSwitcher, setShowFileSwitcher] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false); // State for drag-and-drop

  // Handlers
  const handleResponse = async (userMessage: string) => { 
    setMessages((prev) => [...prev, { user: userMessage, ai: '...' }]);
    // ...rest of your fetch logic
  };

  const handleUpload = (url: string, name: string, fullPath: string) => {
    const newFile = { url, name, fullPath };
    setPdfFiles((prev) => [...prev, newFile]);

    if (pdfFiles.length === 0) {
      const defaultWidth = Math.min(window.innerWidth * 0.35, 900);
      setPreviewWidth(defaultWidth);
      setActivePreviewFile(newFile);
      setShowPreview(true);
    }
  };

  const handlePreviewAllClick = () => {
    if (pdfFiles.length >= 2 && pdfFiles.length <= 3) {
      openPreviewTab(pdfFiles);
    } else if (pdfFiles.length > 3) {
      setShowMultiSelectDropdown(prev => !prev);
    }
  };

  const handleMouseDown = () => setIsDragging(true);

  // Drag-and-Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        if (file.type === "application/pdf") {
          const url = URL.createObjectURL(file);
          handleUpload(url, file.name, file.name);
        } else {
          alert("Only PDF files can be uploaded.");
        }
      }
    }
  };

  // useEffect hooks
  useEffect(() => {
    if (pdfFiles.length > 0 && !activePreviewFile) {
      const defaultWidth = Math.min(window.innerWidth * 0.35, 900);
      setPreviewWidth(defaultWidth);
      setActivePreviewFile(pdfFiles[0])
      setShowPreview(true)
    }
  }, [pdfFiles, activePreviewFile]);

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 250 && newWidth <= 900) {
        setPreviewWidth(newWidth);
      }
    };
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUpGlobal);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showPreview && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setZoom((prev) => {
          let next = prev - Math.sign(e.deltaY) * 10;
          if (next < 25) next = 25;
          if (next > 300) next = 300;
          return next;
        });
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showPreview]);

  return (
    <main className="flex h-screen overflow-hidden" style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: '14px' }}>
      
      <div className="relative h-full" style={{ width: sidebarOpen ? 256 : 0, minWidth: 0, transition: 'width 0.5s cubic-bezier(.4,2,.6,1)' }}>
        <div className={`transition-all duration-500 ease-[cubic-bezier(.4,2,.6,1)] h-full absolute left-0 top-0 ${sidebarOpen ? 'translate-x-0 opacity-100 shadow-2xl' : '-translate-x-full opacity-0 pointer-events-none'} w-64 bg-white/80 border-r border-blue-100`} style={{ boxShadow: sidebarOpen ? '0 12px 48px 0 rgba(80,120,255,0.18), 0 2px 12px 0 rgba(0,0,0,0.10)' : 'none', transitionProperty: 'transform, opacity, box-shadow', zIndex: 20, minWidth: 0, overflow: 'hidden' }}>
          {sidebarOpen && <Sidebar fileName={activePreviewFile?.name} onClose={() => setSidebarOpen(false)} />}
        </div>
      </div>

      <div 
        className="flex flex-col flex-1 relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDraggingOver && (
          <div className="absolute inset-0 bg-blue-500/10 border-4 border-dashed border-blue-500/50 rounded-2xl z-50 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">Drop PDFs to Upload</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 px-6 py-4 bg-white/80 shadow-sm relative z-30" style={{ borderBottom: 'none', boxShadow: 'none', background: 'rgba(255,255,255,0.85)' }}>
          {!sidebarOpen && (
            <button 
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border shadow hover:bg-blue-100 transition-all duration-300 group mr-2`} 
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', border: 'none' }} 
              onClick={() => setSidebarOpen(true)} 
              aria-label="Open sidebar"
            >
              <span className="relative w-6 h-6 flex items-center justify-center">
                <span className={`absolute left-0 top-1 w-6 h-0.5 bg-blue-500 rounded`}/>
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-blue-500 rounded`}/>
                <span className={`absolute left-0 top-5 w-6 h-0.5 bg-blue-500 rounded`}/>
              </span>
            </button>
          )}
          
          <div className="flex-grow"></div>

          <div className="flex gap-2 ml-auto" style={{ zIndex: 50 }}>
            <div className="relative">
              <button onClick={handlePreviewAllClick} disabled={pdfFiles.length < 2} className="w-48 justify-center px-3 py-2 rounded-xl border-0 bg-white/80 text-xs font-semibold shadow-[0_2px_12px_0_rgba(120,180,255,0.13),0_1px_4px_0_rgba(0,0,0,0.08)] hover:bg-white/90 backdrop-blur-lg transition-all duration-400 ring-1 ring-blue-100 focus:ring-2 focus:ring-blue-200 flex items-center gap-1 disabled:opacity-50">
                {pdfFiles.length > 3 ? 'Select to Preview All...' : `Preview All (${pdfFiles.length})`}
              </button>
              {showMultiSelectDropdown && (
                <MultiSelectDropdown
                  allFiles={pdfFiles}
                  onConfirm={(selectedFiles) => {
                    openPreviewTab(selectedFiles);
                    setShowMultiSelectDropdown(false);
                  }}
                />
              )}
            </div>
            <button
              onClick={() => setShowPreview(prev => !prev)}
              disabled={pdfFiles.length === 0}
              className={`justify-center bg-white/80 border-0 rounded-lg shadow text-xs backdrop-blur-md transition-all duration-300 active:scale-95 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 animate-in disabled:opacity-50 font-semibold flex items-center ${showPreview ? 'w-10 h-10 p-2' : 'w-48 p-3'}`}
            >
              {showPreview ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="transition-transform duration-200">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              ) : (
                'Show Preview'
              )}
            </button>
          </div>
        </div>

        <ChatWindow messages={messages} />
        <ChatInput onResponse={handleResponse} onUpload={handleUpload} />
      </div>

      <div className={`h-screen hidden md:flex flex-col border-l bg-white/60 shadow-2xl backdrop-blur-lg ${showPreview ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`} style={{ width: showPreview ? previewWidth : 0, minWidth: showPreview ? 250 : 0, maxWidth: 900, position: 'relative', zIndex: 30, overflow: 'hidden' }}>
        {showPreview && (
          <div onMouseDown={handleMouseDown} className="absolute left-0 top-0 h-full w-[6px] cursor-col-resize bg-gray-300 hover:bg-gray-400 z-40" style={{ userSelect: 'none' }} />
        )}
        
        <div 
          className="p-2 font-semibold border-b flex items-center justify-between relative"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-600 text-sm flex-shrink-0">Previewing:</span>
            <strong className="text-slate-900 text-sm truncate">{activePreviewFile?.name || '...'}</strong>
            
            {pdfFiles.length > 1 && (
              <div className="relative">
                  <button 
                    onClick={() => setShowFileSwitcher(prev => !prev)}
                    className="flex-shrink-0 ml-1 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    Switch
                    <svg className={`w-4 h-4 transition-transform duration-200 ${showFileSwitcher ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {showFileSwitcher && (
                    <PreviewDropdown
                        files={pdfFiles}
                        onFileSelect={(file) => {
                          setActivePreviewFile(file);
                          setShowFileSwitcher(false);
                        }}
                      />
                  )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-2 border-b bg-gray-50/80">
          <label className="text-xs">Zoom:</label>
          <input type="number" className="w-[60px] px-2 py-1 text-sm border rounded" value={zoom} min={25} max={300} onChange={(e) => setZoom(Number(e.target.value))} />
          <span className="text-xs">%</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activePreviewFile ? (
            <PDFViewer url={activePreviewFile.url} fileName={activePreviewFile.name} zoom={zoom} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm">
              (No document loaded)
            </div>
          )}
        </div>
      </div>
    </main>
  );
}