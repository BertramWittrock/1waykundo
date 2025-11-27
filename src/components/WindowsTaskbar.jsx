import React from 'react';
import { formatTime, getCoverImage } from '../data/windowsData';
import { FastBackwardIcon, FastForwardIcon, PlayCircleIcon, PauseCircleIcon } from "./MediaPlayerIcons";

const WindowsTaskbar = ({ 
  currentTime, 
  isStartMenuOpen, 
  handleStartClick, 
  handleMenuItemClick,
  currentSong,
  isPlaying,
  audioRef,
  togglePlay,
  previousTrack,
  nextTrack,
  musicFiles,
  openWindow
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60px] md:h-[70px] bg-[#c3c3c3] border-t-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] flex items-center justify-between px-1">
      {/* Start Button */}
      <div className="ml-2 md:ml-4 relative">
        <button 
          id="start-button" 
          onClick={handleStartClick}
          className={`h-[48px] md:h-[57px] px-2 md:pr-4 bg-[#c3c3c3] border-2 border-[#ffffff] ${isStartMenuOpen ? 'shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf]' : 'shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf]'} flex items-center justify-center md:justify-start gap-1 md:gap-2`}
        >
          <img src="/icons/1way.png" alt="Start" className="w-8 h-8 md:w-11 md:h-11 object-contain" />
          <span className="hidden md:inline text-sm md:text-md font-bold">Start</span>
        </button>

        {/* Start Menu */}
        {isStartMenuOpen && (
          <div className="absolute bottom-[56px] md:bottom-[68px] left-0 w-48 md:w-64 bg-[#c3c3c3] border-2 border-[#ffffff] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf]">
            <div 
              onClick={() => handleMenuItemClick('profile')}
              className="px-4 py-3 flex items-center gap-3 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <img src="/profile.png" alt="Profile" className="w-6 h-6" />
              <span className="text-sm">My Profile</span>
            </div>
            <div className="h-[1px] bg-[#808080] shadow-[0_1px_0_#ffffff]" />
            <div 
              onClick={() => handleMenuItemClick('logout')}
              className="px-4 py-3 flex items-center gap-3 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <img src="/logout.png" alt="Logout" className="w-6 h-6" />
              <span className="text-sm">Log Out</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side with music player and system tray */}
      <div className="flex items-center mr-2 md:mr-4">
        {/* System Tray with integrated music player */}
        <div className="h-[32px] md:h-[40px] bg-[#c3c3c3] border-[1px] border-[#808080] shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center">
          {/* Music Player in Taskbar (Desktop) */}
          {currentSong && (
            <div 
              className="hidden md:flex items-center h-full px-3 cursor-pointer border-r border-[#808080] shadow-[1px_0_0_#ffffff]"
              onClick={() => openWindow('music')}
            >
              <div className="w-6 h-6 mr-3 overflow-hidden">
                <img 
                  src={getCoverImage(currentSong?.url, currentSong)} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col mr-3 w-[130px]">
                <div className="scrolling-text">
                  <div className="scrolling-text-content">
                    <span className="text-xs font-bold">{currentSong.title} - {currentSong.artist}</span>
                  </div>
                </div>
                {audioRef.current && (
                  <div className="text-[9px] text-gray-600">
                    {formatTime(audioRef.current.currentTime || 0)} / {currentSong.duration}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); previousTrack(musicFiles); }}
                  className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                >
                  <FastBackwardIcon className="w-4 h-4" stroke="#000000" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                >
                  {isPlaying ? (
                    <PauseCircleIcon className="w-4 h-4" stroke="#000000" />
                  ) : (
                    <PlayCircleIcon className="w-4 h-4" stroke="#000000" />
                  )}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextTrack(musicFiles); }}
                  className="w-7 h-7 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
                >
                  <FastForwardIcon className="w-4 h-4" stroke="#000000" />
                </button>
              </div>
            </div>
          )}

          {/* Music Player for Mobile */}
          {currentSong && (
            <div 
              className="flex md:hidden items-center h-full px-2 cursor-pointer border-r border-[#808080] shadow-[1px_0_0_#ffffff]"
              onClick={() => openWindow('music')}
            >
              <div className="w-5 h-5 mr-2 overflow-hidden">
                <img 
                  src={getCoverImage(currentSong?.url, currentSong)} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col mr-2 w-[80px]">
                <div className="scrolling-text">
                  <div className="scrolling-text-content">
                    <span className="text-sm font-bold">{currentSong.title}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-4 h-4 bg-[#c3c3c3] border-[1px] border-[#808080] rounded-none shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] hover:active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf] flex items-center justify-center focus:outline-none"
              >
                {isPlaying ? (
                  <PauseCircleIcon className="w-3 h-3" stroke="#000000" />
                ) : (
                  <PlayCircleIcon className="w-3 h-3" stroke="#000000" />
                )}
              </button>
            </div>
          )}

          {/* System Icons Desktop */}
          <div className="hidden md:flex items-center gap-4 px-4 border-r border-[#808080] shadow-[1px_0_0_#ffffff]">
            <img 
              src="/wifi.png" 
              alt="WiFi" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Connected to Internet"
            />
            <img 
              src="/volume.png" 
              alt="Volume" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Volume: 75%"
            />
            <img 
              src="/battery.png" 
              alt="Battery" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Battery: 85%"
            />
            <img 
              src="/msn.png" 
              alt="MSN" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="MSN Messenger"
            />
            <img 
              src="/update.png" 
              alt="Updates" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Windows Update Available"
            />
          </div>
          {/* Mobile System Icons */}
          <div className="flex md:hidden items-center gap-2 px-2 border-r border-[#808080] shadow-[1px_0_0_#ffffff]">
            <img 
              src="/wifi.png" 
              alt="WiFi" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Connected to Internet"
            />
            <img 
              src="/volume.png" 
              alt="Volume" 
              className="w-4 h-4 object-contain cursor-pointer hover:opacity-80"
              title="Volume: 75%"
            />
          </div>
          <div className="px-2 md:px-4 text-black text-sm md:text-base">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowsTaskbar; 