import { useRef, useEffect } from 'react';
import { useTerminal } from './useTerminal';
import './Terminal.css';

export function Terminal() {
  const { history, currentInput, setCurrentInput, processCommand, navigateHistory } =
    useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="terminal-app"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-app__output" ref={scrollRef}>
        {history.map((entry, i) => (
          <div key={i} className="terminal-app__entry">
            {entry.input && (
              <div className="terminal-app__input-line">{entry.input}</div>
            )}
            {entry.output && (
              <pre className="terminal-app__output-text">{entry.output}</pre>
            )}
          </div>
        ))}
      </div>
      <div className="terminal-app__prompt">
        <span className="terminal-app__prompt-text">rishi@realm:~$&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-app__input"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              processCommand(currentInput);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              navigateHistory('down');
            }
          }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
