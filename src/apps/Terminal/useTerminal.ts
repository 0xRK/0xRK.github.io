import { useState, useCallback } from 'react';
import { resume } from '../../data/resume';
import { resolvePath, type FSNode } from '../../data/filesystem';

interface HistoryEntry {
  input: string;
  output: string;
}

const NEOFETCH = `
\x1b[36m        .-/+oossssoo+/-.        \x1b[0m   rishi@realm
\x1b[36m    \`:+ssssssssssssssssss+:\`    \x1b[0m   -----------
\x1b[36m  -+ssssssssssssssssssyyssss+-  \x1b[0m   OS: Rishi's Realm Linux
\x1b[36m.ossssssssssssssssss\x1b[33mdMMMNy\x1b[36msssso.\x1b[0m   Host: 0xRK.github.io
\x1b[36m/sssssssssss\x1b[33mhdmmNNmmyNMMMMh\x1b[36mssss/\x1b[0m   Kernel: React 19.2.0
\x1b[36m+sssssssss\x1b[33mhm\x1b[36myd\x1b[33mMMMMMMMNddddy\x1b[36mssss+\x1b[0m   Shell: bash 5.1.0
\x1b[36m/ssssssss\x1b[33mhNMMM\x1b[36myh\x1b[33mhyyyyhmNMMMNh\x1b[36mssss/\x1b[0m   Terminal: web-term
\x1b[36m.ssssssss\x1b[33mdMMMNh\x1b[36mssssssssss\x1b[33mhNMMMd\x1b[36mssss.\x1b[0m   CPU: TypeScript v5.9
\x1b[36m+ssss\x1b[33mhhhyNMMNy\x1b[36mssssssssssss\x1b[33myNMMMy\x1b[36msss+\x1b[0m   Memory: Full-Stack
\x1b[36m.ssss\x1b[33mdNMMMMMMMMNhssssssssssshmssss.\x1b[0m
\x1b[36m/ssssss\x1b[33myNMMMNNNNNmmmmmmNMMMN\x1b[36mhssss/\x1b[0m
\x1b[36m+ssssssss\x1b[33mdmydMMMMMMMMMMMMMMNh\x1b[36mssss+\x1b[0m
\x1b[36m\\ssssssssssssssss\x1b[33mhNMMMMNhy\x1b[36mssssss/\x1b[0m
\x1b[36m.osssssssssssssssssss\x1b[33mdmhy\x1b[36mssssso.\x1b[0m
\x1b[36m  -+sssssssssssssssssssssss+-  \x1b[0m
\x1b[36m    \`:+ssssssssssssssssss+:\`    \x1b[0m
\x1b[36m        .-/+oossssoo+/-.        \x1b[0m`;

function listDir(node: FSNode): string {
  if (!node.children) return node.name;
  return node.children.map((c) => (c.type === 'folder' ? `${c.name}/` : c.name)).join('  ');
}

export function useTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: 'Welcome to Rishi\'s Realm Terminal. Type "help" for available commands.' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    let output = '';

    switch (command) {
      case 'help':
        output = `Available commands:
  help        Show this help message
  whoami      Display user info
  ls [path]   List directory contents
  cat <file>  Display file contents
  pwd         Print working directory
  date        Show current date
  skills      List technical skills
  clear       Clear terminal
  echo <text> Echo text
  neofetch    System info`;
        break;
      case 'whoami':
        output = `rishi - ${resume.title} @ ${resume.university}`;
        break;
      case 'pwd':
        output = '/home/rishi';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'skills':
        output = resume.skills.join(', ');
        break;
      case 'echo':
        output = args || '';
        break;
      case 'neofetch':
        output = NEOFETCH;
        break;
      case 'clear':
        setHistory([]);
        setCurrentInput('');
        return;
      case 'ls': {
        const path = args || '~';
        const node = resolvePath(path);
        if (!node) {
          output = `ls: cannot access '${args}': No such file or directory`;
        } else if (node.type === 'file') {
          output = node.name;
        } else {
          output = listDir(node);
        }
        break;
      }
      case 'cat': {
        if (!args) {
          output = 'cat: missing file operand';
          break;
        }
        const node = resolvePath(args);
        if (!node) {
          output = `cat: ${args}: No such file or directory`;
        } else if (node.type === 'folder') {
          output = `cat: ${args}: Is a directory`;
        } else {
          output = node.content || '(empty file)';
        }
        break;
      }
      case 'cd':
        output = 'cd: nowhere to go in a web terminal ;)';
        break;
      case 'sudo':
        output = 'Nice try! But you don\'t have sudo privileges here.';
        break;
      case 'rm':
        output = 'rm: permission denied (this is a read-only filesystem!)';
        break;
      case 'exit':
        output = 'You can\'t escape the Realm that easily!';
        break;
      default:
        output = `${command}: command not found. Type "help" for available commands.`;
    }

    setHistory((prev) => [...prev, { input: `rishi@realm:~$ ${trimmed}`, output }]);
    setCurrentInput('');
  }, []);

  const navigateHistory = useCallback(
    (direction: 'up' | 'down') => {
      if (commandHistory.length === 0) return;
      if (direction === 'up') {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    },
    [commandHistory, historyIndex]
  );

  return { history, currentInput, setCurrentInput, processCommand, navigateHistory };
}
