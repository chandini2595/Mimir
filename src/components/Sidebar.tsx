'use client'

import { FC } from 'react'

interface SidebarProps {
  fileName: string | null
}

const Sidebar: FC<SidebarProps> = ({ fileName }) => {
  return (
    <aside className="w-64 bg-muted p-4 border-r h-screen">
      <h2 className="text-lg font-semibold mb-4">Mimir</h2>
      <div className="text-sm text-muted-foreground">
        <p>Welcome, Ram</p>
        <div className="mt-4">
          {fileName ? (
            <>
              <p className="text-xs text-gray-400 mb-1">📄 Active File</p>
              <p className="font-medium break-words">{fileName}</p>
            </>
          ) : (
            <p>No document uploaded</p>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
