import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { PlayCircleIcon, PauseCircleIcon, FastForwardIcon, FastBackwardIcon } from './MediaPlayerIcons';

// Simple utility to format time in seconds to MM:SS
const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Volume and Fullscreen Icons (can be moved to a separate file)
const VolumeHighIcon = ({ className, stroke = 'currentColor' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.89 16.21C19.55 15.28 20 14.18 20 13C20 9.22 17.51 6.08 14 5.25V7.32C16.3 8.08 18 10.33 18 13C18 13.68 17.84 14.32 17.55 14.89L18.89 16.21ZM14 3.23L14 1C10.04 1.83 7 5.06 7 9V17C7 21 3 21 3 21H2C1.45 21 1 20.55 1 20V6C1 5.45 1.45 5 2 5H3V9H5V5H7V3.23C7 3.23 7.34 3 8 3C8.66 3 9 3.23 9 3.23V5H11V3.23C11 3.23 11.34 3 12 3C12.66 3 13 3.23 13 3.23V5.25C13.17 5.27 13.33 5.29 13.5 5.33L14 3.23Z" fill={stroke} />
    <path d="M7 9V17C7 21 3 21 3 21H2C1.45 21 1 20.55 1 20V6C1 5.45 1.45 5 2 5H3V9H5V5H7V9Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9L12 17" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.5 9L9.5 17" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const VolumeMuteIcon = ({ className, stroke = 'currentColor' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 9V17C7 21 3 21 3 21H2C1.45 21 1 20.55 1 20V6C1 5.45 1.45 5 2 5H3V9H5V5H7V9Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 9L12 17" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 9L9.5 17" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 12L21 18M21 12L15 18" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FullscreenEnterIcon = ({ className, stroke = 'currentColor' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9V3H9" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 9V3H15" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15V21H9" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 15V21H15" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FullscreenExitIcon = ({ className, stroke = 'currentColor' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3V9H3" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 3V9H21" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V15H3" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 21V15H21" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const MatrixVideoPlayer = ({ title, onClose, videoUrl, zIndex, onBringToFront, instanceKey }) => {
  const nodeRef = useRef(null);
  const videoRef = useRef(null);

  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay is on
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset dragged state when instanceKey changes (window is re-opened)
  useEffect(() => {
    setHasBeenDragged(false);
    // Reset video state as well if a new video is loaded
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [instanceKey]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const setVideoDuration = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onVolumeChange = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('volumechange', onVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, [videoUrl]); // Rerun if videoUrl changes


  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  // Ensure videoUrl is defined before trying to use it
  if (!videoUrl) {
    console.error("MatrixVideoPlayer: videoUrl is undefined or null.");
    return null; // Or some fallback UI
  }

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

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if(videoRef.current) {
        videoRef.current.volume = newVolume;
        if (newVolume > 0 && isMuted) {
            videoRef.current.muted = false;
        }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if(videoRef.current) {
        videoRef.current.muted = !isMuted;
    }
  };

    const handleFullscreen = (e) => {
        e.stopPropagation();
        const elem = nodeRef.current;
        if (!elem) return;

        if (!isFullscreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    };


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
          rounded-lg w-[95vw] sm:w-[640px] max-w-[640px] h-auto max-h-[90vh] 
          flex flex-col overflow-hidden select-none
          ${!hasBeenDragged ? 'center-window' : ''}
          ${isFullscreen ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none' : ''}
        `}
        style={{ 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 15px rgba(0, 255, 0, 0.1)',
          zIndex: isFullscreen ? 9999 : zIndex
        }}
        onMouseDown={() => {
          if (onBringToFront && !isFullscreen) {
            onBringToFront();
          }
        }}
      >
        {/* Title Bar */}
        <div className="matrix-window-title-bar bg-gradient-to-r from-[#003300] via-[#00ff00]/20 to-[#003300] text-[#00ff00] p-2 flex justify-between items-center cursor-move border-b border-[#00ff00]/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm tracking-wide">{title || 'Video Player'}</span>
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
          >
            ×
          </button>
        </div>

        {/* Video Content */}
        <div className="p-2 sm:p-3 flex-grow relative bg-black/50 flex items-center justify-center">
          <div className="w-full h-full rounded-lg overflow-hidden border border-[#00ff00]/20 shadow-[inset_0_0_10px_rgba(0,255,0,0.1)]">
            <video 
              ref={videoRef}
              src={videoUrl} 
              autoPlay 
              className="w-full h-full object-contain bg-black/90" 
              onClick={togglePlay}
              onError={(e) => console.error("Video Error:", e)}
              style={{
                boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.1)'
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Custom Controls */}
        <div className="bg-[#001a00]/80 text-[#00ff00] p-2 sm:p-3 border-t border-[#00ff00]/30 font-mono text-xs">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
                <span className='w-10'>{formatTime(currentTime)}</span>
                <div 
                    className="w-full h-1.5 bg-[#00ff00]/20 rounded cursor-pointer group"
                    onClick={handleSeek}
                >
                    <div 
                        className="h-full bg-[#00ff00] rounded"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className='w-10 text-right'>{formatTime(duration)}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={togglePlay} className="p-1 hover:bg-[#00ff00]/20 rounded-full">
                        {isPlaying 
                            ? <PauseCircleIcon className="w-6 h-6 sm:w-7 sm:h-7" stroke="#00ff00"/> 
                            : <PlayCircleIcon className="w-6 h-6 sm:w-7 sm:h-7" stroke="#00ff00"/>}
                    </button>
                    
                    <div className="flex items-center space-x-1 group">
                        <button onClick={toggleMute} className="p-1 hover:bg-[#00ff00]/20 rounded-full">
                            {isMuted || volume === 0 
                                ? <VolumeMuteIcon className="w-5 h-5" stroke="#00ff00" />
                                : <VolumeHighIcon className="w-5 h-5" stroke="#00ff00" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-0 group-hover:w-20 h-1.5 bg-[#00ff00]/20 rounded-lg appearance-none cursor-pointer transition-all duration-300
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-[#00ff00] [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <button onClick={handleFullscreen} className="p-1 hover:bg-[#00ff00]/20 rounded-full">
                        {isFullscreen 
                            ? <FullscreenExitIcon className="w-5 h-5" stroke="#00ff00"/>
                            : <FullscreenEnterIcon className="w-5 h-5" stroke="#00ff00"/>}
                    </button>
                </div>
            </div>
        </div>

        {/* Status Bar -- Optional or can be integrated with controls */}
        {/* <div className="bg-[#001100] text-[#00ff00]/70 text-xs p-1 px-2 border-t border-[#00ff00]/20 font-mono">
          <div className="flex justify-between items-center">
            <span>Matrix Media Player</span>
            <span className="animate-pulse">{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        </div> */}
      </div>
    </Draggable>
  );
};

export default MatrixVideoPlayer; 