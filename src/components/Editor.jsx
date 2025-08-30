import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Input from './Input';

const Editor = ({ chapter, onTitleChange, onContentChange }) => {
  const [isPreview, setIsPreview] = useState(false);
  const wordCount = chapter?.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length || 0;

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="px-8 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <Input
          value={chapter?.title || ''}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Chapter title"
          size="lg"
          className="flex-1 font-bold mr-4"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              !isPreview 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              isPreview 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto p-8 bg-white">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: chapter?.content || '' }}
            />
          </div>
        ) : (
          <MonacoEditor
            height="100%"
            language="html"
            value={chapter?.content || ''}
            onChange={(value) => onContentChange(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
            }}
            theme="vs-light"
          />
        )}
      </div>
      
      <div className="px-8 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <span>Words: {wordCount}</span>
      </div>
    </main>
  );
};

export default Editor;