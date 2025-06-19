import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';


interface Props {
  onResponse: (message: string) => void;
  onUpload: (url: string, name: string, fullPath: string) => void;
}

const ChatInput = ({ onResponse, onUpload }: Props) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onResponse(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height after sending
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload/preview', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success && data.s3Url) {
          onUpload(data.s3Url, file.name, data.s3Key);
        } else {
          // fallback to local preview if S3 upload fails
          const url = URL.createObjectURL(file);
          onUpload(url, file.name, file.name);
        }
      } catch (err) {
        // fallback to local preview on error
        const url = URL.createObjectURL(file);
        onUpload(url, file.name, file.name);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="p-4 bg-transparent">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3 shadow-lg">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
          className="w-full bg-transparent border-0 resize-none p-2 focus:ring-0 placeholder-slate-400 text-slate-800"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={handleAttachClick} className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 bg-white/50 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors relative" disabled={uploading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 18 16">
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
              </svg>
              {uploading ? 'Uploading...' : 'Attach'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
          </div>
          <button onClick={handleSend} disabled={!message.trim()} className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white disabled:bg-slate-300 transition-colors relative">
            <svg className="send-arrow" xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15.5a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V15a.5.5 0 0 0 .5.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;