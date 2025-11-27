import { useMedia } from "../context/MediaContext";
import { musicFiles } from "../data/windowsData"; // Import musicFiles
import { FastBackwardIcon, FastForwardIcon, PlayCircleIcon, PauseCircleIcon } from "./MediaPlayerIcons";

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function RetroWalkman() {
  const { 
    currentSong, 
    isPlaying,
    togglePlay,
    previousTrack,
    nextTrack,
    progress, // Percentage 0-100
    currentTime, // Seconds
    duration, // Seconds
    seek // Function to seek to a specific time in seconds
  } = useMedia();

  const handleProgressClick = (event) => {
    if (!duration) return;
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const barWidth = progressBar.clientWidth;
    const seekPercentage = (clickPosition / barWidth);
    seek(duration * seekPercentage);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 right-2 sm:right-8 w-[280px] sm:w-[320px] bg-[#1c1c1c] rounded-lg shadow-2xl border-2 border-[#00ff00]/40 overflow-hidden select-none font-mono">
      {/* Walkman Top Section */}
      <div className="bg-[#111] p-2 sm:p-3 border-b-2 border-[#00ff00]/40">
        <div className="flex items-center justify-between">
          <span className="text-[#00ff00] text-xs sm:text-sm font-bold tracking-wider">1WAY OS</span>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-green-400/40'}`} />
            <span className="text-green-400/70 text-xs">AUDIO</span>
          </div>
        </div>
      </div>

      {/* Display Screen */}
      <div className="bg-black m-2 sm:m-3 p-2 sm:p-3 rounded border-2 border-[#00ff00]/30 shadow-inner shadow-black/50">
        <div className="h-12 sm:h-16 flex flex-col justify-between">
          <div className="text-green-400 text-sm sm:text-base truncate mb-1 sm:mb-2" title={currentSong?.title}>
            {currentSong?.title || 'No Track'}
          </div>
          
          {/* Progress Bar */}
          <div 
            className="w-full h-2 sm:h-2.5 bg-[#00ff00]/10 rounded cursor-pointer group relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-green-400 rounded transition-all duration-100 ease-linear group-hover:bg-green-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-green-400/60 text-xs mt-1 sm:mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="p-2 sm:p-3 grid grid-cols-3 gap-2 sm:gap-3 bg-[#111]/50 border-t-2 border-[#00ff00]/20">
        <button
          onClick={() => previousTrack(musicFiles)} // Pass musicFiles
          title="Previous Track"
          className="flex items-center justify-center h-10 sm:h-12 bg-[#222] rounded-md border border-green-400/30 hover:bg-green-400/10 active:bg-green-400/20 transition-all duration-150 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-md hover:shadow-green-400/10"
        >
          <FastBackwardIcon className="w-6 h-6" stroke="#00ff00" />
        </button>
        <button
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
          className="flex items-center justify-center h-10 sm:h-12 bg-[#222] rounded-md border border-green-400/30 hover:bg-green-400/10 active:bg-green-400/20 transition-all duration-150 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-md hover:shadow-green-400/10"
        >
          {isPlaying ? (
            <PauseCircleIcon className="w-6 h-6" stroke="#00ff00" />
          ) : (
            <PlayCircleIcon className="w-6 h-6" stroke="#00ff00" />
          )}
        </button>
        <button
          onClick={() => nextTrack(musicFiles)} // Pass musicFiles
          title="Next Track"
          className="flex items-center justify-center h-10 sm:h-12 bg-[#222] rounded-md border border-green-400/30 hover:bg-green-400/10 active:bg-green-400/20 transition-all duration-150 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-md hover:shadow-green-400/10"
        >
          <FastForwardIcon className="w-6 h-6" stroke="#00ff00" />
        </button>
      </div>

      {/* Decorative Elements - slightly restyled for consistency */}
      <div className="px-2 sm:px-3 py-1 sm:py-2 bg-[#1c1c1c] border-t-2 border-[#00ff00]/10">
        <div className="flex items-center justify-between">
            <div className="text-green-500/50 text-[9px] sm:text-[10px] tracking-widest">K-TEC M-001</div>
            <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-500/30" />
                <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-500/30" />
            </div>
        </div>
      </div>
    </div>
  );
} 