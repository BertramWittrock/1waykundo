import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MatrixAudioPlayer = ({ title, onClose, audioUrl, zIndex, onBringToFront, instanceKey }) => {
  const nodeRef = useRef(null);
  const audioRef = useRef(null);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset dragged state when instanceKey changes (window is re-opened)
  useEffect(() => {
    setHasBeenDragged(false);
  }, [instanceKey]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (event) => {
    if (!duration) return;
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const barWidth = progressBar.clientWidth;
    const seekPercentage = (clickPosition / barWidth);
    const newTime = duration * seekPercentage;
    audioRef.current.currentTime = newTime;
  };

  const handleDragStartInternal = () => {
    if (onBringToFront) {
      onBringToFront();
    }
  };
  
  const handleDrag = () => {
    if (!hasBeenDragged) {
      setHasBeenDragged(true);
    }
  };

  if (!audioUrl) {
    console.error("MatrixAudioPlayer: audioUrl is undefined or null.");
    return null;
  }

  return (
    <Draggable
      handle=".matrix-window-title-bar"
      nodeRef={nodeRef}
      onStart={handleDragStartInternal}
      onDrag={handleDrag}
    >
      <div 
        ref={nodeRef} 
        className={`
          absolute bg-black/90 border border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.3)] 
          rounded-lg w-[90vw] sm:w-[360px] max-w-[360px] h-auto 
          flex flex-col overflow-hidden select-none font-mono
          ${!hasBeenDragged ? 'center-window' : ''}
        `}
        style={{ 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 15px rgba(0, 255, 0, 0.1)',
          zIndex: zIndex
        }}
        onMouseDown={() => {
          if (onBringToFront) {
            onBringToFront();
          }
        }}
      >
        {/* Title Bar */}
        <div className="matrix-window-title-bar bg-gradient-to-r from-[#003300] via-[#00ff00]/20 to-[#003300] text-[#00ff00] p-2 flex justify-between items-center cursor-move border-b border-[#00ff00]/30">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00ff00] animate-pulse' : 'bg-[#00ff00]/40'}`} />
            <span className="font-mono text-xs sm:text-sm tracking-wide">{title || 'Audio Player'}</span>
          </div>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onClose(); 
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="bg-[#003300] hover:bg-[#004400] text-[#00ff00] border border-[#00ff00]/50 font-mono h-8 sm:h-auto min-w-[32px] sm:min-w-0 flex items-center justify-center py-1 px-3 rounded text-sm transition-colors duration-150"
          >
            ×
          </button>
        </div>

        {/* Audio Content */}
        <div className="p-4 flex-grow relative bg-black/50">
          {/* Progress Bar */}
          <div 
            className="w-full h-1.5 bg-[#00ff00]/10 rounded cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#00ff00] rounded transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-[#00ff00]/70 text-xs mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Play Button */}
          <button
            onClick={togglePlay}
            className="w-full py-2 px-4 bg-[#002200] hover:bg-[#003300] border border-[#00ff00]/30 rounded text-[#00ff00] transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <span className="text-sm">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-[#001100] text-[#00ff00]/70 text-xs p-1 px-2 border-t border-[#00ff00]/20">
          <div className="flex justify-between items-center">
            <span>Matrix Audio</span>
            <span className="animate-pulse">Ready</span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
          onError={(e) => console.error("Audio Load Error:", e)}
        />
      </div>
    </Draggable>
  );
};

export default MatrixAudioPlayer; 