import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import './App.css'

function App() {
  const [book, setBook] = useState({
    title: 'Untitled Book',
    chapters: [{ id: 1, title: 'Chapter 1', content: '<p>Start writing your book here...</p>' }]
  })
  const [currentChapter, setCurrentChapter] = useState(1)
  const [lastSaved, setLastSaved] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('bookData')
    if (saved) {
      setBook(JSON.parse(saved))
    }
  }, [])

  const saveBook = () => {
    localStorage.setItem('bookData', JSON.stringify(book))
    setLastSaved(new Date().toLocaleTimeString())
  }

  const addChapter = () => {
    const newChapter = {
      id: Math.max(...book.chapters.map(c => c.id)) + 1,
      title: `Chapter ${book.chapters.length + 1}`,
      content: '<p>New chapter content...</p>'
    }
    setBook({ ...book, chapters: [...book.chapters, newChapter] })
    setCurrentChapter(newChapter.id)
  }

  const deleteChapter = (chapterId) => {
    if (book.chapters.length === 1) return
    const newChapters = book.chapters.filter(c => c.id !== chapterId)
    setBook({ ...book, chapters: newChapters })
    if (currentChapter === chapterId) {
      setCurrentChapter(newChapters[0].id)
    }
  }

  const updateChapterContent = (content) => {
    const updatedChapters = book.chapters.map(chapter =>
      chapter.id === currentChapter ? { ...chapter, content } : chapter
    )
    setBook({ ...book, chapters: updatedChapters })
  }

  const updateChapterTitle = (title) => {
    const updatedChapters = book.chapters.map(chapter =>
      chapter.id === currentChapter ? { ...chapter, title } : chapter
    )
    setBook({ ...book, chapters: updatedChapters })
  }

  const exportBook = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${book.title}</title>
    <style>
        body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .chapter { margin: 40px 0; }
        .chapter h2 { color: #333; border-left: 4px solid #007acc; padding-left: 10px; }
    </style>
</head>
<body>
    <h1>${book.title}</h1>
    ${book.chapters.map(chapter => `
    <div class="chapter">
        <h2>${chapter.title}</h2>
        ${chapter.content}
    </div>
    `).join('')}
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${book.title}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    // Create the complete HTML document for printing
    const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${book.title}</title>
    <style>
        @page {
            size: A4;
            margin: 1in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            background: white;
            font-size: 12pt;
        }
        
        .book-title {
            text-align: center;
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 2em;
            padding-bottom: 0.5em;
            border-bottom: 2px solid #333;
            page-break-after: avoid;
        }
        
        .chapter {
            margin-bottom: 2em;
            page-break-inside: avoid;
        }
        
        .chapter-title {
            font-size: 18pt;
            font-weight: bold;
            color: #333;
            margin-bottom: 1em;
            padding-left: 0.5em;
            border-left: 4px solid #007acc;
            page-break-after: avoid;
        }
        
        .chapter-content {
            color: #444;
        }
        
        .chapter-content h1,
        .chapter-content h2,
        .chapter-content h3 {
            page-break-after: avoid;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        
        .chapter-content p {
            margin-bottom: 1em;
            text-align: justify;
        }
        
        .chapter-content ul,
        .chapter-content ol {
            margin-bottom: 1em;
            padding-left: 2em;
        }
        
        .chapter-content li {
            margin-bottom: 0.5em;
        }
        
        .chapter-content code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        
        .chapter-content pre {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
            margin: 1em 0;
            font-family: 'Courier New', monospace;
        }
        
        .chapter-content blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin: 1em 0;
            font-style: italic;
        }
        
        /* Remove problematic CSS properties for PDF */
        * {
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
        }
        
        /* Simple background colors only */
        .highlight-box,
        .example-box,
        .warning-box,
        .exercise-box {
            background: #f8f9fa !important;
            border: 1px solid #dee2e6 !important;
            padding: 1em !important;
            margin: 1em 0 !important;
            border-radius: 5px !important;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .chapter { page-break-inside: avoid; }
            .chapter-title { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <h1 class="book-title">${book.title}</h1>
    ${book.chapters.map(chapter => `
    <div class="chapter">
        <h2 class="chapter-title">${chapter.title}</h2>
        <div class="chapter-content">${chapter.content}</div>
    </div>
    `).join('')}
</body>
</html>`
    
    // Open the content in a new window and trigger print
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printHTML)
    printWindow.document.close()
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  const getCurrentChapter = () => book.chapters.find(c => c.id === currentChapter)

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header 
        bookTitle={book.title}
        onTitleChange={(title) => setBook({ ...book, title })}
        onSave={saveBook}
        onExport={exportBook}
        onExportPDF={exportPDF}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          chapters={book.chapters}
          currentChapter={currentChapter}
          onChapterSelect={setCurrentChapter}
          onAddChapter={addChapter}
          onDeleteChapter={deleteChapter}
        />
        
        <Editor
          chapter={getCurrentChapter()}
          onTitleChange={updateChapterTitle}
          onContentChange={updateChapterContent}
        />
      </div>

      <footer className="flex justify-between px-8 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <span>Last saved: {lastSaved || 'Never'}</span>
      </footer>
    </div>
  )
}

export default App
