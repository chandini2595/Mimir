import React from 'react';

interface SidebarProps {
  fileName: string | null | undefined;
  onClose: () => void; 
}

const Sidebar = ({ fileName, onClose }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full text-slate-700">
      <div className="flex items-center justify-between p-4 border-b border-slate-200/80">
        <h1 className="text-lg font-bold text-slate-800">Mimir</h1>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-slate-200/80 transition-colors"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Welcome</h2>
          <p className="text-sm text-slate-800">Ram</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active File</h2>
          <p className="text-sm text-slate-800 break-words">
            {fileName || 'No document uploaded'}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;