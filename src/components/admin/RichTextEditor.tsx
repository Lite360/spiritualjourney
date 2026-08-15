import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo 
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] px-4 py-3 bg-primary-bg/30 font-sans text-primary-text',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleStyle = (command: () => boolean, icon: React.ReactNode, activeState: string) => {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          command();
        }}
        className={`p-2 rounded hover:bg-secondary-bg transition-colors ${
          editor.isActive(activeState) ? 'bg-secondary-bg text-accent' : 'text-secondary-dark'
        }`}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className="border border-secondary-bg rounded-md overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-secondary-bg bg-primary-bg/10">
        {toggleStyle(() => editor.chain().focus().toggleBold().run(), <Bold className="w-4 h-4" />, 'bold')}
        {toggleStyle(() => editor.chain().focus().toggleItalic().run(), <Italic className="w-4 h-4" />, 'italic')}
        
        <div className="w-px h-6 bg-secondary-bg mx-1" />
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={`p-2 rounded hover:bg-secondary-bg transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-secondary-bg text-accent' : 'text-secondary-dark'
          }`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`p-2 rounded hover:bg-secondary-bg transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-secondary-bg text-accent' : 'text-secondary-dark'
          }`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-secondary-bg mx-1" />

        {toggleStyle(() => editor.chain().focus().toggleBulletList().run(), <List className="w-4 h-4" />, 'bulletList')}
        {toggleStyle(() => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="w-4 h-4" />, 'orderedList')}
        {toggleStyle(() => editor.chain().focus().toggleBlockquote().run(), <Quote className="w-4 h-4" />, 'blockquote')}

        <div className="w-px h-6 bg-secondary-bg mx-1" />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-secondary-bg transition-colors text-secondary-dark disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-secondary-bg transition-colors text-secondary-dark disabled:opacity-50"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
};
