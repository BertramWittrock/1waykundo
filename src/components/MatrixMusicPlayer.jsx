import React, { useRef, useState, useEffect } from 'react';
import { useMedia } from '../context/MediaContext';
import { useAdmin } from '../context/AdminContext';
import Draggable from 'react-draggable';
import { FastBackwardIcon, FastForwardIcon, PlayCircleIcon, PauseCircleIcon } from "./MediaPlayerIcons";

// Helper to format time from seconds to MM:SS (copied for modularity)
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds === 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MatrixMusicPlayer = ({ title, onClose, zIndex, onBringToFront, instanceKey }) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlay,
    previousTrack,
    nextTrack,
    progress, 
    currentTime,
    duration,
    seek
  } = useMedia();
  const { musicFiles } = useAdmin();
  const nodeRef = useRef(null);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

  // Reset dragged state when instanceKey changes (window is re-opened)
  useEffect(() => {
    setHasBeenDragged(false);
  }, [instanceKey]);

  const handleProgressClick = (event) => {
    if (!duration) return;
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const barWidth = progressBar.clientWidth;
    if (barWidth === 0) return; // Avoid division by zero
    const seekPercentage = (clickPosition / barWidth);
    seek(duration * seekPercentage);
  };

  // Determine the cover image URL
  let coverImageUrl = "/icons/covers/default_cover.png"; // Default fallback
  if (currentSong && currentSong.coverR2Key) {
    coverImageUrl = `https://kundo-1way.bertramvwsteam.workers.dev?fileKey=${encodeURIComponent(currentSong.coverR2Key)}`;
  } else if (currentSong && currentSong.cover) { // Fallback to existing 'cover' prop if 'coverR2Key' is missing
    coverImageUrl = currentSong.cover;
  }

  const handleDragStart = () => {
    if (onBringToFront) {
      onBringToFront();
    }
  };
  
  const handleDrag = () => {
    if (!hasBeenDragged) {
      setHasBeenDragged(true);
    }
  };

  return (
    <Draggable 
      handle=".matrix-window-title-bar" 
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onDrag={handleDrag}
    >
      <div 
        ref={nodeRef}
        className={`
          absolute w-[95vw] sm:w-[600px] max-w-[600px] bg-black/90 border border-[#00ff00]
          shadow-[0_0_20px_rgba(0,255,0,0.3),_inset_0_0_15px_rgba(0,255,0,0.1)]
          rounded-md flex flex-col overflow-hidden select-none font-mono
          ${!hasBeenDragged ? 'center-window' : ''}
        `}
        style={{ backdropFilter: 'blur(8px)', zIndex: zIndex }}
        onMouseDown={() => {
          if (onBringToFront) {
            onBringToFront();
          }
        }}
      >
        {/* Title Bar (Updated Styling) */}
        <div className="matrix-window-title-bar bg-gradient-to-r from-[#003300] via-[#00ff00]/20 to-[#003300] text-[#00ff00] p-2 flex justify-between items-center cursor-grab border-b border-[#00ff00]/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="text-xs sm:text-sm tracking-wide">{title || 'System Audio Interface'}</span>
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
            className="bg-[#003300] hover:bg-[#004400] text-[#00ff00] border border-[#00ff00]/50 font-mono py-1 px-3 sm:py-0.5 sm:px-2 rounded text-sm sm:text-xs transition-colors duration-150 flex items-center justify-center min-w-[44px] min-h-[32px] sm:min-h-[24px] shadow-[0_0_5px_rgba(0,255,0,0.2)]
              active:bg-[#005500] touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            title="Close Player"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row h-[70vh] sm:h-[480px]">
          {/* Mobile-optimized Now Playing Section */}
          <div className="block sm:hidden bg-black/30 border-b border-[#00ff00]/20 p-3">
            <div className="flex items-center space-x-3">
              {/* Compact Album Art */}
              <div className="w-16 h-16 bg-[#050505] border border-[#00ff00]/20 rounded-sm flex items-center justify-center overflow-hidden shadow-inner shadow-black/30 flex-shrink-0">
                {currentSong ? (
                  <img 
                    src={coverImageUrl}
                    alt={currentSong.title || "Album Art"}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => { e.currentTarget.src = '/icons/covers/default_cover.png'; }}
                  />
                ) : (
                  <span className="text-[#00ff00]/40 text-xs font-bold">1WAY</span>
                )}
              </div>
              
              {/* Track Info and Controls */}
              <div className="flex-1 min-w-0">
                <div className="text-[#00ff00] text-sm mb-1 truncate" title={currentSong?.title}>{currentSong?.title || 'NO TRACK'}</div>
                <div className="text-[#00ff00]/60 text-xs mb-2 truncate" title={currentSong?.artist}>{currentSong?.artist || 'Unknown Artist'}</div>
                
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-[#00ff00]/10 rounded cursor-pointer group mb-1"
                  onClick={handleProgressClick}
                  title="Seek"
                >
                  <div 
                    className="h-full bg-green-400 rounded group-hover:bg-green-300 transition-all duration-100 ease-linear"
                    style={{ width: `${progress || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-green-400/70 text-[10px]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Controls */}
            <div className="flex justify-center items-center mt-3 space-x-4">
              <button
                onClick={() => previousTrack(musicFiles)}
                title="Previous"
                className="text-green-400 hover:text-green-300 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <FastBackwardIcon className="w-6 h-6" stroke="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
                className="text-green-300 hover:text-green-200 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors w-12 h-12 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.1)] border border-transparent hover:border-[#00ff00]/20"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isPlaying ? (
                  <PauseCircleIcon className="w-8 h-8" stroke="currentColor" />
                ) : (
                  <PlayCircleIcon className="w-8 h-8" stroke="currentColor" />
                )}
              </button>
              <button
                onClick={() => nextTrack(musicFiles)}
                title="Next"
                className="text-green-400 hover:text-green-300 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <FastForwardIcon className="w-6 h-6" stroke="currentColor" />
              </button>
            </div>
          </div>

          {/* Desktop Layout - Now Playing Panel */}
          <div className="hidden sm:flex sm:flex-col w-[220px] bg-black/30 border-r border-[#00ff00]/20 p-3 h-[480px]">
            <div className="text-[#00ff00]/80 text-xs mb-2 uppercase tracking-wider">Now Playing</div>
            
            <div className="w-full aspect-square bg-[#050505] border border-[#00ff00]/20 rounded-sm mb-3 flex items-center justify-center overflow-hidden shadow-inner shadow-black/30">
              {currentSong ? (
                <img 
                  src={coverImageUrl}
                  alt={currentSong.title || "Album Art"}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => { e.currentTarget.src = '/icons/covers/default_cover.png'; }}
                />
              ) : (
                <span className="text-[#00ff00]/40 text-lg font-bold">1WAY</span>
              )}
            </div>

            <div className="text-[#00ff00] text-sm mb-0.5 truncate" title={currentSong?.title}>{currentSong?.title || 'NO TRACK'}</div>
            <div className="text-[#00ff00]/60 text-xs mb-2 truncate" title={currentSong?.artist}>{currentSong?.artist || 'Unknown Artist'}</div>

            {/* Progress Bar & Time */}
            <div 
              className="w-full h-2 bg-[#00ff00]/10 rounded cursor-pointer group mb-1"
              onClick={handleProgressClick}
              title="Seek"
            >
              <div 
                className="h-full bg-green-400 rounded group-hover:bg-green-300 transition-all duration-100 ease-linear"
                style={{ width: `${progress || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-green-400/70 text-[10px] mb-3">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Desktop Controls */}
            <div className="flex justify-around items-center mt-auto bg-black/20 p-2 rounded-sm border border-[#00ff00]/10">
              <button
                onClick={() => previousTrack(musicFiles)}
                title="Previous"
                className="text-green-400 hover:text-green-300 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <FastBackwardIcon className="w-6 h-6" stroke="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause" : "Play"}
                className="text-green-300 hover:text-green-200 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors w-12 h-12 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.1)] border border-transparent hover:border-[#00ff00]/20"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isPlaying ? (
                  <PauseCircleIcon className="w-8 h-8" stroke="currentColor" />
                ) : (
                  <PlayCircleIcon className="w-8 h-8" stroke="currentColor" />
                )}
              </button>
              <button
                onClick={() => nextTrack(musicFiles)}
                title="Next"
                className="text-green-400 hover:text-green-300 disabled:text-green-400/30 p-2 rounded-full hover:bg-green-400/10 transition-colors"
                disabled={!currentSong}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <FastForwardIcon className="w-6 h-6" stroke="currentColor" />
              </button>
            </div>
          </div>

          {/* Track List - Full width on mobile, right panel on desktop */}
          <div className="flex-1 overflow-y-auto bg-black/10 custom-scrollbar">
            <div className="p-1.5">
              <div className="text-[#00ff00]/80 text-xs mb-2 uppercase tracking-wider px-1 block sm:hidden">Track List</div>
              {musicFiles.map((song, index) => (
                <div 
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`
                    grid grid-cols-[30px_1fr_auto] sm:grid-cols-[25px_1fr_auto] items-center gap-2 p-3 sm:p-1.5 rounded-sm cursor-pointer 
                    border border-transparent group 
                    ${currentSong?.id === song.id ? 'bg-[#00ff00]/20 border-[#00ff00]/30 shadow-[0_0_8px_rgba(0,255,0,0.2)]' : 'hover:bg-[#00ff00]/10 hover:border-[#00ff00]/20'}
                    transition-all duration-150 ease-in-out mb-1 min-h-[50px] sm:min-h-auto
                  `}
                  title={`Play ${song.title}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className={`text-center text-sm sm:text-xs ${currentSong?.id === song.id ? 'text-green-300 animate-pulse' : 'text-green-400/60 group-hover:text-green-300'}`}>
                    {currentSong?.id === song.id && isPlaying ? (
                      <span className="text-sm sm:text-xs">▶</span>
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </div>
                  <div>
                    <div className={`text-base sm:text-sm truncate ${currentSong?.id === song.id ? 'text-green-300' : 'text-green-400 group-hover:text-green-300'}`}>{song.title}</div>
                    <div className={`text-xs sm:text-[10px] truncate ${currentSong?.id === song.id ? 'text-green-400/70' : 'text-green-400/50 group-hover:text-green-400/70'}`}>{song.artist || 'Unknown Artist'}</div>
                  </div>
                  <div className={`text-sm sm:text-xs self-center ${currentSong?.id === song.id ? 'text-green-400/80' : 'text-green-400/60 group-hover:text-green-400/80'}`}>{song.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MatrixMusicPlayer; 