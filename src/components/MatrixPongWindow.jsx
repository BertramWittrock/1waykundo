import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import PingPong from './PingPong';

const MatrixPongWindow = ({ title, onClose, zIndex, onBringToFront, instanceKey }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const nodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleStart = () => {
    if (onBringToFront) {
      onBringToFront();
    }
  };

  const handleDrag = () => {
    if (!hasBeenDragged) {
      setHasBeenDragged(true);
    }
  };

  // Reset dragged state when instanceKey changes (window is re-opened)
  useEffect(() => {
    setHasBeenDragged(false);
  }, [instanceKey]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Draggable
      handle=".window-handle"
      nodeRef={nodeRef}
      onStart={handleStart}
      onDrag={handleDrag}
    >
      <div 
        ref={nodeRef}
        className={`
          absolute w-[95vw] sm:w-[680px] ${isMobile ? 'h-[75vh]' : 'h-[600px]'} max-w-[680px] bg-black border border-[#00ff00]/70
          shadow-lg shadow-[#00ff00]/20 backdrop-blur-sm rounded-[2px]
          ${!hasBeenDragged ? 'center-window' : ''}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{ zIndex: zIndex }}
        onMouseDown={() => {
          if (onBringToFront) {
            onBringToFront();
          }
        }}
      >
        {/* Window Header */}
        <div className="window-handle flex items-center h-8 sm:h-7 border-b border-[#00ff00]/70 cursor-grab rounded-t-[2px] bg-[#002200]">
          <div className="flex-1 flex items-center">
            <div className="text-[#00ff00] text-sm sm:text-base font-medium pl-2 sm:pl-3">{title}</div>
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
            className="ml-auto h-8 sm:h-7 px-4 sm:px-3 text-[#00ff00] cursor-pointer hover:text-[#00ff00]/70 border-l border-[#00ff00]/70 flex items-center
              appearance-none bg-transparent border-y-0 border-r-0 outline-none rounded-none font-['Courier_Prime']
              focus:outline-none focus:border-[#00ff00]/70 min-w-[44px] justify-center text-sm sm:text-base
              active:bg-[#00ff00]/10 transition-colors duration-150"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            [X]
          </button>
        </div>

        {/* Window Content */}
        <div className="p-2 h-[calc(100%-32px)] sm:h-[calc(100%-28px)] flex items-center justify-center">
          <PingPong />
        </div>

        {/* Window Border Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-[#00ff00]/5 blur-sm rounded-[2px]" />
      </div>
    </Draggable>
  );
};

export default MatrixPongWindow; 