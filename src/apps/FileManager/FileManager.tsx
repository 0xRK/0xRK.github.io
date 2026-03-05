import { useState } from 'react';
import { filesystem, type FSNode } from '../../data/filesystem';
import { useDesktop } from '../../context/DesktopContext';
import './FileManager.css';

export function FileManager() {
  const { dispatch } = useDesktop();
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const getCurrentNode = (): FSNode => {
    let node = filesystem;
    for (const part of currentPath) {
      const child = node.children?.find((c) => c.name === part);
      if (!child) return filesystem;
      node = child;
    }
    return node;
  };

  const current = getCurrentNode();
  const items = current.children ?? [];

  const handleDoubleClick = (item: FSNode) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else if (item.opensApp) {
      dispatch({ type: 'OPEN_WINDOW', appId: item.opensApp });
    }
  };

  return (
    <div className="file-manager-app">
      <div className="file-manager-app__toolbar">
        <button
          className="file-manager-app__back-btn"
          disabled={currentPath.length === 0}
          onClick={() => setCurrentPath(currentPath.slice(0, -1))}
        >
          ←
        </button>
        <div className="file-manager-app__breadcrumb">
          <span
            className="file-manager-app__crumb"
            onClick={() => setCurrentPath([])}
          >
            ~
          </span>
          {currentPath.map((part, i) => (
            <span key={i}>
              <span className="file-manager-app__crumb-sep">/</span>
              <span
                className="file-manager-app__crumb"
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
              >
                {part}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="file-manager-app__content">
        {items.length === 0 ? (
          <p className="file-manager-app__empty">This folder is empty</p>
        ) : (
          <div className="file-manager-app__grid">
            {items.map((item) => (
              <div
                key={item.name}
                className="file-manager-app__item"
                onDoubleClick={() => handleDoubleClick(item)}
              >
                <span className="file-manager-app__item-icon">
                  {item.type === 'folder' ? '📂' : '📄'}
                </span>
                <span className="file-manager-app__item-name">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
