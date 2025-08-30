import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface BookStyle {
  name: string;
  css: string;
  preview: string;
}

interface BookStyles {
  [key: string]: BookStyle;
}

interface StyleManagerProps {
  styles: BookStyles;
  onStylesChange: (styles: BookStyles) => void;
  onClose: () => void;
}

const StyleManager = ({ styles, onStylesChange, onClose }: StyleManagerProps) => {
  const [selectedElement, setSelectedElement] = useState<string>('chapter-title');
  const [isPreview, setIsPreview] = useState<boolean>(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const defaultStyles: BookStyles = {
    'chapter-title': {
      name: 'Chapter Title',
      css: `font-size: 2.5rem;
font-weight: 700;
color: #2c3e50;
text-align: center;
margin: 2rem 0;
padding: 1rem;
border-bottom: 3px solid #3498db;
background: linear-gradient(135deg, #f8f9fa, #e9ecef);`,
      preview: '<h1 class="chapter-title">Chapter 1: The Beginning</h1>'
    },
    'section-title': {
      name: 'Section Title',
      css: `font-size: 1.8rem;
font-weight: 600;
color: #34495e;
margin: 1.5rem 0 1rem 0;
padding-left: 1rem;
border-left: 4px solid #e74c3c;`,
      preview: '<h2 class="section-title">Section Title</h2>'
    },
    'paragraph': {
      name: 'Paragraph',
      css: `font-size: 1rem;
line-height: 1.7;
color: #2c3e50;
margin-bottom: 1.2rem;
text-align: justify;
font-family: Georgia, serif;`,
      preview: '<p class="paragraph">This is a sample paragraph with some text to show how the styling looks in your book. It demonstrates the typography choices you have made.</p>'
    },
    'highlight-box': {
      name: 'Highlight Box',
      css: `background: linear-gradient(135deg, #fff3cd, #ffeaa7);
border-left: 5px solid #f39c12;
padding: 1.5rem;
margin: 2rem 0;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(0,0,0,0.1);`,
      preview: '<div class="highlight-box"><p>This is an important highlight that stands out from the regular text.</p></div>'
    },
    'code-block': {
      name: 'Code Block',
      css: `background: #2c3e50;
color: #ecf0f1;
padding: 1.5rem;
border-radius: 8px;
font-family: 'Courier New', monospace;
font-size: 0.9rem;
margin: 1.5rem 0;
overflow-x: auto;
border: 1px solid #34495e;`,
      preview: '<pre class="code-block">function example() {\n  console.log("Hello World");\n  return true;\n}</pre>'
    },
    'quote': {
      name: 'Quote Block',
      css: `font-style: italic;
font-size: 1.1rem;
color: #555;
border-left: 4px solid #ddd;
padding-left: 2rem;
margin: 2rem 0;
position: relative;
background: #fafafa;
padding: 1.5rem 1.5rem 1.5rem 3rem;
border-radius: 0 8px 8px 0;`,
      preview: '<blockquote class="quote">"The only way to do great work is to love what you do."</blockquote>'
    }
  };

  const currentStyles = { ...defaultStyles, ...styles };
  
  const updateStyle = (element: string, newCSS: string): void => {
    const updatedStyles = {
      ...styles,
      [element]: {
        ...currentStyles[element],
        css: newCSS
      }
    };
    onStylesChange(updatedStyles);
  };

  const resetToDefault = (): void => {
    const { [selectedElement]: removed, ...restStyles } = styles;
    onStylesChange(restStyles);
  };

  const exportStyles = (): void => {
    const cssContent = Object.entries(currentStyles)
      .map(([key, style]) => `.${key} {\n  ${style.css.split('\n').join('\n  ')}\n}`)
      .join('\n\n');
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book-styles.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90vw',
        height: '90vh',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>Style Manager</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={exportStyles}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Export CSS
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#4b5563',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Element Selector */}
          <div style={{
            width: '256px',
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.75rem',
                fontSize: '14px'
              }}>Book Elements</h3>
              {Object.entries(currentStyles).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setSelectedElement(key)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: selectedElement === key ? '#dbeafe' : 'transparent',
                    color: selectedElement === key ? '#1d4ed8' : '#374151',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedElement !== key) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedElement !== key) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Style Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: 0,
                color: '#1f2937'
              }}>
                Editing: {currentStyles[selectedElement]?.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={resetToDefault}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsPreview(false)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    backgroundColor: !isPreview ? '#dbeafe' : 'transparent',
                    color: !isPreview ? '#1d4ed8' : '#6b7280',
                    border: !isPreview ? '1px solid #93c5fd' : '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit CSS
                </button>
                <button
                  onClick={() => setIsPreview(true)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.875rem',
                    backgroundColor: isPreview ? '#dbeafe' : 'transparent',
                    color: isPreview ? '#1d4ed8' : '#6b7280',
                    border: isPreview ? '1px solid #93c5fd' : '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {isPreview ? (
                <div className="h-full p-6 bg-white overflow-y-auto">
                  <style>
                    {`.${selectedElement} { ${currentStyles[selectedElement]?.css} }`}
                  </style>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: currentStyles[selectedElement]?.preview 
                    }}
                  />
                </div>
              ) : (
                <MonacoEditor
                  height="100%"
                  language="css"
                  value={currentStyles[selectedElement]?.css || ''}
                  onChange={(value) => updateStyle(selectedElement, value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }}
                  theme="vs-light"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleManager;