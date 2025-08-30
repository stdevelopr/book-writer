import Button from './Button';

interface Chapter {
  id: number;
  title: string;
  content: string;
}

interface SidebarProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (chapterId: number) => void;
  onAddChapter: () => void;
  onDeleteChapter: (chapterId: number) => void;
}

const Sidebar = ({ chapters, currentChapter, onChapterSelect, onAddChapter, onDeleteChapter }: SidebarProps) => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Chapters</h3>
        <Button 
          variant="success" 
          size="sm" 
          className="w-full"
          onClick={onAddChapter}
        >
          + Add Chapter
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {chapters.map(chapter => (
          <li 
            key={chapter.id} 
            className={`flex justify-between items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
              currentChapter === chapter.id ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
            }`}
          >
            <span 
              onClick={() => onChapterSelect(chapter.id)}
              className="flex-1 truncate"
            >
              {chapter.title}
            </span>
            <button 
              onClick={() => onDeleteChapter(chapter.id)}
              className={`ml-2 px-1 text-lg hover:bg-red-500 hover:text-white rounded transition-colors ${
                currentChapter === chapter.id ? 'text-white hover:bg-red-500' : 'text-red-500'
              }`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;