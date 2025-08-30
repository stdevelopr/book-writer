import { useState } from 'react';

const StyleToolbar = ({ onInsertStyle }) => {
  const [selectedStyle, setSelectedStyle] = useState('paragraph');

  const styles = [
    { key: 'chapter-title', name: '📖 Chapter Title', tag: 'h1' },
    { key: 'section-title', name: '📝 Section Title', tag: 'h2' },
    { key: 'paragraph', name: '📄 Paragraph', tag: 'p' },
    { key: 'highlight-box', name: '💡 Highlight Box', tag: 'div' },
    { key: 'code-block', name: '💻 Code Block', tag: 'pre' },
    { key: 'quote', name: '💬 Quote', tag: 'blockquote' }
  ];

  const insertStyledText = (styleKey) => {
    const style = styles.find(s => s.key === styleKey);
    if (!style) return;

    const sampleText = getSampleText(styleKey);
    const htmlTemplate = `<${style.tag} class="${styleKey}">${sampleText}</${style.tag}>`;
    
    onInsertStyle(htmlTemplate);
  };

  const getSampleText = (styleKey) => {
    switch (styleKey) {
      case 'chapter-title':
        return 'Chapter 1: Your Chapter Title';
      case 'section-title':
        return 'Your Section Title';
      case 'paragraph':
        return 'Your paragraph text goes here. You can edit this text and it will maintain the styling.';
      case 'highlight-box':
        return 'This is an important highlight that stands out from regular text.';
      case 'code-block':
        return 'function example() {\n  console.log("Your code here");\n  return true;\n}';
      case 'quote':
        return 'Your inspirational quote goes here.';
      default:
        return 'Sample text';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      flexWrap: 'wrap'
    }}>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#495057',
        marginRight: '0.5rem'
      }}>
        Insert Style:
      </span>
      
      <select
        value={selectedStyle}
        onChange={(e) => setSelectedStyle(e.target.value)}
        style={{
          padding: '0.375rem 0.75rem',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          marginRight: '0.5rem'
        }}
      >
        {styles.map(style => (
          <option key={style.key} value={style.key}>
            {style.name}
          </option>
        ))}
      </select>

      <button
        onClick={() => insertStyledText(selectedStyle)}
        style={{
          padding: '0.375rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
      >
        + Insert
      </button>

      <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.25rem' }}>
        {styles.map(style => (
          <button
            key={style.key}
            onClick={() => insertStyledText(style.key)}
            title={style.name}
            style={{
              padding: '0.375rem 0.5rem',
              backgroundColor: 'white',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              minWidth: '2rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            {style.name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleToolbar;