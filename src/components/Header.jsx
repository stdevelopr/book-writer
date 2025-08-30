import Button from './Button';
import Input from './Input';

const Header = ({ bookTitle, onTitleChange, onSave, onExport, onExportPDF }) => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-50 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">Book Writer</h1>
      <div className="flex gap-4 items-center">
        <Input
          value={bookTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Book title"
          className="min-w-[200px]"
        />
        <Button onClick={onSave}>
          Save
        </Button>
        <Button variant="success" onClick={onExport}>
          Export HTML
        </Button>
        <Button variant="primary" onClick={onExportPDF}>
          Export PDF
        </Button>
      </div>
    </header>
  );
};

export default Header;