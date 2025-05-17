"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Link, FileText, Linkedin } from "lucide-react"

interface ShareDropdownProps {
  onCopyUrl: () => void
  onGeneratePdf: () => void
  onShareLinkedIn: () => void
}

export function ShareDropdown({ onCopyUrl, onGeneratePdf, onShareLinkedIn }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="default" 
        size="sm" 
        className="w-fit px-7 py-0.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        Share
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              onCopyUrl()
              setIsOpen(false)
            }}
          >
            <Link className="h-4 w-4" />
            <span>Copy profile URL</span>
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              onGeneratePdf()
              setIsOpen(false)
            }}
          >
            <FileText className="h-4 w-4" />
            <span>PDF Snapshot</span>
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              onShareLinkedIn()
              setIsOpen(false)
            }}
          >
            <Linkedin className="h-4 w-4" />
            <span>Share to LinkedIn</span>
          </button>
        </div>
      )}
    </div>
  )
} 