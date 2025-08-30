import { useRef, useEffect } from 'react';

interface BookStyles {
  [key: string]: {
    name: string;
    css: string;
    preview: string;
  };
}

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  styles?: BookStyles;
}

const WysiwygEditor = ({ content, onChange, styles }: WysiwygEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const generateStyleCSS = (): string => {
    // Simple test styles that work well with spans
    return `
      span.chapter-title {
        font-size: 40px !important;
        color: red !important;
        background: yellow !important;
        padding: 10px !important;
        font-weight: bold !important;
        display: inline-block !important;
        border: 3px solid blue !important;
      }
      span.section-title {
        font-size: 30px !important;
        color: blue !important;
        background: lightblue !important;
        padding: 8px !important;
        font-weight: bold !important;
        display: inline-block !important;
      }
      span.highlight-box {
        background: orange !important;
        color: white !important;
        padding: 8px !important;
        font-weight: bold !important;
        display: inline-block !important;
      }
    `;
  };

  // Function to apply or toggle styles on selected text
  const applyCustomStyle = (styleClass: string): void => {
    console.log('Applying/toggling style:', styleClass);
    
    const editor = editorRef.current;
    if (!editor) {
      console.log('No editor ref');
      return;
    }

    const selection = window.getSelection();
    
    // Check if we have a valid selection
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert('Please select some text first to apply the style.');
      return;
    }

    const range = selection.getRangeAt(0);
    
    // Make sure the selection is within our editor
    if (!editor.contains(range.commonAncestorContainer)) {
      alert('Please select text within the editor.');
      return;
    }

    try {
      // Check if the selection is entirely within a span with this style class
      const commonAncestor = range.commonAncestorContainer;
      let parentSpan: HTMLElement | null = null;
      
      // If the common ancestor is a text node, get its parent
      const elementToCheck = commonAncestor.nodeType === Node.TEXT_NODE 
        ? (commonAncestor.parentElement as HTMLElement)
        : (commonAncestor as HTMLElement);
      
      // Check if we're inside a span with the target class
      if (elementToCheck && elementToCheck.tagName === 'SPAN' && elementToCheck.classList.contains(styleClass)) {
        parentSpan = elementToCheck;
      } else {
        // Check if the selection is entirely within a span with this class
        let currentElement: HTMLElement | null = elementToCheck;
        while (currentElement && currentElement !== editor) {
          if (currentElement.tagName === 'SPAN' && currentElement.classList.contains(styleClass)) {
            parentSpan = currentElement;
            break;
          }
          currentElement = currentElement.parentElement;
        }
      }

      if (parentSpan) {
        // Remove the style - unwrap the span
        console.log('Removing style from span');
        const parent = parentSpan.parentNode;
        if (parent) {
          // Move all children of the span to replace the span
          while (parentSpan.firstChild) {
            parent.insertBefore(parentSpan.firstChild, parentSpan);
          }
          
          // Remove the empty span
          parent.removeChild(parentSpan);
          
          // Normalize the parent to merge adjacent text nodes
          parent.normalize();
        }
      } else {
        // Apply the style - wrap in span
        console.log('Applying style to selection');
        
        // Extract the selected content
        const selectedContent = range.extractContents();
        
        // Create wrapper element
        const wrapper = document.createElement('span');
        wrapper.className = styleClass;
        
        // Append the selected content to the wrapper
        wrapper.appendChild(selectedContent);
        
        // Insert the wrapper at the selection point
        range.insertNode(wrapper);
        
        // Position cursor after the styled element
        const newRange = document.createRange();
        newRange.setStartAfter(wrapper);
        newRange.collapse(true);
        
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      
      // Focus back to editor
      editor.focus();
      
      // Update the parent component with new content
      if (onChange) {
        onChange(editor.innerHTML);
      }
      
      console.log('Style toggle completed successfully!');
    } catch (error) {
      console.error('Error toggling style:', error);
      alert('Failed to toggle style. Please try again.');
    }
  };

  // Set initial content and update when content prop changes
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && content !== editor.innerHTML) {
      // Preserve cursor position if possible
      const selection = window.getSelection();
      const wasEditorFocused = document.activeElement === editor;
      let range: Range | null = null;
      
      if (wasEditorFocused && selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0).cloneRange();
      }
      
      editor.innerHTML = content || '';
      
      // Restore cursor position if we had one
      if (wasEditorFocused && range && selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(range);
          editor.focus();
        } catch {
          // If restoring selection fails, just focus the editor
          editor.focus();
        }
      }
    }
  }, [content]);

  // Inject custom styles
  useEffect(() => {
    const injectStyles = (): void => {
      const styleId = 'wysiwyg-styles';
      let styleElement = document.getElementById(styleId);
      
      if (styleElement) {
        styleElement.remove();
      }
      
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = generateStyleCSS();
      document.head.appendChild(styleElement);
    };

    // Inject styles immediately
    injectStyles();
    
    // Also inject after a brief delay to ensure editor is ready
    const timer = setTimeout(injectStyles, 100);
    
    return () => clearTimeout(timer);
  }, [styles]);

  // Force style refresh when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const styleElement = document.getElementById('wysiwyg-styles');
      if (styleElement) {
        styleElement.innerHTML = generateStyleCSS();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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

      {/* Basic Rich Text Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        borderBottom: '1px solid #e9ecef',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => document.execCommand('bold')}
          style={{
            padding: '0.375rem 0.5rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          B
        </button>
        <button
          onClick={() => document.execCommand('italic')}
          style={{
            padding: '0.375rem 0.5rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            fontStyle: 'italic'
          }}
        >
          I
        </button>
        <button
          onClick={() => document.execCommand('underline')}
          style={{
            padding: '0.375rem 0.5rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          U
        </button>
      </div>

      {/* ContentEditable Editor */}
      <div
        ref={editorRef}
        contentEditable
        style={{
          flex: 1,
          padding: '2rem',
          backgroundColor: 'white',
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: 'Georgia, serif',
          overflow: 'auto',
          minHeight: '400px'
        }}
        onInput={(e) => {
          if (onChange) {
            onChange(e.currentTarget.innerHTML);
          }
        }}
        onBlur={(e) => {
          if (onChange) {
            onChange(e.currentTarget.innerHTML);
          }
        }}
        suppressContentEditableWarning={true}
      />

      <style dangerouslySetInnerHTML={{ __html: generateStyleCSS() }} />
    </div>
  );
};

export default WysiwygEditor;