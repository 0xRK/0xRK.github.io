import { useState } from 'react';
import './TextEditor.css';

const DEFAULT_CONTENT = `# Welcome to Rishi's Realm

Feel free to type anything here!
This is a simple text editor, like gedit.

You can use it to take notes while
browsing around the desktop.
`;

export function TextEditor() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const lineCount = content.split('\n').length;

  return (
    <div className="text-editor-app">
      <div className="text-editor-app__toolbar">
        <span className="text-editor-app__toolbar-btn">New</span>
        <span className="text-editor-app__toolbar-btn">Open</span>
        <span
          className="text-editor-app__toolbar-btn"
          onClick={() => {
            try {
              localStorage.setItem('realm-notepad', content);
            } catch {
              // ignore
            }
          }}
        >
          Save
        </span>
      </div>
      <div className="text-editor-app__body">
        <div className="text-editor-app__gutter">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-editor-app__line-num">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          className="text-editor-app__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="text-editor-app__status">
        Lines: {lineCount} | Characters: {content.length}
      </div>
    </div>
  );
}
