'use client'
import React, { useState } from 'react';

interface File {
  url: string;
  name: string;
}
interface Props {
  allFiles: File[];
  onConfirm: (selectedFiles: File[]) => void;
}

const MultiSelectDropdown = ({ allFiles, onConfirm }: Props) => {
  const [selected, setSelected] = useState<File[]>([]);

  const handleSelect = (file: File) => {
    const isSelected = selected.some(f => f.url === file.url);
    if (isSelected) {
      setSelected(selected.filter((f) => f.url !== file.url));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, file]);
      } else {
        alert('You can only select a maximum of 3 documents.');
      }
    }
  };

return (
  <div 
    className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-blue-100/80 bg-white/80 shadow-2xl backdrop-blur-lg z-50 overflow-hidden"
    style={{ fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
  >
    <div className="p-3">
      <p className="text-xs text-slate-500 px-1 mb-2">Select up to 3 documents.</p>
      
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {allFiles.map(file => {
          const isChecked = selected.some(f => f.url === file.url);
          return (
            <div key={file.url} onClick={() => handleSelect(file)}>
              <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isChecked ? 'bg-blue-100/80' : 'hover:bg-slate-100/80'}`}>
                <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-400'}`}>
                  {isChecked && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-800 select-none truncate">{file.name}</span>
              </label>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/80">
        <button
          onClick={() => onConfirm(selected)}
          disabled={selected.length === 0}
          className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          Confirm ({selected.length})
        </button>
        
        <button
          onClick={() => setSelected([])}
          disabled={selected.length === 0}
          className="w-full px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg shadow-sm hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>

    </div>
  </div>
);
};

export default MultiSelectDropdown;