"use client"

import React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  className?: string
}

export function CodeEditor({ value, onChange, language, className }: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1])

  useEffect(() => {
    const lines = value.split("\n").length
    setLineNumbers(Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1))
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + "    " + value.substring(end)
      onChange(newValue)
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className={cn("relative flex bg-[#1e1e1e] rounded-lg overflow-hidden", className)}>
      <div className="flex-shrink-0 py-4 px-2 text-right bg-[#1e1e1e] select-none border-r border-[#333]">
        {lineNumbers.map((num) => (
          <div key={num} className="text-xs leading-6 text-[#858585] font-mono pr-2">
            {num}
          </div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-4 bg-transparent text-[#d4d4d4] font-mono text-sm leading-6 resize-none outline-none min-h-[400px] w-full"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={`// Write your ${language} code here...`}
      />
    </div>
  )
}
