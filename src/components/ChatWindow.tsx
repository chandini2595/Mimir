'use client'

import { FC } from 'react'

interface Props {
  messages: { user: string; ai: string }[]
}

const ChatWindow: FC<Props> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, i) => (
        <div key={i}>
          {msg.user && (
            <div className="mb-1 text-right">
              <p className="inline-block bg-blue-100 text-blue-900 p-2 rounded">
                {msg.user}
              </p>
            </div>
          )}
          <div className="text-left">
            <p className="inline-block bg-gray-100 text-gray-800 p-2 rounded">
              {msg.ai}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatWindow
