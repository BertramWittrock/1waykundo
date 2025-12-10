import React from 'react';
import MatrixWindow from './MatrixWindow';

const SlimVideoFolder = ({ onClose, videoList, onVideoSelect, currentVideo, ...props }) => {
  return (
    <MatrixWindow
      title="Videos"
      onClose={onClose}
      initialPosition={{ x: 20, y: 50 }}
      className="slim-folder"
      {...props}
    >
      <div className="w-[200px] h-[400px] bg-black p-2 overflow-y-auto">
        <div className="space-y-1">
          {videoList.map((video, index) => (
            <div
              key={index}
              onClick={() => onVideoSelect(video)}
              className={`
                flex items-center space-x-2 p-1.5 cursor-pointer border border-[#00ff00]/20
                ${currentVideo?.url === video.url ? 'bg-[#00ff00]/20' : 'hover:bg-[#00ff00]/10'}
              `}
            >

              <span className="text-[#00ff00] text-sm truncate">{video.title}</span>
              {currentVideo?.url === video.url && (
                <span className="text-[#00ff00] ml-auto">▶</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </MatrixWindow>
  );
};

export default SlimVideoFolder; 