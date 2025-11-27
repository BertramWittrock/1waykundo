import { useState, useRef, useEffect } from "react";

const RetroVideoPlayer = ({ videoData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume / 100;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    videoRef.current.currentTime = percentage * duration;
  };

  return (
    <div className="flex flex-col h-full p-2 bg-[#c3c3c3]">
      {/* Video Player */}
      <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          src={videoData?.url} 
          className="max-w-full max-h-full" 
          onClick={togglePlay}
        />
      </div>

      {/* Controls */}
      <div className="mt-2 p-2 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf]">
        {/* Time and Progress Bar */}
        <div className="flex items-center mb-2">
          <span className="text-xs mr-2">{formatTime(currentTime)}</span>
          <div 
            className="flex-1 h-4 bg-[#ffffff] border border-[#808080] shadow-[inset_1px_1px_#0a0a0a] cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#000080]" 
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }} 
            />
          </div>
          <span className="text-xs ml-2">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none mr-2"
            >
              <span>{isPlaying ? "⏸" : "▶"}</span>
            </button>
            <button 
              onClick={() => { videoRef.current.currentTime = 0; }}
              className="w-8 h-8 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
            >
              <span>⏮</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center">
            <span className="text-xs mr-2">Volume:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-24 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroVideoPlayer; 