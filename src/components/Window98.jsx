import { useState, useEffect } from 'react';

export default function Window98({ 
  title, 
  icon, 
  children, 
  onClose, 
  onClick,
  isActive,
  position,
  size = { width: 300, height: 200 },
  onDrag,
  fakeClose = false,
  onFakeClose = null
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position || { x: 50, y: 50 });

  // Update position when prop changes
  useEffect(() => {
    if (position && !isDragging) {
      setCurrentPosition(position);
    }
  }, [position, isDragging]);

  // Add global mouse/touch event listeners when dragging starts
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Calculate new position ensuring window stays within viewport
      const newX = Math.max(0, Math.min(clientX - dragOffset.x, window.innerWidth - (size?.width || 300)));
      const newY = Math.max(0, Math.min(clientY - dragOffset.y, window.innerHeight - (size?.height || 200)));
      
      setCurrentPosition({ x: newX, y: newY });
      if (onDrag) {
        onDrag({ x: newX, y: newY });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    // Add global event listeners for both mouse and touch
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, size, onDrag]);

  const handleStart = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });

    // Prevent default touch behavior to avoid scrolling
    if (e.touches) {
      e.preventDefault();
    }
  };

  const handleClose = () => {
    if (fakeClose && onFakeClose) {
      onFakeClose();
    } else {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] select-none ${isActive ? 'z-50' : 'z-40'}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: size?.width || 300,
        height: size?.height || 200,
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 70px)' // Account for taskbar
      }}
      onClick={onClick}
    >
      {/* Title Bar */}
      <div 
        className={`h-[33px] flex items-center justify-between px-2 cursor-move ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}`}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt="" className="w-4 h-4" />}
          <span className="text-white text-sm font-bold truncate">{title}</span>
        </div>
        <div className="window-controls">
          <button 
            onClick={handleClose}
            id="close-button"
            className="w-[22px] h-[22px] bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center justify-center hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-2 h-[calc(100%-33px)] overflow-auto">
        {children}
      </div>
    </div>
  );
} 