"use client";

import React from "react";
import "../globals.css";

export default function DevGift() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="liquid-glass-card max-w-md w-full p-8 flex flex-col items-center relative" style={{ minWidth: 340, minHeight: 320, boxShadow: '0 8px 32px rgba(31,38,135,0.18), 0 4px 16px rgba(31,38,135,0.09)' }}>
        <div className="glass-specular" />
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-900">Welcome, Developer! 🎁</h2>
        <p className="mb-4 text-center text-blue-800">Here’s a little gift for you. Use these credentials for developer login while S3 is not connected.</p>
        <div className="w-full bg-white/60 rounded-xl p-4 mb-4 border border-blue-200/60 shadow-inner">
          <div className="mb-2 text-blue-700"><strong>Email:</strong> dev@mimir.dev</div>
          <div className="mb-2 text-blue-700"><strong>Password:</strong> @A1b2C3d4E5f6G7h8I9</div>
        </div>
        <div className="text-xs text-blue-600 text-center">This page is secret. Only developers know this route.<br/>Enjoy your glassy gift! ✨</div>
      </div>
    </div>
  );
}
