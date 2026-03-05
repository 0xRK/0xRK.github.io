import { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

const TRACKS = [
  { title: 'Lo-fi Chill Beats', artist: 'Ambient Sounds' },
  { title: 'Night Drive', artist: 'Synthwave Radio' },
  { title: 'Coffee Shop Jazz', artist: 'Smooth Vibes' },
];

export function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const track = TRACKS[trackIndex];

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setProgress((prev) => {
        const next = prev + delta / 180;
        if (next >= 1) {
          setTrackIndex((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return next;
      });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const formatTime = (ratio: number) => {
    const totalSeconds = Math.floor(ratio * 180);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-app">
      <div className="music-player-app__art">
        <div className={`music-player-app__disc ${isPlaying ? 'music-player-app__disc--spinning' : ''}`}>
          <div className="music-player-app__disc-inner" />
        </div>
      </div>
      <div className="music-player-app__info">
        <strong>{track.title}</strong>
        <span>{track.artist}</span>
      </div>
      <div className="music-player-app__progress">
        <span className="music-player-app__time">{formatTime(progress)}</span>
        <div className="music-player-app__bar">
          <div
            className="music-player-app__bar-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="music-player-app__time">3:00</span>
      </div>
      <div className="music-player-app__controls">
        <button
          onClick={() => {
            setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
            setProgress(0);
          }}
        >
          ⏮
        </button>
        <button
          className="music-player-app__play-btn"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => {
            setTrackIndex((i) => (i + 1) % TRACKS.length);
            setProgress(0);
          }}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
