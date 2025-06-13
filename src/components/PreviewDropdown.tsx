import React from 'react';

interface File {
  url: string;
  name:string;
}
interface Props {
  files: File[];
  onFileSelect: (file: File) => void;
}

const PreviewDropdown = ({ files, onFileSelect }: Props) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
      <ul className="list-none m-0 p-1">
        {files.map((file) => (
          <li
            key={file.url}
            onClick={() => onFileSelect(file)}
            className="px-3 py-2 text-sm text-slate-700 cursor-pointer rounded-md hover:bg-slate-100"
          >
            <span className="block truncate">{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreviewDropdown;