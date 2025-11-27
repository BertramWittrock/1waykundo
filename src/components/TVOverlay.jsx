import React, { useState, useRef, useEffect } from 'react';
import VideoSelector from './VideoSelector';

const TVOverlay = ({ isVisible, onClose, videoList }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // Check for mobile/desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTVClick = () => {
    if (currentVideo) {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.src = video.url;
      videoRef.current.play();
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && videoRef.current) {
      try {
        if (videoRef.current.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
          await videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
          await videoRef.current.mozRequestFullScreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // Add event listeners for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Selector - Mobile at bottom, Desktop at left */}
      <VideoSelector
        videoList={videoList}
        onVideoSelect={handleVideoSelect}
        currentVideo={currentVideo}
        onClose={onClose}
        isFullscreen={isFullscreen}
      />

      {/* TV/Video Display */}
      <div className="flex items-start sm:items-center justify-center h-full pt-8 sm:pt-0 pb-[40vh] sm:pb-0 px-4 sm:px-8">
        <div className="relative w-full h-full max-w-[1200px] max-h-[50vh] sm:max-h-[70vh] overflow-hidden" onClick={handleTVClick}>
          {/* TV Screen Container - acts as clipping mask */}
          <div 
            ref={containerRef}
            className="absolute top-[15%] left-[15%] w-[70%] h-[70%] overflow-hidden bg-black flex justify-center items-center"
            style={{ 
              zIndex: 20 
            }}
          >
            {/* Video Player */}
            <video
              ref={videoRef}
              style={{ 
                width: isMobile ? '100%' : '60%', 
                height: 'auto',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: 'translateY(-13%)',
                display: 'block'
              }}
            />
          </div>
          
          {/* TV Frame Overlay */}
          <img
            src="/icons/home_icons/monitor.gif"
            alt="TV Frame"
            className="absolute inset-0 w-full sm:w-1/2 m-auto h-full object-contain pointer-events-auto"
            style={{ zIndex: 30 }}
          />

          {/* Mobile Fullscreen Button */}
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-[#00ff00] border border-[#00ff00]/50 p-2 rounded-md transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center sm:hidden"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button> */}

          {/* Desktop Fullscreen Button */}
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="hidden sm:block absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-[#00ff00] border border-[#00ff00]/50 p-2 rounded-md transition-colors duration-150"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TVOverlay; 