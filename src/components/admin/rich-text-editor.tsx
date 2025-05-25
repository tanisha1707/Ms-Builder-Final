/* eslint-disable jsx-a11y/alt-text */
// src/components/admin/rich-text-editor.tsx
"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  Quote, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
  Eye,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your blog post...",
  minHeight = "400px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [currentTool, setCurrentTool] = useState<string>("")

  useEffect(() => {
    if (editorRef.current && !isPreviewMode) {
      editorRef.current.innerHTML = value
    }
  }, [value, isPreviewMode])

  const executeCommand = useCallback((command: string, value?: string) => {
    if (isPreviewMode) return
    
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    setCurrentTool(command)
    setTimeout(() => setCurrentTool(""), 200)
  }, [onChange, isPreviewMode])

  const handleInput = useCallback(() => {
    if (editorRef.current && !isPreviewMode) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange, isPreviewMode])

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${linkText}</a>`
      executeCommand('insertHTML', linkHtml)
      setShowLinkDialog(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      const imgHtml = `<div style="text-align: center; margin: 20px 0;"><img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" /></div>`
      executeCommand('insertHTML', imgHtml)
      setShowImageDialog(false)
      setImageUrl("")
      setImageAlt("")
    }
  }

  const insertQuote = () => {
    const quoteHtml = `<blockquote style="border-left: 4px solid #eab308; padding-left: 16px; padding-top: 8px; padding-bottom: 8px; margin: 16px 0; background-color: #fefce8; font-style: italic; color: #374151;">"Your inspiring quote here"</blockquote>`
    executeCommand('insertHTML', quoteHtml)
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString() || `Heading ${level}`
      
      let headingStyle = ""
      switch(level) {
        case 1:
          headingStyle = "font-size: 2rem; font-weight: bold; margin: 16px 0; color: #1f2937;"
          break
        case 2:
          headingStyle = "font-size: 1.5rem; font-weight: 600; margin: 12px 0; color: #374151;"
          break
        case 3:
          headingStyle = "font-size: 1.25rem; font-weight: 500; margin: 8px 0; color: #4b5563;"
          break
      }
      
      const headingHtml = `<h${level} style="${headingStyle}">${selectedText}</h${level}>`
      executeCommand('insertHTML', headingHtml)
    }
  }

  const insertCodeBlock = () => {
    const codeHtml = `<pre style="background-color: #1f2937; color: #10b981; padding: 16px; border-radius: 8px; margin: 16px 0; overflow-x: auto; font-family: 'Courier New', monospace;"><code>// Your code here
function example() {
  return "Hello World!";
}</code></pre>`
    executeCommand('insertHTML', codeHtml)
  }

  const insertHighlight = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      if (selectedText) {
        const highlightHtml = `<span style="background-color: #fef08a; padding: 2px 4px; border-radius: 3px;">${selectedText}</span>`
        executeCommand('insertHTML', highlightHtml)
      }
    }
  }

  const insertDivider = () => {
    const dividerHtml = `<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 24px 0;" />`
    executeCommand('insertHTML', dividerHtml)
  }

  const insertCallout = () => {
    const calloutHtml = `<div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 4px;"><strong style="color: #1e40af;">💡 Pro Tip:</strong> <span style="color: #1e40af;">Add your important tip or note here</span></div>`
    executeCommand('insertHTML', calloutHtml)
  }

  const formatText = (format: string) => {
    executeCommand(format)
  }

  const toolbarGroups = [
    {
      title: "Text Formatting",
      tools: [
        { icon: Bold, command: () => formatText('bold'), title: "Bold (Ctrl+B)" },
        { icon: Italic, command: () => formatText('italic'), title: "Italic (Ctrl+I)" },
        { icon: Underline, command: () => formatText('underline'), title: "Underline (Ctrl+U)" },
        { icon: Type, command: insertHighlight, title: "Highlight Text" },
      ]
    },
    {
      title: "Headings",
      tools: [
        { icon: Heading1, command: () => insertHeading(1), title: "Heading 1" },
        { icon: Heading2, command: () => insertHeading(2), title: "Heading 2" },
        { icon: Heading3, command: () => insertHeading(3), title: "Heading 3" },
      ]
    },
    {
      title: "Alignment",
      tools: [
        { icon: AlignLeft, command: () => executeCommand('justifyLeft'), title: "Align Left" },
        { icon: AlignCenter, command: () => executeCommand('justifyCenter'), title: "Center Align" },
        { icon: AlignRight, command: () => executeCommand('justifyRight'), title: "Align Right" },
      ]
    },
    {
      title: "Lists",
      tools: [
        { icon: List, command: () => executeCommand('insertUnorderedList'), title: "Bullet List" },
        { icon: ListOrdered, command: () => executeCommand('insertOrderedList'), title: "Numbered List" },
      ]
    },
    {
      title: "Media & Elements",
      tools: [
        { icon: Link, command: () => setShowLinkDialog(true), title: "Insert Link" },
        { icon: Image, command: () => setShowImageDialog(true), title: "Insert Image" },
        { icon: Quote, command: insertQuote, title: "Insert Quote" },
        { icon: Code, command: insertCodeBlock, title: "Code Block" },
      ]
    },
    {
      title: "Actions",
      tools: [
        { icon: Undo, command: () => executeCommand('undo'), title: "Undo (Ctrl+Z)" },
        { icon: Redo, command: () => executeCommand('redo'), title: "Redo (Ctrl+Y)" },
      ]
    }
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatText('bold')
          break
        case 'i':
          e.preventDefault()
          formatText('italic')
          break
        case 'u':
          e.preventDefault()
          formatText('underline')
          break
        case 'z':
          e.preventDefault()
          executeCommand('undo')
          break
        case 'y':
          e.preventDefault()
          executeCommand('redo')
          break
      }
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={!isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(false)}
            className={!isPreviewMode ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(true)}
            className={isPreviewMode ? "bg-yellow-500 text-black hover:bg-yellow-600" : ""}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          {value.replace(/<[^>]*>/g, '').length} characters
        </div>
      </div>

      {!isPreviewMode && (
        <>
          {/* Toolbar */}
          <div className="bg-gray-50 border-b border-gray-300 p-3">
            <div className="flex flex-wrap gap-4">
              {toolbarGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex items-center space-x-1">
                  {group.tools.map((tool, toolIndex) => (
                    <Button
                      key={toolIndex}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={tool.command}
                      title={tool.title}
                      className={`h-8 w-8 p-0 hover:bg-yellow-100 hover:text-yellow-800 transition-all ${
                        currentTool === tool.title ? 'bg-yellow-200 scale-105' : ''
                      }`}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  {groupIndex < toolbarGroups.length - 1 && (
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={insertCallout}
                className="text-xs hover:bg-blue-50 hover:border-blue-300"
              >
                💡 Callout Box
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={insertDivider}
                className="text-xs hover:bg-gray-50"
              >
                ➖ Divider
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Editor Content */}
      {!isPreviewMode ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="p-6 focus:outline-none focus:ring-2 focus:ring-yellow-500 prose prose-lg max-w-none overflow-y-auto bg-white"
          style={{ 
            minHeight,
            lineHeight: '1.7',
            fontSize: '16px',
            color: '#1f2937'
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      ) : (
        <div 
          className="p-6 prose prose-lg max-w-none overflow-y-auto bg-white"
          style={{ minHeight, lineHeight: '1.7' }}
          dangerouslySetInnerHTML={{ 
            __html: value || `<p style="color: #9ca3af; font-style: italic;">${placeholder}</p>` 
          }}
        />
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Link className="h-5 w-5 mr-2" />
                Insert Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Link Text</label>
                <Input
                  placeholder="Enter link text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">URL</label>
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={insertLink} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
                  disabled={!linkUrl || !linkText}
                >
                  Insert Link
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLinkDialog(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Image className="h-5 w-5 mr-2" />
                Insert Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Image URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Alt Text</label>
                <Input
                  placeholder="Describe the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={insertImage} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black flex-1"
                  disabled={!imageUrl}
                >
                  Insert Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowImageDialog(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor Styles */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2rem !important;
          font-weight: bold !important;
          margin: 16px 0 !important;
          color: #1f2937 !important;
          line-height: 1.2 !important;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 12px 0 !important;
          color: #374151 !important;
          line-height: 1.3 !important;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem !important;
          font-weight: 500 !important;
          margin: 8px 0 !important;
          color: #4b5563 !important;
          line-height: 1.4 !important;
        }
        
        [contenteditable] p {
          margin: 8px 0 !important;
          line-height: 1.7 !important;
          color: #1f2937 !important;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 16px 0 !important;
          padding-left: 24px !important;
        }
        
        [contenteditable] li {
          margin: 4px 0 !important;
          line-height: 1.6 !important;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #eab308 !important;
          padding-left: 16px !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
          margin: 16px 0 !important;
          background-color: #fefce8 !important;
          font-style: italic !important;
          color: #374151 !important;
        }
        
        [contenteditable] code {
          background-color: #f3f4f6 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 0.875rem !important;
          color: #1f2937 !important;
        }
        
        [contenteditable] pre {
          background-color: #1f2937 !important;
          color: #10b981 !important;
          padding: 16px !important;
          border-radius: 8px !important;
          margin: 16px 0 !important;
          overflow-x: auto !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          line-height: 1.5 !important;
        }
        
        [contenteditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8 !important;
        }
        
        [contenteditable] img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          margin: 16px 0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        [contenteditable] hr {
          border: none !important;
          border-top: 2px solid #e5e7eb !important;
          margin: 24px 0 !important;
        }
      `}</style>
    </div>
  )
}