'use client'

interface File {
  url: string;
  name: string;
}

interface Props {
  files: File[];
  activeFileName: string | undefined;
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export default function PreviewSidebar({ files, activeFileName, onFileSelect, onClose }: Props) {
  return (
    <div className="h-full w-60 bg-slate-50/95 backdrop-blur-lg border-l border-slate-200 flex flex-col">
      
      <div className="flex items-center justify-between p-2 pl-4 border-b">
        <h3 className="font-semibold text-sm text-slate-800">Uploaded Documents</h3>
        <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close document list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto p-1">
        <ul>
          {files.map((file) => (
            <li key={file.url}>
              
              <button
                onClick={() => onFileSelect(file)}
                className={`w-full text-left text-sm rounded-md my-1 flex items-center gap-3 px-3 py-2 transition-colors ${
                  file.name === activeFileName
                    ? 'bg-blue-100 text-blue-800 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-200/60' 
                }`}
              >
                
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-5 h-5 flex-shrink-0 ${
                    file.name === activeFileName ? 'text-blue-500' : 'text-slate-400'
                }`}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>

                
                <span className="truncate">
                  {file.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}