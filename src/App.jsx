import { useState, useEffect } from 'react'
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
    // Create the complete HTML document for printing with preserved styling
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
            margin: 0.5in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.7;
            color: #2c3e50;
            background: white;
            padding: 2rem;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .container {
            max-width: none;
            margin: 0;
            background: white;
            border-radius: 20px;
            overflow: visible;
        }
        
        .header {
            background: linear-gradient(45deg, #2c3e50, #34495e);
            color: white;
            padding: 3rem 2rem 2rem;
            border-radius: 20px 20px 0 0;
            margin-bottom: 0;
        }
        
        .chapter-number {
            font-size: 1rem;
            font-weight: 300;
            letter-spacing: 3px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 1rem;
        }
        
        .chapter-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
        }
        
        .chapter-subtitle {
            font-size: 1.2rem;
            font-weight: 300;
            opacity: 0.9;
            font-style: italic;
        }
        
        .content {
            padding: 3rem 2rem;
        }
        
        .section {
            margin-bottom: 2.5rem;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e74c3c;
            page-break-after: avoid;
        }
        
        p {
            margin-bottom: 1.2rem;
            text-align: justify;
            color: #34495e;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-left: 4px solid #3498db;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            page-break-inside: avoid;
        }
        
        .highlight-box p {
            margin-left: 0;
            font-style: italic;
            color: #2c3e50;
        }
        
        .example-box {
            background: #fff8e7;
            border: 2px solid #f39c12;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            page-break-inside: avoid;
        }
        
        .example-title {
            font-weight: 600;
            color: #d68910;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            margin: 1rem 0;
            overflow-x: visible;
            white-space: pre-wrap;
            page-break-inside: avoid;
        }
        
        ul {
            list-style: none;
            padding-left: 0;
        }
        
        li {
            margin-bottom: 0.8rem;
            padding-left: 2rem;
            position: relative;
            color: #34495e;
        }
        
        li::before {
            content: '▶';
            position: absolute;
            left: 0;
            color: #3498db;
            font-weight: bold;
        }
        
        .warning-box {
            background: linear-gradient(135deg, #ffebee, #ffcdd2);
            border-left: 4px solid #e74c3c;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 0 8px 8px 0;
            page-break-inside: avoid;
        }
        
        .warning-title {
            font-weight: 600;
            color: #c62828;
            margin-bottom: 0.8rem;
        }
        
        .exercise-box {
            background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
            border: 2px solid #4caf50;
            border-radius: 12px;
            padding: 2rem;
            margin: 2.5rem 0;
            page-break-inside: avoid;
        }
        
        .exercise-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2e7d32;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 2rem;
            text-align: center;
            border-top: 1px solid #dee2e6;
            font-style: italic;
            color: #6c757d;
            margin-top: 2rem;
        }
        
        @media print {
            body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .section { page-break-inside: avoid; }
            .section-title { page-break-after: avoid; }
            .highlight-box,
            .example-box,
            .warning-box,
            .exercise-box,
            .code-block { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${book.chapters.map(chapter => chapter.content).join('')}
</body>
</html>`
    
    // Open the content in a new window and trigger print
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write(printHTML)
    printWindow.document.close()
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 1000)
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
