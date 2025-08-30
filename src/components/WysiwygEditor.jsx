import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const WysiwygEditor = ({ content, onChange, styles }) => {
  const quillRef = useRef(null);

  const generateStyleCSS = () => {
    if (!styles) return '';
    return Object.entries(styles)
      .map(([className, style]) => `.ql-editor .${className} { ${style.css} }`)
      .join('\n');
  };

  // Custom function for applying styles
  const applyCustomStyle = (styleClass) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const selection = editor.getSelection();
    if (!selection || selection.length === 0) {
      alert('Please select some text first to apply the style.');
      return;
    }

    // Get the selected text and wrap it with a span
    const selectedText = editor.getText(selection.index, selection.length);
    
    // Delete the selected text
    editor.deleteText(selection.index, selection.length);
    
    // Insert the text wrapped in a span with the custom class
    const htmlContent = `<span class="${styleClass}">${selectedText}</span>`;
    editor.clipboard.dangerouslyPasteHTML(selection.index, htmlContent);
    
    // Set selection after the inserted content
    editor.setSelection(selection.index + selectedText.length);
  };

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.getElementById('wysiwyg-styles');
    if (styleElement) {
      styleElement.innerHTML = generateStyleCSS();
    } else {
      const style = document.createElement('style');
      style.id = 'wysiwyg-styles';
      style.innerHTML = generateStyleCSS();
      document.head.appendChild(style);
    }
  }, [styles]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Custom Style Toolbar */}
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
          Book Styles:
        </span>
        
        <button
          onClick={() => applyCustomStyle('chapter-title')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          📖 Chapter Title
        </button>

        <button
          onClick={() => applyCustomStyle('section-title')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          📝 Section Title
        </button>

        <button
          onClick={() => applyCustomStyle('paragraph')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          📄 Paragraph
        </button>

        <button
          onClick={() => applyCustomStyle('highlight-box')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          💡 Highlight
        </button>

        <button
          onClick={() => applyCustomStyle('code-block')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          💻 Code
        </button>

        <button
          onClick={() => applyCustomStyle('quote')}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#e83e8c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          💬 Quote
        </button>
      </div>

      {/* React Quill Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={onChange}
          style={{ height: '100%' }}
          placeholder="Start writing your book here... Use the toolbar to format your text like in Apple Pages."
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['blockquote', 'code-block'],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              ['link', 'image'],
              ['clean']
            ]
          }}
          formats={[
            'header', 'bold', 'italic', 'underline', 'strike',
            'color', 'background', 'font', 'size', 'align',
            'list', 'bullet', 'blockquote', 'code-block',
            'indent', 'script', 'link', 'image'
          ]}
        />
      </div>
    </div>
  );
};

export default WysiwygEditor;