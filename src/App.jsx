import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import StyleManager from './components/StyleManager'
import './App.css'

function App() {
  const [book, setBook] = useState({
    title: 'Untitled Book',
    chapters: [{ id: 1, title: 'Chapter 1', content: '<p>Start writing your book here...</p>' }],
    styles: {}
  })
  const [currentChapter, setCurrentChapter] = useState(1)
  const [lastSaved, setLastSaved] = useState(null)
  const [showStyleManager, setShowStyleManager] = useState(false)

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

  const generateCustomCSS = () => {
    const defaultStyles = {
      'chapter-title': 'font-size: 2.5rem; font-weight: 700; color: #2c3e50; text-align: center; margin: 2rem 0;',
      'section-title': 'font-size: 1.8rem; font-weight: 600; color: #34495e; margin: 1.5rem 0 1rem 0;',
      'paragraph': 'font-size: 1rem; line-height: 1.7; color: #2c3e50; margin-bottom: 1.2rem;',
      'highlight-box': 'background: linear-gradient(135deg, #fff3cd, #ffeaa7); border-left: 5px solid #f39c12; padding: 1.5rem; margin: 2rem 0;',
      'code-block': 'background: #2c3e50; color: #ecf0f1; padding: 1.5rem; border-radius: 8px; font-family: monospace;',
      'quote': 'font-style: italic; border-left: 4px solid #ddd; padding-left: 2rem; margin: 2rem 0;'
    }
    
    const customStyles = { ...defaultStyles, ...book.styles }
    
    return Object.entries(customStyles)
      .map(([className, css]) => `.${className} { ${css} }`)
      .join('\n        ')
  }

  const exportPDF = () => {
    // Create the complete HTML document for printing with custom styles
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
        
        /* Custom styles from Style Manager */
        ${generateCustomCSS()}
        
        /* Default styles for elements not customized */
        .book-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 3px solid #333;
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
        
        @media print {
            body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            * { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1 class="book-title">${book.title}</h1>
    ${book.chapters.map(chapter => `
    <div class="chapter">
        <h1 class="chapter-title">${chapter.title}</h1>
        <div class="chapter-content">${chapter.content}</div>
    </div>
    `).join('')}
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
        onOpenStyles={() => setShowStyleManager(true)}
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
          styles={book.styles}
        />
      </div>

      <footer className="flex justify-between px-8 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <span>Last saved: {lastSaved || 'Never'}</span>
      </footer>

      {showStyleManager && (
        <StyleManager
          styles={book.styles}
          onStylesChange={(newStyles) => setBook({ ...book, styles: newStyles })}
          onClose={() => setShowStyleManager(false)}
        />
      )}
    </div>
  )
}

export default App
