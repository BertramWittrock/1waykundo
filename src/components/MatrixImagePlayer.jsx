import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

const MatrixImagePlayer = ({ title, onClose, imageUrl, zIndex, onBringToFront, instanceKey }) => {
  const nodeRef = useRef(null);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

  // Reset dragged state when instanceKey changes (window is re-opened)
  useEffect(() => {
    setHasBeenDragged(false);
  }, [instanceKey]);

  if (!imageUrl) {
    console.error("MatrixImagePlayer: imageUrl is undefined or null.");
    return null;
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
          rounded-lg w-auto max-w-[80vw] h-auto max-h-[80vh] 
          flex flex-col overflow-hidden select-none
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
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm tracking-wide">{title || 'Image Viewer'}</span>
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

        {/* Image Content */}
        <div className="p-2 sm:p-3 flex-grow relative bg-black/50 flex justify-center items-center">
          <img 
            src={imageUrl} 
            alt={title || 'Image content'}
            className="max-w-full max-h-[calc(70vh-80px)] sm:max-h-[calc(80vh-80px)] object-contain rounded-sm shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            onError={(e) => console.error("Image Load Error:", e)}
          />
        </div>

        {/* Status Bar */}
        <div className="bg-[#001100] text-[#00ff00]/70 text-xs p-1 px-2 border-t border-[#00ff00]/20 font-mono">
          <div className="flex justify-between items-center">
            <span>Matrix Image Viewer</span>
            {/* You can add image dimensions or other info here if needed */}
            <span className="animate-pulse">Loaded</span> 
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MatrixImagePlayer; 