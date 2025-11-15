'use client';

import React, { useState } from 'react';
import { AIAdvisor } from './AIAdvisor';

/**
 * Floating AI Chat Widget
 * 
 * A collapsible chat interface that sits in the bottom-right corner
 * Provides quick access to AI portfolio advisor without taking up main screen space
 */
export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Widget Container */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Expanded Chat Window */}
        {isOpen && (
          <div className="mb-4 w-[400px] h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-pink-500/30 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Portfolio Advisor</h3>
                  <p className="text-xs text-gray-400">Powered by Groq</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <AIAdvisor />
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            group relative w-16 h-16 rounded-full
            bg-gradient-to-br from-pink-500 to-purple-600
            hover:from-pink-600 hover:to-purple-700
            shadow-lg hover:shadow-xl
            transition-all duration-300
            flex items-center justify-center
            ${isOpen ? 'scale-0' : 'scale-100'}
          `}
          aria-label="Open AI chat"
        >
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-20" />
          
          {/* Icon */}
          <svg
            className="w-8 h-8 text-white relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>

          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask AI Advisor
            <span className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-l-8 border-l-gray-800 border-y-4 border-y-transparent" />
          </span>
        </button>
      </div>
    </>
  );
}

