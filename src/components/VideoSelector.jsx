import React from 'react';

const VideoSelector = ({ videoList, onVideoSelect, currentVideo, onClose }) => {
  return (
    <div className={`
      fixed z-[60] bg-black/90 border border-[#00ff00]/30 shadow-lg shadow-[#00ff00]/20
      bottom-[6vh] left-4 right-4 sm:bottom-auto sm:right-auto sm:left-14 sm:top-1/2 sm:-translate-y-1/2 
      sm:w-[200px] w-auto max-h-[40vh] sm:max-h-[60vh] flex flex-col
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-2 border-b border-[#00ff00]/30">
        <span className="text-[#00ff00] text-sm sm:text-sm font-mono">SELECT VIDEO</span>
        <button 
          onClick={onClose}
          className="text-[#00ff00] hover:text-[#00ff00]/70 text-lg sm:text-sm min-w-[44px] min-h-[32px] sm:min-w-auto sm:min-h-auto flex items-center justify-center"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          [X]
        </button>
      </div>

      {/* Video List */}
      <div className="overflow-y-auto flex-1 scrollbar-thin">
        {videoList.map((video, index) => (
          <div
            key={index}
            onClick={() => onVideoSelect(video)}
            className={`
              group flex items-center p-3 sm:p-2 cursor-pointer border-b border-[#00ff00]/10
              ${currentVideo?.url === video.url ? 'bg-[#00ff00]/10' : 'hover:bg-[#00ff00]/5'}
              transition-colors duration-150 min-h-[50px] sm:min-h-auto
            `}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Play indicator */}
            <div className="w-6 sm:w-4 text-[#00ff00] opacity-70 flex-shrink-0">
              {currentVideo?.url === video.url ? (
                <span className="animate-pulse text-base sm:text-sm">▶</span>
              ) : (
                <span className="opacity-0 group-hover:opacity-50 text-base sm:text-sm">▶</span>
              )}
            </div>

            {/* Video title */}
            <span className="text-[#00ff00] text-base sm:text-sm font-mono ml-2 truncate flex-1">
              {video.title}
            </span>

            {/* Matrix rain effect on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10">
              <div className="matrix-rain-mini" />
            </div>
          </div>
        ))}
      </div>

      {/* Style for mini matrix rain effect */}
      <style jsx>{`
        .matrix-rain-mini {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            rgba(0,255,0,0.1) 0%,
            rgba(0,255,0,0.05) 50%,
            rgba(0,0,0,0) 100%
          );
          animation: rain 2s linear infinite;
        }

        @keyframes rain {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default VideoSelector; 